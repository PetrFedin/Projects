import {
  filterPgContextualThreadsForOrder,
  summarizePgContextualUnreadForOrder,
} from '@/lib/platform/platform-core-comms-notification-center';

describe('platform-core-comms-notification-center', () => {
  const threads = [
    {
      contextType: 'b2b_order',
      contextId: 'B2B-DEMO-SHOP1-SS27',
      messageCount: 5,
      lastSeenMessageCount: 2,
    },
    {
      contextType: 'b2b_order',
      contextId: 'OTHER-ORDER',
      messageCount: 3,
      lastSeenMessageCount: 0,
    },
    {
      contextType: 'workshop2_article',
      contextId: 'SS27::art-1',
      messageCount: 1,
      lastSeenMessageCount: 0,
    },
  ] as Parameters<typeof summarizePgContextualUnreadForOrder>[0]['threads'];

  it('filters threads to order when orderScoped', () => {
    const scoped = filterPgContextualThreadsForOrder(threads, 'B2B-DEMO-SHOP1-SS27', true);
    expect(scoped).toHaveLength(1);
    expect(scoped[0]?.contextId).toBe('B2B-DEMO-SHOP1-SS27');
  });

  it('summarizes unread for scoped order', () => {
    const summary = summarizePgContextualUnreadForOrder({
      threads,
      orderId: 'B2B-DEMO-SHOP1-SS27',
      orderScoped: true,
    });
    expect(summary.totalUnread).toBeGreaterThan(0);
    expect(summary.unreadThreads.length).toBe(1);
  });
});
