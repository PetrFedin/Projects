/**
 * Live runway analytics — Server-Sent Events, обновление каждые 5s из file store.
 * GET /api/runway/analytics/stream
 */
import {
  buildRunwayAnalyticsDashboardSnapshot,
  formatRunwayAnalyticsSseEvent,
} from '@/lib/server/runway-analytics-sse';
import {
  applyRunwayRouteRateLimit,
  runwayRateLimitJsonResponse,
} from '@/lib/server/runway-route-rate-limit';

const SSE_INTERVAL_MS = 5_000;

export async function GET(request: Request) {
  const rate = await applyRunwayRouteRateLimit(request, 'read');
  if (!rate.allowed) return runwayRateLimitJsonResponse(rate);

  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      let closed = false;

      const pushSnapshot = async () => {
        if (closed) return;
        try {
          const dashboard = await buildRunwayAnalyticsDashboardSnapshot();
          controller.enqueue(encoder.encode(formatRunwayAnalyticsSseEvent(dashboard)));
        } catch (err) {
          const message = err instanceof Error ? err.message : 'snapshot failed';
          controller.enqueue(
            encoder.encode(`event: error\ndata: ${JSON.stringify({ error: message })}\n\n`)
          );
        }
      };

      await pushSnapshot();
      const intervalId = setInterval(() => {
        void pushSnapshot();
      }, SSE_INTERVAL_MS);

      const cleanup = () => {
        if (closed) return;
        closed = true;
        clearInterval(intervalId);
        try {
          controller.close();
        } catch {
          /* already closed */
        }
      };

      request.signal.addEventListener('abort', cleanup);
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}
