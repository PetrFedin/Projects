/**
 * GET /api/b2b/sparklayer/discounts — скидки (по клиенту, активные).
 * Query: customerId, valid.
 */

import { NextResponse } from 'next/server';
import { sparkLayerGetDiscounts } from '@/lib/b2b/integrations/archive/sparklayer-core';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get('customerId') ?? undefined;
    const validParam = searchParams.get('valid');
    const valid = validParam === 'true' ? true : validParam === 'false' ? false : undefined;
    const discounts = await sparkLayerGetDiscounts({ customerId, valid });
    return NextResponse.json(discounts);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Failed to fetch discounts' },
      { status: 500 }
    );
  }
}
