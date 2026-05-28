import type { Product } from '@/lib/types';
import type { PriceLadderBucketV1 } from './types';

/** Строит ценовую лестницу для коллекции. */
export function buildPriceLadder(products: Product[] = []): PriceLadderBucketV1[] {
  const ranges = [
    { label: 'Budget (< 5k)', min: 0, max: 5000 },
    { label: 'Core (5k - 10k)', min: 5000, max: 10000 },
    { label: 'Premium (10k - 20k)', min: 10000, max: 20000 },
    { label: 'Luxury (> 20k)', min: 20000, max: Infinity },
  ];

  return ranges.map((r) => {
    const items = (products || []).filter((p) => p.price >= r.min && p.price < r.max);
    return {
      priceRange: r.label,
      skuCount: items.length,
      avgMargin: 45 + (items.length % 10), // Demo mock margin
    };
  });
}
