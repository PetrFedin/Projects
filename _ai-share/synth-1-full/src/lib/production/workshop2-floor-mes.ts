/**
 * Block C / Wave 47 (#58): floor MES GET poll + reverse sync fail-closed без WORKSHOP2_FLOOR_MES_URL.
 */
import type { Workshop2SampleOrderStatus } from '@/lib/production/workshop2-dossier-phase1.types';
import { mapWorkshop2FloorTabToSampleOrderStatus } from '@/lib/production/workshop2-floor-bridge-sync';

export type Workshop2ProcessEnvLike = Record<string, string | undefined>;

export type Workshop2FloorMesPollState = 'idle' | 'synced' | 'pending' | 'offline' | 'fail_closed';

export type Workshop2FloorMesPollPayload = {
  ok: boolean;
  floorTab?: string;
  sampleOrderStatus?: Workshop2SampleOrderStatus;
  movementStatus?: string;
  syncedAt?: string;
  idempotencyKey?: string;
};

export function isWorkshop2FloorMesConfigured(env: Workshop2ProcessEnvLike = process.env): boolean {
  return Boolean(String(env.WORKSHOP2_FLOOR_MES_URL ?? '').trim());
}

export function workshop2FloorMesPollUrl(
  env: Workshop2ProcessEnvLike = process.env
): string | null {
  const base = String(env.WORKSHOP2_FLOOR_MES_URL ?? '')
    .trim()
    .replace(/\/$/, '');
  return base || null;
}

/** Fail-closed: reverse sync (POST sample-status / floor bridge) только при live MES URL. */
export function isWorkshop2FloorMesReverseSyncAllowed(
  env: Workshop2ProcessEnvLike = process.env
): boolean {
  return isWorkshop2FloorMesConfigured(env);
}

export function evaluateWorkshop2FloorMesReverseSyncBlocked(
  env: Workshop2ProcessEnvLike = process.env
): { blocked: boolean; messageRu: string } {
  if (isWorkshop2FloorMesReverseSyncAllowed(env)) {
    return { blocked: false, messageRu: '' };
  }
  return {
    blocked: true,
    messageRu:
      'Обратная синхронизация с пола отключена — задайте WORKSHOP2_FLOOR_MES_URL (fail-closed).',
  };
}

export function buildWorkshop2FloorMesPollRequestUrl(input: {
  collectionId: string;
  articleId: string;
  orderId?: string;
  env?: Workshop2ProcessEnvLike;
}): string | null {
  const base = workshop2FloorMesPollUrl(input.env);
  if (!base) return null;
  const q = new URLSearchParams({
    collectionId: input.collectionId,
    articleId: input.articleId,
  });
  if (input.orderId?.trim()) q.set('orderId', input.orderId.trim());
  return `${base}/sample-status?${q.toString()}`;
}

/** Валидация ответа GET poll (contract test, no live MES). */
export function parseWorkshop2FloorMesPollPayload(
  body: unknown
): Workshop2FloorMesPollPayload | null {
  if (!body || typeof body !== 'object') return null;
  const b = body as Record<string, unknown>;
  const floorTab = typeof b.floorTab === 'string' ? b.floorTab.trim() : undefined;
  const sampleOrderStatus = b.sampleOrderStatus as Workshop2SampleOrderStatus | undefined;
  const movementStatus = typeof b.movementStatus === 'string' ? b.movementStatus.trim() : undefined;
  const syncedAt = typeof b.syncedAt === 'string' ? b.syncedAt : undefined;
  const idempotencyKey = typeof b.idempotencyKey === 'string' ? b.idempotencyKey : undefined;
  const ok = b.ok === true || Boolean(floorTab || sampleOrderStatus);
  if (!ok) return null;
  return {
    ok: true,
    floorTab,
    sampleOrderStatus,
    movementStatus,
    syncedAt,
    idempotencyKey,
  };
}

export function resolveWorkshop2FloorMesPollToOrderStatus(
  payload: Workshop2FloorMesPollPayload
): Workshop2SampleOrderStatus | undefined {
  if (payload.sampleOrderStatus) return payload.sampleOrderStatus;
  return mapWorkshop2FloorTabToSampleOrderStatus(payload.floorTab);
}

export function summarizeWorkshop2FloorMesChip(input: {
  configured: boolean;
  pollState: Workshop2FloorMesPollState;
  lastPollAt?: string;
}): { labelRu: string; tone: 'emerald' | 'amber' | 'rose' | 'slate' } {
  if (!input.configured) {
    return { labelRu: 'Floor: fail-closed (нет MES URL)', tone: 'slate' };
  }
  switch (input.pollState) {
    case 'synced':
      return { labelRu: 'Floor: synced', tone: 'emerald' };
    case 'pending':
      return { labelRu: 'Floor: pending', tone: 'amber' };
    case 'offline':
      return { labelRu: 'Floor: offline', tone: 'rose' };
    case 'fail_closed':
      return { labelRu: 'Floor: fail-closed', tone: 'slate' };
    default:
      return { labelRu: 'Floor: idle', tone: 'slate' };
  }
}

/** GET poll к внешнему MES (browser / server). */
export async function pollWorkshop2FloorMesSampleStatus(input: {
  collectionId: string;
  articleId: string;
  orderId?: string;
  env?: Workshop2ProcessEnvLike;
  fetchFn?: typeof fetch;
}): Promise<
  | { ok: true; payload: Workshop2FloorMesPollPayload; pollState: 'synced' }
  | { ok: false; pollState: Workshop2FloorMesPollState; status?: number }
> {
  const url = buildWorkshop2FloorMesPollRequestUrl(input);
  if (!url) {
    return { ok: false, pollState: 'fail_closed' };
  }
  const fetchImpl = input.fetchFn ?? fetch;
  try {
    const res = await fetchImpl(url, { method: 'GET', cache: 'no-store' });
    if (!res.ok) {
      return {
        ok: false,
        pollState: res.status === 503 ? 'offline' : 'pending',
        status: res.status,
      };
    }
    const json = (await res.json()) as unknown;
    const payload = parseWorkshop2FloorMesPollPayload(json);
    if (!payload) {
      return { ok: false, pollState: 'pending', status: res.status };
    }
    return { ok: true, payload, pollState: 'synced' };
  } catch {
    return { ok: false, pollState: 'offline' };
  }
}
