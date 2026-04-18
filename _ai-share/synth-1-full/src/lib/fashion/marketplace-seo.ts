import type { Product } from '@/lib/types';
import type { MarketplaceSeoV1 } from './types';

/** Индекс видимости товара в поиске маркетплейсов (WB/Ozon SEO). */
export function getMarketplaceSeo(product: Product): MarketplaceSeoV1[] {
  const seed = product.id.length;

  return [
    {
      sku: product.sku,
      marketplace: 'WB',
      keyword: product.category === 'Outerwear' ? 'куртка мужская' : 'футболка женская',
      rank: 5 + (seed % 50),
      visibilityScore: 70 + (seed % 25),
      searchTrend: seed % 3 === 0 ? 'rising' : 'stable',
    },
    {
      sku: product.sku,
      marketplace: 'Ozon',
      keyword: product.category,
      rank: 12 + (seed % 40),
      visibilityScore: 65 + (seed % 30),
      searchTrend: 'stable',
    },
  ];
}
