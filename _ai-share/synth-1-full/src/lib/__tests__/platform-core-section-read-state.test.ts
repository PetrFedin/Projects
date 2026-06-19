import {
  clearPlatformCoreSectionReadStateForTests,
  isPlatformCoreSectionRead,
  listPlatformCoreSectionReadKeys,
  markPlatformCoreSectionRead,
} from '@/lib/server/platform-core-section-read-state';
import { buildPgSectionVisitKey } from '@/lib/communications/pg-contextual-section-read-state';

describe('platform-core-section-read-state', () => {
  beforeEach(() => {
    clearPlatformCoreSectionReadStateForTests();
  });

  it('marks and lists section read keys idempotently', async () => {
    await markPlatformCoreSectionRead({
      actorId: 'user_petr',
      orderId: 'B2B-1001',
      pillarId: 'collection_order',
      sectionId: 'brand-co-registry',
    });
    await markPlatformCoreSectionRead({
      actorId: 'user_petr',
      orderId: 'B2B-1001',
      pillarId: 'collection_order',
      sectionId: 'brand-co-registry',
    });

    expect(
      isPlatformCoreSectionRead({
        actorId: 'user_petr',
        orderId: 'B2B-1001',
        pillarId: 'collection_order',
        sectionId: 'brand-co-registry',
      })
    ).toBe(true);

    const keys = await listPlatformCoreSectionReadKeys({
      actorId: 'user_petr',
      orderId: 'B2B-1001',
    });
    expect(keys).toEqual([
      buildPgSectionVisitKey('B2B-1001', 'collection_order', 'brand-co-registry'),
    ]);
  });
});
