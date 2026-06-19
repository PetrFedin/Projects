/**
 * Wave 27 #79: зеркало handoff PDF readiness + gates sample-order / export path.
 */
import type { HandbookCategoryLeaf } from '@/lib/production/category-handbook-leaves';
import { evaluateWorkshop2HandoffPdfExportReadiness } from '@/lib/production/workshop2-handoff-pdf-export-readiness';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import type { Workshop2HandoffReadinessCheck } from '@/lib/production/workshop2-handoff-readiness';
import { workshop2PgMirrorStr } from '@/lib/production/workshop2-dossier-pg-mirror-utils';

export function buildWorkshop2HandoffPdfMirror(input: {
  dossier: Workshop2DossierPhase1;
  categoryLeaf?: HandbookCategoryLeaf | null;
  vaultFileCount?: number;
}): NonNullable<Workshop2DossierPhase1['handoffPdfMirror']> {
  const readiness = evaluateWorkshop2HandoffPdfExportReadiness(input);
  const blockerSampleOrder = readiness.state === 'blocked';
  const blockerExport = readiness.state === 'blocked';

  return {
    mirroredAt: new Date().toISOString(),
    state: readiness.state,
    hasSketchImage: readiness.hasSketchImage,
    openVisualGateCount: readiness.openVisualGateCount,
    handoffReady: readiness.handoffReady,
    blockerCount: readiness.blockerCount,
    blockerSampleOrder,
    blockerExport,
    hintRu: readiness.hintRu,
  };
}

export function persistWorkshop2HandoffPdfMirrorToDossier(
  dossier: Workshop2DossierPhase1,
  input: {
    categoryLeaf?: HandbookCategoryLeaf | null;
    vaultFileCount?: number;
  }
): Workshop2DossierPhase1 {
  return {
    ...dossier,
    handoffPdfMirror: buildWorkshop2HandoffPdfMirror({ dossier, ...input }),
  };
}

export function evaluateWorkshop2HandoffPdfSampleGate(
  dossier: Workshop2DossierPhase1
): Workshop2HandoffReadinessCheck | null {
  const mirror = dossier.handoffPdfMirror;
  if (!mirror) {
    return {
      id: 'handoff_pdf.mirror_missing',
      severity: 'warning',
      messageRu: 'PDF handoff не в PG — «PDF → PG» перед экспортом или образцом.',
    };
  }
  if (mirror.blockerSampleOrder === true) {
    return {
      id: 'handoff_pdf.blocked',
      severity: 'warning',
      messageRu:
        workshop2PgMirrorStr(mirror, 'hintRu') ||
        'PDF handoff заблокирован — нет скетча или handoff не готов.',
    };
  }
  if (mirror.state === 'warn') {
    return {
      id: 'handoff_pdf.warn',
      severity: 'warning',
      messageRu:
        workshop2PgMirrorStr(mirror, 'hintRu') ||
        'PDF handoff с предупреждениями — пакет может быть неполным для цеха.',
    };
  }
  return null;
}

export function evaluateWorkshop2HandoffPdfMirrorExportGate(
  dossier: Workshop2DossierPhase1
): Workshop2HandoffReadinessCheck | null {
  const mirror = dossier.handoffPdfMirror;
  if (!mirror) return null;
  if (mirror.blockerExport === true) {
    return {
      id: 'handoff_pdf.export_blocked',
      severity: 'blocker',
      messageRu:
        workshop2PgMirrorStr(mirror, 'hintRu') ||
        'PDF handoff заблокирован в PG — исправьте скетч и visual gate.',
    };
  }
  return null;
}
