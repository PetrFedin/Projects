export interface FactoryTelemetry {
  factoryId: string;
  machineId: string;
  type: 'sewing_machine' | 'cutting_table' | 'dyeing_vat';
  operatingTemperatureC: number;
  vibrationHz: number;
  operatingHours: number;
  lastMaintenanceDate: string;
}

export interface MaintenanceAlert {
  machineId: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  predictedFailureDate: string;
  recommendedAction: 'inspect' | 'replace_parts' | 'halt_production';
  reasoning: string;
}

/**
 * [Phase 26 — Predictive Maintenance for Manufacturing (IoT Factory)]
 * Предиктивное обслуживание фабричного оборудования.
 * В отличие от магазинов (Phase 25), здесь анализируется промышленное оборудование.
 * Предсказывает поломку швейных машин или красильных чанов на основе вибрации и температуры.
 * Позволяет остановить станок до того, как он испортит партию ткани или вызовет пожар.
 */
export class FactoryMaintenanceEngine {
  /**
   * Анализирует телеметрию станка и предсказывает поломки.
   */
  public static analyzeMachineHealth(data: FactoryTelemetry): MaintenanceAlert {
    let riskLevel: MaintenanceAlert['riskLevel'] = 'low';
    let predictedFailureDate = new Date(Date.now() + 90 * 86400000); // По умолчанию 3 месяца
    let recommendedAction: MaintenanceAlert['recommendedAction'] = 'inspect';
    let reasoning = 'Machine operating within normal parameters.';

    // 1. Анализ швейных машин (Sewing Machines)
    if (data.type === 'sewing_machine') {
      if (data.vibrationHz > 150) {
        // Сильная вибрация — износ игловодителя или подшипников
        riskLevel = 'high';
        predictedFailureDate = new Date(Date.now() + 3 * 86400000); // 3 дня
        recommendedAction = 'replace_parts';
        reasoning = `Abnormal vibration detected (${data.vibrationHz}Hz). High risk of needle breakage or fabric damage. Replace bearings immediately.`;
      } else if (data.operatingHours > 5000) {
        // Плановое ТО
        riskLevel = 'medium';
        predictedFailureDate = new Date(Date.now() + 14 * 86400000); // 2 недели
        recommendedAction = 'inspect';
        reasoning = `Machine exceeded 5000 operating hours. Schedule routine inspection and lubrication.`;
      }
    }

    // 2. Анализ красильных чанов (Dyeing Vats)
    if (data.type === 'dyeing_vat') {
      if (data.operatingTemperatureC > 140) {
        // Перегрев — риск взрыва или порчи ткани (Critical)
        riskLevel = 'critical';
        predictedFailureDate = new Date(Date.now() + 1 * 3600000); // 1 час
        recommendedAction = 'halt_production';
        reasoning = `CRITICAL OVERHEATING: Vat temperature at ${data.operatingTemperatureC}°C. Immediate risk of fabric destruction or fire. Halt production and dispatch emergency maintenance.`;
      } else if (data.operatingTemperatureC > 120) {
        // Аномальный нагрев
        riskLevel = 'high';
        predictedFailureDate = new Date(Date.now() + 2 * 86400000); // 2 дня
        recommendedAction = 'inspect';
        reasoning = `Elevated temperature (${data.operatingTemperatureC}°C). Inspect heating elements and coolant lines.`;
      }
    }

    // 3. Анализ раскройных столов (Cutting Tables)
    if (data.type === 'cutting_table') {
      if (data.vibrationHz > 80) {
        // Лезвие затупилось или искривилось
        riskLevel = 'medium';
        predictedFailureDate = new Date(Date.now() + 5 * 86400000); // 5 дней
        recommendedAction = 'replace_parts';
        reasoning = `Blade vibration anomaly (${data.vibrationHz}Hz). Risk of inaccurate cuts. Schedule blade replacement.`;
      }
    }

    return {
      machineId: data.machineId,
      riskLevel,
      predictedFailureDate: predictedFailureDate.toISOString(),
      recommendedAction,
      reasoning,
    };
  }
}
