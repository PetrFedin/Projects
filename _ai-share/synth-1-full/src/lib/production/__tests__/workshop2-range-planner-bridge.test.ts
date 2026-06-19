import {
  buildRangePlannerArticlePrefill,
  parseRangePlannerPrefillFromSearchParams,
  parseRangePlannerTier,
} from '@/lib/production/workshop2-range-planner-bridge';

describe('workshop2-range-planner-bridge', () => {
  it('parses tier from URL params', () => {
    expect(parseRangePlannerTier('core')).toBe('core');
    expect(parseRangePlannerTier('TREND')).toBe('trend');
    expect(parseRangePlannerTier('')).toBeNull();
  });

  it('builds prefill with budget and margin', () => {
    const p = buildRangePlannerArticlePrefill({
      collectionId: 'SS27',
      tier: 'core',
      budget: 1_200_000,
      targetMargin: 42,
      sku: 'RP-TEST-01',
    });
    expect(p.sku).toBe('RP-TEST-01');
    expect(p.categoryLeafId).toBe('catalog-apparel-g0-l0');
    expect(p.comment).toContain('Range Planner');
    expect(p.comment).toContain('1');
  });

  it('parseRangePlannerPrefillFromSearchParams', () => {
    const sp = new URLSearchParams('w2tier=trend&w2budget=800000&w2margin=38');
    const p = parseRangePlannerPrefillFromSearchParams(sp);
    expect(p?.tier).toBe('trend');
    expect(p?.budget).toBe(800_000);
    expect(p?.targetMargin).toBe(38);
    expect(p?.categoryLeafId).toBe('catalog-apparel-g1-l0');
  });
});
