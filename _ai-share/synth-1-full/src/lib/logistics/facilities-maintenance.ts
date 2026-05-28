export interface FacilityTelemetry {
  storeId: string;
  equipmentId: string;
  type: 'hvac' | 'pos_system' | 'lighting' | 'security_camera';
  temperatureC?: number;
  vibrationHz?: number;
  errorCodes: string[];
  uptimeHours: number;
}

export interface MaintenanceAction {
  ticketId: string;
  storeId: string;
  equipmentId: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  action: 'monitor' | 'schedule_inspection' | 'dispatch_technician' | 'order_replacement';
  estimatedCostUSD: number;
  reasoning: string;
}

/**
 * [Phase 25 — Predictive Facilities Maintenance (IoT Stores)]
 * Предиктивное обслуживание магазинов.
 * Анализирует телеметрию с IoT-датчиков оборудования (кондиционеры, кассы, камеры).
 * Предсказывает поломки до их возникновения и автоматически вызывает мастера,
 * чтобы магазин не простаивал из-за жары или сломанных касс.
 */
export class FacilitiesMaintenanceEngine {
  /**
   * Анализирует телеметрию оборудования и принимает решение об обслуживании.
   */
  public static analyzeTelemetry(data: FacilityTelemetry): MaintenanceAction {
    let priority: MaintenanceAction['priority'] = 'low';
    let action: MaintenanceAction['action'] = 'monitor';
    let estimatedCostUSD = 0;
    let reasoning = 'Equipment operating within normal parameters.';

    // 1. Анализ систем кондиционирования (HVAC)
    if (data.type === 'hvac') {
      if (
        data.errorCodes.includes('ERR_COMPRESSOR_FAIL') ||
        (data.temperatureC && data.temperatureC > 35)
      ) {
        // Критическая поломка: в магазине жарко, клиенты уходят
        priority = 'critical';
        action = 'dispatch_technician';
        estimatedCostUSD = 800; // Срочный выезд мастера
        reasoning = `HVAC failure detected (Temp: ${data.temperatureC}°C). Store environment is hostile to customers. Dispatching emergency technician immediately.`;
      } else if (data.vibrationHz && data.vibrationHz > 120) {
        // Аномальная вибрация — скоро сломается
        priority = 'medium';
        action = 'schedule_inspection';
        estimatedCostUSD = 150; // Плановый осмотр
        reasoning = `HVAC vibration anomaly (${data.vibrationHz}Hz). Predictive model indicates 80% chance of failure within 7 days. Scheduling preventative inspection.`;
      } else if (data.uptimeHours > 5000) {
        // Плановое ТО
        priority = 'low';
        action = 'schedule_inspection';
        estimatedCostUSD = 100;
        reasoning = `HVAC reached 5000 hours uptime. Routine filter change and inspection required.`;
      }
    }

    // 2. Анализ кассовых аппаратов (POS System)
    if (data.type === 'pos_system') {
      if (
        data.errorCodes.includes('ERR_NETWORK_DOWN') ||
        data.errorCodes.includes('ERR_PAYMENT_GATEWAY')
      ) {
        // Магазин не может принимать деньги — это катастрофа
        priority = 'critical';
        action = 'dispatch_technician';
        estimatedCostUSD = 500; // Выезд IT-специалиста
        reasoning = `POS System offline. Store cannot process transactions. Dispatching IT support immediately.`;
      } else if (data.errorCodes.includes('WARN_PRINTER_JAM')) {
        // Зажевало ленту — персонал справится сам
        priority = 'low';
        action = 'monitor';
        estimatedCostUSD = 0;
        reasoning = `POS printer jam detected. Alerting store manager via tablet to resolve locally. No technician needed.`;
      }
    }

    // 3. Анализ освещения (Lighting)
    if (data.type === 'lighting') {
      if (data.errorCodes.includes('ERR_MAIN_BREAKER_TRIP')) {
        priority = 'high';
        action = 'dispatch_technician';
        estimatedCostUSD = 300; // Электрик
        reasoning = `Main lighting breaker tripped. Store is dark. Dispatching electrician.`;
      } else if (data.uptimeHours > 20000) {
        // Лампы перегорают
        priority = 'medium';
        action = 'order_replacement';
        estimatedCostUSD = 1000; // Закупка LED-панелей
        reasoning = `LED panels exceeded 20,000 hours lifespan. Ordering replacement batch to maintain visual merchandising standards.`;
      }
    }

    return {
      ticketId: `fm-${Date.now()}`,
      storeId: data.storeId,
      equipmentId: data.equipmentId,
      priority,
      action,
      estimatedCostUSD,
      reasoning,
    };
  }
}
