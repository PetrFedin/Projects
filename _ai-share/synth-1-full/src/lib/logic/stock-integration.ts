import { UnifiedStockView, StockSource, type StockSyncAgreement } from '@/lib/types/marketplace';
import type { InventoryGrain } from './inventory-ledger';

export type { StockSyncAgreement };

/**
 * Integration Hub (Connective Tissue)
 * Управление перемещением стока между B2B и B2C каналами.
 */

export interface StockMoveLog {
  id: string;
  productId: string;
  sku: string;
  fromChannel: 'b2b' | 'b2c' | 'brand_warehouse' | 'retail_store';
  toChannel: 'b2b' | 'b2c' | 'brand_warehouse' | 'retail_store';
  quantity: number;
  reason: string;
  timestamp: string;
  initiatedBy: string;
}

/** Источник с явным владельцем (юнит-тесты VMI + демо). */
export type StockSourceWithOwner = StockSource & { ownerId: string };

export type StockLike = StockSourceWithOwner | InventoryGrain;

/**
 * Может ли актор менять сток (владение + активное VMI при кросс-владении).
 */
export function canManageStock(params: {
  actorId: string;
  actorType: 'brand' | 'shop';
  source: StockLike;
  targetProductId: string;
  agreement?: StockSyncAgreement;
  tenantId?: string;
}): { allowed: boolean; reason?: string } {
  const { actorId, actorType, agreement } = params;
  const ownerId = params.source.ownerId;

  if (
    'tenantId' in params.source &&
    params.source.tenantId &&
    params.tenantId &&
    params.source.tenantId !== params.tenantId
  ) {
    return { allowed: false, reason: 'Tenant mismatch' };
  }

  if (actorType === 'brand') {
    if (ownerId === actorId) return { allowed: true };
    const vmiOk =
      agreement &&
      agreement.status === 'active' &&
      agreement.brandId === actorId &&
      agreement.retailerId === ownerId;
    if (vmiOk) return { allowed: true };
    if (ownerId !== actorId) {
      return {
        allowed: false,
        reason:
          agreement && agreement.status !== 'active'
            ? 'no active VMI'
            : 'Brand does not own this grain',
      };
    }
  }

  if (actorType === 'shop') {
    if (ownerId === actorId) return { allowed: true };
    const shopVmi =
      agreement &&
      agreement.status === 'active' &&
      agreement.retailerId === actorId &&
      agreement.brandId === ownerId;
    if (shopVmi) return { allowed: true };
    return { allowed: false, reason: 'Shop does not own this grain' };
  }

  return { allowed: false, reason: 'Ownership boundary violation' };
}

/**
 * Ребалансировка стока
 * Перемещает свободный остаток из B2B резерва в B2C (Marketroom) и наоборот.
 */
export function rebalanceStock(
  view: UnifiedStockView,
  sourceId: string,
  quantity: number,
  targetChannel: 'b2b' | 'b2c'
): { success: boolean; log?: StockMoveLog; error?: string } {
  const source = view.sources.find((s) => s.locationId === sourceId);

  if (!source) return { success: false, error: 'Source not found' };
  if (source.available < quantity) return { success: false, error: 'Insufficient stock' };

  console.log(
    `[IntegrationHub] Rebalancing ${quantity} units to ${targetChannel} for ${view.productId} (Owner: ${view.brandId})`
  );

  const log: StockMoveLog = {
    id: `move-${Date.now()}`,
    productId: view.productId,
    sku: view.sku,
    fromChannel: 'brand_warehouse',
    toChannel: targetChannel,
    quantity,
    reason: `Strategic rebalance to ${targetChannel}`,
    timestamp: new Date().toISOString(),
    initiatedBy: 'system_auto_balancer',
  };

  return { success: true, log };
}

/**
 * Авто-резервирование (Safety Stock)
 */
export function calculateSafetyStock(
  dailySalesVelocity: number,
  leadTimeDays: number,
  serviceLevel: number = 1.645
): number {
  return Math.ceil(dailySalesVelocity * leadTimeDays * 1.2);
}

/**
 * Синхронизация с маркетплейсами (Wildberries, Ozon, Amazon)
 */
export function prepareExternalStockSync(view: UnifiedStockView): Record<string, unknown> {
  return {
    sku: view.sku,
    warehouseId: view.sources[0]?.locationId,
    stock: view.totalAvailable,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Расчёт взаиморасчётов при кросс-канальном перемещении или VMI-продаже.
 */
export function calculateSettlementImpact(params: {
  quantity: number;
  unitPrice: number;
  agreement: StockSyncAgreement;
  type: 'vmi_sale' | 'channel_transfer';
}): { amount: number; currency: string; recipientId: string } {
  const { quantity, unitPrice, agreement, type } = params;
  const commission = agreement.terms.revenueSharePercent ?? agreement.terms.commissionPercent ?? 0;
  const amount =
    type === 'vmi_sale' ? quantity * unitPrice * (1 - commission / 100) : quantity * unitPrice;

  return {
    amount,
    currency: agreement.terms.currency || 'RUB',
    recipientId: agreement.brandId,
  };
}

export function generateSettlementLog(params: {
  impact: ReturnType<typeof calculateSettlementImpact>;
  sku: string;
  actorId: string;
}): Record<string, unknown> {
  const { impact, sku, actorId } = params;
  return {
    eventId: `settle-${Date.now()}`,
    sku,
    amount: impact.amount,
    currency: impact.currency,
    recipientId: impact.recipientId,
    actorId,
    timestamp: new Date().toISOString(),
    status: 'pending_settlement',
  };
}

/**
 * Демо-связка: приём файла остатков в shop (observability POST stock-upload).
 */
export function shopStockFileIngestIntegrationPreview(params: {
  acceptedAt: string;
}): Record<string, unknown> {
  return {
    ingestKind: 'retailer_stock_spreadsheet',
    pipelineStage: 'accepted_file',
    nextStage: 'parse_then_prepareExternalStockSync_per_sku',
    acceptedAt: params.acceptedAt,
  };
}
