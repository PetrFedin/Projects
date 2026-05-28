'use server';

import { withTokenAudit } from '../genkit';
import { SKUDemandForecast, PlannedSKU } from '../../lib/types/analytics';

/**
 * AI SKU Planner Flow
 * Прогнозирует спрос и анализирует риски коллекции.
 */

export interface SKUPlannerInput {
  brandId: string;
  historicalSales?: any[];
  plannedItems: Partial<PlannedSKU>[];
  marketContext?: string;
}

export async function simulateCollectionDemand(
  input: SKUPlannerInput
): Promise<SKUDemandForecast[]> {
  return withTokenAudit(
    'simulateCollectionDemand',
    input,
    input.brandId,
    undefined,
    async (payload) => {
      console.log(`[AI_PLANNER] Simulating demand for ${payload.plannedItems.length} SKUs...`);

      // Имитация AI-анализа
      await new Promise((resolve) => setTimeout(resolve, 2500));

      return payload.plannedItems.map((item, idx) => ({
        productId: item.id || `p-${idx}`,
        sku: `SKU-${idx}`,
        currentStock: 0,
        predictedDemand: (item.plannedQty || 100) * (0.8 + Math.random() * 0.5),
        confidence: 0.75 + Math.random() * 0.2,
        recommendedReplenishment: 0,
        seasonalityIndex: 0.85,
        trendScore: 0.4 + Math.random() * 0.4,
        marketSellThroughAvg: 65,
        predictedSellThrough: 72 + Math.random() * 10,
      }));
    }
  );
}

/**
 * Анализ рисков коллекции (Overstock/Understock)
 */
export async function analyzePlanningRisks(items: PlannedSKU[], forecasts: SKUDemandForecast[]) {
  return items.map((item) => {
    const forecast = forecasts.find((f) => f.productId === item.id);
    const risk =
      item.plannedQty > (forecast?.predictedDemand || 0) * 1.3
        ? 'high_overstock'
        : item.plannedQty < (forecast?.predictedDemand || 0) * 0.7
          ? 'high_understock'
          : 'low';

    return {
      skuId: item.id,
      risk,
      predictedVsPlanned: (forecast?.predictedDemand || 0) / item.plannedQty,
    };
  });
}
