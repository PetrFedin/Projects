/**
 * Клиент API заказа образца и handoff-readiness.
 */
import type {
  Workshop2GoldSampleStatus,
  Workshop2SampleOrderSizes,
  Workshop2SampleOrderStatus,
  Workshop2NestingRequest,
} from '@/lib/production/workshop2-dossier-phase1.types';
import type { Workshop2SampleGoodsMovementStatus } from '@/lib/production/workshop2-sample-goods-movement';
import type { Workshop2HandoffReadinessResult } from '@/lib/production/workshop2-handoff-readiness';
import {
  formatWorkshop2GateChecksForUi,
  parseWorkshop2ApiGateChecksFromJson,
  type Workshop2ApiGateCheck,
} from '@/lib/production/workshop2-api-gate-messages';
import { buildWorkshop2ApiRequestHeaders } from '@/lib/production/workshop2-api-client-headers';

export type { Workshop2ApiGateCheck };

export type Workshop2CreateSampleOrderResult =
  | { ok: true; order: Workshop2SampleOrderDto }
  | {
      ok: false;
      status: number;
      error?: string;
      messageRu?: string;
      checks?: Workshop2ApiGateCheck[];
    };

export type Workshop2SampleOrderDto = {
  id: string;
  collectionId: string;
  articleId: string;
  status: Workshop2SampleOrderStatus;
  movementStatus?: Workshop2SampleGoodsMovementStatus;
  movementLog?: { at: string; from: string; to: string; actor?: string }[];
  contractorId?: string;
  dueDate?: string;
  sizes: Workshop2SampleOrderSizes;
  quantity: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  nestingRequest?: Workshop2NestingRequest;
};

export async function fetchWorkshop2SampleOrders(
  collectionId: string,
  articleId: string
): Promise<Workshop2SampleOrderDto[]> {
  const res = await fetch(
    `/api/workshop2/articles/${encodeURIComponent(collectionId)}/${encodeURIComponent(articleId)}/sample-order`,
    { cache: 'no-store', headers: buildWorkshop2ApiRequestHeaders() }
  );
  if (!res.ok) return [];
  const json = (await res.json()) as { orders?: Workshop2SampleOrderDto[] };
  return json.orders ?? [];
}

/** GET active — один активный заказ образца (M3). */
export async function fetchWorkshop2ActiveSampleOrder(
  collectionId: string,
  articleId: string
): Promise<{ order: Workshop2SampleOrderDto | null; activeSampleOrderId?: string | null }> {
  const res = await fetch(
    `/api/workshop2/articles/${encodeURIComponent(collectionId)}/${encodeURIComponent(articleId)}/sample-order/active`,
    { cache: 'no-store', headers: buildWorkshop2ApiRequestHeaders() }
  );
  if (!res.ok) return { order: null };
  const json = (await res.json()) as {
    order?: Workshop2SampleOrderDto | null;
    activeSampleOrderId?: string | null;
  };
  return {
    order: json.order ?? null,
    activeSampleOrderId: json.activeSampleOrderId,
  };
}

export async function postWorkshop2SampleOrderTransitionApi(input: {
  collectionId: string;
  articleId: string;
  orderId: string;
  toStatus: Workshop2SampleOrderStatus;
  actor?: string;
  note?: string;
}): Promise<{
  ok: boolean;
  order?: Workshop2SampleOrderDto;
  messageRu?: string;
  from?: string;
  to?: string;
}> {
  const res = await fetch(
    `/api/workshop2/articles/${encodeURIComponent(input.collectionId)}/${encodeURIComponent(input.articleId)}/sample-order/${encodeURIComponent(input.orderId)}/transition`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...buildWorkshop2ApiRequestHeaders() },
      body: JSON.stringify({
        toStatus: input.toStatus,
        actor: input.actor,
        note: input.note,
      }),
    }
  );
  const json = (await res.json()) as {
    ok?: boolean;
    order?: Workshop2SampleOrderDto;
    messageRu?: string;
    from?: string;
    to?: string;
    transition?: { from?: string; to?: string };
  };
  return {
    ok: Boolean(json.ok && res.ok),
    order: json.order,
    messageRu: json.messageRu,
    from: json.transition?.from ?? json.from,
    to: json.transition?.to ?? json.to,
  };
}

/** POST floor/sample-status — синхронизация статуса с пола (M4). */
export async function postWorkshop2FloorSampleStatusSyncApi(input: {
  collectionId: string;
  articleId: string;
  orderId?: string;
  floorTab?: string;
  sampleOrderStatus?: Workshop2SampleOrderStatus;
  actor?: string;
}): Promise<{
  ok: boolean;
  order?: Workshop2SampleOrderDto;
  syncedAt?: string;
  messageRu?: string;
}> {
  const res = await fetch(
    `/api/workshop2/articles/${encodeURIComponent(input.collectionId)}/${encodeURIComponent(input.articleId)}/floor/sample-status`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...buildWorkshop2ApiRequestHeaders() },
      body: JSON.stringify({
        orderId: input.orderId,
        floorTab: input.floorTab,
        sampleOrderStatus: input.sampleOrderStatus,
        actor: input.actor,
        source: 'release_floor_panel',
      }),
    }
  );
  const json = (await res.json()) as {
    ok?: boolean;
    order?: Workshop2SampleOrderDto;
    messageRu?: string;
    resolved?: { orderStatus?: string };
  };
  return {
    ok: Boolean(json.ok && res.ok),
    order: json.order,
    messageRu: json.messageRu,
    syncedAt: json.order?.updatedAt,
  };
}

export async function createWorkshop2SampleOrderApi(input: {
  collectionId: string;
  articleId: string;
  contractorId?: string;
  dueDate?: string;
  sizes?: Workshop2SampleOrderSizes;
  quantity?: number;
  notes?: string;
}): Promise<Workshop2CreateSampleOrderResult> {
  const res = await fetch(
    `/api/workshop2/articles/${encodeURIComponent(input.collectionId)}/${encodeURIComponent(input.articleId)}/sample-order`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...buildWorkshop2ApiRequestHeaders() },
      body: JSON.stringify(input),
    }
  );
  let json: unknown = {};
  try {
    json = await res.json();
  } catch {
    json = {};
  }
  if (res.ok) {
    const order = (json as { order?: Workshop2SampleOrderDto }).order;
    if (order) return { ok: true, order };
    return {
      ok: false,
      status: res.status,
      messageRu: 'Сервер не вернул заказ образца.',
    };
  }
  const body = json as { error?: string; messageRu?: string };
  const checks = parseWorkshop2ApiGateChecksFromJson(json);
  return {
    ok: false,
    status: res.status,
    error: body.error,
    messageRu: body.messageRu,
    checks,
  };
}

/** Краткое описание ошибки создания заказа (409 gate и др.). */
export function describeWorkshop2CreateSampleOrderFailure(
  result: Extract<Workshop2CreateSampleOrderResult, { ok: false }>
): string {
  return formatWorkshop2GateChecksForUi(
    result.checks,
    result.messageRu ?? 'Не удалось создать заказ образца.'
  );
}

export type Workshop2HandoffPdfGateResult = {
  allowed: boolean;
  status: number;
  state?: 'blocked' | 'warn' | 'ready';
  checks?: Workshop2ApiGateCheck[];
  messageRu?: string;
};

/** Серверная проверка перед client-side PDF (wave 16). При 404/503 — allowed с status. */
export async function fetchWorkshop2HandoffPdfGateApi(
  collectionId: string,
  articleId: string,
  categoryLeafId?: string
): Promise<Workshop2HandoffPdfGateResult> {
  const q = categoryLeafId?.trim()
    ? `?categoryLeafId=${encodeURIComponent(categoryLeafId.trim())}`
    : '';
  const res = await fetch(
    `/api/workshop2/articles/${encodeURIComponent(collectionId)}/${encodeURIComponent(articleId)}/handoff-pdf${q}`,
    { cache: 'no-store', headers: buildWorkshop2ApiRequestHeaders() }
  );
  if (res.status === 404 || res.status === 503) {
    return { allowed: true, status: res.status };
  }
  let json: unknown = {};
  try {
    json = await res.json();
  } catch {
    json = {};
  }
  const body = json as {
    ok?: boolean;
    allowed?: boolean;
    state?: 'blocked' | 'warn' | 'ready';
    messageRu?: string;
  };
  const checks = parseWorkshop2ApiGateChecksFromJson(json);
  const allowed = res.ok && body.allowed !== false && res.status !== 409;
  return {
    allowed,
    status: res.status,
    state: body.state,
    checks,
    messageRu: body.messageRu,
  };
}

export async function postWorkshop2SampleOrderMovementApi(input: {
  collectionId: string;
  articleId: string;
  orderId: string;
  target?: Workshop2SampleGoodsMovementStatus;
  strictIntake?: boolean;
}): Promise<{
  ok: boolean;
  order?: Workshop2SampleOrderDto;
  messageRu?: string;
  intakeMissing?: string[];
  wmsRelease?: {
    released: boolean;
    pgPrimary: boolean;
    filePersistOnly: boolean;
    storeMode: string;
    wmsSyncStatus: string;
    messageRu: string;
  };
}> {
  const res = await fetch(
    `/api/workshop2/articles/${encodeURIComponent(input.collectionId)}/${encodeURIComponent(input.articleId)}/sample-order/${encodeURIComponent(input.orderId)}/movement`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...buildWorkshop2ApiRequestHeaders() },
      body: JSON.stringify({
        target: input.target,
        strictIntake: input.strictIntake,
      }),
    }
  );
  const json = (await res.json()) as {
    ok?: boolean;
    order?: Workshop2SampleOrderDto;
    messageRu?: string;
    intakeMissing?: string[];
    wmsRelease?: {
      released: boolean;
      pgPrimary: boolean;
      filePersistOnly: boolean;
      storeMode: string;
      wmsSyncStatus: string;
      messageRu: string;
    };
  };
  return {
    ok: Boolean(json.ok && res.ok),
    order: json.order,
    messageRu: json.messageRu,
    intakeMissing: json.intakeMissing,
    wmsRelease: json.wmsRelease,
  };
}

export async function patchWorkshop2SampleOrderApi(input: {
  collectionId: string;
  articleId: string;
  orderId: string;
  status?: Workshop2SampleOrderStatus;
  nestingRequest?: Workshop2NestingRequest;
}): Promise<Workshop2SampleOrderDto | null> {
  const res = await fetch(
    `/api/workshop2/articles/${encodeURIComponent(input.collectionId)}/${encodeURIComponent(input.articleId)}/sample-order/${encodeURIComponent(input.orderId)}`,
    {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...buildWorkshop2ApiRequestHeaders() },
      body: JSON.stringify({
        ...(input.status ? { status: input.status } : {}),
        ...(input.nestingRequest ? { nestingRequest: input.nestingRequest } : {}),
      }),
    }
  );
  if (!res.ok) return null;
  const json = (await res.json()) as { order?: Workshop2SampleOrderDto };
  return json.order ?? null;
}

export type Workshop2HandoffReadinessApiResponse = Workshop2HandoffReadinessResult & {
  ok?: boolean;
  allowed?: boolean;
  gateScope?: string;
};

export async function fetchWorkshop2HandoffReadiness(
  collectionId: string,
  articleId: string,
  categoryLeafId?: string
): Promise<Workshop2HandoffReadinessApiResponse | null> {
  const q = categoryLeafId?.trim()
    ? `?categoryLeafId=${encodeURIComponent(categoryLeafId.trim())}`
    : '';
  const res = await fetch(
    `/api/workshop2/articles/${encodeURIComponent(collectionId)}/${encodeURIComponent(articleId)}/handoff-readiness${q}`,
    { cache: 'no-store', headers: buildWorkshop2ApiRequestHeaders() }
  );
  if (!res.ok) return null;
  return (await res.json()) as Workshop2HandoffReadinessApiResponse;
}

export async function fetchWorkshop2MaterialRequisitions(
  collectionId: string,
  articleId: string
): Promise<{ id: string; bomLineRef?: string; status: string; materialLabel?: string }[]> {
  const res = await fetch(
    `/api/workshop2/articles/${encodeURIComponent(collectionId)}/${encodeURIComponent(articleId)}/sample-material-request`,
    { cache: 'no-store', headers: buildWorkshop2ApiRequestHeaders() }
  );
  if (!res.ok) return [];
  const json = (await res.json()) as {
    requisitions?: { id: string; bomLineRef?: string; status: string; materialLabel?: string }[];
  };
  return json.requisitions ?? [];
}

export async function postWorkshop2MaterialRequisition(input: {
  collectionId: string;
  articleId: string;
  bomLineRef: string;
  materialLabel: string;
  quantity?: number;
  unit?: string;
}): Promise<{ ok: boolean; id?: string; message?: string }> {
  const res = await fetch(
    `/api/workshop2/articles/${encodeURIComponent(input.collectionId)}/${encodeURIComponent(input.articleId)}/sample-material-request`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...buildWorkshop2ApiRequestHeaders() },
      body: JSON.stringify(input),
    }
  );
  const json = (await res.json()) as {
    ok?: boolean;
    requisition?: { id: string };
    message?: string;
  };
  return { ok: Boolean(json.ok), id: json.requisition?.id, message: json.message };
}

export async function fetchWorkshop2PlmOutboxStatus(): Promise<{
  pending: number;
  awaitingAck: number;
  failed: number;
  actionable: number;
  labelRu: string;
  autoAckEnabled: boolean;
} | null> {
  const res = await fetch('/api/workshop2/plm-outbox/status', {
    cache: 'no-store',
    headers: buildWorkshop2ApiRequestHeaders(),
  });
  if (!res.ok) return null;
  const json = (await res.json()) as {
    pending?: number;
    awaitingAck?: number;
    summary?: { failed?: number };
    labelRu?: string;
    autoAckEnabled?: boolean;
  };
  const pending = json.pending ?? 0;
  const awaitingAck = json.awaitingAck ?? 0;
  const failed = json.summary?.failed ?? 0;
  return {
    pending,
    awaitingAck,
    failed,
    actionable: pending + awaitingAck,
    labelRu: json.labelRu ?? 'PLM',
    autoAckEnabled: Boolean(json.autoAckEnabled),
  };
}

/** Сброс failed → pending и повторная отправка. */
export async function retryWorkshop2PlmOutboxFailedApi(limit = 20): Promise<{
  ok: boolean;
  reset?: number;
  dispatched?: number;
  messageRu?: string;
}> {
  const res = await fetch('/api/workshop2/plm-outbox/retry-failed', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...buildWorkshop2ApiRequestHeaders() },
    body: JSON.stringify({ limit }),
  });
  const json = (await res.json()) as {
    ok?: boolean;
    reset?: number;
    dispatched?: number;
    messageRu?: string;
  };
  return {
    ok: Boolean(json.ok && res.ok),
    reset: json.reset,
    dispatched: json.dispatched,
    messageRu: json.messageRu,
  };
}

export async function processWorkshop2PlmOutboxApi(limit = 20): Promise<{
  ok: boolean;
  processed?: number;
  messageRu?: string;
}> {
  const res = await fetch('/api/workshop2/plm-outbox/process', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...buildWorkshop2ApiRequestHeaders() },
    body: JSON.stringify({ limit }),
  });
  const json = (await res.json()) as {
    ok?: boolean;
    processed?: number;
    messageRu?: string;
  };
  return {
    ok: Boolean(json.ok && res.ok),
    processed: json.processed,
    messageRu: json.messageRu,
  };
}

export type { Workshop2GoldSampleStatus };
