import { NextRequest, NextResponse } from 'next/server';
import { generateCollaborativeLookbook } from '@/ai/flows/generate-collaborative-lookbook';
import { getOrCreateRequestId, jsonError } from '@/lib/api/response-contract';
import { getRuntimeMode } from '@/lib/runtime-mode';

export async function POST(req: NextRequest) {
  const requestId = getOrCreateRequestId(req);
  const meta = { requestId, mode: getRuntimeMode() };

  try {
    const body = (await req.json()) as {
      productOneName?: string;
      productOneImageDataUri?: string;
      productTwoName?: string;
      productTwoImageDataUri?: string;
    };

    const productOneName =
      typeof body.productOneName === 'string' ? body.productOneName.trim() : '';
    const productOneImageDataUri =
      typeof body.productOneImageDataUri === 'string' ? body.productOneImageDataUri.trim() : '';
    const productTwoName =
      typeof body.productTwoName === 'string' ? body.productTwoName.trim() : '';
    const productTwoImageDataUri =
      typeof body.productTwoImageDataUri === 'string' ? body.productTwoImageDataUri.trim() : '';

    if (!productOneName || !productOneImageDataUri || !productTwoName || !productTwoImageDataUri) {
      return jsonError(
        {
          code: 'BAD_REQUEST',
          message:
            'productOneName, productOneImageDataUri, productTwoName and productTwoImageDataUri are required',
          status: 400,
          meta,
        },
        { headers: { 'x-request-id': requestId } }
      );
    }

    const result = await generateCollaborativeLookbook({
      productOneName,
      productOneImageDataUri,
      productTwoName,
      productTwoImageDataUri,
    });

    return NextResponse.json(result, { headers: { 'x-request-id': requestId } });
  } catch (e) {
    return jsonError(
      {
        code: 'INTERNAL',
        message: 'Failed to generate collaborative lookbook',
        status: 500,
        meta,
        cause: e,
      },
      { headers: { 'x-request-id': requestId } }
    );
  }
}
