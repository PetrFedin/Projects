import type { StagesDependenciesTabContentBuildArgs } from '@/components/brand/production/stages-dependencies-tab-content-build-args';
import type { StagesCollapsiblePanelsState } from '@/components/brand/production/useStagesDependenciesCollapsiblePanels';
import type { StagesDependenciesUrlState } from '@/components/brand/production/useStagesDependenciesUrlState';

/** Срезы состояния подхуков → единый контекст для `buildStagesDependenciesTabContentResult`. */
export type CollectStagesDependenciesTabBuildSlices = {
  panels: StagesCollapsiblePanelsState;
  /** Полный объект URL — в билдер уходят только нужные поля. */
  url: StagesDependenciesUrlState;
  profile: Pick<
    StagesDependenciesTabContentBuildArgs,
    'productionProfileId' | 'productionProfileHint' | 'productionProfileLabel'
  >;
  tabMemos: Pick<
    StagesDependenciesTabContentBuildArgs,
    | 'matrixPhaseOptions'
    | 'audienceFacetChoices'
    | 'seasonFacetChoices'
    | 'l1FacetChoices'
    | 'l2FacetChoices'
    | 'l3FacetChoices'
    | 'fabFacetChoices'
    | 'depsSchemaChunks'
    | 'boardStepRows'
  >;
  pool: Pick<StagesDependenciesTabContentBuildArgs, 'poolArticles' | 'focusArticle' | 'resolvedFocusId'>;
  matrix: Pick<
    StagesDependenciesTabContentBuildArgs,
    | 'matrixStageFilterQ'
    | 'onMatrixSearchChange'
    | 'clearMatrixFilters'
    | 'jumpToMatrixRow'
    | 'matrixStepsFiltered'
    | 'scrollToCurrentMatrixStage'
  >;
  slicePicker: Pick<
    StagesDependenciesTabContentBuildArgs,
    | 'pickerQ'
    | 'setPickerQ'
    | 'expandedPickDetailIds'
    | 'togglePickDetailRow'
    | 'articlesForPickerList'
    | 'skuSelectArticles'
  >;
  view: Pick<
    StagesDependenciesTabContentBuildArgs,
    | 'viewArticles'
    | 'effectiveSkuIds'
    | 'aggregateStatus'
    | 'isBlocked'
    | 'markStatus'
    | 'patchSkuStageLocal'
    | 'appendSkuAuditLineLocal'
    | 'columnStats'
  >;
  skuNav: Pick<
    StagesDependenciesTabContentBuildArgs,
    'openSkuPanelForStep' | 'setMatrixPhaseFilter' | 'consumePendingSkuPanel'
  >;
  preTabs: Pick<
    StagesDependenciesTabContentBuildArgs,
    | 'focusSkuContourGuidance'
    | 'focusSkuMatrixPhase'
    | 'mergedLocalInventoryTools'
    | 'sliceEmptyButCollectionHasArticles'
    | 'localInventoryOpen'
    | 'setLocalInventoryOpen'
  >;
  moduleNav: Pick<
    StagesDependenciesTabContentBuildArgs,
    'buildTransitionUrl' | 'mergeModuleHref' | 'navigateToStageModule'
  >;
  depsPortalFields: Pick<StagesDependenciesTabContentBuildArgs, 'setDepsNodeInfoStepId' | 'depsPortal'>;
  tabProps: Pick<
    StagesDependenciesTabContentBuildArgs,
    | 'collectionArticles'
    | 'flowDoc'
    | 'steps'
    | 'collectionQuery'
    | 'floorHref'
    | 'mergeCollectionQuery'
    | 'setUnifiedDoc'
    | 'getProductionFloorTabTitle'
    | 'collectionFlowKey'
  >;
};

export function collectStagesDependenciesTabBuildArgs(
  s: CollectStagesDependenciesTabBuildSlices
): StagesDependenciesTabContentBuildArgs {
  const { url } = s;
  return {
    ...s.panels,
    router: url.router,
    chainFocusStepId: url.chainFocusStepId,
    stagesSkuPanelParam: url.stagesSkuPanelParam,
    stagesSkuPanelTabParsed: url.stagesSkuPanelTabParsed,
    matrixPhaseParam: url.matrixPhaseParam,
    matrixTextQParam: url.matrixTextQParam,
    facetBundle: url.facetBundle,
    setFocusSku: url.setFocusSku,
    toggleFacetValue: url.toggleFacetValue,
    toggleChainFocus: url.toggleChainFocus,
    clearAllFacets: url.clearAllFacets,
    subTab: url.subTab,
    setSubTab: url.setSubTab,
    contextFilterActive: url.contextFilterActive,
    filterBadgeSub: url.filterBadgeSub,
    ...s.profile,
    ...s.tabMemos,
    ...s.pool,
    ...s.matrix,
    ...s.slicePicker,
    ...s.view,
    ...s.skuNav,
    ...s.preTabs,
    ...s.moduleNav,
    ...s.depsPortalFields,
    ...s.tabProps,
  };
}
