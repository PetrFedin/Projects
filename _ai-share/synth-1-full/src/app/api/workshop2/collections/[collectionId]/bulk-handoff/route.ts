import { jsonWorkshop2ErrorRu } from '@/lib/production/workshop2-api-error-ru';
import { withWorkshop2ApiErrorRu } from '@/lib/production/workshop2-api-route-ru';
import { NextRequest, NextResponse } from 'next/server';
import {
  evaluateWorkshop2BulkHandoffForArticle,
  summarizeWorkshop2BulkHandoff,
} from '@/lib/production/workshop2-bulk-handoff';
import { getWorkshop2ServerDossierRecord } from '@/lib/server/workshop2-phase1-dossier-server-store';

type RouteParams = { params: Promise<{ collectionId: string }> };

/** POST — массовый handoff gate по артикулам коллекции (journal only, без fake ACK). */
async function postBulkHandoff(req: NextRequest, ctx: RouteParams) {
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

  if (articleIds.length === 0) {
    return jsonWorkshop2ErrorRu(400, 'article_ids_required', {
      messageRu: 'Передайте articleIds[] в теле запроса.',
    });
  }

  const categoryLeafByArticle =
    (body as { categoryLeafByArticle?: Record<string, string> }).categoryLeafByArticle ?? {};

  const results = await Promise.all(
    articleIds.map(async (articleId) => {
      const record = await getWorkshop2ServerDossierRecord(collectionId, articleId);
      return evaluateWorkshop2BulkHandoffForArticle({
        collectionId,
        articleId,
        dossier: record?.dossier ?? null,
        categoryLeafId: categoryLeafByArticle[articleId],
      });
    })
  );

  const summary = summarizeWorkshop2BulkHandoff({ collectionId, results });

  return NextResponse.json({
    ok: true,
    passed: summary.passed,
    blocked: summary.blocked,
    results: summary.results.map((r) => ({
      articleId: r.articleId,
      passed: r.passed,
      reasons: r.reasons,
    })),
    messageRu: summary.blocked.length
      ? `Массовый handoff: ${summary.passed} прошли, ${summary.blocked.length} заблокированы.`
      : `Массовый handoff: все ${summary.passed} артикул(ов) прошли gate.`,
  });
}

export const POST = withWorkshop2ApiErrorRu(postBulkHandoff);
