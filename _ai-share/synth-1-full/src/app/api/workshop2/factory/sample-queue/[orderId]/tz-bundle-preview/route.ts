/**
 * GET /api/workshop2/factory/sample-queue/[orderId]/tz-bundle-preview — read-only excerpt.
 */
import { jsonWorkshop2ErrorRu } from '@/lib/production/workshop2-api-error-ru';
import { withWorkshop2ApiErrorRu } from '@/lib/production/workshop2-api-route-ru';
import { NextRequest, NextResponse } from 'next/server';
import { buildWorkshop2FactoryTzBundlePreview } from '@/lib/production/workshop2-factory-tz-bundle-preview';
import { listWorkshop2SampleOrders } from '@/lib/server/workshop2-sample-order-repository';
import { getWorkshop2ServerDossierRecord } from '@/lib/server/workshop2-phase1-dossier-server-store';
import { guardWorkshop2Route, WORKSHOP2_READ_ROLES } from '@/lib/server/workshop2-route-auth';
import { isWorkshop2PostgresEnabled } from '@/lib/server/workshop2-pg-pool';

type RouteCtx = { params: Promise<{ orderId: string }> };

export const GET = withWorkshop2ApiErrorRu(async function getTzBundlePreview(
  req: NextRequest,
  ctx: RouteCtx
) {
  const auth = await guardWorkshop2Route(req, WORKSHOP2_READ_ROLES);
  if (auth instanceof NextResponse) return auth;

  const { orderId } = await ctx.params;
  const oid = orderId.trim();
  const url = new URL(req.url);
  const collectionId = url.searchParams.get('collectionId')?.trim() ?? '';
  const articleId = url.searchParams.get('articleId')?.trim() ?? '';
  if (!oid || !collectionId || !articleId) {
    return jsonWorkshop2ErrorRu(400, 'invalid_path', {
      messageRu: 'Нужны orderId, collectionId, articleId.',
    });
  }

  const orders = await listWorkshop2SampleOrders({ collectionId, articleId });
  const order = orders.find((o) => o.id === oid);
  if (!order) return jsonWorkshop2ErrorRu(404, 'not_found');

  const dossierRec = await getWorkshop2ServerDossierRecord(collectionId, articleId);
  const label =
    dossierRec?.dossier?.passportProductionBrief?.articleCardOwnerName?.trim() || articleId;

  const preview = buildWorkshop2FactoryTzBundlePreview({
    order,
    dossier: dossierRec?.dossier ?? null,
    articleLabelRu: label,
  });

  return NextResponse.json({
    ok: true,
    preview,
    source: isWorkshop2PostgresEnabled() ? 'pg' : 'memory',
  });
});
