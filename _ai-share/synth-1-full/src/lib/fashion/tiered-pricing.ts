import type { WholesaleTieredPricingV1 } from './types';

/** Расчет ступенчатых цен (Tiered Pricing) для оптовых заказов. */
export function getWholesaleTieredPricing(sku: string): WholesaleTieredPricingV1 {
  const seedRaw = sku.split('-')[1] || '100';
  let seed = parseInt(seedRaw, 10);
  if (isNaN(seed)) seed = sku.length * 13;

  const basePrice = 5000 + (seed % 2000);

  return {
    sku,
    tiers: [
      { minQty: 1, pricePerUnit: basePrice, discountPercent: 0 },
      { minQty: 100, pricePerUnit: basePrice * 0.9, discountPercent: 10 },
      { minQty: 500, pricePerUnit: basePrice * 0.8, discountPercent: 20 },
      { minQty: 1000, pricePerUnit: basePrice * 0.75, discountPercent: 25 },
    ],
    currentActiveTier: 0,
  };
}
