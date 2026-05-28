/**
 * Wave R — единый UI-снимок critical path из articleDevelopmentStateMirror.
 * Hub cards и workspace header читают одну функцию — без drift между PG/file mirror.
 */
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import type { Workshop2UxChipTone } from '@/lib/production/workshop2-ux-phase1-helpers';
import {
  buildWorkshop2ArticleDevelopmentState,
  type Workshop2ArticleDevelopmentStateMirror,
} from '@/lib/production/workshop2-article-development-state';

/** Полный critical path: sample → WMS → movement → gold → intake → handoff. */
export const WORKSHOP2_ARTICLE_DEVELOPMENT_PATH_STEP_TOTAL = 6 as const;

export type Workshop2ArticleDevelopmentStateDisplay = {
  labelRu: string;
  hintRu: string;
  tone: Workshop2UxChipTone;
  criticalPathReady: boolean;
  stepsDone: number;
  stepsTotal: number;
  mirroredAt?: string;
  /** true — снимок из dossier mirror (PG или file-store persist). */
  fromMirror: boolean;
};

function toneFromSnapshot(snap: Workshop2ArticleDevelopmentStateMirror): Workshop2UxChipTone {
  if (snap.criticalPathReady) return 'emerald';
  if (!snap.sample.hasOrder) return 'amber';
  if (snap.sample.movementStatus === 'received' && !snap.gold.approved) return 'amber';
  return 'amber';
}

function labelFromSnapshot(snap: Workshop2ArticleDevelopmentStateMirror): string {
  if (snap.criticalPathReady) return 'Critical path ✓';
  const done = snap.steps.length;
  return `Critical path ${done}/${WORKSHOP2_ARTICLE_DEVELOPMENT_PATH_STEP_TOTAL}`;
}

export function summarizeWorkshop2ArticleDevelopmentStateDisplay(input: {
  dossier: Workshop2DossierPhase1 | null;
  /** Fallback когда mirror ещё не persist — пересчёт на лету (read-only). */
  vaultFileCount?: number;
  categoryLeafId?: string;
  latestSampleOrder?: Parameters<
    typeof buildWorkshop2ArticleDevelopmentState
  >[0]['latestSampleOrder'];
}): Workshop2ArticleDevelopmentStateDisplay {
  const mirror = input.dossier?.articleDevelopmentStateMirror;
  const snap =
    mirror ??
    (input.dossier
      ? buildWorkshop2ArticleDevelopmentState({
          dossier: input.dossier,
          actor: 'ui-fallback',
          vaultFileCount: input.vaultFileCount ?? 0,
          categoryLeafId: input.categoryLeafId,
          latestSampleOrder: input.latestSampleOrder ?? null,
        })
      : null);

  if (!snap) {
    return {
      labelRu: 'Critical path — нет досье',
      hintRu: 'Откройте артикул и сохраните ТЗ перед sample-order.',
      tone: 'neutral',
      criticalPathReady: false,
      stepsDone: 0,
      stepsTotal: WORKSHOP2_ARTICLE_DEVELOPMENT_PATH_STEP_TOTAL,
      fromMirror: false,
    };
  }

  return {
    labelRu: labelFromSnapshot(snap),
    hintRu: snap.hintRu ?? 'Продолжите critical path: sample → WMS → received → gold → intake.',
    tone: toneFromSnapshot(snap),
    criticalPathReady: snap.criticalPathReady,
    stepsDone: snap.steps.length,
    stepsTotal: WORKSHOP2_ARTICLE_DEVELOPMENT_PATH_STEP_TOTAL,
    mirroredAt: mirror?.mirroredAt,
    fromMirror: Boolean(mirror),
  };
}
