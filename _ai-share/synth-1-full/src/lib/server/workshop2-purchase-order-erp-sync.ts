import 'server-only';

import { resolveWorkshop2FactoryErpBaseUrl } from '@/lib/server/workshop2-factory-erp-repository';
import {
  listWorkshop2PurchaseOrders,
  updateWorkshop2PurchaseOrderErpSync,
  type Workshop2PurchaseOrderRecord,
} from '@/lib/server/workshop2-purchase-order-repository';
export type Workshop2PurchaseOrderErpSyncResult = {
  synced: number;
  failed: number;
  skipped: number;
  orders: Workshop2PurchaseOrderRecord[];
  erpConfigured: boolean;
  /** true, если sync вызван без WORKSHOP2_FACTORY_ERP_BASE_URL */
  erpNotConfigured?: boolean;
};

/** Отправляет PO в ERP фабрики или ставит в PLM outbox при отсутствии base URL. */
export async function syncWorkshop2PurchaseOrdersToErp(input: {
  collectionId: string;
  articleId: string;
  organizationId?: string;
  purchaseOrderIds?: string[];
}): Promise<Workshop2PurchaseOrderErpSyncResult> {
  const baseUrl = resolveWorkshop2FactoryErpBaseUrl();
  const all = await listWorkshop2PurchaseOrders({
    collectionId: input.collectionId,
    articleId: input.articleId,
    organizationId: input.organizationId,
  });
  const target = input.purchaseOrderIds?.length
    ? all.filter((p) => input.purchaseOrderIds!.includes(p.id))
    : all.filter((p) => p.status === 'draft' || p.status === 'pending_erp' || p.status === 'error');

  let synced = 0;
  let failed = 0;
  let skipped = 0;
  const orders: Workshop2PurchaseOrderRecord[] = [];

  for (const po of target) {
    if (po.status === 'synced' && po.erpExternalId) {
      skipped += 1;
      orders.push(po);
      continue;
    }

    const payload = {
      collectionId: input.collectionId,
      articleId: input.articleId,
      purchaseOrderId: po.id,
      lineRef: po.lineRef,
      supplierId: po.supplierId,
      qty: po.qty,
      ...po.payload,
    };

    if (!baseUrl) {
      const updated = await updateWorkshop2PurchaseOrderErpSync({
        id: po.id,
        collectionId: input.collectionId,
        articleId: input.articleId,
        status: 'error',
        lastError: 'erp_not_configured',
        payloadPatch: {
          erpSyncStatus: 'not_configured',
          hint: 'Задайте WORKSHOP2_FACTORY_ERP_BASE_URL для POST /purchase-orders',
        },
      });
      if (updated) orders.push(updated);
      failed += 1;
      continue;
    }

    try {
      const url = baseUrl.replace(/\/$/, '') + '/purchase-orders';
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(12_000),
      });
      if (!res.ok) {
        const updated = await updateWorkshop2PurchaseOrderErpSync({
          id: po.id,
          collectionId: input.collectionId,
          articleId: input.articleId,
          status: 'error',
          lastError: `erp_http_${res.status}`,
        });
        if (updated) orders.push(updated);
        failed += 1;
        continue;
      }
      let erpExternalId: string | undefined;
      try {
        const json = (await res.json()) as {
          id?: string;
          externalId?: string;
          erpOrderId?: string;
        };
        erpExternalId = json.erpOrderId ?? json.externalId ?? json.id;
      } catch {
        /* без erpOrderId — ошибка контракта, не подставляем фиктивный id */
      }
      if (!erpExternalId) {
        const updated = await updateWorkshop2PurchaseOrderErpSync({
          id: po.id,
          collectionId: input.collectionId,
          articleId: input.articleId,
          status: 'error',
          lastError: 'erp_missing_order_id',
        });
        if (updated) orders.push(updated);
        failed += 1;
        continue;
      }
      const updated = await updateWorkshop2PurchaseOrderErpSync({
        id: po.id,
        collectionId: input.collectionId,
        articleId: input.articleId,
        status: 'synced',
        erpExternalId,
        syncedAt: new Date().toISOString(),
        payloadPatch: { erpResponseStatus: res.status },
      });
      if (updated) orders.push(updated);
      synced += 1;
    } catch (e) {
      const updated = await updateWorkshop2PurchaseOrderErpSync({
        id: po.id,
        collectionId: input.collectionId,
        articleId: input.articleId,
        status: 'error',
        lastError: e instanceof Error ? e.message : 'erp_unreachable',
      });
      if (updated) orders.push(updated);
      failed += 1;
    }
  }

  return {
    synced,
    failed,
    skipped,
    orders,
    erpConfigured: Boolean(baseUrl),
    erpNotConfigured: !baseUrl && failed > 0,
  };
}
