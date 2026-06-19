import {
  clearWorkshop2ContextualReadStateMemoryForTests,
  listWorkshop2ContextualReadStateForThreads,
  upsertWorkshop2ContextualReadState,
} from '@/lib/server/workshop2-contextual-read-state-repository';

describe('workshop2-contextual-read-state-repository (memory)', () => {
  beforeEach(() => {
    clearWorkshop2ContextualReadStateMemoryForTests();
  });

  it('upsert и list возвращают lastSeen по actor+thread', async () => {
    await upsertWorkshop2ContextualReadState({
      actorId: 'user_petr',
      contextType: 'b2b_order',
      contextId: 'B2B-DEMO-SHOP1-SS27',
      lastSeenMessageCount: 2,
    });

    const map = await listWorkshop2ContextualReadStateForThreads({
      actorId: 'user_petr',
      threads: [
        { contextType: 'b2b_order', contextId: 'B2B-DEMO-SHOP1-SS27' },
        { contextType: 'b2b_order', contextId: 'OTHER' },
      ],
    });

    expect(map['b2b_order::B2B-DEMO-SHOP1-SS27']).toBe(2);
    expect(map['b2b_order::OTHER']).toBeUndefined();
  });

  it('не понижает lastSeen при повторном upsert', async () => {
    await upsertWorkshop2ContextualReadState({
      actorId: 'shop-buyer',
      contextType: 'b2b_order',
      contextId: 'B2B-X',
      lastSeenMessageCount: 5,
    });
    const second = await upsertWorkshop2ContextualReadState({
      actorId: 'shop-buyer',
      contextType: 'b2b_order',
      contextId: 'B2B-X',
      lastSeenMessageCount: 3,
    });
    expect(second.lastSeenMessageCount).toBe(5);
  });
});
