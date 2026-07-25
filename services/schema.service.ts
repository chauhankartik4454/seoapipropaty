import { ITemplateRepository } from '../repositories/template.repository';
import { renderTemplate } from '../utils/formatter';
import { ParsedSlugDetails } from './slug.service';
import { KeywordCategory } from '../types/db';
import { logger } from '../lib/logger';

export interface ISchemaService {
  generateSchema(
    category: KeywordCategory,
    details: ParsedSlugDetails,
    variables: Record<string, string>,
    faqs: { question: string; answer: string }[]
  ): Promise<Record<string, any>>;
}

export class SchemaService implements ISchemaService {
  constructor(private templateRepo: ITemplateRepository) {}

  async generateSchema(
    category: KeywordCategory,
    details: ParsedSlugDetails,
    variables: Record<string, string>,
    faqs: { question: string; answer: string }[]
  ): Promise<Record<string, any>> {
    const schemas: Record<string, any> = {};

    // 1. Generate BreadcrumbList Schema Programmatically
    schemas.breadcrumbs = this.generateBreadcrumbs(details, variables);

    // 2. Generate FAQPage Schema Programmatically (if FAQs exist)
    if (faqs && faqs.length > 0) {
      schemas.faq = this.generateFaqSchema(faqs);
    }

    // 3. Generate BlogPosting Schema for Blogs
    if (category === 'BLOG' && details.blog) {
      schemas.article = this.generateBlogPostingSchema(details.blog, details.slug);
    }

    // 4. Load & render custom templates from DB (e.g. RealEstateAgent, LocalBusiness)
    try {
      const dbSchemaTemplates = await this.templateRepo.getSchemaTemplatesByCategory(category);
      
      for (const temp of dbSchemaTemplates) {
        try {
          const renderedJsonStr = renderTemplate(temp.templateJson, variables);
          const parsedJson = JSON.parse(renderedJsonStr);
          schemas[temp.type.toLowerCase()] = parsedJson;
        } catch (e) {
          logger.error(`Error parsing schema template JSON for type ${temp.type}`, e);
        }
      }
    } catch (e) {
      logger.error('Error fetching custom schema templates', e);
    }

    // If no custom business schemas loaded, provide a fallback RealEstateAgent schema
    if (!schemas.realestateagent && !schemas.localbusiness && category !== 'BLOG') {
      schemas.realestateagent = this.getDefaultAgentSchema(variables);
    }

    return schemas;
  }

  private generateBreadcrumbs(details: ParsedSlugDetails, variables: Record<string, string>) {
    const itemListElement = [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://propertysdeal.in',
      },
    ];

    let position = 2;

    // Add state breadcrumb
    itemListElement.push({
      '@type': 'ListItem',
      position: position++,
      name: 'Gujarat',
      item: 'https://propertysdeal.in/property-in-gujarat',
    });

    // Add city breadcrumb if applicable
    if (details.city) {
      itemListElement.push({
        '@type': 'ListItem',
        position: position++,
        name: variables.city,
        item: `https://propertysdeal.in/property-in-${details.city.slug}`,
      });
    }

    // Add locality breadcrumb if applicable
    if (details.locality) {
      itemListElement.push({
        '@type': 'ListItem',
        position: position++,
        name: variables.locality,
        item: `https://propertysdeal.in/property-in-${details.locality.slug}`,
      });
    }

    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement,
    };
  }

  private generateFaqSchema(faqs: { question: string; answer: string }[]) {
    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      })),
    };
  }

  private generateBlogPostingSchema(blog: any, slug?: string) {
    const safeSlug = (slug || blog?.slug || '').toLowerCase();
    const canonical = `https://propertysdeal.in/${safeSlug}`;
    return {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: blog.title,
      description: blog.meta_description || blog.metaDescription || blog.title,
      url: canonical,
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': canonical,
      },
      author: {
        '@type': 'Organization',
        name: 'Propertysdeal Editorial Team',
        url: 'https://propertysdeal.in',
      },
      publisher: {
        '@type': 'Organization',
        name: 'Propertysdeal',
        logo: {
          '@type': 'ImageObject',
          url: 'https://propertysdeal.in/assets/images/logo.png',
        },
      },
      datePublished: blog.created_at || '2026-07-25T00:00:00Z',
      dateModified: blog.updated_at || blog.created_at || '2026-07-25T00:00:00Z',
    };
  }

  private getDefaultAgentSchema(variables: Record<string, string>) {
    const locationName = variables.locality || variables.city || 'Gujarat';
    return {
      '@context': 'https://schema.org',
      '@type': 'RealEstateAgent',
      name: `Propertysdeal - Real Estate in ${locationName}`,
      image: 'https://propertysdeal.in/assets/images/logo.png',
      '@id': `https://propertysdeal.in/#realestateagent-${locationName.toLowerCase().replace(/\s+/g, '-')}`,
      url: 'https://propertysdeal.in',
      telephone: '+919999999999',
      priceRange: '$$',
      address: {
        '@type': 'PostalAddress',
        addressLocality: variables.city || 'Ahmedabad',
        addressRegion: 'Gujarat',
        addressCountry: 'IN',
      },
    };
  }
}
