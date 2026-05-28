import type { EaeuTaxCalculationV1 } from './types';

/** Расчет налогов и пошлин для экспорта внутри ЕАЭС (EAEU Cross-Border B2B). */
export function calculateEaeuTaxes(
  orderValue: number,
  country: EaeuTaxCalculationV1['country'] = 'KZ'
): EaeuTaxCalculationV1 {
  const rates = {
    RU: { vat: 0.2, duty: 0.0, cur: 'RUB' as const },
    BY: { vat: 0.2, duty: 0.0, cur: 'BYN' as const },
    KZ: { vat: 0.12, duty: 0.0, cur: 'KZT' as const },
    AM: { vat: 0.2, duty: 0.0, cur: 'RUB' as const },
    KG: { vat: 0.12, duty: 0.0, cur: 'RUB' as const },
  };

  const config = rates[country];
  const totalTax = orderValue * config.vat + orderValue * config.duty;

  return {
    country,
    vatRate: config.vat,
    customsDutyRate: config.duty,
    estimatedTotalTax: totalTax,
    currency: config.cur,
  };
}
