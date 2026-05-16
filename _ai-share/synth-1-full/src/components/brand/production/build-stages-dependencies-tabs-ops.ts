import type { StagesDependenciesTabContentBuildArgs } from '@/components/brand/production/stages-dependencies-tab-content-build-args';
import type { Workshop2StagesDependenciesOpsTabProps } from '@/components/brand/production/Workshop2StagesDependenciesOpsTab';

export function buildStagesDependenciesTabsOpsProps(
  ctx: StagesDependenciesTabContentBuildArgs
): Workshop2StagesDependenciesOpsTabProps {
  const {
    boardPinned,
    setBoardPinned,
    boardOpen,
    setBoardOpen,
    boardExpanded,
    boardStepRows,
    columnStats,
    isBlocked,
    productionProfileId,
    aggregateStatus,
    focusArticle,
    flowDoc,
    mergeCollectionQuery,
    collectionQuery,
    floorHref,
    navigateToStageModule,
    openSkuPanelForStep,
    router,
    buildTransitionUrl,
    setSubTab,
    setFocusSku,
  } = ctx;

  return {
    boardPinned,
    onBoardPinnedChange: setBoardPinned,
    boardOpen,
    onBoardOpenChange: setBoardOpen,
    boardExpanded,
    boardStepRows,
    columnStats,
    isBlocked,
    productionProfileId,
    aggregateStatus,
    focusArticle,
    flowDoc,
    mergeCollectionQuery,
    collectionQuery,
    floorHref,
    navigateToStageModule,
    openSkuPanelForStep,
    routerPush: (href) => router.push(href),
    buildTransitionUrl,
    onSetSubTab: setSubTab,
    onSetFocusSku: setFocusSku,
  };
}
