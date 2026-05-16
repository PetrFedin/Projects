'use client';

import { useEffect, useMemo, useRef } from 'react';
import type { ReadonlyURLSearchParams } from 'next/navigation';
import type { CollectionArticle } from '@/app/brand/production/production-page-types';
import { COLLECTION_STEPS } from '@/lib/production/collection-steps-catalog';
import {
  productionFloorTabRequiresArticle,
  type ProductionFloorTabId,
} from '@/lib/production/floor-flow';
import { STAGES_SKU_PARAM, STAGES_STEP_PARAM } from '@/lib/production/stages-url';
import { stagesArticleDisplayLabel } from '@/lib/production/stages-tab-facets';

type ToastLike = (opts: { title: string; description?: string; duration?: number }) => void;

export function useBrandProductionStagesSkuContext(args: {
  searchParams: ReadonlyURLSearchParams;
  collectionArticles: readonly CollectionArticle[];
  localInventoryHydrated: boolean;
  collectionFlowKey: string;
  pathname: string;
  router: { replace: (href: string, options?: { scroll?: boolean }) => void };
  toast: ToastLike;
  tab: ProductionFloorTabId;
}) {
  const invalidStagesSkuToastKeyRef = useRef<string | null>(null);

  const stagesSkuContextId = args.searchParams.get(STAGES_SKU_PARAM)?.trim() ?? '';

  const stagesSkuContextLine = useMemo(() => {
    if (!stagesSkuContextId) return undefined;
    const a = args.collectionArticles.find((x) => x.id === stagesSkuContextId);
    return a ? stagesArticleDisplayLabel(a.sku, a.season) : undefined;
  }, [stagesSkuContextId, args.collectionArticles]);

  const stagesStepContextId = args.searchParams.get(STAGES_STEP_PARAM)?.trim() ?? '';

  const stagesStepContextTitle = useMemo(() => {
    if (!stagesStepContextId) return undefined;
    return COLLECTION_STEPS.find((s) => s.id === stagesStepContextId)?.title;
  }, [stagesStepContextId]);

  const stagesSkuCatalogContext = useMemo(() => {
    if (!stagesSkuContextId) return null;
    const a = args.collectionArticles.find((x) => x.id === stagesSkuContextId);
    if (!a?.currentStageId) return null;
    const idx = COLLECTION_STEPS.findIndex((s) => s.id === a.currentStageId);
    if (idx < 0) return null;
    const st = COLLECTION_STEPS[idx]!;
    return {
      title: st.title,
      phase: st.phase,
      positionLabel: `${idx + 1}/${COLLECTION_STEPS.length}`,
    };
  }, [stagesSkuContextId, args.collectionArticles]);

  const articleContextValid = useMemo(
    () =>
      Boolean(
        stagesSkuContextId && args.collectionArticles.some((a) => a.id === stagesSkuContextId)
      ),
    [stagesSkuContextId, args.collectionArticles]
  );

  useEffect(() => {
    const id = stagesSkuContextId;
    if (!id) {
      invalidStagesSkuToastKeyRef.current = null;
      return;
    }
    if (!args.localInventoryHydrated) {
      return;
    }
    if (args.collectionArticles.length === 0) {
      const params = new URLSearchParams(args.searchParams.toString());
      params.delete(STAGES_SKU_PARAM);
      const q = params.toString();
      args.router.replace(`${args.pathname}${q ? `?${q}` : ''}`, { scroll: false });
      return;
    }
    if (args.collectionArticles.some((a) => a.id === id)) {
      invalidStagesSkuToastKeyRef.current = null;
      return;
    }
    const toastKey = `${args.collectionFlowKey}:${id}`;
    if (invalidStagesSkuToastKeyRef.current !== toastKey) {
      invalidStagesSkuToastKeyRef.current = toastKey;
      args.toast({
        title: 'Артикул не найден в коллекции на полу',
        description:
          'Параметр stagesSku не совпадает ни с одной строкой текущей коллекции. Контекст артикула сброшен. Проверьте collectionId и id строки из разработки коллекции.',
        duration: 10_000,
      });
    }
    const params = new URLSearchParams(args.searchParams.toString());
    params.delete(STAGES_SKU_PARAM);
    const q = params.toString();
    args.router.replace(`${args.pathname}${q ? `?${q}` : ''}`, { scroll: false });
  }, [
    args.collectionFlowKey,
    args.localInventoryHydrated,
    stagesSkuContextId,
    args.collectionArticles,
    args.pathname,
    args.router,
    args.searchParams,
    args.toast,
  ]);

  useEffect(() => {
    if (!args.localInventoryHydrated) return;
    if (!productionFloorTabRequiresArticle(args.tab)) return;
    if (articleContextValid) return;
    const params = new URLSearchParams(args.searchParams.toString());
    params.delete('floorTab');
    if (stagesSkuContextId) params.delete(STAGES_SKU_PARAM);
    const q = params.toString();
    args.router.replace(`${args.pathname}${q ? `?${q}` : ''}`, { scroll: false });
  }, [
    args.tab,
    articleContextValid,
    stagesSkuContextId,
    args.pathname,
    args.router,
    args.searchParams,
    args.localInventoryHydrated,
  ]);

  return {
    stagesSkuContextId,
    stagesSkuContextLine,
    stagesStepContextId,
    stagesStepContextTitle,
    stagesSkuCatalogContext,
    articleContextValid,
  };
}
