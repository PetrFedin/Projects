/**
 * GET/POST — трек-номер оптового PG-заказа (B2B-\\d+) → logistics PG + spine mirror.
 */
import { jsonWorkshop2ErrorRu } from '@/lib/production/workshop2-api-error-ru';
import { withWorkshop2ApiErrorRu } from '@/lib/production/workshop2-api-route-ru';
import {
  resolveWorkshop2B2bLogisticsTracking,
  syncWorkshop2B2bOrderLogisticsTracking,
} from '@/lib/server/workshop2-b2b-order-logistics-tracking';
import { guardWorkshop2Route, WORKSHOP2_WRITE_ROLES } from '@/lib/server/workshop2-route-auth';
import { resolveWorkshop2UpdatedBy } from '@/lib/server/workshop2-api-context';
import { NextRequest, NextResponse } from 'next/server';

type RouteCtx = { params: Promise<{ orderId: string }> };

export const GET = withWorkshop2ApiErrorRu(async function getB2bLogisticsTracking(
  _req: NextRequest,
  ctx: RouteCtx
) {
  const { orderId: rawId } = await ctx.params;
  const orderId = rawId?.trim();
  if (!orderId) return jsonWorkshop2ErrorRu(400, 'invalid_path');

  const snapshot = await resolveWorkshop2B2bLogisticsTracking(orderId);
  return NextResponse.json({ ok: true, ...snapshot });
});

export const POST = withWorkshop2ApiErrorRu(async function postB2bLogisticsTracking(
  req: NextRequest,
  ctx: RouteCtx
) {
  const auth = await guardWorkshop2Route(req, WORKSHOP2_WRITE_ROLES);
  if (auth instanceof NextResponse) return auth;

  const { orderId: rawId } = await ctx.params;
  const orderId = rawId?.trim();
  if (!orderId) return jsonWorkshop2ErrorRu(400, 'invalid_path');

  let body: Record<string, unknown> = {};
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return jsonWorkshop2ErrorRu(400, 'invalid_json');
  }

  const trackingNumber = String(body.trackingNumber ?? '').trim();
  const carrier = body.carrier ? String(body.carrier).trim() : undefined;
  const actor = resolveWorkshop2UpdatedBy(req, String(body.actor ?? ''), auth.actor);

  const result = await syncWorkshop2B2bOrderLogisticsTracking({
    orderId,
    trackingNumber,
    carrier,
    actor: actor ?? undefined,
  });

  if (!result.ok) {
    return jsonWorkshop2ErrorRu(400, result.error, { messageRu: result.messageRu });
  }

  return NextResponse.json({
    ok: true,
    orderId,
    trackingNumber: result.trackingNumber,
    carrier: result.shipment.carrier ?? null,
    status: result.shipment.status,
    messageRu: `Трек-номер сохранён · ${result.trackingNumber}`,
  });
});
