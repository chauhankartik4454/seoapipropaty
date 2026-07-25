/**
 * Real Estate Spelling & Typo Normalizer Engine
 * Automatically corrects common spelling mistakes in slugs, titles, and property types
 */

const REPLACEMENTS: Array<[RegExp, string]> = [
  // Ploats / Plots
  [/\bploat\b/gi, 'plot'],
  [/\bploats\b/gi, 'plots'],
  
  // Rent / Rant
  [/\brant\b/gi, 'rent'],
  [/\branted\b/gi, 'rented'],

  // Banglous / Bungalow
  [/\bbanglous\b/gi, 'bungalow'],
  [/\bbanglos\b/gi, 'bungalow'],
  [/\bbangalow\b/gi, 'bungalow'],
  [/\bbanglow\b/gi, 'bungalow'],
  [/\bbungalows\b/gi, 'bungalows'],

  // Flat / Flst / Flts
  [/\bflst\b/gi, 'flat'],
  [/\bflatsfor\b/gi, 'flats-for'],

  // Furnished / Furnishrd / Farnished
  [/\bfurnishrd\b/gi, 'furnished'],
  [/\bfarnished\b/gi, 'furnished'],

  // Tenament / Tenement
  [/\btenament\b/gi, 'tenement'],

  // Recendency / Residency
  [/\brecendency\b/gi, 'residency'],

  // Socity / Society
  [/\bsocity\b/gi, 'society'],

  // Appartment / Apartment
  [/\bappartment\b/gi, 'apartment'],
];

export function sanitizeSpelling(text: string): string {
  if (!text) return '';
  let cleaned = text;
  for (const [regex, replacement] of REPLACEMENTS) {
    cleaned = cleaned.replace(regex, replacement);
  }
  return cleaned;
}

export function sanitizeSlug(slug: string): string {
  if (!slug) return '';
  let cleanSlug = slug.toLowerCase();
  
  // Replace typos
  cleanSlug = cleanSlug
    .replace(/ploat/g, 'plot')
    .replace(/rant/g, 'rent')
    .replace(/banglous/g, 'bungalow')
    .replace(/banglos/g, 'bungalow')
    .replace(/banglow/g, 'bungalow')
    .replace(/flst/g, 'flat')
    .replace(/furnishrd/g, 'furnished')
    .replace(/farnished/g, 'furnished')
    .replace(/tenament/g, 'tenement')
    .replace(/recendency/g, 'residency')
    .replace(/socity/g, 'society');

  // Clean double hyphens
  cleanSlug = cleanSlug.replace(/-+/g, '-').replace(/^-|-$/g, '');

  return cleanSlug;
}
