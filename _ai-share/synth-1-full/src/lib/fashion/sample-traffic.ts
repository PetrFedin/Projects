import type { SampleTrafficV1 } from './types';

/** Мониторинг трафика физических образцов в шоуруме. */
export function getSampleTraffic(sku: string): SampleTrafficV1 {
  const seedRaw = sku.split('-')[1] || '100';
  let seed = parseInt(seedRaw, 10);
  if (isNaN(seed)) seed = sku.length * 43;

  return {
    sku,
    timesTouched: 45 + (seed % 100),
    avgInspectionTimeSec: 120 + (seed % 60),
    physicalInterestRank: 3,
    conversionToDraftRate: 65 + (seed % 20),
  };
}
