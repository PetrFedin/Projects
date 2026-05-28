/**
 * SSE realtime для workshop2 (комната `workshop2:{collectionId}:{articleId}`).
 * Совместимо с Next.js App Router; WebSocket — отдельный процесс при масштабировании (см. plan).
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  getWorkshop2RealtimeHub,
  workshop2RealtimeRoomKey,
  type Workshop2RealtimeEvent,
} from '@/lib/server/workshop2-realtime-hub';
import { guardWorkshop2Route, WORKSHOP2_READ_ROLES } from '@/lib/server/workshop2-route-auth';
import { decodeWorkshop2HeaderValue } from '@/lib/production/workshop2-api-header-codec';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const auth = await guardWorkshop2Route(request, WORKSHOP2_READ_ROLES);
  if (auth instanceof NextResponse) return auth;

  const u = request.nextUrl.searchParams;
  const collectionId = u.get('collectionId')?.trim() ?? '';
  const articleId = u.get('articleId')?.trim() ?? '';
  if (!collectionId || !articleId) {
    return new Response(
      JSON.stringify({
        ok: false,
        error: 'invalid_params',
        message: 'Укажите collectionId и articleId',
      }),
      {
        status: 400,
        headers: { 'content-type': 'application/json' },
      }
    );
  }

  const room = workshop2RealtimeRoomKey(collectionId, articleId);
  const hub = getWorkshop2RealtimeHub();
  const encoder = new TextEncoder();
  const presenceActorId =
    auth.actor?.actorId?.trim() ||
    `sse:${request.headers.get('x-forwarded-for') ?? 'anon'}`.slice(0, 120);
  const headerActorLabel = request.headers.get('x-w2-actor-label')?.trim();
  const presenceActorLabel =
    auth.actor?.actorLabel?.trim() ||
    (headerActorLabel ? decodeWorkshop2HeaderValue(headerActorLabel) : '') ||
    'Участник';

  const stream = new ReadableStream({
    start(controller) {
      const send = (event: Workshop2RealtimeEvent) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
      };

      send({ type: 'ping', ts: new Date().toISOString() });
      hub.touchPresence(collectionId, articleId, {
        actorId: presenceActorId,
        actorLabel: presenceActorLabel,
      });

      const unsubscribe = hub.subscribe(room, send);

      const keepalive = setInterval(() => {
        send({ type: 'ping', ts: new Date().toISOString() });
      }, 25_000);

      request.signal.addEventListener('abort', () => {
        clearInterval(keepalive);
        hub.leavePresence(collectionId, articleId, presenceActorId);
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
