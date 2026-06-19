/**
 * POST /api/b2b/nuorder/shipment — отправка статуса отгрузки в NuOrder (Orders Shipments).
 * Body: NuOrderShipmentPayload (order_id, tracking_number?, carrier?, status?, lines?).
 * Wave C2: optional wholesaleOrderId → spine shop tracking mirror.
 */

import { NextResponse } from 'next/server';
import { getNuOrderConfigFromEnv } from '@/lib/b2b/integrations/archive/nuorder-client';
import { nuorderServerSendShipment } from '@/lib/b2b/integrations/archive/nuorder-server';
import type { NuOrderShipmentPayload } from '@/lib/b2b/integrations/archive/nuorder-client';
import { pushNuOrderShipmentSpine } from '@/lib/integrations/spine/nuorder-shipment-spine.service';

type ShipmentBody = NuOrderShipmentPayload & {
  wholesaleOrderId?: string;
  shipped_at?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ShipmentBody;
    if (!body?.order_id && !body.wholesaleOrderId) {
      return NextResponse.json(
        { success: false, error: 'Body must include order_id or wholesaleOrderId' },
        { status: 400 }
      );
    }

    let spineMirror: Awaited<ReturnType<typeof pushNuOrderShipmentSpine>> | null = null;
    if (body.wholesaleOrderId?.trim() || body.order_id) {
      spineMirror = await pushNuOrderShipmentSpine({
        wholesaleOrderId: body.wholesaleOrderId?.trim(),
        externalOrderId: body.order_id,
        trackingNumber: body.tracking_number,
        carrier: body.carrier,
        status: body.status,
        shippedAt: body.shipped_at,
      });
    }

    const config = getNuOrderConfigFromEnv();
    if (!config) {
      if (spineMirror) {
        return NextResponse.json({
          success: true,
          spine: spineMirror,
          note: 'NuOrder env not configured — spine mirror only',
        });
      }
      return NextResponse.json(
        { success: false, error: 'NuOrder not configured (env)' },
        { status: 503 }
      );
    }

    const orderId = body.order_id ?? spineMirror?.wholesaleOrderId;
    if (!orderId) {
      return NextResponse.json(
        { success: false, error: 'order_id required for NuOrder outbound' },
        { status: 400 }
      );
    }

    const result = await nuorderServerSendShipment(config, {
      ...body,
      order_id: orderId,
    });
    return NextResponse.json({ ...result, spine: spineMirror ?? undefined });
  } catch (e) {
    return NextResponse.json(
      { success: false, error: e instanceof Error ? e.message : 'Shipment send failed' },
      { status: 500 }
    );
  }
}
