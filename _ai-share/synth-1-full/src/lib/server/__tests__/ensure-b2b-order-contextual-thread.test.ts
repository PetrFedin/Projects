import {
  clearWorkshop2ContextualMessagesMemoryForTests,
  listWorkshop2ContextualMessages,
} from '@/lib/server/workshop2-contextual-messages-repository';
import { ensureB2bOrderContextualThread } from '@/lib/server/ensure-b2b-order-contextual-thread';

describe('ensureB2bOrderContextualThread section anchor', () => {
  beforeEach(() => {
    clearWorkshop2ContextualMessagesMemoryForTests();
  });

  it('appends section anchor when thread already exists', async () => {
    const first = await ensureB2bOrderContextualThread({
      orderId: 'B2B-9001',
      source: 'checkout',
    });
    expect(first.created).toBe(true);

    const second = await ensureB2bOrderContextualThread({
      orderId: 'B2B-9001',
      pillarId: 'collection_order',
      sectionId: 'brand-co-registry',
      source: 'api',
    });
    expect(second.created).toBe(false);
    expect(second.sectionAnchored).toBe(true);

    const msgs = await listWorkshop2ContextualMessages({
      contextType: 'b2b_order',
      contextId: 'B2B-9001',
    });
    expect(msgs.some((m) => m.message.includes('collection_order/brand-co-registry'))).toBe(true);
  });
});
