'use client';

import { TooltipProvider } from '@/components/ui/tooltip';
import {
  STAGES_SKU_PARAM,
  STAGES_WORK_SKU_PARAM,
} from '@/lib/production/stages-url';
import { Workshop2StagesDependenciesDepsNodeInfoPortal } from '@/components/brand/production/Workshop2StagesDependenciesDepsNodeInfoPortal';
import { Workshop2StagesDependenciesPreTabsChrome } from '@/components/brand/production/Workshop2StagesDependenciesPreTabsChrome';
import { Workshop2StagesDependenciesTabsSection } from '@/components/brand/production/Workshop2StagesDependenciesTabsSection';
import {
  useStagesDependenciesTabContent,
  type StagesDependenciesTabContentProps,
} from '@/components/brand/production/useStagesDependenciesTabContent';

export { STAGES_SKU_PARAM, STAGES_WORK_SKU_PARAM };

export { StagesContextFilterPulseIcon } from '@/components/brand/production/stages-dependencies-tab-panel-chrome';

export type {
  StagesLocalInventoryTools,
  StagesLocalInventoryToolsInput,
  StagesSubTab,
  StagesTabArticle,
} from '@/components/brand/production/stages-dependencies-tab-content-helpers';

export type { StagesDependenciesTabContentProps } from '@/components/brand/production/useStagesDependenciesTabContent';

export function StagesDependenciesTabContent(props: StagesDependenciesTabContentProps) {
  const { preTabs, tabs, depsPortal } = useStagesDependenciesTabContent(props);

  return (
    <TooltipProvider delayDuration={200} skipDelayDuration={400}>
      <div className="space-y-4">
        <Workshop2StagesDependenciesPreTabsChrome {...preTabs} />
        <Workshop2StagesDependenciesTabsSection {...tabs} />
        {depsPortal ? <Workshop2StagesDependenciesDepsNodeInfoPortal {...depsPortal} /> : null}
      </div>
    </TooltipProvider>
  );
}
