import { NextRequest, NextResponse } from 'next/server';

import { getWorkshop2SampleCollectionStatus } from '@/lib/server/workshop2-sample-collection-status';
import { guardWorkshop2Route, WORKSHOP2_READ_ROLES } from '@/lib/server/workshop2-route-auth';

type RouteCtx = { params: Promise<{ collectionId: string }> };

/** GET — статус столпа «Образец → коллекция» для бренда и магазина. */
export async function GET(req: NextRequest, ctx: RouteCtx) {
  const auth = await guardWorkshop2Route(req, WORKSHOP2_READ_ROLES);
  if (auth instanceof NextResponse) return auth;

  const { collectionId: rawId } = await ctx.params;
  const collectionId = rawId?.trim();
  if (!collectionId) {
    return NextResponse.json({ ok: false, messageRu: 'Не указан collectionId.' }, { status: 400 });
  }

  const status = await getWorkshop2SampleCollectionStatus(collectionId);
  return NextResponse.json({ ok: true, status });
}
