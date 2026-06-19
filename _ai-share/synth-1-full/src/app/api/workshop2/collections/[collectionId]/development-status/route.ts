import { NextRequest, NextResponse } from 'next/server';

import { getWorkshop2DevelopmentStatus } from '@/lib/server/workshop2-development-status';
import { guardWorkshop2Route, WORKSHOP2_READ_ROLES } from '@/lib/server/workshop2-route-auth';

type RouteCtx = { params: Promise<{ collectionId: string }> };

/** GET — статус столпа «ТЗ → образец». */
export async function GET(req: NextRequest, ctx: RouteCtx) {
  const auth = await guardWorkshop2Route(req, WORKSHOP2_READ_ROLES);
  if (auth instanceof NextResponse) return auth;

  const { collectionId: rawId } = await ctx.params;
  const collectionId = rawId?.trim();
  if (!collectionId) {
    return NextResponse.json({ ok: false, messageRu: 'Не указан collectionId.' }, { status: 400 });
  }

  const factoryId = req.nextUrl.searchParams.get('factoryId')?.trim() || undefined;
  const skipRangePlanner = req.nextUrl.searchParams.get('skipRangePlanner') === '1';
  const status = await getWorkshop2DevelopmentStatus(collectionId, factoryId, {
    skipRangePlanner,
  });
  return NextResponse.json({ ok: true, status });
}
