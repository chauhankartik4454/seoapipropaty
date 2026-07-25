-- 1. Create custom enum type for Keyword Categories
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'keyword_category') THEN
        CREATE TYPE keyword_category AS ENUM (
            'HOMEPAGE',
            'CITY_PAGE',
            'LOCALITY_PAGE',
            'PROPERTY_TYPE',
            'LONG_TAIL',
            'BLOG'
        );
    END IF;
END $$;

-- 2. States Table
CREATE TABLE IF NOT EXISTS states (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(150) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_states_slug ON states(slug);

-- 3. Cities Table
CREATE TABLE IF NOT EXISTS cities (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(150) UNIQUE NOT NULL,
    state_id INTEGER NOT NULL REFERENCES states(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_cities_slug ON cities(slug);
CREATE INDEX IF NOT EXISTS idx_cities_state ON cities(state_id);

-- 4. Localities Table
CREATE TABLE IF NOT EXISTS localities (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(150) UNIQUE NOT NULL,
    city_id INTEGER NOT NULL REFERENCES cities(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_localities_slug ON localities(slug);
CREATE INDEX IF NOT EXISTS idx_localities_city ON localities(city_id);

-- 5. Property Types Table
CREATE TABLE IF NOT EXISTS property_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(150) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_property_types_slug ON property_types(slug);

-- 6. Keywords Table
CREATE TABLE IF NOT EXISTS keywords (
    id SERIAL PRIMARY KEY,
    phrase VARCHAR(255) NOT NULL,
    slug VARCHAR(200) UNIQUE NOT NULL,
    category keyword_category NOT NULL,
    city_id INTEGER REFERENCES cities(id) ON DELETE SET NULL,
    locality_id INTEGER REFERENCES localities(id) ON DELETE SET NULL,
    property_type_id INTEGER REFERENCES property_types(id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_keywords_slug ON keywords(slug);
CREATE INDEX IF NOT EXISTS idx_keywords_category ON keywords(category);
CREATE INDEX IF NOT EXISTS idx_keywords_city ON keywords(city_id);
CREATE INDEX IF NOT EXISTS idx_keywords_locality ON keywords(locality_id);

-- 7. SEO Templates Table
CREATE TABLE IF NOT EXISTS seo_templates (
    id SERIAL PRIMARY KEY,
    category keyword_category UNIQUE NOT NULL,
    title_template VARCHAR(255) NOT NULL,
    meta_title_template VARCHAR(255) NOT NULL,
    meta_description_template TEXT NOT NULL,
    h1_template VARCHAR(255) NOT NULL,
    h2_template TEXT NOT NULL, -- JSON string array
    introduction_template TEXT NOT NULL,
    benefits_template TEXT NOT NULL,
    content_template TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_seo_templates_category ON seo_templates(category);

-- 8. Schema Templates Table
CREATE TABLE IF NOT EXISTS schema_templates (
    id SERIAL PRIMARY KEY,
    category keyword_category NOT NULL,
    type VARCHAR(100) NOT NULL,
    template_json TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(category, type)
);
CREATE INDEX IF NOT EXISTS idx_schema_templates_category ON schema_templates(category);

-- 9. FAQs Table
CREATE TABLE IF NOT EXISTS faqs (
    id SERIAL PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category keyword_category NOT NULL,
    city_id INTEGER REFERENCES cities(id) ON DELETE SET NULL,
    locality_id INTEGER REFERENCES localities(id) ON DELETE SET NULL,
    property_type_id INTEGER REFERENCES property_types(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_faqs_category ON faqs(category);
CREATE INDEX IF NOT EXISTS idx_faqs_city ON faqs(city_id);
CREATE INDEX IF NOT EXISTS idx_faqs_locality ON faqs(locality_id);

-- 10. Blogs Table
CREATE TABLE IF NOT EXISTS blogs (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(200) UNIQUE NOT NULL,
    content TEXT NOT NULL,
    meta_title VARCHAR(255),
    meta_description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_blogs_slug ON blogs(slug);
