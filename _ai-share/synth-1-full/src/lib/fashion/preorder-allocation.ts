import type { PreOrderAllocationV1 } from './types';

/** Аллокация предзаказов (Wholesale Allocation) для B2B. */
export function getPreOrderAllocation(sku: string): PreOrderAllocationV1 {
  const seedRaw = sku.split('-')[1] || '100';
  let seed = parseInt(seedRaw, 10);
  if (isNaN(seed)) seed = sku.length * 7;

  const total = 1000 + (seed % 500);
  const allocated = 400 + (seed % 300);
  const reserved = 200;
  const remaining = total - allocated - reserved;

  return {
    sku,
    totalAvailableQty: total,
    allocatedQty: allocated,
    reservedForTopTierQty: reserved,
    remainingQty: remaining,
    allocationStatus: remaining < 100 ? 'limited' : 'open',
  };
}
