/**
 * POST /api/b2b/colect/add-to-order — добавление Key Look в заказ.
 * Body: ColectAddToOrderPayload (lookbookId, keyLookId, skus). При появлении API.
 */

import { NextResponse } from 'next/server';
import { colectAddKeyLookToOrder } from '@/lib/b2b/integrations/archive/colect-client';
import type { ColectAddToOrderPayload } from '@/lib/b2b/integrations/archive/colect-client';

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ColectAddToOrderPayload;
    if (!body?.lookbookId || !body?.keyLookId || !body?.skus?.length) {
      return NextResponse.json(
        { success: false, error: 'Body must include lookbookId, keyLookId and skus array' },
        { status: 400 }
      );
    }
    const result = await colectAddKeyLookToOrder(body);
    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json(
      { success: false, error: e instanceof Error ? e.message : 'Add to order failed' },
      { status: 500 }
    );
  }
}
