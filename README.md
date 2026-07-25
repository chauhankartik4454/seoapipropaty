# Programmatic SEO Engine (Next.js 15 + Django Integration)

A highly scalable, production-ready Programmatic SEO (pSEO) API Engine built with **Next.js 15 (App Router)**, **TypeScript**, **Prisma ORM**, and **PostgreSQL**. This engine exposes high-performance API endpoints to serve SEO metadata, FAQs, breadcrumbs, and JSON-LD schema objects dynamically for a separate Django real estate application.

---

## 🏗️ Architecture & Integration Pattern

The engine runs as a decoupled microservice. When a user requests a landing page (e.g., `/property-in-ahmedabad`) on the main Django website, Django calls the Next.js API in the background, retrieves the formatted SEO data, and renders the HTML server-side.

```text
                    User
                      │
                      ▼
https://propertysdeal.in/property-in-ahmedabad
                      │
                      ▼
             Existing Django Website (Backend)
                      │
                      ▼
requests.get("https://seo-api.domain.com/api/seo/property-in-ahmedabad")
                      │
                      ▼
          Next.js SEO Engine API
                      │
      ┌───────────────┴─────────────────────┐
      │                                     │
      ▼                                     ▼
Slug Parser                      PostgreSQL Database
      │                                     │
      ├──────────────┐                      │
      ▼              ▼                      ▼
Keyword Parser   Location Parser     SEO Templates
      │                                     │
      └──────────────┬──────────────────────┘
                     ▼
             SEO Generator Service
                     │
          ┌──────────┼──────────┐
          ▼          ▼          ▼
      Meta Tags   JSON-LD   Canonical
                     │
                     ▼
             JSON Response (200 OK)
                     │
                     ▼
          Django HTML Rendering
                     │
                     ▼
                   User
```

---

## 📂 Project Directory Structure

```text
seo-engine/
├── app/
│   └── api/
│       └── seo/
│           └── [slug]/
│               └── route.ts         # Route handler (Controller) with validation and rate limiting
├── config/
├── lib/
│   ├── cache.ts                     # High-performance caching (Redis + In-memory fallback)
│   ├── logger.ts                    # Structured JSON production logger
│   └── db.ts                        # PostgreSQL client connection pool
├── sql/
│   └── schema.sql                   # Raw SQL database schema and index definitions
├── scripts/
│   └── seed.ts                      # Raw SQL database schema initializer and seeder
├── repositories/
│   ├── keyword.repository.ts        # Data access logic for Keywords, Property Types, and Blogs
│   ├── location.repository.ts       # Data access logic for States, Cities, and Localities
│   └── template.repository.ts       # Data access logic for SEO and Schema templates
├── services/
│   ├── faq.service.ts               # Fetches and compiles context-aware FAQs
│   ├── keyword.service.ts           # Enforces strict page validation
│   ├── schema.service.ts            # Generates Breadcrumbs, FAQ, and Business JSON-LD schemas
│   ├── seo.service.ts               # Orchestrator combining templates, schemas, and queries
│   ├── slug.service.ts              # Parses slug metadata and resolves entities
│   └── template.service.ts          # Compiles and interpolates SEO templates
├── utils/
│   ├── formatter.ts                 # Capitalization, currency, and template string parser
│   └── parser.ts                    # Regex metadata extractor and slug lookups
├── .env.example
├── Dockerfile
├── docker-compose.yml
├── next.config.ts
├── package.json
└── tsconfig.json
```

---

## 🛠️ Local Development & Setup

### Prerequisites
- Node.js (v20+)
- PostgreSQL Database
- Redis Caching Server (Optional, local memory cache used as fallback)

### Step-by-Step Setup

1. **Clone the project and navigate to the root directory**:
   ```bash
   cd abcd
   ```

2. **Install all dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy `.env.example` to `.env` and configure your credentials:
   ```bash
   cp .env.example .env
   ```
   *Example configuration:*
   ```ini
   DATABASE_URL="postgresql://postgres:postgrespassword@localhost:5432/seo_engine?schema=public"
   REDIS_URL="redis://localhost:6379"
   NODE_ENV="development"
   PORT=3000
   RATE_LIMIT_WINDOW_MS=60000
   RATE_LIMIT_MAX_REQUESTS=100
   ```

4. **Initialize and Seed the Database**:
   Set up database tables, indices, and populate default seed data by running:
   ```bash
   npm run seed
   ```

6. **Start Development Server**:
   ```bash
   npm run dev
   ```
   The server will start at `http://localhost:3000`.

---

## 🐳 Docker Deployment

The project contains Docker configurations to spin up PostgreSQL, Redis, and the Next.js API in a single command.

1. **Start all services via Docker Compose**:
   ```bash
   docker-compose up -d --build
   ```

2. **Run Migrations and Seed Database in Docker**:
   ```bash
   docker exec -it seo-next-api npm run seed
   ```

3. The API will be accessible on `http://localhost:3000/api/seo/[slug]`.

---

## 📖 API Documentation

### Get SEO Metadata for a Page

Retrieves the dynamically generated and compiled meta tags, header content, FAQs, breadcrumbs, and schema.org JSON-LD definitions.

- **URL Endpoint**: `/api/seo/:slug`
- **Method**: `GET`
- **Headers**:
  - `Content-Type: application/json`

#### Valid URL Patterns
The slug parser supports:
1. **State/Homepage**: `property-in-gujarat`, `real-estate-gujarat`
2. **City Landing Pages**: `property-in-ahmedabad`, `property-in-surat`
3. **Locality Pages**: `flat-for-sale-in-sg-highway`, `property-in-prahlad-nagar-ahmedabad`
4. **Property Type pages**: `villa-for-sale-vadodara`, `shop-for-sale-surat`
5. **Long-Tail Search queries**: `2bhk-flat-under-50-lakh-ahmedabad`
6. **Blogs / Information guides**: `property-rates-in-bopal-2026`

#### Response Code Summary
- **`200 OK`**: Valid page found and compiled.
- **`404 Not Found`**:
  - Slug is structurally invalid (e.g. contains special symbols).
  - The parsed City or Locality does not exist in the database.
  - Slug is not registered in the database (protects from random generation).
- **`429 Too Many Requests`**: Client IP has exceeded the allowed requests/minute window.
- **`500 Internal Server Error`**: Unexpected database or server error.

#### Sample JSON Response (`GET /api/seo/2bhk-flat-under-50-lakh-ahmedabad`)

```json
{
  "title": "2BHK Flat under ₹50 Lakh in Ahmedabad | Buy Flat in Ahmedabad",
  "meta_title": "Buy 2BHK Flat under ₹50 Lakh in Ahmedabad",
  "meta_description": "Verified listings for 2BHK Flat under ₹50 Lakh in Ahmedabad. Discover ready-to-move properties, amenities, and builder details.",
  "h1": "2BHK Flat under ₹50 Lakh in Ahmedabad",
  "h2": [
    "Overview of 2BHK Flats under ₹50 Lakh in Ahmedabad",
    "Smart Living and ROI Potential in Ahmedabad"
  ],
  "content": "Are you searching for a 2BHK Flat in Ahmedabad priced under ₹50 Lakh? We have curated the best listings that perfectly match your query.\n\nThis configuration offers the optimal balance of space, affordability, and modern community amenities inside Ahmedabad.\n\nOur team has verified these 2BHK configurations to verify compliance with RERA and secure property documentation.",
  "faq": [
    {
      "question": "Can I find a verified 2BHK Flat in Ahmedabad under ₹50 Lakh?",
      "answer": "Yes! There are several projects in Ahmedabad that offer 2BHK Flats within ₹50 Lakh. Always verify developer RERA certifications and NA plot documentation."
    }
  ],
  "breadcrumbs": [
    {
      "name": "Home",
      "url": "https://propertysdeal.in"
    },
    {
      "name": "Gujarat",
      "url": "https://propertysdeal.in/property-in-gujarat"
    },
    {
      "name": "Ahmedabad",
      "url": "https://propertysdeal.in/property-in-ahmedabad"
    },
    {
      "name": "2BHK Flat under ₹50 Lakh in Ahmedabad | Buy Flat in Ahmedabad",
      "url": "https://propertysdeal.in/2bhk-flat-under-50-lakh-ahmedabad"
    }
  ],
  "canonical": "https://propertysdeal.in/2bhk-flat-under-50-lakh-ahmedabad",
  "open_graph": {
    "og:title": "Buy 2BHK Flat under ₹50 Lakh in Ahmedabad",
    "og:description": "Verified listings for 2BHK Flat under ₹50 Lakh in Ahmedabad. Discover ready-to-move properties, amenities, and builder details.",
    "og:url": "https://propertysdeal.in/2bhk-flat-under-50-lakh-ahmedabad",
    "og:type": "website",
    "og:image": "https://propertysdeal.in/assets/images/og-default.jpg"
  },
  "twitter": {
    "twitter:card": "summary_large_image",
    "twitter:title": "Buy 2BHK Flat under ₹50 Lakh in Ahmedabad",
    "twitter:description": "Verified listings for 2BHK Flat under ₹50 Lakh in Ahmedabad. Discover ready-to-move properties, amenities, and builder details.",
    "twitter:image": "https://propertysdeal.in/assets/images/og-default.jpg"
  },
  "schema": {
    "breadcrumbs": {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://propertysdeal.in"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Gujarat",
          "item": "https://propertysdeal.in/property-in-gujarat"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Ahmedabad",
          "item": "https://propertysdeal.in/property-in-ahmedabad"
        }
      ]
    },
    "faq": {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Can I find a verified 2BHK Flat in Ahmedabad under ₹50 Lakh?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes! There are several projects in Ahmedabad that offer 2BHK Flats within ₹50 Lakh. Always verify developer RERA certifications and NA plot documentation."
          }
        }
      ]
    },
    "realestateagent": {
      "@context": "https://schema.org",
      "@type": "RealEstateAgent",
      "name": "Propertysdeal - Real Estate in Ahmedabad",
      "image": "https://propertysdeal.in/assets/images/logo.png",
      "@id": "https://propertysdeal.in/#realestateagent-ahmedabad",
      "url": "https://propertysdeal.in",
      "telephone": "+919999999999",
      "priceRange": "$$",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Ahmedabad",
        "addressRegion": "Gujarat",
        "addressCountry": "IN"
      }
    }
  }
}
```

---

## 🔒 Security Best Practices Implemented
1. **XSS Protection**: String slugs are rigorously sanitized using Zod schemas matching only lowercase alphanumeric characters and single dashes.
2. **SQL Injection Protection**: Fully parameterized queries generated automatically by Prisma ORM.
3. **Rate Limiting**: Integrated slide-window rate limiter per client IP to safeguard against scraper DDoS loads.
4. **Environment Security**: Sensitive keys and database configs are separated from the code repositories.
