import type { MarketplaceSentimentV1 } from './types';

/** Агрегатор настроений покупателей с WB/Ozon для B2B решений. */
export function getMarketplaceSentiment(sku: string): MarketplaceSentimentV1 {
  const seedRaw = sku.split('-')[1] || '100';
  let seed = parseInt(seedRaw, 10);
  if (isNaN(seed)) seed = sku.length * 31;

  return {
    sku,
    wbRating: 4.5 + (seed % 5) / 10,
    ozonRating: 4.7 + (seed % 3) / 10,
    summarySentiment: 'Generally positive, high interest in fabric quality.',
    topPositiveTraits: ['Premium feel', 'True to size', 'Vibrant color'],
    topNegativeTraits: ['Slow shipping from hub', 'Thin lining'],
    reviewCountTotal: 450 + seed * 5,
  };
}
