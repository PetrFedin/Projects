import 'server-only';

import type { Workshop2B2bCalendarEvent } from '@/lib/production/workshop2-b2b-campaign-hub';
import type { Workshop2B2bOrderRecord } from '@/lib/production/workshop2-b2b-order-lifecycle';
import { createPlatformCoreUserCalendarTask } from '@/lib/server/platform-core-user-calendar-task';

/** Persist inbound webhook/OAuth calendar hint as Platform Core user task (PG or file). */
export async function persistWorkshop2B2bInboundCalendarTask(input: {
  stub: Workshop2B2bCalendarEvent;
  order: Workshop2B2bOrderRecord;
}): Promise<{ ok: boolean; mode: 'calendar_task' | 'failed' }> {
  const { stub, order } = input;
  try {
    await createPlatformCoreUserCalendarTask({
      id: stub.id,
      collectionId: stub.collectionId ?? order.collectionId ?? 'SS27',
      ownerRole: 'shop',
      title: stub.title,
      startAt: stub.startAt,
      endAt: stub.endAt,
      orderId: order.id,
      articleId: stub.articleId ?? order.articleId,
      eventType: 'inbound_order',
    });
    return { ok: true, mode: 'calendar_task' };
  } catch {
    return { ok: false, mode: 'failed' };
  }
}
