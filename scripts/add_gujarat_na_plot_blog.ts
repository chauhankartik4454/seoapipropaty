import { Pool } from 'pg';
import 'dotenv/config';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('DATABASE_URL environment variable is missing.');
  process.exit(1);
}

const pool = new Pool({ connectionString });

const blogContent = `# NA Plot Gujarat

Gujarat has become one of India's fastest-growing real estate markets, with increasing demand for Non-Agricultural (NA) plots for residential, commercial, and investment purposes. Rapid urbanization, industrial growth, expressways, metro projects, and expanding town planning schemes have increased interest in NA plots across major cities such as Ahmedabad, Gandhinagar, Surat, Vadodara, Rajkot, Anand, Bharuch, Navsari, and Valsad.

An NA Plot is land legally converted from agricultural use to non-agricultural use under Section 65 of the Gujarat Land Revenue Code, making it 100% legal for approved residential, commercial, or industrial construction.

---

## Why Buy an NA Plot in Gujarat?

NA plots remain one of the most preferred real estate investments because they combine land ownership with clear legal development approvals.

### Key Benefits
- **Section 65 NA Conversion**: 100% legally converted for non-agricultural development.
- **Ready for Immediate Construction**: Ideal for independent houses, luxury villas, bungalows, or commercial units.
- **Bank Loan Eligibility**: Nationalized and private banks offer land purchase loans up to 75-80% for NA plots.
- **Higher Capital Appreciation**: Land value appreciates significantly faster than built apartments.
- **Clear Property Cards**: Gujarat Revenue Department issues Property Cards for urban NA land verification.

---

## Best Cities for Buying NA Plots in Gujarat

### 1. Ahmedabad & Outskirts
- **Key Locations**: South Bopal, Shela, Shilaj, Gota, Science City, SP Ring Road, Chandkheda, Vaishnodevi Circle.
- **Highlights**: Metro expansion, SP Ring Road commercial development, high residential demand.

### 2. Gandhinagar & GIFT City Influence Zone
- **Key Locations**: Raysan, Kudasan, Sargasan, Randesan, GIFT City corridor.
- **Highlights**: Planned government capital, global IFSC financial hub growth.

### 3. Surat
- **Key Locations**: Vesu, Pal, Adajan, Dumas Road, Althan, Jahangirpura.
- **Highlights**: Textile & Diamond hub expansion, Surat Airport expansion, BRTS networks.

### 4. Vadodara & Rajkot
- **Vadodara**: Sevasi, Bhayli, Gotri, Atladara, Kalali, Waghodia Road.
- **Rajkot**: Kalawad Road, Raiya Road, 150 Feet Ring Road, Mavdi, University Road.

---

## Types of NA Plots: Residential, Commercial & Township Plots

- **Residential NA Plots**: Permitted for single-family homes, luxury villas, duplexes, and weekend homes.
- **Commercial NA Plots**: Permitted for retail shops, office buildings, showrooms, hotels, and business parks.
- **Gated Township Plots**: Plotted developments with 9-18 meter internal roads, underground drainage, water supply, electricity networks, security gates, and clubhouses.

---

## Legal & Property Card Verification Checklist

Before purchasing an NA plot in Gujarat, complete this legal verification checklist:

### 1. Verification of Collector NA Permission (Section 65)
Confirm the official NA Order issued by the District Collector or Urban Development Authority (AUDA, SUDA, VUDA, RUDA) verifying non-agricultural conversion.

### 2. Property Card & Revenue Record Verification
- Verify the **Property Card** on the official Gujarat e-Dhara / AnyRoR portal.
- Check **Title Search Report (30 Years)** by an advocate to confirm zero bank mortgages or family ownership disputes.
- Verify **Approved Layout Plan** from the local urban development authority.
- Inspect **Zone Certificate** (R1 / R2 Residential Zone or Commercial Zone).

---

## Home Loan Guide for Approved NA Plots

Leading public and private banks (SBI, HDFC, ICICI, Bank of Baroda, Axis) offer plot purchase loans.

### Required Documentation
- Registered Sale Deed & Chain Title Records
- Collector NA Conversion Order & Approved Layout Plan
- Property Card / Revenue Records (7/12 & 8A extracts where applicable)
- Aadhaar Card, PAN Card, 3-Year ITR & 12-Month Bank Statements

---

## Features of Smart Gated NA Plot Townships in Gujarat

Modern plotted developments offer amenities comparable to luxury apartment complexes:
- 9-meter to 24-meter wide asphalt/paver roads with LED streetlights
- Underground drainage, water supply pipelines & underground electrical cables
- Grand entrance gate with 24/7 CCTV surveillance & security cabin
- Landscaped gardens, children's play area, jogging tracks & luxury clubhouse

---

## Frequently Asked Questions (FAQs)

### 1. What is an NA plot in Gujarat?
An NA (Non-Agricultural) plot is land that has been officially converted from agricultural to non-agricultural use under Section 65 of the Gujarat Land Revenue Code for approved residential or commercial construction.

### 2. Can I build a house on an NA plot in Gujarat?
Yes. Once you have an approved NA plot, you can construct an independent house, villa, or bungalow after obtaining building plan approval from the local municipal authority (AMC, SMC, VMC, RMC, AUDA, SUDA).

### 3. Which cities in Gujarat are best for NA plot investment?
Ahmedabad, Gandhinagar, Surat, Vadodara, Rajkot, Anand, Bharuch, Navsari, Mehsana, and Valsad.

### 4. Can I get a bank loan to purchase an NA plot in Gujarat?
Yes. Major banks offer plot purchase loans up to 75-80% of the property value for approved NA plots with clear title records.

### 5. What legal documents should I check before buying an NA plot?
Collector NA Conversion Order, Property Card / Revenue Records, Approved Layout Plan, 30-Year Title Search Report, Zoning Certificate, and Encumbrance Certificate.

### 6. What is a Property Card in Gujarat?
A Property Card is an official land ownership document issued by the Gujarat Revenue Department for urban non-agricultural properties, confirming plot size, survey number, and owner details.

### 7. What is the difference between R1 and R2 zone NA plots in Gujarat?
R1 zones allow higher density residential construction and higher FSI, whereas R2 zones are designated for lower density residential development.

### 8. Can NRIs buy NA plots in Gujarat?
Yes. NRIs can freely purchase non-agricultural (NA) residential and commercial plots in India under RBI and FEMA regulations.

### 9. What amenities are provided in gated NA plot projects?
Wide internal roads, underground drainage, water supply, electricity lines, streetlights, security gate, CCTV monitoring, gardens, and clubhouses.

### 10. Why search for NA plots in Gujarat on PropertysDeal?
PropertysDeal provides 100% verified NA plot listings in Gujarat with official Property Card details, approved layout maps, direct owner/developer contacts, and complete legal support.

---

## Conclusion & Next Steps

**NA Plot Gujarat** offers excellent opportunities for homebuyers, developers, and investors looking for legally approved residential or commercial land. Whether you're searching in Ahmedabad, Gandhinagar, Surat, Vadodara, Rajkot, Anand, Bharuch, Navsari, Mehsana, or Valsad, verified NA plots provide the flexibility to build homes, develop commercial projects, or invest for long-term growth.

With PropertysDeal, buyers can explore verified listings, compare projects, connect directly with property owners, and make confident real estate investment decisions across Gujarat.
`;

async function main() {
  console.log('Inserting NA Plot Gujarat production SEO content...');
  const client = await pool.connect();

  try {
    const slugs = [
      'na-plot-gujarat',
      'na-plot-for-sale-ahmedabad',
      'na-plot-gandhinagar',
      'residential-plot-surat',
      'commercial-na-plot-vadodara',
      'na-plot-rajkot',
      'villa-plot-gujarat',
      'gated-community-plot-gujarat',
      'investment-plot-gujarat',
      'approved-na-plot-gujarat'
    ];

    const title = 'NA Plot Gujarat | Buy Approved Residential & Commercial Land';
    const metaTitle = 'NA Plot Gujarat | Buy Approved Residential & Commercial Plots';
    const metaDescription = 'Explore verified NA plots for sale in Gujarat across Ahmedabad, Gandhinagar, Surat, Vadodara & Rajkot. Compare Section 65 approved residential & commercial plots, price trends, Property Cards, and loan guides.';

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
        ['NA Plot Gujarat', slug, 'BLOG', null, null, propTypeId]
      );
    }

    console.log('NA Plot Gujarat content inserted successfully for all 10 slugs!');
  } catch (err) {
    console.error('Error inserting NA plot content:', err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

main();
