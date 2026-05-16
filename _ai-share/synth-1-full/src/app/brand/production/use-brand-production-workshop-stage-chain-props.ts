'use client';

import { useMemo, type ComponentProps } from 'react';
import { CollectionWorkshopStageChain } from '@/components/brand/production/CollectionWorkshopStageChain';
import type { CollectionModuleSaveEvent } from '@/components/brand/production/CollectionStepModuleDialog';
import type { MatrixStepStatus } from '@/lib/production/unified-sku-flow-store';
import { ROUTES } from '@/lib/routes';
import type { BrandProductionWorkshopHubHrefs } from '@/app/brand/production/production-page-collection-hub-hrefs';

export type BrandProductionWorkshopStageChainProps = Omit<
  ComponentProps<typeof CollectionWorkshopStageChain>,
  'steps'
>;

export function useBrandProductionWorkshopStageChainProps(args: {
  collectionFlowKey: string;
  collectionIdFromQuery: string;
  collectionLabel: string;
  collectionQuery: string;
  hubHrefs: BrandProductionWorkshopHubHrefs;
  articlesByStage: Record<string, number>;
  aggregateStatus: Record<string, MatrixStepStatus>;
  onAfterModuleSave: (e: CollectionModuleSaveEvent) => void;
}): BrandProductionWorkshopStageChainProps {
  const {
    collectionFlowKey,
    collectionIdFromQuery,
    collectionLabel,
    collectionQuery,
    hubHrefs,
    articlesByStage,
    aggregateStatus,
    onAfterModuleSave,
  } = args;

  return useMemo(
    () => ({
      collectionFlowKey,
      collectionId: collectionIdFromQuery,
      collectionLabel,
      pimCollectionHref:
        collectionQuery ? `${ROUTES.brand.products}${collectionQuery}` : ROUTES.brand.products,
      workshopCollectionHref:
        collectionQuery ? `/brand/production${collectionQuery}` : '/brand/production',
      budgetActualHref:
        collectionQuery
          ? `${ROUTES.brand.budgetActual}${collectionQuery}`
          : ROUTES.brand.budgetActual,
      materialsHref:
        collectionQuery
          ? `${ROUTES.brand.materials}${collectionQuery}`
          : ROUTES.brand.materials,
      mediaHref:
        collectionQuery ? `${ROUTES.brand.media}${collectionQuery}` : ROUTES.brand.media,
      techPackHref:
        collectionQuery
          ? `${ROUTES.brand.productionTechPackStyle('new')}${collectionQuery}`
          : ROUTES.brand.productionTechPackStyle('new'),
      liveProcessHref: hubHrefs.liveProcessHref,
      suppliesFloorHref: hubHrefs.suppliesFloorHref,
      sampleFloorHref: hubHrefs.sampleFloorHref,
      workshopFloorTabHrefs: hubHrefs.workshopFloorTabHrefs,
      b2bLinesheetsHref: hubHrefs.b2bLinesheetsHref,
      factoriesHref: hubHrefs.factoriesHref,
      warehouseHref: hubHrefs.warehouseHref,
      b2bShipmentsHref: hubHrefs.b2bShipmentsHref,
      liveB2bHref: hubHrefs.liveB2bHref,
      esgHref: hubHrefs.esgHref,
      chainDeepLinkHrefs: hubHrefs.chainDeepLinkHrefs,
      articlesByStage,
      aggregateStatus,
      onAfterModuleSave,
      hrefWithCollection: (step) => {
        if (!step.href) return null;
        return collectionQuery
          ? `${step.href}${step.href.includes('?') ? '&' : '?'}${collectionQuery.slice(1)}`
          : step.href;
      },
    }),
    [
      collectionFlowKey,
      collectionIdFromQuery,
      collectionLabel,
      collectionQuery,
      hubHrefs,
      articlesByStage,
      aggregateStatus,
      onAfterModuleSave,
    ]
  );
}
