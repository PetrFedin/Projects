/**
 * GET — отгрузки артикула; POST — создать/обновить отгрузку (связь с заказом образца).
 */
import { jsonWorkshop2ErrorRu } from '@/lib/production/workshop2-api-error-ru';
import { withWorkshop2ApiErrorRu } from '@/lib/production/workshop2-api-route-ru';
import { NextRequest, NextResponse } from 'next/server';
import {
  listWorkshop2LogisticsShipments,
  upsertWorkshop2LogisticsShipment,
} from '@/lib/server/workshop2-logistics-repository';
import {
  guardWorkshop2Route,
  WORKSHOP2_READ_ROLES,
  WORKSHOP2_WRITE_ROLES,
} from '@/lib/server/workshop2-route-auth';

type RouteCtx = { params: Promise<{ collectionId: string; articleId: string }> };

async function getLogistics(req: NextRequest, ctx: RouteCtx) {
  const auth = await guardWorkshop2Route(req, WORKSHOP2_READ_ROLES);
  if (auth instanceof NextResponse) return auth;

  const { collectionId, articleId } = await ctx.params;
  const shipments = await listWorkshop2LogisticsShipments({
    collectionId: collectionId.trim(),
    articleId: articleId.trim(),
  });
  return NextResponse.json({ ok: true, shipments });
}

async function postLogistics(req: NextRequest, ctx: RouteCtx) {
  const auth = await guardWorkshop2Route(req, WORKSHOP2_WRITE_ROLES);
  if (auth instanceof NextResponse) return auth;

  const { collectionId, articleId } = await ctx.params;
  let body: Record<string, unknown> = {};
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return jsonWorkshop2ErrorRu(400, 'invalid_json');
  }

  const shipment = await upsertWorkshop2LogisticsShipment({
    collectionId: collectionId.trim(),
    articleId: articleId.trim(),
    sampleOrderId: body.sampleOrderId ? String(body.sampleOrderId).trim() : undefined,
    trackingNumber: body.trackingNumber ? String(body.trackingNumber) : undefined,
    carrier: body.carrier ? String(body.carrier) : undefined,
    originLabel: body.originLabel ? String(body.originLabel) : undefined,
    destinationLabel: body.destinationLabel ? String(body.destinationLabel) : undefined,
    currentStep: body.currentStep ? String(body.currentStep) : undefined,
    status: body.status as 'draft' | 'in_transit' | 'delivered' | 'cancelled' | undefined,
    reason: body.reason ? String(body.reason) : undefined,
    actorRole: body.actorRole as
      | 'brand_logist'
      | 'brand_prod'
      | 'supplier'
      | 'carrier_tms'
      | 'partner'
      | undefined,
    actorName: body.actorName ? String(body.actorName) : undefined,
    syncSource: body.syncSource as 'manual' | 'tms' | 'partner_portal' | undefined,
    meta:
      body.meta && typeof body.meta === 'object'
        ? (body.meta as {
            shippedAt?: string;
            etaAt?: string;
            notes?: string;
            originContact?: string;
            destinationContact?: string;
            attachmentNote?: string;
          })
        : undefined,
  });

  if ('error' in shipment) {
    return jsonWorkshop2ErrorRu(400, String(shipment.error));
  }

  return NextResponse.json({ ok: true, shipment });
}

export const GET = withWorkshop2ApiErrorRu(getLogistics);
export const POST = withWorkshop2ApiErrorRu(postLogistics);
