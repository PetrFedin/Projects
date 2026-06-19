import { NextRequest, NextResponse } from 'next/server';

import { evaluateWorkshop2CollectionShowroomPublishReadiness } from '@/lib/production/workshop2-bulk-showroom-publish';
import { getWorkshop2ServerDossierRecord } from '@/lib/server/workshop2-phase1-dossier-server-store';
import { jsonWorkshop2ErrorRu } from '@/lib/production/workshop2-api-error-ru';
import { withWorkshop2ApiErrorRu } from '@/lib/production/workshop2-api-route-ru';
import { guardWorkshop2Route, WORKSHOP2_WRITE_ROLES } from '@/lib/server/workshop2-route-auth';

type RouteParams = { params: Promise<{ collectionId: string }> };

/** POST Wave 14: проверка showroom publish gate по артикулам коллекции. */
async function postPublishShowroomReadiness(req: NextRequest, ctx: RouteParams) {
  const auth = await guardWorkshop2Route(req, WORKSHOP2_WRITE_ROLES);
  if (auth instanceof NextResponse) return auth;

  const { collectionId: rawCollectionId } = await ctx.params;
  const collectionId = rawCollectionId?.trim();
  if (!collectionId) {
    return jsonWorkshop2ErrorRu(400, 'missing_collection_id');
  }

  let body: unknown = {};
  try {
    body = await req.json();
  } catch {
    body = {};
  }

  const articleIds = Array.isArray((body as { articleIds?: unknown }).articleIds)
    ? (body as { articleIds: unknown[] }).articleIds.map((id) => String(id).trim()).filter(Boolean)
    : [];

  if (!articleIds.length) {
    return jsonWorkshop2ErrorRu(400, 'article_ids_required');
  }

  const readiness = await evaluateWorkshop2CollectionShowroomPublishReadiness({
    articleIds,
    resolveArticle: async (articleId) => {
      const record = await getWorkshop2ServerDossierRecord(collectionId, articleId);
      return {
        articleId,
        dossier: record?.dossier ?? null,
      };
    },
  });

  return NextResponse.json({
    ok: true,
    ready: readiness.ready,
    blocked: readiness.blocked,
    passedArticleIds: readiness.passedArticleIds,
    messageRu: readiness.ready
      ? `Все ${readiness.passedArticleIds.length} артикул(ов) готовы к публикации витрины.`
      : `Блок: ${readiness.blocked.length}, готовы: ${readiness.passedArticleIds.length}.`,
  });
}

export const POST = withWorkshop2ApiErrorRu(postPublishShowroomReadiness);
