/**
 * Wave 7 #18: зеркало multi-level signoff в dossier для sync gates.
 */
import {
  summarizeWorkshop2SignoffStagesProgress,
  type Workshop2SignoffStageDef,
} from '@/lib/production/workshop2-signoff-stages-config';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import type { Workshop2HandoffReadinessCheck } from '@/lib/production/workshop2-handoff-readiness';
import {
  workshop2PgMirrorNum,
  workshop2PgMirrorStr,
} from '@/lib/production/workshop2-dossier-pg-mirror-utils';

export function buildWorkshop2SignoffStagesProgressMirror(input: {
  dossier: Workshop2DossierPhase1;
  stages: Workshop2SignoffStageDef[];
}): NonNullable<Workshop2DossierPhase1['signoffStagesProgressMirror']> {
  const progress = summarizeWorkshop2SignoffStagesProgress({
    dossier: input.dossier,
    stages: input.stages,
  });
  return {
    mirroredAt: new Date().toISOString(),
    stagesTotal: progress.stagesTotal,
    stagesComplete: progress.stagesComplete,
    blockerHandoff: progress.stagesComplete < progress.stagesTotal,
    hintRu: progress.hintRu,
  };
}

export function persistWorkshop2SignoffStagesProgressMirror(input: {
  dossier: Workshop2DossierPhase1;
  stages: Workshop2SignoffStageDef[];
}): Workshop2DossierPhase1 {
  return {
    ...input.dossier,
    signoffStagesProgressMirror: buildWorkshop2SignoffStagesProgressMirror(input),
  };
}

export function evaluateWorkshop2SignoffStagesProgressMirrorGate(
  dossier: Workshop2DossierPhase1
): Workshop2HandoffReadinessCheck | null {
  const mirror = dossier.signoffStagesProgressMirror;
  if (!mirror?.blockerHandoff) return null;
  return {
    id: 'signoff.stages.mirror_blocked',
    severity: 'blocker',
    messageRu:
      workshop2PgMirrorStr(mirror, 'hintRu') ||
      `Signoff этапы: ${workshop2PgMirrorNum(mirror, 'stagesComplete', typeof mirror.stagesComplete === 'number' ? mirror.stagesComplete : 0)}/${workshop2PgMirrorNum(mirror, 'stagesTotal', typeof mirror.stagesTotal === 'number' ? mirror.stagesTotal : 0)} — синхронизируйте setup.`,
  };
}
