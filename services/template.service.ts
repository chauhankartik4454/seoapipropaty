import { ITemplateRepository } from '../repositories/template.repository';
import { renderTemplate, formatCapitalize, formatBudget } from '../utils/formatter';
import { ParsedSlugDetails } from './slug.service';
import { KeywordCategory } from '../types/db';
import { SeoTemplateData } from '../repositories/template.repository';
import { logger } from '../lib/logger';

export interface SeoTemplateResult {
  title: string;
  meta_title: string;
  meta_description: string;
  h1: string;
  h2: string[];
  introduction: string;
  benefits: string;
  content: string;
}

export interface ITemplateService {
  compileSeoTemplate(
    category: KeywordCategory,
    details: ParsedSlugDetails
  ): Promise<SeoTemplateResult>;
  getVariables(details: ParsedSlugDetails): Record<string, string>;
}

export class TemplateService implements ITemplateService {
  constructor(private templateRepo: ITemplateRepository) {}

  getVariables(details: ParsedSlugDetails): Record<string, string> {
    const city = details.city ? formatCapitalize(details.city.name) : '';
    const locality = details.locality ? formatCapitalize(details.locality.name) : '';
    const state = details.city?.stateId ? 'Gujarat' : 'Gujarat'; // Defaults to Gujarat as background specifies
    const propertyType = details.propertyType ? formatCapitalize(details.propertyType.name) : 'Property';
    const bhk = details.bhk || '';
    const budget = formatBudget(details.budgetVal, details.budgetUnit);
    const year = details.year || new Date().getFullYear().toString();

    // Pluralize property type helper
    const propertyTypePlural = details.propertyType 
      ? `${formatCapitalize(details.propertyType.name)}s` 
      : 'Properties';

    return {
      city,
      locality,
      state,
      propertyType,
      propertyTypePlural,
      bhk,
      budget,
      year,
    };
  }

  async compileSeoTemplate(
    category: KeywordCategory,
    details: ParsedSlugDetails
  ): Promise<SeoTemplateResult> {
    const variables = this.getVariables(details);

    // 1. Fetch template from repository
    let dbTemplate = await this.templateRepo.getSeoTemplateByCategory(category);

    // 2. Fallback templates if database is empty/not seeded
    if (!dbTemplate) {
      logger.warn(`No template found in database for category: ${category}. Utilizing code-level defaults.`);
      dbTemplate = this.getDefaultTemplate(category);
    }

    // 3. Render templates
    const title = renderTemplate(dbTemplate.titleTemplate, variables);
    const meta_title = renderTemplate(dbTemplate.metaTitleTemplate, variables);
    const meta_description = renderTemplate(dbTemplate.metaDescriptionTemplate, variables);
    const h1 = renderTemplate(dbTemplate.h1Template, variables);

    // Render H2 templates (H2 template is stored as a JSON string array)
    let h2: string[] = [];
    try {
      const h2Templates = JSON.parse(dbTemplate.h2Template) as string[];
      h2 = h2Templates.map((h2Temp) => renderTemplate(h2Temp, variables));
    } catch {
      // Fallback if not valid JSON
      h2 = dbTemplate.h2Template
        .split(',')
        .map((h2Temp) => renderTemplate(h2Temp.trim(), variables));
    }

    const introduction = renderTemplate(dbTemplate.introductionTemplate, variables);
    const benefits = renderTemplate(dbTemplate.benefitsTemplate, variables);
    const content = renderTemplate(dbTemplate.contentTemplate, variables);

    return {
      title,
      meta_title,
      meta_description,
      h1,
      h2,
      introduction,
      benefits,
      content,
    };
  }

  private getDefaultTemplate(category: KeywordCategory): SeoTemplateData {
    const timestamp = new Date();
    
    const defaults: Record<KeywordCategory, Partial<SeoTemplateData>> = {
      HOMEPAGE: {
        titleTemplate: 'Properties in {{state}} | Buy Real Estate in {{state}}',
        metaTitleTemplate: 'Properties in {{state}} - Top Real Estate Projects',
        metaDescriptionTemplate: 'Find properties in {{state}} with premium options. Explore residential, commercial property rates, dealers, and projects in {{state}}.',
        h1Template: 'Real Estate & Properties in {{state}}',
        h2Template: JSON.stringify([
          'Why Invest in {{state}} Real Estate?',
          'Top Cities to Buy Properties in {{state}}',
        ]),
        introductionTemplate: 'Welcome to the leading real estate hub in {{state}}. Discover high quality residential and commercial spaces configured for premium living and investment returns.',
        benefitsTemplate: 'Investing in {{state}} offers excellent connectivity, progressive infrastructure, high rental yields, and strong capital appreciation.',
        contentTemplate: 'Explore pre-verified property listings, RERA approved projects, and connecting property dealers to guide your real estate journey across Gujarat.',
      },
      CITY_PAGE: {
        titleTemplate: 'Properties in {{city}} | Real Estate in {{city}}',
        metaTitleTemplate: 'Properties for Sale in {{city}} | Real Estate {{city}}',
        metaDescriptionTemplate: 'Looking for property in {{city}}? Explore residential flats, plots, commercial shops, and villas for sale in {{city}} with pricing guides.',
        h1Template: 'Properties in {{city}}, Gujarat',
        h2Template: JSON.stringify([
          'Best Localities in {{city}} to Buy Property',
          'Current Real Estate Rates in {{city}}',
        ]),
        introductionTemplate: 'Find your dream home in {{city}}. Our compiled database hosts premium flats, luxury villas, and commercial spaces across the most prominent sectors of {{city}}.',
        benefitsTemplate: '{{city}} is a fast-developing hub featuring robust public transport, highly rated schools, modern hospitals, and expanding employment zones.',
        contentTemplate: 'Get deep insights into the {{city}} property market. Check stamp duty charges, local amenities, and property rate trends before you invest.',
      },
      LOCALITY_PAGE: {
        titleTemplate: 'Properties in {{locality}}, {{city}} | Real Estate Listing',
        metaTitleTemplate: 'Properties in {{locality}}, {{city}} | Buy & Sale Guide',
        metaDescriptionTemplate: 'Find flats, plots, and commercial properties in {{locality}}, {{city}}. Compare rates, amenities, and developer listings in {{locality}}.',
        h1Template: 'Properties in {{locality}}, {{city}}',
        h2Template: JSON.stringify([
          'Property Rates & Trends in {{locality}}',
          'Locality Amenities and Connectivity',
        ]),
        introductionTemplate: 'Welcome to {{locality}}, one of the most sought after residential sectors in {{city}}. Explore premium living options built by leading developers.',
        benefitsTemplate: 'Living in {{locality}} ensures you are close to IT parks, central business districts, premium shopping malls, and highly connected transit links.',
        contentTemplate: 'Make an informed decision with current price trends in {{locality}}, {{city}} and connect directly with verified property dealers.',
      },
      PROPERTY_TYPE: {
        titleTemplate: '{{propertyTypePlural}} in {{city}} | Buy {{propertyType}} in {{city}}',
        metaTitleTemplate: '{{propertyTypePlural}} for Sale in {{city}} | Real Estate {{city}}',
        metaDescriptionTemplate: 'Search {{propertyTypePlural}} in {{city}}. Get detailed lists of commercial, residential, ready to move {{propertyTypePlural}} from verified sellers.',
        h1Template: '{{propertyTypePlural}} in {{city}}',
        h2Template: JSON.stringify([
          'Top Projects Offering {{propertyTypePlural}} in {{city}}',
          'Price Ranges for {{propertyTypePlural}}',
        ]),
        introductionTemplate: 'Explore top listed {{propertyTypePlural}} in {{city}}. Find configurations matching your architectural taste and professional demands.',
        benefitsTemplate: 'Choosing a {{propertyType}} in {{city}} guarantees strong builder warranty, dedicated parking spaces, and access to compound amenities.',
        contentTemplate: 'Browse through budget configurations and luxury listings of {{propertyTypePlural}} to locate your perfect matches.',
      },
      LONG_TAIL: {
        titleTemplate: '{{bhk}} {{propertyType}} {{budget}} in {{locality}} {{city}}',
        metaTitleTemplate: '{{bhk}} {{propertyType}} {{budget}} in {{locality}} {{city}}',
        metaDescriptionTemplate: 'Search {{bhk}} {{propertyType}} {{budget}} in {{locality}}, {{city}}. Check real-time property rates, RERA validation, and ready-to-move options.',
        h1Template: '{{bhk}} {{propertyType}} {{budget}} in {{locality}}, {{city}}',
        h2Template: JSON.stringify([
          'Features of {{bhk}} {{propertyTypePlural}} in {{locality}}',
          'Affordability and Investment Value',
        ]),
        introductionTemplate: 'Are you searching for a {{bhk}} {{propertyType}} in {{locality}}, {{city}} priced {{budget}}? We have curated the best listings that perfectly match your query.',
        benefitsTemplate: 'This setup in {{locality}} offers modern layout configurations, localized shopping convenience, and excellent commute times within {{budget}}.',
        contentTemplate: 'Our team has verified these {{bhk}} configurations to verify compliance with RERA and secure property documentation.',
      },
      BLOG: {
        titleTemplate: '{{propertyType}} Guide in {{locality}} {{city}} ({{year}})',
        metaTitleTemplate: '{{propertyType}} rates & Verification in {{locality}} {{city}}',
        metaDescriptionTemplate: 'Check RERA guidelines, registration procedures, stamp duty charges, and property rates in {{locality}} {{city}} for {{year}}.',
        h1Template: 'Property Rates and Guide in {{locality}}, {{city}} ({{year}})',
        h2Template: JSON.stringify([
          'Stamp Duty & Registration in {{city}}',
          'Future Market Predictions for {{year}}',
        ]),
        introductionTemplate: 'Stay updated with the latest real estate updates in {{locality}}, {{city}} for the year {{year}}.',
        benefitsTemplate: 'Keeping abreast of registration fees and legal verifications prevents legal disputes and ensures safe real estate holdings.',
        contentTemplate: 'Detailed overview of RERA Gujarat, property valuation methodologies, and legal checklist for investors.',
      },
    };

    return {
      id: 0,
      category,
      titleTemplate: defaults[category].titleTemplate || '',
      metaTitleTemplate: defaults[category].metaTitleTemplate || '',
      metaDescriptionTemplate: defaults[category].metaDescriptionTemplate || '',
      h1Template: defaults[category].h1Template || '',
      h2Template: defaults[category].h2Template || '[]',
      introductionTemplate: defaults[category].introductionTemplate || '',
      benefitsTemplate: defaults[category].benefitsTemplate || '',
      contentTemplate: defaults[category].contentTemplate || '',
      createdAt: timestamp,
      updatedAt: timestamp,
    };
  }
}
