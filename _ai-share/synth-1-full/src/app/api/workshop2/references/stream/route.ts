/**
 * SSE для инвалидации справочников workshop2 (heartbeat + событие REFERENCES_INVALIDATED).
 * Клиент может переподписаться на `useWorkshop2Ref*` после invalidate.
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  getWorkshop2ReferencesRealtimeHub,
  type Workshop2ReferencesRealtimeEvent,
} from '@/lib/server/workshop2-references-realtime-hub';
import { guardWorkshop2Route, WORKSHOP2_READ_ROLES } from '@/lib/server/workshop2-route-auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const auth = await guardWorkshop2Route(request, WORKSHOP2_READ_ROLES);
  if (auth instanceof NextResponse) return auth;

  const hub = getWorkshop2ReferencesRealtimeHub();
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      const send = (event: Workshop2ReferencesRealtimeEvent) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
      };

      send({ type: 'ping', ts: new Date().toISOString() });

      const unsubscribe = hub.subscribe(send);

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
