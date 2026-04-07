/**
 * GET /api/b2b/sparklayer/customer-rules — правила по клиентам (лимиты, прайс-листы, способы оплаты).
 * Query: customerId.
 */

import { NextResponse } from 'next/server';
import { sparkLayerGetCustomerRules } from '@/lib/b2b/integrations/archive/sparklayer-core';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get('customerId') ?? undefined;
    const rules = await sparkLayerGetCustomerRules(customerId);
    return NextResponse.json(rules);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Failed to fetch customer rules' },
      { status: 500 }
    );
  }
}
