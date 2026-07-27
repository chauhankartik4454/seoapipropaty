import 'dotenv/config';
import { Pool } from 'pg';
import { KeywordRepository } from '../repositories/keyword.repository';
import { LocationRepository } from '../repositories/location.repository';
import { TemplateRepository } from '../repositories/template.repository';
import { SlugService } from '../services/slug.service';
import { KeywordService } from '../services/keyword.service';
import { TemplateService } from '../services/template.service';
import { FaqService } from '../services/faq.service';
import { SchemaService } from '../services/schema.service';
import { SeoService } from '../services/seo.service';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function run() {
  try {
    const keywordRepo = new KeywordRepository(pool);
    const locationRepo = new LocationRepository(pool);
    const templateRepo = new TemplateRepository(pool);

    const slugService = new SlugService(locationRepo, keywordRepo);
    const keywordService = new KeywordService(keywordRepo);
    const templateService = new TemplateService(templateRepo);
    const faqService = new FaqService(keywordRepo);
    const schemaService = new SchemaService(templateRepo);

    const seoService = new SeoService(
      slugService,
      keywordService,
      templateService,
      faqService,
      schemaService,
      keywordRepo
    );

    console.log('Generating master SEO payload for property-in-ahmedabad...');
    const result = await seoService.getSeoData('property-in-ahmedabad');

    if (!result) {
      console.error('ERROR: Result is null');
      return;
    }

    console.log('\n--- MASTER SEO API PAYLOAD TEST RESULT ---');
    console.log('Title:', result.title);
    console.log('H1:', result.h1);
    console.log('SEO Score:', result.keyword_metrics.seo_score);
    console.log('Word Count:', result.word_count);
    console.log('H2 Count:', result.h2.length);
    console.log('H2 Headings:', result.h2);
    console.log('Table of Contents Items:', result.table_of_contents.length);
    console.log('FAQ Count:', result.faq.length);
    console.log('EEAT Score:', result.eeat_score);
    console.log('Readability Score:', result.readability_score);
    console.log('Content Score:', result.content_score);
    console.log('Entity Score:', result.entity_score);
    console.log('Topical Authority:', result.topical_authority);
    console.log('Image Alt Objects:', result.image_alt.length);
    console.log('Internal Links Count:', result.internal_links.length);
    console.log('External Links Count:', result.external_links.length);
    console.log('LSI Keywords Count:', result.keyword_metrics.lsi_keywords.length);
    console.log('Schemas Attached:', Object.keys(result.schema));
    console.log('--- TEST COMPLETED SUCCESSFULLY ---');
  } catch (err) {
    console.error('Test failed:', err);
  } finally {
    await pool.end();
  }
}

run();
