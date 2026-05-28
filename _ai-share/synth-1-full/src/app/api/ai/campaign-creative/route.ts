import { NextRequest, NextResponse } from 'next/server';
import { generateCampaignCreative } from '@/ai/flows/generate-campaign-creative';
import { getOrCreateRequestId, jsonError } from '@/lib/api/response-contract';
import { getRuntimeMode } from '@/lib/runtime-mode';

export async function POST(req: NextRequest) {
  const requestId = getOrCreateRequestId(req);
  const meta = { requestId, mode: getRuntimeMode() };

  try {
    const body = (await req.json()) as {
      productName?: string;
      productPrice?: string;
      productImageDataUri?: string;
      prompt?: string;
    };

    const productName = typeof body.productName === 'string' ? body.productName.trim() : '';
    const productPriceRaw = typeof body.productPrice === 'string' ? body.productPrice.trim() : '';
    const productPrice = productPriceRaw.length > 0 ? productPriceRaw : '—';
    const productImageDataUri =
      typeof body.productImageDataUri === 'string' ? body.productImageDataUri.trim() : '';
    const prompt = typeof body.prompt === 'string' ? body.prompt.trim() : '';

    if (!productName || !productImageDataUri || !prompt) {
      return jsonError(
        {
          code: 'BAD_REQUEST',
          message: 'productName, productImageDataUri and prompt are required',
          status: 400,
          meta,
        },
        { headers: { 'x-request-id': requestId } }
      );
    }

    const result = await generateCampaignCreative({
      productName,
      productPrice,
      productImageDataUri,
      prompt,
    });

    return NextResponse.json(result, { headers: { 'x-request-id': requestId } });
  } catch (e) {
    return jsonError(
      {
        code: 'INTERNAL',
        message: 'Failed to generate campaign creative',
        status: 500,
        meta,
        cause: e,
      },
      { headers: { 'x-request-id': requestId } }
    );
  }
}
