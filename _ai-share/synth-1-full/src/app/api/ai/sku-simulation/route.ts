import { NextRequest, NextResponse } from 'next/server';
import { simulateCollectionDemand } from '@/ai/flows/sku-planner';
import { getOrCreateRequestId, jsonError } from '@/lib/api/response-contract';
import { getRuntimeMode } from '@/lib/runtime-mode';
import type { PlannedSKU } from '@/lib/types/analytics';

export async function POST(req: NextRequest) {
  const requestId = getOrCreateRequestId(req);
  const meta = { requestId, mode: getRuntimeMode() };

  try {
    const body = (await req.json()) as {
      brandId?: string;
      plannedItems?: Partial<PlannedSKU>[];
    };

    const brandId = typeof body.brandId === 'string' ? body.brandId.trim() : '';
    const plannedItems = Array.isArray(body.plannedItems) ? body.plannedItems : [];

    if (!brandId || plannedItems.length === 0) {
      return jsonError(
        {
          code: 'BAD_REQUEST',
          message: 'brandId and plannedItems are required',
          status: 400,
          meta,
        },
        { headers: { 'x-request-id': requestId } }
      );
    }

    const result = await simulateCollectionDemand({ brandId, plannedItems });
    return NextResponse.json(result, { headers: { 'x-request-id': requestId } });
  } catch (e) {
    return jsonError(
      {
        code: 'INTERNAL',
        message: 'Failed to simulate collection demand',
        status: 500,
        meta,
        cause: e,
      },
      { headers: { 'x-request-id': requestId } }
    );
  }
}
