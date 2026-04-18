import { NextRequest, NextResponse } from 'next/server';
import { getOrCreateRequestId } from '@/lib/api/response-contract';
import { getApiContractMode } from '@/lib/runtime-mode';
import { operationalOrdersForRequest, toV1ListDto } from '@/lib/order/b2b-operational-api-server';

/**
 * GET /api/b2b/v1/operational-orders — list DTO (`wholesaleOrderId`).
 */
export async function GET(req: NextRequest) {
  const requestId = getOrCreateRequestId(req);
  const mode = getApiContractMode();
  const orders = toV1ListDto(operationalOrdersForRequest(req));
  return NextResponse.json(
    {
      ok: true as const,
      data: { orders },
      meta: { requestId, mode, apiVersion: 'v1' as const },
    },
    { headers: { 'x-request-id': requestId } }
  );
}
