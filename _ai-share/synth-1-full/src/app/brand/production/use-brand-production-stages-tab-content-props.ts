'use client';

import { useMemo, type Dispatch, type SetStateAction } from 'react';
import type { StagesDependenciesTabContentProps } from '@/components/brand/production/StagesDependenciesTabContent';
import type { StagesLocalInventoryToolsInput } from '@/components/brand/production/StagesDependenciesTabContent';
import type { CollectionArticle } from '@/app/brand/production/production-page-types';
import type { CollectionSkuFlowDoc } from '@/lib/production/unified-sku-flow-store';
import type { CollectionStep } from '@/lib/production/collection-steps-catalog';
import type { ProductionFloorTabId } from '@/lib/production/floor-flow';
import type { ImportLocalInventoryResult } from '@/app/brand/production/use-brand-production-local-inventory';

export function useBrandProductionStagesTabContentProps(args: {
  collectionArticles: CollectionArticle[];
  flowDocReady: CollectionSkuFlowDoc;
  steps: readonly CollectionStep[];
  collectionQuery: string;
  floorHref: (tab: ProductionFloorTabId) => string;
  mergeCollectionQuery: (href: string, collectionQuery: string) => string;
  setUnifiedDoc: Dispatch<SetStateAction<CollectionSkuFlowDoc>>;
  getProductionFloorTabTitle: (tab: ProductionFloorTabId) => string;
  collectionFlowKey: string;
  collectionIdFromQuery: string;
  localRemovableArticles: { id: string; sku: string }[];
  isUserDefinedCollection: boolean;
  pushLocalArticle: (skuCode: string, displayName?: string) => boolean;
  pushUserCollection: (rawId: string, displayName: string) => void;
  removeLocalArticle: (articleId: string) => void;
  removeCurrentUserCollection: () => void;
  exportLocalInventory: () => void;
  importLocalInventory: (jsonText: string, replaceAll: boolean) => ImportLocalInventoryResult;
  isLocalSkuDuplicate: (skuCode: string) => boolean;
  exportUnifiedFlowJson: () => void;
}): StagesDependenciesTabContentProps {
  return useMemo(
    () => ({
      collectionArticles: args.collectionArticles,
      flowDoc: args.flowDocReady,
      steps: [...args.steps],
      collectionQuery: args.collectionQuery,
      floorHref: args.floorHref,
      mergeCollectionQuery: args.mergeCollectionQuery,
      setUnifiedDoc: args.setUnifiedDoc,
      getProductionFloorTabTitle: args.getProductionFloorTabTitle,
      collectionFlowKey: args.collectionFlowKey,
      localInventoryTools: {
        collectionId: args.collectionIdFromQuery,
        totalArticlesInCollection: args.collectionArticles.length,
        localRemovableArticles: args.localRemovableArticles,
        isUserDefinedCollection: args.isUserDefinedCollection,
        onAddArticle: args.pushLocalArticle,
        onCreateCollection: args.pushUserCollection,
        onRemoveLocalArticle: args.removeLocalArticle,
        onRemoveUserCollection: args.removeCurrentUserCollection,
        onExportInventory: args.exportLocalInventory,
        onImportInventory: args.importLocalInventory,
        isSkuDuplicate: args.isLocalSkuDuplicate,
        onExportUnifiedFlow: args.exportUnifiedFlowJson,
      } satisfies StagesLocalInventoryToolsInput,
    }),
    [
      args.collectionArticles,
      args.flowDocReady,
      args.steps,
      args.collectionQuery,
      args.floorHref,
      args.mergeCollectionQuery,
      args.setUnifiedDoc,
      args.getProductionFloorTabTitle,
      args.collectionFlowKey,
      args.collectionIdFromQuery,
      args.localRemovableArticles,
      args.isUserDefinedCollection,
      args.pushLocalArticle,
      args.pushUserCollection,
      args.removeLocalArticle,
      args.removeCurrentUserCollection,
      args.exportLocalInventory,
      args.importLocalInventory,
      args.isLocalSkuDuplicate,
      args.exportUnifiedFlowJson,
    ]
  );
}
