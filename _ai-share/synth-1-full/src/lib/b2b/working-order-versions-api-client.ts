'use client';

import type { WorkingOrderVersion } from '@/lib/b2b/working-order-version.types';

const ACTOR_HEADER = { 'x-syntha-api-actor-role': 'shop' } as const;

export type WorkingOrderVersionsV1Success = {
  ok: true;
  data: { versions: WorkingOrderVersion[] };
};

export async function fetchWorkingOrderVersionsV1(params?: {
  wholesaleOrderId?: string;
}): Promise<WorkingOrderVersion[] | null> {
  try {
    const q = params?.wholesaleOrderId?.trim();
    const url =
      q && q.length > 0
        ? `/api/b2b/v1/working-order-versions?wholesaleOrderId=${encodeURIComponent(q)}`
        : '/api/b2b/v1/working-order-versions';
    const res = await fetch(url, { headers: { ...ACTOR_HEADER }, cache: 'no-store' });
    if (!res.ok) return null;
    const j = (await res.json()) as WorkingOrderVersionsV1Success | { ok?: false };
    if (!j || typeof j !== 'object' || !('ok' in j) || j.ok !== true) return null;
    const data = j as WorkingOrderVersionsV1Success;
    if (!Array.isArray(data.data?.versions)) return null;
    return data.data.versions;
  } catch {
    return null;
  }
}

export async function putWorkingOrderVersionsV1(versions: WorkingOrderVersion[]): Promise<boolean> {
  try {
    const res = await fetch('/api/b2b/v1/working-order-versions', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...ACTOR_HEADER },
      body: JSON.stringify({ versions }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
