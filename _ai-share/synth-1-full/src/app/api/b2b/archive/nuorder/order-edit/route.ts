/**
 * PUT /api/b2b/nuorder/order-edit — обновление заказа в NuOrder (Orders Edits / amendments).
 * Body: NuOrderOrderEditPayload (order_id, lines?, note?).
 */

import { NextResponse } from 'next/server';
import { getNuOrderConfigFromEnv } from '@/lib/b2b/integrations/archive/nuorder-client';
import { nuorderServerUpdateOrder } from '@/lib/b2b/integrations/archive/nuorder-server';
import type { NuOrderOrderEditPayload } from '@/lib/b2b/integrations/archive/nuorder-client';

export async function PUT(request: Request) {
  try {
    const config = getNuOrderConfigFromEnv();
    if (!config) {
      return NextResponse.json(
        { success: false, error: 'NuOrder not configured (env)' },
        { status: 503 }
      );
    }
    const body = (await request.json()) as NuOrderOrderEditPayload;
    if (!body?.order_id) {
      return NextResponse.json(
        { success: false, error: 'Body must include order_id' },
        { status: 400 }
      );
    }
    const result = await nuorderServerUpdateOrder(config, body);
    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json(
      { success: false, error: e instanceof Error ? e.message : 'Order edit failed' },
      { status: 500 }
    );
  }
}
