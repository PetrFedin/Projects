import { NextResponse } from 'next/server';
import { getOrCreateRequestId, jsonError } from '@/lib/api/response-contract';
import { observeApiRoute } from '@/lib/server/observe-api-route';
import { getDomainEventOutboxStats } from '@/lib/order/domain-event-outbox';
import { getDomainEventBusHealthSnapshot } from '@/lib/order/domain-events';
import { verifyDomainEventOpsHealthRequest } from '@/lib/server/domain-event-outbox-cron-auth';
import {
  buildDomainEventsHealthResponseHeaders,
  buildDomainEventsHealthResponsePayload,
  evaluateDomainEventsHealth,
} from '@/lib/server/domain-events-health';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

/**
 * Ops health для доменных событий (event bus + outbox).
 * Авторизация: Bearer DOMAIN_EVENT_HEALTH_SECRET (fallback: DOMAIN_EVENT_OUTBOX_CRON_SECRET / CRON_SECRET)
 * либо query ?key=...
 */
export async function GET(request: Request) {
  return observeApiRoute(request, '/api/ops/domain-events/health', async () => {
    const requestId = getOrCreateRequestId(request);
    if (!verifyDomainEventOpsHealthRequest(request)) {
      return jsonError(
        {
          code: 'UNAUTHORIZED',
          message: 'unauthorized',
          status: 401,
          meta: { requestId },
        },
        { headers: { 'x-request-id': requestId } }
      );
    }

    const outbox = await getDomainEventOutboxStats();
    const bus = getDomainEventBusHealthSnapshot();
    const health = evaluateDomainEventsHealth(bus, outbox);
    const payload = buildDomainEventsHealthResponsePayload({
      health,
      bus,
      outbox,
      requestId,
    });

    return NextResponse.json(payload, {
      headers: buildDomainEventsHealthResponseHeaders(requestId),
    });
  });
}
