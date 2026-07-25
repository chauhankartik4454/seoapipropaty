export interface ParsedSlugResult {
  bhk: string | null;
  budgetVal: number | null;
  budgetUnit: 'lakh' | 'cr' | null;
  year: string | null;
  intent: 'sale' | 'rent' | 'buy' | 'rates' | 'general';
}

/**
 * Extracts numeric budget, BHK, year, and intent from a slug.
 */
export function parseSlugMetadata(slug: string): ParsedSlugResult {
  const normalized = slug.toLowerCase();

  // 1. Extract BHK (e.g., 2bhk, 3bhk)
  const bhkMatch = normalized.match(/\b(\d)bhk\b/);
  const bhk = bhkMatch ? `${bhkMatch[1]}BHK` : null;

  // 2. Extract Budget (e.g., under-50-lakh, under-2-cr)
  let budgetVal: number | null = null;
  let budgetUnit: 'lakh' | 'cr' | null = null;

  const budgetMatch = normalized.match(/(?:under|below)-(\d+)-(lakh|cr)\b/);
  if (budgetMatch) {
    budgetVal = parseInt(budgetMatch[1], 10);
    budgetUnit = budgetMatch[2] as 'lakh' | 'cr';
  }

  // 3. Extract Year (e.g., 2026)
  const yearMatch = normalized.match(/\b(202\d|203\d)\b/);
  const year = yearMatch ? yearMatch[1] : null;

  // 4. Extract Intent
  let intent: 'sale' | 'rent' | 'buy' | 'rates' | 'general' = 'general';
  if (normalized.includes('rates-in') || normalized.includes('property-rates')) {
    intent = 'rates';
  } else if (normalized.includes('for-rent') || normalized.includes('rent-in')) {
    intent = 'rent';
  } else if (normalized.includes('for-sale') || normalized.includes('sale-in')) {
    intent = 'sale';
  } else if (normalized.includes('buy-')) {
    intent = 'buy';
  }

  return {
    bhk,
    budgetVal,
    budgetUnit,
    year,
    intent,
  };
}

/**
 * Scans a slug for matching database slugs (cities, localities, property types).
 * This ensures exact matches even for multi-word items like 'sg-highway' or 'commercial-property'.
 */
export function findMatchingSlug<T extends { slug: string }>(
  slug: string,
  items: T[]
): T | null {
  const normalized = slug.toLowerCase();
  
  // Sort by slug length descending to match longer multi-word slugs first
  // e.g. match "sg-highway" before "highway" (if any)
  const sortedItems = [...items].sort((a, b) => b.slug.length - a.slug.length);
  
  for (const item of sortedItems) {
    const itemSlug = item.slug.toLowerCase();
    
    // Check if the item slug is contained in the URL slug as a discrete segment
    const escapedSlug = itemSlug.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`(?:^|-)${escapedSlug}(?:$|-)`);
    
    if (regex.test(normalized)) {
      return item;
    }
  }
  
  return null;
}
