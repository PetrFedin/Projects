import { NextRequest, NextResponse } from 'next/server';
import { getWorkshop2ReferencesStatus } from '@/lib/server/workshop2-references-repository';
import { guardWorkshop2Route, WORKSHOP2_READ_ROLES } from '@/lib/server/workshop2-route-auth';

export const dynamic = 'force-dynamic';

/** GET: источник справочников (postgres vs static) + health PG. */
export async function GET(req: NextRequest) {
  const auth = await guardWorkshop2Route(req, WORKSHOP2_READ_ROLES);
  if (auth instanceof NextResponse) return auth;

  const status = await getWorkshop2ReferencesStatus();
  const ok = status.postgres !== 'down';
  return NextResponse.json({ ok, ...status }, { status: ok ? 200 : 503 });
}
