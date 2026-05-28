import { NextRequest, NextResponse } from 'next/server';
import { resolveWorkshop2RequiredFieldIdsForLeaf } from '@/lib/production/workshop2-required-fields';
import { guardWorkshop2Route, WORKSHOP2_READ_ROLES } from '@/lib/server/workshop2-route-auth';

export const dynamic = 'force-dynamic';

/** GET ?leafId= — merged required attribute ids для ТЗ-1. */
export async function GET(req: NextRequest) {
  const auth = guardWorkshop2Route(req, WORKSHOP2_READ_ROLES);
  if (auth instanceof NextResponse) return auth;

  const leafId = req.nextUrl.searchParams.get('leafId')?.trim() ?? '';
  if (!leafId) {
    return NextResponse.json(
      { ok: false, error: 'missing_leaf_id', message: 'Укажите query-параметр leafId.' },
      { status: 400 }
    );
  }

  const payload = resolveWorkshop2RequiredFieldIdsForLeaf(leafId);
  if (!payload) {
    return NextResponse.json(
      { ok: false, error: 'unknown_leaf', message: `Лист справочника не найден: ${leafId}` },
      { status: 404 }
    );
  }

  return NextResponse.json({ ok: true, ...payload });
}
