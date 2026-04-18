import { DutyRate, HSCode, LandedCostEstimate } from '../types/logistics';

/**
 * Global Duty Engine Logic
 * Автоматический расчет пошлин и налогов для 200+ стран в режиме реального времени (DDP).
 */

// Mock Database of HS Codes for Fashion
export const HS_CODES: HSCode[] = [
  { code: '6109.10', description: 'T-shirts, knitted or crocheted, cotton', category: 'Knits' },
  {
    code: '6201.12',
    description: 'Overcoats, raincoats, car coats, etc., of cotton',
    category: 'Outerwear',
  },
  { code: '6204.42', description: 'Dresses of cotton, not knitted', category: 'Dresses' },
  {
    code: '6403.51',
    description: 'Footwear with outer soles and uppers of leather',
    category: 'Footwear',
  },
  {
    code: '4202.21',
    description: 'Handbags with outer surface of leather',
    category: 'Accessories',
  },
];

// Mock Rates for common destination countries
export const COUNTRY_RATES: Record<string, DutyRate> = {
  US: { countryCode: 'US', importDuty: 16.5, vat: 0, threshold: 800 }, // De minimis $800
  GB: { countryCode: 'GB', importDuty: 12, vat: 20, threshold: 135 },
  DE: { countryCode: 'DE', importDuty: 12, vat: 19, threshold: 150 },
  FR: { countryCode: 'FR', importDuty: 12, vat: 20, threshold: 150 },
  AE: { countryCode: 'AE', importDuty: 5, vat: 5, threshold: 300 },
  CN: { countryCode: 'CN', importDuty: 20, vat: 13, threshold: 50 },
  KZ: { countryCode: 'KZ', importDuty: 0, vat: 12, threshold: 1000 }, // EAEU internal
  RU: { countryCode: 'RU', importDuty: 0, vat: 20, threshold: 1000 }, // EAEU internal from some regions
};

/**
 * Calculates Delivered Duty Paid (DDP) value.
 * DDP = Item Value + Shipping + Insurance + Duty + VAT
 */
export function calculateDDP(
  itemValue: number,
  countryCode: string,
  hsCode: string,
  shipping: number = 0,
  insurance: number = 0
): LandedCostEstimate {
  const rate = COUNTRY_RATES[countryCode] || { countryCode, importDuty: 15, vat: 20, threshold: 0 };

  const taxableBasis = itemValue + shipping + insurance;

  let dutyAmount = 0;
  let vatAmount = 0;

  // Apply De minimis threshold
  if (taxableBasis > (rate.threshold || 0)) {
    dutyAmount = taxableBasis * (rate.importDuty / 100);
    // VAT is usually calculated on (CIF + Duty)
    vatAmount = (taxableBasis + dutyAmount) * (rate.vat / 100);
  }

  const totalTaxes = dutyAmount + vatAmount;
  const finalPriceDDP = taxableBasis + totalTaxes;

  return {
    productId: 'p-simulated',
    itemValue,
    hsCode,
    destinationCountry: countryCode,
    shippingCost: shipping,
    insuranceCost: insurance,
    dutyAmount,
    vatAmount,
    totalTaxes,
    finalPriceDDP,
    currency: countryCode === 'US' ? 'USD' : countryCode === 'AE' ? 'AED' : 'EUR',
  };
}

/**
 * AI HS Code Suggester (Simulated)
 */
export function suggestHSCode(productDescription: string): HSCode {
  const desc = productDescription.toLowerCase();
  if (desc.includes('dress')) return HS_CODES[2];
  if (desc.includes('coat') || desc.includes('jacket')) return HS_CODES[1];
  if (desc.includes('shoe') || desc.includes('leather')) return HS_CODES[3];
  if (desc.includes('bag')) return HS_CODES[4];
  return HS_CODES[0]; // Default: T-shirt
}
