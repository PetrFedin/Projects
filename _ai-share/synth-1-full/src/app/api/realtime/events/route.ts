/**
 * SSE endpoint for real-time events when WebSocket is unavailable.
 * In production: proxy to backend SSE (e.g. Redis Pub/Sub) or external service.
 * Set NEXT_PUBLIC_WS_URL for WebSocket; use this as fallback.
 */

import { NextRequest } from 'next/server';

const USE_FASTAPI = process.env.NEXT_PUBLIC_USE_FASTAPI === 'true';
const API = USE_FASTAPI ? (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/$/, '') : '';

export async function GET(request: NextRequest) {
  // Proxy to backend SSE if available
  if (API) {
    try {
      const backendUrl = `${API.replace(/\/$/, '')}/realtime/events`;
      const authHeader = request.headers.get('authorization');
      const res = await fetch(backendUrl, {
        headers: authHeader ? { Authorization: authHeader } : {},
        // @ts-expect-error — Next.js fetch + ReadableStream
        duplex: 'half',
      });
      if (res.body && res.ok) {
        return new Response(res.body, {
          headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache, no-transform',
            Connection: 'keep-alive',
          },
        });
      }
    } catch {
      // Fall through to local stub
    }
  }

  // Local stub: stream keepalive, backend should push real events via this route
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: string) => controller.enqueue(encoder.encode(`data: ${data}\n\n`));
      // Keepalive every 30s
      const id = setInterval(
        () => send(JSON.stringify({ type: 'ping', ts: new Date().toISOString() })),
        30000
      );
      request.signal.addEventListener('abort', () => {
        clearInterval(id);
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
