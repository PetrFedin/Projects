/**
 * Wave 23 #17: зеркало server-aligned readiness pulse в досье.
 */
import type { Workshop2ReadinessSnapshot } from '@/lib/production/workshop2-readiness-snapshot';
import { summarizeWorkshop2WorkspaceHeaderPulseStatus } from '@/lib/production/workshop2-workspace-header-pulse-status';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import type { Workshop2HandoffReadinessCheck } from '@/lib/production/workshop2-handoff-readiness';

export function buildWorkshop2ReadinessPulseMirror(
  snapshot: Workshop2ReadinessSnapshot
): NonNullable<Workshop2DossierPhase1['readinessPulseMirror']> {
  const pulse = summarizeWorkshop2WorkspaceHeaderPulseStatus(snapshot);
  const blockerSampleOrder =
    pulse.preflightBlockerCount > 0 || (pulse.scoreGap >= 25 && pulse.state === 'at_risk');

  return {
    mirroredAt: new Date().toISOString(),
    tzOverallPct: pulse.tzOverallPct,
    preflightScore: pulse.preflightScore,
    scoreGap: pulse.scoreGap,
    preflightBlockerCount: pulse.preflightBlockerCount,
    canSendToFactory: pulse.canSendToFactory,
    pulseState: pulse.state,
    blockerSampleOrder,
    hintRu: pulse.hintRu,
  };
}

export function persistWorkshop2ReadinessPulseMirrorToDossier(
  dossier: Workshop2DossierPhase1,
  snapshot: Workshop2ReadinessSnapshot
): Workshop2DossierPhase1 {
  return {
    ...dossier,
    readinessPulseMirror: buildWorkshop2ReadinessPulseMirror(snapshot),
  };
}

export function evaluateWorkshop2ReadinessPulseSampleGate(
  dossier: Workshop2DossierPhase1
): Workshop2HandoffReadinessCheck | null {
  const mirror = dossier.readinessPulseMirror;
  if (!mirror) {
    return {
      id: 'readiness.pulse.mirror_missing',
      severity: 'warning',
      messageRu: 'Пульс готовности не в PG — откройте артикул для синхронизации snapshot.',
    };
  }
  if (mirror.blockerSampleOrder) {
    return {
      id: 'readiness.pulse.misaligned',
      severity: 'blocker',
      messageRu:
        mirror.hintRu ?? 'Разрыв % ТЗ и pre-flight пульса — устраните блокеры перед образцом.',
    };
  }
  if (mirror.pulseState === 'at_risk' && mirror.preflightBlockerCount === 0) {
    return {
      id: 'readiness.pulse.gap',
      severity: 'warning',
      messageRu:
        mirror.hintRu ?? `Разрыв ТЗ ${mirror.tzOverallPct}% vs пульс ${mirror.preflightScore}/100.`,
    };
  }
  return null;
}

/** Wave 25 #17: blocker handoff-commit при misaligned pulse (как sample-order). */
export function evaluateWorkshop2ReadinessPulseHandoffGate(
  dossier: Workshop2DossierPhase1
): Workshop2HandoffReadinessCheck | null {
  const mirror = dossier.readinessPulseMirror;
  if (!mirror) {
    return {
      id: 'readiness.pulse.mirror_missing',
      severity: 'warning',
      messageRu: 'Пульс не в PG — «Пульс → PG» в шапке workspace.',
    };
  }
  if (mirror.blockerSampleOrder) {
    return {
      id: 'readiness.pulse.misaligned',
      severity: 'blocker',
      messageRu:
        mirror.hintRu ?? 'Пульс pre-flight не согласован с ТЗ — handoff commit заблокирован.',
    };
  }
  return null;
}
