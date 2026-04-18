'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { COLLECTION_STEPS } from '@/lib/production/collection-steps-catalog';
import {
  BRAND_UNIFIED_SKU_FLOW_SAVED_EVENT,
  ensureSkuStages,
  loadUnifiedSkuFlowDoc,
  patchSkuStage,
  saveUnifiedSkuFlowDoc,
  type CollectionSkuFlowDoc,
  type MatrixStepStatus,
} from '@/lib/production/unified-sku-flow-store';
import {
  canBindStageActions,
  collectionFlowStorageKey,
  hasStageFlowTail,
  parseStageUrlSearchParams,
  type ParsedStageUrlContext,
} from '@/lib/production/stages-url';

const STEP_IDS = COLLECTION_STEPS.map((s) => s.id);

export type ProductionStageContextValue = {
  parsed: ParsedStageUrlContext;
  collectionFlowKey: string;
  flowDoc: CollectionSkuFlowDoc;
  setFlowDoc: React.Dispatch<React.SetStateAction<CollectionSkuFlowDoc>>;
  showFlowBanner: boolean;
  canSetStageStatus: boolean;
  /** В документе уже есть SKU, но не этот — расхождение с матрицей */
  skuPoolMismatch: boolean;
  currentStepStatus: MatrixStepStatus | 'blocked' | 'skipped' | 'not_started' | undefined;
  refreshFlowDoc: () => void;
  markStepStatus: (status: MatrixStepStatus) => void;
};

export function useProductionStageContext(): ProductionStageContextValue {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const parsed = useMemo(() => parseStageUrlSearchParams(searchParams), [searchParams]);
  const collectionFlowKey = useMemo(
    () => collectionFlowStorageKey(parsed.collectionId),
    [parsed.collectionId]
  );

  const [flowDoc, setFlowDoc] = useState<CollectionSkuFlowDoc>(() => ({ v: 1, skus: {} }));

  const refreshFlowDoc = useCallback(() => {
    setFlowDoc(loadUnifiedSkuFlowDoc(collectionFlowKey));
  }, [collectionFlowKey]);

  useEffect(() => {
    refreshFlowDoc();
  }, [collectionFlowKey, pathname, refreshFlowDoc]);

  useEffect(() => {
    const onSaved = (e: Event) => {
      const k = (e as CustomEvent<{ collectionKey?: string }>).detail?.collectionKey;
      if (k === collectionFlowKey) refreshFlowDoc();
    };
    window.addEventListener(BRAND_UNIFIED_SKU_FLOW_SAVED_EVENT, onSaved as EventListener);
    return () =>
      window.removeEventListener(BRAND_UNIFIED_SKU_FLOW_SAVED_EVENT, onSaved as EventListener);
  }, [collectionFlowKey, refreshFlowDoc]);

  const showFlowBanner = hasStageFlowTail(parsed);
  const canSetStageStatus = canBindStageActions(parsed);

  const skuPoolMismatch = useMemo(() => {
    if (!parsed.resolvedArticleId) return false;
    const keys = Object.keys(flowDoc.skus);
    if (keys.length === 0) return false;
    return !flowDoc.skus[parsed.resolvedArticleId];
  }, [flowDoc.skus, parsed.resolvedArticleId]);

  const currentStepStatus = useMemo(() => {
    if (!parsed.resolvedArticleId || !parsed.stagesStep) return undefined;
    return flowDoc.skus[parsed.resolvedArticleId]?.stages[parsed.stagesStep]?.status;
  }, [flowDoc, parsed.resolvedArticleId, parsed.stagesStep]);

  const markStepStatus = useCallback(
    (status: MatrixStepStatus) => {
      if (!canSetStageStatus) return;
      const id = parsed.resolvedArticleId;
      const stepId = parsed.stagesStep;
      const label = parsed.skuCode || id;
      setFlowDoc((prev) => {
        let d = prev;
        if (!d.skus[id]) d = ensureSkuStages(d, id, label, STEP_IDS);
        const next = patchSkuStage(d, id, stepId, { status });
        saveUnifiedSkuFlowDoc(collectionFlowKey, next);
        return next;
      });
    },
    [
      canSetStageStatus,
      collectionFlowKey,
      parsed.resolvedArticleId,
      parsed.skuCode,
      parsed.stagesStep,
    ]
  );

  return {
    parsed,
    collectionFlowKey,
    flowDoc,
    setFlowDoc,
    showFlowBanner,
    canSetStageStatus,
    skuPoolMismatch,
    currentStepStatus,
    refreshFlowDoc,
    markStepStatus,
  };
}
