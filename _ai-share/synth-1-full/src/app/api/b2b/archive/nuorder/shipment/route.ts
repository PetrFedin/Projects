/**
 * POST /api/b2b/nuorder/shipment — отправка статуса отгрузки в NuOrder (Orders Shipments).
 * Body: NuOrderShipmentPayload (order_id, tracking_number?, carrier?, status?, lines?).
 */

import { NextResponse } from 'next/server';
import { getNuOrderConfigFromEnv } from '@/lib/b2b/integrations/archive/nuorder-client';
import { nuorderServerSendShipment } from '@/lib/b2b/integrations/archive/nuorder-server';
import type { NuOrderShipmentPayload } from '@/lib/b2b/integrations/archive/nuorder-client';

export async function POST(request: Request) {
  try {
    const config = getNuOrderConfigFromEnv();
    if (!config) {
      return NextResponse.json(
        { success: false, error: 'NuOrder not configured (env)' },
        { status: 503 }
      );
    }
    const body = (await request.json()) as NuOrderShipmentPayload;
    if (!body?.order_id) {
      return NextResponse.json(
        { success: false, error: 'Body must include order_id' },
        { status: 400 }
      );
    }
    const result = await nuorderServerSendShipment(config, body);
    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json(
      { success: false, error: e instanceof Error ? e.message : 'Shipment send failed' },
      { status: 500 }
    );
  }
}
