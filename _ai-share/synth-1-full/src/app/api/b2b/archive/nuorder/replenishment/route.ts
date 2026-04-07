/**
 * POST /api/b2b/nuorder/replenishment — выгрузка replenishment в NuOrder.
 * Body: NuOrderReplenishmentPayload (items[]).
 */

import { NextResponse } from 'next/server';
import { getNuOrderConfigFromEnv } from '@/lib/b2b/integrations/archive/nuorder-client';
import { nuorderServerPushReplenishment } from '@/lib/b2b/integrations/archive/nuorder-server';
import type { NuOrderReplenishmentPayload } from '@/lib/b2b/integrations/archive/nuorder-client';

export async function POST(request: Request) {
  try {
    const config = getNuOrderConfigFromEnv();
    if (!config) {
      return NextResponse.json(
        { success: false, error: 'NuOrder not configured (env)' },
        { status: 503 }
      );
    }
    const body = (await request.json()) as NuOrderReplenishmentPayload;
    if (!body?.items || !Array.isArray(body.items)) {
      return NextResponse.json(
        { success: false, error: 'Body must include items array' },
        { status: 400 }
      );
    }
    const result = await nuorderServerPushReplenishment(config, body);
    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json(
      { success: false, error: e instanceof Error ? e.message : 'Replenishment failed' },
      { status: 500 }
    );
  }
}
