import type { B2BOrderSplitV1 } from './types';

/** Распределение оптового заказа по конкретным точкам (Ship-to-Store Splitter). */
export function getB2BOrderSplit(sku: string, totalQty: number): B2BOrderSplitV1 {
  const seedRaw = sku.split('-')[1] || '100';
  let seed = parseInt(seedRaw, 10);
  if (isNaN(seed)) seed = sku.length * 11;

  const mskQty = Math.round(totalQty * 0.5);
  const spbQty = Math.round(totalQty * 0.3);
  const ekbQty = totalQty - mskQty - spbQty;

  return {
    sku,
    totalQty,
    splits: [
      { storeId: 'STORE-MSK-01', qty: mskQty, status: 'confirmed' },
      { storeId: 'STORE-SPB-01', qty: spbQty, status: 'confirmed' },
      { storeId: 'STORE-EKB-02', qty: ekbQty, status: 'pending' },
    ],
  };
}
