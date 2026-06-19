import { buildBrandProductionCutTickets } from '@/lib/brand-production/cut-tickets';
import { createSeedState } from '@/lib/brand-production/seed';

describe('brand-production cut-tickets', () => {
  it('builds work packets from confirmed PO lines only', () => {
    const state = createSeedState();
    const rows = buildBrandProductionCutTickets(state, 'col-fw26');
    expect(rows.length).toBeGreaterThan(0);
    expect(rows.every((r) => r.poCode.startsWith('PO-'))).toBe(true);
    expect(rows.some((r) => r.status === 'in_wip')).toBe(true);
  });

  it('returns empty for unknown collection', () => {
    const state = createSeedState();
    expect(buildBrandProductionCutTickets(state, 'missing')).toHaveLength(0);
  });
});
