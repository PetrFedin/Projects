import type { StagesDependenciesTabContentBuildArgs } from '@/components/brand/production/stages-dependencies-tab-content-build-args';
import { buildStagesDependenciesTabsOpsProps } from '@/components/brand/production/build-stages-dependencies-tabs-ops';
import { buildStagesDependenciesTabsProcessProps } from '@/components/brand/production/build-stages-dependencies-tabs-process';
import { buildStagesDependenciesTabsSkuProps } from '@/components/brand/production/build-stages-dependencies-tabs-sku';
import { buildStagesDependenciesTabsSliceProps } from '@/components/brand/production/build-stages-dependencies-tabs-slice';
import type { Workshop2StagesDependenciesTabsSectionProps } from '@/components/brand/production/Workshop2StagesDependenciesTabsSection';

export function buildStagesDependenciesTabsSectionProps(
  ctx: StagesDependenciesTabContentBuildArgs
): Workshop2StagesDependenciesTabsSectionProps {
  const { subTab, setSubTab, contextFilterActive, filterBadgeSub } = ctx;

  return {
    subTab,
    onSubTabChange: setSubTab,
    contextFilterActive,
    filterBadgeSub,
    slice: buildStagesDependenciesTabsSliceProps(ctx),
    ops: buildStagesDependenciesTabsOpsProps(ctx),
    process: buildStagesDependenciesTabsProcessProps(ctx),
    sku: buildStagesDependenciesTabsSkuProps(ctx),
  };
}
