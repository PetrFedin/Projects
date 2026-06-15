/**
 * GET/PATCH — per-order override ShopProductionVisibility (приоритет над коллекцией).
 */
import { jsonWorkshop2ErrorRu } from '@/lib/production/workshop2-api-error-ru';
import { withWorkshop2ApiErrorRu } from '@/lib/production/workshop2-api-route-ru';
import {
  getShopProductionVisibilityPolicy,
  isShopProductionVisibility,
  type ShopProductionVisibility,
} from '@/lib/platform-core-shop-production-visibility';
import {
  getOrderShopProductionVisibility as loadOrderShopProductionVisibility,
  patchOrderShopProductionVisibility,
  resolveShopProductionVisibilityPolicyForOrder,
} from '@/lib/server/workshop2-shop-production-visibility-repository';
import { guardWorkshop2Route, WORKSHOP2_WRITE_ROLES } from '@/lib/server/workshop2-route-auth';
import { NextRequest, NextResponse } from 'next/server';

type RouteCtx = { params: Promise<{ orderId: string }> };

export const GET = withWorkshop2ApiErrorRu(async function getOrderShopProductionVisibilityRoute(
  _req: NextRequest,
  ctx: RouteCtx
) {
  const { orderId: rawId } = await ctx.params;
  const orderId = rawId?.trim();
  if (!orderId) {
    return jsonWorkshop2ErrorRu(400, 'invalid_path');
  }

  const orderOverride = await loadOrderShopProductionVisibility(orderId);
  const resolved = await resolveShopProductionVisibilityPolicyForOrder({
    orderId,
    collectionId: orderOverride.collectionId,
  });

  return NextResponse.json({
    ok: true,
    orderId,
    orderOverride: orderOverride.visibility ?? null,
    visibility: resolved.visibility,
    source: resolved.source,
    policy: getShopProductionVisibilityPolicy(resolved.visibility),
  });
});

export const PATCH = withWorkshop2ApiErrorRu(async function patchOrderShopProductionVisibilityRoute(
  req: NextRequest,
  ctx: RouteCtx
) {
  const auth = await guardWorkshop2Route(req, WORKSHOP2_WRITE_ROLES);
  if (auth instanceof NextResponse) return auth;

  const { orderId: rawId } = await ctx.params;
  const orderId = rawId?.trim();
  if (!orderId) {
    return jsonWorkshop2ErrorRu(400, 'invalid_path');
  }

  let body: Record<string, unknown> = {};
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return jsonWorkshop2ErrorRu(400, 'invalid_json');
  }

  const clear = body.clear === true;
  const visibilityRaw = body.visibility;
  let visibility: ShopProductionVisibility | null = null;
  if (!clear) {
    const v = String(visibilityRaw ?? '').trim();
    if (!isShopProductionVisibility(v)) {
      return jsonWorkshop2ErrorRu(400, 'invalid_visibility', {
        messageRu: 'Укажите visibility: none | milestones | logistics | full или clear: true.',
      });
    }
    visibility = v;
  }

  const result = await patchOrderShopProductionVisibility({ orderId, visibility });
  if (!result.ok) {
    const status = result.error === 'not_found' ? 404 : 400;
    return jsonWorkshop2ErrorRu(status, result.error, { messageRu: result.messageRu });
  }

  const resolved = await resolveShopProductionVisibilityPolicyForOrder({ orderId });
  return NextResponse.json({
    ok: true,
    orderId,
    orderOverride: visibility,
    visibility: resolved.visibility,
    source: resolved.source,
    policy: getShopProductionVisibilityPolicy(resolved.visibility),
    messageRu: clear
      ? 'Переопределение снято — действует регламент коллекции.'
      : 'Регламент для заказа сохранён.',
  });
});
