/**
 * POST — smart routing via WORKSHOP2_SMART_ROUTING_API_URL (fail-closed).
 */
import { callWorkshop2SmartRoutingApi } from '@/lib/production/workshop2-smart-routing-api';
import { jsonWorkshop2ErrorRu } from '@/lib/production/workshop2-api-error-ru';
import { withWorkshop2ApiErrorRu } from '@/lib/production/workshop2-api-route-ru';
import { NextRequest, NextResponse } from 'next/server';
import { getWorkshop2ServerDossierRecord } from '@/lib/server/workshop2-phase1-dossier-server-store';
import { guardWorkshop2Route, WORKSHOP2_WRITE_ROLES } from '@/lib/server/workshop2-route-auth';

type RouteCtx = { params: Promise<{ collectionId: string; articleId: string }> };

export const POST = withWorkshop2ApiErrorRu(async function postSmartRoutingRoute(
  req: NextRequest,
  ctx: RouteCtx
) {
  const auth = await guardWorkshop2Route(req, WORKSHOP2_WRITE_ROLES);
  if (auth instanceof NextResponse) return auth;

  const { collectionId, articleId } = await ctx.params;
  const cid = collectionId.trim();
  const aid = articleId.trim();
  if (!cid || !aid) {
    return jsonWorkshop2ErrorRu(400, 'invalid_path');
  }

  const record = await getWorkshop2ServerDossierRecord(cid, aid);
  const categoryLeafId = record?.dossier?.categoryBindings?.[0]?.categoryLeafId;

  const result = await callWorkshop2SmartRoutingApi({
    collectionId: cid,
    articleId: aid,
    categoryLeafId,
  });

  if (!result.ok) {
    return NextResponse.json(
      {
        ok: false,
        source: result.source,
        messageRu: result.noteRu ?? result.error,
      },
      { status: result.source === 'external_api' ? 502 : 503 }
    );
  }

  return NextResponse.json({
    ok: true,
    source: result.source,
    operations: result.operations,
    messageRu: result.noteRu,
  });
});
