import type { Product } from '@/lib/types';
import type { EaeuTaxV1 } from './types';

/** Калькулятор налогов и пошлин ЕАЭС (Экспорт в СНГ). */
export function calculateEaeuTax(product: Product): EaeuTaxV1[] {
  const price = product.price;
  
  return [
    { country: 'KZ', vatRate: 12, exportDuty: 0, totalLandCost: Math.round(price * 1.12) },
    { country: 'BY', vatRate: 20, exportDuty: 0, totalLandCost: Math.round(price * 1.20) },
    { country: 'AM', vatRate: 20, exportDuty: 0, totalLandCost: Math.round(price * 1.20) },
    { country: 'KG', vatRate: 12, exportDuty: 0, totalLandCost: Math.round(price * 1.12) },
  ];
}
