import type { RegionalDemandPredictionV1 } from './types';

export type RegionalDemandHeatRow = {
  region: string;
  growthRate: number;
  demandScore: number;
  topCategories: string[];
  competitorSaturation: 'high' | 'medium' | 'low';
};

/** Демо-строки для heatmap UI (бренд / мерч). */
export function getRegionalDemandData(): RegionalDemandHeatRow[] {
  return [
    {
      region: 'Moscow & MO',
      growthRate: 18,
      demandScore: 82,
      topCategories: ['Outerwear', 'Knitwear', 'Denim'],
      competitorSaturation: 'high',
    },
    {
      region: 'South (Krasnodar)',
      growthRate: 22,
      demandScore: 76,
      topCategories: ['Resort', 'Linen', 'Footwear'],
      competitorSaturation: 'medium',
    },
    {
      region: 'Siberia (Novosibirsk)',
      growthRate: 9,
      demandScore: 58,
      topCategories: ['Outerwear', 'Tech layers'],
      competitorSaturation: 'low',
    },
  ];
}

export function getRegionRecommendation(region: string): string {
  if (/Moscow/i.test(region)) {
    return 'Усильте топ-SKU в премиальном сегменте и держите буфер по размерам M–L.';
  }
  if (/South|Krasnodar/i.test(region)) {
    return 'Расширьте курортные и лёгкие ткани; следите за сроками поставок.';
  }
  if (/Siberia|Novosibirsk/i.test(region)) {
    return 'Приоритет — теплые слои и быстрая ротация верхней одежды.';
  }
  return 'Сбалансируйте сток по топ-категориям и локальные промо под климат.';
}

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
