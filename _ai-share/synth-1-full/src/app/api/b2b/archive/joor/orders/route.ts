/**
 * GET /api/b2b/joor/orders — импорт заказов из JOOR (v4).
 * Query: since, until, status, limit.
 */

import { NextResponse } from 'next/server';
import { getJoorConfigFromEnv } from '@/lib/b2b/integrations/archive/joor-api';
import { joorFetchOrders } from '@/lib/b2b/integrations/archive/joor-orders';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const since = searchParams.get('since') ?? undefined;
    const until = searchParams.get('until') ?? undefined;
    const status = searchParams.get('status') ?? undefined;
    const limitParam = searchParams.get('limit');
    const limit = limitParam ? parseInt(limitParam, 10) : undefined;
    const config = getJoorConfigFromEnv();
    const orders = await joorFetchOrders(config, { since, until, status, limit });
    return NextResponse.json(orders);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}
