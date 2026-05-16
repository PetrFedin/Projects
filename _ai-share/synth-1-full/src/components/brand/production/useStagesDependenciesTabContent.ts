'use client';

import { type Dispatch, type SetStateAction } from 'react';
import { type CollectionStep } from '@/lib/production/collection-steps-catalog';
import type { ProductionFloorTabId } from '@/lib/production/floor-flow';
import { type CollectionSkuFlowDoc } from '@/lib/production/unified-sku-flow-store';
import type { StagesLocalInventoryToolsInput, StagesTabArticle } from '@/components/brand/production/stages-dependencies-tab-content-helpers';
import type { UseStagesDependenciesTabContentResult } from '@/components/brand/production/build-stages-dependencies-tab-content-result';
import { collectStagesDependenciesTabBuildArgs } from '@/components/brand/production/collect-stages-dependencies-tab-build-args';
import { buildStagesDependenciesTabContentResult } from '@/components/brand/production/build-stages-dependencies-tab-content-result';
import { useStagesDependenciesCollapsiblePanels } from '@/components/brand/production/useStagesDependenciesCollapsiblePanels';
import { useStagesDependenciesMatrixBlock } from '@/components/brand/production/useStagesDependenciesMatrixBlock';
import { useStagesDependenciesModuleNavigation } from '@/components/brand/production/useStagesDependenciesModuleNavigation';
import { useStagesDependenciesProductionProfile } from '@/components/brand/production/useStagesDependenciesProductionProfile';
import { useStagesDependenciesPoolAndFocus } from '@/components/brand/production/useStagesDependenciesPoolAndFocus';
import { useStagesDependenciesSlicePicker } from '@/components/brand/production/useStagesDependenciesSlicePicker';
import { useStagesDependenciesTabMemos } from '@/components/brand/production/useStagesDependenciesTabMemos';
import { useStagesDependenciesUrlState } from '@/components/brand/production/useStagesDependenciesUrlState';
import { useStagesDependenciesDepsPortal } from '@/components/brand/production/useStagesDependenciesDepsPortal';
import { useStagesDependenciesPreTabsDerived } from '@/components/brand/production/useStagesDependenciesPreTabsDerived';
import { useStagesDependenciesSkuPanelNavigation } from '@/components/brand/production/useStagesDependenciesSkuPanelNavigation';
import { useStagesDependenciesViewAggregateState } from '@/components/brand/production/useStagesDependenciesViewAggregateState';

export type StagesDependenciesTabContentProps = {
  collectionArticles: StagesTabArticle[];
  flowDoc: CollectionSkuFlowDoc;
  steps: CollectionStep[];
  collectionQuery: string;
  floorHref: (tab: ProductionFloorTabId) => string;
  mergeCollectionQuery: (href: string, collectionQuery: string) => string;
  setUnifiedDoc: Dispatch<SetStateAction<CollectionSkuFlowDoc>>;
  getProductionFloorTabTitle: (tab: ProductionFloorTabId) => string;
  collectionFlowKey: string;
  localInventoryTools?: StagesLocalInventoryToolsInput;
};

export type { UseStagesDependenciesTabContentResult } from '@/components/brand/production/build-stages-dependencies-tab-content-result';

export function useStagesDependenciesTabContent(
  props: StagesDependenciesTabContentProps
): UseStagesDependenciesTabContentResult {
  const {
    collectionArticles,
    flowDoc,
    steps,
    collectionQuery,
    floorHref,
    mergeCollectionQuery,
    setUnifiedDoc,
    getProductionFloorTabTitle,
    collectionFlowKey,
    localInventoryTools,
  } = props;

  const panels = useStagesDependenciesCollapsiblePanels(collectionFlowKey);

  const url = useStagesDependenciesUrlState(collectionFlowKey);

  const profile = useStagesDependenciesProductionProfile(flowDoc);

  const tabMemos = useStagesDependenciesTabMemos({
    steps,
    collectionArticles,
    facetBundle: url.facetBundle,
  });

  const pool = useStagesDependenciesPoolAndFocus({
    collectionArticles,
    facetBundle: url.facetBundle,
    stagesSkuParam: url.stagesSkuParam,
    legacyPickIds: url.legacyPickIds,
    stagesWorkSkuParam: url.stagesWorkSkuParam,
    legacyPickRaw: url.legacyPickRaw,
    replaceQuery: url.replaceQuery,
  });

  const matrix = useStagesDependenciesMatrixBlock({
    collectionFlowKey,
    replaceQuery: url.replaceQuery,
    matrixTextQParam: url.matrixTextQParam,
    steps,
    matrixPhaseParam: url.matrixPhaseParam,
    subTab: url.subTab,
    matrixExpanded: panels.matrixExpanded,
    setMatrixOpen: panels.setMatrixOpen,
    flowDoc,
    focusArticle: pool.focusArticle,
  });

  const slicePicker = useStagesDependenciesSlicePicker({
    poolArticles: pool.poolArticles,
    focusArticle: pool.focusArticle,
  });

  const view = useStagesDependenciesViewAggregateState({
    flowDoc,
    steps,
    focusArticle: pool.focusArticle,
    chainFocusStepId: url.chainFocusStepId,
    productionProfileId: profile.productionProfileId,
    setUnifiedDoc,
  });

  const skuNav = useStagesDependenciesSkuPanelNavigation({
    stagesMatrixSkuParam: url.stagesMatrixSkuParam,
    poolArticles: pool.poolArticles,
    replaceQuery: url.replaceQuery,
  });

  const preTabs = useStagesDependenciesPreTabsDerived({
    flowDoc,
    steps,
    focusArticle: pool.focusArticle,
    productionProfileId: profile.productionProfileId,
    localInventoryTools,
    poolArticleCount: pool.poolArticles.length,
    contextFilterActive: url.contextFilterActive,
    clearAllFacets: url.clearAllFacets,
  });

  const moduleNav = useStagesDependenciesModuleNavigation({
    poolArticles: pool.poolArticles,
    collectionQuery,
    mergeCollectionQuery,
    router: url.router,
    focusArticle: pool.focusArticle,
  });

  const depsPortalFields = useStagesDependenciesDepsPortal({
    steps,
    focusArticle: pool.focusArticle,
    flowDoc,
    productionProfileId: profile.productionProfileId,
    jumpToMatrixRow: matrix.jumpToMatrixRow,
    mergeCollectionQuery,
    collectionQuery,
    floorHref,
    navigateToStageModule: moduleNav.navigateToStageModule,
    openSkuPanelForStep: skuNav.openSkuPanelForStep,
  });

  return buildStagesDependenciesTabContentResult(
    collectStagesDependenciesTabBuildArgs({
      panels,
      url,
      profile,
      tabMemos,
      pool,
      matrix,
      slicePicker,
      view,
      skuNav,
      preTabs,
      moduleNav,
      depsPortalFields,
      tabProps: {
        collectionArticles,
        flowDoc,
        steps,
        collectionQuery,
        floorHref,
        mergeCollectionQuery,
        setUnifiedDoc,
        getProductionFloorTabTitle,
        collectionFlowKey,
      },
    })
  );
}
