import {
  clearPlatformCoreUserCalendarTasksForTests,
  createPlatformCoreUserCalendarTask,
} from '@/lib/server/platform-core-user-calendar-task';
import { getPlatformCoreB2bCalendarEvents } from '@/lib/server/platform-core-calendar-events';

describe('platform-core-calendar-events user tasks', () => {
  beforeEach(() => {
    clearPlatformCoreUserCalendarTasksForTests();
  });

  it('merges user calendar tasks into order-scoped events', async () => {
    await createPlatformCoreUserCalendarTask({
      id: 'supplier-delivery-B2B-9001',
      collectionId: 'SS27',
      ownerRole: 'supplier',
      title: 'Поставка подтверждена · B2B-9001',
      startAt: new Date().toISOString(),
      endAt: new Date(Date.now() + 3600000).toISOString(),
      orderId: 'B2B-9001',
      articleId: 'demo-ss27-01',
      eventType: 'delivery',
    });

    const { events } = await getPlatformCoreB2bCalendarEvents({
      collectionId: 'SS27',
      orderId: 'B2B-9001',
    });

    expect(events.some((e) => e.id === 'supplier-delivery-B2B-9001')).toBe(true);
  });
});
