import { NextRequest, NextResponse } from 'next/server';
import { generateChatResponse } from '@/ai/flows/generate-chat-response';
import { getOrCreateRequestId, jsonError } from '@/lib/api/response-contract';
import { getRuntimeMode } from '@/lib/runtime-mode';

type ChatHistoryItem = { role: 'user' | 'model'; content: string };

export async function POST(req: NextRequest) {
  const requestId = getOrCreateRequestId(req);
  const meta = { requestId, mode: getRuntimeMode() };
  try {
    const body = (await req.json()) as {
      query?: string;
      history?: ChatHistoryItem[];
      userId?: string;
    };

    const query = typeof body.query === 'string' ? body.query.trim() : '';
    if (!query) {
      return jsonError(
        { code: 'BAD_REQUEST', message: 'query is required', status: 400, meta },
        { headers: { 'x-request-id': requestId } }
      );
    }

    const result = await generateChatResponse({
      query,
      history: Array.isArray(body.history)
        ? body.history.filter(
            (h): h is ChatHistoryItem =>
              (h?.role === 'user' || h?.role === 'model') && typeof h?.content === 'string'
          )
        : undefined,
      userId: typeof body.userId === 'string' ? body.userId : undefined,
    });

    return NextResponse.json(result, { headers: { 'x-request-id': requestId } });
  } catch (e) {
    return jsonError(
      {
        code: 'INTERNAL',
        message: 'Failed to generate chat response',
        status: 500,
        meta,
        cause: e,
      },
      { headers: { 'x-request-id': requestId } }
    );
  }
}
