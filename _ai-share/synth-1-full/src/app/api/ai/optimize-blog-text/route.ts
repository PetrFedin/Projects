import { NextRequest, NextResponse } from 'next/server';
import { optimizeBlogText } from '@/ai/flows/optimize-blog-text';
import { getOrCreateRequestId, jsonError } from '@/lib/api/response-contract';
import { getRuntimeMode } from '@/lib/runtime-mode';

export async function POST(req: NextRequest) {
  const requestId = getOrCreateRequestId(req);
  const meta = { requestId, mode: getRuntimeMode() };

  try {
    const body = (await req.json()) as { text?: string };
    const text = typeof body.text === 'string' ? body.text.trim() : '';
    if (!text) {
      return jsonError(
        { code: 'BAD_REQUEST', message: 'text is required', status: 400, meta },
        { headers: { 'x-request-id': requestId } }
      );
    }

    const result = await optimizeBlogText({ text });
    return NextResponse.json(result, { headers: { 'x-request-id': requestId } });
  } catch (e) {
    return jsonError(
      { code: 'INTERNAL', message: 'Failed to optimize text', status: 500, meta, cause: e },
      { headers: { 'x-request-id': requestId } }
    );
  }
}
