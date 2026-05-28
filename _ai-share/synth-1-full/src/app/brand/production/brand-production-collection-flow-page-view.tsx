'use client';

import { CabinetPageContent } from '@/components/layout/cabinet-page-content';
import { ProductionWorkshop2HubBanner } from '@/components/brand/production/ProductionWorkshop2HubBanner';
import { BrandProductionFloorTabsSection } from '@/app/brand/production/brand-production-floor-tabs-section';
import type { BrandProductionFloorTabsShellProps } from '@/app/brand/production/brand-production-floor-tabs-shell';
import type { ProductionFloorTabId } from '@/lib/production/floor-flow';

export type BrandProductionCollectionFlowPageViewProps = {
  tab: ProductionFloorTabId;
  onTabChange: (value: string) => void;
  shell: BrandProductionFloorTabsShellProps;
};

export function BrandProductionCollectionFlowPageView(
  props: BrandProductionCollectionFlowPageViewProps
) {
  const { tab, onTabChange, shell } = props;

  return (
    <CabinetPageContent
      maxWidth="full"
      className="w-full space-y-6 pb-16"
      data-testid="brand-production-page"
    >
      <ProductionWorkshop2HubBanner />
      <BrandProductionFloorTabsSection tab={tab} onTabChange={onTabChange} shell={shell} />
    </CabinetPageContent>
  );
}
