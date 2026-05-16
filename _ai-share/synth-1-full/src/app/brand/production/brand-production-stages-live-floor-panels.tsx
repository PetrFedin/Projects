'use client';

import {
  StagesDependenciesTabContent,
  type StagesDependenciesTabContentProps,
} from '@/components/brand/production/StagesDependenciesTabContent';
import { LiveProcessPageBody } from '@/app/brand/production/production-page-floor-lazy';

export function BrandProductionStagesFloorPanel(props: {
  isActive: boolean;
  stagesProps: StagesDependenciesTabContentProps;
}) {
  if (!props.isActive) return null;
  return (
    <StagesDependenciesTabContent
      key={props.stagesProps.collectionFlowKey}
      {...props.stagesProps}
    />
  );
}

export function BrandProductionLiveFloorPanel(props: {
  isActive: boolean;
  workshopCollectionId: string;
  onWorkshopCollectionChange: (id: string) => void;
}) {
  if (!props.isActive) return null;
  return (
    <LiveProcessPageBody
      processId="production"
      embedded
      workshopCollectionId={props.workshopCollectionId}
      onWorkshopCollectionChange={props.onWorkshopCollectionChange}
    />
  );
}
