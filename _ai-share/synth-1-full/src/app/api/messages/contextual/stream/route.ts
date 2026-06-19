/**
 * SSE realtime для contextual chat (комната `contextual:{contextType}:{contextId}`).
 */
import { NextRequest, NextResponse } from 'next/server';
import {
  getWorkshop2RealtimeHub,
  workshop2ContextualRoomKey,
  type Workshop2RealtimeEvent,
} from '@/lib/server/workshop2-realtime-hub';
import { guardWorkshop2Route, WORKSHOP2_READ_ROLES } from '@/lib/server/workshop2-route-auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const auth = await guardWorkshop2Route(request, WORKSHOP2_READ_ROLES);
  if (auth instanceof NextResponse) return auth;

  const u = request.nextUrl.searchParams;
  const contextType = u.get('contextType')?.trim() ?? '';
  const contextId = u.get('contextId')?.trim() ?? '';
  if (!contextType || !contextId) {
    return NextResponse.json(
      { ok: false, error: 'invalid_params', message: 'Укажите contextType и contextId' },
      { status: 400 }
    );
  }

  const room = workshop2ContextualRoomKey(contextType, contextId);
  const hub = getWorkshop2RealtimeHub();
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      const send = (event: Workshop2RealtimeEvent) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
      };

      send({ type: 'ping', ts: new Date().toISOString() });

      const unsubscribe = hub.subscribe(room, send);

      const keepalive = setInterval(() => {
        send({ type: 'ping', ts: new Date().toISOString() });
      }, 25_000);

      request.signal.addEventListener('abort', () => {
        clearInterval(keepalive);
        unsubscribe();
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  });
}
