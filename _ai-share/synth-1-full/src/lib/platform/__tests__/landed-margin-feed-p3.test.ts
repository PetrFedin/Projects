import {
  buildLandedMarginCatalogSeedRows,
  buildLandedMarginRowsFromB2bOrder,
  mergeLandedMarginFeedRows,
  summarizeLandedMarginFeed,
} from '@/lib/b2b/landed-margin-feed';
import {
  clearLandedMarginFeedMemoryForTests,
  listLandedMarginFeedServer,
  refreshLandedMarginFeedServer,
  seedLandedMarginFeedMemoryForTests,
} from '@/lib/server/landed-margin-feed-repository';
import type { Workshop2B2bOrderRecord } from '@/lib/production/workshop2-b2b-order-lifecycle';

describe('landed-margin-feed merge', () => {
  it('builds rows from B2B order lines', () => {
    const order: Workshop2B2bOrderRecord = {
      id: 'ORD-1',
      status: 'confirmed',
      tier: 'standard',
      totalRub: 10000,
      lines: [
        {
          articleId: 'ART-1',
          collectionId: 'SS27',
          colorCode: 'black',
          size: 'M',
          qty: 2,
          wholesalePriceRub: 5000,
        },
      ],
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    const rows = buildLandedMarginRowsFromB2bOrder(order);
    expect(rows).toHaveLength(1);
    expect(rows[0]?.source).toBe('order');
    expect(rows[0]?.marginPct).toBeGreaterThan(0);
  });

  it('overlays persisted PG row on catalog seed', () => {
    const catalog = buildLandedMarginCatalogSeedRows({ collectionId: 'SS27', orderId: 'O1' });
    const merged = mergeLandedMarginFeedRows(
      catalog,
      new Map([
        [
          catalog[0]!.lineId,
          {
            ...catalog[0]!,
            landedRub: 1111,
            source: 'pg',
          },
        ],
      ])
    );
    expect(merged[0]?.landedRub).toBe(1111);
    expect(merged[0]?.source).toBe('pg');
    expect(summarizeLandedMarginFeed(merged).pgSourced).toBe(1);
  });
});

describe('landed-margin-feed-repository', () => {
  beforeEach(() => {
    clearLandedMarginFeedMemoryForTests();
  });

  it('seeds and lists shop rollup rows', async () => {
    const catalog = buildLandedMarginCatalogSeedRows({ collectionId: 'SS27', orderId: 'O1' });
    seedLandedMarginFeedMemoryForTests('SS27', 'O1', {
      ...catalog[0]!,
      landedRub: 4500,
      source: 'pg',
    });

    const listed = await listLandedMarginFeedServer({
      collectionId: 'SS27',
      orderId: 'O1',
      scope: 'shop',
      seedIfEmpty: false,
    });
    expect(listed.rows.length).toBeGreaterThan(0);
    expect(listed.storageMode).not.toBe('demo');
  });

  it('refresh persists catalog seed', async () => {
    clearLandedMarginFeedMemoryForTests();
    const refreshed = await refreshLandedMarginFeedServer({
      collectionId: 'SS27',
      orderId: 'O2',
      scope: 'brand',
    });
    expect(refreshed.rows.length).toBeGreaterThan(0);
    expect(refreshed.summary.total).toBeGreaterThan(0);
  });
});
