import type {
  ArticleEntity,
  BOMLineEntity,
  FactoryEntity,
  POEntity,
  POStatus,
  PurchaseStatus,
} from '@/lib/brand-production/types';

export type BrandProductionOpsWorkshop2PoStatus = 'draft' | 'pending_erp' | 'synced' | 'error';

export type BrandProductionOpsLocalPoLine = {
  id: string;
  collectionId: string;
  articleId: string;
  sku: string;
  poCode: string;
  factoryId: string;
  factoryName: string;
  qty: number;
  brandPoStatus: POStatus;
  b2bOrderId?: string;
};

export type BrandProductionOpsLocalBomLine = {
  id: string;
  collectionId: string;
  articleId: string;
  sku: string;
  materialCode: string;
  materialName: string;
  qtyPerUnit: number;
  unit: string;
  supplierId: string;
  supplierName: string;
  purchaseStatus: PurchaseStatus;
};

export type BrandProductionOpsLocalSyncPayload = {
  targetCollectionId: string;
  orderId?: string;
  poLines: BrandProductionOpsLocalPoLine[];
  bomLines: BrandProductionOpsLocalBomLine[];
};

export function mapBrandPoStatusToWorkshop2(status: POStatus): BrandProductionOpsWorkshop2PoStatus {
  if (status === 'sent') return 'pending_erp';
  if (status === 'confirmed' || status === 'in_production' || status === 'completed') {
    return 'synced';
  }
  return 'draft';
}

export function mapBrandBomPurchaseStatusToRequisitionStatus(status: PurchaseStatus): string {
  switch (status) {
    case 'ordered':
    case 'in_transit':
      return 'submitted';
    case 'received':
    case 'reserved':
      return 'supplier_confirmed';
    default:
      return 'draft';
  }
}

function resolveTargetArticleId(article: ArticleEntity, targetCollectionId: string): string {
  const sku = article.sku.trim();
  if (targetCollectionId.toUpperCase() === 'SS27' && sku.startsWith('FW26')) {
    return 'demo-ss27-01';
  }
  return sku || article.id;
}

/** Собирает payload sync local → PG (client-safe). */
export function buildBrandProductionOpsLocalSyncPayload(input: {
  targetCollectionId: string;
  orderId?: string;
  sourceCollectionId?: string;
  purchaseOrders: POEntity[];
  bomLines: BOMLineEntity[];
  articles: ArticleEntity[];
  factories: FactoryEntity[];
}): BrandProductionOpsLocalSyncPayload {
  const targetCollectionId = input.targetCollectionId.trim();
  const sourceCollectionId = input.sourceCollectionId?.trim();
  const articlesById = new Map(input.articles.map((a) => [a.id, a]));
  const factoriesById = new Map(input.factories.map((f) => [f.id, f.name]));

  const filteredPos = input.purchaseOrders.filter((po) => {
    if (po.status === 'draft') return false;
    if (sourceCollectionId && po.collectionId !== sourceCollectionId) return false;
    return true;
  });

  const poLines: BrandProductionOpsLocalPoLine[] = [];
  for (const po of filteredPos) {
    const factoryName = factoriesById.get(po.factoryId) ?? po.factoryId;
    for (const line of po.lines) {
      const article = articlesById.get(line.articleId);
      if (!article) continue;
      poLines.push({
        id: `local-po-${po.id}-${line.id}`,
        collectionId: targetCollectionId,
        articleId: resolveTargetArticleId(article, targetCollectionId),
        sku: article.sku,
        poCode: po.code,
        factoryId: po.factoryId,
        factoryName,
        qty: line.totalQty,
        brandPoStatus: po.status,
        b2bOrderId: input.orderId?.trim() || undefined,
      });
    }
  }

  const articleIdsInScope = new Set(
    input.articles
      .filter((a) => !sourceCollectionId || a.collectionId === sourceCollectionId)
      .map((a) => a.id)
  );

  const bomLines: BrandProductionOpsLocalBomLine[] = input.bomLines
    .filter((b) => articleIdsInScope.has(b.articleId))
    .map((b) => {
      const article = articlesById.get(b.articleId)!;
      return {
        id: `local-bom-${b.id}`,
        collectionId: targetCollectionId,
        articleId: resolveTargetArticleId(article, targetCollectionId),
        sku: article.sku,
        materialCode: b.materialCode,
        materialName: b.materialName,
        qtyPerUnit: b.qtyPerUnit,
        unit: b.unit,
        supplierId: b.supplierId,
        supplierName: b.supplierName,
        purchaseStatus: b.purchaseStatus,
      };
    });

  return {
    targetCollectionId,
    orderId: input.orderId?.trim() || undefined,
    poLines,
    bomLines,
  };
}

export function summarizeBrandProductionOpsLocalSyncRu(input: {
  poSynced: number;
  bomSynced: number;
}): string {
  return `Spine: ${input.poSynced} PO строк · ${input.bomSynced} BOM строк синхронизировано.`;
}
