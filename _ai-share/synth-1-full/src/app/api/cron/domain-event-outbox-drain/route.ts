import { NextResponse } from 'next/server';
import {
  getDomainEventOutboxStats,
  processPendingDomainEventOutbox,
} from '@/lib/order/domain-event-outbox';
import { verifyDomainEventOutboxCronRequest } from '@/lib/server/domain-event-outbox-cron-auth';
import { observeApiRoute } from '@/lib/server/observe-api-route';
import { getOrCreateRequestId, jsonError } from '@/lib/api/response-contract';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

/**
 * Cron / ручной drain зависших доменных событий (outbox на диске).
 * Авторизация: Authorization: Bearer (DOMAIN_EVENT_OUTBOX_CRON_SECRET или CRON_SECRET),
 * либо query ?key=… с тем же значением.
 *
 * Query: limit (1…500, по умолчанию 200).
 *
 * Vercel Cron: путь добавлен в **`vercel.json`**; в проекте должен быть **`CRON_SECRET`** (или **`DOMAIN_EVENT_OUTBOX_CRON_SECRET`**),
 * Vercel передаёт `Authorization: Bearer …` при вызове scheduled job (см. документацию Vercel Cron).
 */
export async function GET(request: Request) {
  return observeApiRoute(request, '/api/cron/domain-event-outbox-drain', async () => {
    const requestId = getOrCreateRequestId(request);
    if (!verifyDomainEventOutboxCronRequest(request)) {
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

    const { searchParams } = new URL(request.url);
    const raw = parseInt(searchParams.get('limit') ?? '200', 10);
    const limit = Math.min(Math.max(Number.isFinite(raw) ? raw : 200, 1), 500);

    const processed = await processPendingDomainEventOutbox(limit);
    const stats = await getDomainEventOutboxStats();

    return NextResponse.json(
      {
        ok: true,
        processed,
        pendingRemaining: stats.pending,
        outbox: stats,
        limit,
        requestId,
      },
      { headers: { 'x-request-id': requestId } }
    );
  });
}
