import 'server-only';

import {
  resolveErpOrderIdFromResponse,
  resolveWorkshop2FactoryErpBaseUrl,
} from '@/lib/server/workshop2-factory-erp-repository';
import {
  updateWorkshop2PurchaseOrderErpSync,
  type Workshop2PurchaseOrderRecord,
} from '@/lib/server/workshop2-purchase-order-repository';

export type Workshop2PurchaseOrderErpCreateAttempt = {
  attempted: boolean;
  ok: boolean;
  mode: 'live_post' | 'journal_only';
  erpExternalId?: string;
  httpStatus?: number;
  error?: string;
  purchaseOrder: Workshop2PurchaseOrderRecord;
};

/**
 * Wave 3 #66/#47: POST PO в ERP сразу при create — erpExternalId только при 2xx + valid body.
 * Без WORKSHOP2_FACTORY_ERP_BASE_URL — journal_only (PO остаётся draft, без fake synced).
 */
export async function postWorkshop2PurchaseOrderToErpOnCreate(input: {
  collectionId: string;
  articleId: string;
  purchaseOrder: Workshop2PurchaseOrderRecord;
}): Promise<Workshop2PurchaseOrderErpCreateAttempt> {
  const baseUrl = resolveWorkshop2FactoryErpBaseUrl();
  if (!baseUrl) {
    return {
      attempted: false,
      ok: false,
      mode: 'journal_only',
      error: 'erp_not_configured',
      purchaseOrder: input.purchaseOrder,
    };
  }

  const payload = {
    collectionId: input.collectionId,
    articleId: input.articleId,
    purchaseOrderId: input.purchaseOrder.id,
    lineRef: input.purchaseOrder.lineRef,
    supplierId: input.purchaseOrder.supplierId,
    qty: input.purchaseOrder.qty,
    source: 'create_po',
    ...input.purchaseOrder.payload,
  };

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
        id: input.purchaseOrder.id,
        collectionId: input.collectionId,
        articleId: input.articleId,
        status: 'error',
        lastError: `erp_http_${res.status}`,
        payloadPatch: { erpCreateAttemptAt: new Date().toISOString() },
      });
      return {
        attempted: true,
        ok: false,
        mode: 'live_post',
        httpStatus: res.status,
        error: `erp_http_${res.status}`,
        purchaseOrder: updated ?? input.purchaseOrder,
      };
    }

    let erpExternalId: string | undefined;
    try {
      const json = (await res.json()) as Record<string, unknown>;
      erpExternalId = resolveErpOrderIdFromResponse(json);
    } catch {
      /* invalid JSON — fail-closed */
    }

    if (!erpExternalId) {
      const updated = await updateWorkshop2PurchaseOrderErpSync({
        id: input.purchaseOrder.id,
        collectionId: input.collectionId,
        articleId: input.articleId,
        status: 'error',
        lastError: 'erp_missing_order_id',
        payloadPatch: { erpCreateAttemptAt: new Date().toISOString() },
      });
      return {
        attempted: true,
        ok: false,
        mode: 'live_post',
        httpStatus: res.status,
        error: 'erp_missing_order_id',
        purchaseOrder: updated ?? input.purchaseOrder,
      };
    }

    const updated = await updateWorkshop2PurchaseOrderErpSync({
      id: input.purchaseOrder.id,
      collectionId: input.collectionId,
      articleId: input.articleId,
      status: 'synced',
      erpExternalId,
      syncedAt: new Date().toISOString(),
      payloadPatch: {
        erpCreateAttemptAt: new Date().toISOString(),
        erpResponseStatus: res.status,
      },
    });

    return {
      attempted: true,
      ok: true,
      mode: 'live_post',
      erpExternalId,
      httpStatus: res.status,
      purchaseOrder: updated ?? input.purchaseOrder,
    };
  } catch (e) {
    const updated = await updateWorkshop2PurchaseOrderErpSync({
      id: input.purchaseOrder.id,
      collectionId: input.collectionId,
      articleId: input.articleId,
      status: 'error',
      lastError: e instanceof Error ? e.message : 'erp_unreachable',
      payloadPatch: { erpCreateAttemptAt: new Date().toISOString() },
    });
    return {
      attempted: true,
      ok: false,
      mode: 'live_post',
      error: e instanceof Error ? e.message : 'erp_unreachable',
      purchaseOrder: updated ?? input.purchaseOrder,
    };
  }
}
