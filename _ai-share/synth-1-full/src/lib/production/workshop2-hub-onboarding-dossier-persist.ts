/**
 * Wave 19 #4 + wave 28 + wave 34 + Block C: онбординг PG-first, LS read-on-miss.
 */
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import { emptyWorkshop2DossierPhase1 } from '@/lib/production/workshop2-phase1-dossier-storage';
import type { Workshop2HandoffReadinessCheck } from '@/lib/production/workshop2-handoff-readiness';
import {
  buildWorkshop2HubOnboardingMirrorPgFirst,
  resolveWorkshop2HubOnboardingStatePgFirst,
  type Workshop2HubPgOnlyBackendStatus,
} from '@/lib/production/workshop2-hub-pg-only-policy';
import type { StoredWorkshop2HubOnboardingRole } from '@/lib/production/workshop2-hub-onboarding-storage';

export function resolveWorkshop2HubOnboardingState(
  dossier: Workshop2DossierPhase1,
  opts?: { backendStatus?: Workshop2HubPgOnlyBackendStatus }
): NonNullable<Workshop2DossierPhase1['hubOnboardingState']> {
  return resolveWorkshop2HubOnboardingStatePgFirst(dossier, opts);
}

export function persistWorkshop2HubOnboardingStateToDossier(
  dossier: Workshop2DossierPhase1,
  input?: {
    done?: boolean;
    workspaceOpened?: boolean;
    role?: StoredWorkshop2HubOnboardingRole;
    markCompleted?: boolean;
  }
): Workshop2DossierPhase1 {
  const prev = resolveWorkshop2HubOnboardingState(dossier);
  const done = input?.markCompleted ? true : (input?.done ?? prev.done);
  const workspaceOpened = input?.workspaceOpened ?? prev.workspaceOpened;
  const role = input?.role ?? prev.role;
  const state: NonNullable<Workshop2DossierPhase1['hubOnboardingState']> = {
    done,
    workspaceOpened,
    role,
    completedAt: done ? new Date().toISOString() : prev.completedAt,
    source: 'dossier',
  };
  const next = { ...dossier, hubOnboardingState: state };
  return {
    ...next,
    hubOnboardingMirror: buildWorkshop2HubOnboardingMirrorFromState(state, next),
  };
}

export function buildWorkshop2HubOnboardingMirrorFromState(
  state: NonNullable<Workshop2DossierPhase1['hubOnboardingState']>,
  dossier?: Workshop2DossierPhase1
): NonNullable<Workshop2DossierPhase1['hubOnboardingMirror']> {
  if (dossier) {
    return buildWorkshop2HubOnboardingMirrorPgFirst({
      ...dossier,
      hubOnboardingState: state,
    });
  }
  const blockerSampleOrder = !state.done;
  return {
    mirroredAt: new Date().toISOString(),
    done: state.done,
    workspaceOpened: state.workspaceOpened,
    role: state.role,
    source: state.source,
    pgPrimary: state.source === 'dossier',
    blockerSampleOrder,
    hintRu: blockerSampleOrder
      ? 'Онбординг хаба не завершён — пройдите чеклист перед заказом образца.'
      : state.source === 'dossier'
        ? 'Онбординг зафиксирован в PG досье.'
        : undefined,
  };
}

/** @deprecated use buildWorkshop2HubOnboardingMirrorFromState */
export function buildWorkshop2HubOnboardingMirrorFromBrowser(): NonNullable<
  Workshop2DossierPhase1['hubOnboardingMirror']
> {
  return buildWorkshop2HubOnboardingMirrorFromState(
    resolveWorkshop2HubOnboardingState(emptyWorkshop2DossierPhase1())
  );
}

export function persistWorkshop2HubOnboardingMirrorToDossier(
  dossier: Workshop2DossierPhase1
): Workshop2DossierPhase1 {
  const state = resolveWorkshop2HubOnboardingState(dossier);
  return {
    ...dossier,
    hubOnboardingState: state.source === 'dossier' ? state : dossier.hubOnboardingState,
    hubOnboardingMirror: buildWorkshop2HubOnboardingMirrorFromState(state, {
      ...dossier,
      hubOnboardingState: state.source === 'dossier' ? state : dossier.hubOnboardingState,
    }),
  };
}

export function evaluateWorkshop2HubOnboardingSampleGate(
  dossier: Workshop2DossierPhase1
): Workshop2HandoffReadinessCheck | null {
  const mirror = dossier.hubOnboardingMirror;
  if (!mirror) {
    return {
      id: 'hub.onboarding.mirror_missing',
      severity: 'warning',
      messageRu: 'Онбординг не в PG — откройте артикул после завершения онбординга хаба.',
    };
  }
  if (mirror.driftDetected) {
    return {
      id: 'hub.onboarding.drift',
      severity: 'warning',
      messageRu: mirror.hintRu ?? 'Drift онбординга local↔PG — синхронизируйте через workspace.',
    };
  }
  if (mirror.blockerSampleOrder) {
    return {
      id: 'hub.onboarding.incomplete',
      severity: 'warning',
      messageRu: mirror.hintRu ?? 'Онбординг хаба не завершён — закройте диалог «Первый вход».',
    };
  }
  return null;
}
