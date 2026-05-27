/**
 * Wave 41 #66: ручной erpOrderId в PG (user-entered, не fake sync).
 */
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';

export type Workshop2FactoryErpManualAckMirror = {
  mirroredAt: string;
  lastActor: string;
  manualErpOrderId: string | null;
  source: 'user_manual' | 'po_row';
  poWithErpIdCount: number;
  manualEntryCount: number;
  auditExportReady: boolean;
  hintRu: string;
};

export function summarizeWorkshop2FactoryErpManualAck(dossier: Workshop2DossierPhase1): {
  manualErpOrderId: string | null;
  poWithErpIdCount: number;
  manualEntryCount: number;
  hintRu: string;
} {
  const mirror = dossier.factoryErpManualAckMirror;
  const poWithErpIdCount =
    dossier.factoryErpAuditMirror?.entries.filter((e) => Boolean(e.erpExternalId?.trim())).length ??
    0;
  const manual =
    mirror?.manualErpOrderId?.trim() || dossier.factoryErpSync?.erpOrderId?.trim() || null;
  const manualEntryCount = manual ? 1 : 0;
  return {
    manualErpOrderId: manual,
    poWithErpIdCount,
    manualEntryCount: manualEntryCount + poWithErpIdCount,
    hintRu:
      manual || poWithErpIdCount > 0
        ? `ERP id в PG: ${manual ?? '—'} · PO с erpId: ${poWithErpIdCount} (не auto-sync без ACK).`
        : 'Введите erpOrderId вручную или синхронизируйте PO с live ERP.',
  };
}

export function buildWorkshop2FactoryErpAuditExportRows(dossier: Workshop2DossierPhase1): {
  headers: string[];
  rows: string[][];
} {
  const audit = dossier.factoryErpAuditMirror;
  const headers = ['at', 'poId', 'status', 'erpExternalId', 'displayCode', 'event'];
  const rows =
    audit?.entries.map((e) => [
      e.at,
      e.poId,
      e.status,
      e.erpExternalId ?? '',
      e.displayCode,
      e.event,
    ]) ?? [];
  return { headers, rows };
}

export function buildWorkshop2FactoryErpAuditCsv(dossier: Workshop2DossierPhase1): string {
  const { headers, rows } = buildWorkshop2FactoryErpAuditExportRows(dossier);
  const escape = (s: string) => `"${s.replace(/"/g, '""')}"`;
  return [headers.join(','), ...rows.map((r) => r.map(escape).join(','))].join('\n');
}

export function persistWorkshop2FactoryErpManualAckToDossier(input: {
  dossier: Workshop2DossierPhase1;
  actor: string;
  erpOrderId: string;
}): Workshop2DossierPhase1 {
  const id = input.erpOrderId.trim();
  const summary = summarizeWorkshop2FactoryErpManualAck(input.dossier);
  const mirror: Workshop2FactoryErpManualAckMirror = {
    mirroredAt: new Date().toISOString(),
    lastActor: input.actor,
    manualErpOrderId: id || null,
    source: 'user_manual',
    poWithErpIdCount: summary.poWithErpIdCount,
    manualEntryCount: id ? 1 : 0,
    auditExportReady: Boolean(input.dossier.factoryErpAuditMirror?.entries.length),
    hintRu: id
      ? `Ручной erpOrderId «${id}» в PG — не подменяет live POST ACK.`
      : 'erpOrderId не задан.',
  };
  return {
    ...input.dossier,
    factoryErpManualAckMirror: mirror,
    factoryErpSync: {
      ...input.dossier.factoryErpSync,
      erpOrderId: id || input.dossier.factoryErpSync?.erpOrderId,
      validatedAt: new Date().toISOString(),
      hintRu: mirror.hintRu,
    },
  };
}
