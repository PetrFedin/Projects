import { fetchWithHttpDeadline } from '@/lib/http/http-fetch-deadline';
import {
  type B2BV1OperationalActorRole,
  withB2BV1ApiActorRoleHeaders,
} from '@/lib/auth/b2b-v1-api-client-headers';
import { parseOperationalOrderV1PatchResponse } from '@/lib/order/operational-order-dto.schema';

export type OperationalOrderNoteV1Ok = {
  ok: true;
  data: {
    wholesaleOrderId: string;
    note: string;
    updatedAt: string;
    internalNote?: string;
    internalUpdatedAt?: string;
  };
  idempotentReplay?: boolean;
};

export type OperationalOrderNoteV1Err = {
  ok: false;
  status: number;
  message: string;
};

export async function patchOperationalOrderNoteV1(params: {
  orderId: string;
  idempotencyKey: string;
  /** Тот же заголовок, что у GET list/detail — иначе `findOperationalOrderForRequest` даёт 404 для shop/brand. */
  actorRole: B2BV1OperationalActorRole;
  /** Операционная заметка (хотя бы одно из `note`, `internalNote`). */
  note?: string;
  /** Внутренняя заметка бренда. */
  internalNote?: string;
  signal?: AbortSignal;
  /** Роли из `normalizeAuthRoles(profile, user)` для заголовка v1 RBAC. */
  authRoleTokens?: string[];
}): Promise<OperationalOrderNoteV1Ok | OperationalOrderNoteV1Err> {
  if (params.note === undefined && params.internalNote === undefined) {
    return { ok: false, status: 400, message: 'Provide at least one of note, internalNote' };
  }

  const url = `/api/b2b/v1/operational-orders/${encodeURIComponent(params.orderId)}/operational-note`;
  const payload: Record<string, string> = {};
  if (params.note !== undefined) payload.note = params.note;
  if (params.internalNote !== undefined) payload.internalNote = params.internalNote;

  const res = await fetchWithHttpDeadline(
    url,
    withB2BV1ApiActorRoleHeaders(
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Idempotency-Key': params.idempotencyKey,
          'x-syntha-api-actor-role': params.actorRole,
        },
        body: JSON.stringify(payload),
        signal: params.signal,
      },
      { authRoleTokens: params.authRoleTokens }
    )
  );
  const raw: unknown = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg =
      typeof raw === 'object' && raw && 'error' in raw
        ? String((raw as { error?: { message?: string } }).error?.message ?? res.statusText)
        : res.statusText;
    return { ok: false, status: res.status, message: msg };
  }
  const parsed = parseOperationalOrderV1PatchResponse(raw);
  if (!parsed.success) {
    return { ok: false, status: 500, message: 'Invalid envelope' };
  }
  const { data, meta } = parsed.data;
  return {
    ok: true,
    data,
    idempotentReplay: meta.idempotentReplay === true,
  };
}
