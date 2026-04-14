export interface GlobalNetworkStatus {
  activeOrdersCount: number;
  totalInventoryValueUSD: number;
  averageOnTimeDeliveryPercent: number;
  criticalDisruptionsCount: number;
  totalCarbonFootprintTons: number;
}

export interface ExecutiveSummary {
  healthScore: number; // 0-100
  financialExposureUSD: number; // Риск потери выручки из-за сбоев
  sustainabilityIndex: number; // 0-100
  topCriticalEvent: string | null;
  recommendedStrategicAction: string;
}

/**
 * [Phase 26 — Cognitive Supply Chain Control Tower (Executive Dashboard)]
 * "Диспетчерская вышка" цепи поставок для C-Level руководителей (CEO, COO).
 * Агрегирует данные со всех нижележащих движков (риски, запасы, логистика, ESG)
 * и выдает единый "Индекс здоровья" (Health Score) всей глобальной сети,
 * а также оценивает финансовые риски в реальном времени.
 */
export class SupplyChainControlTower {
  /**
   * Генерирует сводку для топ-менеджмента на основе текущего состояния сети.
   */
  public static generateExecutiveSummary(status: GlobalNetworkStatus): ExecutiveSummary {
    let healthScore = 100;
    let financialExposureUSD = 0;
    let topCriticalEvent: string | null = null;
    let recommendedStrategicAction = 'Maintain current operations. Network is stable.';

    // 1. Оценка логистического здоровья (On-Time Delivery)
    if (status.averageOnTimeDeliveryPercent < 95) {
      healthScore -= (95 - status.averageOnTimeDeliveryPercent) * 2; // Штраф за опоздания
    }
    if (status.averageOnTimeDeliveryPercent < 85) {
      topCriticalEvent = 'Systemic logistics delays detected across multiple regions.';
      recommendedStrategicAction = 'Activate backup carriers and expedite critical shipments via air freight.';
    }

    // 2. Оценка рисков и сбоев (Disruptions)
    if (status.criticalDisruptionsCount > 0) {
      healthScore -= status.criticalDisruptionsCount * 10;
      // Грубая оценка: каждый критический сбой ставит под угрозу 5% стоимости запасов
      financialExposureUSD += (status.totalInventoryValueUSD * 0.05) * status.criticalDisruptionsCount;
      
      if (!topCriticalEvent) {
        topCriticalEvent = `${status.criticalDisruptionsCount} critical node disruptions active (e.g., port closures, strikes).`;
        recommendedStrategicAction = 'Convene emergency supply chain task force. Re-route inventory around affected nodes.';
      }
    }

    // 3. Оценка устойчивости (Sustainability / ESG)
    // Допустим, цель — не более 1000 тонн CO2 на каждый $1M запасов
    const carbonRatio = status.totalCarbonFootprintTons / (status.totalInventoryValueUSD / 1000000);
    let sustainabilityIndex = 100;
    
    if (carbonRatio > 1000) {
      sustainabilityIndex -= (carbonRatio - 1000) / 10; // Штраф за превышение выбросов
    }
    
    sustainabilityIndex = Math.max(0, Math.min(100, Math.round(sustainabilityIndex)));

    if (sustainabilityIndex < 50 && !topCriticalEvent) {
      topCriticalEvent = 'Carbon emissions exceeding corporate ESG targets.';
      recommendedStrategicAction = 'Shift procurement to nearshore suppliers and purchase carbon offsets immediately.';
    }

    // Финализация Health Score
    healthScore = Math.max(0, Math.min(100, Math.round(healthScore)));

    return {
      healthScore,
      financialExposureUSD: Math.round(financialExposureUSD),
      sustainabilityIndex,
      topCriticalEvent,
      recommendedStrategicAction
    };
  }
}
