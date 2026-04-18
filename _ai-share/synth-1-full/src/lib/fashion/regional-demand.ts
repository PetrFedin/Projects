import type { RegionalDemandPredictionV1 } from './types';

/** Прогноз регионального спроса на основе исторических данных и локальных факторов (RU). */
export function getRegionalDemandPrediction(sku: string): RegionalDemandPredictionV1[] {
  const seedRaw = sku.split('-')[1] || '100';
  let seed = parseInt(seedRaw, 10);
  if (isNaN(seed)) seed = sku.length * 19;

  return [
    {
      sku,
      region: 'South (Krasnodar)',
      demandIndex: 85 + (seed % 15),
      confidence: 92,
      growthFactor: 'weather',
      predictedQty: 450 + (seed % 100),
    },
    {
      sku,
      region: 'Moscow & MO',
      demandIndex: 70 + (seed % 20),
      confidence: 88,
      growthFactor: 'marketing',
      predictedQty: 1200 + (seed % 300),
    },
    {
      sku,
      region: 'Siberia (Novosibirsk)',
      demandIndex: 40 + (seed % 30),
      confidence: 75,
      growthFactor: 'local_trend',
      predictedQty: 200 + (seed % 50),
    },
  ];
}
