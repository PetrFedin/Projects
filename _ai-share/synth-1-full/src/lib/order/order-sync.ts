/**
 * [Phase 2 — Order architecture]
 * Канон: docs/domain-model/order.md.
 * Модель состояния экспорта и синхронизации заказа (Export / Sync State).
 * Отделена от коммерческого статуса заказа.
 */

export type SyncProvider = 'joor' | 'nuorder' | 'shopify' | 'erp_1c';
export type SyncStatus = 'pending' | 'syncing' | 'synced' | 'failed' | 'manual_override';

export interface OrderSyncState {
  orderId: string;
  provider: SyncProvider;
  status: SyncStatus;
  
  /** Внешний идентификатор в системе провайдера */
  externalId?: string;

  /** Метаданные последней попытки */
  lastAttemptAt?: string;
  lastSuccessAt?: string;
  error?: {
    code: string;
    message: string;
    details?: any;
  };

  /** Хэш данных на момент последней успешной синхронизации */
  versionHash?: string;

  metadata: {
    createdAt: string;
    updatedAt: string;
    version: number;
  };
}

/**
 * Проверяет, требуется ли повторная синхронизация.
 */
export function needsResync(syncState: OrderSyncState, currentDataHash: string): boolean {
  if (syncState.status === 'failed') return true;
  if (syncState.status === 'pending') return true;
  return syncState.versionHash !== currentDataHash;
}

/**
 * Формирует лог синхронизации для observability.
 */
export function createSyncLog(syncState: OrderSyncState): Record<string, any> {
  return {
    orderId: syncState.orderId,
    provider: syncState.provider,
    status: syncState.status,
    externalId: syncState.externalId,
    hasError: !!syncState.error,
    timestamp: new Date().toISOString()
  };
}
