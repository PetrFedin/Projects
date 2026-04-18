import { NextRequest, NextResponse } from 'next/server';
import { generateDesignVariants } from '@/ai/flows/design-assistant';
import { getOrCreateRequestId, jsonError } from '@/lib/api/response-contract';
import { getRuntimeMode } from '@/lib/runtime-mode';
import type { DesignPrompt } from '@/lib/types/ai-design';

export async function POST(req: NextRequest) {
  const requestId = getOrCreateRequestId(req);
  const meta = { requestId, mode: getRuntimeMode() };

  try {
    const body = (await req.json()) as {
      brandId?: string;
      prompt?: DesignPrompt;
      count?: number;
    };

    const brandId = typeof body.brandId === 'string' ? body.brandId.trim() : '';
    const prompt = body.prompt;
    const count = typeof body.count === 'number' ? body.count : NaN;

    if (!brandId || !prompt?.id || !prompt?.text || !Number.isFinite(count) || count <= 0) {
      return jsonError(
        {
          code: 'BAD_REQUEST',
          message: 'brandId, prompt and count (>0) are required',
          status: 400,
          meta,
        },
        { headers: { 'x-request-id': requestId } }
      );
    }

    const result = await generateDesignVariants({ brandId, prompt, count });
    return NextResponse.json(result, { headers: { 'x-request-id': requestId } });
  } catch (e) {
    return jsonError(
      {
        code: 'INTERNAL',
        message: 'Failed to generate design variants',
        status: 500,
        meta,
        cause: e,
      },
      { headers: { 'x-request-id': requestId } }
    );
  }
}
