'use client';

import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Workshop2StagesDependenciesTabsHeaderCard } from '@/components/brand/production/Workshop2StagesDependenciesTabsHeaderCard';
import { Workshop2StagesDependenciesSlicePanel } from '@/components/brand/production/Workshop2StagesDependenciesSlicePanel';
import { Workshop2StagesDependenciesOpsTab } from '@/components/brand/production/Workshop2StagesDependenciesOpsTab';
import { Workshop2StagesDependenciesProcessTab } from '@/components/brand/production/Workshop2StagesDependenciesProcessTab';
import { Workshop2StagesDependenciesSkuTab } from '@/components/brand/production/Workshop2StagesDependenciesSkuTab';
import type { Workshop2StagesDependenciesSlicePanelProps } from '@/components/brand/production/Workshop2StagesDependenciesSlicePanel';
import type { Workshop2StagesDependenciesOpsTabProps } from '@/components/brand/production/Workshop2StagesDependenciesOpsTab';
import type { Workshop2StagesDependenciesProcessTabProps } from '@/components/brand/production/Workshop2StagesDependenciesProcessTab';
import type { Workshop2StagesDependenciesSkuTabProps } from '@/components/brand/production/Workshop2StagesDependenciesSkuTab';
import {
  normalizeStagesSub,
  type StagesSubTab,
} from '@/components/brand/production/stages-dependencies-tab-content-helpers';

export type Workshop2StagesDependenciesTabsSectionProps = {
  subTab: StagesSubTab;
  onSubTabChange: (tab: StagesSubTab) => void;
  contextFilterActive: boolean;
  filterBadgeSub: StagesSubTab | null;
  slice: Workshop2StagesDependenciesSlicePanelProps;
  ops: Workshop2StagesDependenciesOpsTabProps;
  process: Workshop2StagesDependenciesProcessTabProps;
  sku: Workshop2StagesDependenciesSkuTabProps;
};

export function Workshop2StagesDependenciesTabsSection(
  props: Workshop2StagesDependenciesTabsSectionProps
) {
  const { subTab, onSubTabChange, contextFilterActive, filterBadgeSub, slice, ops, process, sku } =
    props;

  return (
    <Tabs
      value={subTab}
      onValueChange={(v) => onSubTabChange(normalizeStagesSub(v))}
      className="w-full"
    >
      <Workshop2StagesDependenciesTabsHeaderCard
        contextFilterActive={contextFilterActive}
        filterBadgeSub={filterBadgeSub}
      />

      <Workshop2StagesDependenciesSlicePanel {...slice} />

      <TabsContent value="ops" className="mt-4 space-y-4 focus-visible:outline-none">
        <Workshop2StagesDependenciesOpsTab {...ops} />
      </TabsContent>

      <TabsContent value="process" className="mt-4 space-y-4 focus-visible:outline-none">
        <Workshop2StagesDependenciesProcessTab {...process} />
      </TabsContent>

      <TabsContent value="sku" className="mt-4 space-y-4 focus-visible:outline-none">
        <Workshop2StagesDependenciesSkuTab {...sku} />
      </TabsContent>
    </Tabs>
  );
}
