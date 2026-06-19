import {
  clearWorkshop2DomainEventOutboxMemoryForTests,
  enqueueWorkshop2DomainEvent,
  listWorkshop2DomainEventsForCollection,
} from '@/lib/server/workshop2-domain-events';

describe('listWorkshop2DomainEventsForCollection', () => {
  beforeEach(() => {
    clearWorkshop2DomainEventOutboxMemoryForTests();
  });

  it('returns showroom.published events for collection newest-first', async () => {
    await enqueueWorkshop2DomainEvent({
      type: 'showroom.published',
      collectionId: 'SS27',
      articleId: 'art-a',
      payload: { source: 'bulk_showroom_publish', campaignName: 'SS27 drop' },
    });
    await enqueueWorkshop2DomainEvent({
      type: 'dossier.gate_passed',
      collectionId: 'SS27',
      articleId: 'art-b',
      payload: {},
    });
    await enqueueWorkshop2DomainEvent({
      type: 'showroom.published',
      collectionId: 'FW27',
      articleId: 'art-x',
      payload: {},
    });

    const all = await listWorkshop2DomainEventsForCollection({ collectionId: 'SS27', limit: 10 });
    expect(all.length).toBe(2);

    const publishedOnly = await listWorkshop2DomainEventsForCollection({
      collectionId: 'SS27',
      eventType: 'showroom.published',
      limit: 10,
    });
    expect(publishedOnly).toHaveLength(1);
    expect(publishedOnly[0]?.articleId).toBe('art-a');
    expect(publishedOnly[0]?.type).toBe('showroom.published');
  });
});
