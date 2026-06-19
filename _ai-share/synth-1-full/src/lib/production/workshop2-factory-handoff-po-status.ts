/** Клиентские подписи статусов PO из очереди handoff (согласованы с server PO_STATUS_LABEL_RU). */

export type FactoryHandoffPoStatus = 'draft' | 'pending_erp' | 'synced' | 'error';

export const FACTORY_HANDOFF_PO_STATUS_LABEL_RU: Record<FactoryHandoffPoStatus, string> = {
  draft: 'Черновик PO',
  pending_erp: 'В очереди цеха',
  synced: 'Принято цехом',
  error: 'Ошибка ERP',
};

export function factoryHandoffPoStatusLabelRu(status: string): string {
  const key = status as FactoryHandoffPoStatus;
  return FACTORY_HANDOFF_PO_STATUS_LABEL_RU[key] ?? status;
}

export function canAcknowledgeFactoryHandoffPo(status: string): boolean {
  return status === 'pending_erp';
}

export function canRetryFactoryHandoffErp(status: string, erpExternalId?: string | null): boolean {
  if (status === 'error' || status === 'pending_erp') return true;
  const ext = erpExternalId?.trim() ?? '';
  return status === 'synced' && ext.startsWith('FACTORY-ACK-');
}

/** Серия требует внимания ERP (error или journal-only FACTORY-ACK после live_failed). */
export function factoryHandoffNeedsErpAttention(
  status: string,
  erpExternalId?: string | null
): boolean {
  return canRetryFactoryHandoffErp(status, erpExternalId);
}

export function factoryHandoffErpBadgeLabel(
  status: string,
  erpExternalId?: string | null
): string | null {
  if (status !== 'synced') return null;
  const ext = erpExternalId?.trim() ?? '';
  if (!ext) return null;
  if (ext.startsWith('FACTORY-ACK-')) return 'Журнал · ERP не настроен';
  return `ERP · ${ext}`;
}
