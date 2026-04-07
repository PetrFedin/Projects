/**
 * POST /api/b2b/joor/inventory — выгрузка остатков в JOOR (v2).
 * Body: JoorInventoryPayload (items, overwrite?, decPending?).
 */

import { NextResponse } from 'next/server';
import { getJoorConfigFromEnv } from '@/lib/b2b/integrations/archive/joor-api';
import { joorPushInventory } from '@/lib/b2b/integrations/archive/joor-inventory';
import type { JoorInventoryPayload } from '@/lib/b2b/integrations/archive/joor-inventory';

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as JoorInventoryPayload;
    if (!body?.items || !Array.isArray(body.items)) {
      return NextResponse.json(
        { success: false, error: 'Body must include items array' },
        { status: 400 }
      );
    }
    const config = getJoorConfigFromEnv();
    const result = await joorPushInventory(body, config);
    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json(
      { success: false, error: e instanceof Error ? e.message : 'Inventory push failed' },
      { status: 500 }
    );
  }
}
