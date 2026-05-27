/**
 * Wave 36: второй слой fail-closed для journal-only ceilings (#63 nesting, #66 ERP).
 * Не поднимает strict выше 8.8–8.9 без live E2E.
 */
import type { Workshop2HandoffReadinessCheck } from '@/lib/production/workshop2-handoff-readiness';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import {
  isWorkshop2LiveErpConfigured,
  isWorkshop2LiveNestingConfigured,
  type Workshop2ProcessEnvLike,
} from '@/lib/production/workshop2-live-integration-probes-env';

export function evaluateWorkshop2NestingJournalSecondLayerHandoff(
  dossier: Workshop2DossierPhase1,
  env: Workshop2ProcessEnvLike = process.env
): Workshop2HandoffReadinessCheck | null {
  if (isWorkshop2LiveNestingConfigured(env)) return null;
  const snap = dossier.nestingRequestSnapshot;
  if (!snap?.fabricWidthCm) return null;
  return {
    id: 'ceiling.nesting.journal_second_layer_handoff',
    severity: 'warning',
    messageRu:
      '#63 handoff: раскладка heuristic_stub (journal-only) — live NESTING_API_URL не настроен.',
  };
}

export function evaluateWorkshop2NestingJournalSecondLayerExport(
  dossier: Workshop2DossierPhase1,
  env: Workshop2ProcessEnvLike = process.env
): Workshop2HandoffReadinessCheck | null {
  if (isWorkshop2LiveNestingConfigured(env)) return null;
  if (!dossier.nestingRequestSnapshot?.fabricWidthCm) return null;
  return {
    id: 'ceiling.nesting.journal_second_layer_export',
    severity: 'warning',
    messageRu:
      '#63 export-tz: nesting journal-only (heuristic_stub) — не подменяет live CAD engine.',
  };
}

export function evaluateWorkshop2ErpJournalSecondLayerHandoff(
  dossier: Workshop2DossierPhase1,
  env: Workshop2ProcessEnvLike = process.env
): Workshop2HandoffReadinessCheck | null {
  if (isWorkshop2LiveErpConfigured(env)) return null;
  const mirror = dossier.purchaseOrderErpMirror;
  if (!mirror || mirror.erpSyncMode !== 'journal_only') return null;
  return {
    id: 'ceiling.erp.journal_second_layer_handoff',
    severity: 'warning',
    messageRu:
      '#66 handoff: ERP journal-only — FACTORY_ERP_BASE_URL не настроен, без live erpOrderId ACK.',
  };
}

export function evaluateWorkshop2ErpJournalSecondLayerExport(
  dossier: Workshop2DossierPhase1,
  env: Workshop2ProcessEnvLike = process.env
): Workshop2HandoffReadinessCheck | null {
  if (isWorkshop2LiveErpConfigured(env)) return null;
  const mirror = dossier.purchaseOrderErpMirror;
  if (!mirror || mirror.erpSyncMode !== 'journal_only') return null;
  return {
    id: 'ceiling.erp.journal_second_layer_export',
    severity: 'warning',
    messageRu: '#66 export-tz: PO ERP journal-only — live factory ERP не подключён.',
  };
}
