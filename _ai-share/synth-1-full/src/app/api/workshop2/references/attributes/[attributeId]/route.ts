import { jsonWorkshop2ErrorRu } from '@/lib/production/workshop2-api-error-ru';
import { NextRequest, NextResponse } from 'next/server';
import {
  listWorkshop2RefAttributes,
  upsertWorkshop2AttributeOverride,
} from '@/lib/server/workshop2-references-repository';
import { guardWorkshop2Route, WORKSHOP2_WRITE_ROLES } from '@/lib/server/workshop2-route-auth';

type RouteCtx = { params: Promise<{ attributeId: string }> };

export const dynamic = 'force-dynamic';

/** PUT: переопределить label и/или requiredForPhase1 одного атрибута (только PG). */
export async function PUT(req: NextRequest, ctx: RouteCtx) {
  const auth = await guardWorkshop2Route(req, WORKSHOP2_WRITE_ROLES);
  if (auth instanceof NextResponse) return auth;

  const { attributeId } = await ctx.params;
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 });
  }
  const b = body as { label?: string; requiredForPhase1?: boolean };
  const result = await upsertWorkshop2AttributeOverride({
    attributeId,
    ...(typeof b.label === 'string' ? { label: b.label } : {}),
    ...(typeof b.requiredForPhase1 === 'boolean' ? { requiredForPhase1: b.requiredForPhase1 } : {}),
  });
  if (!result.ok) {
    const status =
      result.reason === 'pg_disabled' ? 503 : result.reason === 'not_found' ? 404 : 400;
    return jsonWorkshop2ErrorRu(status, String(result.reason));
  }
  const data = await listWorkshop2RefAttributes();
  return NextResponse.json({ ok: true, attributeId, ...data });
}
