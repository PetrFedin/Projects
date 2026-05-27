/**
 * GET — ZIP «пакет соответствия коллекции»: per-article compliance packs (max 20, 413 если больше).
 */
import { NextRequest, NextResponse } from 'next/server';
import {
  buildWorkshop2RuCollectionCompliancePackZip,
  WORKSHOP2_RU_COLLECTION_COMPLIANCE_PACK_MAX,
} from '@/lib/server/workshop2-ru-compliance-pack';
import { getWorkshop2ServerDossierRecord } from '@/lib/server/workshop2-phase1-dossier-server-store';
import { jsonWorkshop2ErrorRu } from '@/lib/production/workshop2-api-error-ru';
import { withWorkshop2ApiErrorRu } from '@/lib/production/workshop2-api-route-ru';
import { guardWorkshop2Route, WORKSHOP2_READ_ROLES } from '@/lib/server/workshop2-route-auth';

type RouteCtx = { params: Promise<{ collectionId: string }> };

async function getCollectionCompliancePack(req: NextRequest, ctx: RouteCtx) {
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
    : [];

  if (!articleIds.length) {
    return jsonWorkshop2ErrorRu(400, 'article_ids_required', {
      messageRu: 'Передайте articleIds=id1,id2 в query для пакета коллекции.',
    });
  }

  if (articleIds.length > WORKSHOP2_RU_COLLECTION_COMPLIANCE_PACK_MAX) {
    return jsonWorkshop2ErrorRu(413, 'too_many_articles', {
      messageRu: `Пакет коллекции: максимум ${WORKSHOP2_RU_COLLECTION_COMPLIANCE_PACK_MAX} артикулов за запрос (передано ${articleIds.length}).`,
      limit: WORKSHOP2_RU_COLLECTION_COMPLIANCE_PACK_MAX,
      received: articleIds.length,
    });
  }

  const resolved = await Promise.all(
    articleIds.map(async (articleId) => {
      const record = await getWorkshop2ServerDossierRecord(collectionId, articleId);
      if (!record) return null;
      const sku = url.searchParams.get(`sku_${articleId}`)?.trim() || undefined;
      const name = url.searchParams.get(`name_${articleId}`)?.trim() || undefined;
      const categoryLeafId =
        url.searchParams.get(`leaf_${articleId}`)?.trim() ||
        record.dossier.categoryBindings?.[0]?.categoryLeafId;
      return {
        articleId,
        articleSku: sku,
        articleName: name,
        categoryLeafId,
        dossier: record.dossier,
        version: record.version,
        updatedAt: record.updatedAt,
      };
    })
  );

  const articles = resolved.filter((a): a is NonNullable<typeof a> => a != null);
  if (!articles.length) {
    return jsonWorkshop2ErrorRu(404, 'not_found', {
      messageRu: 'Не найдено ни одного досье для указанных articleIds.',
    });
  }

  const { buffer, filename } = await buildWorkshop2RuCollectionCompliancePackZip({
    collectionId,
    articles,
  });

  return new NextResponse(new Uint8Array(buffer), {
    status: 200,
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'no-store',
    },
  });
}

export const GET = withWorkshop2ApiErrorRu(getCollectionCompliancePack);
