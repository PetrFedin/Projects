/**
 * Wave 22 #31: зеркало visual references в досье + gates export/handoff.
 */
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import type { Workshop2HandoffReadinessCheck } from '@/lib/production/workshop2-handoff-readiness';
import {
  evaluateWorkshop2VisualReferencesReadiness,
  type Workshop2VisualReferencesReadinessInput,
} from '@/lib/production/workshop2-visual-references-readiness';

export function buildWorkshop2VisualReferencesMirror(
  dossier: Workshop2VisualReferencesReadinessInput
): NonNullable<Workshop2DossierPhase1['visualReferencesMirror']> {
  const readiness = evaluateWorkshop2VisualReferencesReadiness(dossier);

  const blockerExport = !readiness.readyForVisualGate;

  return {
    mirroredAt: new Date().toISOString(),
    refCount: readiness.refCount,
    mediaRefCount: readiness.mediaRefCount,
    openDiscussionCount: readiness.openDiscussionCount,
    readyForVisualGate: readiness.readyForVisualGate,
    blockerExport,
    blockerSampleOrder: blockerExport,
    blockerHandoff: blockerExport,
    hintRu: readiness.blockerRu,
  };
}

export function persistWorkshop2VisualReferencesMirrorToDossier(
  dossier: Workshop2DossierPhase1
): Workshop2DossierPhase1 {
  return {
    ...dossier,
    visualReferencesMirror: buildWorkshop2VisualReferencesMirror(dossier),
  };
}

export function evaluateWorkshop2VisualReferencesExportGate(
  dossier: Workshop2DossierPhase1
): Workshop2HandoffReadinessCheck | null {
  const mirror = dossier.visualReferencesMirror;
  if (!mirror) {
    return {
      id: 'visual.refs.mirror_missing',
      severity: 'blocker',
      messageRu: 'Референсы не зафиксированы в PG — сохраните «Референсы → PG» перед ZIP ТЗ.',
    };
  }
  if (mirror.blockerExport) {
    return {
      id: 'visual.refs.not_ready',
      severity: 'blocker',
      messageRu: mirror.hintRu ?? 'Визуальные референсы не готовы — ZIP ТЗ заблокирован.',
    };
  }
  return null;
}

export function evaluateWorkshop2VisualReferencesSampleGate(
  dossier: Workshop2DossierPhase1
): Workshop2HandoffReadinessCheck | null {
  return evaluateWorkshop2VisualReferencesExportGate(dossier);
}

export function evaluateWorkshop2VisualReferencesHandoffGate(
  dossier: Workshop2DossierPhase1
): Workshop2HandoffReadinessCheck | null {
  const check = evaluateWorkshop2VisualReferencesExportGate(dossier);
  if (!check || check.severity === 'warning') return check;
  return {
    ...check,
    id: 'visual.refs.handoff_blocked',
    messageRu: check.messageRu?.replace('ZIP ТЗ', 'передачу в цех') ?? check.messageRu,
  };
}
