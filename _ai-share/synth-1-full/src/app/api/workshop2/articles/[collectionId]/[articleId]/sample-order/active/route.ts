/**
 * GET — один активный заказ образца для артикула.
 */
import { NextRequest, NextResponse } from 'next/server';
import { getWorkshop2ServerDossierRecord } from '@/lib/server/workshop2-phase1-dossier-server-store';
import { getWorkshop2ActiveSampleOrder } from '@/lib/server/workshop2-sample-order-repository';
import { resolveWorkshop2OrganizationId } from '@/lib/server/workshop2-api-context';
import { guardWorkshop2Route, WORKSHOP2_READ_ROLES } from '@/lib/server/workshop2-route-auth';
import { jsonWorkshop2ErrorRu } from '@/lib/production/workshop2-api-error-ru';

type RouteCtx = { params: Promise<{ collectionId: string; articleId: string }> };

export async function GET(req: NextRequest, ctx: RouteCtx) {
  const auth = await guardWorkshop2Route(req, WORKSHOP2_READ_ROLES);
  if (auth instanceof NextResponse) return auth;

  const { collectionId, articleId } = await ctx.params;
  const cid = collectionId.trim();
  const aid = articleId.trim();
  if (!cid || !aid) {
    return jsonWorkshop2ErrorRu(400, 'invalid_path');
  }

  const record = await getWorkshop2ServerDossierRecord(cid, aid);
  const order = await getWorkshop2ActiveSampleOrder({
    collectionId: cid,
    articleId: aid,
    organizationId: resolveWorkshop2OrganizationId(req),
    activeSampleOrderId: record?.dossier.sampleWorkflow?.activeSampleOrderId,
  });

  return NextResponse.json({
    ok: true,
    order,
    activeSampleOrderId: record?.dossier.sampleWorkflow?.activeSampleOrderId ?? null,
  });
}
