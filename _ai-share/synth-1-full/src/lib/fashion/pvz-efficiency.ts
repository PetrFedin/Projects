import type { Product } from '@/lib/types';
import type { PvzEfficiencyV1 } from './types';

/** Эффективность примерок в ПВЗ (Marketplace/Logistic Analysis). */
export function getPvzEfficiency(product: Product): PvzEfficiencyV1 {
  const seed = product.id.length;
  
  // Эвристика: обувь и платья чаще примеряют в ПВЗ
  const isHighFitting = product.category === 'Footwear' || product.category === 'Dress';
  const tryOnRate = isHighFitting ? 85 + (seed % 10) : 60 + (seed % 20);
  const returnRate = isHighFitting ? 35 + (seed % 15) : 15 + (seed % 10);

  return {
    sku: product.sku,
    pvzTryOnRate: tryOnRate,
    pvzReturnRate: returnRate,
    avgStayAtPvz: 12 + (seed % 15),
    logisticLossPerUnit: Math.round(returnRate * 0.5 * 100), // Демо-расчет потерь на логистику
  };
}
