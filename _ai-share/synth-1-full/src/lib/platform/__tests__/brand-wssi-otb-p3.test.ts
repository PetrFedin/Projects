import {
  buildBrandWssiCapacityFeedRows,
  buildBrandWssiMixFeedRows,
  summarizeBrandWssiMixFeed,
} from '@/lib/fashion/brand-wssi-otb-feed';
import {
  clearBrandWssiOtbMemoryForTests,
  listBrandWssiOtbServer,
  patchBrandWssiMixTargetServer,
  refreshBrandWssiOtbServer,
} from '@/lib/server/brand-wssi-otb-repository';
import { products } from '@/lib/products';

describe('brand-wssi-otb-feed', () => {
  it('summarizes mix feed rows', () => {
    const rows = buildBrandWssiMixFeedRows(products.slice(0, 20));
    const summary = summarizeBrandWssiMixFeed(rows);
    expect(summary.categories).toBeGreaterThan(0);
    expect(summary.pgSourced).toBe(0);
  });

  it('builds capacity rows for collection', () => {
    const rows = buildBrandWssiCapacityFeedRows('SS27');
    expect(rows.length).toBeGreaterThan(0);
  });
});

describe('brand-wssi-otb-repository', () => {
  beforeEach(() => {
    clearBrandWssiOtbMemoryForTests();
  });

  it('seeds and lists OTB mix/capacity', async () => {
    const listed = await listBrandWssiOtbServer({ collectionId: 'SS27' });
    expect(listed.mix.length).toBeGreaterThan(0);
    expect(listed.capacity.length).toBeGreaterThan(0);
    expect(listed.storageMode).not.toBe('demo');
  });

  it('patches mix target for category', async () => {
    const listed = await listBrandWssiOtbServer({ collectionId: 'SS27' });
    const category = listed.mix[0]?.category;
    expect(category).toBeTruthy();

    const patched = await patchBrandWssiMixTargetServer({
      collectionId: 'SS27',
      category: category!,
      targetPct: 42,
    });
    expect(patched.row?.targetPct).toBe(42);

    const again = await listBrandWssiOtbServer({ collectionId: 'SS27', seedIfEmpty: false });
    expect(again.mix.find((row) => row.category === category)?.targetPct).toBe(42);
  });

  it('refresh re-syncs catalog slice', async () => {
    const refreshed = await refreshBrandWssiOtbServer({ collectionId: 'SS27' });
    expect(refreshed.mixSummary.categories).toBeGreaterThan(0);
  });
});
