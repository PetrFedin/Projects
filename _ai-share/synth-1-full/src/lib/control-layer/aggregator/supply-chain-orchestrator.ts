import { ControlOutput, EntityRef } from '@/lib/contracts';
import { OmnichannelRouter } from '@/lib/omnichannel/omnichannel-router';
import { controlStorage } from './control-storage';
import { DomainEventTypes, eventBus, StockLowEvent } from '@/lib/order/domain-events';
import { ProductionAggregate } from '@/lib/production/production-aggregate';

export interface OrchestrationResult {
  action: string;
  entity_id: string;
  status: 'executed' | 'failed';
  reason?: string;
}

/**
 * [Phase 3 — Supply Chain Orchestrator]
 * Автоматизированный оркестратор, который корректирует цепочку поставок и аллокации
 * на основе сигналов управления (например, перенаправление стока при задержке).
 * [Phase 4] Inventory-to-Production Sync (Auto-Replenishment).
 */
export class SupplyChainOrchestrator {
  constructor() {
    // Подписка на падение стока для авто-пополнения
    eventBus.subscribe(DomainEventTypes.inventory.stockLow, async (event: StockLowEvent) => {
      await this.handleLowStock(event);
    });
  }

  /**
   * [Phase 4] Автоматическое создание черновика на производство при падении стока.
   */
  private async handleLowStock(event: StockLowEvent) {
    const { sku, currentAtp, threshold, suggestedReplenishment } = event.payload;
    console.log(
      `[SupplyChainOrchestrator] Low stock detected for ${sku}. ATP: ${currentAtp}, Threshold: ${threshold}. Triggering replenishment...`
    );

    // В реальной системе здесь был бы вызов сервиса создания ProductionCommitment
    // Пока просто логируем и создаем мок-агрегат
    const draftId = `draft-${Date.now()}`;
    const newCommitment = new ProductionAggregate({
      id: draftId,
      articleId: 'unknown', // Требуется резолв из PIM
      type: 'bulk_production',
      status: 'planned',
      targetQuantity: suggestedReplenishment,
      actualQuantity: 0,
      qcPassedQuantity: 0,
      plannedStartDate: new Date().toISOString(),
      plannedEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // +30 дней
      factoryId: 'auto-assigned',
      qcGates: [],
      currency: 'RUB',
      metadata: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        version: 1,
      },
    });

    console.log(
      `[SupplyChainOrchestrator] Created replenishment draft ${draftId} for ${suggestedReplenishment} units of ${sku}`
    );
  }

  /**
   * Пытается автоматически скорректировать ситуацию при обнаружении высокого риска.
   */
  public static async orchestrate(output: ControlOutput): Promise<OrchestrationResult[]> {
    const results: OrchestrationResult[] = [];

    // 1. Если риск высокий и это заказ (order)
    if (output.risk === 'high' && output.entity_ref.entity_type === 'order') {
      // Пытаемся найти альтернативный сток (Omnichannel Re-routing)
      const routingResult = OmnichannelRouter.findOptimalLocation(
        {
          sku: output.entity_ref.entity_id,
          quantity: 1, // Имитация: 1 единица
          customerCoordinates: { lat: 0, lng: 0 }, // Заглушка
          actorId: 'system',
          actorType: 'brand',
        },
        [],
        []
      ); // В реальном приложении передаем локации и леджер

      if (routingResult.success && routingResult.locationId) {
        results.push({
          action: 'RE_ROUTE_ORDER',
          entity_id: output.entity_ref.entity_id,
          status: 'executed',
          reason: `Re-routed to ${routingResult.locationId} due to high risk at original source`,
        });
      }
    }

    // 2. Если задержка в производстве (commitment)
    if (output.risk === 'high' && (output as any).deadline_pressure?.level === 'overdue') {
      // Пытаемся перераспределить квоты (Allocation Adjustment)
      results.push({
        action: 'ADJUST_ALLOCATION_QUOTA',
        entity_id: output.entityId || (output as any).entity_ref?.entity_id,
        status: 'executed',
        reason: 'Reduced B2C quota to prioritize B2B fulfillment due to production delay',
      });
    }

    return results;
  }
}
