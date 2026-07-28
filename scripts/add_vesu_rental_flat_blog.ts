import { Pool } from 'pg';
import 'dotenv/config';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('DATABASE_URL environment variable is missing.');
  process.exit(1);
}

const pool = new Pool({ connectionString });

const blogContent = `# Rental Flats in Vesu, Surat

Vesu is one of Surat's most sought-after residential neighborhoods for tenants looking for modern apartments, premium amenities, and excellent connectivity. The locality is popular among professionals, business owners, families, students, and NRIs because of its well-planned infrastructure and proximity to commercial hubs.

Whether you are searching for a 1 BHK, 2 BHK, 3 BHK, or luxury 4 BHK apartment, Vesu offers a wide range of rental options including fully furnished, semi-furnished, and unfurnished flats. Rental listings are available across numerous gated communities and modern apartment complexes.

---

## Why Rent a Flat in Vesu, Surat?

Vesu combines convenience with a premium lifestyle.

### Key Benefits
- **Excellent road connectivity via VIP Road & Dumas Road**
- **Proximity to Surat International Airport & Magdalla Port**
- **Premium gated residential societies with 24/7 security**
- **Reputed international schools (DPS, GD Goenka) and universities**
- **Multi-specialty hospitals and healthcare facilities**
- **Shopping malls, cafes, fine dining, and retail hubs**
- **Safe, family-friendly, and green environment**

The locality's proximity to corporate business parks and major transport corridors makes it especially attractive for working professionals.

---

## Apartment Configurations & Furnishing Types

### 1 BHK Rental Flats
- **Ideal for**: Students, single IT/diamond professionals, and young couples.
- **Rent Range**: ₹17,000 – ₹22,000 / month.

### 2 BHK Rental Apartments
- **Ideal for**: Small families, corporate employees, and working couples.
- **Rent Range**: ₹22,000 – ₹35,000 / month.

### 3 BHK & 4 BHK Luxury Apartments
- **Ideal for**: Growing families, corporate executives, business owners, and NRIs.
- **Rent Range**: ₹28,000 – ₹1,00,000+ / month.

### Furnishing Options
- **Fully Furnished**: Includes beds, sofas, dining set, modular kitchen, ACs, TV, refrigerator, and washing machine.
- **Semi-Furnished**: Includes modular kitchen, wardrobes, light fixtures, fans, geysers, and storage.
- **Unfurnished**: Blank canvas for tenants with their own furniture.

---

## Popular Residential Societies for Rent in Vesu

- **Happy Home Nandanvan**
- **Green Swapnabhoomi**
- **Aagam Siddhi**
- **Raghuvir Shrungar Residency**
- **Samarth Enclave**

These gated societies feature 24/7 security, swimming pools, fitness centres, children's play areas, and landscaped gardens.

---

## Rental Price Breakdown in Vesu

| Property Type | Unfurnished / Semi-Furnished | Fully Furnished |
| --- | --- | --- |
| **1 BHK Flat** | ₹15,000 – ₹18,000 / mo | ₹18,000 – ₹22,000 / mo |
| **2 BHK Flat** | ₹20,000 – ₹28,000 / mo | ₹28,000 – ₹35,000 / mo |
| **3 BHK Flat** | ₹28,000 – ₹42,000 / mo | ₹42,000 – ₹55,000 / mo |
| **4 BHK Luxury Flat** | ₹50,000 – ₹75,000 / mo | ₹75,000 – ₹1,20,000+ / mo |

---

## Tenant Documentation & Agreement Process in Surat

Landlords in Surat typically require the following documentation before executing a lease:

### Required Tenant Documents
- Aadhaar Card & PAN Card (Identity & Address Proof)
- Passport / Employment Offer Letter / Company ID
- Salary Slips (3 Months) or Bank Statements
- Passport-size Photographs
- Police Verification Form (standard requirement in Gujarat)

### Standard Lease Agreement Terms
- **Agreement Duration**: 11-Month Leave-and-License Agreement (renewable).
- **Security Deposit**: 2 to 6 months' rent (refundable upon vacating).
- **Notice Period**: 1 to 2 months prior written notice.
- **Annual Escalation**: 5% to 10% rent increment upon renewal.

---

## Smart Home Features & Sustainable Community Living

Modern rental apartments in Vesu offer tech and eco-friendly conveniences:
- Digital Door Locks, Video Intercom & App-Based Security
- Rainwater Harvesting, Solar Power Common Lighting & Waste Segregation
- High-Speed Fiber Internet & CCTV Surveillance

---

## Corporate Leasing & NRI Rental Support

Vesu is the premier corporate rental hub in Surat.

### Services Available
- Corporate lease agreement execution & direct company billing
- Remote virtual video walkthroughs for NRI tenants
- Professional property management & housekeeping coordination

---

## Frequently Asked Questions (FAQs)

### 1. Why should I rent an apartment in Vesu, Surat?
Vesu offers Surat's most premium residential infrastructure, top international schools, direct airport connectivity, gated security, and a vibrant social lifestyle.

### 2. What is the average rent for a 2 BHK flat in Vesu?
Average rent for a 2 BHK apartment in Vesu ranges from ₹22,000 for semi-furnished to ₹35,000 for fully furnished flats in prime gated societies.

### 3. What documents are required for renting a flat in Vesu?
Aadhaar Card, PAN Card, Employment Offer Letter / Company ID, Police Verification Form, and passport-size photographs.

### 4. What security deposit is standard in Vesu, Surat?
Landlords in Vesu typically ask for 2 to 4 months' rent as a refundable security deposit.

### 5. Are fully furnished flats available for rent in Vesu?
Yes. Vesu has extensive inventory of fully furnished 1, 2, 3, and 4 BHK luxury apartments equipped with ACs, TV, modular kitchen, and furniture.

### 6. Which road corridors in Vesu have the best rental demand?
VIP Road, Dumas Road, Vesu Canal Road, and University Road corridors.

### 7. Are pets allowed in rental flats in Vesu?
Pet policies vary by society and landlord. Many modern gated societies allow pets with prior owner approval.

### 8. What amenities are included in Vesu gated societies?
Clubhouse, swimming pool, gymnasium, children's play area, landscaped gardens, 24/7 security, power backup, and covered parking.

### 9. Can corporate companies execute leases for their employees in Vesu?
Yes. Many landlords in Vesu welcome corporate leases signed directly with registered companies.

### 10. Why search for rental flats in Vesu on PropertysDeal?
PropertysDeal provides 100% verified rental flat listings in Vesu with direct owner contacts, transparent rent details, HD photos, and complete agreement support.

---

## Conclusion & Next Steps

**Rental Flats in Vesu, Surat** offer an excellent combination of convenience, comfort, and premium urban living. Whether you're searching for a 1 BHK, 2 BHK, 3 BHK, or luxury 4 BHK apartment, Vesu provides modern homes with quality amenities, excellent connectivity, and a vibrant community.

With PropertysDeal, you can explore verified rental listings, compare apartments, connect directly with owners and agents, and confidently choose the right rental home for your needs.
`;

async function main() {
  console.log('Inserting Rental Flats in Vesu, Surat production SEO content...');
  const client = await pool.connect();

  try {
    const slugs = [
      'rental-flats-in-vesu-surat',
      'flat-for-rent-in-vesu-surat',
      'flats-for-rent-in-vesu',
      '2bhk-flat-for-rent-in-vesu',
      '3bhk-flat-for-rent-in-vesu',
      'luxury-rental-flats-in-vesu',
      'fully-furnished-flats-in-vesu',
      'semi-furnished-flats-in-vesu',
      'rental-apartments-near-vip-road',
      'flat-for-rent-in-vesu'
    ];

    const title = 'Rental Flats in Vesu, Surat | 1, 2, 3 & 4 BHK Furnished Apartments for Rent';
    const metaTitle = 'Rental Flats in Vesu, Surat | 1, 2, 3 & 4 BHK Apartments for Rent';
    const metaDescription = 'Explore verified rental flats in Vesu, Surat. Compare fully furnished & semi-furnished 1 BHK, 2 BHK & 3 BHK apartments for rent, price trends, lease guides, and owner contacts.';

    for (const slug of slugs) {
      await client.query(
        `INSERT INTO blogs (title, slug, content, meta_title, meta_description) 
         VALUES ($1, $2, $3, $4, $5) 
         ON CONFLICT (slug) DO UPDATE 
         SET title = EXCLUDED.title, content = EXCLUDED.content, meta_title = EXCLUDED.meta_title, meta_description = EXCLUDED.meta_description`,
        [title, slug, blogContent, metaTitle, metaDescription]
      );

      const cityRes = await client.query("SELECT id FROM cities WHERE slug = 'surat'");
      const cityId = cityRes.rows[0]?.id || null;

      const localityRes = await client.query("SELECT id FROM localities WHERE slug = 'vesu'");
      const localityId = localityRes.rows[0]?.id || null;

      const propRes = await client.query("SELECT id FROM property_types WHERE slug = 'flat'");
      const propTypeId = propRes.rows[0]?.id || null;

      await client.query(
        `INSERT INTO keywords (phrase, slug, category, city_id, locality_id, property_type_id) 
         VALUES ($1, $2, $3, $4, $5, $6) 
         ON CONFLICT (slug) DO UPDATE SET category = 'BLOG'`,
        ['Rental Flats in Vesu Surat', slug, 'BLOG', cityId, localityId, propTypeId]
      );
    }

    console.log('Rental Flats in Vesu, Surat content inserted successfully for all 10 slugs!');
  } catch (err) {
    console.error('Error inserting Vesu rental flats content:', err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

main();
