import type { Product } from '@/lib/types';
import type { MarketplaceHealthV1 } from './types';

/** Аналитика здоровья карточки на маркетплейсах РФ (WB/Ozon). */
export function getMarketplaceHealth(product: Product): MarketplaceHealthV1[] {
  const seed = product.id.length;

  return [
    {
      sku: product.sku,
      marketplace: 'WB',
      buyboxStatus: 'won',
      ratingTrend: seed % 2 === 0 ? 'up' : 'stable',
      outOfStockRisk: 10 + (seed % 40),
      buybackRate: 75 + (seed % 15), // % выкупа
    },
    {
      sku: product.sku,
      marketplace: 'Ozon',
      buyboxStatus: seed % 3 === 0 ? 'lost' : 'won',
      ratingTrend: 'stable',
      outOfStockRisk: 20 + (seed % 30),
      buybackRate: 80 + (seed % 10),
    },
  ];
}
