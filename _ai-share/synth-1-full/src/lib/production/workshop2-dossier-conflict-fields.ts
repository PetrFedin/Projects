/**
 * Wave 29: RU-поля конфликта при 409 merge досье.
 */
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';

const FIELD_LABELS_RU: Record<string, string> = {
  updatedAt: 'Дата обновления',
  updatedBy: 'Автор изменения',
  lifecycleState: 'Статус жизненного цикла',
  vaultSnapshotVersion: 'Версия vault',
  taMilestones: 'Вехи T&A',
  assignments: 'Назначения',
  bomCostingSnapshot: 'Себестоимость BOM',
  purchaseOrderErpMirror: 'Зеркало ERP (PO)',
  b2bIntegrationDraft: 'B2B интеграция',
};

export function summarizeWorkshop2DossierConflictFieldsRu(input: {
  clientDossier: Workshop2DossierPhase1;
  serverDossier: Workshop2DossierPhase1;
}): string[] {
  const out: string[] = [];
  const push = (key: string, clientVal: unknown, serverVal: unknown) => {
    if (JSON.stringify(clientVal) === JSON.stringify(serverVal)) return;
    const label = FIELD_LABELS_RU[key] ?? key;
    out.push(`${label}: сервер новее (${String(serverVal ?? '—').slice(0, 80)})`);
  };
  push('updatedAt', input.clientDossier.updatedAt, input.serverDossier.updatedAt);
  push('updatedBy', input.clientDossier.updatedBy, input.serverDossier.updatedBy);
  push('lifecycleState', input.clientDossier.lifecycleState, input.serverDossier.lifecycleState);
  push(
    'vaultSnapshotVersion',
    input.clientDossier.vaultSnapshotVersion,
    input.serverDossier.vaultSnapshotVersion
  );
  if (
    (input.clientDossier.assignments?.length ?? 0) !==
    (input.serverDossier.assignments?.length ?? 0)
  ) {
    out.push(
      `Назначения: на сервере ${input.serverDossier.assignments?.length ?? 0}, у вас ${input.clientDossier.assignments?.length ?? 0}`
    );
  }
  return out.length ? out : ['Досье на сервере обновлено другим пользователем'];
}
