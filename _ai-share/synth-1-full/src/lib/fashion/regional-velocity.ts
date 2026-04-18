import type { RegionalVelocityV1 } from './types';

/** Прогноз оборачиваемости (Sell-through) по регионам РФ. */
export function getRegionalVelocity(sku: string, region: string): RegionalVelocityV1 {
  const seedRaw = sku.split('-')[1] || '100';
  let seed = parseInt(seedRaw, 10);
  if (isNaN(seed)) seed = sku.length * 37;

  return {
    region,
    predictedSellThrough: 70 + (seed % 25),
    topSizeRank: ['M', 'L', 'XL'],
    localTrendFactor: 1.1 + (seed % 10) / 100,
  };
}

export function getNationalVelocitySummary(sku: string): RegionalVelocityV1[] {
  const regions = ['Central RF', 'North West', 'Urals', 'Siberia', 'South'];
  return regions.map((r) => getRegionalVelocity(sku, r));
}
