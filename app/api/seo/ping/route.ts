import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

export async function POST(request: NextRequest) {
  try {
    const sitemapUrl = 'https://propertysdeal.in/sitemap.xml';
    
    // 1. Google Sitemap Ping URL
    const googlePingUrl = `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`;
    
    // 2. Bing / IndexNow Ping
    const bingPingUrl = `https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`;

    logger.info(`Pinging search engines with sitemap: ${sitemapUrl}`);

    const results: Record<string, string> = {};

    try {
      const gRes = await fetch(googlePingUrl, { method: 'GET' });
      results.google = `Status ${gRes.status}`;
    } catch (e) {
      results.google = 'Failed to ping Google';
    }

    try {
      const bRes = await fetch(bingPingUrl, { method: 'GET' });
      results.bing = `Status ${bRes.status}`;
    } catch (e) {
      results.bing = 'Failed to ping Bing';
    }

    return NextResponse.json({
      message: 'Search engines pinged successfully',
      sitemap: sitemapUrl,
      results,
      timestamp: new Date().toISOString(),
    }, { status: 200 });

  } catch (error) {
    logger.error('Error pinging search engines', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  return POST(request);
}
