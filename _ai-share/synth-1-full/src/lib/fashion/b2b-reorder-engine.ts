import type { B2BReorderSuggestionV1 } from './types';

/** AI-рекомендации по дозаказам (Showroom Smart Reorder). */
export function getB2BReorderSuggestions(
  partnerId: string,
  currentCartSkus: string[]
): B2BReorderSuggestionV1[] {
  return [
    {
      sku: 'SKU-101-TOP',
      suggestedQty: 250,
      confidenceScore: 92,
      reason: 'Low Stock in Central Hub',
    },
    {
      sku: 'SKU-202-BTM',
      suggestedQty: 100,
      confidenceScore: 78,
      reason: 'Capsule Completion',
    },
    {
      sku: 'SKU-303-ACC',
      suggestedQty: 50,
      confidenceScore: 85,
      reason: 'Trend Spike',
    },
  ];
}
