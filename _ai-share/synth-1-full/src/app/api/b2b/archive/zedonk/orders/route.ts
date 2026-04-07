/**
 * GET /api/b2b/zedonk/orders — приём заказов из Zedonk (и при необходимости из JOOR/NuOrder через него).
 * Query: since, until, status, limit.
 */

import { NextResponse } from 'next/server';
import { getZedonkConfigFromEnv } from '@/lib/b2b/integrations/archive/zedonk-client';
import { zedonkFetchOrders } from '@/lib/b2b/integrations/archive/zedonk-client';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const since = searchParams.get('since') ?? undefined;
    const until = searchParams.get('until') ?? undefined;
    const status = searchParams.get('status') ?? undefined;
    const limitParam = searchParams.get('limit');
    const limit = limitParam ? parseInt(limitParam, 10) : undefined;
    const config = getZedonkConfigFromEnv();
    const orders = await zedonkFetchOrders(config, { since, until, status, limit });
    return NextResponse.json(orders);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}
