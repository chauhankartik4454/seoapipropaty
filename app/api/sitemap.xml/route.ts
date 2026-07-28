import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const client = await pool.connect();
    
    // Query ALL distinct active slugs from both blogs AND keywords tables
    const allSlugsRes = await client.query(
      `SELECT slug, MAX(updated_at) as updated_at FROM (
         SELECT slug, updated_at FROM blogs WHERE slug IS NOT NULL AND slug != ''
         UNION ALL
         SELECT slug, updated_at FROM keywords WHERE slug IS NOT NULL AND slug != '' AND is_active = TRUE
       ) combined
       GROUP BY slug
       ORDER BY slug ASC`
    );
    client.release();

    const baseUrl = 'https://propertysdeal.in/property-seo';

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://propertysdeal.in</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  ${allSlugsRes.rows
    .map(
      (row) => `
  <url>
    <loc>${baseUrl}/${row.slug}/</loc>
    <lastmod>${new Date(row.updated_at || Date.now()).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`
    )
    .join('')}
</urlset>`;

    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'text/xml; charset=utf-8',
        'Cache-Control': 'no-cache, no-store, max-age=0, must-revalidate'
      }
    });
  } catch (error) {
    console.error('Error generating sitemap XML:', error);
    return new NextResponse('Error generating sitemap', { status: 500 });
  }
}
