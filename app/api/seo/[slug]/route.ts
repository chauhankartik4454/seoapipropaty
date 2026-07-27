import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { LocationRepository } from '@/repositories/location.repository';
import { KeywordRepository } from '@/repositories/keyword.repository';
import { TemplateRepository } from '@/repositories/template.repository';
import { SlugService } from '@/services/slug.service';
import { KeywordService } from '@/services/keyword.service';
import { TemplateService } from '@/services/template.service';
import { FaqService } from '@/services/faq.service';
import { SchemaService } from '@/services/schema.service';
import { SeoService } from '@/services/seo.service';
import { cache } from '@/lib/cache';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';

// 1. Dependency Injection setup (singletons for the route module scope)
const locationRepo = new LocationRepository();
const keywordRepo = new KeywordRepository();
const templateRepo = new TemplateRepository();

const slugService = new SlugService(locationRepo, keywordRepo);
const keywordService = new KeywordService(keywordRepo);
const templateService = new TemplateService(templateRepo);
const faqService = new FaqService();
const schemaService = new SchemaService(templateRepo);

const seoService = new SeoService(
  slugService,
  keywordService,
  templateService,
  faqService,
  schemaService,
  keywordRepo
);

// Zod validation for slugs to protect against directory traversal, XSS, and arbitrary characters
const slugSchema = z
  .string()
  .min(1)
  .max(150)
  .regex(/^[a-z0-9-]+$/, 'Slug must only contain lowercase alphanumeric characters and hyphens');

/**
 * Rate Limiter checking IP address using our Cache provider.
 */
async function isRateLimited(ip: string): Promise<boolean> {
  try {
    const windowMs = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000', 10);
    const maxRequests = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10);
    const limitKey = `ratelimit:${ip}`;

    const currentCount = await cache.get<number>(limitKey) || 0;

    if (currentCount >= maxRequests) {
      return true;
    }

    await cache.set(limitKey, currentCount + 1, Math.ceil(windowMs / 1000));
    return false;
  } catch (err) {
    logger.warn('Rate limiter check error, bypassing rate limit', err);
    return false;
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  // Get client IP for rate limiting
  const ip = request.headers.get('x-forwarded-for') || request.ip || '127.0.0.1';

  try {
    // 2. Enforce Rate Limiting
    const rateLimited = await isRateLimited(ip);
    if (rateLimited) {
      logger.warn(`Rate limit exceeded for IP: ${ip}`);
      return NextResponse.json(
        { error: 'Too Many Requests' },
        { 
          status: 429,
          headers: {
            'Retry-After': '60',
          }
        }
      );
    }

    // 3. Await Next.js 15 parameters
    const { slug } = await params;
    console.log("!!! NEXTJS GET EXECUTED FOR SLUG:", slug);

    // 4. Validate Slug Input
    const validationResult = slugSchema.safeParse(slug);
    if (!validationResult.success) {
      logger.warn(`Invalid slug structure received: ${slug}`, { errors: validationResult.error.errors });
      return NextResponse.json(
        { error: 'Not Found', message: 'Invalid slug pattern' },
        { status: 404 }
      );
    }

    const validatedSlug = validationResult.data;

    // 5. Fetch SEO Data from Service Layer
    const seoData = await seoService.getSeoData(validatedSlug);
    if (!seoData) {
      logger.warn(`SEO data not found or validation failed for slug: ${validatedSlug}`);
      return NextResponse.json(
        { error: 'Not Found', message: 'The requested landing page is not configured' },
        { status: 404 }
      );
    }

    // 6. Return standard JSON response
    return NextResponse.json(seoData, {
      status: 200,
      headers: {
        'Cache-Control': 'public, max-age=21600, s-maxage=21600, stale-while-revalidate=59',
      },
    });
  } catch (error) {
    logger.error(`Unhandled exception in GET /api/seo/${ip}`, error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
