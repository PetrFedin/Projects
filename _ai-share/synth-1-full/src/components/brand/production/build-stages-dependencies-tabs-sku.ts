import type { StagesDependenciesTabContentBuildArgs } from '@/components/brand/production/stages-dependencies-tab-content-build-args';
import type { Workshop2StagesDependenciesSkuTabProps } from '@/components/brand/production/Workshop2StagesDependenciesSkuTab';

export function buildStagesDependenciesTabsSkuProps(
  ctx: StagesDependenciesTabContentBuildArgs
): Workshop2StagesDependenciesSkuTabProps {
  const {
    skuPanelPinned,
    setSkuPanelPinned,
    skuPanelOpen,
    setSkuPanelOpen,
    skuPanelExpanded,
    poolArticles,
    collectionArticles,
    resolvedFocusId,
    skuSelectArticles,
    focusArticle,
    setFocusSku,
    setSubTab,
    jumpToMatrixRow,
    clearAllFacets,
    flowDoc,
    steps,
    patchSkuStageLocal,
    appendSkuAuditLineLocal,
    mergeModuleHref,
    floorHref,
    mergeCollectionQuery,
    collectionQuery,
    collectionFlowKey,
    stagesSkuPanelParam,
    stagesSkuPanelTabParsed,
    consumePendingSkuPanel,
  } = ctx;

  return {
    skuPanelPinned,
    onSkuPanelPinnedChange: setSkuPanelPinned,
    skuPanelOpen,
    onSkuPanelOpenChange: setSkuPanelOpen,
    skuPanelExpanded,
    poolArticles,
    collectionArticles,
    resolvedFocusId,
    skuSelectArticles,
    focusArticle,
    onSetFocusSku: setFocusSku,
    onSetSubTab: setSubTab,
    onJumpToMatrixRow: jumpToMatrixRow,
    onClearAllFacets: clearAllFacets,
    flowDoc,
    steps,
    onPatchSkuStage: (stepId, patch) => patchSkuStageLocal(resolvedFocusId, stepId, patch),
    onAppendSkuAuditLine: (stepId, line) => appendSkuAuditLineLocal(resolvedFocusId, stepId, line),
    mergeModuleHref,
    floorHref,
    mergeCollectionQuery,
    collectionQuery,
    collectionFlowKey,
    stagesSkuPanelParam,
    stagesSkuPanelTabParsed,
    onConsumedOpenPanelRequest: consumePendingSkuPanel,
  };
}
