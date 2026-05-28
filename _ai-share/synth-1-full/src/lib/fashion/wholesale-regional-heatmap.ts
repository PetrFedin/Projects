import type { WholesaleRegionalHeatmapV1 } from './types';

/** Тепловая карта спроса для планирования оптовых партий (Regional Demand Heatmap). */
export function getWholesaleRegionalHeatmap(sku: string): WholesaleRegionalHeatmapV1[] {
  const seedRaw = sku.split('-')[1] || '100';
  let seed = parseInt(seedRaw, 10);
  if (isNaN(seed)) seed = sku.length * 7;

  return [
    {
      region: 'Moscow & Central',
      interestScore: 85 + (seed % 15),
      projectedUnits: 1200 + seed * 2,
      growthRate: 12,
    },
    {
      region: 'Saint-Petersburg',
      interestScore: 70 + (seed % 20),
      projectedUnits: 800 + seed * 1.5,
      growthRate: 8,
    },
    {
      region: 'South (Krasnodar)',
      interestScore: 40 + (seed % 30),
      projectedUnits: 300 + seed * 0.8,
      growthRate: 25,
    },
    {
      region: 'Ural & Siberia',
      interestScore: 55 + (seed % 25),
      projectedUnits: 500 + seed * 1.2,
      growthRate: 5,
    },
  ];
}
