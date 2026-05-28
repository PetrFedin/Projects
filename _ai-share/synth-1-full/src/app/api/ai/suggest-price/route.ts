import { NextRequest, NextResponse } from 'next/server';
import { suggestProductPrice } from '@/ai/flows/suggest-product-price';
import { getOrCreateRequestId, jsonError } from '@/lib/api/response-contract';
import { getRuntimeMode } from '@/lib/runtime-mode';

export async function POST(req: NextRequest) {
  const requestId = getOrCreateRequestId(req);
  const meta = { requestId, mode: getRuntimeMode() };

  try {
    const body = (await req.json()) as {
      productName?: string;
      productionCost?: number;
      category?: string;
      brandSegment?: string;
    };

    const productName = typeof body.productName === 'string' ? body.productName.trim() : '';
    const productionCost = typeof body.productionCost === 'number' ? body.productionCost : NaN;
    const category = typeof body.category === 'string' ? body.category.trim() : '';
    const brandSegment = typeof body.brandSegment === 'string' ? body.brandSegment.trim() : '';

    if (!productName || !Number.isFinite(productionCost) || !category || !brandSegment) {
      return jsonError(
        {
          code: 'BAD_REQUEST',
          message: 'productName, productionCost, category and brandSegment are required',
          status: 400,
          meta,
        },
        { headers: { 'x-request-id': requestId } }
      );
    }

    const result = await suggestProductPrice({
      productName,
      productionCost,
      category,
      brandSegment,
    });
    return NextResponse.json(result, { headers: { 'x-request-id': requestId } });
  } catch (e) {
    return jsonError(
      { code: 'INTERNAL', message: 'Failed to suggest price', status: 500, meta, cause: e },
      { headers: { 'x-request-id': requestId } }
    );
  }
}
