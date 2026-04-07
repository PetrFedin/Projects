/**
 * GET /api/b2b/zedonk/consolidated-orders — сводные заказы агента (multi-brand). При появлении API.
 * Query: since, limit.
 */

import { NextResponse } from 'next/server';
import { getZedonkConfigFromEnv } from '@/lib/b2b/integrations/archive/zedonk-client';
import { zedonkGetConsolidatedOrders } from '@/lib/b2b/integrations/archive/zedonk-client';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const since = searchParams.get('since') ?? undefined;
    const limitParam = searchParams.get('limit');
    const limit = limitParam ? parseInt(limitParam, 10) : undefined;
    const config = getZedonkConfigFromEnv();
    const orders = await zedonkGetConsolidatedOrders(config, { since, limit });
    return NextResponse.json(orders);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Failed to fetch consolidated orders' },
      { status: 500 }
    );
  }
}
