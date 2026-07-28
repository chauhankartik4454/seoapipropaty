import { Pool } from 'pg';
import 'dotenv/config';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('DATABASE_URL environment variable is missing.');
  process.exit(1);
}

const pool = new Pool({ connectionString });

const blogContent = `# How to Verify Property in Gujarat: Legal Due Diligence, Land Records & Title Search Guide

Purchasing real estate—whether a residential flat in Ahmedabad, a villa in Surat, an NA plot in Gandhinagar, a commercial office, or agricultural farmland—requires rigorous legal verification. Conducting thorough legal due diligence before paying booking advances prevents property fraud, boundary disputes, hidden mortgages, and illegal construction risks.

This comprehensive guide outlines the step-by-step property legal verification process in Gujarat, covering **AnyRoR online land records (7/12 & Property Cards)**, **Collector NA permissions**, **30-year title searches**, **GUJRERA registration checks**, and **Sub-Registrar encumbrance verification**.

---

## 10-Step Legal Property Verification Checklist in Gujarat

| Step # | Verification Task | Key Document / Portal | Verification Goal |
| --- | --- | --- | --- |
| **1** | **Seller Ownership Verification** | Aadhaar, PAN, Sale Deed | Verify seller identity & co-owner consents |
| **2** | **30-Year Title Search** | Chain Sale Deeds, Mother Deed | Ensure unbroken, marketable owner title |
| **3** | **AnyRoR Land Records** | 7/12 (Satbara), 8A, Ferfar | Check owner names, survey #, & mutations |
| **4** | **Property Card Check** | Urban Property Card | Verify municipal boundary & plot ownership |
| **5** | **Collector NA Order Check** | Section 65 NA Order | Confirm non-agricultural conversion validity |
| **6** | **Encumbrance Check (EC)** | Sub-Registrar EC Certificate | Ensure zero pending bank loans or court stays |
| **7** | **GUJRERA Project Check** | gujrera.gujarat.gov.in | Verify approved plans & possession dates |
| **8** | **Building Use (BU) Permission**| Municipal OC / BU Certificate | Confirm building safety & legal occupation |
| **9** | **Municipal Dues Check** | Tax & Utility Receipts | Ensure zero pending property tax or CAM dues |
| **10**| **Physical Site Survey** | Licensed Surveyor Measurement | Verify physical boundaries vs approved plan |

---

## How to Check Gujarat Land Records Online (AnyRoR & e-Dhara)

The Revenue Department of Gujarat provides official digital records through the **AnyRoR portal** (anyror.gujarat.gov.in):
1. **7/12 Extract (Satbara Utara)**: Confirms land owner names, survey/block numbers, total area in hectares/ares, irrigation sources, and active encumbrances.
2. **8A Record**: Summarizes all landholdings of an individual within a specific village.
3. **Ferfar (Mutation Entry No. 6)**: Details historical ownership transfers, sales, inheritances, and gift deeds.
4. **Property Card**: The official urban land record confirming non-agricultural plot boundaries and city survey numbers.

---

## Agricultural vs NA Land Verification Rules in Gujarat

### 1. Agricultural Farmland
- Under **Section 63 of the Gujarat Tenancy Act**, ONLY a legally certified **Agriculturist** can purchase agricultural land in Gujarat.
- Verify 7/12 records, 8A extracts, and ensure no government ceiling/tribal land restrictions (Section 73AA) apply.

### 2. NA (Non-Agricultural) Land
- Verify the **Section 65 NA Conversion Order** issued by the District Collector or Urban Development Authority (AUDA, SUDA, VUDA, RUDA).
- Confirm the specific NA classification: **R1/R2 Residential Zone**, **Commercial Zone**, or **Industrial Zone**.

---

## Top 5 Property Fraud Scenarios & How to Prevent Them

1. **Fake Title / Duplicate Sale**: Fraudster sells a property using forged documents.
   - *Prevention*: Always request a 30-year certified **Title Search Report** from an advocate and verify Sub-Registrar records.
2. **Unapproved Layouts / Missing BU Permission**: Developer constructs extra floors without municipal approval.
   - *Prevention*: Inspect the **Approved Building Plan** and **Building Use (BU) Permission / OC**.
3. **Undisclosed Bank Mortgages**: Seller takes a loan against property without disclosing it.
   - *Prevention*: Obtain an official **Encumbrance Certificate (EC)** covering at least 15 to 30 years.
4. **Co-Owner or Legal Heir Disputes**: Seller hides inherited family co-owners.
   - *Prevention*: Verify Mutation Entry No. 6 (Ferfar) for inheritance details and demand consent signatures from all legal heirs.
5. **Agricultural Land Non-Agriculturist Sale**: Unlawful sale of farmland to a non-farmer.
   - *Prevention*: Verify the buyer's official **Agriculturist Certificate** before executing a sale agreement.

---

## Frequently Asked Questions (FAQs)

### 1. How can I verify property ownership online in Gujarat?
You can verify rural farmland records (7/12, 8A, Ferfar) and urban Property Cards online via the Gujarat Revenue Department's official **AnyRoR portal** (anyror.gujarat.gov.in).

### 2. What is an Encumbrance Certificate (EC) and why is it needed?
An EC is an official certificate issued by the Sub-Registrar Office certifying that the property is free from registered financial liabilities, bank mortgages, legal liens, or court attachments.

### 3. What is BU Permission in Gujarat?
BU (Building Use) Permission or Occupancy Certificate (OC) is issued by municipal corporations (AMC, SMC, VMC, RMC) confirming that a building has been constructed strictly according to approved safety plans and is legal for occupancy.

### 4. What is a 30-year Title Search Report?
A Title Search Report is a legal document prepared by a property advocate after examining 30 years of registered sale deeds, index II records, and revenue entries to certify clear marketable ownership.

### 5. What is the difference between 7/12 extract and a Property Card?
A 7/12 extract is a revenue record for agricultural land, whereas a Property Card is an official ownership document for urban non-agricultural (NA) land.

### 6. Can I buy property in Gujarat based only on photocopies?
No. Never pay a booking advance based solely on photocopies. Always inspect original title deeds or certified copies obtained directly from the Sub-Registrar Office.

### 7. How do I verify if a project is GujRERA registered?
Enter the project's RERA Registration Number on the official **GujRERA portal** (gujrera.gujarat.gov.in) to verify approved layouts, promoter history, and possession timelines.

### 8. What is Section 65 NA Conversion in Gujarat?
Section 65 of the Gujarat Land Revenue Code regulates the legal conversion of agricultural land into Non-Agricultural (NA) land for residential, commercial, or industrial construction.

### 9. What should I check when buying a resale flat in an apartment society?
Verify the original registered Sale Deed, Society Share Certificate, Society No-Dues Certificate (NOC), latest Property Tax receipts, and electricity bill mutation.

### 10. Why use PropertysDeal for property searches in Gujarat?
PropertysDeal provides 100% verified property listings across Gujarat with verified GUJRERA details, title clear checks, direct builder/owner contacts, and complete legal guidance.

---

## Conclusion & Next Steps

Verifying a property in Gujarat involves much more than checking a single document. A thorough review of ownership records, title history, government land records, approvals, tax status, encumbrances, and the property's physical condition can significantly reduce legal and financial risks.

Combining official record verification with independent legal advice provides a stronger foundation for a secure property purchase. With PropertysDeal, you can explore verified listings across Gujarat and proceed with your real estate investment with complete peace of mind.
`;

async function main() {
  console.log('Inserting How to Verify Property in Gujarat production SEO content...');
  const client = await pool.connect();

  try {
    const slugs = [
      'how-to-verify-property-in-gujarat',
      'property-verification-in-ahmedabad',
      'property-verification-in-surat',
      'land-record-verification-gujarat',
      'rera-property-verification-gujarat',
      'title-search-guide-gujarat',
      'apartment-verification-checklist',
      'plot-verification-guide-gujarat',
      'commercial-property-verification',
      'property-legal-checklist-gujarat'
    ];

    const title = 'How to Verify Property in Gujarat | Legal Due Diligence & Title Search Guide';
    const metaTitle = 'How to Verify Property in Gujarat | Legal & Title Search Guide';
    const metaDescription = 'Complete 10-step property verification guide in Gujarat. Learn about AnyRoR 7/12 extracts, Property Cards, 30-year title searches, Collector NA orders, EC certificates, and GUJRERA checks.';

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
        ['How to Verify Property in Gujarat', slug, 'BLOG', null, null, null]
      );
    }

    console.log('How to Verify Property in Gujarat content inserted successfully for all 10 slugs!');
  } catch (err) {
    console.error('Error inserting verify property content:', err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

main();
