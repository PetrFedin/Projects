/**
 * GET — subscribe/poll domain events для артикула (cross-module horizontal sync).
 */
import { jsonWorkshop2ErrorRu } from '@/lib/production/workshop2-api-error-ru';
import { NextRequest, NextResponse } from 'next/server';
import { listWorkshop2DomainEventsForArticle } from '@/lib/server/workshop2-domain-events';
import { guardWorkshop2Route, WORKSHOP2_READ_ROLES } from '@/lib/server/workshop2-route-auth';

export async function GET(req: NextRequest) {
  const auth = guardWorkshop2Route(req, WORKSHOP2_READ_ROLES);
  if (auth instanceof NextResponse) return auth;

  const { searchParams } = new URL(req.url);
  const collectionId = searchParams.get('collectionId')?.trim();
  const articleId = searchParams.get('articleId')?.trim();
  const since = searchParams.get('since')?.trim();
  const limitRaw = searchParams.get('limit');
  const limit = limitRaw ? Number(limitRaw) : 50;

  if (!collectionId || !articleId) {
    return jsonWorkshop2ErrorRu(400, 'missing_collection_or_article');
  }

  const events = await listWorkshop2DomainEventsForArticle({
    collectionId,
    articleId,
    since,
    limit: Number.isFinite(limit) ? limit : 50,
  });

  return NextResponse.json({ ok: true, events });
}
