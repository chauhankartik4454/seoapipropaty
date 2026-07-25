export type KeywordCategory =
  | 'HOMEPAGE'
  | 'CITY_PAGE'
  | 'LOCALITY_PAGE'
  | 'PROPERTY_TYPE'
  | 'LONG_TAIL'
  | 'BLOG';

export interface State {
  id: number;
  name: string;
  slug: string;
  created_at: Date;
  updated_at: Date;
}

export interface City {
  id: number;
  name: string;
  slug: string;
  state_id: number;
  created_at: Date;
  updated_at: Date;
}

export interface Locality {
  id: number;
  name: string;
  slug: string;
  city_id: number;
  created_at: Date;
  updated_at: Date;
}

export interface PropertyType {
  id: number;
  name: string;
  slug: string;
  created_at: Date;
  updated_at: Date;
}

export interface Keyword {
  id: number;
  phrase: string;
  slug: string;
  category: KeywordCategory;
  city_id: number | null;
  locality_id: number | null;
  property_type_id: number | null;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface SeoTemplate {
  id: number;
  category: KeywordCategory;
  title_template: string;
  meta_title_template: string;
  meta_description_template: string;
  h1_template: string;
  h2_template: string; // Store as JSON string array
  introduction_template: string;
  benefits_template: string;
  content_template: string;
  created_at: Date;
  updated_at: Date;
}

export interface SchemaTemplate {
  id: number;
  category: KeywordCategory;
  type: string; // e.g. LocalBusiness, FAQPage
  template_json: string;
  created_at: Date;
  updated_at: Date;
}

export interface Faq {
  id: number;
  question: string;
  answer: string;
  category: KeywordCategory;
  city_id: number | null;
  locality_id: number | null;
  property_type_id: number | null;
  created_at: Date;
  updated_at: Date;
}

export interface Blog {
  id: number;
  title: string;
  slug: string;
  content: string;
  meta_title: string | null;
  meta_description: string | null;
  created_at: Date;
  updated_at: Date;
}
