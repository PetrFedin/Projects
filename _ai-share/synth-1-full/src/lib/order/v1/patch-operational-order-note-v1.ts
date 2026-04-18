import { fetchWithHttpDeadline } from '@/lib/http/http-fetch-deadline';
import { withB2BV1ApiActorRoleHeaders } from '@/lib/auth/b2b-v1-api-client-headers';

export type OperationalOrderNoteV1Ok = {
  ok: true;
  data: { wholesaleOrderId: string; note: string; updatedAt: string };
  idempotentReplay?: boolean;
};

export type OperationalOrderNoteV1Err = {
  ok: false;
  status: number;
  message: string;
};

export async function patchOperationalOrderNoteV1(params: {
  orderId: string;
  note: string;
  idempotencyKey: string;
  signal?: AbortSignal;
  /** Роли из `normalizeAuthRoles(profile, user)` для заголовка v1 RBAC. */
  authRoleTokens?: string[];
}): Promise<OperationalOrderNoteV1Ok | OperationalOrderNoteV1Err> {
  const url = `/api/b2b/v1/operational-orders/${encodeURIComponent(params.orderId)}/operational-note`;
  const res = await fetchWithHttpDeadline(
    url,
    withB2BV1ApiActorRoleHeaders(
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Idempotency-Key': params.idempotencyKey,
        },
        body: JSON.stringify({ note: params.note }),
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
  if (
    typeof raw !== 'object' ||
    !raw ||
    (raw as { ok?: unknown }).ok !== true ||
    !(raw as { data?: unknown }).data
  ) {
    return { ok: false, status: 500, message: 'Invalid envelope' };
  }
  const data = (raw as { data: { wholesaleOrderId: string; note: string; updatedAt: string } })
    .data;
  const meta = (raw as { meta?: { idempotentReplay?: boolean } }).meta;
  return {
    ok: true,
    data,
    idempotentReplay: meta?.idempotentReplay === true,
  };
}
