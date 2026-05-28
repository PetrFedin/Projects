import { NextRequest, NextResponse } from 'next/server';
import { syncWorkshop2CategoriesFromHandbook } from '@/lib/server/workshop2-references-repository';
import {
  guardWorkshop2Route,
  WORKSHOP2_REFERENCES_IMPORT_ROLES,
} from '@/lib/server/workshop2-route-auth';

export const dynamic = 'force-dynamic';

/** POST: идемпотентная синхронизация листьев category-handbook.snapshot → PG. */
export async function POST(req: NextRequest) {
  const auth = guardWorkshop2Route(req, WORKSHOP2_REFERENCES_IMPORT_ROLES);
  if (auth instanceof NextResponse) return auth;

  void req;
  const result = await syncWorkshop2CategoriesFromHandbook();
  if (!result.ok) {
    return NextResponse.json(
      { ok: false, error: result.reason, message: result.message },
      { status: result.reason === 'pg_disabled' ? 503 : 500 }
    );
  }

  return NextResponse.json({
    ok: true,
    upserted: result.upserted,
    total: result.total,
    message: `Синхронизировано категорий в PG: ${result.upserted}.`,
  });
}
