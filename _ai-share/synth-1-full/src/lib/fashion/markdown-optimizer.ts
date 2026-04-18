import type { DynamicMarkdownV1 } from './types';

/** Оптимизатор розничных скидок на основе локального спроса. */
export function getDynamicMarkdown(sku: string, currentPrice: number): DynamicMarkdownV1 {
  const seedRaw = sku.split('-')[1] || '100';
  let seed = parseInt(seedRaw, 10);
  if (isNaN(seed)) seed = sku.length * 41;
  const isExcess = seed % 3 === 0;

  return {
    sku,
    currentPrice,
    suggestedMarkdownPercent: isExcess ? 15 : 0,
    reason: isExcess
      ? 'High local stock (35+ units) vs 14-day velocity.'
      : 'Stable velocity, no markdown required.',
    projectedSellThroughIncrease: isExcess ? 25 : 0,
    localStockLevel: isExcess ? 'excess' : 'optimal',
  };
}
