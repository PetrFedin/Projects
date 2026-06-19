/**
 * Wave 5 P1 #67: MES QC defect ingest → dossier QC mirror.
 */
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import {
  workshop2PgMirrorNum,
  workshop2PgMirrorStr,
} from '@/lib/production/workshop2-dossier-pg-mirror-utils';
import {
  appendWorkshop2QcAutoChangeRequest,
  shouldAutoDraftWorkshop2QcChangeRequest,
} from '@/lib/production/workshop2-qc-defect-change-request';
import { persistWorkshop2QcPanelMirrorToDossier } from '@/lib/production/workshop2-qc-panel-dossier-persist';

export type Workshop2MesQcDefectPayload = {
  defectCode: string;
  defectLabel?: string;
  severity?: 'minor' | 'major' | 'critical';
  qtyAffected?: number;
  batchId?: string;
  stationId?: string;
  mesEventId?: string;
  detectedAt?: string;
};

function workshop2QcPanelSupplierSource(
  mirror: Workshop2DossierPhase1['qcPanelMirror']
): 'purchase_order' | 'seed_default' | 'none' {
  const raw = workshop2PgMirrorStr(mirror, 'supplierSource');
  return raw === 'purchase_order' || raw === 'seed_default' || raw === 'none' ? raw : 'none';
}

export function parseWorkshop2MesQcIngestBody(body: unknown): Workshop2MesQcDefectPayload | null {
  if (!body || typeof body !== 'object') return null;
  const b = body as Record<string, unknown>;
  const defectCode = String(b.defectCode ?? b.code ?? '').trim();
  if (!defectCode) return null;
  const severityRaw = String(b.severity ?? 'minor')
    .trim()
    .toLowerCase();
  const severity =
    severityRaw === 'major' || severityRaw === 'critical' ? severityRaw : ('minor' as const);
  return {
    defectCode,
    defectLabel:
      b.defectLabel != null ? String(b.defectLabel) : b.label != null ? String(b.label) : undefined,
    severity,
    qtyAffected:
      b.qtyAffected != null ? Number(b.qtyAffected) : b.qty != null ? Number(b.qty) : undefined,
    batchId: b.batchId != null ? String(b.batchId) : undefined,
    stationId: b.stationId != null ? String(b.stationId) : undefined,
    mesEventId:
      b.mesEventId != null
        ? String(b.mesEventId)
        : b.eventId != null
          ? String(b.eventId)
          : undefined,
    detectedAt: b.detectedAt != null ? String(b.detectedAt) : undefined,
  };
}

export function verifyWorkshop2MesQcWebhookSecret(input: {
  authorizationHeader?: string | null;
  secretHeader?: string | null;
  env?: Record<string, string | undefined>;
}): { ok: boolean; status?: 401; messageRu?: string } {
  const expected = String(
    input.env?.WORKSHOP2_MES_QC_WEBHOOK_SECRET ?? process.env.WORKSHOP2_MES_QC_WEBHOOK_SECRET ?? ''
  ).trim();
  if (!expected) {
    return { ok: true };
  }
  const bearer = input.authorizationHeader?.replace(/^Bearer\s+/i, '').trim();
  const header = input.secretHeader?.trim();
  if (bearer === expected || header === expected) {
    return { ok: true };
  }
  return { ok: false, status: 401, messageRu: 'MES QC ingest: неверный webhook secret.' };
}

export function applyWorkshop2MesQcDefectToDossier(input: {
  dossier: Workshop2DossierPhase1;
  defect: Workshop2MesQcDefectPayload;
}): Workshop2DossierPhase1 {
  const detectedAt = input.defect.detectedAt ?? new Date().toISOString();
  const failedIncrement = input.defect.severity === 'minor' ? 0 : 1;
  const existingLog = input.dossier.qcAqlInspectionLog ?? [];
  const isMajor = input.defect.severity === 'major' || input.defect.severity === 'critical';
  const nextLog = [
    ...existingLog,
    {
      id: `mes-${Date.now()}`,
      recordedAt: detectedAt,
      recordedBy: input.defect.stationId ? `MES ${input.defect.stationId}` : 'MES',
      orderQty: input.defect.qtyAffected ?? 1,
      qtySource: 'batch' as const,
      aqlLevel: 'MES',
      sampleSize: input.defect.qtyAffected ?? 1,
      criticalFound: input.defect.severity === 'critical' ? 1 : 0,
      majorFound: input.defect.severity === 'major' ? 1 : 0,
      minorFound: input.defect.severity === 'minor' ? 1 : 0,
      majorRejectLimit: 0,
      minorRejectLimit: 1,
      isFail: isMajor,
      batchId: input.defect.batchId,
    },
  ];

  const panel = input.dossier.qcPanelMirror;
  const batchCount = workshop2PgMirrorNum(panel, 'batchCount') + 1;
  const failedBatchCount = workshop2PgMirrorNum(panel, 'failedBatchCount') + failedIncrement;
  const pendingBatchCount = workshop2PgMirrorNum(panel, 'pendingBatchCount');

  const withMirror = persistWorkshop2QcPanelMirrorToDossier(input.dossier, {
    batchCount,
    pendingBatchCount,
    failedBatchCount,
    hasSampleOrder: panel?.hasSampleOrder === true,
    hasInspectorLink: true,
    supplierId: workshop2PgMirrorStr(panel, 'supplierId'),
    supplierSource: workshop2QcPanelSupplierSource(panel),
    purchaseOrderCount: workshop2PgMirrorNum(panel, 'purchaseOrderCount'),
    poConfirmedCount: workshop2PgMirrorNum(panel, 'poConfirmedCount'),
    activeSampleOrderId: workshop2PgMirrorStr(panel, 'activeSampleOrderId') || undefined,
  });

  let dossier: Workshop2DossierPhase1 = {
    ...withMirror,
    qcAqlInspectionLog: nextLog,
    updatedAt: detectedAt,
  };

  if (input.defect.severity && shouldAutoDraftWorkshop2QcChangeRequest(input.defect.severity)) {
    dossier = appendWorkshop2QcAutoChangeRequest(dossier, {
      defectCode: input.defect.defectCode,
      defectLabel: input.defect.defectLabel,
      severity: input.defect.severity as 'major' | 'critical',
      source: 'mes',
    });
  }

  return dossier;
}

export function formatWorkshop2MesQcChatMessageRu(defect: Workshop2MesQcDefectPayload): string {
  const label = defect.defectLabel ?? defect.defectCode;
  return `[Система] MES QC: ${label} (${defect.severity ?? 'minor'})${defect.batchId ? ` · партия ${defect.batchId}` : ''}`;
}
