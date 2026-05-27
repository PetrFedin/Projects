/**
 * GET — SSE stream domain events из outbox poll (Wave 6 deferred from Wave 1).
 * Query: collectionId, articleId, since (ISO timestamp для reconnect).
 */
import { jsonWorkshop2ErrorRu } from '@/lib/production/workshop2-api-error-ru';
import { NextRequest, NextResponse } from 'next/server';
import {
  formatWorkshop2DomainEventsSseData,
  probeWorkshop2DomainEventsSse,
} from '@/lib/production/workshop2-domain-events-sse';
import { listWorkshop2DomainEventsForArticle } from '@/lib/server/workshop2-domain-events';
import { guardWorkshop2Route, WORKSHOP2_READ_ROLES } from '@/lib/server/workshop2-route-auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const auth = guardWorkshop2Route(req, WORKSHOP2_READ_ROLES);
  if (auth instanceof NextResponse) return auth;

  const { searchParams } = new URL(req.url);
  const collectionId = searchParams.get('collectionId')?.trim();
  const articleId = searchParams.get('articleId')?.trim();
  const sinceParam = searchParams.get('since')?.trim() || undefined;

  if (!collectionId || !articleId) {
    return jsonWorkshop2ErrorRu(400, 'missing_collection_or_article');
  }

  const probe = probeWorkshop2DomainEventsSse();
  const pollMs = probe.pollIntervalMs;
  const encoder = new TextEncoder();
  const seenIds = new Set<string>();
  let sinceCursor = sinceParam;

  const stream = new ReadableStream({
    start(controller) {
      const sendRaw = (chunk: string) => controller.enqueue(encoder.encode(chunk));

      sendRaw(formatWorkshop2DomainEventsSseData({ type: 'ping', ts: new Date().toISOString() }));

      const poll = async () => {
        try {
          const events = await listWorkshop2DomainEventsForArticle({
            collectionId,
            articleId,
            since: sinceCursor,
            limit: 50,
          });
          for (const evt of events) {
            if (seenIds.has(evt.id)) continue;
            seenIds.add(evt.id);
            sendRaw(formatWorkshop2DomainEventsSseData({ type: 'domain_event', event: evt }));
            if (!sinceCursor || evt.createdAt > sinceCursor) {
              sinceCursor = evt.createdAt;
            }
          }
        } catch {
          /* poll best-effort */
        }
      };

      void poll();
      const pollTimer = setInterval(() => void poll(), pollMs);
      const heartbeat = setInterval(() => {
        sendRaw(
          formatWorkshop2DomainEventsSseData({
            type: 'heartbeat',
            ts: new Date().toISOString(),
            since: sinceCursor,
          })
        );
      }, 25_000);

      req.signal.addEventListener('abort', () => {
        clearInterval(pollTimer);
        clearInterval(heartbeat);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Workshop2-Domain-Events-Sse': 'outbox-poll',
    },
  });
}
