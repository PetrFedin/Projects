import { publishControlRiskAlert } from '../order/domain-event-factories';
import { InventoryGrain } from '../logic/inventory-ledger';

export interface RFIDScanEvent {
  rfidTag: string;
  readerId: string;
  locationId: string;
  timestamp: string;
  temperature?: number; // Для хрупких/термочувствительных грузов
  humidity?: number;
}

export interface TrackingAnomaly {
  type: 'wrong_location' | 'temperature_breach' | 'missing_scan';
  severity: 'low' | 'high' | 'critical';
  message: string;
}

/**
 * [Phase 9 — IoT / RFID Tracking Engine]
 * Система отслеживания физического перемещения товаров в реальном времени.
 * Анализирует сканы RFID-меток на складах, в транзите и в магазинах.
 */
export class IoTTrackingEngine {
  // Связь RFID метки с конкретной гранулой стока (SKU + Lot)
  private static tagToGrainMap: Map<string, string> = new Map();

  /**
   * Привязывает RFID-метку к грануле при производстве или приемке.
   */
  public static assignTag(rfidTag: string, grainId: string): void {
    this.tagToGrainMap.set(rfidTag, grainId);
  }

  /**
   * Обрабатывает скан с RFID-рамки (например, при погрузке в трак).
   */
  public static processScan(scan: RFIDScanEvent, currentGrains: InventoryGrain[]): TrackingAnomaly | null {
    const grainId = this.tagToGrainMap.get(scan.rfidTag);
    if (!grainId) {
      return {
        type: 'missing_scan',
        severity: 'high',
        message: `Unknown RFID tag scanned: ${scan.rfidTag} at ${scan.locationId}`
      };
    }

    const grain = currentGrains.find(g => g.grainId === grainId);
    if (!grain) return null;

    // 1. Проверка локации (защита от отгрузки не туда)
    // Если товар числится на складе А, а скан пришел со склада Б без статуса in_transit
    if (grain.locationId !== scan.locationId && grain.state !== 'in_transit') {
      const anomaly: TrackingAnomaly = {
        type: 'wrong_location',
        severity: 'critical',
        message: `Grain ${grainId} (${grain.sku}) scanned at ${scan.locationId}, but expected at ${grain.locationId}`
      };
      
      // Публикуем алерт в Control Layer
      void publishControlRiskAlert({
        aggregateId: grain.sku,
        aggregateType: 'inventory',
        version: 1,
        eventIdPrefix: 'iot-alert',
        payload: {
          riskLevel: 'critical',
          factors: [anomaly.message],
          autoCreateInteraction: true
        }
      });

      return anomaly;
    }

    // 2. Проверка условий хранения (Cold Chain / Humidity)
    if (scan.temperature !== undefined && (scan.temperature > 25 || scan.temperature < -5)) {
      return {
        type: 'temperature_breach',
        severity: 'high',
        message: `Temperature breach detected for ${grain.sku}: ${scan.temperature}°C`
      };
    }

    return null; // Все в норме
  }
}
