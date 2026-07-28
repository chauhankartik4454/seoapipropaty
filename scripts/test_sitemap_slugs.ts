import { Pool } from 'pg';
import 'dotenv/config';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function main() {
  const targetSlugs = [
    'property-in-gujarat',
    'real-estate-gujarat',
    'flats-for-sale-in-ahmedabad',
    'property-for-sale-in-ahmedabad',
    '2bhk-flat-ahmedabad',
    '3bhk-flat-surat',
    'plot-for-sale-vadodara',
    'property-dealer-gujarat',
    'buy-property-gujarat',
    'ahmedabad-real-estate',
    'flat-for-sale-in-sg-highway',
    '2bhk-bopal-ahmedabad',
    'property-in-prahlad-nagar',
    'flat-for-sale-in-satellite-ahmedabad',
    'plot-for-sale-in-thaltej',
    'flat-for-sale-in-vesu',
    '2bhk-flat-adajan-surat',
    '2bhk-pal-surat',
    'plot-for-sale-in-althan',
    'flat-for-sale-in-alkapuri',
    'property-in-gotri-vadodara',
    '2bhk-manjalpur',
    'property-in-kalawad-road-rajkot',
    'flat-gift-city-gandhinagar',
    'property-in-vallabh-vidyanagar',
    '2bhk-flat-under-50-lakh-ahmedabad',
    'ready-to-move-flats-surat',
    'new-projects-in-bopal',
    'affordable-flats-ahmedabad',
    'residential-plot-for-sale-gujarat',
    'villa-for-sale-vadodara',
    'rental-flats-vesu-surat',
    'office-space-for-rent-ahmedabad',
    'shop-for-sale-surat',
    'gidc-shed-for-sale',
    'agricultural-land-for-sale-gujarat',
    'na-plot-gujarat',
    'industrial-land-gujarat',
    'how-to-buy-property-in-gujarat',
    'stamp-duty-in-gujarat',
    'rera-registered-properties-gujarat',
    'best-areas-to-buy-flat-in-ahmedabad',
    'property-rates-in-bopal-2026',
    'how-to-verify-property-in-gujarat'
  ];

  const res = await pool.query(
    `SELECT slug FROM (
       SELECT slug FROM blogs WHERE slug IS NOT NULL AND slug != ''
       UNION
       SELECT slug FROM keywords WHERE slug IS NOT NULL AND slug != '' AND is_active = TRUE
     ) combined`
  );

  const availableSlugs = new Set(res.rows.map((r: any) => r.slug));
  const missing = targetSlugs.filter((s) => !availableSlugs.has(s));

  console.log(`TOTAL TARGET SLUGS CHECKED: ${targetSlugs.length}`);
  console.log(`AVAILABLE IN SITEMAP QUERY: ${availableSlugs.size}`);
  console.log(`MISSING SLUGS: ${missing.length}`);
  if (missing.length > 0) {
    console.log('MISSING SLUGS LIST:', missing);
  } else {
    console.log('🎉 SUCCESS! ALL 44 TARGET SLUGS WILL NOW BE PRESENT IN THE SITEMAP XML!');
  }

  await pool.end();
}

main();
