export interface SimulationScenario {
  scenarioId: string;
  name: string;
  disruptionType: 'port_closure' | 'demand_spike' | 'factory_shutdown' | 'raw_material_shortage';
  targetNodeId: string; // ID порта, фабрики или региона
  durationDays: number;
  magnitudeMultiplier: number; // Например, 2.0 для двукратного скачка спроса
}

export interface NetworkStateSnapshot {
  totalInventoryUnits: number;
  dailyDemandUnits: number;
  averageLeadTimeDays: number;
  dailyRevenue: number;
}

export interface SimulationResult {
  scenarioId: string;
  projectedRevenueLoss: number;
  inventoryShortfallUnits: number;
  daysToRecovery: number;
  recommendedMitigation: string;
  confidenceScore: number; // 0.0 - 1.0
}

/**
 * [Phase 20 — Supply Chain Digital Twin Simulator (What-If Engine)]
 * Симулятор "Цифрового двойника" цепи поставок.
 * Позволяет запускать стресс-тесты (What-If сценарии) на виртуальной копии сети.
 * Например: "Что будет с выручкой, если порт Шанхая закроется на 14 дней?"
 * или "Хватит ли запасов, если спрос на куртки вырастет в 3 раза из-за аномальных холодов?"
 */
export class DigitalTwinSimulator {
  /**
   * Запускает симуляцию сценария на текущем слепке сети.
   */
  public static runSimulation(scenario: SimulationScenario, currentState: NetworkStateSnapshot): SimulationResult {
    let projectedRevenueLoss = 0;
    let inventoryShortfallUnits = 0;
    let daysToRecovery = 0;
    let recommendedMitigation = '';

    // Базовые расчеты
    const bufferDays = currentState.totalInventoryUnits / currentState.dailyDemandUnits;

    switch (scenario.disruptionType) {
      case 'port_closure':
      case 'factory_shutdown':
        // Поставка останавливается на durationDays
        const missedUnits = currentState.dailyDemandUnits * scenario.durationDays;
        
        if (bufferDays >= scenario.durationDays) {
          // Буфера хватает
          inventoryShortfallUnits = 0;
          daysToRecovery = scenario.durationDays + 5; // Время на восстановление ритма
          recommendedMitigation = 'Current safety stock is sufficient to absorb the shock. No immediate action required, but monitor closely.';
        } else {
          // Буфера не хватает (Out of Stock)
          const outOfStockDays = scenario.durationDays - bufferDays;
          inventoryShortfallUnits = Math.round(outOfStockDays * currentState.dailyDemandUnits);
          projectedRevenueLoss = inventoryShortfallUnits * (currentState.dailyRevenue / currentState.dailyDemandUnits);
          daysToRecovery = scenario.durationDays + Math.round(outOfStockDays * 1.5);
          
          recommendedMitigation = `CRITICAL: Buffer depleted. Expedite air freight for ${inventoryShortfallUnits} units immediately to minimize revenue loss.`;
        }
        break;

      case 'demand_spike':
        // Спрос резко возрастает
        const newDailyDemand = currentState.dailyDemandUnits * scenario.magnitudeMultiplier;
        const newBufferDays = currentState.totalInventoryUnits / newDailyDemand;
        
        if (newBufferDays >= currentState.averageLeadTimeDays) {
          recommendedMitigation = 'Inventory levels can sustain the spike until next regular replenishment.';
        } else {
          const shortageDays = currentState.averageLeadTimeDays - newBufferDays;
          inventoryShortfallUnits = Math.round(shortageDays * newDailyDemand);
          projectedRevenueLoss = inventoryShortfallUnits * (currentState.dailyRevenue / currentState.dailyDemandUnits); // Упущенная выгода
          daysToRecovery = currentState.averageLeadTimeDays;
          
          recommendedMitigation = `WARNING: Demand spike will cause stockout in ${Math.round(newBufferDays)} days. Trigger emergency production run or re-allocate from other regions.`;
        }
        break;

      case 'raw_material_shortage':
        // Растет Lead Time
        const extendedLeadTime = currentState.averageLeadTimeDays + scenario.durationDays;
        if (bufferDays >= extendedLeadTime) {
          recommendedMitigation = 'Raw material shortage absorbed by existing finished goods buffer.';
        } else {
          inventoryShortfallUnits = Math.round((extendedLeadTime - bufferDays) * currentState.dailyDemandUnits);
          projectedRevenueLoss = inventoryShortfallUnits * (currentState.dailyRevenue / currentState.dailyDemandUnits);
          daysToRecovery = extendedLeadTime + 10;
          recommendedMitigation = `Switch to alternative BOM (Bill of Materials) or activate Tier-2 backup suppliers immediately.`;
        }
        break;
    }

    return {
      scenarioId: scenario.scenarioId,
      projectedRevenueLoss: Math.round(projectedRevenueLoss),
      inventoryShortfallUnits,
      daysToRecovery,
      recommendedMitigation,
      confidenceScore: 0.85 // В реальном ML-движке зависит от качества исторических данных
    };
  }
}
