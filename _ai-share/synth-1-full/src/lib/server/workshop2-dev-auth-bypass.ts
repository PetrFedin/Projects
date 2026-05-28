/**
 * Wave X — dev-only auth bypass для `/api/workshop2/*` (curl / smoke без JWT).
 * Никогда не активен в production (двойная защита: NODE_ENV + workshop2DevBypassAuthEnabled).
 */
import type { NextRequest } from 'next/server';
import { workshop2DevBypassAuthEnabled } from '@/lib/server/workshop2-dev-env';

export function isWorkshop2ApiPath(pathname: string): boolean {
  return pathname.startsWith('/api/workshop2/');
}

/** Инжектирует actor headers для smoke/curl когда bypass включён и headers отсутствуют. */
export function buildWorkshop2DevBypassRequestHeaders(req: NextRequest): Headers | null {
  if (process.env.NODE_ENV === 'production') return null;
  if (!workshop2DevBypassAuthEnabled()) return null;
  if (!isWorkshop2ApiPath(req.nextUrl.pathname)) return null;

  const headers = new Headers(req.headers);
  if (headers.get('authorization')?.startsWith('Bearer ')) return null;
  if (headers.get('x-w2-actor-id')?.trim()) return null;

  headers.set('x-w2-actor-id', 'dev-bypass');
  headers.set('x-w2-actor-label', 'workshop2-dev-bypass');
  headers.set('x-w2-actor-roles', 'production:edit,production:read');
  headers.set('x-w2-updated-by', 'workshop2-dev-bypass');
  return headers;
}
