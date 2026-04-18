export type SimulationShock =
  | 'port_closure'
  | 'demand_spike'
  | 'supplier_bankruptcy'
  | 'raw_material_shortage';

export interface SimulationScenario {
  id: string;
  name: string;
  shockType: SimulationShock;
  magnitude: number; // e.g., 3.0 for +300% demand, 15 for +15 days delay
  targetRegion?: string;
  targetSkuCategory?: string;
}

export interface SimulationResult {
  scenarioId: string;
  projectedRevenueLoss: number; // В валюте
  projectedServiceLevelDrop: number; // Падение уровня сервиса (например, с 95% до 82%)
  stockoutRiskPercent: number; // Вероятность обнуления стока
  recommendedMitigations: string[];
}

/**
 * [Phase 12 — Digital Twin & What-If Simulation Engine]
 * Цифровой двойник цепочки поставок.
 * Позволяет моделировать "шоки" (закрытие портов, вирусный спрос в TikTok, банкротство фабрики)
 * и рассчитывать их влияние на выручку и уровень сервиса (Service Level).
 */
export class DigitalTwinEngine {
  /**
   * Запускает симуляцию "Что-Если" (What-If Analysis).
   */
  public static runSimulation(
    scenario: SimulationScenario,
    currentMonthlyRevenue: number,
    currentServiceLevel: number // 0.0 - 1.0 (e.g. 0.95 = 95%)
  ): SimulationResult {
    console.log(`[DigitalTwin] Running simulation: ${scenario.name} (${scenario.shockType})`);

    let revenueLoss = 0;
    let slDrop = 0;
    let stockoutRisk = 0;
    const mitigations: string[] = [];

    switch (scenario.shockType) {
      case 'port_closure':
        // Закрытие порта (например, Суэцкий канал) -> задержка поставок
        // Каждые 5 дней задержки роняют SL на 2%
        slDrop = (scenario.magnitude / 5) * 0.02;
        revenueLoss = currentMonthlyRevenue * slDrop; // Потеря продаж из-за Out-of-Stock
        stockoutRisk = 0.45; // 45% шанс обнуления стока по ключевым SKU

        mitigations.push(
          `Reroute critical SKUs via Air Freight (Estimated cost: $${Math.round(revenueLoss * 0.3)})`
        );
        mitigations.push('Activate backup suppliers in nearshore regions (Turkey/Mexico)');
        mitigations.push('Trigger Smart Swap to rebalance existing B2B stock to B2C channels');
        break;

      case 'demand_spike':
        // Вирусный спрос (например, инфлюенсер надел вещь) -> дефицит
        // Если спрос вырос в 3 раза (magnitude = 3.0), SL падает из-за нехватки товара
        slDrop = scenario.magnitude > 2.0 ? 0.15 : 0.05;
        revenueLoss = currentMonthlyRevenue * 0.1; // Потеря *потенциальной* выручки
        stockoutRisk = 0.85; // 85% шанс обнуления стока

        mitigations.push('Trigger emergency production runs with expedited lead times');
        mitigations.push('Halt B2B wholesale allocations to protect high-margin B2C channels');
        mitigations.push(
          'Increase retail price dynamically by 15% to cool down demand and maximize margin'
        );
        break;

      case 'supplier_bankruptcy':
        // Банкротство ключевой фабрики
        slDrop = 0.25; // Жесткое падение уровня сервиса на 25%
        revenueLoss = currentMonthlyRevenue * 0.2;
        stockoutRisk = 0.6;

        mitigations.push('Reallocate all pending Purchase Orders to secondary suppliers');
        mitigations.push('Review N-Tier dependencies to find alternative raw material sources');
        break;

      case 'raw_material_shortage':
        // Дефицит сырья (например, неурожай хлопка)
        slDrop = 0.1;
        revenueLoss = currentMonthlyRevenue * 0.08;
        stockoutRisk = 0.3;

        mitigations.push(
          'Substitute material in BOM (Bill of Materials) with recycled alternatives'
        );
        mitigations.push(
          'Delay launch of upcoming collection to preserve raw materials for core items'
        );
        break;
    }

    return {
      scenarioId: scenario.id,
      projectedRevenueLoss: Math.round(revenueLoss),
      projectedServiceLevelDrop: Math.round(slDrop * 100) / 100,
      stockoutRiskPercent: Math.round(stockoutRisk * 100),
      recommendedMitigations: mitigations,
    };
  }
}
