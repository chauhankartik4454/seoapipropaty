import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

export async function GET() {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT slug, updated_at FROM blogs ORDER BY updated_at DESC');
    client.release();

    const baseUrl = 'https://propertysdeal.in/property-seo';

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${result.rows
    .map(
      (row) => `
  <url>
    <loc>${baseUrl}/${row.slug}</loc>
    <lastmod>${new Date(row.updated_at || Date.now()).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
    )
    .join('')}
</urlset>`;

    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'text/xml; charset=utf-8',
        'Cache-Control': 's-maxage=3600, stale-while-revalidate'
      }
    });
  } catch (error) {
    console.error('Error generating sitemap XML:', error);
    return new NextResponse('Error generating sitemap', { status: 500 });
  }
}
