'use client';

import { Tabs } from '@/components/ui/tabs';
import { TooltipProvider } from '@/components/ui/tooltip';
import type { ProductionFloorTabId } from '@/lib/production/floor-flow';
import {
  BrandProductionFloorTabsShell,
  type BrandProductionFloorTabsShellProps,
} from '@/app/brand/production/brand-production-floor-tabs-shell';

export type BrandProductionFloorTabsSectionProps = {
  tab: ProductionFloorTabId;
  onTabChange: (value: string) => void;
  /** Совпадает с прежним `TooltipProvider` на странице производства (мс). */
  tooltipDelayDuration?: number;
  shell: BrandProductionFloorTabsShellProps;
};

export function BrandProductionFloorTabsSection(props: BrandProductionFloorTabsSectionProps) {
  const { tab, onTabChange, tooltipDelayDuration = 280, shell } = props;

  return (
    <TooltipProvider delayDuration={tooltipDelayDuration}>
      <Tabs value={tab} onValueChange={onTabChange} className="w-full">
        <BrandProductionFloorTabsShell {...shell} />
      </Tabs>
    </TooltipProvider>
  );
}
