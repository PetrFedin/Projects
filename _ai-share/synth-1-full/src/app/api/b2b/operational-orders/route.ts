import { NextRequest, NextResponse } from 'next/server';
import { getOrCreateRequestId } from '@/lib/api/response-contract';
import { getApiContractMode } from '@/lib/runtime-mode';
import {
  findOperationalOrderForRequest,
  operationalOrdersForRequest,
} from '@/lib/order/b2b-operational-api-server';
import { ensureSpineImportedOrdersStoreReady } from '@/lib/integrations/spine/imported-orders-persistence';

/**
 * GET /api/b2b/operational-orders — legacy envelope (строка = `B2BOrder` / поле `order`).
 */
export async function GET(req: NextRequest) {
  await ensureSpineImportedOrdersStoreReady();
  const requestId = getOrCreateRequestId(req);
  const mode = getApiContractMode();
  const orders = await operationalOrdersForRequest(req);
  return NextResponse.json(
    { ok: true as const, data: { orders }, meta: { requestId, mode } },
    { headers: { 'x-request-id': requestId } }
  );
}
