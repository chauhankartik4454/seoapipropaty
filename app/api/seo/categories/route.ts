import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import { logger } from '@/lib/logger';

export interface CategoryLocalityChild {
  name: string;
  slug: string;
  url: string;
}

export interface CategoryCityItem {
  type: string;
  name: string;
  slug: string;
  url: string;
  pages_count: number;
  children: CategoryLocalityChild[];
}

export async function GET() {
  try {
    const client = await pool.connect();

    try {
      // 1. Fetch cities and localities with counts
      const cityQuery = `
        SELECT 
          c.id as city_id, 
          c.name as city_name, 
          c.slug as city_slug,
          l.name as locality_name,
          l.slug as locality_slug,
          (
            SELECT COUNT(*) FROM keywords k 
            WHERE k.city_id = c.id AND k.is_active = TRUE
          ) as keyword_count
        FROM cities c
        LEFT JOIN localities l ON l.city_id = c.id
        ORDER BY c.name ASC, l.name ASC
      `;

      const res = await client.query(cityQuery);

      const cityMap = new Map<number, CategoryCityItem>();

      for (const row of res.rows) {
        if (!cityMap.has(row.city_id)) {
          cityMap.set(row.city_id, {
            type: 'city',
            name: row.city_name,
            slug: `property-in-${row.city_slug}`,
            url: `https://propertysdeal.in/property-in-${row.city_slug}`,
            pages_count: parseInt(row.keyword_count || '0', 10),
            children: [],
          });
        }

        if (row.locality_name) {
          const cityItem = cityMap.get(row.city_id)!;
          cityItem.children.push({
            name: row.locality_name,
            slug: `property-in-${row.locality_slug}`,
            url: `https://propertysdeal.in/property-in-${row.locality_slug}`,
          });
        }
      }

      const categories = Array.from(cityMap.values());

      // 2. Fetch Blog Category summary count
      const blogCountRes = await client.query("SELECT COUNT(*) FROM blogs WHERE slug IS NOT NULL AND slug != ''");
      const blogCount = parseInt(blogCountRes.rows[0].count || '0', 10);

      return NextResponse.json({
        state: 'Gujarat',
        total_cities: categories.length,
        total_blogs: blogCount,
        categories,
        timestamp: new Date().toISOString(),
      }, {
        status: 200,
        headers: {
          'Cache-Control': 'public, max-age=3600, s-maxage=3600',
        },
      });

    } finally {
      client.release();
    }
  } catch (error) {
    logger.error('Error fetching Category Indexing API', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
