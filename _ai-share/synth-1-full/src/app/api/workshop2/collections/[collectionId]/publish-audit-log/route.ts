import { NextRequest, NextResponse } from 'next/server';

import { guardWorkshop2Route, WORKSHOP2_READ_ROLES } from '@/lib/server/workshop2-route-auth';
import { listWorkshop2DomainEventsForCollection } from '@/lib/server/workshop2-domain-events';

type RouteCtx = { params: Promise<{ collectionId: string }> };

/** GET — журнал публикаций showroom (showroom.published) по коллекции. */
export async function GET(req: NextRequest, ctx: RouteCtx) {
  const auth = await guardWorkshop2Route(req, WORKSHOP2_READ_ROLES);
  if (auth instanceof NextResponse) return auth;

  const { collectionId: rawId } = await ctx.params;
  const collectionId = rawId?.trim();
  if (!collectionId) {
    return NextResponse.json({ ok: false, messageRu: 'Не указан collectionId.' }, { status: 400 });
  }

  const limitRaw = Number(req.nextUrl.searchParams.get('limit') ?? 20);
  const limit = Number.isFinite(limitRaw) ? Math.floor(limitRaw) : 20;

  const events = await listWorkshop2DomainEventsForCollection({
    collectionId,
    eventType: 'showroom.published',
    limit,
  });

  return NextResponse.json({
    ok: true,
    collectionId,
    events,
    messageRu:
      events.length > 0
        ? `${events.length} записей публикации`
        : 'Публикаций пока нет — используйте batch publish или W2 gate.',
  });
}
