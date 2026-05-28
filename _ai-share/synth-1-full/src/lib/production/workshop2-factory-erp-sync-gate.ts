/**
 * ERP фабрики: fail-closed — «синхронизирован» только при erpOrderId (wave 18 #66).
 */
import type { Workshop2HandoffReadinessCheck } from '@/lib/production/workshop2-handoff-readiness';

export type Workshop2FactoryErpSyncStatus = 'not_configured' | 'configured' | 'synced' | 'error';

export type Workshop2FactoryErpSyncClaimInput = {
  syncStatus: Workshop2FactoryErpSyncStatus | string;
  erpOrderId?: string | null;
  baseUrlConfigured?: boolean;
  lastError?: string | null;
};

/** Нормализация статуса synced без order id → configured / not_configured. */
export function sanitizeWorkshop2FactoryErpSyncClaim(
  input: Workshop2FactoryErpSyncClaimInput
): Workshop2FactoryErpSyncClaimInput & { syncStatus: Workshop2FactoryErpSyncStatus } {
  const st = input.syncStatus as Workshop2FactoryErpSyncStatus;
  if (st !== 'synced') {
    return { ...input, syncStatus: st };
  }
  const id = String(input.erpOrderId ?? '').trim();
  if (id) {
    return { ...input, syncStatus: 'synced', erpOrderId: id };
  }
  return {
    ...input,
    syncStatus: input.baseUrlConfigured ? 'configured' : 'not_configured',
    erpOrderId: undefined,
    lastError: input.lastError ?? 'erp_missing_order_id',
  };
}

export function evaluateWorkshop2FactoryErpSyncClaimGate(
  input: Workshop2FactoryErpSyncClaimInput
): Workshop2HandoffReadinessCheck | null {
  const sanitized = sanitizeWorkshop2FactoryErpSyncClaim(input);
  if (sanitized.syncStatus === 'not_configured') {
    return {
      id: 'factory.erp.not_configured',
      severity: 'warning',
      messageRu:
        'WORKSHOP2_FACTORY_ERP_BASE_URL не задан — синхронизация PO в ERP недоступна (не mock-success).',
    };
  }
  if (sanitized.syncStatus === 'error') {
    return {
      id: 'factory.erp.sync_error',
      severity: 'warning',
      messageRu: sanitized.lastError ?? 'Ошибка POST /purchase-orders — erpOrderId не получен.',
    };
  }
  return null;
}

export function buildWorkshop2FactoryErpSyncValidationRecord(
  input: Workshop2FactoryErpSyncClaimInput
): {
  validatedAt: string;
  syncStatus: Workshop2FactoryErpSyncStatus;
  erpOrderId?: string;
  lastError?: string;
  hintRu?: string;
} {
  const sanitized = sanitizeWorkshop2FactoryErpSyncClaim(input);
  const gate = evaluateWorkshop2FactoryErpSyncClaimGate(sanitized);
  return {
    validatedAt: new Date().toISOString(),
    syncStatus: sanitized.syncStatus,
    erpOrderId: sanitized.erpOrderId ?? undefined,
    lastError: sanitized.lastError ?? undefined,
    hintRu: gate?.messageRu,
  };
}
