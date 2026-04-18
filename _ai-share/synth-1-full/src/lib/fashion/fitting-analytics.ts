import type { Product } from '@/lib/types';
import type { FittingAnalyticsV1 } from './types';

/** Аналитика примерочных (Offline Fitting Data). */
export function getFittingAnalytics(product: Product): FittingAnalyticsV1[] {
  const baseCount = 100 + (product.price % 500);

  return [
    {
      storeId: 'MSK-TSUM',
      fittingsCount: baseCount,
      conversionToPurchase: 15 + (product.id.length % 20),
      avgTimeInFittingRoom: 8 + (product.sku.length % 10),
      topAlternativeSku: 'SKU-772',
    },
    {
      storeId: 'SPB-DLT',
      fittingsCount: Math.round(baseCount * 0.6),
      conversionToPurchase: 18 + (product.id.length % 15),
      avgTimeInFittingRoom: 10 + (product.sku.length % 12),
    },
  ];
}
