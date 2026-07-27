import { ILocationRepository } from '../repositories/location.repository';
import { IKeywordRepository } from '../repositories/keyword.repository';
import { parseSlugMetadata, findMatchingSlug, ParsedSlugResult } from '../utils/parser';
import { cache } from '../lib/cache';
import { City, Locality, PropertyType, Blog, KeywordCategory } from '../types/db';
import { logger } from '../lib/logger';

export interface ParsedSlugDetails extends ParsedSlugResult {
  category: KeywordCategory;
  city: City | null;
  locality: Locality | null;
  propertyType: PropertyType | null;
  blog: Blog | null;
  keyword?: any;
  slug?: string;
}

export interface ISlugService {
  parseSlug(slug: string): Promise<ParsedSlugDetails | null>;
}

export class SlugService implements ISlugService {
  constructor(
    private locationRepo: ILocationRepository,
    private keywordRepo: IKeywordRepository
  ) {}

  private async getCachedCities(): Promise<City[]> {
    const cacheKey = 'seo:cities:all';
    let cities = await cache.get<City[]>(cacheKey);
    if (!cities) {
      cities = await this.locationRepo.getAllCities();
      await cache.set(cacheKey, cities, 3600); // cache for 1 hour
    }
    return cities;
  }

  private async getCachedLocalities(): Promise<(Locality & { city: City })[]> {
    const cacheKey = 'seo:localities:all';
    let localities = await cache.get<(Locality & { city: City })[]>(cacheKey);
    if (!localities) {
      localities = await this.locationRepo.getAllLocalities();
      await cache.set(cacheKey, localities, 3600); // cache for 1 hour
    }
    return localities;
  }

  private async getCachedPropertyTypes(): Promise<PropertyType[]> {
    const cacheKey = 'seo:property_types:all';
    let types = await cache.get<PropertyType[]>(cacheKey);
    if (!types) {
      types = await this.keywordRepo.getAllPropertyTypes();
      await cache.set(cacheKey, types, 3600); // cache for 1 hour
    }
    return types;
  }

  async parseSlug(slug: string): Promise<ParsedSlugDetails | null> {
    const normalized = slug.toLowerCase();
    logger.info(`Parsing slug: ${slug}`);

    // 1. Check if slug exists directly in Blog table
    const blog = await this.keywordRepo.findBlogBySlug(normalized);
    if (blog) {
      return {
        category: 'BLOG',
        city: null,
        locality: null,
        propertyType: null,
        blog,
        bhk: null,
        budgetVal: null,
        budgetUnit: null,
        year: null,
        intent: 'general',
      };
    }

    // 2. Parse general metadata (BHK, Budget, Year, Intent)
    const meta = parseSlugMetadata(normalized);

    // 3. Resolve location entities (City, Locality) and Property Type
    const [cities, localities, propertyTypes] = await Promise.all([
      this.getCachedCities(),
      this.getCachedLocalities(),
      this.getCachedPropertyTypes(),
    ]);

    const matchedLocality = findMatchingSlug(normalized, localities);
    let matchedCity = findMatchingSlug(normalized, cities);
    const matchedPropertyType = findMatchingSlug(normalized, propertyTypes);

    // If locality is matched, tie it to its city even if city slug wasn't in the main URL
    if (matchedLocality && !matchedCity) {
      matchedCity = matchedLocality.city;
    }

    // Do not treat 'Gujarat' state as a city page
    if (matchedCity && matchedCity.slug.toLowerCase() === 'gujarat') {
      matchedCity = null;
    }

    // 4. Validate existence requirements:
    // If slug implies a city or locality (contains names like '-ahmedabad' or '-bopal'), and it was not found, return null (invalid -> 404)
    // Check city mismatch
    const slugSegments = normalized.split('-');
    
    // Check if any segment matches a known city slug but we failed to bind it, or if it doesn't match
    const hasCitySegment = cities.some(c => slugSegments.includes(c.slug.toLowerCase()));
    if (hasCitySegment && !matchedCity) {
      logger.warn(`Slug contains city name but city was not found in DB: ${slug}`);
      return null;
    }

    const hasLocalitySegment = localities.some(l => slugSegments.includes(l.slug.toLowerCase()));
    if (hasLocalitySegment && !matchedLocality) {
      logger.warn(`Slug contains locality name but locality was not found in DB: ${slug}`);
      return null;
    }

    // 5. Determine Keyword Category
    let category: KeywordCategory = 'HOMEPAGE';

    // If rates or blog year matches, categorize as BLOG
    if (meta.intent === 'rates' || meta.year || normalized.includes('stamp-duty') || normalized.includes('rera') || normalized.includes('registration')) {
      category = 'BLOG';
    } else if (meta.bhk || meta.budgetVal || (matchedPropertyType && (matchedCity || matchedLocality))) {
      // Combination of property details with locations indicates long-tail search landing page
      category = 'LONG_TAIL';
    } else if (matchedLocality) {
      category = 'LOCALITY_PAGE';
    } else if (matchedCity) {
      category = 'CITY_PAGE';
    } else if (matchedPropertyType) {
      category = 'PROPERTY_TYPE';
    } else {
      // General homepage search terms like "property-in-gujarat", "real-estate-gujarat"
      category = 'HOMEPAGE';
    }

    return {
      category,
      city: matchedCity,
      locality: matchedLocality,
      propertyType: matchedPropertyType,
      blog: null,
      ...meta,
    };
  }
}
