import { Pool } from 'pg';
import 'dotenv/config';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('DATABASE_URL environment variable is missing.');
  process.exit(1);
}

const pool = new Pool({ connectionString });

async function main() {
  console.log('Inserting additional requested keywords and blogs...');
  const client = await pool.connect();

  try {
    // 1. Fetch cities, localities, and property types maps for lookups
    const citiesRes = await client.query('SELECT id, slug FROM cities');
    const citiesMap = Object.fromEntries(citiesRes.rows.map((r) => [r.slug, r.id]));

    const localitiesRes = await client.query('SELECT id, slug FROM localities');
    const localitiesMap = Object.fromEntries(localitiesRes.rows.map((r) => [r.slug, r.id]));

    const propTypesRes = await client.query('SELECT id, slug FROM property_types');
    const propTypesMap = Object.fromEntries(propTypesRes.rows.map((r) => [r.slug, r.id]));

    // 2. Add Blogs
    const blogs = [
      {
        title: 'How to Buy Property in Gujarat - Step by Step',
        slug: 'how-to-buy-property-in-gujarat',
        content: 'Comprehensive guide covering verification procedures, land mapping, stamp duty rates, and sub-registrar registration process in Gujarat.',
        meta_title: 'How to Buy Property in Gujarat | Complete Guide',
        meta_desc: 'Detailed step-by-step documentation for NRI and domestic buyers to purchase residential or commercial properties in Gujarat.',
      },
      {
        title: 'Stamp Duty and Registration Fees in Gujarat',
        slug: 'stamp-duty-in-gujarat',
        content: 'Stamp duty rates in Gujarat are calculated on market rates. Know current registration fees for men, women, and corporate buyers.',
        meta_title: 'Stamp Duty and Registration Fees in Gujarat (Current Rates)',
        meta_desc: 'Guide to calculate stamp duty, registration charges, and doc verification fees in Gujarat.',
      },
      {
        title: 'How to Find RERA Registered Properties in Gujarat',
        slug: 'rera-registered-properties-gujarat',
        content: 'RERA registration number is mandatory for developers. Check real-time project progress, builder details, and legal compliance on GUJRERA portal.',
        meta_title: 'RERA Registered Properties in Gujarat | Checker Guide',
        meta_desc: 'Check builder compliance, GUJRERA portal search steps, and verification procedures for RERA-registered flats in Gujarat.',
      },
      {
        title: 'Best Areas to Buy Flat in Ahmedabad',
        slug: 'best-areas-to-buy-flat-in-ahmedabad',
        content: 'SG Highway, Prahlad Nagar, Bopal, Thaltej, and Satellite are among the top-rated residential zones to buy properties in Ahmedabad.',
        meta_title: 'Best Areas to Buy Flat in Ahmedabad | Locality Guide',
        meta_desc: 'Top 5 localities in Ahmedabad to invest in flats, villas, and plots. Compare rates, connectivity, and rental yields.',
      },
      {
        title: 'How to Verify Property Documents in Gujarat',
        slug: 'how-to-verify-property-in-gujarat',
        content: 'Verification checklist includes checking title clear certificate, NA layout permission, building construction blueprints, and RERA approvals.',
        meta_title: 'How to Verify Property in Gujarat | Document Checklist',
        meta_desc: 'Complete legal property verification checklist for buyers in Gujarat. Learn how to verify titles and NA clearance.',
      },
    ];

    for (const b of blogs) {
      await client.query(
        `INSERT INTO blogs (title, slug, content, meta_title, meta_description) 
         VALUES ($1, $2, $3, $4, $5) 
         ON CONFLICT (slug) DO UPDATE 
         SET title = EXCLUDED.title, content = EXCLUDED.content, meta_title = EXCLUDED.meta_title, meta_description = EXCLUDED.meta_description`,
        [b.title, b.slug, b.content, b.meta_title, b.meta_desc]
      );
    }

    // 3. Add Keywords
    const keywords = [
      // High Priority
      { phrase: 'Flats for sale in Ahmedabad', slug: 'flats-for-sale-in-ahmedabad', category: 'PROPERTY_TYPE', citySlug: 'ahmedabad', localitySlug: null, propTypeSlug: 'flat' },
      { phrase: 'Property for sale in Ahmedabad', slug: 'property-for-sale-in-ahmedabad', category: 'CITY_PAGE', citySlug: 'ahmedabad', localitySlug: null, propTypeSlug: null },
      { phrase: '2BHK flat Ahmedabad', slug: '2bhk-flat-ahmedabad', category: 'LONG_TAIL', citySlug: 'ahmedabad', localitySlug: null, propTypeSlug: 'flat' },
      { phrase: '3BHK flat Surat', slug: '3bhk-flat-surat', category: 'LONG_TAIL', citySlug: 'surat', localitySlug: null, propTypeSlug: 'flat' },
      { phrase: 'Plot for sale Vadodara', slug: 'plot-for-sale-vadodara', category: 'PROPERTY_TYPE', citySlug: 'vadodara', localitySlug: null, propTypeSlug: 'plot' },
      { phrase: 'Property dealer Gujarat', slug: 'property-dealer-gujarat', category: 'HOMEPAGE', citySlug: null, localitySlug: null, propTypeSlug: null },
      { phrase: 'Buy property Gujarat', slug: 'buy-property-gujarat', category: 'HOMEPAGE', citySlug: null, localitySlug: null, propTypeSlug: null },
      { phrase: 'Ahmedabad real estate', slug: 'ahmedabad-real-estate', category: 'CITY_PAGE', citySlug: 'ahmedabad', localitySlug: null, propTypeSlug: null },

      // City + Property Type Combos
      { phrase: '2BHK Bopal Ahmedabad', slug: '2bhk-bopal-ahmedabad', category: 'LONG_TAIL', citySlug: 'ahmedabad', localitySlug: 'bopal', propTypeSlug: 'flat' },
      { phrase: 'Property in Prahlad Nagar', slug: 'property-in-prahlad-nagar', category: 'LOCALITY_PAGE', citySlug: 'ahmedabad', localitySlug: 'prahlad-nagar', propTypeSlug: null },
      { phrase: 'Flat for sale in Satellite Ahmedabad', slug: 'flat-for-sale-in-satellite-ahmedabad', category: 'LOCALITY_PAGE', citySlug: 'ahmedabad', localitySlug: 'satellite', propTypeSlug: 'flat' },
      { phrase: 'Plot for sale in Thaltej', slug: 'plot-for-sale-in-thaltej', category: 'LOCALITY_PAGE', citySlug: 'ahmedabad', localitySlug: 'thaltej', propTypeSlug: 'plot' },
      { phrase: 'Property in Adajan Surat', slug: 'property-in-adajan-surat', category: 'LOCALITY_PAGE', citySlug: 'surat', localitySlug: 'adajan', propTypeSlug: null },
      { phrase: '2BHK Pal Surat', slug: '2bhk-pal-surat', category: 'LONG_TAIL', citySlug: 'surat', localitySlug: 'pal', propTypeSlug: 'flat' },
      { phrase: 'Plot for sale in Althan', slug: 'plot-for-sale-in-althan', category: 'LOCALITY_PAGE', citySlug: 'surat', localitySlug: 'althan', propTypeSlug: 'plot' },
      { phrase: 'Flat for sale in Alkapuri', slug: 'flat-for-sale-in-alkapuri', category: 'LOCALITY_PAGE', citySlug: 'vadodara', localitySlug: 'alkapuri', propTypeSlug: 'flat' },
      { phrase: 'Property in Gotri Vadodara', slug: 'property-in-gotri-vadodara', category: 'LOCALITY_PAGE', citySlug: 'vadodara', localitySlug: 'gotri', propTypeSlug: null },
      { phrase: '2BHK Manjalpur', slug: '2bhk-manjalpur', category: 'LONG_TAIL', citySlug: 'vadodara', localitySlug: 'manjalpur', propTypeSlug: 'flat' },
      { phrase: 'Property in Kalawad Road Rajkot', slug: 'property-in-kalawad-road-rajkot', category: 'LOCALITY_PAGE', citySlug: 'rajkot', localitySlug: 'kalawad-road', propTypeSlug: null },
      { phrase: 'Flat GIFT City Gandhinagar', slug: 'flat-gift-city-gandhinagar', category: 'LOCALITY_PAGE', citySlug: 'gandhinagar', localitySlug: 'gift-city', propTypeSlug: 'flat' },
      { phrase: 'Property in Vallabh Vidyanagar', slug: 'property-in-vallabh-vidyanagar', category: 'LOCALITY_PAGE', citySlug: 'anand', localitySlug: 'vallabh-vidyanagar', propTypeSlug: null },

      // Long Tail
      { phrase: 'Ready to move flats Surat', slug: 'ready-to-move-flats-surat', category: 'PROPERTY_TYPE', citySlug: 'surat', localitySlug: null, propTypeSlug: 'flat' },
      { phrase: 'New projects in Bopal', slug: 'new-projects-in-bopal', category: 'LOCALITY_PAGE', citySlug: 'ahmedabad', localitySlug: 'bopal', propTypeSlug: null },
      { phrase: 'Affordable flats Ahmedabad', slug: 'affordable-flats-ahmedabad', category: 'PROPERTY_TYPE', citySlug: 'ahmedabad', localitySlug: null, propTypeSlug: 'flat' },
      { phrase: 'Residential plot for sale Gujarat', slug: 'residential-plot-for-sale-gujarat', category: 'PROPERTY_TYPE', citySlug: null, localitySlug: null, propTypeSlug: 'plot' },
      { phrase: 'Rental flats Vesu Surat', slug: 'rental-flats-vesu-surat', category: 'LONG_TAIL', citySlug: 'surat', localitySlug: 'vesu', propTypeSlug: 'flat' },

      // Commercial/Agricultural
      { phrase: 'Office space for rent Ahmedabad', slug: 'office-space-for-rent-ahmedabad', category: 'PROPERTY_TYPE', citySlug: 'ahmedabad', localitySlug: null, propTypeSlug: 'office' },
      { phrase: 'GIDC shed for sale', slug: 'gidc-shed-for-sale', category: 'PROPERTY_TYPE', citySlug: null, localitySlug: null, propTypeSlug: 'gidc-shed' },
      { phrase: 'Agricultural land for sale Gujarat', slug: 'agricultural-land-for-sale-gujarat', category: 'PROPERTY_TYPE', citySlug: null, localitySlug: null, propTypeSlug: 'agricultural-land' },
      { phrase: 'NA plot Gujarat', slug: 'na-plot-gujarat', category: 'PROPERTY_TYPE', citySlug: null, localitySlug: null, propTypeSlug: 'na-plot' },
      { phrase: 'Industrial land Gujarat', slug: 'industrial-land-gujarat', category: 'PROPERTY_TYPE', citySlug: null, localitySlug: null, propTypeSlug: 'industrial-land' },
    ];

    for (const kw of keywords) {
      const cityId = kw.citySlug ? citiesMap[kw.citySlug] : null;
      const localityId = kw.localitySlug ? localitiesMap[kw.localitySlug] : null;
      const propertyTypeId = kw.propTypeSlug ? propTypesMap[kw.propTypeSlug] : null;

      await client.query(
        `INSERT INTO keywords (phrase, slug, category, city_id, locality_id, property_type_id) 
         VALUES ($1, $2, $3, $4, $5, $6) 
         ON CONFLICT (slug) DO NOTHING`,
        [kw.phrase, kw.slug, kw.category, cityId, localityId, propertyTypeId]
      );
    }

    console.log('All additional keywords and blogs added successfully!');
  } catch (err) {
    console.error('Error adding user keywords:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

main();
