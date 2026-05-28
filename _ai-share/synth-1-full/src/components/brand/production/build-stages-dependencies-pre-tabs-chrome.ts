import { patchProductionProfile } from '@/lib/production/unified-sku-flow-store';
import type { StagesDependenciesTabContentBuildArgs } from '@/components/brand/production/stages-dependencies-tab-content-build-args';
import type { Workshop2StagesDependenciesPreTabsChromeProps } from '@/components/brand/production/Workshop2StagesDependenciesPreTabsChrome';

export function buildStagesDependenciesPreTabsChromeProps(
  ctx: StagesDependenciesTabContentBuildArgs
): Workshop2StagesDependenciesPreTabsChromeProps {
  const {
    sliceEmptyButCollectionHasArticles,
    mergedLocalInventoryTools,
    clearAllFacets,
    profilePanelOpen,
    setProfilePanelOpen,
    productionProfileLabel,
    productionProfileHint,
    productionProfileId,
    setUnifiedDoc,
    localInventoryOpen,
    setLocalInventoryOpen,
    focusArticle,
    steps,
    focusSkuContourGuidance,
    jumpToMatrixRow,
  } = ctx;

  return {
    sliceEmptyBanner:
      sliceEmptyButCollectionHasArticles && mergedLocalInventoryTools
        ? {
            totalArticlesInCollection: mergedLocalInventoryTools.totalArticlesInCollection,
          }
        : null,
    onClearSliceFilters: clearAllFacets,
    profilePanelOpen,
    onProfilePanelOpen: () => setProfilePanelOpen(true),
    onProfilePanelClose: () => setProfilePanelOpen(false),
    productionProfileLabel,
    productionProfileHint,
    productionProfileId,
    onProductionProfileChange: (v) => setUnifiedDoc((d) => patchProductionProfile(d, v)),
    mergedLocalInventoryTools,
    localInventoryOpen,
    onToggleLocalInventoryOpen: () => setLocalInventoryOpen((o) => !o),
    focusArticle,
    steps,
    focusSkuContourGuidance,
    onJumpToMatrixRow: jumpToMatrixRow,
  };
}
