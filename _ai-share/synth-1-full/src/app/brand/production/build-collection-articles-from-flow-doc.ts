import type { CollectionArticle } from '@/app/brand/production/production-page-types';
import type { ProductionPageOrderLike } from '@/app/brand/production/production-page-build-items-for-collection';
import { derivePrimaryOrderRef } from '@/app/brand/production/production-page-utils';
import { COLLECTION_FLOW_STEP_IDS } from '@/app/brand/production/production-page-collection-flow-step-ids';
import { getSkuDataGatedCurrentStepId } from '@/lib/production/stage-data-fill-spec';
import { isSkuStepDone, type CollectionSkuFlowDoc } from '@/lib/production/unified-sku-flow-store';
import { deriveStagesArticleFacets } from '@/lib/production/stages-tab-facets';

/** Артикулы коллекции: этап из чеклиста / матрицы unified flow. */
export function buildCollectionArticlesFromFlowDoc(
  itemsForCollection: readonly ProductionPageOrderLike[],
  flowDocReady: CollectionSkuFlowDoc
): CollectionArticle[] {
  const items = itemsForCollection as Record<string, unknown>[];
  return items.map((item, idx) => {
    const skuKey = String(item.id);
    const currentStageId =
      getSkuDataGatedCurrentStepId(flowDocReady, skuKey, COLLECTION_FLOW_STEP_IDS) ||
      COLLECTION_FLOW_STEP_IDS[0];
    const qty = (item.orderedQuantity as number | undefined) ?? 30;
    const price =
      typeof item.price === 'number' ? item.price : ((item.price as number | undefined) ?? 0);
    const wholesalePrice = price * 0.4;
    const facets = deriveStagesArticleFacets(item, idx);
    const skuStr = (item.sku ?? item.id) as string;
    const seasonStr = (item.season ?? facets.season ?? '') as string;
    const orderFromItem =
      (item.primaryOrderRef as string | undefined) ??
      (item.orderRef as string | undefined) ??
      (item.poNumber as string | undefined);
    return {
      id: skuKey,
      sku: skuStr,
      name: (item.name as string | undefined) ?? 'Без названия',
      currentStageId,
      primaryOrderRef: orderFromItem
        ? String(orderFromItem)
        : derivePrimaryOrderRef(seasonStr, idx),
      forecastQty: qty,
      forecastRevenue: qty * wholesalePrice,
      deliveryWindowId: (item.deliveryWindowId as string | undefined) ?? 'drop1',
      techPackDone: isSkuStepDone(flowDocReady, skuKey, 'tech-pack'),
      samplesDone: isSkuStepDone(flowDocReady, skuKey, 'samples'),
      poDone: isSkuStepDone(flowDocReady, skuKey, 'po'),
      qcDone: isSkuStepDone(flowDocReady, skuKey, 'qc'),
      ready: isSkuStepDone(flowDocReady, skuKey, 'ready-made'),
      ...facets,
    };
  });
}
