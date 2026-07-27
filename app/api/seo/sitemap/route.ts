import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');

    // Dynamic Domain Resolution for Native Client Integration (propertysdeal.in)
    const customDomain = searchParams.get('domain') || req.headers.get('x-client-domain');
    const forwardedHost = req.headers.get('x-forwarded-host');
    const host = req.headers.get('host') || 'propertysdeal.in';

    let domain = 'https://propertysdeal.in';
    if (customDomain) {
      domain = customDomain.replace(/\/$/, '');
    } else if (process.env.NEXT_PUBLIC_SITE_URL) {
      domain = process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '');
    } else if (forwardedHost) {
      const proto = forwardedHost.includes('localhost') ? 'http' : 'https';
      domain = `${proto}://${forwardedHost}`;
    } else if (host.includes('localhost')) {
      domain = 'http://localhost:8000'; // Default local Django testing domain
    }

    // 1. If sitemap index is requested, return <sitemapindex> root XML
    if (type === 'index') {
      const indexXml = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${domain}/sitemap.xml?type=properties</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${domain}/sitemap.xml?type=categories</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>
</sitemapindex>`;

      return new NextResponse(indexXml, {
        status: 200,
        headers: {
          'Content-Type': 'application/xml',
          'Cache-Control': 'public, max-age=3600, s-maxage=3600',
        },
      });
    }

    const client = await pool.connect();
    let urls: { slug: string; priority: string; lastmod: string }[] = [];

    try {
      if (type === 'categories') {
        const categoryRes = await client.query(
          `SELECT DISTINCT ON (LOWER(phrase)) phrase, slug, updated_at 
           FROM keywords 
           WHERE slug IS NOT NULL AND slug != '' AND category != 'BLOG' AND is_active = TRUE 
           ORDER BY LOWER(phrase), LENGTH(slug) DESC, updated_at DESC`
        );

        for (const row of categoryRes.rows) {
          urls.push({
            slug: row.slug,
            priority: '0.8',
            lastmod: row.updated_at ? new Date(row.updated_at).toISOString() : new Date().toISOString(),
          });
        }
      } else {
        const blogRes = await client.query(
          `SELECT DISTINCT ON (title) title, slug, updated_at 
           FROM blogs 
           WHERE slug IS NOT NULL AND slug != '' 
           ORDER BY title, LENGTH(slug) DESC, updated_at DESC`
        );

        for (const row of blogRes.rows) {
          urls.push({
            slug: row.slug,
            priority: '0.9',
            lastmod: row.updated_at ? new Date(row.updated_at).toISOString() : new Date().toISOString(),
          });
        }
      }
    } finally {
      client.release();
    }

    const xmlUrls = urls
      .map(
        (u) => `  <url>
    <loc>${domain}/property/${u.slug}/</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${u.priority}</priority>
  </url>`
      )
      .join('\n');

    const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${domain}</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
${xmlUrls}
</urlset>`;

    return new NextResponse(xmlContent, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  } catch (error) {
    logger.error('Error generating sitemap XML', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
