/**
 * Отображаемый статус ERP sync для PO (реальный connector / outbox / ошибка).
 */
export type Workshop2PurchaseOrderErpDisplayStatus = {
  code: 'not_configured' | 'pending_erp' | 'synced' | 'error' | 'draft' | 'skipped';
  labelRu: string;
  erpExternalId?: string;
};

export function resolveWorkshop2PurchaseOrderErpDisplayStatus(input: {
  status: string;
  erpExternalId?: string | null;
  lastError?: string | null;
  erpConfigured: boolean;
}): Workshop2PurchaseOrderErpDisplayStatus {
  if (!input.erpConfigured && (input.status === 'synced' || input.status === 'pending_erp')) {
    return {
      code: 'pending_erp',
      labelRu:
        input.status === 'synced'
          ? 'Журнал ERP · запись без live ACK'
          : 'Журнал ERP · ожидает live URL (не отправлено)',
      erpExternalId: input.erpExternalId ?? undefined,
    };
  }
  if (input.status === 'synced' && !input.erpExternalId?.trim()) {
    return {
      code: 'pending_erp',
      labelRu: 'Статус synced без erpOrderId — ожидает повторной выгрузки',
    };
  }
  if (input.status === 'synced' && input.erpExternalId) {
    return {
      code: 'synced',
      labelRu: `Синхронизировано · ${input.erpExternalId}`,
      erpExternalId: input.erpExternalId,
    };
  }
  if (input.status === 'error') {
    return {
      code: 'error',
      labelRu: input.lastError ? `Ошибка ERP: ${input.lastError}` : 'Ошибка синхронизации ERP',
    };
  }
  if (input.status === 'pending_erp') {
    return {
      code: 'pending_erp',
      labelRu: input.erpConfigured
        ? 'Ожидает подтверждения ERP'
        : 'Журнал ERP · ожидает live URL (не отправлено)',
    };
  }
  if (!input.erpConfigured && input.status === 'draft') {
    return { code: 'not_configured', labelRu: 'ERP не настроен · черновик' };
  }
  if (input.status === 'draft') {
    return { code: 'draft', labelRu: 'Черновик · не отправлено в ERP' };
  }
  return { code: 'skipped', labelRu: `Статус: ${input.status}` };
}
