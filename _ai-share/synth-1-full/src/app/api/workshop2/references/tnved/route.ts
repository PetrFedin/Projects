import { jsonWorkshop2ErrorRu } from '@/lib/production/workshop2-api-error-ru';
import { NextRequest, NextResponse } from 'next/server';
import {
  deleteWorkshop2RefTnved,
  listWorkshop2RefTnved,
  upsertWorkshop2RefTnved,
} from '@/lib/server/workshop2-references-repository';
import {
  guardWorkshop2Route,
  WORKSHOP2_READ_ROLES,
  WORKSHOP2_REFERENCES_IMPORT_ROLES,
} from '@/lib/server/workshop2-route-auth';

export const dynamic = 'force-dynamic';

/** GET ?leafId= — подсказки ТН ВЭД по листу категории. */
export async function GET(req: NextRequest) {
  const auth = guardWorkshop2Route(req, WORKSHOP2_READ_ROLES);
  if (auth instanceof NextResponse) return auth;

  const leafId = req.nextUrl.searchParams.get('leafId')?.trim() || undefined;
  const data = await listWorkshop2RefTnved(leafId);
  return NextResponse.json({ ok: true, ...data });
}

/** PUT: upsert строки ТН ВЭД (technologist / production:edit). */
export async function PUT(req: NextRequest) {
  const auth = guardWorkshop2Route(req, WORKSHOP2_REFERENCES_IMPORT_ROLES);
  if (auth instanceof NextResponse) return auth;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 });
  }
  const b = body as {
    code?: string;
    description?: string;
    label?: string;
    leafId?: string;
    chapter?: string;
    chapterHint?: string;
  };
  const result = await upsertWorkshop2RefTnved({
    code: String(b.code ?? ''),
    description: String(b.description ?? b.label ?? ''),
    ...(b.leafId ? { leafId: String(b.leafId) } : {}),
    ...(b.chapter || b.chapterHint ? { chapter: String(b.chapter ?? b.chapterHint) } : {}),
  });
  if (!result.ok) {
    return NextResponse.json(
      { ok: false, error: result.reason },
      { status: result.reason === 'pg_disabled' ? 503 : 400 }
    );
  }
  const data = await listWorkshop2RefTnved(b.leafId?.trim() || undefined);
  return NextResponse.json({ ok: true, upserted: b.code, ...data });
}

/** DELETE: удалить код (?code=). */
export async function DELETE(req: NextRequest) {
  const auth = guardWorkshop2Route(req, WORKSHOP2_REFERENCES_IMPORT_ROLES);
  if (auth instanceof NextResponse) return auth;

  const code = req.nextUrl.searchParams.get('code')?.trim() ?? '';
  const result = await deleteWorkshop2RefTnved(code);
  if (!result.ok) {
    const status =
      result.reason === 'pg_disabled' ? 503 : result.reason === 'not_found' ? 404 : 400;
    return jsonWorkshop2ErrorRu(status, String(result.reason));
  }
  const data = await listWorkshop2RefTnved();
  return NextResponse.json({ ok: true, deleted: code.replace(/\D/g, '').slice(0, 10), ...data });
}
