import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import { logger } from '@/lib/logger';
import { sanitizeSlug, sanitizeSpelling } from '@/utils/spelling.util';

interface RawClientProperty {
  id: number;
  property_id: string;
  title: string;
  description: string;
  slug: string;
  url: string;
  image: string;
  rera_number?: string;
  purpose?: { name: string };
  category?: { name: string };
  property_type?: { name: string };
  location?: {
    city?: { name: string };
    locality?: { name: string; slug: string };
    state?: { name: string };
    landmark?: string;
  };
  pricing?: {
    total_asking_price?: string;
    price_per_unit?: string;
    total_area?: string;
  };
}

/**
 * Recursive extractor to collect all property objects from nested API tree
 */
function extractProperties(obj: any): RawClientProperty[] {
  let list: RawClientProperty[] = [];
  if (!obj || typeof obj !== 'object') return list;

  if (Array.isArray(obj.all_properties)) {
    list.push(...obj.all_properties);
  }

  for (const key of Object.keys(obj)) {
    if (key !== 'all_properties' && typeof obj[key] === 'object' && obj[key] !== null) {
      list.push(...extractProperties(obj[key]));
    }
  }

  return list;
}

export async function GET() {
  return POST();
}

export async function POST() {
  try {
    const clientApiUrl = 'https://admin.propertysdeal.in/api/v1/accounts/landing-page-data/';
    logger.info(`Fetching live client properties from: ${clientApiUrl}`);

    const res = await fetch(clientApiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!res.ok) {
      return NextResponse.json({ error: `Failed to fetch client API: ${res.statusText}` }, { status: 502 });
    }

    const data = await res.json();
    if (!data || !data.properties) {
      return NextResponse.json({ error: 'Invalid API response format' }, { status: 400 });
    }

    const properties = extractProperties(data.properties);
    logger.info(`Extracted ${properties.length} live properties from client API`);

    const dbClient = await pool.connect();
    let syncedCount = 0;

    try {
      for (const p of properties) {
        if (!p.slug || !p.title) continue;

        // Apply Spelling Normalizer to Slugs and Titles
        const cleanSlug = sanitizeSlug(p.slug);
        const cleanTitle = sanitizeSpelling(p.title);
        const cityObj = p.location?.city?.name || 'Gujarat';
        const localityObj = p.location?.locality?.name || '';

        // 1. Upsert into blogs/landing pages table
        const blogSql = `
          INSERT INTO blogs (slug, title, content, meta_title, meta_description, updated_at)
          VALUES ($1, $2, $3, $4, $5, NOW())
          ON CONFLICT (slug) 
          DO UPDATE SET 
            title = EXCLUDED.title,
            content = EXCLUDED.content,
            meta_title = EXCLUDED.meta_title,
            meta_description = EXCLUDED.meta_description,
            updated_at = NOW()
        `;

        const metaTitle = `${cleanTitle} in ${localityObj ? localityObj + ', ' : ''}${cityObj}`;
        const metaDesc = p.description
          ? sanitizeSpelling(p.description.substring(0, 155).replace(/\n/g, ' '))
          : `Explore ${cleanTitle} in ${cityObj}. Verified real estate property on Propertysdeal.`;

        await dbClient.query(blogSql, [
          cleanSlug,
          cleanTitle,
          sanitizeSpelling(p.description || cleanTitle),
          metaTitle,
          metaDesc,
        ]);

        syncedCount++;
      }
    } finally {
      dbClient.release();
    }

    // 2. Automatically trigger Search Engine Ping for instant Google indexing
    let pingStatus = 'Pinging Google & Bing...';
    try {
      const pingRes = await fetch('http://localhost:3000/api/seo/ping', { method: 'POST' });
      if (pingRes.ok) pingStatus = 'Search Engines Pinged Successfully!';
    } catch (e) {
      pingStatus = 'Ping initiated';
    }

    return NextResponse.json({
      message: 'Client properties synced successfully',
      total_extracted: properties.length,
      synced_to_seo_engine: syncedCount,
      indexing_status: pingStatus,
      sitemap_url: 'https://propertysdeal.in/sitemap.xml',
      timestamp: new Date().toISOString(),
    }, { status: 200 });

  } catch (error) {
    logger.error('Error syncing client properties', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
