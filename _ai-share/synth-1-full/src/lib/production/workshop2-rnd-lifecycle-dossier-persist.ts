/**
 * Wave 30 #19: зеркало R&D lifecycle в PG + gates.
 */
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import type { Workshop2HandoffReadinessCheck } from '@/lib/production/workshop2-handoff-readiness';
import { normalizeWorkshop2LifecycleState } from '@/lib/production/workshop2-lifecycle-transition';

export function buildWorkshop2RndLifecycleMirror(
  dossier: Workshop2DossierPhase1
): NonNullable<Workshop2DossierPhase1['rndLifecycleMirror']> {
  const lifecycleState = normalizeWorkshop2LifecycleState(dossier.lifecycleState);
  const revisionCount = dossier.revisions?.length ?? 0;
  const handoffReady =
    lifecycleState === 'handoff_ready' || lifecycleState === 'sent_to_production';
  const blockerHandoff = lifecycleState === 'draft' || lifecycleState === 'rework_requested';
  const blockerSampleOrder = lifecycleState === 'rework_requested';

  let hintRu: string | undefined;
  if (lifecycleState === 'rework_requested') {
    hintRu =
      'R&D: rework_requested — заказ образца и handoff заблокированы до возврата в draft/handoff_ready.';
  } else if (lifecycleState === 'draft') {
    hintRu = 'Lifecycle draft — handoff commit недоступен до handoff_ready.';
  }

  return {
    mirroredAt: new Date().toISOString(),
    lifecycleState,
    revisionCount,
    handoffReady,
    blockerSampleOrder,
    blockerHandoff,
    hintRu,
  };
}

export function persistWorkshop2RndLifecycleMirrorToDossier(
  dossier: Workshop2DossierPhase1
): Workshop2DossierPhase1 {
  return {
    ...dossier,
    rndLifecycleMirror: buildWorkshop2RndLifecycleMirror(dossier),
  };
}

export function evaluateWorkshop2RndLifecycleSampleGate(
  dossier: Workshop2DossierPhase1
): Workshop2HandoffReadinessCheck | null {
  const mirror = dossier.rndLifecycleMirror;
  if (!mirror) {
    return {
      id: 'rnd.lifecycle.mirror_missing',
      severity: 'warning',
      messageRu:
        'R&D lifecycle не в досье — смените статус или откройте артикул для синхронизации.',
    };
  }
  if (mirror.blockerSampleOrder) {
    return {
      id: 'rnd.lifecycle.rework',
      severity: 'blocker',
      messageRu: mirror.hintRu ?? 'Статус rework_requested — заказ образца заблокирован.',
    };
  }
  return null;
}

export function evaluateWorkshop2RndLifecycleHandoffGate(
  dossier: Workshop2DossierPhase1
): Workshop2HandoffReadinessCheck | null {
  const mirror = dossier.rndLifecycleMirror;
  if (!mirror) {
    return {
      id: 'rnd.lifecycle.mirror_missing_handoff',
      severity: 'warning',
      messageRu: 'R&D lifecycle не в досье — обновите перед handoff.',
    };
  }
  if (mirror.blockerHandoff) {
    return {
      id: 'rnd.lifecycle.not_ready',
      severity: 'blocker',
      messageRu:
        mirror.hintRu ?? `Lifecycle «${mirror.lifecycleState}» — handoff commit заблокирован.`,
    };
  }
  return null;
}
