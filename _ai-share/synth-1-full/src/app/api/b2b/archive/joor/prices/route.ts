/**
 * POST /api/b2b/joor/prices — массовое обновление цен в JOOR (v4).
 * Body: { prices: JoorPriceItem[] }.
 */

import { NextResponse } from 'next/server';
import { getJoorConfigFromEnv } from '@/lib/b2b/integrations/archive/joor-api';
import { joorUpsertPrices } from '@/lib/b2b/integrations/archive/joor-prices';
import type { JoorPriceItem } from '@/lib/b2b/integrations/archive/joor-prices';

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { prices?: JoorPriceItem[] };
    const prices = body?.prices;
    if (!prices || !Array.isArray(prices)) {
      return NextResponse.json(
        { success: false, error: 'Body must include prices array' },
        { status: 400 }
      );
    }
    const config = getJoorConfigFromEnv();
    const result = await joorUpsertPrices(prices, config);
    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json(
      { success: false, error: e instanceof Error ? e.message : 'Prices update failed' },
      { status: 500 }
    );
  }
}
