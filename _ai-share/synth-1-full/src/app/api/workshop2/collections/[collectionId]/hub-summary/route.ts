import { jsonWorkshop2ErrorRu } from '@/lib/production/workshop2-api-error-ru';
import { withWorkshop2ApiErrorRu } from '@/lib/production/workshop2-api-route-ru';
import { NextRequest, NextResponse } from 'next/server';

import {
  buildWorkshop2CollectionHubSummary,
  workshop2HubChatContextKey,
} from '@/lib/production/workshop2-hub-summary';
import { getWorkshop2ServerDossierRecord } from '@/lib/server/workshop2-phase1-dossier-server-store';
import { listWorkshop2ContextualMessageThreads } from '@/lib/server/workshop2-contextual-messages-repository';
import { WORKSHOP2_ARTICLE_CONTEXT_TYPE } from '@/lib/production/workshop2-domain-event-types';
import { guardWorkshop2Route, WORKSHOP2_READ_ROLES } from '@/lib/server/workshop2-route-auth';

type RouteCtx = { params: Promise<{ collectionId: string }> };

/** GET /api/workshop2/collections/[id]/hub-summary — batch mini-status для hub rows. */
async function getHubSummary(req: NextRequest, ctx: RouteCtx) {
  const auth = await guardWorkshop2Route(req, WORKSHOP2_READ_ROLES);
  if (auth instanceof NextResponse) return auth;

  const { collectionId: rawId } = await ctx.params;
  const collectionId = rawId?.trim();
  if (!collectionId) {
    return jsonWorkshop2ErrorRu(400, 'missing_collection_id');
  }

  const url = new URL(req.url);
  const articleIdsParam = url.searchParams.get('articleIds');
  const articleIds = articleIdsParam
    ? articleIdsParam
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
        .slice(0, 80)
    : [];

  if (!articleIds.length) {
    return jsonWorkshop2ErrorRu(400, 'article_ids_required', {
      messageRu: 'Передайте articleIds=id1,id2 в query.',
    });
  }

  const articles = await Promise.all(
    articleIds.map(async (articleId) => {
      const record = await getWorkshop2ServerDossierRecord(collectionId, articleId);
      return { articleId, dossier: record?.dossier ?? null };
    })
  );

  const threads = await listWorkshop2ContextualMessageThreads({
    contextType: WORKSHOP2_ARTICLE_CONTEXT_TYPE,
    limit: 200,
  });
  const previewByContextId = new Map(
    threads.map((t) => [t.contextId, t.lastMessagePreview] as const)
  );

  const summary = buildWorkshop2CollectionHubSummary({
    collectionId,
    articles: articles.map((a) => {
      const { contextId } = workshop2HubChatContextKey(collectionId, a.articleId);
      return {
        ...a,
        chatLastMessagePreview: previewByContextId.get(contextId) ?? null,
      };
    }),
  });

  return NextResponse.json({ ok: true, ...summary });
}

export const GET = withWorkshop2ApiErrorRu(getHubSummary);
