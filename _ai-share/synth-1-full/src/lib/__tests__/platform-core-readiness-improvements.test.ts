import { getPlatformCoreReadinessMatrix } from '@/lib/platform-core-readiness-audit';
import { buildPlatformCoreReadinessImprovements } from '@/lib/platform-core-readiness-improvements';

describe('platform-core-readiness-improvements', () => {
  it('aggregates bad/fix from cells and sections, sorted by priority desc', () => {
    const cells = getPlatformCoreReadinessMatrix('SS27');
    const items = buildPlatformCoreReadinessImprovements(cells);
    expect(items.length).toBeGreaterThan(10);
    for (let i = 1; i < items.length; i += 1) {
      expect(items[i - 1].priority).toBeGreaterThanOrEqual(items[i].priority);
    }
    expect(items.every((item) => item.linkageRu.length > 20)).toBe(true);
    expect(items.every((item) => item.href.startsWith('/'))).toBe(true);
  });

  it('filters by pillar and dedupes repeated audit lines', () => {
    const cells = getPlatformCoreReadinessMatrix('SS27');
    const all = buildPlatformCoreReadinessImprovements(cells);
    const shopOrder = buildPlatformCoreReadinessImprovements(cells, { pillarId: 'collection_order' });
    expect(shopOrder.length).toBeLessThanOrEqual(all.length);
    expect(shopOrder.every((item) => item.pillarId === 'collection_order' || item.linkageRu.includes('→'))).toBe(
      true
    );
    const keys = new Set(all.map((item) => item.id));
    expect(keys.size).toBe(all.length);
  });
});
