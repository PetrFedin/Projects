/**
 * Wave 24 #64: зеркало release routing + gate export-tz.
 */
import { summarizeWorkshop2ReleaseRoutingStatus } from '@/lib/production/workshop2-release-routing-status';
import type { ReleaseSnapshot } from '@/lib/production/article-workspace/types';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import type { Workshop2HandoffReadinessCheck } from '@/lib/production/workshop2-handoff-readiness';
import { workshop2PgMirrorStr } from '@/lib/production/workshop2-dossier-pg-mirror-utils';

export function buildWorkshop2ReleaseRoutingMirror(input: {
  dossier: Workshop2DossierPhase1;
  release?: ReleaseSnapshot | null;
}): NonNullable<Workshop2DossierPhase1['releaseRoutingMirror']> {
  const status = summarizeWorkshop2ReleaseRoutingStatus(input);
  const persistedAt = input.dossier.routingStepsPersistedAt;
  const blockerExport = status.routingStepCount === 0;

  return {
    mirroredAt: new Date().toISOString(),
    routingStepCount: status.routingStepCount,
    routingSource: status.routingSource,
    releaseOperationCount: status.releaseOperationCount,
    routingStepsPersistedAt: persistedAt,
    state: status.state,
    blockerExport,
    hintRu: status.hintRu,
  };
}

export function persistWorkshop2ReleaseRoutingMirrorToDossier(
  dossier: Workshop2DossierPhase1,
  release?: ReleaseSnapshot | null
): Workshop2DossierPhase1 {
  return {
    ...dossier,
    releaseRoutingMirror: buildWorkshop2ReleaseRoutingMirror({ dossier, release }),
  };
}

export function evaluateWorkshop2ReleaseRoutingExportGate(
  dossier: Workshop2DossierPhase1
): Workshop2HandoffReadinessCheck | null {
  const mirror = dossier.releaseRoutingMirror;
  if (!mirror) {
    const live = summarizeWorkshop2ReleaseRoutingStatus({ dossier });
    if (live.routingStepCount === 0) {
      return {
        id: 'release.routing.empty',
        severity: 'warning',
        messageRu: live.hintRu ?? 'routing-steps.json будет пуст — сохраните маршрут на выпуске.',
      };
    }
    return {
      id: 'release.routing.mirror_missing',
      severity: 'warning',
      messageRu: 'Release routing snapshot не в PG — «Routing → PG» на выпуске.',
    };
  }
  if (mirror.blockerExport) {
    return {
      id: 'release.routing.empty',
      severity: 'warning',
      messageRu:
        workshop2PgMirrorStr(mirror, 'hintRu') ||
        'Нет шагов техпроцесса в PG — ZIP может не содержать routing-steps.json.',
    };
  }
  if (mirror.routingSource === 'derived') {
    return {
      id: 'release.routing.derived_only',
      severity: 'warning',
      messageRu:
        workshop2PgMirrorStr(mirror, 'hintRu') ??
        'routingSteps не persist в PG — только derived из досье.',
    };
  }
  return null;
}

/** Wave 26 #64: blocker handoff-commit при пустом routing (2-й слой). */
export function evaluateWorkshop2ReleaseRoutingHandoffGate(
  dossier: Workshop2DossierPhase1
): Workshop2HandoffReadinessCheck | null {
  const exportCheck = evaluateWorkshop2ReleaseRoutingExportGate(dossier);
  if (!exportCheck) return null;
  if (exportCheck.id === 'release.routing.mirror_missing') {
    return {
      ...exportCheck,
      messageRu: 'Release routing не в PG — «Routing → PG» перед handoff.',
    };
  }
  if (exportCheck.id === 'release.routing.empty') {
    return {
      id: 'release.routing.empty',
      severity: 'blocker',
      messageRu:
        exportCheck.messageRu ?? 'Нет шагов техпроцесса в PG — handoff commit заблокирован.',
    };
  }
  if (exportCheck.id === 'release.routing.derived_only') {
    return {
      id: 'release.routing.derived_only',
      severity: 'warning',
      messageRu: exportCheck.messageRu,
    };
  }
  return exportCheck;
}
