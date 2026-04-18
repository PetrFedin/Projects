export interface TelekineticMoveRequest {
  operatorId: string; // ID оператора с нейроинтерфейсом
  sku: string;
  massKg: number;
  sourceCoordinates: { x: number; y: number; z: number };
  targetCoordinates: { x: number; y: number; z: number };
  bciFocusLevel: number; // 0.0 - 1.0 (Уровень концентрации оператора по ЭЭГ)
  bciFatigueLevel: number; // 0.0 - 1.0 (Накопленная усталость мозга)
}

export interface TelekineticMoveResult {
  operatorId: string;
  sku: string;
  status: 'moved' | 'dropped' | 'fatigue_warning' | 'insufficient_focus';
  darkEnergyExpendedKWh: number; // Энергия, затраченная на локальную манипуляцию гравитацией
  newCoordinates: { x: number; y: number; z: number };
  reasoning: string;
}

/**
 * [Phase 54 — Telekinetic WMS (Mind-Controlled Warehouse)]
 * Телекинетическая система управления складом.
 * Операторы склада (или ИИ-надзиратели) используют нейроинтерфейсы (BCI из Фазы 42/47)
 * для перемещения товаров силой мысли. Система транслирует мозговые импульсы
 * в локальные изменения гравитационного поля (используя Темную Материю из Фазы 49),
 * позволяя левитировать и перемещать грузы любой массы без физического контакта.
 */
export class TelekineticWMSEngine {
  // Энергия для левитации 1 кг на 1 метр (манипуляция гравитацией)
  private static readonly DARK_ENERGY_PER_KG_METER_KWH = 15;

  /**
   * Пытается переместить груз с помощью телекинеза (гравитационной манипуляции).
   */
  public static executeMentalMove(request: TelekineticMoveRequest): TelekineticMoveResult {
    // [Phase 56] Math Hardening: Защита от NaN и отрицательных значений
    const safeMassKg = Math.max(0.001, isNaN(request.massKg) ? 1 : request.massKg);
    const safeFocus = Math.max(
      0.0,
      Math.min(1.0, isNaN(request.bciFocusLevel) ? 0 : request.bciFocusLevel)
    );
    const safeFatigue = Math.max(
      0.0,
      Math.min(1.0, isNaN(request.bciFatigueLevel) ? 0 : request.bciFatigueLevel)
    );

    let status: TelekineticMoveResult['status'] = 'moved';
    let darkEnergyExpendedKWh = 0;
    let newCoordinates = { ...request.targetCoordinates };
    let reasoning = 'Telekinetic transfer successful. ';

    // 1. Расчет дистанции (Евклидово расстояние)
    const dx = request.targetCoordinates.x - request.sourceCoordinates.x;
    const dy = request.targetCoordinates.y - request.sourceCoordinates.y;
    const dz = request.targetCoordinates.z - request.sourceCoordinates.z;
    const distanceMeters = Math.max(0, Math.sqrt(dx * dx + dy * dy + dz * dz)); // Расстояние не может быть отрицательным

    // 2. Оценка когнитивной нагрузки (Cognitive Load)
    // Чем тяжелее груз и дальше дистанция, тем выше должен быть фокус
    const requiredFocus = Math.min(0.99, (safeMassKg * distanceMeters) / 10000); // Упрощенная формула

    if (safeFatigue > 0.8) {
      status = 'fatigue_warning';
      newCoordinates = { ...request.sourceCoordinates }; // Груз не сдвинулся
      reasoning = `CRITICAL: Operator neural fatigue too high (${(safeFatigue * 100).toFixed(1)}%). Telekinetic link severed to prevent brain damage. Please rest. `;
      return {
        operatorId: request.operatorId,
        sku: request.sku,
        status,
        darkEnergyExpendedKWh: 0,
        newCoordinates,
        reasoning,
      };
    }

    if (safeFocus < requiredFocus) {
      // Фокус потерян во время перемещения — груз падает
      status = 'dropped';
      // Груз падает где-то посередине пути (упрощенно)
      newCoordinates = {
        x: request.sourceCoordinates.x + dx * safeFocus,
        y: request.sourceCoordinates.y + dy * safeFocus,
        z: 0, // Падает на пол
      };

      // Энергия тратится только на ту часть пути, которую успели пролететь
      darkEnergyExpendedKWh =
        safeMassKg * (distanceMeters * safeFocus) * this.DARK_ENERGY_PER_KG_METER_KWH;

      reasoning = `WARNING: Operator focus (${(safeFocus * 100).toFixed(1)}%) dropped below required threshold (${(requiredFocus * 100).toFixed(1)}%). Gravitational field collapsed. Item dropped at [${newCoordinates.x.toFixed(1)}, ${newCoordinates.y.toFixed(1)}, 0]. `;
    } else {
      // Успешное перемещение
      darkEnergyExpendedKWh = safeMassKg * distanceMeters * this.DARK_ENERGY_PER_KG_METER_KWH;
      reasoning += `Operator maintained high focus (${(safeFocus * 100).toFixed(1)}%). Localized gravity well successfully transported ${safeMassKg}kg over ${distanceMeters.toFixed(1)}m. Energy consumed: ${darkEnergyExpendedKWh.toLocaleString()} kWh. `;
    }

    return {
      operatorId: request.operatorId,
      sku: request.sku,
      status,
      darkEnergyExpendedKWh: Math.round(darkEnergyExpendedKWh),
      newCoordinates,
      reasoning,
    };
  }
}
