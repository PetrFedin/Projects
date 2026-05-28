import { InventoryGrain, calculateATP } from './inventory-ledger';
import { publishInventoryDiscrepancyDetected } from '../order/domain-event-factories';

/**
 * [Phase 2 — Inventory Reconciliation Service]
 * Сервис сверки плановых остатков (Merch) и фактических (Ledger).
 * Помогает находить "тихие" расхождения и оверсейлы.
 */

export interface MerchStockSnapshot {
  sku: string;
  plannedQuantity: number; // То, что мерчендайзер видит в матрице
  channelId?: 'b2b' | 'b2c' | 'retail';
}

export interface DiscrepancyReport {
  sku: string;
  channelId?: string;
  merchQuantity: number;
  ledgerQuantity: number;
  diff: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  actionRequired: boolean;
}

export class InventoryReconciliationService {
  /**
   * Выполняет сверку снимка мерч-матрицы с текущим Ledger.
   */
  public static reconcile(
    merchSnapshots: MerchStockSnapshot[],
    ledgerGrains: InventoryGrain[],
    actorId: string,
    tenantId: string // [Phase 2 Prod] Обязателен для изоляции
  ): DiscrepancyReport[] {
    const reports: DiscrepancyReport[] = [];

    for (const merch of merchSnapshots) {
      // Считаем ATP в Ledger для конкретного канала и арендатора
      const ledgerATP = calculateATP({
        grains: ledgerGrains,
        channelId: merch.channelId,
        actorId: actorId,
        actorType: 'brand', // Сверяем от лица бренда
        tenantId, // [Phase 2 Prod] Изоляция
        strictIsolation: true, // [Phase 2 Prod] Строгий режим
      });

      const diff = ledgerATP - merch.plannedQuantity;

      if (diff !== 0) {
        const severity = this.calculateSeverity(diff, merch.plannedQuantity);

        const report: DiscrepancyReport = {
          sku: merch.sku,
          channelId: merch.channelId,
          merchQuantity: merch.plannedQuantity,
          ledgerQuantity: ledgerATP,
          diff,
          severity,
          actionRequired: severity !== 'low',
        };

        reports.push(report);

        // Если расхождение критическое, уведомляем систему
        if (report.actionRequired) {
          this.publishDiscrepancyEvent(report, actorId);
        }
      }
    }

    return reports;
  }

  private static calculateSeverity(diff: number, planned: number): DiscrepancyReport['severity'] {
    const absDiff = Math.abs(diff);
    const percent = (absDiff / (planned || 1)) * 100;

    if (diff < 0) {
      // Оверсейл (в Ledger меньше, чем планировали продать)
      if (percent > 20 || absDiff > 50) return 'critical';
      return 'high';
    } else {
      // Излишек (в Ledger больше, чем в матрице)
      if (percent > 50) return 'medium';
      return 'low';
    }
  }

  private static publishDiscrepancyEvent(report: DiscrepancyReport, actorId: string): void {
    void publishInventoryDiscrepancyDetected({
      aggregateId: report.sku,
      version: 1,
      payload: { ...report, detectedBy: actorId },
    });
  }
}
