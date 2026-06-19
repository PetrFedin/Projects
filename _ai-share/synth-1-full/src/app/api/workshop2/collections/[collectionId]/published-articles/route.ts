import { NextRequest, NextResponse } from 'next/server';

import { listWorkshop2PublishedShowroomArticles } from '@/lib/server/workshop2-showroom-repository';
import { mergePxmMediaIntoPublishedArticles } from '@/lib/integrations/spine/pxm-media-overlay';
import { guardWorkshop2Route, WORKSHOP2_READ_ROLES } from '@/lib/server/workshop2-route-auth';

type RouteCtx = { params: Promise<{ collectionId: string }> };

/** GET /api/workshop2/collections/[collectionId]/published-articles — linesheet / B2B source. */
export async function GET(req: NextRequest, ctx: RouteCtx) {
  const auth = await guardWorkshop2Route(req, WORKSHOP2_READ_ROLES);
  if (auth instanceof NextResponse) return auth;

  const { collectionId: rawId } = await ctx.params;
  const collectionId = rawId?.trim();
  if (!collectionId) {
    return NextResponse.json({ ok: false, messageRu: 'Не указан collectionId.' }, { status: 400 });
  }

  const articles = mergePxmMediaIntoPublishedArticles(
    await listWorkshop2PublishedShowroomArticles(collectionId)
  );
  return NextResponse.json({
    ok: true,
    collectionId,
    articles,
    messageRu:
      articles.length > 0
        ? `${articles.length} опубликованных артикул(ов) для лайншита.`
        : 'Нет опубликованных артикулов — опубликуйте витрину в W2.',
  });
}
