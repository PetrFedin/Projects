import { DemandForecastingEngine } from '../ai/demand-forecasting';
import { MEIOEngine, NetworkNode } from './meio-engine';
import { ProcurementEngine, SupplierBid } from '../production/procurement-engine';
import { ExecutionPartner } from '../execution-linkage/execution-partner-schemas';
import { ProductionAggregate } from '../production/production-aggregate';
import { publishProductionDraftCreated } from '../order/domain-event-factories';

export interface AutopilotSummary {
  sku: string;
  forecastedDemand: number;
  recommendedSafetyStock: number;
  reorderPoint: number;
  actionTaken: 'none' | 'procurement_started' | 'production_drafted';
  reasoning: string;
}

/**
 * [Phase 17 — Supply Chain Autopilot (End-to-End Pipeline)]
 * Сквозная интеграция движков: Прогноз Спроса -> Оптимизация Запасов (MEIO) -> Закупки.
 * Работает как фоновый процесс (Cron Job), который анализирует сток и автоматически
 * запускает тендеры и производство, если прогнозируется дефицит.
 */
export class SupplyChainAutopilot {
  /**
   * Запускает ежедневный цикл проверки для конкретного SKU.
   */
  public static async runDailyCycle(
    sku: string,
    historicalSales: number[],
    currentMonth: number,
    currentStock: number,
    partners: ExecutionPartner[],
    bids: SupplierBid[] // Мок-предложения от фабрик
  ): Promise<AutopilotSummary> {
    console.log(`[Autopilot] Starting daily cycle for SKU: ${sku}`);

    // 1. Прогноз спроса (AI Forecasting)
    const forecast = await DemandForecastingEngine.predictNextMonthDemand(
      sku,
      historicalSales,
      currentMonth
    );

    // 2. Расчет MEIO (Оптимизация запасов)
    // Мокируем узел сети (Центральный склад)
    const dcNode: NetworkNode = {
      id: 'DC-01',
      type: 'central_dc',
      leadTimeDaysFromUpstream: 30, // Фабрика шьет 30 дней
      demandForecastPerDay: forecast.predictedDemand / 30,
      demandStdDev: (forecast.predictedDemand / 30) * 0.2, // 20% волатильность
      serviceLevelTarget: 0.95, // Цель: 95% наличия товара
    };

    const meioResult = MEIOEngine.optimizeNetwork([dcNode])[0];

    // 3. Принятие решения о пополнении
    if (currentStock >= meioResult.reorderPoint) {
      return {
        sku,
        forecastedDemand: forecast.predictedDemand,
        recommendedSafetyStock: meioResult.recommendedSafetyStock,
        reorderPoint: meioResult.reorderPoint,
        actionTaken: 'none',
        reasoning: `Current stock (${currentStock}) is above reorder point (${meioResult.reorderPoint}). No action needed.`,
      };
    }

    // Сток ниже точки заказа -> Нужно пополнение
    const deficit = meioResult.reorderPoint - currentStock;
    const orderQuantity = deficit + meioResult.recommendedSafetyStock; // Заказываем до уровня Safety Stock + Спрос

    console.log(
      `[Autopilot] Stock is low (${currentStock} < ${meioResult.reorderPoint}). Required quantity: ${Math.ceil(orderQuantity)}`
    );

    // 4. Тендер и выбор поставщика (Procurement Engine)
    const procurementResult = ProcurementEngine.selectBestSupplier(
      { targetQuantity: Math.ceil(orderQuantity) },
      bids,
      partners
    );

    if (!procurementResult) {
      // Нет подходящих фабрик (например, объем слишком мал для MOQ)
      return {
        sku,
        forecastedDemand: forecast.predictedDemand,
        recommendedSafetyStock: meioResult.recommendedSafetyStock,
        reorderPoint: meioResult.reorderPoint,
        actionTaken: 'none',
        reasoning: `Replenishment needed (${Math.ceil(orderQuantity)} units), but no suitable supplier found (MOQ constraints).`,
      };
    }

    // 5. Создание черновика на производство (Production Draft)
    const draftId = `autopilot-cmt-${Date.now()}`;
    const newCommitment = ProductionAggregate.createFromLegacy({
      id: draftId,
      articleId: 'unknown', // Требуется резолв из PIM
      factoryId: procurementResult.selectedFactoryId,
      quantity: Math.ceil(orderQuantity),
      deadline: new Date(
        Date.now() + procurementResult.winningBid.leadTimeDays * 24 * 60 * 60 * 1000
      ).toISOString(),
    });

    void publishProductionDraftCreated({
      aggregateId: draftId,
      version: 1,
      payload: {
        sku,
        quantity: Math.ceil(orderQuantity),
        factoryId: procurementResult.selectedFactoryId,
        reason: 'Auto-replenishment triggered by MEIO',
      },
    });

    return {
      sku,
      forecastedDemand: forecast.predictedDemand,
      recommendedSafetyStock: meioResult.recommendedSafetyStock,
      reorderPoint: meioResult.reorderPoint,
      actionTaken: 'production_drafted',
      reasoning: `Drafted production order ${draftId} for ${Math.ceil(orderQuantity)} units at factory ${procurementResult.selectedFactoryId}. ${procurementResult.reasoning}`,
    };
  }
}
