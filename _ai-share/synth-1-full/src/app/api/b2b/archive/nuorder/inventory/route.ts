/**
 * POST /api/b2b/nuorder/inventory — синхрон остатков в NuOrder (pre-book, ATS).
 * Body: NuOrderInventoryPayload (inventory[], overwrite?).
 */

import { NextResponse } from 'next/server';
import { getNuOrderConfigFromEnv } from '@/lib/b2b/integrations/archive/nuorder-client';
import { nuorderServerPushInventory } from '@/lib/b2b/integrations/archive/nuorder-server';
import type { NuOrderInventoryPayload } from '@/lib/b2b/integrations/archive/nuorder-client';

export async function POST(request: Request) {
  try {
    const config = getNuOrderConfigFromEnv();
    if (!config) {
      return NextResponse.json(
        { success: false, error: 'NuOrder not configured (env)' },
        { status: 503 }
      );
    }
    const body = (await request.json()) as NuOrderInventoryPayload;
    if (!body?.inventory || !Array.isArray(body.inventory)) {
      return NextResponse.json(
        { success: false, error: 'Body must include inventory array' },
        { status: 400 }
      );
    }
    const result = await nuorderServerPushInventory(config, body);
    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json(
      { success: false, error: e instanceof Error ? e.message : 'Inventory sync failed' },
      { status: 500 }
    );
  }
}
