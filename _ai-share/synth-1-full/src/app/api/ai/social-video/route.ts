import { NextRequest, NextResponse } from 'next/server';
import { generateSocialVideo } from '@/ai/flows/generate-social-video';
import { getOrCreateRequestId, jsonError } from '@/lib/api/response-contract';
import { getRuntimeMode } from '@/lib/runtime-mode';

export async function POST(req: NextRequest) {
  const requestId = getOrCreateRequestId(req);
  const meta = { requestId, mode: getRuntimeMode() };

  try {
    const body = (await req.json()) as {
      prompt?: string;
      productName?: string;
      productImageDataUri?: string;
    };

    const prompt = typeof body.prompt === 'string' ? body.prompt.trim() : '';
    const productName = typeof body.productName === 'string' ? body.productName.trim() : '';
    const productImageDataUri =
      typeof body.productImageDataUri === 'string' ? body.productImageDataUri.trim() : '';

    if (!prompt || !productName || !productImageDataUri) {
      return jsonError(
        {
          code: 'BAD_REQUEST',
          message: 'prompt, productName and productImageDataUri are required',
          status: 400,
          meta,
        },
        { headers: { 'x-request-id': requestId } }
      );
    }

    const result = await generateSocialVideo({ prompt, productName, productImageDataUri });
    return NextResponse.json(result, { headers: { 'x-request-id': requestId } });
  } catch (e) {
    return jsonError(
      { code: 'INTERNAL', message: 'Failed to generate social video', status: 500, meta, cause: e },
      { headers: { 'x-request-id': requestId } }
    );
  }
}
