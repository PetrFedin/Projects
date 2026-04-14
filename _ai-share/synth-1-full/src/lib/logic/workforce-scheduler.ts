export interface StoreShiftContext {
  storeId: string;
  date: string;
  predictedFootTraffic: number; // Прогноз посетителей за день
  weatherForecast: 'sunny' | 'rainy' | 'snowstorm';
  incomingDeliveriesUnits: number; // Объем поставок с РЦ (Distribution Center)
  currentStaffCount: number; // Текущее штатное расписание (человек)
}

export interface ShiftOptimizationResult {
  storeId: string;
  recommendedStaffCount: number;
  staffingDelta: number; // +2 (нанять) или -1 (отпустить)
  action: 'hire_temp' | 'reduce_hours' | 'maintain' | 'reallocate_to_backroom';
  reasoning: string;
}

/**
 * [Phase 23 — Predictive Workforce Scheduler]
 * ML-движок оптимизации рабочего времени персонала (Workforce Management).
 * Прогнозирует загруженность магазина на основе трафика, погоды и поставок,
 * чтобы автоматически корректировать расписание смен: вызывать дополнительных
 * сотрудников в пиковые часы или отправлять домой в "мертвые" часы для экономии ФОТ.
 */
export class PredictiveWorkforceScheduler {
  /**
   * Рассчитывает оптимальное количество персонала на смену.
   */
  public static optimizeShift(context: StoreShiftContext): ShiftOptimizationResult {
    let recommendedStaffCount = 2; // Минимальный штат (касса + зал)
    let action: ShiftOptimizationResult['action'] = 'maintain';
    let reasoning = 'Baseline staffing is sufficient.';

    // 1. Оценка потребности по трафику (Sales Floor)
    // Допустим, 1 консультант может качественно обслужить 30 человек в день
    const trafficStaffNeeded = Math.ceil(context.predictedFootTraffic / 30);

    // 2. Влияние погоды на конверсию
    // В дождь людей меньше, но они покупают чаще (целевой трафик)
    let weatherMultiplier = 1.0;
    if (context.weatherForecast === 'rainy') {
      weatherMultiplier = 0.8; // Снижаем потребность в зале
      reasoning = `Rainy weather predicted. Foot traffic will drop, but conversion will rise. `;
    } else if (context.weatherForecast === 'snowstorm') {
      weatherMultiplier = 0.4; // Почти никого не будет
      reasoning = `Snowstorm predicted. Severe drop in foot traffic. `;
    }

    const adjustedTrafficStaff = Math.ceil(trafficStaffNeeded * weatherMultiplier);

    // 3. Оценка потребности по логистике (Backroom / Receiving)
    // Допустим, 1 кладовщик может разобрать 200 единиц товара за смену
    const logisticsStaffNeeded = Math.ceil(context.incomingDeliveriesUnits / 200);

    // Итоговая потребность
    recommendedStaffCount = Math.max(2, adjustedTrafficStaff + logisticsStaffNeeded);

    // 4. Сравнение с текущим штатом и выработка рекомендаций
    const staffingDelta = recommendedStaffCount - context.currentStaffCount;

    if (staffingDelta > 0) {
      // Нехватка персонала
      if (logisticsStaffNeeded > adjustedTrafficStaff && context.incomingDeliveriesUnits > 500) {
        // Проблема не в зале, а в огромной поставке
        action = 'reallocate_to_backroom';
        reasoning += `Massive delivery expected (${context.incomingDeliveriesUnits} units). Need +${staffingDelta} staff. Reallocate sales associates to backroom to process inventory.`;
      } else {
        // Проблема в наплыве покупателей
        action = 'hire_temp';
        reasoning += `High foot traffic expected (${context.predictedFootTraffic} visitors). Need +${staffingDelta} temp staff to maintain service level and prevent queue abandonment.`;
      }
    } else if (staffingDelta < 0) {
      // Переизбыток персонала (сжигаем ФОТ впустую)
      action = 'reduce_hours';
      reasoning += `Overstaffed by ${Math.abs(staffingDelta)} employees for predicted volume. Recommend reducing shift hours or offering voluntary time off to save payroll costs.`;
    } else {
      // Идеальное расписание
      action = 'maintain';
      reasoning += `Current staffing perfectly matches predicted demand (${context.predictedFootTraffic} visitors, ${context.incomingDeliveriesUnits} units delivery).`;
    }

    return {
      storeId: context.storeId,
      recommendedStaffCount,
      staffingDelta,
      action,
      reasoning
    };
  }
}
