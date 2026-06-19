import { NextRequest, NextResponse } from 'next/server';
import { getOrCreateRequestId } from '@/lib/api/response-contract';
import { getApiContractMode } from '@/lib/runtime-mode';
import {
  findOperationalOrderForRequest,
  toV1DetailDto,
} from '@/lib/order/b2b-operational-api-server';
import { ensureSpineImportedOrdersStoreReady } from '@/lib/integrations/spine/imported-orders-persistence';

/**
 * GET /api/b2b/v1/operational-orders/:orderId — detail DTO.
 */
export async function GET(req: NextRequest, ctx: { params: Promise<{ orderId: string }> }) {
  await ensureSpineImportedOrdersStoreReady();
  const { orderId } = await ctx.params;
  const requestId = getOrCreateRequestId(req);
  const mode = getApiContractMode();
  const decoded = decodeURIComponent(orderId);
  const row = await findOperationalOrderForRequest(req, decoded);
  if (!row) {
    return NextResponse.json(
      {
        ok: false as const,
        error: { code: 'NOT_FOUND', message: 'Order not found' },
        meta: { requestId, mode, apiVersion: 'v1' as const },
      },
      { status: 404, headers: { 'x-request-id': requestId } }
    );
  }
  return NextResponse.json(
    {
      ok: true as const,
      data: { order: await toV1DetailDto(row) },
      meta: { requestId, mode, apiVersion: 'v1' as const },
    },
    { headers: { 'x-request-id': requestId } }
  );
}
