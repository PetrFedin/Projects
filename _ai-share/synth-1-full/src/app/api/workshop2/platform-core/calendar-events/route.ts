/**
 * GET /api/workshop2/platform-core/calendar-events?collectionId=&orderId=
 * События календаря из тех же сущностей, что chain-status (W2 B2B, handoff, образцы).
 */
import { NextRequest, NextResponse } from 'next/server';

import type { Workshop2B2bBuyerTier } from '@/lib/production/workshop2-b2b-campaign-hub';
import { resolvePlatformCoreCalendarThreadChatId } from '@/lib/platform-core-calendar-thread-link';
import { getPlatformCoreB2bCalendarEvents } from '@/lib/server/platform-core-calendar-events';
import {
  ensureSpineOperationalStoreReady,
  SPINE_HUB_MINIMAL_SCOPES,
  SPINE_TRACKING_READ_SCOPES,
} from '@/lib/integrations/spine/spine-operational-store';
import { guardWorkshop2Route, WORKSHOP2_READ_ROLES } from '@/lib/server/workshop2-route-auth';

export async function GET(req: NextRequest) {
  const auth = await guardWorkshop2Route(req, WORKSHOP2_READ_ROLES);
  if (auth instanceof NextResponse) return auth;

  const collectionId = req.nextUrl.searchParams.get('collectionId')?.trim();
  if (!collectionId) {
    return NextResponse.json(
      { ok: false, messageRu: 'Параметр collectionId обязателен.' },
      { status: 400 }
    );
  }

  const orderId = req.nextUrl.searchParams.get('orderId')?.trim() || undefined;
  const buyerTier = (req.nextUrl.searchParams.get('buyerTier')?.trim() ??
    'standard') as Workshop2B2bBuyerTier;

  const goldenOrderContext = Boolean(orderId?.startsWith('B2B-DEMO-'));
  if (!goldenOrderContext) {
    await ensureSpineOperationalStoreReady(
      orderId?.startsWith('INT-') ? SPINE_TRACKING_READ_SCOPES : SPINE_HUB_MINIMAL_SCOPES
    );
  }

  const { events, count } = await getPlatformCoreB2bCalendarEvents({
    collectionId,
    orderId,
    buyerTier,
  });

  const eventsWithThread = events.map((event) => ({
    ...event,
    targetChatId: resolvePlatformCoreCalendarThreadChatId(event) ?? null,
  }));

  return NextResponse.json({
    ok: true,
    collectionId,
    orderId: orderId ?? null,
    events: eventsWithThread,
    count,
    messageRu: orderId
      ? `Календарь · ${orderId}: ${count} событий.`
      : `B2B календарь · ${collectionId}: ${count} событий.`,
  });
}
