import { NextRequest, NextResponse } from 'next/server';

import { summarizePgContextualUnreadForOrder } from '@/lib/platform/platform-core-comms-notification-center';
import { getPlatformCoreB2bCalendarEvents } from '@/lib/server/platform-core-calendar-events';
import {
  buildPgContextualThreadsResponse,
  type PgContextualThreadsCabinet,
} from '@/lib/server/pg-contextual-message-threads-handler';

/** GET — order-scoped notification center summary (PG contextual threads + calendar count). */
export async function GET(req: NextRequest) {
  const orderId = req.nextUrl.searchParams.get('orderId')?.trim();
  const collectionId = req.nextUrl.searchParams.get('collectionId')?.trim();
  const variant = req.nextUrl.searchParams.get('variant')?.trim() ?? 'shop';

  if (!orderId || !collectionId) {
    return NextResponse.json(
      { ok: false, messageRu: 'Укажите orderId и collectionId.' },
      { status: 400 }
    );
  }

  const cabinet: PgContextualThreadsCabinet =
    variant === 'shop' ? 'shop' : variant === 'brand' ? 'brand' : 'factory';

  const threadsRes = await buildPgContextualThreadsResponse(cabinet, req);
  const threadsJson = (await threadsRes.json()) as {
    threads?: Array<{
      contextType: string;
      contextId: string;
      lastMessagePreview?: string | null;
    }>;
    source?: string;
  };

  const summary = summarizePgContextualUnreadForOrder({
    threads: (threadsJson.threads ?? []) as Parameters<
      typeof summarizePgContextualUnreadForOrder
    >[0]['threads'],
    orderId,
    orderScoped: true,
  });

  const { count: eventCount } = await getPlatformCoreB2bCalendarEvents({
    collectionId,
    orderId,
  });

  return NextResponse.json({
    ok: true,
    orderId,
    collectionId,
    variant,
    totalUnread: summary.totalUnread,
    unreadThreadCount: summary.unreadThreads.length,
    eventCount,
    threadSource: threadsJson.source ?? 'empty',
    messageRu: `${summary.totalUnread} unread · ${eventCount} calendar events (${threadsJson.source ?? 'empty'}).`,
  });
}
