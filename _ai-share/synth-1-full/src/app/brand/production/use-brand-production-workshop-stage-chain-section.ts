'use client';

import { useMemo } from 'react';
import type { CollectionModuleSaveEvent } from '@/components/brand/production/CollectionStepModuleDialog';
import type { MatrixStepStatus } from '@/lib/production/unified-sku-flow-store';
import {
  buildBrandProductionWorkshopHubHrefs,
  buildCollectionIdQuery,
} from '@/app/brand/production/production-page-collection-hub-hrefs';
import {
  useBrandProductionWorkshopStageChainProps,
  type BrandProductionWorkshopStageChainProps,
} from '@/app/brand/production/use-brand-production-workshop-stage-chain-props';

export function useBrandProductionWorkshopStageChainSection(args: {
  collectionFlowKey: string;
  collectionIdFromQuery: string;
  collectionLabel: string;
  articlesByStage: Record<string, number>;
  aggregateStatus: Record<string, MatrixStepStatus>;
  onAfterModuleSave: (e: CollectionModuleSaveEvent) => void;
}): {
  collectionQuery: string;
  workshopStageChainProps: BrandProductionWorkshopStageChainProps;
} {
  const {
    collectionFlowKey,
    collectionIdFromQuery,
    collectionLabel,
    articlesByStage,
    aggregateStatus,
    onAfterModuleSave,
  } = args;

  const collectionQuery = useMemo(
    () => buildCollectionIdQuery(collectionIdFromQuery),
    [collectionIdFromQuery]
  );

  const workshopHubHrefs = useMemo(
    () => buildBrandProductionWorkshopHubHrefs(collectionIdFromQuery),
    [collectionIdFromQuery]
  );

  const workshopStageChainProps = useBrandProductionWorkshopStageChainProps({
    collectionFlowKey,
    collectionIdFromQuery,
    collectionLabel,
    collectionQuery,
    hubHrefs: workshopHubHrefs,
    articlesByStage,
    aggregateStatus,
    onAfterModuleSave,
  });

  return { collectionQuery, workshopStageChainProps };
}
