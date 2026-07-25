import { IKeywordRepository } from '../repositories/keyword.repository';
import { ParsedSlugDetails } from './slug.service';
import { logger } from '../lib/logger';

export interface IKeywordService {
  validateParsedSlug(slug: string, parsedDetails: ParsedSlugDetails): Promise<boolean>;
}

export class KeywordService implements IKeywordService {
  constructor(private keywordRepo: IKeywordRepository) {}

  async validateParsedSlug(slug: string, parsedDetails: ParsedSlugDetails): Promise<boolean> {
    const normalizedSlug = slug.toLowerCase();

    // 1. If it's a blog page, check if the blog exists in the database
    if (parsedDetails.category === 'BLOG') {
      const blog = await this.keywordRepo.findBlogBySlug(normalizedSlug);
      if (blog) {
        return true;
      }
      // Fallback for programmatically seeded blog pages in Keywords table
      const keywordRecord = await this.keywordRepo.findKeywordBySlug(normalizedSlug);
      if (keywordRecord) {
        return true;
      }
      logger.warn(`Validation failed: Blog slug '${normalizedSlug}' not found in Blogs or Keywords database.`);
      return false;
    }

    // 2. Check if the exact page slug is registered in the Keyword table (to prevent random generation)
    const keywordRecord = await this.keywordRepo.findKeywordBySlug(normalizedSlug);
    if (keywordRecord) {
      return true;
    }

    // 3. Optional fallback for dynamic but strict location validation (if client auto-generates combinations):
    // If a city is parsed from slug but does not exist in DB -> fail validation
    if (normalizedSlug.includes('ahmedabad') && !parsedDetails.city) return false;
    if (normalizedSlug.includes('surat') && !parsedDetails.city) return false;
    if (normalizedSlug.includes('vadodara') && !parsedDetails.city) return false;
    if (normalizedSlug.includes('rajkot') && !parsedDetails.city) return false;
    if (normalizedSlug.includes('gandhinagar') && !parsedDetails.city) return false;
    if (normalizedSlug.includes('anand') && !parsedDetails.city) return false;

    // Same for localities
    if (normalizedSlug.includes('bopal') && !parsedDetails.locality) return false;
    if (normalizedSlug.includes('satellite') && !parsedDetails.locality) return false;
    if (normalizedSlug.includes('vesu') && !parsedDetails.locality) return false;

    // For other categories, if they are not registered in the Keyword table, we fail them
    // to strictly respect the "Never generate random SEO pages" requirement.
    logger.warn(`Validation failed: Slug '${normalizedSlug}' is not registered in the Keywords or Blogs tables.`);
    return false;
  }
}
