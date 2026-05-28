import 'server-only';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {
  assertWorkshop2ApiAccess,
  assertWorkshop2ApiRole,
  workshop2AuthJsonResponse,
  type Workshop2ApiAccess,
} from '@/lib/server/workshop2-api-auth';
import type { Workshop2ServerActor } from '@/lib/server/workshop2-server-actor';

export const WORKSHOP2_READ_ROLES = [
  'production:view',
  'production:edit',
  'w2:audit_read',
] as const;
export const WORKSHOP2_WRITE_ROLES = ['production:edit'] as const;
/** Импорт справочников (палитра, шкалы): технолог, менеджер или право редактирования производства. */
export const WORKSHOP2_REFERENCES_IMPORT_ROLES = [
  'production:edit',
  'technologist',
  'manager',
] as const;
export const WORKSHOP2_EVENTS_READ_ROLES = [
  'production:edit',
  'w2:audit_read',
  'w2:events_read',
] as const;

export type Workshop2RouteAuthOk = {
  ok: true;
  access: Workshop2ApiAccess & { ok: true };
  actor?: Workshop2ServerActor;
};

export async function guardWorkshop2Route(
  req: NextRequest,
  requiredRoles: readonly string[],
  opts?: { bodyActorLabel?: string; bodyActorOrganization?: string }
): Promise<Workshop2RouteAuthOk | NextResponse> {
  const base = await assertWorkshop2ApiAccess(req, opts);
  if (!base.ok) {
    return NextResponse.json(workshop2AuthJsonResponse(base), { status: base.status });
  }
  const withRole = assertWorkshop2ApiRole(base, requiredRoles);
  if (!withRole.ok) {
    return NextResponse.json(workshop2AuthJsonResponse(withRole), { status: withRole.status });
  }
  return { ok: true, access: withRole, actor: withRole.actor };
}
