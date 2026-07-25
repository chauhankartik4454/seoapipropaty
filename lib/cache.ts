import Redis from 'ioredis';
import { logger } from './logger';

interface ICache {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttlSeconds: number): Promise<void>;
  delete(key: string): Promise<void>;
}

class MemoryCache implements ICache {
  private cache = new Map<string, { value: any; expiresAt: number }>();

  async get<T>(key: string): Promise<T | null> {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return item.value as T;
  }

  async set<T>(key: string, value: T, ttlSeconds: number): Promise<void> {
    this.cache.set(key, {
      value,
      expiresAt: Date.now() + ttlSeconds * 1000,
    });
  }

  async delete(key: string): Promise<void> {
    this.cache.delete(key);
  }
}

class RedisCache implements ICache {
  private client: Redis;

  constructor(redisUrl: string) {
    this.client = new Redis(redisUrl, {
      maxRetriesPerRequest: 1,
      retryStrategy(times) {
        if (times > 3) {
          logger.warn('Redis reconnection failed. Disabling Redis cache client.');
          return null; // Stop retrying, fallback to memory or handle error
        }
        return Math.min(times * 100, 1000);
      },
    });

    this.client.on('error', (err) => {
      logger.error('Redis client error', err);
    });

    this.client.on('connect', () => {
      logger.info('Successfully connected to Redis cache');
    });
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const data = await this.client.get(key);
      if (!data) return null;
      return JSON.parse(data) as T;
    } catch (err) {
      logger.error(`Error reading from Redis key: ${key}`, err);
      return null;
    }
  }

  async set<T>(key: string, value: T, ttlSeconds: number): Promise<void> {
    try {
      const serialized = JSON.stringify(value);
      await this.client.setex(key, ttlSeconds, serialized);
    } catch (err) {
      logger.error(`Error setting Redis key: ${key}`, err);
    }
  }

  async delete(key: string): Promise<void> {
    try {
      await this.client.del(key);
    } catch (err) {
      logger.error(`Error deleting Redis key: ${key}`, err);
    }
  }
}

// Reset cache instance on hot-reload to flush local maps
let cacheInstance: ICache;

const redisUrl = process.env.REDIS_URL;
if (redisUrl) {
  try {
    logger.info('Initializing Redis cache...');
    cacheInstance = new RedisCache(redisUrl);
  } catch (err) {
    logger.warn('Failed to initialize Redis cache, falling back to In-Memory cache', { error: err });
    cacheInstance = new MemoryCache();
  }
} else {
  logger.info('No REDIS_URL configured, utilizing In-Memory cache');
  cacheInstance = new MemoryCache();
}

export const cache = cacheInstance;
export default cache;
