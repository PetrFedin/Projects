import { buildWorkshop2ApiRequestHeaders } from '@/lib/production/workshop2-api-client-headers';

function articleBase(collectionId: string, articleId: string): string {
  return `/api/workshop2/articles/${encodeURIComponent(collectionId)}/${encodeURIComponent(articleId)}`;
}

export async function fetchWorkshop2FactoryErpState(collectionId: string, articleId: string) {
  const res = await fetch(`${articleBase(collectionId, articleId)}/factory-erp`, {
    cache: 'no-store',
    headers: buildWorkshop2ApiRequestHeaders(),
  });
  if (!res.ok) return null;
  return (await res.json()) as { ok: boolean; state: Record<string, unknown> };
}

export async function syncWorkshop2FactoryErp(
  collectionId: string,
  articleId: string,
  sku?: string
) {
  const res = await fetch(`${articleBase(collectionId, articleId)}/factory-erp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...buildWorkshop2ApiRequestHeaders() },
    body: JSON.stringify({ sku }),
  });
  return (await res.json()) as { ok: boolean; state?: Record<string, unknown>; messageRu?: string };
}

export async function fetchWorkshop2HubLogisticsInTransitKeys(): Promise<string[]> {
  const res = await fetch('/api/workshop2/logistics/hub-in-transit', {
    cache: 'no-store',
    headers: buildWorkshop2ApiRequestHeaders(),
  });
  if (!res.ok) return [];
  const json = (await res.json()) as { articleKeys?: string[] };
  return Array.isArray(json.articleKeys) ? json.articleKeys : [];
}

export async function fetchWorkshop2LogisticsShipments(collectionId: string, articleId: string) {
  const res = await fetch(`${articleBase(collectionId, articleId)}/logistics`, {
    cache: 'no-store',
    headers: buildWorkshop2ApiRequestHeaders(),
  });
  if (!res.ok) return [];
  const json = (await res.json()) as { shipments?: unknown[] };
  return json.shipments ?? [];
}

export async function createWorkshop2LogisticsShipment(
  collectionId: string,
  articleId: string,
  body: Record<string, unknown>
) {
  const res = await fetch(`${articleBase(collectionId, articleId)}/logistics`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...buildWorkshop2ApiRequestHeaders() },
    body: JSON.stringify(body),
  });
  const json = (await res.json()) as {
    ok?: boolean;
    shipment?: Record<string, unknown>;
    error?: string;
  };
  return { ok: Boolean(json.ok && res.ok), shipment: json.shipment, error: json.error };
}

export async function fetchWorkshop2InspectorReport(
  collectionId: string,
  articleId: string,
  orderId: string
) {
  const res = await fetch(
    `${articleBase(collectionId, articleId)}/inspector-report/${encodeURIComponent(orderId)}`,
    { cache: 'no-store', headers: buildWorkshop2ApiRequestHeaders() }
  );
  if (!res.ok) return null;
  return (await res.json()) as {
    ok: boolean;
    report: { checkedItemIds: string[]; updatedAt?: string } | null;
  };
}

export async function putWorkshop2InspectorReport(
  collectionId: string,
  articleId: string,
  orderId: string,
  body: { checkedItemIds: string[]; notes?: string }
) {
  const res = await fetch(
    `${articleBase(collectionId, articleId)}/inspector-report/${encodeURIComponent(orderId)}`,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...buildWorkshop2ApiRequestHeaders() },
      body: JSON.stringify(body),
    }
  );
  const json = (await res.json()) as { ok?: boolean; report?: { checkedItemIds: string[] } };
  return { ok: Boolean(json.ok && res.ok), report: json.report };
}

export async function simulateWorkshop2NestingApi(
  collectionId: string,
  articleId: string,
  body: Record<string, unknown>
) {
  const res = await fetch(`${articleBase(collectionId, articleId)}/nesting/simulate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...buildWorkshop2ApiRequestHeaders() },
    body: JSON.stringify(body),
  });
  return (await res.json()) as {
    ok?: boolean;
    simulation?: { labelRu?: string; estimatedYieldPct?: number; noteRu?: string };
    source?: string;
    error?: string;
  };
}

export async function fetchWorkshop2ShowroomCampaign(collectionId: string, articleId: string) {
  const res = await fetch(`${articleBase(collectionId, articleId)}/showroom`, {
    cache: 'no-store',
    headers: buildWorkshop2ApiRequestHeaders(),
  });
  if (!res.ok) return null;
  return (await res.json()) as { ok: boolean; campaign: Record<string, unknown> | null };
}

export async function putWorkshop2ShowroomCampaign(
  collectionId: string,
  articleId: string,
  body: Record<string, unknown>
) {
  const res = await fetch(`${articleBase(collectionId, articleId)}/showroom`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...buildWorkshop2ApiRequestHeaders() },
    body: JSON.stringify(body),
  });
  const json = (await res.json()) as { ok?: boolean; campaign?: Record<string, unknown> };
  return { ok: Boolean(json.ok && res.ok), campaign: json.campaign };
}

export async function computeWorkshop2RiskPredictionApi(collectionId: string, articleId: string) {
  const res = await fetch(`${articleBase(collectionId, articleId)}/risk-prediction`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...buildWorkshop2ApiRequestHeaders() },
    body: JSON.stringify({}),
  });
  const json = (await res.json()) as { ok?: boolean; snapshot?: Record<string, unknown> };
  return { ok: Boolean(json.ok && res.ok), snapshot: json.snapshot };
}

export async function ackWorkshop2PlmOutboxDeliveryApi(deliveryId: string) {
  const res = await fetch('/api/workshop2/plm-outbox/ack', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ deliveryId }),
  });
  return (await res.json()) as { ok: boolean; updated?: number };
}
