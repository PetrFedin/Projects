import { NextRequest, NextResponse } from 'next/server';
import { getOrCreateRequestId } from '@/lib/api/response-contract';
import { getApiContractMode } from '@/lib/runtime-mode';
import { findOperationalOrderForRequest } from '@/lib/order/b2b-operational-api-server';

/**
 * GET /api/b2b/operational-orders/:orderId — legacy detail.
 */
export async function GET(req: NextRequest, ctx: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await ctx.params;
  const requestId = getOrCreateRequestId(req);
  const mode = getApiContractMode();
  const decoded = decodeURIComponent(orderId);
  const order = findOperationalOrderForRequest(req, decoded);
  if (!order) {
    return NextResponse.json(
      {
        ok: false as const,
        error: { code: 'NOT_FOUND', message: 'Order not found' },
        meta: { requestId, mode },
      },
      { status: 404, headers: { 'x-request-id': requestId } }
    );
  }
  return NextResponse.json(
    { ok: true as const, data: { order }, meta: { requestId, mode } },
    { headers: { 'x-request-id': requestId } }
  );
}
