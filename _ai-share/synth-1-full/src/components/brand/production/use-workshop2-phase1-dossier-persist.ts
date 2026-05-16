'use client';

import { useCallback, useRef, type Dispatch, type MutableRefObject, type SetStateAction } from 'react';
import { stampPhase1DossierForPersist } from '@/components/brand/production/workshop2-phase1-dossier-panel-stamp-for-persist';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import type { Workshop2DossierMetricsFlushContext } from '@/lib/production/workshop2-dossier-metrics-ingest';
import { flushW2DossierMetricsToServer } from '@/lib/production/workshop2-dossier-metrics-ingest';
import {
  recordW2DossierPersistFailure,
  recordW2DossierPersistSuccess,
} from '@/lib/production/workshop2-dossier-session-metrics';
import { setWorkshop2Phase1Dossier } from '@/lib/production/workshop2-phase1-dossier-storage';

type ToastFn = (opts: {
  title: string;
  description?: string;
  variant?: 'default' | 'destructive';
}) => void;

export type UseWorkshop2Phase1DossierPersistInput = {
  collectionId: string;
  articleId: string;
  updatedByLabel: string;
  tzWriteDisabled: boolean;
  toast: ToastFn;
  w2DossierMetricsCtx: Workshop2DossierMetricsFlushContext;
  setDossierInternal: Dispatch<SetStateAction<Workshop2DossierPhase1>>;
  setDossierMetricsTick: Dispatch<SetStateAction<number>>;
  setSaveError: Dispatch<SetStateAction<string | null>>;
  setSavedHint: Dispatch<SetStateAction<string | null>>;
};

export type UseWorkshop2Phase1DossierPersistResult = {
  persist: (next: Workshop2DossierPhase1, opts?: { freezeUpdatedAt?: boolean }) => void;
  lastPersistedDossierRef: MutableRefObject<Workshop2DossierPhase1 | null>;
};

/** Сохранение досье в localStorage, метрики, подсказки и throttled toast об успехе. */
export function useWorkshop2Phase1DossierPersist(
  input: UseWorkshop2Phase1DossierPersistInput
): UseWorkshop2Phase1DossierPersistResult {
  const {
    collectionId,
    articleId,
    updatedByLabel,
    tzWriteDisabled,
    toast,
    w2DossierMetricsCtx,
    setDossierInternal,
    setDossierMetricsTick,
    setSaveError,
    setSavedHint,
  } = input;

  const lastPersistedDossierRef = useRef<Workshop2DossierPhase1 | null>(null);
  const lastPersistSuccessToastAtRef = useRef(0);

  const persist = useCallback(
    (next: Workshop2DossierPhase1, opts?: { freezeUpdatedAt?: boolean }) => {
      if (tzWriteDisabled) {
        toast({
          title: 'Только просмотр',
          description: 'Сохранение недоступно без права «Редактировать производство».',
          variant: 'destructive',
        });
        return;
      }
      const stamped = stampPhase1DossierForPersist(
        next,
        opts,
        updatedByLabel,
        lastPersistedDossierRef.current
      );
      lastPersistedDossierRef.current = stamped;
      const savedOk = setWorkshop2Phase1Dossier(collectionId, articleId, stamped);
      setDossierInternal(stamped);
      if (!savedOk) {
        recordW2DossierPersistFailure(collectionId, articleId);
        setDossierMetricsTick((n) => n + 1);
        flushW2DossierMetricsToServer(collectionId, articleId, w2DossierMetricsCtx);
        setSaveError(
          'Не удалось сохранить в localStorage (квота или приватный режим). Сожмите фото в референсах/скетче или вынесите в ссылки.'
        );
        toast({
          title: 'Сохранение не записано',
          description: 'Браузер отклонил запись — уменьшите объём вложений в досье.',
          variant: 'destructive',
        });
        return;
      }
      setSaveError(null);
      recordW2DossierPersistSuccess(collectionId, articleId);
      setDossierMetricsTick((n) => n + 1);
      flushW2DossierMetricsToServer(collectionId, articleId, w2DossierMetricsCtx);
      const toastAt = Date.now();
      if (toastAt - lastPersistSuccessToastAtRef.current >= 3500) {
        lastPersistSuccessToastAtRef.current = toastAt;
        toast({
          title: 'Черновик сохранён',
          description: 'Запись в браузере на этом устройстве.',
        });
      }
      setSavedHint('Черновик сохранён');
      window.setTimeout(() => setSavedHint(null), 4000);
    },
    [
      collectionId,
      articleId,
      updatedByLabel,
      tzWriteDisabled,
      toast,
      w2DossierMetricsCtx,
      setDossierInternal,
      setDossierMetricsTick,
      setSaveError,
      setSavedHint,
    ]
  );

  return { persist, lastPersistedDossierRef };
}
