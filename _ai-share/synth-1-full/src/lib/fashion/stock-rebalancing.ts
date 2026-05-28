export type StockRebalancingSuggestionV1 = {
  fromStoreId: string;
  toStoreId: string;
  urgency: 'high' | 'medium' | 'low';
  suggestedQty: number;
  reason: string;
};

/** Демо-подсказки межмагазинных перебросов остатков по SKU. */
export function getStockRebalancingSuggestions(sku: string): StockRebalancingSuggestionV1[] {
  const seed = sku.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const baseQty = 12 + (seed % 24);
  return [
    {
      fromStoreId: `ST-${(seed % 90) + 10}`,
      toStoreId: `ST-${(seed % 80) + 20}`,
      urgency: seed % 3 === 0 ? 'high' : 'medium',
      suggestedQty: baseQty,
      reason: 'sell_through_gap',
    },
    {
      fromStoreId: `ST-${(seed % 70) + 30}`,
      toStoreId: `ST-${(seed % 60) + 40}`,
      urgency: 'low',
      suggestedQty: Math.max(4, Math.floor(baseQty / 2)),
      reason: 'size_run_imbalance',
    },
  ];
}
