'use client';

import type { ComponentProps } from 'react';
import {
  BrandProductionFloorTabPanels,
  type BrandProductionFloorTabPanelsProps,
} from '@/app/brand/production/brand-production-floor-tab-panels';
import { BrandProductionFloorTabsList } from '@/app/brand/production/brand-production-floor-tabs-list';
import { ProductionFloorContextBar } from '@/components/brand/production/ProductionFloorContextBar';

export type BrandProductionFloorTabsShellProps = {
  tabsList: ComponentProps<typeof BrandProductionFloorTabsList>;
  contextBar: ComponentProps<typeof ProductionFloorContextBar>;
  tabPanels: BrandProductionFloorTabPanelsProps;
};

export function BrandProductionFloorTabsShell(props: BrandProductionFloorTabsShellProps) {
  return (
    <>
      <BrandProductionFloorTabsList {...props.tabsList} />
      <ProductionFloorContextBar {...props.contextBar} />
      <BrandProductionFloorTabPanels {...props.tabPanels} />
    </>
  );
}
