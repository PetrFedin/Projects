import type { Product } from '@/lib/types';
import type { PortfolioAssortmentHealthV1 } from './types';
import { buildAttributeHealthRows } from './attribute-health';
import { detectAssortmentOverlap } from './assortment-overlap';
import { buildLaunchReadinessRows } from './launch-readiness';

/** Агрегированный индекс здоровья ассортимента. */
export function calculateAssortmentHealth(products: Product[]): PortfolioAssortmentHealthV1 {
  const attrRows = buildAttributeHealthRows(products);
  const overlapRows = detectAssortmentOverlap(products);
  const launchRows = buildLaunchReadinessRows(products);

  const avgCompleteness = attrRows.reduce((s, r) => s + r.completeness, 0) / (attrRows.length || 1);
  const avgReadiness = launchRows.reduce((s, r) => s + r.score, 0) / (launchRows.length || 1);

  // Simplified health score formula
  const overallScore = Math.round(
    avgCompleteness * 0.4 + avgReadiness * 0.4 + Math.max(0, 100 - overlapRows.length * 5) * 0.2
  );

  return {
    overallScore,
    attributeCompleteness: Math.round(avgCompleteness),
    salesVelocityTrend: 'stable', // Would come from real analytics
    overlapRiskCount: overlapRows.length,
    readyToLaunchPct: Math.round(avgReadiness),
  };
}
