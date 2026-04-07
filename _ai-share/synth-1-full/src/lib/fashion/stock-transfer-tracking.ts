import type { StockTransferTrackingV1 } from './types';

/** Трекинг перемещений стока между магазинами (Stock Swap Log). */
export function getStockTransferLog(sku: string): StockTransferTrackingV1[] {
  const seedRaw = sku.split('-')[1] || '100';
  let seed = parseInt(seedRaw, 10);
  if (isNaN(seed)) seed = sku.length * 47;

  return [
    { 
      transferId: `SWAP-2026-${seed}`, 
      sku, 
      fromStoreId: 'STORE-MSK-01', 
      toStoreId: 'STORE-SPB-01', 
      qty: (seed % 10) + 1, 
      status: 'in_transit',
      expectedReceivedDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0] 
    },
    { 
      transferId: `SWAP-2026-${seed + 1}`, 
      sku, 
      fromStoreId: 'STORE-EKB-02', 
      toStoreId: 'STORE-MSK-01', 
      qty: (seed % 5) + 2, 
      status: 'received',
      expectedReceivedDate: new Date(Date.now() - 86400000).toISOString().split('T')[0] 
    },
  ];
}
