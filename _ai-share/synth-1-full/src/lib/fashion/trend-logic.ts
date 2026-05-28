import type { Product } from '@/lib/types';
import type { TrendSentimentV1 } from './types';
import { extractDesignDna } from './design-dna';

/** Рассчитывает "трендовость" на основе Design DNA и рыночных сигналов (демо-AI). */
export function calculateTrendSentiment(product: Product): TrendSentimentV1 {
  const dna = extractDesignDna(product);
  let score = 65;
  const drivers: string[] = [];

  if (dna.fit === 'Oversize') {
    score += 15;
    drivers.push('Oversize Silhouette');
  }
  if (dna.fastening === 'Buttons') {
    score += 5;
    drivers.push('Classic Hardware');
  }
  if (
    product.color.toLowerCase().includes('grey') ||
    product.color.toLowerCase().includes('gray')
  ) {
    score += 10;
    drivers.push('Neutral Palette Trend');
  }

  return {
    score: Math.min(100, score),
    momentum: score > 75 ? 'rising' : 'stable',
    keyDrivers: drivers.slice(0, 2),
    marketComparison: score > 80 ? 'Top 10% in category' : 'Market average',
  };
}
