import { Pool } from 'pg';
import 'dotenv/config';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function main() {
  const categories = [
    {
      category: '🎯 High Priority Keywords (Homepage/Main Pages)',
      keywords: [
        'property in Gujarat',
        'real estate Gujarat',
        'flats for sale in Ahmedabad',
        'property for sale in Ahmedabad',
        '2BHK flat Ahmedabad',
        '3BHK flat Surat',
        'plot for sale Vadodara',
        'property dealer Gujarat',
        'buy property Gujarat',
        'Ahmedabad real estate'
      ]
    },
    {
      category: '🏙️ City + Property Type Combos (Ahmedabad)',
      keywords: [
        'flat for sale in SG Highway',
        '2BHK Bopal Ahmedabad',
        'property in Prahlad Nagar',
        'flat for sale in Satellite Ahmedabad',
        'plot for sale in Thaltej'
      ]
    },
    {
      category: '🏙️ City + Property Type Combos (Surat)',
      keywords: [
        'flat for sale in Vesu',
        'property in Adajan Surat',
        '2BHK Pal Surat',
        'plot for sale in Althan'
      ]
    },
    {
      category: '🏙️ City + Property Type Combos (Vadodara)',
      keywords: [
        'flat for sale in Alkapuri',
        'property in Gotri Vadodara',
        '2BHK Manjalpur'
      ]
    },
    {
      category: '🏙️ City + Property Type Combos (Rajkot / Gandhinagar / Anand)',
      keywords: [
        'property in Kalawad Road Rajkot',
        'flat GIFT City Gandhinagar',
        'property in Vallabh Vidyanagar'
      ]
    },
    {
      category: '💰 Long-Tail Keywords',
      keywords: [
        '2BHK flat under 50 lakh Ahmedabad',
        'ready to move flats Surat',
        'new projects in Bopal',
        'affordable flats Ahmedabad',
        'residential plot for sale Gujarat',
        'villa for sale Vadodara',
        'rental flats Vesu Surat'
      ]
    },
    {
      category: '🏢 Commercial/Agricultural/Industrial',
      keywords: [
        'office space for rent Ahmedabad',
        'shop for sale Surat',
        'GIDC shed for sale',
        'agricultural land for sale Gujarat',
        'NA plot Gujarat',
        'industrial land Gujarat'
      ]
    },
    {
      category: '❓ Question-Based Keywords (Blog/FAQ Content)',
      keywords: [
        'how to buy property in Gujarat',
        'stamp duty in Gujarat',
        'RERA registered properties Gujarat',
        'best areas to buy flat in Ahmedabad',
        'property rates in Bopal 2026',
        'how to verify property in Gujarat'
      ]
    }
  ];

  console.log('Category\tKeyword\tWebsite Live URL\tAPI Live Endpoint');

  for (const cat of categories) {
    for (const kw of cat.keywords) {
      const res = await pool.query(
        'SELECT slug FROM keywords WHERE LOWER(phrase) = LOWER($1) OR slug ILIKE $2 LIMIT 1',
        [kw, '%' + kw.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '%']
      );
      let slug = res.rows[0]?.slug;
      if (!slug) {
        slug = kw.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      }
      console.log(`${cat.category}\t${kw}\thttps://propertysdeal.in/property-seo/${slug}\thttps://seoapipropaty.vercel.app/api/seo/${slug}`);
    }
  }

  await pool.end();
}

main();
