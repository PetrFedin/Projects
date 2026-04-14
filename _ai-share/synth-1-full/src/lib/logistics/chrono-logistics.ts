export interface ChronoDeliveryRequest {
  orderId: string;
  origin: 'earth' | 'mars' | 'orbital_station';
  destination: 'earth' | 'mars' | 'orbital_station';
  massKg: number;
  targetArrivalOffsetMinutes: number; // Отрицательное значение означает доставку "до" момента заказа (предиктивно)
  maxAntimatterBudgetGrams: number;
}

export interface ChronoDeliveryResult {
  orderId: string;
  status: 'dispatched' | 'temporal_paradox_risk' | 'insufficient_energy';
  timeDilationFactor: number; // Насколько искривлено время
  antimatterConsumedGrams: number;
  estimatedArrivalLocalTime: string;
  reasoning: string;
}

/**
 * [Phase 48 — Chrono-Logistics Engine (Time Dilation Delivery)]
 * Движок хроно-логистики для манипуляции временем при доставке.
 * Использует микро-черные дыры или релятивистские дроны для доставки товаров
 * быстрее скорости света или даже *до* того, как клиент осознанно оформит заказ
 * (опираясь на квантовые прогнозы и телепатические намерения).
 * Потребляет колоссальные объемы антиматерии (Phase 47).
 */
export class ChronoLogisticsEngine {
  // Энергия для искривления пространства-времени (зависит от массы и сдвига во времени)
  private static readonly ANTIMATTER_PER_KG_PER_MINUTE_GRAMS = 0.5;

  /**
   * Рассчитывает параметры и инициирует хроно-доставку.
   */
  public static dispatchTemporalShipment(request: ChronoDeliveryRequest): ChronoDeliveryResult {
    // [Phase 51] Math Hardening: Защита от NaN, отрицательной массы и бесконечных временных сдвигов
    const safeMassKg = Math.max(0.001, isNaN(request.massKg) ? 1 : request.massKg); // Масса не может быть 0 или отрицательной
    const safeOffsetMinutes = isNaN(request.targetArrivalOffsetMinutes) ? 0 : request.targetArrivalOffsetMinutes;
    // Ограничиваем сдвиг во времени (не более 1 года в прошлое или будущее, чтобы избежать переполнения)
    const boundedOffsetMinutes = Math.max(-525600, Math.min(525600, safeOffsetMinutes));

    let status: ChronoDeliveryResult['status'] = 'dispatched';
    let timeDilationFactor = 1.0;
    let antimatterConsumedGrams = 0;
    let reasoning = 'Standard relativistic transit initiated. ';
    const now = new Date();

    // 1. Расчет энергозатрат (Антиматерия)
    // Чем дальше в прошлое (отрицательный offset) или быстрее в будущее, тем больше энергии
    const temporalShiftMinutes = Math.abs(boundedOffsetMinutes);
    antimatterConsumedGrams = safeMassKg * temporalShiftMinutes * this.ANTIMATTER_PER_KG_PER_MINUTE_GRAMS;

    // 2. Проверка бюджета энергии
    if (antimatterConsumedGrams > request.maxAntimatterBudgetGrams) {
      return {
        orderId: request.orderId,
        status: 'insufficient_energy',
        timeDilationFactor: 1.0,
        antimatterConsumedGrams: 0,
        estimatedArrivalLocalTime: now.toISOString(),
        reasoning: `CRITICAL: Temporal displacement requires ${antimatterConsumedGrams.toFixed(2)}g of antimatter, exceeding budget of ${request.maxAntimatterBudgetGrams}g. Delivery aborted.`
      };
    }

    // 3. Проверка на временные парадоксы (Grandfather Paradox)
    // Если мы доставляем товар более чем за 60 минут ДО заказа, клиент может испугаться и отменить заказ,
    // что создаст парадокс: товар доставлен, но не заказан.
    if (boundedOffsetMinutes < -60) {
      status = 'temporal_paradox_risk';
      reasoning = `WARNING: Target arrival is ${Math.abs(boundedOffsetMinutes)} minutes BEFORE order placement. High risk of temporal paradox (Timeline divergence > 85%). Dispatch halted pending DAO approval. `;
      return {
        orderId: request.orderId,
        status,
        timeDilationFactor: 0,
        antimatterConsumedGrams: 0,
        estimatedArrivalLocalTime: now.toISOString(),
        reasoning
      };
    }

    // 4. Успешная хроно-маршрутизация
    if (boundedOffsetMinutes < 0) {
      timeDilationFactor = -1.5; // Обратный ход времени (локально для дрона)
      reasoning += `Predictive pre-delivery engaged. Drone enters closed timelike curve. Arriving ${Math.abs(boundedOffsetMinutes)} minutes before order confirmation. `;
    } else if (boundedOffsetMinutes === 0) {
      timeDilationFactor = 0; // Мгновенная телепортация (Wormhole)
      reasoning += `Zero-time Einstein-Rosen bridge established. Instantaneous delivery. `;
    } else {
      timeDilationFactor = 0.8; // Ускоренное время (релятивистское)
      reasoning += `Relativistic time dilation applied. Arriving in exactly ${boundedOffsetMinutes} minutes local time. `;
    }

    const arrivalTime = new Date(now.getTime() + boundedOffsetMinutes * 60000);

    return {
      orderId: request.orderId,
      status,
      timeDilationFactor,
      antimatterConsumedGrams,
      estimatedArrivalLocalTime: arrivalTime.toISOString(),
      reasoning
    };
  }
}
