import { buildBrandProductionQcGateSummary } from '@/lib/brand-production/qc-gate';
import { createSeedState } from '@/lib/brand-production/seed';

describe('brand-production qc-gate', () => {
  it('summarizes inspections and planned QC', () => {
    const summary = buildBrandProductionQcGateSummary(createSeedState());
    expect(summary.plannedCount).toBeGreaterThan(0);
    expect(summary.passCount).toBeGreaterThan(0);
    expect(summary.rows.length).toBeGreaterThan(0);
  });
});
