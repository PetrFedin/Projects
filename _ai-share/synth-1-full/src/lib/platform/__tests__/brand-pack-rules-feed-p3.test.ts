import {
  buildBrandPackRulesFeedRows,
  mergeBrandPackRulesFeedRows,
  summarizeBrandPackRulesFeed,
} from '@/lib/fashion/brand-pack-rules-feed';
import {
  clearBrandPackRulesMemoryForTests,
  listBrandPackRulesServer,
  patchBrandPackRulesServer,
  refreshBrandPackRulesServer,
  seedBrandPackRulesMemoryForTests,
} from '@/lib/server/brand-pack-rules-repository';
import { products } from '@/lib/products';

describe('brand-pack-rules-feed merge', () => {
  it('overlays persisted MOQ on catalog rows', () => {
    const catalog = buildBrandPackRulesFeedRows(products.slice(0, 4));
    const sku = catalog[0]!.sku;
    const merged = mergeBrandPackRulesFeedRows(
      catalog,
      new Map([
        [
          sku,
          {
            ...catalog[0]!,
            moq: 24,
            source: 'pg',
            persisted: true,
          },
        ],
      ])
    );
    expect(merged[0]?.moq).toBe(24);
    expect(merged[0]?.source).toBe('pg');
    expect(summarizeBrandPackRulesFeed(merged).pgSourced).toBe(1);
  });
});

describe('brand-pack-rules-repository', () => {
  beforeEach(() => {
    clearBrandPackRulesMemoryForTests();
  });

  it('seeds and lists pack rules rows', async () => {
    const catalog = buildBrandPackRulesFeedRows(products.slice(0, 4));
    seedBrandPackRulesMemoryForTests('SS27', {
      ...catalog[0]!,
      moq: 12,
      source: 'pg',
      persisted: true,
    });

    const listed = await listBrandPackRulesServer({
      collectionId: 'SS27',
      limit: 12,
      seedIfEmpty: false,
    });
    expect(listed.rows.length).toBeGreaterThan(0);
    expect(listed.storageMode).not.toBe('demo');
  });

  it('patches MOQ for SKU', async () => {
    clearBrandPackRulesMemoryForTests();
    const catalog = buildBrandPackRulesFeedRows(products.slice(0, 3));
    seedBrandPackRulesMemoryForTests('SS27', { ...catalog[0]!, source: 'pg', persisted: true });

    const patched = await patchBrandPackRulesServer({
      collectionId: 'SS27',
      sku: catalog[0]!.sku,
      moq: 36,
    });
    expect(patched.row?.moq).toBe(36);

    const again = await listBrandPackRulesServer({ collectionId: 'SS27', seedIfEmpty: false });
    expect(again.rows.find((row) => row.sku === catalog[0]!.sku)?.moq).toBe(36);
  });

  it('refresh persists catalog slice', async () => {
    clearBrandPackRulesMemoryForTests();
    const refreshed = await refreshBrandPackRulesServer({ collectionId: 'SS27', limit: 8 });
    expect(refreshed.rows.length).toBeGreaterThan(0);
    expect(refreshed.summary.total).toBeGreaterThan(0);
  });
});
