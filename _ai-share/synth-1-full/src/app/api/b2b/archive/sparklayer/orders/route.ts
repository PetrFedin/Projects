/**
 * GET /api/b2b/sparklayer/orders — список заказов.
 * POST /api/b2b/sparklayer/orders — создание заказа.
 * Query (GET): customerId, status, limit. Body (POST): SparkLayerCreateOrderPayload.
 */

import { NextResponse } from 'next/server';
import {
  sparkLayerGetOrders,
  sparkLayerCreateOrder,
} from '@/lib/b2b/integrations/archive/sparklayer-core';
import type { SparkLayerCreateOrderPayload } from '@/lib/b2b/integrations/archive/sparklayer-core';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get('customerId') ?? undefined;
    const status = searchParams.get('status') ?? undefined;
    const limitParam = searchParams.get('limit');
    const limit = limitParam ? parseInt(limitParam, 10) : undefined;
    const orders = await sparkLayerGetOrders({ customerId, status, limit });
    return NextResponse.json(orders);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as SparkLayerCreateOrderPayload;
    if (!body?.customerId || !body?.lines?.length) {
      return NextResponse.json(
        { success: false, error: 'Body must include customerId and lines array' },
        { status: 400 }
      );
    }
    const result = await sparkLayerCreateOrder(body);
    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json(
      { success: false, error: e instanceof Error ? e.message : 'Create order failed' },
      { status: 500 }
    );
  }
}
