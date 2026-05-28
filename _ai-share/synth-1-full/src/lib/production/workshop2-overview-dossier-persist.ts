/**
 * Wave 19 #21 + wave 27: persist снимка обзора + overviewMirror gates.
 */
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import {
  buildWorkshop2OverviewModel,
  type Workshop2OverviewModel,
} from '@/lib/production/workshop2-overview-model';
import type { ArticleWorkspaceBundle } from '@/lib/production/article-workspace/types';
import type { Workshop2HandoffReadinessCheck } from '@/lib/production/workshop2-handoff-readiness';

export function buildWorkshop2OverviewPersistSnapshot(input: {
  dossier: Workshop2DossierPhase1 | null;
  bundle?: ArticleWorkspaceBundle | null;
  collectionId: string;
  articleId: string;
}): NonNullable<Workshop2DossierPhase1['overviewPersistedSnapshot']> {
  const model: Workshop2OverviewModel = buildWorkshop2OverviewModel({
    dossier: input.dossier,
    bundle: input.bundle ?? null,
    collectionId: input.collectionId,
    articleId: input.articleId,
  });
  return {
    persistedAt: new Date().toISOString(),
    tzOverallPct: model.readinessSnapshot.tzOverallPct,
    readyForHandoff: model.readinessSnapshot.readyForHandoff,
    blockerCount: model.readinessSnapshot.blockerCount,
    warningCount: model.readinessSnapshot.warningCount,
    primaryTab: model.primaryAction.tab,
    primaryLabel: model.primaryAction.buttonLabel,
    source: model.readinessSnapshot.source,
  };
}

export function persistWorkshop2OverviewSnapshotToDossier(
  dossier: Workshop2DossierPhase1,
  input: {
    bundle?: ArticleWorkspaceBundle | null;
    collectionId: string;
    articleId: string;
  }
): Workshop2DossierPhase1 {
  return {
    ...dossier,
    overviewPersistedSnapshot: buildWorkshop2OverviewPersistSnapshot({
      dossier,
      ...input,
    }),
  };
}

export function buildWorkshop2OverviewMirror(input: {
  dossier: Workshop2DossierPhase1 | null;
  bundle?: ArticleWorkspaceBundle | null;
  collectionId: string;
  articleId: string;
}): NonNullable<Workshop2DossierPhase1['overviewMirror']> {
  const model = buildWorkshop2OverviewModel({
    dossier: input.dossier,
    bundle: input.bundle ?? null,
    collectionId: input.collectionId,
    articleId: input.articleId,
  });
  const snap = model.readinessSnapshot;
  const blockerSampleOrder = snap.blockerCount > 0;
  const blockerHandoff = !snap.readyForHandoff;

  let hintRu: string | undefined;
  if (blockerHandoff) {
    hintRu = `Обзор: handoff заблокирован — ${snap.blockerCount} блокер(ов), ${snap.warningCount} предупрежд.`;
  } else if (blockerSampleOrder) {
    hintRu = `Обзор: ${snap.blockerCount} блокер(ов) — проверьте ТЗ перед образцом.`;
  }

  return {
    mirroredAt: new Date().toISOString(),
    tzOverallPct: snap.tzOverallPct,
    readyForHandoff: snap.readyForHandoff,
    blockerCount: snap.blockerCount,
    warningCount: snap.warningCount,
    primaryTab: model.primaryAction.tab,
    blockerSampleOrder,
    blockerHandoff,
    hintRu,
  };
}

export function persistWorkshop2OverviewMirrorToDossier(
  dossier: Workshop2DossierPhase1,
  input: {
    bundle?: ArticleWorkspaceBundle | null;
    collectionId: string;
    articleId: string;
  }
): Workshop2DossierPhase1 {
  const withSnapshot = persistWorkshop2OverviewSnapshotToDossier(dossier, input);
  return {
    ...withSnapshot,
    overviewMirror: buildWorkshop2OverviewMirror({ dossier: withSnapshot, ...input }),
  };
}

export function evaluateWorkshop2OverviewSampleGate(
  dossier: Workshop2DossierPhase1
): Workshop2HandoffReadinessCheck | null {
  const mirror = dossier.overviewMirror;
  if (!mirror) {
    return {
      id: 'overview.mirror_missing',
      severity: 'warning',
      messageRu: 'Обзор не в PG — «Обзор → PG» на вкладке Обзор.',
    };
  }
  if (mirror.blockerSampleOrder) {
    return {
      id: 'overview.blockers',
      severity: 'warning',
      messageRu:
        mirror.hintRu ?? `Обзор: ${mirror.blockerCount} блокер(ов) в readiness — дозаполните ТЗ.`,
    };
  }
  return null;
}

export function evaluateWorkshop2OverviewHandoffGate(
  dossier: Workshop2DossierPhase1
): Workshop2HandoffReadinessCheck | null {
  const mirror = dossier.overviewMirror;
  if (!mirror) return null;
  if (!mirror.blockerHandoff) return null;
  return {
    id: 'overview.handoff_blocked',
    severity: 'blocker',
    messageRu:
      mirror.hintRu ?? 'Обзор SKU: handoff не готов — закройте блокеры readiness перед commit.',
  };
}
