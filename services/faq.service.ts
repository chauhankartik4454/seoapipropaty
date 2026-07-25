import { query } from '../lib/db';
import { KeywordCategory, Faq } from '../types/db';
import { renderTemplate } from '../utils/formatter';

export interface IFaqService {
  getFaqsForContext(
    category: KeywordCategory,
    cityId?: number | null,
    localityId?: number | null,
    propertyTypeId?: number | null,
    variables?: Record<string, string>
  ): Promise<{ question: string; answer: string }[]>;
}

export class FaqService implements IFaqService {
  async getFaqsForContext(
    category: KeywordCategory,
    cityId?: number | null,
    localityId?: number | null,
    propertyTypeId?: number | null,
    variables?: Record<string, string>
  ): Promise<{ question: string; answer: string }[]> {
    
    // Fetch FAQs that match the specific location hierarchy or property type or category
    const sql = `
      SELECT question, answer 
      FROM faqs
      WHERE locality_id = $1 
         OR city_id = $2 
         OR property_type_id = $3 
         OR category = $4::keyword_category
      ORDER BY id ASC
      LIMIT 5
    `;
    
    const res = await query<{ question: string; answer: string }>(sql, [
      localityId || null,
      cityId || null,
      propertyTypeId || null,
      category,
    ]);

    const faqs = res.rows;

    // Render templates within the FAQs using variables (e.g. converting {{city}} in FAQ questions/answers)
    return faqs.map((faq) => ({
      question: variables ? renderTemplate(faq.question, variables) : faq.question,
      answer: variables ? renderTemplate(faq.answer, variables) : faq.answer,
    }));
  }
}
