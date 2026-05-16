'use client';

import { TabsContent } from '@/components/ui/tabs';
import type { StagesDependenciesTabContentProps } from '@/components/brand/production/StagesDependenciesTabContent';
import { cn } from '@/lib/utils';
import { cabinetSurface } from '@/lib/ui/cabinet-surface';
import type { ProductionFloorTabId } from '@/lib/production/floor-flow';
import {
  BrandProductionLiveFloorPanel,
  BrandProductionStagesFloorPanel,
} from '@/app/brand/production/brand-production-stages-live-floor-panels';
import {
  BrandProductionLaunchFloorPanel,
  BrandProductionNestingFloorPanel,
  BrandProductionOpsFloorPanel,
  BrandProductionPlanFloorPanel,
  BrandProductionQualityFloorPanel,
  BrandProductionReceiptFloorPanel,
  BrandProductionSampleFloorPanel,
  BrandProductionSuppliesFloorPanel,
} from '@/app/brand/production/brand-production-floor-lazy-tab-panels';
import {
  BrandProductionWorkshopFloorTabPanel,
  type BrandProductionWorkshopFloorTabPanelProps,
} from '@/app/brand/production/brand-production-workshop-floor-tab-panel';

const floorTabPanelClassName = cn(cabinetSurface.cabinetProfileTabPanel, 'mt-4');

export type BrandProductionFloorTabPanelsProps = {
  tab: ProductionFloorTabId;
  stagesTabContentProps: StagesDependenciesTabContentProps;
  workshopTabPanelProps: BrandProductionWorkshopFloorTabPanelProps;
  collectionIdFromQuery: string;
  onWorkshopCollectionChange: (id: string) => void;
  suppliesSub: 'vmi' | 'reservation';
  onSuppliesSubChange: (v: 'vmi' | 'reservation') => void;
  sampleSub: 'gold' | 'fit';
  onSampleSubChange: (v: 'gold' | 'fit') => void;
  launchSub: 'daily' | 'skills' | 'video' | 'sub';
  onLaunchSubChange: (v: 'daily' | 'skills' | 'video' | 'sub') => void;
  qualitySub: 'mobile' | 'desk';
  onQualitySubChange: (v: 'mobile' | 'desk') => void;
};

export function BrandProductionFloorTabPanels(props: BrandProductionFloorTabPanelsProps) {
  const {
    tab,
    stagesTabContentProps,
    workshopTabPanelProps,
    collectionIdFromQuery,
    onWorkshopCollectionChange,
    suppliesSub,
    onSuppliesSubChange,
    sampleSub,
    onSampleSubChange,
    launchSub,
    onLaunchSubChange,
    qualitySub,
    onQualitySubChange,
  } = props;

  return (
    <>
      <TabsContent value="stages" className={floorTabPanelClassName}>
        <BrandProductionStagesFloorPanel isActive={tab === 'stages'} stagesProps={stagesTabContentProps} />
      </TabsContent>

      <TabsContent value="live" className={floorTabPanelClassName}>
        <BrandProductionLiveFloorPanel
          isActive={tab === 'live'}
          workshopCollectionId={collectionIdFromQuery}
          onWorkshopCollectionChange={onWorkshopCollectionChange}
        />
      </TabsContent>

      <TabsContent value="workshop" className={floorTabPanelClassName}>
        <BrandProductionWorkshopFloorTabPanel {...workshopTabPanelProps} />
      </TabsContent>

      <TabsContent value="supplies" className={floorTabPanelClassName}>
        <BrandProductionSuppliesFloorPanel
          isActive={tab === 'supplies'}
          suppliesSub={suppliesSub}
          onSuppliesSubChange={onSuppliesSubChange}
        />
      </TabsContent>

      <TabsContent value="sample" className={floorTabPanelClassName}>
        <BrandProductionSampleFloorPanel
          isActive={tab === 'sample'}
          sampleSub={sampleSub}
          onSampleSubChange={onSampleSubChange}
        />
      </TabsContent>

      <TabsContent value="plan" className={floorTabPanelClassName}>
        <BrandProductionPlanFloorPanel isActive={tab === 'plan'} />
      </TabsContent>

      <TabsContent value="nesting" className={floorTabPanelClassName}>
        <BrandProductionNestingFloorPanel isActive={tab === 'nesting'} />
      </TabsContent>

      <TabsContent value="launch" className={floorTabPanelClassName}>
        <BrandProductionLaunchFloorPanel
          isActive={tab === 'launch'}
          launchSub={launchSub}
          onLaunchSubChange={onLaunchSubChange}
        />
      </TabsContent>

      <TabsContent value="quality" className={floorTabPanelClassName}>
        <BrandProductionQualityFloorPanel
          isActive={tab === 'quality'}
          qualitySub={qualitySub}
          onQualitySubChange={onQualitySubChange}
        />
      </TabsContent>

      <TabsContent value="receipt" className={floorTabPanelClassName}>
        <BrandProductionReceiptFloorPanel isActive={tab === 'receipt'} />
      </TabsContent>

      <TabsContent value="ops" className={floorTabPanelClassName}>
        <BrandProductionOpsFloorPanel isActive={tab === 'ops'} />
      </TabsContent>
    </>
  );
}
