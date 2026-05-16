import type { MutableRefObject } from 'react';
import { pushTzActionLog } from '@/components/brand/production/workshop2-phase1-dossier-panel-tz-action-log';
import type {
  Workshop2DossierPhase1,
  Workshop2TzActionLogPayload,
} from '@/lib/production/workshop2-dossier-phase1.types';
import type { Workshop2DossierMetricsFlushContext } from '@/lib/production/workshop2-dossier-metrics-ingest';
import { flushW2DossierMetricsToServer } from '@/lib/production/workshop2-dossier-metrics-ingest';
import {
  recordW2DossierPersistFailure,
  recordW2DossierPersistSuccess,
} from '@/lib/production/workshop2-dossier-session-metrics';
import { setWorkshop2Phase1Dossier } from '@/lib/production/workshop2-phase1-dossier-storage';

export type W2DossierJournalToastFn = (props: {
  title: string;
  description?: string;
  variant?: 'default' | 'destructive';
}) => void;

/** После `pushTzActionLog` — обновить служебные поля досье перед записью в LS. */
export function stampPhase1DossierAfterTzActionLog(
  prev: Workshop2DossierPhase1,
  updatedByLabel: string,
  action: Workshop2TzActionLogPayload
): Workshop2DossierPhase1 {
  const withLog = pushTzActionLog(prev, updatedByLabel, action);
  return {
    ...withLog,
    schemaVersion: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: updatedByLabel.slice(0, 256),
  };
}

/** Запись уже подготовленного досье в localStorage + метрики + тосты при ошибке/успехе. */
export function commitStampedPhase1DossierToBrowser(opts: {
  prev: Workshop2DossierPhase1;
  stamped: Workshop2DossierPhase1;
  collectionId: string;
  articleId: string;
  lastPersistedDossierRef: MutableRefObject<Workshop2DossierPhase1 | null>;
  w2DossierMetricsCtx: Workshop2DossierMetricsFlushContext;
  setDossierMetricsTick: (fn: (n: number) => number) => void;
  setSaveError: (msg: string | null) => void;
  toast: W2DossierJournalToastFn;
  persistFailure: { title: string; description: string };
  persistSuccessToast?: { title: string; description: string };
}): Workshop2DossierPhase1 {
  const {
    prev,
    stamped,
    collectionId,
    articleId,
    lastPersistedDossierRef,
    w2DossierMetricsCtx,
    setDossierMetricsTick,
    setSaveError,
    toast,
    persistFailure,
    persistSuccessToast,
  } = opts;
  lastPersistedDossierRef.current = stamped;
  if (!setWorkshop2Phase1Dossier(collectionId, articleId, stamped)) {
    recordW2DossierPersistFailure(collectionId, articleId);
    setDossierMetricsTick((n) => n + 1);
    flushW2DossierMetricsToServer(collectionId, articleId, w2DossierMetricsCtx);
    toast({
      title: persistFailure.title,
      description: persistFailure.description,
      variant: 'destructive',
    });
    return prev;
  }
  setSaveError(null);
  recordW2DossierPersistSuccess(collectionId, articleId);
  setDossierMetricsTick((n) => n + 1);
  flushW2DossierMetricsToServer(collectionId, articleId, w2DossierMetricsCtx);
  if (persistSuccessToast) {
    toast(persistSuccessToast);
  }
  return stamped;
}

/** Общие поля для `commitStampedPhase1DossierToBrowser` после строки журнала ТЗ. */
export type CommitJournalViaBrowserBase = {
  collectionId: string;
  articleId: string;
  lastPersistedDossierRef: MutableRefObject<Workshop2DossierPhase1 | null>;
  w2DossierMetricsCtx: Workshop2DossierMetricsFlushContext;
  setDossierMetricsTick: (fn: (n: number) => number) => void;
  setSaveError: (msg: string | null) => void;
  toast: W2DossierJournalToastFn;
  updatedByLabel: string;
};

export const W2_JOURNAL_COMMIT_LS_FULL = {
  title: 'Запись не сохранена',
  description: 'localStorage переполнен.',
} as const;

export const W2_JOURNAL_COMMIT_LS_JOURNAL = {
  title: 'Журнал не записан',
  description: 'localStorage переполнен.',
} as const;

/** Одна запись `dossier_edit` в журнал + persist в браузер. */
export function commitDossierEditJournalViaBrowser(
  base: CommitJournalViaBrowserBase,
  prev: Workshop2DossierPhase1,
  summaries: string[],
  persistFailure: { title: string; description: string },
  persistSuccessToast?: { title: string; description: string }
): Workshop2DossierPhase1 {
  const stamped = stampPhase1DossierAfterTzActionLog(prev, base.updatedByLabel, {
    type: 'dossier_edit',
    summaries,
  });
  return commitStampedPhase1DossierToBrowser({
    prev,
    stamped,
    collectionId: base.collectionId,
    articleId: base.articleId,
    lastPersistedDossierRef: base.lastPersistedDossierRef,
    w2DossierMetricsCtx: base.w2DossierMetricsCtx,
    setDossierMetricsTick: base.setDossierMetricsTick,
    setSaveError: base.setSaveError,
    toast: base.toast,
    persistFailure,
    persistSuccessToast,
  });
}

/** Произвольное действие журнала ТЗ + persist в браузер. */
export function commitTzActionJournalViaBrowser(
  base: CommitJournalViaBrowserBase,
  prev: Workshop2DossierPhase1,
  action: Workshop2TzActionLogPayload,
  persistFailure: { title: string; description: string }
): Workshop2DossierPhase1 {
  const stamped = stampPhase1DossierAfterTzActionLog(prev, base.updatedByLabel, action);
  return commitStampedPhase1DossierToBrowser({
    prev,
    stamped,
    collectionId: base.collectionId,
    articleId: base.articleId,
    lastPersistedDossierRef: base.lastPersistedDossierRef,
    w2DossierMetricsCtx: base.w2DossierMetricsCtx,
    setDossierMetricsTick: base.setDossierMetricsTick,
    setSaveError: base.setSaveError,
    toast: base.toast,
    persistFailure,
  });
}
