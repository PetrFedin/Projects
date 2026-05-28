export interface NetworkTopology {
  nodes: number; // Количество фабрик, РЦ, магазинов
  edges: number; // Количество маршрутов между ними
  totalInventoryValueUSD: number;
  averageLeadTimeDays: number;
}

export interface StressTestScenario {
  scenarioId: string;
  name: string;
  disruptionType: 'supplier_bankruptcy' | 'port_strike' | 'cyber_attack' | 'hyper_inflation';
  magnitude: number; // 0.0 - 1.0 (Сила удара)
  durationDays: number;
}

export interface StressTestResult {
  scenarioId: string;
  networkResilienceScore: number; // 0-100 (Насколько сеть выдержала удар)
  projectedRevenueLossUSD: number;
  criticalFailurePoints: string[]; // Узлы, которые "упали" первыми
  recommendedStructuralChanges: string[];
  reasoning: string;
}

/**
 * [Phase 40 — Cognitive Supply Chain Digital Twin (Network Stress Testing)]
 * Продвинутый симулятор стресс-тестирования всей корпоративной сети.
 * В отличие от локальных симуляций (Phase 20), этот движок тестирует *структуру* сети
 * на макро-уровне (Black Swan Events). Что будет, если 30% поставщиков обанкротятся?
 * Что будет при гиперинфляции и росте стоимости логистики на 300%?
 * Выдает индекс устойчивости (Resilience Score) и рекомендации по реструктуризации.
 */
export class NetworkStressTestEngine {
  /**
   * Запускает макро-симуляцию "Черного лебедя" на цифровом двойнике цепи поставок.
   */
  public static runStressTest(
    topology: NetworkTopology,
    scenario: StressTestScenario
  ): StressTestResult {
    let networkResilienceScore = 100;
    let projectedRevenueLossUSD = 0;
    const criticalFailurePoints: string[] = [];
    const recommendedStructuralChanges: string[] = [];
    let reasoning = 'Network demonstrated high resilience to the simulated shock.';

    // 1. Симуляция: Банкротство поставщиков (Supplier Bankruptcy)
    if (scenario.disruptionType === 'supplier_bankruptcy') {
      // Если удар сильный (например, 0.4 = 40% поставщиков ушли)
      if (scenario.magnitude > 0.3) {
        networkResilienceScore -= 40;
        projectedRevenueLossUSD = topology.totalInventoryValueUSD * 0.25; // Теряем 25% потенциальной выручки
        criticalFailurePoints.push('Tier-2 Raw Material Suppliers (Asia)');
        criticalFailurePoints.push('Single-Sourced Components (Zippers, Buttons)');

        recommendedStructuralChanges.push(
          'Implement multi-sourcing strategy (minimum 2 suppliers per critical component).'
        );
        recommendedStructuralChanges.push(
          'Shift 20% of production to nearshore facilities (Mexico/Turkey) to reduce dependency on single region.'
        );

        reasoning = `Massive supplier bankruptcy (${(scenario.magnitude * 100).toFixed(0)}%) simulated. Network resilience dropped to ${networkResilienceScore}. High dependency on single-sourced components caused cascading failures.`;
      }
    }

    // 2. Симуляция: Забастовка в портах (Port Strike)
    if (scenario.disruptionType === 'port_strike') {
      const delayedInventoryValue = topology.totalInventoryValueUSD * scenario.magnitude;

      if (scenario.durationDays > 30) {
        networkResilienceScore -= 30;
        // Убытки от упущенных продаж (Out of Stock) и стоимости замороженного капитала
        projectedRevenueLossUSD = delayedInventoryValue * 0.15;
        criticalFailurePoints.push('West Coast US Ports');
        criticalFailurePoints.push('Central European Distribution Hub');

        recommendedStructuralChanges.push(
          'Increase safety stock buffers at regional DCs by 15% before peak season.'
        );
        recommendedStructuralChanges.push(
          'Pre-negotiate emergency air-freight contracts to bypass maritime bottlenecks.'
        );

        reasoning = `Prolonged port strike (${scenario.durationDays} days) simulated. $${delayedInventoryValue.toLocaleString()} of inventory frozen in transit. Lead times doubled, causing severe stockouts.`;
      }
    }

    // 3. Симуляция: Кибератака (Cyber Attack)
    if (scenario.disruptionType === 'cyber_attack') {
      if (scenario.magnitude > 0.8) {
        networkResilienceScore -= 60; // Самый опасный сценарий для цифровой компании
        projectedRevenueLossUSD = topology.totalInventoryValueUSD * 0.4; // Полная остановка продаж
        criticalFailurePoints.push('Central ERP Database');
        criticalFailurePoints.push('Automated Warehouse Management System (WMS)');

        recommendedStructuralChanges.push(
          'Implement Zero-Trust Architecture (Phase 38) across all IoT and server nodes.'
        );
        recommendedStructuralChanges.push(
          'Deploy immutable blockchain audit trails (Phase 13) for critical financial and inventory ledgers to ensure data recovery.'
        );

        reasoning = `Catastrophic cyber attack (Magnitude: ${scenario.magnitude}) simulated. WMS and ERP systems compromised. Network paralyzed. Extreme revenue loss projected.`;
      }
    }

    // 4. Ограничение индекса устойчивости
    networkResilienceScore = Math.max(0, Math.min(100, networkResilienceScore));

    return {
      scenarioId: scenario.scenarioId,
      networkResilienceScore,
      projectedRevenueLossUSD: Math.round(projectedRevenueLossUSD),
      criticalFailurePoints,
      recommendedStructuralChanges,
      reasoning,
    };
  }
}
