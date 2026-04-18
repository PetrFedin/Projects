import type { DistributorStockBalanceV1 } from './types';

/** Ребалансировка стока между дистрибьюторами и филиалами. */
export function getDistributorStockAnalysis(sku: string): DistributorStockBalanceV1[] {
  return [
    {
      partnerId: 'DIST-RU-CENTRAL',
      sku,
      currentStock: 450,
      sellThroughRate: 85,
      rebalanceSuggestion: 'transfer_in',
      targetQty: 600,
    },
    {
      partnerId: 'DIST-RU-SOUTH',
      sku,
      currentStock: 320,
      sellThroughRate: 40,
      rebalanceSuggestion: 'transfer_out',
      targetQty: 150,
    },
    {
      partnerId: 'DIST-RU-SIBERIA',
      sku,
      currentStock: 120,
      sellThroughRate: 92,
      rebalanceSuggestion: 'transfer_in',
      targetQty: 300,
    },
  ];
}
