import { LandedCostBreakdown } from '../types/finance';

/**
 * Calculates the total landed cost of a product.
 * Landed Cost = Fabric + CMT + Trims + Packaging + Freight + Duty + Insurance + Marking + Overhead + Amortization
 */

export function calculateLandedCost(breakdown: Partial<LandedCostBreakdown>): LandedCostBreakdown {
  const fabricCost = breakdown.fabricCost || 0;
  const cmtCost = breakdown.cmtCost || 0;
  const trimsCost = breakdown.trimsCost || 0;
  const packagingCost = breakdown.packagingCost || 0;
  
  const productionSubtotal = fabricCost + cmtCost + trimsCost + packagingCost;
  
  const freightCost = breakdown.freightCost || 0;
  const dutyRate = breakdown.dutyRate || 0;
  const calculatedDuty = productionSubtotal * (dutyRate / 100);
  const insuranceCost = breakdown.insuranceCost || 0;
  const markingCost = breakdown.markingCost || 0;
  
  const logisticsSubtotal = freightCost + calculatedDuty + insuranceCost + markingCost;
  
  const baseCost = productionSubtotal + logisticsSubtotal;
  
  const overheadRate = breakdown.overheadRate || 0;
  const calculatedOverhead = baseCost * (overheadRate / 100);
  const amortizationCost = breakdown.amortizationCost || 0;
  
  const totalLandedCost = baseCost + calculatedOverhead + amortizationCost;
  
  const targetRetailPrice = breakdown.targetRetailPrice || 0;
  const targetMargin = targetRetailPrice > 0 ? ((targetRetailPrice - totalLandedCost) / targetRetailPrice) * 100 : 0;

  return {
    ...breakdown,
    id: breakdown.id || `LC-${Date.now()}`,
    productId: breakdown.productId || 'p-unknown',
    currency: breakdown.currency || 'RUB',
    fabricCost,
    cmtCost,
    trimsCost,
    packagingCost,
    freightCost,
    dutyRate,
    calculatedDuty,
    insuranceCost,
    markingCost,
    overheadRate,
    calculatedOverhead,
    amortizationCost,
    totalLandedCost,
    targetRetailPrice,
    targetMargin
  } as LandedCostBreakdown;
}

/**
 * AI Insights for Cost Optimization
 */
export function generateCostOptimizationInsights(lc: LandedCostBreakdown) {
  const insights: string[] = [];
  
  if (lc.calculatedDuty / lc.totalLandedCost > 0.15) {
    insights.push("Высокая доля ввозной пошлины. Рассмотрите возможность пошива в странах с льготным режимом (например, ЕАЭС/СНГ).");
  }
  
  if (lc.overheadRate > 25) {
    insights.push("Уровень накладных расходов превышает среднерыночный (18-22%). Рекомендуется аудит операционных затрат.");
  }
  
  if (lc.targetMargin < 65) {
    insights.push("Маржинальность ниже целевой (75%). Рекомендуется поднять Retail Price на 15-20% или оптимизировать стоимость CMT.");
  }
  
  return insights;
}
