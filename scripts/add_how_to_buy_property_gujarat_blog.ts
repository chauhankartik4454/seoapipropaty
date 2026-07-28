import { Pool } from 'pg';
import 'dotenv/config';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('DATABASE_URL environment variable is missing.');
  process.exit(1);
}

const pool = new Pool({ connectionString });

const blogContent = `# Complete Guide: How to Buy Property in Gujarat

Buying property is one of the most significant financial decisions you will make. Whether you're purchasing your first residential flat, a luxury villa, a residential NA plot, a commercial office, or an industrial factory shed, taking a structured approach reduces legal risks and protects your financial investment.

Gujarat is one of India's most dynamic real estate markets, driven by rapid urbanization, infrastructure expansion (Metro Rail, Expressways, GIFT City), industrial growth, and strong demand across major cities such as Ahmedabad, Surat, Vadodara, Gandhinagar, Rajkot, Anand, Bharuch, and Vapi.

---

## 10-Step Checklist: How to Buy Property in Gujarat

### Step 1: Define Property Purpose & Budget
- **Define Goal**: Self-use residence, rental income asset, long-term land investment, or business location.
- **Budget Setup**: Account for the core property cost + 4.9% Stamp Duty + 1% Registration fee + Legal fees + Society maintenance deposit + Interiors.

### Step 2: Location Selection & Connectivity Assessment
- Assess proximity to work hubs, top schools, multi-specialty hospitals, Metro stations, and highway connectivity.

### Step 3: Online Property Search & Site Visits
- Filter 100% verified listings on **PropertysDeal**.
- Visit properties in person to inspect construction quality, water supply, natural lighting, parking, and neighborhood environment.

### Step 4: Complete Legal Due Diligence
Verify all legal documents before paying any booking advance:
- **Title Search Report (30 Years)**: Certified by an advocate to prove clear marketable owner title.
- **Encumbrance Certificate (EC)**: Ensures zero pending bank mortgages or court attachments.
- **Collector NA Permission (Section 65)**: Required for non-agricultural plots and independent homes.
- **GUJRERA Registration**: Verify project details, RERA registration number, and possession deadlines on the official Gujarat RERA portal.
- **Occupancy Certificate (OC) / BU Permission**: Municipal certificate authorizing building occupancy.

### Step 5: Home Loan Pre-Approval & Documentation
- Apply for pre-approved home loans from leading banks (SBI, HDFC, ICICI, Bank of Baroda).
- Submit Income Tax Returns (3 years), 12-month bank statements, salary slips/business financials, and property chain deeds.

### Step 6: Agreement for Sale & Token Advance
- Sign an **Agreement for Sale** detailing the payment schedule, possession timeline, penalty clauses, and inclusion of parking/amenities.

### Step 7: Property Registration & Stamp Duty Payment in Gujarat
- Pay **4.9% Stamp Duty** (standard in Gujarat) + **1% Sub-Registrar Registration Fee**.
- Execute and register the final **Sale Deed** at the jurisdictional Sub-Registrar Office (SRO).

### Step 8: Post-Registration Mutation & Utility Transfer
- Apply for **Property Mutation (Property Card / e-Dhara 7/12 entry update)** in government revenue records.
- Transfer electricity meters (Torrent Power / UGVCL / DGVCL), municipal water connections, and society membership.

---

## Property Buying Guidelines for Different Asset Types

| Property Category | Key Legal Clearances Required | Essential Due Diligence Tips |
| --- | --- | --- |
| **Residential Flats / Apartments** | GUJRERA Approval, OC / BU Permission, Approved Building Plan | Verify carpet area, society maintenance rules, & parking allocation |
| **Residential NA Plots** | Collector NA Order (Sec 65), Approved Layout Plan, Property Card | Verify 9-18m road access, underground drainage & zoning rules |
| **Commercial Shops & Offices** | Commercial Zoning, Fire Safety NOC, Parking Clearance | Check footfall, CAM charges, signage rights & rental yields |
| **Industrial Land & Sheds** | GIDC Allotment / NA Industrial Order, GPCB Consent (CTE/CTO) | Verify HT power supply, effluent treatment & heavy vehicle roads |
| **Agricultural Farmland** | AnyRoR 7/12 & 8A Records, Ferfar (Mutation Entry No. 6) | Verify buyer Agriculturist Status under Section 63 Tenancy Act |

---

## Stamp Duty, Jantri Rates & Registration Fees in Gujarat

In Gujarat, property registration charges are calculated based on the higher of the **Actual Agreement Value** or the official **Government Jantri Rate**:
- **Stamp Duty**: Standard **4.9%** of property valuation.
- **Registration Fee**: Standard **1%** of property valuation (max caps apply for female buyers in specific schemes).
- **Sub-Registrar Fees**: Nominal computerization & processing fees.

---

## Common Mistakes to Avoid When Buying Property in Gujarat

1. **Paying cash advance without a written Agreement for Sale**.
2. **Skipping RERA registration verification on new under-construction projects**.
3. **Not checking Occupancy Certificate (OC) / BU Permission for ready-to-move flats**.
4. **Ignoring Common Area Maintenance (CAM) & hidden society transfer charges**.
5. **Purchasing agricultural land without verified Agriculturist Status**.

---

## Frequently Asked Questions (FAQs)

### 1. What is the stamp duty and registration fee for buying property in Gujarat?
The stamp duty in Gujarat is **4.9%** and the registration fee is **1%** of the higher value between the agreement price and the official government Jantri rate.

### 2. What is a Jantri Rate in Gujarat?
Jantri rate is the minimum government benchmark land/property rate set by the Gujarat Revenue Department for calculating stamp duty and registration fees.

### 3. What is the difference between carpet area and built-up area under RERA?
Under GUJRERA, carpet area is the net usable floor area of an apartment (excluding walls and balconies), and developers must quote prices based strictly on carpet area.

### 4. What is BU Permission in Gujarat?
BU (Building Use) Permission or Occupancy Certificate (OC) is an official certificate issued by local urban development authorities (AMC, SMC, VMC, RMC) certifying that the building was constructed according to approved plans and is safe for occupation.

### 5. How can I check RERA registered projects in Gujarat?
You can verify RERA registered projects, builder background, approved floor plans, and possession dates on the official **GUJRERA portal** (gujrera.gujarat.gov.in).

### 6. Can an NRI buy residential or commercial property in Gujarat?
Yes. NRIs and OCIs can freely purchase residential apartments, villas, commercial shops, and office spaces in Gujarat under RBI and FEMA regulations (excluding agricultural land).

### 7. What is Property Mutation in Gujarat?
Mutation is the official transfer of title ownership in municipal tax records (for urban flats) or Property Cards / e-Dhara 7/12 extracts (for plots and land).

### 8. Is a home loan available for under-construction properties?
Yes. Banks disburse home loans in construction-linked installment plans (CLP) approved by RERA.

### 9. What legal documents are required for home loan approval?
Registered Sale Deed, Chain Title Deeds, Approved Building Plan, RERA Registration, Index II, Salary Slips / ITR, and 12-month Bank Statements.

### 10. Why use PropertysDeal to find properties in Gujarat?
PropertysDeal provides 100% verified residential, commercial, industrial, and plot listings across Gujarat with authentic pricing, legal document verification support, and direct seller/builder contact.

---

## Conclusion & Next Steps

Buying property in Gujarat is a rewarding long-term investment when approached with careful planning and proper due diligence. Whether you're purchasing your first home, a residential plot, a commercial property, or an investment property, following a structured buying process helps reduce risk and improves confidence.

With PropertysDeal, buyers can explore verified property listings across Gujarat, compare options, connect directly with sellers, and access transparent information that supports informed real estate decisions.
`;

async function main() {
  console.log('Inserting How to Buy Property in Gujarat production SEO content...');
  const client = await pool.connect();

  try {
    const slugs = [
      'how-to-buy-property-in-gujarat',
      'how-to-buy-a-house-in-gujarat',
      'how-to-buy-a-flat-in-ahmedabad',
      'property-registration-process-gujarat',
      'first-time-home-buyer-guide-gujarat',
      'how-to-buy-land-in-gujarat',
      'property-investment-guide-gujarat',
      'home-loan-guide-gujarat',
      'residential-property-buying-guide-gujarat',
      'real-estate-buying-checklist-gujarat'
    ];

    const title = 'How to Buy Property in Gujarat | Complete Legal & Step-by-Step Guide';
    const metaTitle = 'How to Buy Property in Gujarat | Legal & Step-by-Step Buying Guide';
    const metaDescription = 'Complete 10-step guide to buying property in Gujarat. Learn about property verification, 4.9% stamp duty & Jantri rates, GUJRERA checks, home loans, and registration processes in Ahmedabad, Surat & Vadodara.';

    for (const slug of slugs) {
      await client.query(
        `INSERT INTO blogs (title, slug, content, meta_title, meta_description) 
         VALUES ($1, $2, $3, $4, $5) 
         ON CONFLICT (slug) DO UPDATE 
         SET title = EXCLUDED.title, content = EXCLUDED.content, meta_title = EXCLUDED.meta_title, meta_description = EXCLUDED.meta_description`,
        [title, slug, blogContent, metaTitle, metaDescription]
      );

      await client.query(
        `INSERT INTO keywords (phrase, slug, category, city_id, locality_id, property_type_id) 
         VALUES ($1, $2, $3, $4, $5, $6) 
         ON CONFLICT (slug) DO UPDATE SET category = 'BLOG'`,
        ['How to Buy Property in Gujarat', slug, 'BLOG', null, null, null]
      );
    }

    console.log('How to Buy Property in Gujarat content inserted successfully for all 10 slugs!');
  } catch (err) {
    console.error('Error inserting how to buy property content:', err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

main();
