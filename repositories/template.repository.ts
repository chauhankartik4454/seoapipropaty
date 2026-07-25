import { query } from '../lib/db';
import { KeywordCategory } from '../types/db';

export interface SeoTemplateData {
  id: number;
  category: KeywordCategory;
  titleTemplate: string;
  metaTitleTemplate: string;
  metaDescriptionTemplate: string;
  h1Template: string;
  h2Template: string;
  introductionTemplate: string;
  benefitsTemplate: string;
  contentTemplate: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SchemaTemplateData {
  id: number;
  category: KeywordCategory;
  type: string;
  templateJson: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITemplateRepository {
  getSeoTemplateByCategory(category: KeywordCategory): Promise<SeoTemplateData | null>;
  getSchemaTemplatesByCategory(category: KeywordCategory): Promise<SchemaTemplateData[]>;
}

export class TemplateRepository implements ITemplateRepository {
  async getSeoTemplateByCategory(category: KeywordCategory): Promise<SeoTemplateData | null> {
    const res = await query('SELECT * FROM seo_templates WHERE category = $1', [category]);
    if (res.rowCount === 0) return null;
    
    const row = res.rows[0];
    return {
      id: row.id,
      category: row.category,
      titleTemplate: row.title_template,
      metaTitleTemplate: row.meta_title_template,
      metaDescriptionTemplate: row.meta_description_template,
      h1Template: row.h1_template,
      h2Template: row.h2_template,
      introductionTemplate: row.introduction_template,
      benefitsTemplate: row.benefits_template,
      contentTemplate: row.content_template,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  async getSchemaTemplatesByCategory(category: KeywordCategory): Promise<SchemaTemplateData[]> {
    const res = await query('SELECT * FROM schema_templates WHERE category = $1', [category]);
    
    return res.rows.map((row) => ({
      id: row.id,
      category: row.category,
      type: row.type,
      templateJson: row.template_json,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  }
}
export default TemplateRepository;
