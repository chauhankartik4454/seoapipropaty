/**
 * Capitalizes the first letter of each word in a string, handles dashes.
 */
export function formatCapitalize(str: string): string {
  if (!str) return '';
  return str
    .split(/[- ]+/)
    .map((word) => {
      if (word.toUpperCase() === 'BHK' || word.toUpperCase() === 'RERA' || word.toUpperCase() === 'GIDC' || word.toUpperCase() === 'NA') {
        return word.toUpperCase();
      }
      if (word.toLowerCase() === 'sg' || word.toLowerCase() === 'gift') {
        return word.toUpperCase();
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');
}

/**
 * Formats a budget value and unit into a readable Indian Rupee format.
 */
export function formatBudget(val: number | null, unit: 'lakh' | 'cr' | null): string {
  if (val === null || unit === null) return '';
  const unitStr = unit === 'lakh' ? 'Lakh' : 'Cr';
  return `₹${val} ${unitStr}`;
}

/**
 * Replaces double curly brace placeholders (e.g., {{city}}) with their dynamic values.
 * Handles cases where a value is missing by cleaning up double spaces/trailing punctuation.
 */
export function renderTemplate(
  template: string,
  variables: Record<string, string | null | undefined>
): string {
  if (!template) return '';
  
  let result = template;
  
  Object.entries(variables).forEach(([key, val]) => {
    const placeholder = new RegExp(`{{\\s*${key}\\s*}}`, 'gi');
    result = result.replace(placeholder, val || '');
  });

  // Post-processing to clean up formatting issues caused by empty values
  result = result
    .replace(/\s+/g, ' ')      // remove duplicate spaces
    .replace(/\s+([,.!?])/g, '$1') // clean spaces before punctuation
    .trim();

  return result;
}
