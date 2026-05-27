/**
 * Gate состава: mat + BOM + сумма волокон 100% перед образцом.
 */
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import type { Workshop2HandoffReadinessCheck } from '@/lib/production/workshop2-handoff-readiness';
import { summarizeWorkshop2MaterialCompositionStatus } from '@/lib/production/workshop2-material-composition-status';

export function evaluateWorkshop2MaterialCompositionGate(
  dossier: Workshop2DossierPhase1
): Workshop2HandoffReadinessCheck | null {
  const status = summarizeWorkshop2MaterialCompositionStatus(dossier);
  if (status.state === 'ready') return null;
  if (status.matAssignmentCount === 0 && status.bomMaterialLineCount === 0) {
    return null;
  }

  return {
    id: 'material.composition.incomplete',
    severity: 'blocker',
    messageRu:
      status.hintRu ??
      'Материалы и состав не готовы — заполните mat, composition и BOM materialLines.',
  };
}
