'use client';

import { createPortal } from 'react-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Crosshair } from 'lucide-react';
import type { CollectionStep } from '@/lib/production/collection-steps-catalog';
import type { ProductionFloorTabId } from '@/lib/production/floor-flow';
import type { ProductionFlowProfileId } from '@/lib/production/collection-production-profiles';
import type { CollectionSkuFlowDoc } from '@/lib/production/unified-sku-flow-store';
import { stagesArticleDisplayLabel } from '@/lib/production/stages-tab-facets';
import {
  hintTextForArticleNextCatalogStep,
  type StagesTabArticle,
} from '@/components/brand/production/stages-dependencies-tab-content-helpers';

export type Workshop2StagesDependenciesDepsNodeInfoPortalProps = {
  step: CollectionStep;
  articles: StagesTabArticle[];
  onClose: () => void;
  flowDoc: CollectionSkuFlowDoc;
  steps: CollectionStep[];
  productionProfileId: ProductionFlowProfileId;
  focusArticle: StagesTabArticle | null;
  onJumpToMatrixRow: (stepId: string) => void;
  mergeCollectionQuery: (href: string, collectionQuery: string) => string;
  collectionQuery: string;
  floorHref: (tab: ProductionFloorTabId) => string;
  onNavigateToStageModule: (step: CollectionStep, targetHref: string) => void;
  onOpenSkuPanelForStep: (skuId: string, stepId: string) => void;
};

export function Workshop2StagesDependenciesDepsNodeInfoPortal(
  props: Workshop2StagesDependenciesDepsNodeInfoPortalProps
) {
  const {
    step,
    articles,
    onClose,
    flowDoc,
    steps,
    productionProfileId,
    focusArticle,
    onJumpToMatrixRow,
    mergeCollectionQuery,
    collectionQuery,
    floorHref,
    onNavigateToStageModule,
    onOpenSkuPanelForStep,
  } = props;

  if (typeof document === 'undefined') return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[600] flex items-end justify-center bg-black/40 p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="deps-node-info-title"
      onClick={onClose}
    >
      <div
        className="border-border-default text-text-primary max-h-[min(85vh,32rem)] w-full max-w-md overflow-y-auto rounded-xl border bg-white p-4 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p id="deps-node-info-title" className="text-sm font-semibold leading-tight">
              {step.title}
            </p>
            <p className="text-text-secondary mt-1 text-[10px]">
              В перечне на этом этапе: {articles.length} SKU
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 shrink-0 text-[10px]"
            onClick={onClose}
          >
            Закрыть
          </Button>
        </div>
        {articles.length === 0 ? (
          <p className="text-text-secondary text-[10px] leading-snug">
            На этом узле нет артикулов текущего перечня — сначала завершите предшественников в матрице
            (статусы) или расширьте срез. Тогда здесь появятся SKU и пошаговые подсказки.
          </p>
        ) : (
          <ul className="border-border-subtle space-y-2 border-t pt-3">
            {articles.map((a) => {
              const label = stagesArticleDisplayLabel(a.sku, a.season);
              const hint = hintTextForArticleNextCatalogStep(
                flowDoc,
                steps,
                a,
                label,
                productionProfileId
              );
              return (
                <li
                  key={a.id}
                  className="border-border-subtle/80 border-b pb-2 text-[10px] last:border-0 last:pb-0"
                >
                  <p className="text-text-primary font-semibold">{label}</p>
                  <p className="text-text-secondary mt-1 leading-snug">{hint}</p>
                </li>
              );
            })}
          </ul>
        )}
        {focusArticle ? (
          <div className="border-border-subtle mt-3 flex flex-wrap gap-2 border-t pt-3">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="h-8 text-[10px]"
              onClick={() => {
                onJumpToMatrixRow(step.id);
                onClose();
              }}
            >
              <Crosshair className="mr-1 inline h-3 w-3" aria-hidden />
              Строка в матрице
            </Button>
            {step.productionFloorTab || step.href ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 text-[10px]"
                onClick={() => {
                  const href = step.productionFloorTab
                    ? mergeCollectionQuery(floorHref(step.productionFloorTab), collectionQuery)
                    : mergeCollectionQuery(step.href!, collectionQuery);
                  onNavigateToStageModule(step, href);
                  onClose();
                }}
              >
                В модуль этапа
                <ArrowRight className="ml-1 inline h-3 w-3" aria-hidden />
              </Button>
            ) : null}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 text-[10px]"
              onClick={() => onOpenSkuPanelForStep(focusArticle.id, step.id)}
            >
              Панель данных SKU
            </Button>
          </div>
        ) : null}
      </div>
    </div>,
    document.body
  );
}
