/**
 * GET /api/b2b/fashion-cloud/orders — импорт заказов из Fashion Cloud.
 * Query: brandId, status, since, limit.
 */

import { NextResponse } from 'next/server';
import { fashionCloudGetOrders } from '@/lib/b2b/integrations/archive/fashion-cloud-client';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const brandId = searchParams.get('brandId') ?? undefined;
    const status = searchParams.get('status') ?? undefined;
    const since = searchParams.get('since') ?? undefined;
    const limitParam = searchParams.get('limit');
    const limit = limitParam ? parseInt(limitParam, 10) : undefined;
    const orders = await fashionCloudGetOrders({ brandId, status, since, limit }, null);
    return NextResponse.json(orders);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}
