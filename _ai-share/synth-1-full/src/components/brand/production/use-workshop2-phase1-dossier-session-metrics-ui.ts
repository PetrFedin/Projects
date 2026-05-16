'use client';

import { useEffect, useState } from 'react';
import {
  flushW2DossierMetricsToServer,
  warmupW2MetricsStamp,
  type Workshop2DossierMetricsFlushContext,
} from '@/lib/production/workshop2-dossier-metrics-ingest';
import {
  formatW2DossierMetricsFooterLine,
  recordW2DossierAbandonIfNoSaveYet,
  touchW2DossierSessionOpenedAt,
} from '@/lib/production/workshop2-dossier-session-metrics';

/** Тик метрик досье, строка футера, touch при открытии, flush при уходе со вкладки, периодический refresh футера. */
export function useWorkshop2Phase1DossierSessionMetricsUi(input: {
  isPhase1: boolean;
  collectionId: string;
  articleId: string;
  dossierUpdatedAt: string | undefined;
  w2DossierMetricsCtx: Workshop2DossierMetricsFlushContext;
}) {
  const { isPhase1, collectionId, articleId, dossierUpdatedAt, w2DossierMetricsCtx } = input;

  const [dossierMetricsTick, setDossierMetricsTick] = useState(0);
  const [dossierMetricsFooterLine, setDossierMetricsFooterLine] = useState<string | null>(null);

  useEffect(() => {
    if (!isPhase1) return;
    touchW2DossierSessionOpenedAt(collectionId, articleId);
    setDossierMetricsTick((n) => n + 1);
    warmupW2MetricsStamp(w2DossierMetricsCtx);
  }, [isPhase1, collectionId, articleId, w2DossierMetricsCtx]);

  useEffect(() => {
    if (!isPhase1) {
      setDossierMetricsFooterLine(null);
      return;
    }
    setDossierMetricsFooterLine(formatW2DossierMetricsFooterLine(collectionId, articleId));
  }, [isPhase1, collectionId, articleId, dossierMetricsTick, dossierUpdatedAt]);

  useEffect(() => {
    if (!isPhase1 || typeof document === 'undefined') return;
    const onVis = () => {
      if (document.visibilityState === 'hidden') {
        recordW2DossierAbandonIfNoSaveYet(collectionId, articleId);
        flushW2DossierMetricsToServer(collectionId, articleId, w2DossierMetricsCtx);
      }
    };
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, [isPhase1, collectionId, articleId, w2DossierMetricsCtx]);

  useEffect(() => {
    if (!isPhase1) return;
    const t = window.setInterval(() => setDossierMetricsTick((n) => n + 1), 45_000);
    return () => clearInterval(t);
  }, [isPhase1]);

  return { dossierMetricsFooterLine, setDossierMetricsTick };
}
