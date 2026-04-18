import type { Product } from '@/lib/types';
import { calculateLcaScore } from './lca-logic';
import type { CollectionLcaSummaryV1 } from './types';

/** Агрегированный отчет по эко-следу всей коллекции (Drop Sustainability). */
export function summarizeCollectionLca(products: Product[]): CollectionLcaSummaryV1 {
  let co2 = 0;
  let water = 0;
  let scoreSum = 0;

  products.forEach((p) => {
    const lca = calculateLcaScore(p);
    co2 += lca.co2Kg;
    water += lca.waterLiters;
    scoreSum += lca.totalScore;
  });

  return {
    totalCo2: Math.round(co2),
    totalWater: Math.round(water),
    avgScore: Math.round(scoreSum / (products.length || 1)),
    topImpactCategory: 'Cotton Processing', // Demo constant
  };
}
