import {
  computeSectionGroupUnread,
  findPgB2bOrderThread,
} from '@/lib/communications/pg-contextual-section-unread';
import type { BrandPgThreadRow } from '@/lib/brand/brand-messages-pg-threads';

describe('pg-contextual-section-unread', () => {
  const orderThread: BrandPgThreadRow = {
    contextType: 'b2b_order',
    contextId: 'B2B-1001',
    lastMessageAt: '2026-06-01T12:00:00Z',
    lastMessagePreview: 'Контекст раздела · collection_order/brand-co-registry · заказ B2B-1001.',
    messageCount: 3,
    lastSeenMessageCount: 1,
  };

  it('order-chat section gets full order unread', () => {
    const unreadByChat = { 'w2ctx:b2b_order:B2B-1001': 2 };
    expect(
      computeSectionGroupUnread({
        orderId: 'B2B-1001',
        pillarId: 'comms',
        sectionId: 'brand-cm-order-chat',
        unreadByChat,
        orderThread,
      })
    ).toBe(2);
  });

  it('cross-pillar section unread when preview mentions section', () => {
    const unreadByChat = { 'w2ctx:b2b_order:B2B-1001': 2 };
    expect(
      computeSectionGroupUnread({
        orderId: 'B2B-1001',
        pillarId: 'collection_order',
        sectionId: 'brand-co-registry',
        unreadByChat,
        orderThread,
      })
    ).toBe(2);
  });

  it('no unread chip when preview does not mention section', () => {
    const unreadByChat = { 'w2ctx:b2b_order:B2B-1001': 2 };
    expect(
      computeSectionGroupUnread({
        orderId: 'B2B-1001',
        pillarId: 'order_production',
        sectionId: 'brand-op-handoff',
        unreadByChat,
        orderThread,
      })
    ).toBe(0);
  });

  it('findPgB2bOrderThread matches context id', () => {
    expect(findPgB2bOrderThread([orderThread], 'B2B-1001')).toEqual(orderThread);
  });
});
