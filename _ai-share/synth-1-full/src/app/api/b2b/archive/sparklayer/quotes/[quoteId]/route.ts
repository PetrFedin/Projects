/**
 * PATCH /api/b2b/sparklayer/quotes/[quoteId] — обновление статуса КП (workflow).
 * Body: { status: string }.
 */

import { NextResponse } from 'next/server';
import { sparkLayerUpdateQuoteStatus } from '@/lib/b2b/integrations/archive/sparklayer-core';

export async function PATCH(
  _request: Request,
  { params }: { params: Promise<{ quoteId: string }> }
) {
  try {
    const { quoteId } = await params;
    if (!quoteId) {
      return NextResponse.json({ success: false, error: 'quoteId required' }, { status: 400 });
    }
    const body = await _request.json().catch(() => ({})) as { status?: string };
    const status = body?.status ?? 'accepted';
    const result = await sparkLayerUpdateQuoteStatus(quoteId, status);
    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json(
      { success: false, error: e instanceof Error ? e.message : 'Update quote failed' },
      { status: 500 }
    );
  }
}
