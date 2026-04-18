export interface ShelfState {
  storeId: string;
  sku: string;
  currentUnits: number;
  capacityUnits: number;
  historicalVelocityPerHour: number;
  upcomingPromotions: boolean;
  weatherForecast: 'sunny' | 'rainy' | 'snowy';
}

export interface ReplenishmentTask {
  storeId: string;
  sku: string;
  action: 'restock_now' | 'schedule_restock' | 'do_nothing';
  quantityToRestock: number;
  urgencyLevel: 'low' | 'medium' | 'high' | 'critical';
  reasoning: string;
}

/**
 * [Phase 40 — Autonomous Store Replenishment (Predictive Shelf AI)]
 * Предиктивный движок пополнения полок в физическом магазине.
 * В отличие от реактивного Smart Shelf (Phase 20), который реагирует на пустую полку,
 * этот ИИ предсказывает, когда полка опустеет, учитывая погоду, акции и скорость продаж.
 * Он генерирует задачи для персонала магазина ЗАРАНЕЕ, чтобы полка никогда не пустовала.
 */
export class PredictiveShelfEngine {
  /**
   * Анализирует состояние полки и предсказывает потребность в пополнении.
   */
  public static predictReplenishment(state: ShelfState): ReplenishmentTask {
    let action: ReplenishmentTask['action'] = 'do_nothing';
    let quantityToRestock = 0;
    let urgencyLevel: ReplenishmentTask['urgencyLevel'] = 'low';
    let reasoning = 'Shelf is adequately stocked for current demand.';

    // 1. Базовый расчет: На сколько часов хватит текущего товара?
    // Защита от деления на ноль (если товар вообще не продается)
    const safeVelocity = Math.max(0.1, state.historicalVelocityPerHour);
    let hoursOfSupply = state.currentUnits / safeVelocity;

    // 2. Корректировка скорости продаж на основе внешних факторов
    let adjustedVelocity = safeVelocity;

    // Если на товар скоро акция (Promotion) — продажи вырастут
    if (state.upcomingPromotions) {
      adjustedVelocity *= 1.5; // Ожидаем рост продаж на 50%
      reasoning = `Upcoming promotion detected. Expected velocity increased by 50% to ${adjustedVelocity.toFixed(1)} units/hr. `;
    }

    // Если погода плохая (Rainy/Snowy) — трафик в магазине упадет
    if (state.weatherForecast === 'rainy' || state.weatherForecast === 'snowy') {
      adjustedVelocity *= 0.7; // Ожидаем падение продаж на 30%
      reasoning = `Poor weather (${state.weatherForecast}) predicted. Expected foot traffic and velocity decreased by 30%. `;
    }

    // Пересчитываем часы запаса с учетом новых факторов
    hoursOfSupply = state.currentUnits / adjustedVelocity;

    // 3. Принятие решения (Decision Matrix)
    // Если товара хватит меньше чем на 2 часа — это критично (упущенная выгода)
    if (hoursOfSupply < 2) {
      action = 'restock_now';
      urgencyLevel = 'critical';
      // Пополняем до полной вместимости полки
      quantityToRestock = state.capacityUnits - state.currentUnits;
      reasoning += `CRITICAL: Shelf will empty in ${hoursOfSupply.toFixed(1)} hours. Immediate restock of ${quantityToRestock} units required to prevent stockout.`;
    }
    // Если товара хватит на 2-6 часов — планируем пополнение (например, в конце смены)
    else if (hoursOfSupply < 6) {
      action = 'schedule_restock';
      urgencyLevel = 'medium';
      quantityToRestock = state.capacityUnits - state.currentUnits;
      reasoning += `Shelf will empty in ${hoursOfSupply.toFixed(1)} hours. Schedule restock of ${quantityToRestock} units during next staff round.`;
    }
    // Если товара хватит больше чем на 6 часов — ничего не делаем
    else {
      action = 'do_nothing';
      quantityToRestock = 0;
      urgencyLevel = 'low';
      reasoning += `Shelf has sufficient stock for ${hoursOfSupply.toFixed(1)} hours. No action required.`;
    }

    return {
      storeId: state.storeId,
      sku: state.sku,
      action,
      quantityToRestock,
      urgencyLevel,
      reasoning,
    };
  }
}
