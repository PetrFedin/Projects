import { NextRequest, NextResponse } from 'next/server';
import { getOrCreateRequestId } from '@/lib/api/response-contract';
import { getApiContractMode } from '@/lib/runtime-mode';
import { operationalOrdersForRequest } from '@/lib/order/b2b-operational-api-server';

/**
 * GET /api/b2b/operational-orders — legacy envelope (строка = `B2BOrder` / поле `order`).
 */
export async function GET(req: NextRequest) {
  const requestId = getOrCreateRequestId(req);
  const mode = getApiContractMode();
  const orders = operationalOrdersForRequest(req);
  return NextResponse.json(
    { ok: true as const, data: { orders }, meta: { requestId, mode } },
    { headers: { 'x-request-id': requestId } }
  );
}
