'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { getProductionDataPort } from '@/lib/production-data';
import {
  ensureSkuStages,
  type CollectionSkuFlowDoc,
} from '@/lib/production/unified-sku-flow-store';
import {
  buildInvestorDemoFlowDoc,
  investorDemoFlowIsPristine,
  INVESTOR_DEMO_ARTICLE_IDS,
} from '@/lib/production/investor-demo-flow-seed';
import { COLLECTION_FLOW_STEP_IDS } from '@/app/brand/production/production-page-collection-flow-step-ids';

export type BrandProductionArticleSeed = { id: string; label: string };

export function useBrandProductionUnifiedSkuDoc(args: {
  collectionFlowKey: string;
  articleSeeds: readonly BrandProductionArticleSeed[];
}) {
  const { collectionFlowKey, articleSeeds } = args;

  const [unifiedDoc, setUnifiedDoc] = useState<CollectionSkuFlowDoc>(() => ({ v: 1, skus: {} }));
  /** Один раз на collectionFlowKey: подставить демо-статусы для трёх инвесторских SKU, если пайплайн ещё «чистый». */
  const investorDemoEvaluatedRef = useRef<string | null>(null);

  useEffect(() => {
    investorDemoEvaluatedRef.current = null;
    let cancelled = false;
    void getProductionDataPort()
      .getSkuFlow(collectionFlowKey)
      .then((doc) => {
        if (!cancelled) setUnifiedDoc(doc);
      });
    return () => {
      cancelled = true;
    };
  }, [collectionFlowKey]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    void getProductionDataPort().saveSkuFlow(collectionFlowKey, unifiedDoc);
  }, [collectionFlowKey, unifiedDoc]);

  useEffect(() => {
    setUnifiedDoc((prev) => {
      let d = prev;
      for (const a of articleSeeds) {
        d = ensureSkuStages(d, a.id, a.label, COLLECTION_FLOW_STEP_IDS);
      }
      return d;
    });
  }, [articleSeeds, COLLECTION_FLOW_STEP_IDS]);

  useEffect(() => {
    if (investorDemoEvaluatedRef.current === collectionFlowKey) return;

    const skuIds = articleSeeds.map((a) => a.id);
    const expected = [...INVESTOR_DEMO_ARTICLE_IDS].sort().join(',');
    if (skuIds.length !== 3 || [...skuIds].sort().join(',') !== expected) {
      investorDemoEvaluatedRef.current = collectionFlowKey;
      return;
    }

    setUnifiedDoc((prev) => {
      let d = prev;
      for (const a of articleSeeds) {
        d = ensureSkuStages(d, a.id, a.label, COLLECTION_FLOW_STEP_IDS);
      }
      if (!investorDemoFlowIsPristine(d, skuIds, COLLECTION_FLOW_STEP_IDS)) return prev;
      return buildInvestorDemoFlowDoc(d);
    });
    investorDemoEvaluatedRef.current = collectionFlowKey;
  }, [collectionFlowKey, articleSeeds, COLLECTION_FLOW_STEP_IDS]);

  const flowDocReady = useMemo(() => {
    let d = unifiedDoc;
    for (const a of articleSeeds) {
      d = ensureSkuStages(d, a.id, a.label, COLLECTION_FLOW_STEP_IDS);
    }
    return d;
  }, [unifiedDoc, articleSeeds, COLLECTION_FLOW_STEP_IDS]);

  return { unifiedDoc, setUnifiedDoc, flowDocReady };
}
