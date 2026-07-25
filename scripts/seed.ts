import { Pool } from 'pg';
import * as fs from 'fs';
import * as path from 'path';
import 'dotenv/config';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('DATABASE_URL environment variable is missing.');
  process.exit(1);
}

async function main() {
  console.log('Starting raw PostgreSQL database seeding...');

  // 1. Check and create database if it doesn't exist
  const defaultDbUrl = connectionString.replace(/\/seo_engine(\?.*)?$/, '/postgres$1');
  const tempPool = new Pool({ connectionString: defaultDbUrl });
  const tempClient = await tempPool.connect();
  try {
    const checkDb = await tempClient.query("SELECT 1 FROM pg_database WHERE datname = 'seo_engine'");
    if (checkDb.rowCount === 0) {
      console.log('Database seo_engine does not exist. Creating database...');
      await tempClient.query('CREATE DATABASE seo_engine');
      console.log('Database seo_engine created.');
    } else {
      console.log('Database seo_engine already exists.');
    }
  } catch (err) {
    console.error('Error checking/creating database:', err);
  } finally {
    tempClient.release();
    await tempPool.end();
  }

  // 2. Connect to the target database
  const pool = new Pool({ connectionString });
  const client = await pool.connect();

  try {
    // 1. Run Schema Migrations
    console.log('Reading schema SQL file...');
    const schemaPath = path.join(process.cwd(), 'sql/schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('Applying schema migrations...');
    await client.query(schemaSql);
    console.log('Schema created successfully.');

    // 2. Clean Existing Data
    console.log('Truncating tables...');
    await client.query('TRUNCATE TABLE faqs, keywords, blogs, schema_templates, seo_templates, localities, cities, property_types, states RESTART IDENTITY CASCADE');

    // 3. Insert Gujarat State
    console.log('Inserting state...');
    const stateRes = await client.query(
      'INSERT INTO states (name, slug) VALUES ($1, $2) RETURNING id',
      ['Gujarat', 'gujarat']
    );
    const stateId = stateRes.rows[0].id;

    // 4. Insert Cities
    console.log('Inserting cities...');
    const cities = [
      { name: 'Ahmedabad', slug: 'ahmedabad' },
      { name: 'Surat', slug: 'surat' },
      { name: 'Vadodara', slug: 'vadodara' },
      { name: 'Rajkot', slug: 'rajkot' },
      { name: 'Gandhinagar', slug: 'gandhinagar' },
      { name: 'Anand', slug: 'anand' },
    ];
    
    const citiesMap: Record<string, number> = {};
    for (const c of cities) {
      const res = await client.query(
        'INSERT INTO cities (name, slug, state_id) VALUES ($1, $2, $3) RETURNING id',
        [c.name, c.slug, stateId]
      );
      citiesMap[c.slug] = res.rows[0].id;
    }

    // 5. Insert Localities
    console.log('Inserting localities...');
    const localities = [
      { name: 'SG Highway', slug: 'sg-highway', citySlug: 'ahmedabad' },
      { name: 'Satellite', slug: 'satellite', citySlug: 'ahmedabad' },
      { name: 'Prahlad Nagar', slug: 'prahlad-nagar', citySlug: 'ahmedabad' },
      { name: 'Bopal', slug: 'bopal', citySlug: 'ahmedabad' },
      { name: 'Thaltej', slug: 'thaltej', citySlug: 'ahmedabad' },
      { name: 'Vesu', slug: 'vesu', citySlug: 'surat' },
      { name: 'Adajan', slug: 'adajan', citySlug: 'surat' },
      { name: 'Pal', slug: 'pal', citySlug: 'surat' },
      { name: 'Althan', slug: 'althan', citySlug: 'surat' },
      { name: 'Gotri', slug: 'gotri', citySlug: 'vadodara' },
      { name: 'Alkapuri', slug: 'alkapuri', citySlug: 'vadodara' },
      { name: 'Manjalpur', slug: 'manjalpur', citySlug: 'vadodara' },
      { name: 'Kalawad Road', slug: 'kalawad-road', citySlug: 'rajkot' },
      { name: 'Gift City', slug: 'gift-city', citySlug: 'gandhinagar' },
      { name: 'Vallabh Vidyanagar', slug: 'vallabh-vidyanagar', citySlug: 'anand' },
    ];

    const localitiesMap: Record<string, number> = {};
    for (const l of localities) {
      const cityId = citiesMap[l.citySlug];
      if (cityId) {
        const res = await client.query(
          'INSERT INTO localities (name, slug, city_id) VALUES ($1, $2, $3) RETURNING id',
          [l.name, l.slug, cityId]
        );
        localitiesMap[l.slug] = res.rows[0].id;
      }
    }

    // 6. Insert Property Types
    console.log('Inserting property types...');
    const propertyTypes = [
      { name: 'Flat', slug: 'flat' },
      { name: 'Apartment', slug: 'apartment' },
      { name: 'Villa', slug: 'villa' },
      { name: 'Plot', slug: 'plot' },
      { name: 'Commercial Property', slug: 'commercial-property' },
      { name: 'Office', slug: 'office' },
      { name: 'Shop', slug: 'shop' },
      { name: 'Industrial Land', slug: 'industrial-land' },
      { name: 'Agricultural Land', slug: 'agricultural-land' },
      { name: 'NA Plot', slug: 'na-plot' },
      { name: 'Warehouse', slug: 'warehouse' },
      { name: 'GIDC Shed', slug: 'gidc-shed' },
    ];

    const propertyTypesMap: Record<string, number> = {};
    for (const pt of propertyTypes) {
      const res = await client.query(
        'INSERT INTO property_types (name, slug) VALUES ($1, $2) RETURNING id',
        [pt.name, pt.slug]
      );
      propertyTypesMap[pt.slug] = res.rows[0].id;
    }

    // 7. Insert SEO Templates
    console.log('Inserting SEO templates...');
    const templates = [
      {
        category: 'HOMEPAGE',
        title: 'Real Estate & Properties in {{state}} | Buy Property',
        meta_title: 'Properties in {{state}} | Verified Real Estate Listings',
        meta_desc: 'Looking to buy property in {{state}}? Explore RERA-approved residential flats, luxury villas, commercial shops, plots, and offices from top builders.',
        h1: 'Real Estate & Properties in {{state}}',
        h2: JSON.stringify([
          'Why Invest in {{state}} Real Estate?',
          'Top Real Estate Hubs in {{state}}',
          'Legal Requirements for Property Buyers in {{state}}',
        ]),
        intro: 'Welcome to the premier real estate gateway for {{state}}. As one of India\'s fastest-growing economic zones, {{state}} offers unmatched real estate options.',
        benefits: 'Investing in {{state}} promises high capital appreciation, premium amenities, excellent transit systems, and full regulatory transparency via RERA.',
        content: 'Browse from thousands of NA plots, GIDC industrial sheds, commercial spaces, and residential configurations. Connect with certified property dealers today.',
      },
      {
        category: 'CITY_PAGE',
        title: 'Properties in {{city}} | Real Estate Listings in {{city}}',
        meta_title: 'Properties for Sale in {{city}} | Buy Real Estate in {{city}}',
        meta_desc: 'Find flats, plots, commercial office space, and luxury villas for sale in {{city}}, Gujarat. Read about current market rates and prime residential localities.',
        h1: 'Real Estate & Properties in {{city}}',
        h2: JSON.stringify([
          'Top Localities to Buy Property in {{city}}',
          'Property Rates and Price Trends in {{city}}',
          'Connectivity and Infrastructure in {{city}}',
        ]),
        intro: 'Explore verified residential and commercial properties in {{city}}. With modern skyscrapers, active GIDC hubs, and premium residential layouts, {{city}} is the ultimate investment choice.',
        benefits: 'Buying a home in {{city}} offers access to rapid metro networks, premium educational institutions, modern healthcare, and bustling commercial corridors.',
        content: 'Compare market rates, builder profiles, and property tax guidelines in {{city}} to find your ideal workspace or residential dwelling.',
      },
      {
        category: 'LOCALITY_PAGE',
        title: 'Properties in {{locality}}, {{city}} | Buy Properties in {{locality}}',
        meta_title: 'Real Estate in {{locality}}, {{city}} | Flats & Plots for Sale',
        meta_desc: 'Check properties in {{locality}}, {{city}}. Compare 2BHK/3BHK flats, ready-to-move projects, residential plots, and shop prices from top developers in {{locality}}.',
        h1: 'Properties in {{locality}}, {{city}}',
        h2: JSON.stringify([
          'Why {{locality}} is the Hottest Investment Sector',
          'Current Real Estate Rates in {{locality}}',
          'Amenities and Transit Access in {{locality}}',
        ]),
        intro: 'Welcome to {{locality}}, one of the most prominent and high-growth neighborhoods in {{city}}. Known for its superior lifestyle quality and connectivity.',
        benefits: 'Properties in {{locality}} are highly valued due to proximity to shopping complexes, corporate business hubs, prestigious schools, and major expressways.',
        content: 'Whether you are seeking an affordable apartment or a premium commercial office, {{locality}} in {{city}} provides options configured to all requirements.',
      },
      {
        category: 'PROPERTY_TYPE',
        title: '{{propertyTypePlural}} in {{city}} | Verified {{propertyType}} in {{city}}',
        meta_title: '{{propertyTypePlural}} for Sale in {{city}} | Developer Listings',
        meta_desc: 'Looking for a {{propertyType}} in {{city}}? Browse through ready-to-move and under-construction {{propertyTypePlural}} from verified sellers.',
        h1: '{{propertyTypePlural}} in {{city}}',
        h2: JSON.stringify([
          'Key Considerations Before Buying a {{propertyType}} in {{city}}',
          'Popular Locations offering {{propertyTypePlural}} in {{city}}',
        ]),
        intro: 'Find the widest selection of premium {{propertyTypePlural}} in {{city}}. Each project is chosen for structural reliability, layout planning, and prime location.',
        benefits: 'Purchasing a {{propertyType}} in {{city}} ensures long-term asset value, reliable builder support, and access to standard safety and luxury features.',
        content: 'Check RERA registration certificates, building approval plans, and tax compliance documents for all {{propertyTypePlural}} in {{city}}.',
      },
      {
        category: 'LONG_TAIL',
        title: '{{bhk}} {{propertyType}} {{budget}} in {{locality}} {{city}}',
        meta_title: 'Buy {{bhk}} {{propertyType}} {{budget}} in {{locality}} {{city}}',
        meta_desc: 'Verified listings for {{bhk}} {{propertyType}} {{budget}} in {{locality}}, {{city}}. Discover ready-to-move properties, amenities, and builder details.',
        h1: '{{bhk}} {{propertyType}} {{budget}} in {{locality}}, {{city}}',
        h2: JSON.stringify([
          'Overview of {{bhk}} {{propertyTypePlural}} under {{budget}} in {{locality}}',
          'Smart Living and ROI Potential in {{locality}}',
        ]),
        intro: 'Searching for a {{bhk}} {{propertyType}} in {{locality}}, {{city}} under the budget of {{budget}}? You have landed on the most accurate property resource.',
        benefits: 'This configuration offers the optimal balance of space, affordability, and modern community amenities inside {{locality}}.',
        content: 'Each {{bhk}} {{propertyType}} listing in {{locality}}, {{city}} has been thoroughly verified against RERA database records for clear documentation.',
      },
      {
        category: 'BLOG',
        title: '{{propertyType}} Guide in {{locality}} {{city}} ({{year}})',
        meta_title: 'Property rates in {{locality}} {{city}} - Stamp Duty & RERA ({{year}})',
        meta_desc: 'Stay updated on real estate rates, RERA regulations, property verification checklists, and stamp duty rates in {{locality}}, {{city}} for {{year}}.',
        h1: 'Property Guide, Verification, and Rates in {{locality}}, {{city}} ({{year}})',
        h2: JSON.stringify([
          'Current Property Rates Trend in {{locality}} ({{year}})',
          'Property Document Verification Checklist in Gujarat',
          'Understanding Stamp Duty and Registration Charges',
        ]),
        intro: 'Real estate investment requires thorough research. This comprehensive guide covers property market dynamics in {{locality}}, {{city}} for the year {{year}}.',
        benefits: 'Following a strict legal check list and tracking stamp duty costs safeguards your funds and confirms an undisputed transfer of ownership.',
        content: 'Review this deep dive on RERA Gujarat registrations, GIDC updates, and local developer projections for the up-coming quarters.',
      },
    ];

    for (const t of templates) {
      await client.query(
        `INSERT INTO seo_templates (
          category, title_template, meta_title_template, meta_description_template,
          h1_template, h2_template, introduction_template, benefits_template, content_template
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [t.category, t.title, t.meta_title, t.meta_desc, t.h1, t.h2, t.intro, t.benefits, t.content]
      );
    }

    // 8. Insert Schema Templates
    console.log('Inserting schema templates...');
    const schemaTemplates = [
      {
        category: 'CITY_PAGE',
        type: 'LocalBusiness',
        json: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'LocalBusiness',
          'name': 'Propertysdeal {{city}}',
          'description': 'Premium real estate services and properties for sale in {{city}}.',
          'telephone': '+919999999999',
          'address': {
            '@type': 'PostalAddress',
            'addressLocality': '{{city}}',
            'addressRegion': 'Gujarat',
            'addressCountry': 'IN'
          }
        }),
      },
      {
        category: 'LOCALITY_PAGE',
        type: 'LocalBusiness',
        json: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'LocalBusiness',
          'name': 'Propertysdeal Real Estate {{locality}}',
          'description': 'Find premium properties, apartments, and land listings in {{locality}}, {{city}}.',
          'telephone': '+919999999999',
          'address': {
            '@type': 'PostalAddress',
            'addressLocality': '{{city}}',
            'addressRegion': '{{locality}}',
            'addressCountry': 'IN'
          }
        }),
      },
    ];

    for (const st of schemaTemplates) {
      await client.query(
        'INSERT INTO schema_templates (category, type, template_json) VALUES ($1, $2, $3)',
        [st.category, st.type, st.json]
      );
    }

    // 9. Insert FAQs
    console.log('Inserting FAQs...');
    const faqs = [
      {
        question: 'What is RERA Gujarat, and why is it important?',
        answer: 'RERA (Real Estate Regulatory Authority) Gujarat protects home buyers by ensuring timely project delivery, transparency, and standard pricing rules. Always check the RERA registration number of a project before buying.',
        category: 'HOMEPAGE',
        citySlug: null,
        localitySlug: null,
        propertyTypeSlug: null,
      },
      {
        question: 'Is it a good time to buy property in {{city}}?',
        answer: 'Yes, {{city}} is experiencing high infrastructure growth with the expansion of highways, metro connectivity, and corporate hubs, making it an excellent long-term real estate investment.',
        category: 'CITY_PAGE',
        citySlug: 'ahmedabad',
        localitySlug: null,
        propertyTypeSlug: null,
      },
      {
        question: 'What are the average property rates in {{locality}}?',
        answer: 'Property rates in {{locality}} range widely depending on the project type, builder brand, and ready-to-move status. Standard flats range from ₹5,000 to ₹12,000 per sq. ft.',
        category: 'LOCALITY_PAGE',
        citySlug: null,
        localitySlug: 'bopal',
        propertyTypeSlug: null,
      },
      {
        question: 'Can I find a verified {{bhk}} {{propertyType}} in {{locality}} under {{budget}}?',
        answer: 'Yes! There are several projects in {{locality}} that offer {{bhk}} {{propertyTypePlural}} within {{budget}}. Always verify developer RERA certifications and NA plot documentation.',
        category: 'LONG_TAIL',
        citySlug: null,
        localitySlug: 'sg-highway',
        propertyTypeSlug: 'flat',
      },
    ];

    for (const f of faqs) {
      const cityId = f.citySlug ? citiesMap[f.citySlug] : null;
      const localityId = f.localitySlug ? localitiesMap[f.localitySlug] : null;
      const propertyTypeId = f.propertyTypeSlug ? propertyTypesMap[f.propertyTypeSlug] : null;

      await client.query(
        'INSERT INTO faqs (question, answer, category, city_id, locality_id, property_type_id) VALUES ($1, $2, $3, $4, $5, $6)',
        [f.question, f.answer, f.category, cityId, localityId, propertyTypeId]
      );
    }

    // 10. Insert Blogs
    console.log('Inserting blogs...');
    const blogs = [
      {
        title: 'How to Buy Property in Gujarat - A Complete Guide',
        slug: 'how-to-buy-property',
        content: 'Buying property in Gujarat involves verifying the land title, obtaining the Non-Agricultural (NA) certificate, checking RERA validation, calculating stamp duty, and registering the sale deed at the local sub-registrar office.',
        meta_title: 'How to Buy Property in Gujarat | Checklist & Guide',
        meta_desc: 'Step-by-step investor guide to buying residential and commercial properties in Gujarat. Learn about NA plots, RERA checks, and registry fees.',
      },
      {
        title: 'Understanding RERA Regulations in Gujarat',
        slug: 'rera-gujarat',
        content: 'RERA Gujarat (GUJRERA) is the regulatory body enforcing construction guidelines, developer accountability, and buyer rights. Buyers must verify the registration of builders on the GUJRERA portal before releasing funds.',
        meta_title: 'GUJRERA Guide: RERA Rules & Verification Checklist in Gujarat',
        meta_desc: 'Learn how to verify projects on GUJRERA portal, builder responsibilities, escrow rules, and dispute resolution guidelines under RERA Gujarat.',
      },
    ];

    for (const b of blogs) {
      await client.query(
        'INSERT INTO blogs (title, slug, content, meta_title, meta_description) VALUES ($1, $2, $3, $4, $5)',
        [b.title, b.slug, b.content, b.meta_title, b.meta_desc]
      );
    }

    // 11. Register Active Keywords
    console.log('Inserting keywords...');
    const keywords = [
      { phrase: 'Property in Gujarat', slug: 'property-in-gujarat', category: 'HOMEPAGE', citySlug: null, localitySlug: null, propertyTypeSlug: null },
      { phrase: 'Real Estate Gujarat', slug: 'real-estate-gujarat', category: 'HOMEPAGE', citySlug: null, localitySlug: null, propertyTypeSlug: null },
      { phrase: 'Property in Ahmedabad', slug: 'property-in-ahmedabad', category: 'CITY_PAGE', citySlug: 'ahmedabad', localitySlug: null, propertyTypeSlug: null },
      { phrase: 'Property in Surat', slug: 'property-in-surat', category: 'CITY_PAGE', citySlug: 'surat', localitySlug: null, propertyTypeSlug: null },
      { phrase: 'Property in Vadodara', slug: 'property-in-vadodara', category: 'CITY_PAGE', citySlug: 'vadodara', localitySlug: null, propertyTypeSlug: null },
      { phrase: 'Flat for sale in SG Highway', slug: 'flat-for-sale-in-sg-highway', category: 'LOCALITY_PAGE', citySlug: 'ahmedabad', localitySlug: 'sg-highway', propertyTypeSlug: 'flat' },
      { phrase: 'Property in Prahlad Nagar Ahmedabad', slug: 'property-in-prahlad-nagar-ahmedabad', category: 'LOCALITY_PAGE', citySlug: 'ahmedabad', localitySlug: 'prahlad-nagar', propertyTypeSlug: null },
      { phrase: 'Flat for sale in Vesu', slug: 'flat-for-sale-in-vesu', category: 'LOCALITY_PAGE', citySlug: 'surat', localitySlug: 'vesu', propertyTypeSlug: 'flat' },
      { phrase: 'Villa for sale Vadodara', slug: 'villa-for-sale-vadodara', category: 'PROPERTY_TYPE', citySlug: 'vadodara', localitySlug: null, propertyTypeSlug: 'villa' },
      { phrase: 'Shop for sale Surat', slug: 'shop-for-sale-surat', category: 'PROPERTY_TYPE', citySlug: 'surat', localitySlug: null, propertyTypeSlug: 'shop' },
      { phrase: '2BHK Flat under 50 Lakh Ahmedabad', slug: '2bhk-flat-under-50-lakh-ahmedabad', category: 'LONG_TAIL', citySlug: 'ahmedabad', localitySlug: null, propertyTypeSlug: 'flat' },
      { phrase: 'Property rates in Bopal 2026', slug: 'property-rates-in-bopal-2026', category: 'BLOG', citySlug: 'ahmedabad', localitySlug: 'bopal', propertyTypeSlug: null },
    ];

    for (const kw of keywords) {
      const cityId = kw.citySlug ? citiesMap[kw.citySlug] : null;
      const localityId = kw.localitySlug ? localitiesMap[kw.localitySlug] : null;
      const propertyTypeId = kw.propertyTypeSlug ? propertyTypesMap[kw.propertyTypeSlug] : null;

      await client.query(
        'INSERT INTO keywords (phrase, slug, category, city_id, locality_id, property_type_id) VALUES ($1, $2, $3, $4, $5, $6)',
        [kw.phrase, kw.slug, kw.category, cityId, localityId, propertyTypeId]
      );
    }

    console.log('Database seeded successfully!');

  } catch (err) {
    console.error('Error during database seed execution:', err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

main();
