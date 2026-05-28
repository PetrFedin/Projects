import { NextRequest, NextResponse } from 'next/server';
import { importWorkshop2SizeScalesCsv } from '@/lib/server/workshop2-references-repository';
import {
  guardWorkshop2Route,
  WORKSHOP2_REFERENCES_IMPORT_ROLES,
} from '@/lib/server/workshop2-route-auth';

export const dynamic = 'force-dynamic';

/**
 * POST: импорт CSV размерных сеток — валидация + upsert в PG (или только validate при отсутствии PG).
 * Тело: `{ csv: string }` или `text/csv` raw body.
 */
export async function POST(req: NextRequest) {
  const auth = guardWorkshop2Route(req, WORKSHOP2_REFERENCES_IMPORT_ROLES);
  if (auth instanceof NextResponse) return auth;

  let csv = '';
  const contentType = req.headers.get('content-type') ?? '';
  if (contentType.includes('text/csv') || contentType.includes('text/plain')) {
    csv = await req.text();
  } else {
    const body = (await req.json().catch(() => null)) as { csv?: string } | null;
    csv = body?.csv?.trim() ?? '';
  }

  if (!csv) {
    return NextResponse.json(
      { ok: false, error: 'empty_csv', message: 'Передайте CSV в поле csv или как text/csv.' },
      { status: 400 }
    );
  }

  const result = await importWorkshop2SizeScalesCsv(csv);
  if (!result.ok) {
    const status = result.reason === 'no_rows' || result.reason === 'all_invalid' ? 400 : 503;
    return NextResponse.json(
      {
        ok: false,
        error: result.reason,
        message: result.message,
        ...(result.report ? { report: result.report } : {}),
      },
      { status }
    );
  }

  return NextResponse.json({
    ok: true,
    mode: result.mode,
    upserted: result.upserted,
    message: result.message,
    report: result.report,
  });
}
