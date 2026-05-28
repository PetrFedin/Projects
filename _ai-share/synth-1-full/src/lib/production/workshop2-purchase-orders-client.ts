import { buildWorkshop2ApiRequestHeaders } from '@/lib/production/workshop2-api-client-headers';

export type Workshop2PurchaseOrderDto = {
  id: string;
  collectionId: string;
  articleId: string;
  lineRef?: string;
  supplierId?: string;
  qty: number;
  status: 'draft' | 'pending_erp' | 'synced' | 'error';
  erpExternalId?: string;
  syncedAt?: string;
  payload: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
};

function articleBase(collectionId: string, articleId: string): string {
  return `/api/workshop2/articles/${encodeURIComponent(collectionId)}/${encodeURIComponent(articleId)}`;
}

export async function fetchWorkshop2PurchaseOrders(
  collectionId: string,
  articleId: string
): Promise<{ orders: Workshop2PurchaseOrderDto[]; erpConfigured: boolean }> {
  const res = await fetch(`${articleBase(collectionId, articleId)}/purchase-orders`, {
    cache: 'no-store',
    headers: buildWorkshop2ApiRequestHeaders(),
  });
  if (!res.ok) return { orders: [], erpConfigured: false };
  const json = (await res.json()) as {
    purchaseOrders?: Workshop2PurchaseOrderDto[];
    erpConfigured?: boolean;
  };
  return {
    orders: json.purchaseOrders ?? [],
    erpConfigured: Boolean(json.erpConfigured),
  };
}

export async function createWorkshop2PurchaseOrdersApi(
  collectionId: string,
  articleId: string,
  body: Record<string, unknown>
): Promise<{
  ok: boolean;
  purchaseOrders?: Workshop2PurchaseOrderDto[];
  message?: string;
  messageRu?: string;
}> {
  const res = await fetch(`${articleBase(collectionId, articleId)}/purchase-orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...buildWorkshop2ApiRequestHeaders() },
    body: JSON.stringify(body),
  });
  const json = (await res.json()) as {
    ok?: boolean;
    purchaseOrders?: Workshop2PurchaseOrderDto[];
    message?: string;
    messageRu?: string;
  };
  return {
    ok: Boolean(json.ok && res.ok),
    purchaseOrders: json.purchaseOrders,
    message: json.message,
    messageRu: json.messageRu,
  };
}

export async function syncWorkshop2PurchaseOrdersErp(
  collectionId: string,
  articleId: string,
  purchaseOrderIds?: string[]
): Promise<{
  ok: boolean;
  synced?: number;
  failed?: number;
  skipped?: number;
  message?: string;
  erpConfigured?: boolean;
}> {
  const res = await fetch(`${articleBase(collectionId, articleId)}/purchase-orders/sync-erp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...buildWorkshop2ApiRequestHeaders() },
    body: JSON.stringify({ purchaseOrderIds }),
  });
  const json = (await res.json()) as {
    ok?: boolean;
    synced?: number;
    failed?: number;
    skipped?: number;
    message?: string;
    erpConfigured?: boolean;
  };
  return { ok: Boolean(json.ok), ...json };
}
