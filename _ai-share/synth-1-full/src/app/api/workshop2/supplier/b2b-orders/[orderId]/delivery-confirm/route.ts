/**
 * POST — sup×comms: idempotent delivery confirm → calendar task + contextual thread anchor.
 */
import { NextRequest, NextResponse } from 'next/server';
import { jsonWorkshop2ErrorRu } from '@/lib/production/workshop2-api-error-ru';
import { withWorkshop2ApiErrorRu } from '@/lib/production/workshop2-api-route-ru';
import { guardWorkshop2Route, WORKSHOP2_WRITE_ROLES } from '@/lib/server/workshop2-route-auth';
import { ensurePlatformCoreSupplierDeliveryConfirmEvent } from '@/lib/server/platform-core-supplier-delivery-confirm';

type RouteCtx = { params: Promise<{ orderId: string }> };

export const POST = withWorkshop2ApiErrorRu(async function postSupplierDeliveryConfirm(
  req: NextRequest,
  ctx: RouteCtx
) {
  const auth = await guardWorkshop2Route(req, WORKSHOP2_WRITE_ROLES);
  if (auth instanceof NextResponse) return auth;

  const { orderId: rawOrderId } = await ctx.params;
  const orderId = rawOrderId.trim();
  if (!orderId) {
    return jsonWorkshop2ErrorRu(400, 'invalid_body', { messageRu: 'Укажите orderId.' });
  }

  let body: Record<string, unknown> = {};
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return jsonWorkshop2ErrorRu(400, 'invalid_json');
  }

  const collectionId = String(body.collectionId ?? '').trim();
  const articleId = String(body.articleId ?? '').trim();
  const productionOrderId = String(body.productionOrderId ?? '').trim() || undefined;
  const confirmedCountRaw = body.confirmedCount;
  const confirmedCount =
    typeof confirmedCountRaw === 'number' && Number.isFinite(confirmedCountRaw)
      ? Math.max(0, Math.floor(confirmedCountRaw))
      : 1;

  if (!collectionId || !articleId) {
    return jsonWorkshop2ErrorRu(400, 'invalid_body', {
      messageRu: 'Укажите collectionId и articleId.',
    });
  }

  const result = await ensurePlatformCoreSupplierDeliveryConfirmEvent({
    collectionId,
    b2bOrderId: orderId,
    articleId,
    confirmedCount,
    productionOrderId,
  });

  return NextResponse.json({
    ok: true,
    orderId,
    created: result.created,
    taskId: `supplier-delivery-${orderId}`,
  });
});
