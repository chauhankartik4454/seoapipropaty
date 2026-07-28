import { Pool } from 'pg';
import 'dotenv/config';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('DATABASE_URL environment variable is missing.');
  process.exit(1);
}

const pool = new Pool({ connectionString });

const blogContent = `# Agricultural Land for Sale Gujarat

Gujarat is one of India's leading agricultural states, offering diverse opportunities for farming, horticulture, dairy, organic cultivation, and agri-business investments. With eight agro-climatic zones, extensive cultivable land, and major irrigation initiatives (Narmada canal network, drip irrigation, check dams), the state supports cash crops and food grains such as cotton, groundnut, wheat, cumin, castor, banana, mango, onion, vegetables, and sugarcane.

Whether you're looking for fertile cultivable farmland, irrigated agricultural land with borewells, mango/banana orchards, organic farming land, or long-term agricultural investment, Gujarat provides options across top farming districts.

---

## Why Buy Agricultural Land in Gujarat?

Agricultural land in Gujarat provides strong farming yields, water security, and long-term land appreciation.

### Key Benefits
- **8 agro-climatic zones supporting multi-crop farming year-round**
- **Extensive Narmada Canal & drip irrigation networks**
- **India's leading producer of Cotton, Groundnut, Cumin, Castor & Dates**
- **Integrated Dairy Ecosystem (Amul & Banas Dairy networks)**
- **Growing market for certified organic farming & horticulture**
- **Digitized land records via AnyRoR Gujarat Revenue portal**
- **High capital appreciation & agri-business growth opportunities**

---

## Best Agricultural Districts for Farmland in Gujarat

### 1. Anand & Kheda (Charotar Belt)
- **Crops**: Tobacco, banana, vegetables, paddy, dairy farming.
- **Highlights**: Ultra-fertile alluvial soil, 100% canal/borewell irrigation, Amul dairy network.

### 2. Bharuch & Surat (South Gujarat)
- **Crops**: Sugarcane, banana, mango orchards, cotton, floriculture.
- **Highlights**: Heavy rainfall, Narmada river irrigation, proximity to ports for export.

### 3. Rajkot, Junagadh & Amreli (Saurashtra Region)
- **Crops**: Groundnut, cotton, Kesar mango (Junagadh), cumin, castor, onion.
- **Highlights**: Major APMC trading yards, orchard belts, groundnut oil industry.

### 4. Banaskantha & Sabarkantha (North Gujarat)
- **Crops**: Potato, cumin, isabgol, mustard, dairy fodder crops.
- **Highlights**: Banas Dairy network, extensive drip irrigation adoption.

### 5. Ahmedabad Outskirts & Kutch
- **Crops**: Wheat, cotton, date palm (Kutch), castor, pomegranate, organic vegetables.
- **Highlights**: Close proximity to APMC Ahmedabad wholesale markets and urban consumers.

---

## Types of Agricultural Land Available

- **Cultivable Farmland**: Open fertile soil suitable for seasonal cash crops (cotton, groundnut, wheat).
- **Irrigated Agricultural Land**: Equipped with active borewells, motor pumps, canal water access, and drip systems.
- **Orchard Property**: Established fruit plantations (Mango, Banana, Chikoo, Lemon, Pomegranate).
- **Organic Farming Land**: Certified chemical-free land suitable for natural farming & organic vegetables.

---

## Legal & Revenue Verification Checklist (AnyRoR Gujarat)

Before executing any agricultural land purchase agreement in Gujarat, verify:

### 1. Verification of AnyRoR Online Revenue Records
- **7/12 Extract (Satbara Utara)**: Confirms exact land owner names, total area (Hectares/Ares), survey/block numbers, and cultivated crops.
- **8A Extract**: Verifies total agricultural landholding details of the seller.
- **Ferfar (Mutation Entry No. 6)**: Details historical land transactions, inheritances, gift deeds, or court stays.

### 2. Agriculturist Status Requirement (Gujarat Tenancy & Agricultural Lands Act)
- Under Section 63 of the Gujarat Tenancy and Agricultural Lands Act, **only a verified Agriculturist** (person already holding agricultural land in Gujarat or India) can purchase agricultural land.
- Non-agriculturists must obtain prior permission from the District Collector or use approved government schemes before buying farmland.

---

## Agricultural Finance & Bank Loan Guide

Nationalized and cooperative banks offer Kisan Credit Card (KCC) loans, Farm Development Loans, and Land Purchase Finance.

### Required Documentation
- 7/12, 8A, & Mutation Extracts (AnyRoR Certified)
- Farmer ID / Agriculturist Certificate
- Land Valuation & Boundary Survey Map
- Aadhaar Card, PAN Card, & Bank Statements (12 Months)

---

## Smart Farm Infrastructure & Organic Management

Modern agricultural properties in Gujarat are equipped with precision farming infrastructure:
- Solar Water Pumping Systems & Automated Drip/Sprinkler Irrigation
- Farm Ponds (Khet Talavadi), Check Dams & Water Storage Tanks
- Polyhouse / Greenhouse Protected Cultivation & Farm Storage Warehouses
- Farm Management & Organic Certification Services

---

## Frequently Asked Questions (FAQs)

### 1. Who can buy agricultural land in Gujarat?
Under Section 63 of the Gujarat Tenancy Act, only a legally recognized Agriculturist (someone who owns agricultural land in India) can purchase agricultural land in Gujarat.

### 2. How can I verify land records for agricultural land in Gujarat?
You can verify official 7/12 (Satbara), 8A, and Mutation (Ferfar) records online on the official Gujarat Government **AnyRoR portal** (anyror.gujarat.gov.in).

### 3. Which districts in Gujarat are best for agricultural land purchase?
Anand, Bharuch, Rajkot, Junagadh, Surat, Banaskantha, Ahmedabad, and Vadodara.

### 4. What is a 7/12 extract in Gujarat?
The 7/12 extract is an official revenue document detailing land survey numbers, owner names, land area, irrigation sources, active crop types, and encumbrances.

### 5. Can NRIs buy agricultural land in Gujarat?
No. Foreign Exchange Management Act (FEMA) and RBI guidelines strictly prohibit NRIs / OCIs from purchasing agricultural land, plantation property, or farmhouses in India.

### 6. Are bank home/farm loans available for purchasing agricultural land?
Yes. Banks provide agricultural land purchase loans and Kisan Credit Card (KCC) solar/irrigation development loans for eligible agriculturists.

### 7. What crops yield the highest returns in Gujarat farmland?
Cotton, groundnut, cumin, castor, banana, Kesar mango orchards, potato, and organic vegetables.

### 8. What water sources should I check before buying farmland?
Check active borewell depth (feet), water TDS levels, Narmada canal availability, drip irrigation setup, and local water table status.

### 9. What is a Khet Talavadi (Farm Pond)?
A rain-water harvesting pond excavated inside farmland to store rainwater for irrigation during dry months.

### 10. Why search for agricultural land in Gujarat on PropertysDeal?
PropertysDeal provides 100% verified agricultural land listings in Gujarat with certified AnyRoR 7/12 details, borewell water data, direct farmer contacts, and complete revenue legal guidance.

---

## Conclusion & Next Steps

**Agricultural Land for Sale in Gujarat** offers excellent opportunities for farmers, agribusiness owners, orchard developers, and long-term investors. Whether you are searching for cultivable farmland, irrigated agricultural land, orchard property, organic farming land, or commercial agricultural investment, Gujarat provides diverse options across Ahmedabad, Anand, Bharuch, Rajkot, Junagadh, Surat, Vadodara, Banaskantha, Mehsana, and Kutch.

With PropertysDeal, buyers can explore verified agricultural properties, compare land options, connect directly with sellers, and confidently invest in one of India's leading agricultural states.
`;

async function main() {
  console.log('Inserting Agricultural Land for Sale Gujarat production SEO content...');
  const client = await pool.connect();

  try {
    const slugs = [
      'agricultural-land-for-sale-gujarat',
      'agricultural-land-in-gujarat',
      'farm-land-for-sale-in-gujarat',
      'cultivable-land-for-sale-in-gujarat',
      'irrigated-farm-land-in-gujarat',
      'orchard-land-for-sale-in-anand',
      'agricultural-land-for-sale-in-ahmedabad',
      'farm-land-for-sale-in-rajkot',
      'agricultural-land-for-sale-in-surat',
      'organic-farming-land-in-gujarat'
    ];

    const title = 'Agricultural Land for Sale in Gujarat | Irrigated Farmland & Orchards';
    const metaTitle = 'Agricultural Land for Sale in Gujarat | Buy Farmland & Orchards';
    const metaDescription = 'Explore verified agricultural land for sale in Gujarat across Anand, Bharuch, Ahmedabad, Rajkot & Junagadh. Compare irrigated farmland, mango/banana orchards, AnyRoR 7/12 records, and legal guides.';

    for (const slug of slugs) {
      await client.query(
        `INSERT INTO blogs (title, slug, content, meta_title, meta_description) 
         VALUES ($1, $2, $3, $4, $5) 
         ON CONFLICT (slug) DO UPDATE 
         SET title = EXCLUDED.title, content = EXCLUDED.content, meta_title = EXCLUDED.meta_title, meta_description = EXCLUDED.meta_description`,
        [title, slug, blogContent, metaTitle, metaDescription]
      );

      const propRes = await client.query("SELECT id FROM property_types WHERE slug = 'plot'");
      const propTypeId = propRes.rows[0]?.id || null;

      await client.query(
        `INSERT INTO keywords (phrase, slug, category, city_id, locality_id, property_type_id) 
         VALUES ($1, $2, $3, $4, $5, $6) 
         ON CONFLICT (slug) DO UPDATE SET category = 'BLOG'`,
        ['Agricultural Land Gujarat', slug, 'BLOG', null, null, propTypeId]
      );
    }

    console.log('Agricultural Land for Sale Gujarat content inserted successfully for all 10 slugs!');
  } catch (err) {
    console.error('Error inserting Gujarat agricultural land content:', err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

main();
