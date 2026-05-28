import { jsonWorkshop2ErrorRu } from '@/lib/production/workshop2-api-error-ru';
import { NextRequest, NextResponse } from 'next/server';
import {
  listWorkshop2RefColors,
  upsertWorkshop2RefColor,
} from '@/lib/server/workshop2-references-repository';
import {
  guardWorkshop2Route,
  WORKSHOP2_READ_ROLES,
  WORKSHOP2_WRITE_ROLES,
} from '@/lib/server/workshop2-route-auth';

export const dynamic = 'force-dynamic';

/** GET: палитра цветов W2 (PG или static COLOR_PALETTE). */
export async function GET(req: NextRequest) {
  const auth = await guardWorkshop2Route(req, WORKSHOP2_READ_ROLES);
  if (auth instanceof NextResponse) return auth;

  const seasonId = req.nextUrl.searchParams.get('seasonId')?.trim() || 'SS27';
  const data = await listWorkshop2RefColors(seasonId);
  return NextResponse.json({ ok: true, ...data });
}

/** PUT: upsert одной строки палитры (production:edit или dev bypass). */
export async function PUT(req: NextRequest) {
  const auth = await guardWorkshop2Route(req, WORKSHOP2_WRITE_ROLES);
  if (auth instanceof NextResponse) return auth;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonWorkshop2ErrorRu(400, 'invalid_json');
  }
  const b = body as {
    code?: string;
    name?: string;
    hex?: string;
    pantone?: string;
    seasonId?: string;
  };
  const seasonId = b.seasonId?.trim() || 'SS27';
  const result = await upsertWorkshop2RefColor({
    code: String(b.code ?? ''),
    name: String(b.name ?? ''),
    hex: String(b.hex ?? ''),
    ...(b.pantone ? { pantone: String(b.pantone) } : {}),
    seasonId,
  });
  if (!result.ok) {
    return NextResponse.json(
      { ok: false, error: result.reason },
      { status: result.reason === 'pg_disabled' ? 503 : 400 }
    );
  }
  const data = await listWorkshop2RefColors(seasonId);
  return NextResponse.json({ ok: true, upserted: b.code, ...data });
}
