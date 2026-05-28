'use client';

import { useMemo, type Dispatch, type SetStateAction } from 'react';
import type { BrandProductionFloorTabsShellProps } from '@/app/brand/production/brand-production-floor-tabs-shell';
import type { StagesDependenciesTabContentProps } from '@/components/brand/production/StagesDependenciesTabContent';
import type { BrandProductionWorkshopFloorTabPanelProps } from '@/app/brand/production/brand-production-workshop-floor-tab-panel';
import type { ProductionFloorTabId } from '@/lib/production/floor-flow';

export function useBrandProductionFloorTabsShellProps(args: {
  articleContextValid: boolean;
  stagesFilterOn: boolean;
  collectionLabel: string;
  collectionIdFromQuery: string;
  stagesSkuContextId: string;
  stagesSkuContextLine: string | undefined;
  stagesStepContextId: string;
  stagesStepContextTitle: string | undefined;
  skuCatalogStageTitle: string | undefined;
  skuCatalogStagePhase: string | undefined;
  skuCatalogPositionLabel: string | undefined;
  productionFullPageUrl: string;
  floorHref: (tab: ProductionFloorTabId) => string;
  tab: ProductionFloorTabId;
  getProductionFloorTabTitle: (tab: ProductionFloorTabId) => string;
  stagesTabContentProps: StagesDependenciesTabContentProps;
  workshopTabPanelProps: BrandProductionWorkshopFloorTabPanelProps;
  onWorkshopCollectionChange: (id: string) => void;
  suppliesSub: 'vmi' | 'reservation';
  onSuppliesSubChange: Dispatch<SetStateAction<'vmi' | 'reservation'>>;
  sampleSub: 'gold' | 'fit';
  onSampleSubChange: Dispatch<SetStateAction<'gold' | 'fit'>>;
  launchSub: 'daily' | 'skills' | 'video' | 'sub';
  onLaunchSubChange: Dispatch<SetStateAction<'daily' | 'skills' | 'video' | 'sub'>>;
  qualitySub: 'mobile' | 'desk';
  onQualitySubChange: Dispatch<SetStateAction<'mobile' | 'desk'>>;
}): BrandProductionFloorTabsShellProps {
  return useMemo(
    () => ({
      tabsList: {
        articleContextValid: args.articleContextValid,
        stagesFilterOn: args.stagesFilterOn,
      },
      contextBar: {
        className: 'mt-3',
        collectionLabel: args.collectionLabel,
        collectionId: args.collectionIdFromQuery,
        stagesSkuId: args.stagesSkuContextId,
        stagesSkuLine: args.stagesSkuContextLine,
        stagesStepId: args.stagesStepContextId,
        stagesStepTitle: args.stagesStepContextTitle,
        skuCatalogStageTitle: args.skuCatalogStageTitle,
        skuCatalogStagePhase: args.skuCatalogStagePhase,
        skuCatalogPositionLabel: args.skuCatalogPositionLabel,
        fullPageUrl: args.productionFullPageUrl,
        stagesTabHref: args.floorHref('stages'),
        currentTab: args.tab,
        currentTabTitle: args.getProductionFloorTabTitle(args.tab),
      },
      tabPanels: {
        tab: args.tab,
        stagesTabContentProps: args.stagesTabContentProps,
        workshopTabPanelProps: args.workshopTabPanelProps,
        collectionIdFromQuery: args.collectionIdFromQuery,
        onWorkshopCollectionChange: args.onWorkshopCollectionChange,
        suppliesSub: args.suppliesSub,
        onSuppliesSubChange: args.onSuppliesSubChange,
        sampleSub: args.sampleSub,
        onSampleSubChange: args.onSampleSubChange,
        launchSub: args.launchSub,
        onLaunchSubChange: args.onLaunchSubChange,
        qualitySub: args.qualitySub,
        onQualitySubChange: args.onQualitySubChange,
      },
    }),
    [
      args.articleContextValid,
      args.stagesFilterOn,
      args.collectionLabel,
      args.collectionIdFromQuery,
      args.stagesSkuContextId,
      args.stagesSkuContextLine,
      args.stagesStepContextId,
      args.stagesStepContextTitle,
      args.skuCatalogStageTitle,
      args.skuCatalogStagePhase,
      args.skuCatalogPositionLabel,
      args.productionFullPageUrl,
      args.floorHref,
      args.tab,
      args.getProductionFloorTabTitle,
      args.stagesTabContentProps,
      args.workshopTabPanelProps,
      args.onWorkshopCollectionChange,
      args.suppliesSub,
      args.onSuppliesSubChange,
      args.sampleSub,
      args.onSampleSubChange,
      args.launchSub,
      args.onLaunchSubChange,
      args.qualitySub,
      args.onQualitySubChange,
    ]
  );
}
