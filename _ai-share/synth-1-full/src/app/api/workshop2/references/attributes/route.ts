import { NextRequest, NextResponse } from 'next/server';
import { withWorkshop2ApiErrorRu } from '@/lib/production/workshop2-api-route-ru';
import { listWorkshop2RefAttributes } from '@/lib/server/workshop2-references-repository';
import { guardWorkshop2Route, WORKSHOP2_READ_ROLES } from '@/lib/server/workshop2-route-auth';

export const dynamic = 'force-dynamic';

/** GET: каталог атрибутов с PG-переопределениями (label, requiredForPhase1). */
async function getAttributes(req: NextRequest) {
  const auth = await guardWorkshop2Route(req, WORKSHOP2_READ_ROLES);
  if (auth instanceof NextResponse) return auth;

  const data = await listWorkshop2RefAttributes();
  return NextResponse.json({ ok: true, ...data });
}

export const GET = withWorkshop2ApiErrorRu(getAttributes);
