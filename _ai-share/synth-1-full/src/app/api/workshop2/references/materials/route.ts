import { jsonWorkshop2ErrorRu } from '@/lib/production/workshop2-api-error-ru';
import { NextRequest, NextResponse } from 'next/server';
import {
  deleteWorkshop2RefMaterial,
  listWorkshop2RefMaterials,
  upsertWorkshop2RefMaterial,
} from '@/lib/server/workshop2-references-repository';
import {
  guardWorkshop2Route,
  WORKSHOP2_READ_ROLES,
  WORKSHOP2_WRITE_ROLES,
} from '@/lib/server/workshop2-route-auth';

export const dynamic = 'force-dynamic';

/** GET: библиотека материалов W2. */
export async function GET(req: NextRequest) {
  const auth = await guardWorkshop2Route(req, WORKSHOP2_READ_ROLES);
  if (auth instanceof NextResponse) return auth;

  const data = await listWorkshop2RefMaterials();
  return NextResponse.json({ ok: true, ...data });
}

/** PUT: upsert строки библиотеки материалов (только PG). */
export async function PUT(req: NextRequest) {
  const auth = await guardWorkshop2Route(req, WORKSHOP2_WRITE_ROLES);
  if (auth instanceof NextResponse) return auth;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 });
  }
  const b = body as {
    id?: string;
    name?: string;
    role?: string;
    supplier?: string;
    composition?: string;
    gsm?: number;
  };
  const result = await upsertWorkshop2RefMaterial({
    id: String(b.id ?? ''),
    name: String(b.name ?? ''),
    role: String(b.role ?? 'main'),
    ...(b.supplier ? { supplier: String(b.supplier) } : {}),
    ...(b.composition ? { composition: String(b.composition) } : {}),
    ...(typeof b.gsm === 'number' ? { gsm: b.gsm } : {}),
  });
  if (!result.ok) {
    return NextResponse.json(
      { ok: false, error: result.reason },
      { status: result.reason === 'pg_disabled' ? 503 : 400 }
    );
  }
  const data = await listWorkshop2RefMaterials();
  return NextResponse.json({ ok: true, upserted: b.id, ...data });
}

/** DELETE: удалить строку по id (?id=). */
export async function DELETE(req: NextRequest) {
  const auth = await guardWorkshop2Route(req, WORKSHOP2_WRITE_ROLES);
  if (auth instanceof NextResponse) return auth;

  const id = req.nextUrl.searchParams.get('id')?.trim() ?? '';
  const result = await deleteWorkshop2RefMaterial(id);
  if (!result.ok) {
    const status =
      result.reason === 'pg_disabled' ? 503 : result.reason === 'not_found' ? 404 : 400;
    return jsonWorkshop2ErrorRu(status, String(result.reason));
  }
  const data = await listWorkshop2RefMaterials();
  return NextResponse.json({ ok: true, deleted: id, ...data });
}
