'use client';

import { useEffect, type Dispatch, type SetStateAction } from 'react';
import type { Workshop2PassportHubModel } from '@/lib/production/workshop2-passport-check';
import {
  maybeRecordW2PassportRoute100,
  maybeRecordW2TzSampleReady,
  maybeRecordW2VisualGateCleared,
} from '@/lib/production/workshop2-dossier-session-metrics';

/** Запись в session-метрики W2 (паспорт 100%, визуал-гейт, готовность образца) с тиком для flush. */
export function useWorkshop2Phase1DossierW2SessionMetricRecordEffects(p: {
  collectionId: string;
  articleId: string;
  passportHubModel: Workshop2PassportHubModel;
  visualGateOpenCountGlobal: number;
  isPhase1: boolean;
  /** Сводка готовности к образцу (цепочка && может дать `undefined` в строгом выводе). */
  tzReadyForSample: boolean | undefined;
  setDossierMetricsTick: Dispatch<SetStateAction<number>>;
}) {
  const {
    collectionId,
    articleId,
    passportHubModel,
    visualGateOpenCountGlobal,
    isPhase1,
    tzReadyForSample,
    setDossierMetricsTick,
  } = p;

  useEffect(() => {
    if (!passportHubModel) return;
    if (maybeRecordW2PassportRoute100(collectionId, articleId, passportHubModel.combinedPct)) {
      setDossierMetricsTick((t) => t + 1);
    }
  }, [collectionId, articleId, passportHubModel]);

  useEffect(() => {
    if (maybeRecordW2VisualGateCleared(collectionId, articleId, visualGateOpenCountGlobal)) {
      setDossierMetricsTick((t) => t + 1);
    }
  }, [collectionId, articleId, visualGateOpenCountGlobal]);

  useEffect(() => {
    if (!isPhase1) return;
    if (maybeRecordW2TzSampleReady(collectionId, articleId, Boolean(tzReadyForSample))) {
      setDossierMetricsTick((t) => t + 1);
    }
  }, [isPhase1, collectionId, articleId, tzReadyForSample]);
}
