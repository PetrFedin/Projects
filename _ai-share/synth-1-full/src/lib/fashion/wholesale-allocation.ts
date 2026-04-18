import type { WholesaleAllocationV1 } from './types';

/** Скоринг справедливости распределения оптовых партий. */
export function getWholesaleAllocationFairness(sku: string): WholesaleAllocationV1 {
  const seedRaw = sku.split('-')[1] || '100';
  let seed = parseInt(seedRaw, 10);
  if (isNaN(seed)) seed = sku.length * 47;
  const requested = 1000 + seed * 10;
  const allocated = 800 + seed * 5;

  return {
    sku,
    totalRequested: requested,
    allocatedPercent: Math.round((allocated / requested) * 100),
    fairnessScore: 85 + (seed % 15),
    reasoning:
      'Priority given to partners with 95%+ sell-through history and early pre-order lock-in.',
  };
}
