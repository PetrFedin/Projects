'use client';

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MutableRefObject,
  type SetStateAction,
} from 'react';
import { useWorkshop2Phase1DossierArticleLineDrafts } from '@/components/brand/production/use-workshop2-phase1-dossier-article-line-drafts';
import { useWorkshop2Phase1DossierHydrateFromStorage } from '@/components/brand/production/use-workshop2-phase1-dossier-hydrate-from-storage';
import type { HandbookCheckSnapshot } from '@/components/brand/production/workshop2-phase1-dossier-panel-handbook-check-snapshot';
import { useWorkshop2Phase1DossierPersist } from '@/components/brand/production/use-workshop2-phase1-dossier-persist';
import { useWorkshop2Phase1DossierSessionMetricsUi } from '@/components/brand/production/use-workshop2-phase1-dossier-session-metrics-ui';
import { useWorkshop2Phase1DossierWriteGuardedSetDossier } from '@/components/brand/production/use-workshop2-phase1-dossier-write-guarded-set-dossier';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import type { Workshop2DossierMetricsFlushContext } from '@/lib/production/workshop2-dossier-metrics-ingest';
import { emptyWorkshop2DossierPhase1 } from '@/lib/production/workshop2-phase1-dossier-storage';

type ToastFn = (opts: {
  title: string;
  description?: string;
  variant?: 'default' | 'destructive';
}) => void;

export type UseWorkshop2Phase1DossierCoreStateInput = {
  collectionId: string;
  articleId: string;
  articleSku: string;
  articleName: string;
  updatedByLabel: string;
  tzWriteDisabled: boolean;
  toast: ToastFn;
  isPhase1: boolean;
  dossierHydrateKey: number;
  w2DossierMetricsCtx: Workshop2DossierMetricsFlushContext;
  w2MetricsSkuRef: MutableRefObject<string | null>;
  onArticleLineDraftsChange?: (drafts: { sku: string; name: string }) => void;
};

/** Dossier state + persist + hydrate + article line drafts (persist zone manifest). */
export function useWorkshop2Phase1DossierCoreState({
  collectionId,
  articleId,
  articleSku,
  articleName,
  updatedByLabel,
  tzWriteDisabled,
  toast,
  isPhase1,
  dossierHydrateKey,
  w2DossierMetricsCtx,
  w2MetricsSkuRef,
  onArticleLineDraftsChange,
}: UseWorkshop2Phase1DossierCoreStateInput) {
  const [dossier, setDossierInternal] = useState<Workshop2DossierPhase1>(() =>
    emptyWorkshop2DossierPhase1()
  );
  const dossierLatestRef = useRef(dossier);
  const setDossierInternalWithLatestRef = useCallback(
    (u: SetStateAction<Workshop2DossierPhase1>) => {
      setDossierInternal((prev) => {
        const next = typeof u === 'function' ? u(prev) : u;
        dossierLatestRef.current = next;
        return next;
      });
    },
    []
  );
  const setDossier = useWorkshop2Phase1DossierWriteGuardedSetDossier(
    tzWriteDisabled,
    toast,
    setDossierInternalWithLatestRef
  );

  useEffect(() => {
    dossierLatestRef.current = dossier;
  }, [dossier]);

  const { dossierMetricsFooterLine, setDossierMetricsTick } =
    useWorkshop2Phase1DossierSessionMetricsUi({
      isPhase1,
      collectionId,
      articleId,
      dossierUpdatedAt: dossier.updatedAt,
      w2DossierMetricsCtx,
    });

  const { skuDraft, setSkuDraft, nameDraft, setNameDraft } =
    useWorkshop2Phase1DossierArticleLineDrafts({
      articleSku,
      articleName,
    });

  w2MetricsSkuRef.current = skuDraft.trim() || articleSku.trim() || null;

  useEffect(() => {
    onArticleLineDraftsChange?.({ sku: skuDraft, name: nameDraft });
  }, [skuDraft, nameDraft, onArticleLineDraftsChange]);

  const [savedHint, setSavedHint] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const { persist, lastPersistedDossierRef } = useWorkshop2Phase1DossierPersist({
    collectionId,
    articleId,
    updatedByLabel,
    tzWriteDisabled,
    toast,
    w2DossierMetricsCtx,
    setDossierInternal: setDossierInternalWithLatestRef,
    setDossierMetricsTick,
    setSaveError,
    setSavedHint,
  });

  const [handbookCheckSnapshot, setHandbookCheckSnapshot] = useState<HandbookCheckSnapshot | null>(
    null
  );

  useWorkshop2Phase1DossierHydrateFromStorage({
    collectionId,
    articleId,
    articleSku,
    dossierHydrateKey,
    tzWriteDisabled,
    setDossierInternal,
    lastPersistedDossierRef,
    setHandbookCheckSnapshot,
  });

  return {
    dossier,
    setDossier,
    setDossierInternal,
    setDossierInternalWithLatestRef,
    dossierLatestRef,
    savedHint,
    saveError,
    setSaveError,
    persist,
    lastPersistedDossierRef,
    dossierMetricsFooterLine,
    setDossierMetricsTick,
    skuDraft,
    setSkuDraft,
    nameDraft,
    setNameDraft,
    handbookCheckSnapshot,
    setHandbookCheckSnapshot,
  };
}
