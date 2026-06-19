import { buildSectionAuditE2ePaths } from '@/lib/platform-core-section-audit-e2e-paths';

describe('platform-core-section-audit-e2e-paths', () => {
  it('строит пути для всех разделов SECTION_AUDIT', () => {
    const paths = buildSectionAuditE2ePaths();
    expect(paths.length).toBeGreaterThanOrEqual(60);
    expect(paths.every((p) => p.href.startsWith('/'))).toBe(true);
    expect(paths.some((p) => p.sectionId === 'mfr-op-production-orders')).toBe(true);
  });
});
