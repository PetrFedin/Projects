import type { Workshop2StagesDependenciesDepsNodeInfoPortalProps } from '@/components/brand/production/Workshop2StagesDependenciesDepsNodeInfoPortal';
import type { Workshop2StagesDependenciesPreTabsChromeProps } from '@/components/brand/production/Workshop2StagesDependenciesPreTabsChrome';
import type { Workshop2StagesDependenciesTabsSectionProps } from '@/components/brand/production/Workshop2StagesDependenciesTabsSection';
import { buildStagesDependenciesPreTabsChromeProps } from '@/components/brand/production/build-stages-dependencies-pre-tabs-chrome';
import { buildStagesDependenciesTabsSectionProps } from '@/components/brand/production/build-stages-dependencies-tabs-section';
import type { StagesDependenciesTabContentBuildArgs } from '@/components/brand/production/stages-dependencies-tab-content-build-args';

export type { StagesDependenciesTabContentBuildArgs } from '@/components/brand/production/stages-dependencies-tab-content-build-args';

export type StagesDependenciesTabContentResult = {
  preTabs: Workshop2StagesDependenciesPreTabsChromeProps;
  tabs: Workshop2StagesDependenciesTabsSectionProps;
  depsPortal: Workshop2StagesDependenciesDepsNodeInfoPortalProps | null;
};

/** Совпадает с именем из `useStagesDependenciesTabContent` для обратной совместимости импортов. */
export type UseStagesDependenciesTabContentResult = StagesDependenciesTabContentResult;

export function buildStagesDependenciesTabContentResult(
  ctx: StagesDependenciesTabContentBuildArgs
): StagesDependenciesTabContentResult {
  return {
    preTabs: buildStagesDependenciesPreTabsChromeProps(ctx),
    tabs: buildStagesDependenciesTabsSectionProps(ctx),
    depsPortal: ctx.depsPortal,
  };
}
