import { filterPlatformCoreShopOrderRows } from '@/lib/platform-core-b2b-registry-url';

jest.mock('@/lib/cabinet-core-mode', () => ({
  isPlatformCoreMode: () => true,
}));

describe('filterPlatformCoreShopOrderRows', () => {
  const rows = [
    { order: 'B2B-DEMO-SHOP1-SS27' },
    { order: 'B2B-1781275919974' },
    { order: 'INT-JOOR-1' },
  ];

  it('includes B2B-DEMO and PG checkout B2B-\\d+', () => {
    const filtered = filterPlatformCoreShopOrderRows(rows);
    expect(filtered.map((r) => r.order)).toEqual(['B2B-DEMO-SHOP1-SS27', 'B2B-1781275919974']);
  });

  it('includes deep-link focus for non-golden ids', () => {
    const filtered = filterPlatformCoreShopOrderRows(rows, 'INT-JOOR-1');
    expect(filtered.map((r) => r.order)).toContain('INT-JOOR-1');
  });
});
