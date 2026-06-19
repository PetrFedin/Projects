import 'server-only';

import { PLATFORM_CORE_DEMO } from '@/lib/platform-core-hub-matrix';
import {
  type BrandProductionOpsSnapshot,
  workshop2PoToBrandProductionOpsRow,
  workshop2RequisitionToBrandProductionOpsBomRow,
} from '@/lib/production/brand-production-ops-spine';
import { listWorkshop2MaterialRequisitionsByCollection, createWorkshop2MaterialRequisition, upsertWorkshop2MaterialRequisition } from '@/lib/server/workshop2-material-requisition-repository';
import {
  mapBrandBomPurchaseStatusToRequisitionStatus,
  mapBrandPoStatusToWorkshop2,
} from '@/lib/production/brand-production-ops-local-sync';
import {
  listWorkshop2PurchaseOrdersByCollection,
  upsertWorkshop2PurchaseOrder,
} from '@/lib/server/workshop2-purchase-order-repository';
import { isWorkshop2PostgresEnabled } from '@/lib/server/workshop2-pg-pool';

async function seedSs27BrandProductionOps(collectionId: string): Promise<void> {
  const orderId = PLATFORM_CORE_DEMO.demoOrderId;
  const articles = [PLATFORM_CORE_DEMO.demoArticleId, 'demo-ss27-02'];

  await upsertWorkshop2PurchaseOrder({
    id: 'po-ss27-ops-101',
    collectionId,
    articleId: articles[0]!,
    qty: 480,
    status: 'synced',
    supplierId: 'fab-north',
    lineRef: 'PO-SS27-101',
    payload: {
      poCode: 'PO-SS27-101',
      sku: articles[0],
      factoryName: 'Factory «North»',
      b2bOrderId: orderId,
      source: 'brand_ops_seed',
    },
  });
  await upsertWorkshop2PurchaseOrder({
    id: 'po-ss27-ops-102',
    collectionId,
    articleId: articles[1]!,
    qty: 220,
    status: 'pending_erp',
    supplierId: 'sup-fabric-tr',
    lineRef: 'PO-SS27-102',
    payload: {
      poCode: 'PO-SS27-102',
      sku: articles[1],
      supplierName: 'Fabric TR',
      b2bOrderId: orderId,
      source: 'brand_ops_seed',
    },
  });

  await createWorkshop2MaterialRequisition({
    collectionId,
    articleId: articles[0]!,
    bomLineRef: 'shell:main-fabric',
    materialLabel: 'Shell · main fabric',
    quantity: 480,
    unit: 'm',
    payload: { source: 'brand_ops_seed', purchaseStatus: 'ordered' },
  });
  await createWorkshop2MaterialRequisition({
    collectionId,
    articleId: articles[0]!,
    bomLineRef: 'trim:zip-ykk',
    materialLabel: 'Trim · YKK zip',
    quantity: 480,
    unit: 'pcs',
    payload: { source: 'brand_ops_seed', purchaseStatus: 'in_transit' },
  });
}

export async function getBrandProductionOpsSnapshot(input: {
  collectionId: string;
  orderId?: string;
  organizationId?: string;
}): Promise<BrandProductionOpsSnapshot> {
  const collectionId = input.collectionId.trim();
  const orderId = input.orderId?.trim();

  let pos = await listWorkshop2PurchaseOrdersByCollection({
    collectionId,
    organizationId: input.organizationId,
  });
  let reqs = await listWorkshop2MaterialRequisitionsByCollection({
    collectionId,
    organizationId: input.organizationId,
  });

  if (pos.length === 0 && reqs.length === 0 && collectionId.toUpperCase() === 'SS27') {
    await seedSs27BrandProductionOps(collectionId);
    pos = await listWorkshop2PurchaseOrdersByCollection({
      collectionId,
      organizationId: input.organizationId,
    });
    reqs = await listWorkshop2MaterialRequisitionsByCollection({
      collectionId,
      organizationId: input.organizationId,
    });
  }

  let poRows = pos.map(workshop2PoToBrandProductionOpsRow);
  let bomRows = reqs.map(workshop2RequisitionToBrandProductionOpsBomRow);

  if (orderId) {
    poRows = poRows.filter((r) => !r.b2bOrderId || r.b2bOrderId === orderId);
  }

  const storageMode: BrandProductionOpsSnapshot['storageMode'] =
    poRows.length || bomRows.length
      ? isWorkshop2PostgresEnabled()
        ? 'pg'
        : 'file'
      : 'empty';

  return { poRows, bomRows, storageMode };
}

export async function syncBrandProductionOpsFromLocal(input: {
  payload: import('@/lib/production/brand-production-ops-local-sync').BrandProductionOpsLocalSyncPayload;
  organizationId?: string;
}): Promise<{ poSynced: number; bomSynced: number; snapshot: BrandProductionOpsSnapshot }> {
  const { payload } = input;
  const org = input.organizationId ?? 'org-brand-001';
  let poSynced = 0;
  let bomSynced = 0;

  for (const line of payload.poLines) {
    await upsertWorkshop2PurchaseOrder({
      id: line.id,
      collectionId: line.collectionId,
      articleId: line.articleId,
      supplierId: line.factoryId,
      lineRef: line.poCode,
      qty: line.qty,
      status: mapBrandPoStatusToWorkshop2(line.brandPoStatus) as import('@/lib/server/workshop2-purchase-order-repository').Workshop2PurchaseOrderStatus,
      payload: {
        poCode: line.poCode,
        sku: line.sku,
        factoryName: line.factoryName,
        b2bOrderId: line.b2bOrderId ?? payload.orderId,
        brandPoStatus: line.brandPoStatus,
        source: 'brand_ops_local_sync',
      },
    });
    poSynced += 1;
  }

  for (const line of payload.bomLines) {
    await upsertWorkshop2MaterialRequisition({
      id: line.id,
      collectionId: line.collectionId,
      articleId: line.articleId,
      bomLineRef: `${line.materialCode}:${line.materialName}`.slice(0, 120),
      materialLabel: `${line.materialCode} ${line.materialName}`.trim(),
      quantity: line.qtyPerUnit,
      unit: line.unit,
      status: mapBrandBomPurchaseStatusToRequisitionStatus(line.purchaseStatus),
      organizationId: org,
      payload: {
        sku: line.sku,
        supplierId: line.supplierId,
        supplierName: line.supplierName,
        purchaseStatus: line.purchaseStatus,
        source: 'brand_ops_local_sync',
      },
    });
    bomSynced += 1;
  }

  const snapshot = await getBrandProductionOpsSnapshot({
    collectionId: payload.targetCollectionId,
    orderId: payload.orderId,
    organizationId: org,
  });

  return { poSynced, bomSynced, snapshot };
}
