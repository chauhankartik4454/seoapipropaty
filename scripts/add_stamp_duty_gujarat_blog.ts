import { Pool } from 'pg';
import 'dotenv/config';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('DATABASE_URL environment variable is missing.');
  process.exit(1);
}

const pool = new Pool({ connectionString });

const blogContent = `# Stamp Duty in Gujarat: Complete Guide, Rates & Jantri Calculator

Paying stamp duty and property registration charges is a mandatory legal requirement when purchasing real estate in Gujarat. Stamp duty is a state government tax levied on property conveyances (sale deeds, gift deeds, lease agreements), while registration fees cover the official government recording of the transaction under the Sub-Registrar of Assurances.

Whether you are buying a residential flat in Ahmedabad, a villa in Surat, an NA plot in Gandhinagar, a commercial office in Vadodara, or an industrial shed in GIDC, understanding current stamp duty rates and government **Jantri Benchmark Rates** ensures accurate financial planning and clear property title ownership.

---

## Current Stamp Duty & Property Registration Rates in Gujarat

For most property sale transactions (conveyance deeds) in Gujarat:

| Charge Type | Rate Percentage | Key Calculation Basis |
| --- | --- | --- |
| **Basic Stamp Duty** | **3.5%** | Applied on higher of Sale Value or Government Jantri Rate |
| **Surcharge Levy** | **1.4%** (40% of basic duty) | Added directly to basic stamp duty |
| **Total Effective Stamp Duty** | **4.9%** | Total effective state stamp duty payable |
| **Sub-Registrar Registration Fee** | **1.0%** | Standard government property registration fee |
| **Total Statutory Cost** | **5.9%** | Combined Effective Stamp Duty + Registration Fee |

*Note: Sole female ownership registration fee concessions or government affordable housing waivers may apply subject to current Gujarat Revenue notifications.*

---

## What is Government Jantri Rate in Gujarat?

The **Jantri Rate** (Annual Statement of Rates / ASR) is the minimum benchmark land and property valuation fixed by the Gujarat Revenue Department for every survey number, village, town, and city ward.

### How Stamp Duty Calculation Works with Jantri Value:
Stamp duty is ALWAYS calculated on the **HIGHER** of two values:
1. **Actual Agreed Transaction Value** (Price stated in the Sale Deed), OR
2. **Official Government Jantri Valuation**.

#### Calculation Examples:
- **Scenario A (Agreed Price Higher)**: Transaction Value = ₹75 Lakhs, Jantri Valuation = ₹65 Lakhs. Stamp Duty is calculated on **₹75 Lakhs** (4.9% = ₹3,67,500).
- **Scenario B (Jantri Valuation Higher)**: Transaction Value = ₹50 Lakhs, Jantri Valuation = ₹60 Lakhs. Stamp Duty is calculated on **₹60 Lakhs** (4.9% = ₹2,94,000).

---

## Digital GARVI Portal & E-Stamping Process

The Revenue Department of Gujarat operates the **GARVI Portal** (Gujarat Registration & Stamp Revenue Integrated System) to digitize property valuations and registration workflows.

### E-Stamping via Stock Holding Corporation (SHCIL)
Traditional stamp papers have been replaced by digital **e-Stamping certificates** issued by SHCIL or authorized banks.
1. Search your plot/flat survey number Jantri value on the **GARVI portal**.
2. Calculate total 4.9% Stamp Duty & 1% Registration Fees online.
3. Pay via NetBanking, UPI, or challan at authorized bank branches.
4. Download the tamper-proof e-Stamp certificate for inclusion in the final Sale Deed.

---

## Step-by-Step Property Registration Workflow in Gujarat

1. **Document Verification**: Complete legal due diligence (30-year title search, EC, NA order, RERA check).
2. **Drafting Sale Deed**: Prepare the final Sale Deed detailing property boundaries, payment schedule, and seller/buyer details.
3. **E-Stamp Purchase**: Generate the e-Stamp certificate equivalent to 4.9% of valuation.
4. **GARVI Appointment Booking**: Book an online appointment slot at the jurisdictional Sub-Registrar Office (SRO).
5. **Physical Biometric & Registration**: Present buyer, seller, and two witnesses before the Sub-Registrar for biometric fingerprinting & photo capture.
6. **Index II & Document Collection**: Collect the registered Sale Deed and Index II extract confirming official ownership recording.

---

## Frequently Asked Questions (FAQs)

### 1. What is the total stamp duty and registration fee in Gujarat?
The effective stamp duty is **4.9%** (3.5% basic + 1.4% surcharge) and the registration fee is **1%**, making the total statutory property registration cost **5.9%** in Gujarat.

### 2. What is Jantri Rate in Gujarat and how can I check it?
Jantri is the minimum government benchmark valuation rate for land/property in Gujarat. You can search current Jantri rates online using your city, village, and survey number on the **GARVI portal** (garvi.gujarat.gov.in).

### 3. Is there a stamp duty concession for female buyers in Gujarat?
Yes. Solitary female property buyers are eligible for a **100% waiver on the 1% registration fee** in specific qualifying residential transactions (Stamp duty remains 4.9%).

### 4. Who pays stamp duty when buying property in Gujarat?
Unless explicitly agreed otherwise in the sales contract, the **buyer** pays all stamp duty and registration charges under standard practice in Gujarat.

### 5. What is the penalty for under-valuing property to avoid stamp duty?
Under Section 32A of the Gujarat Stamp Act, the Collector of Stamps can issue notices, demand short-paid stamp duty plus interest penalties up to 18% per annum, and withhold Property Card mutation.

### 6. What is Index II in Gujarat property registration?
Index II is an official extract issued by the Sub-Registrar Office after property registration, summarizing seller/buyer names, property description, transaction value, and stamp duty paid.

### 7. How long is an e-Stamp certificate valid?
An e-Stamp certificate issued in Gujarat does not expire, but it must be submitted for property registration within the statutory timelines following document execution.

### 8. Is stamp duty applicable to commercial and industrial property purchases?
Yes. Commercial shops, corporate offices, industrial plots, and GIDC factory sheds are subject to standard 4.9% stamp duty and 1% registration fees.

### 9. Can I get a home loan to cover stamp duty costs?
Reserve Bank of India (RBI) guidelines prohibit banks from including stamp duty and registration charges in the core Home Loan LTV ratio; buyers must pay these statutory fees from their down payment funds.

### 10. Why use PropertysDeal for property buying in Gujarat?
PropertysDeal provides transparent property pricing, verified Jantri valuation tools, direct builder/owner connections, and complete legal registration guidance across Gujarat.

---

## Conclusion & Next Steps

Understanding Stamp Duty in Gujarat is an essential part of purchasing any property. Buyers should calculate costs using the higher of the transaction value or Jantri value, verify all legal documents, understand applicable registration charges, and complete registration in accordance with state requirements.

With PropertysDeal, buyers can explore verified property listings across Gujarat, compare options, connect directly with sellers, and access transparent information that supports informed real estate decisions.
`;

async function main() {
  console.log('Inserting Stamp Duty in Gujarat production SEO content...');
  const client = await pool.connect();

  try {
    const slugs = [
      'stamp-duty-in-gujarat',
      'stamp-duty-calculator-gujarat',
      'jantri-rate-gujarat',
      'property-registration-gujarat',
      'registration-charges-gujarat',
      'stamp-duty-on-flat-in-gujarat',
      'stamp-duty-on-plot-in-gujarat',
      'commercial-property-stamp-duty-gujarat',
      'industrial-property-registration-gujarat',
      'property-registration-cost-gujarat'
    ];

    const title = 'Stamp Duty in Gujarat | Rates, Jantri Calculator & Registration Charges';
    const metaTitle = 'Stamp Duty in Gujarat | Rates, Jantri & Registration Charges';
    const metaDescription = 'Complete guide to stamp duty in Gujarat. Learn about effective 4.9% stamp duty, 1% registration fee, Jantri rates calculation, GARVI portal e-stamps, female concessions, and legal registration workflows.';

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
        ['Stamp Duty in Gujarat', slug, 'BLOG', null, null, null]
      );
    }

    console.log('Stamp Duty in Gujarat content inserted successfully for all 10 slugs!');
  } catch (err) {
    console.error('Error inserting stamp duty content:', err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

main();
