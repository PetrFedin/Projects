/**
 * GET /api/workshop2/collections/[collectionId]/assortment-risk
 */
import { jsonWorkshop2ErrorRu } from '@/lib/production/workshop2-api-error-ru';
import { withWorkshop2ApiErrorRu } from '@/lib/production/workshop2-api-route-ru';
import { NextRequest, NextResponse } from 'next/server';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import { rollupWorkshop2CollectionAssortmentRisk } from '@/lib/production/workshop2-collection-assortment-risk';
import { getWorkshop2ServerDossierRecord } from '@/lib/server/workshop2-phase1-dossier-server-store';
import { guardWorkshop2Route, WORKSHOP2_READ_ROLES } from '@/lib/server/workshop2-route-auth';

type RouteCtx = { params: Promise<{ collectionId: string }> };

const DEFAULT_SS27_ARTICLES = ['demo-ss27-01', 'demo-ss27-02'];

async function getAssortmentRisk(req: NextRequest, ctx: RouteCtx) {
  const auth = await guardWorkshop2Route(req, WORKSHOP2_READ_ROLES);
  if (auth instanceof NextResponse) return auth;

  const { collectionId } = await ctx.params;
  const cid = collectionId.trim();
  if (!cid) {
    return jsonWorkshop2ErrorRu(400, 'invalid_collection');
  }

  const articleIdsParam = req.nextUrl.searchParams.get('articleIds')?.trim();
  const articleIds = articleIdsParam
    ? articleIdsParam
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
    : cid === 'SS27'
      ? DEFAULT_SS27_ARTICLES
      : [];

  const articles: { articleId: string; dossier: Workshop2DossierPhase1 | null }[] = [];

  for (const articleId of articleIds) {
    const record = await getWorkshop2ServerDossierRecord(cid, articleId);
    articles.push({ articleId, dossier: record?.dossier ?? null });
  }

  const rollup = rollupWorkshop2CollectionAssortmentRisk({
    collectionId: cid,
    articles,
  });

  return NextResponse.json({ ok: true, rollup });
}

export const GET = withWorkshop2ApiErrorRu(getAssortmentRisk);
