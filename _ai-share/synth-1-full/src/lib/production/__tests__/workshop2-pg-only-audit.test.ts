/**
 * Wave 8 P0 — PG-only rollout audit catalog.
 */
import {
  buildWorkshop2PgOnlyAuditCatalog,
  evaluateWorkshop2PgOnlyAuditCompliance,
  summarizeWorkshop2PgOnlyAuditHintRu,
} from '@/lib/production/workshop2-pg-only-audit';

describe('workshop2 pg-only audit — catalog', () => {
  it('lists six workshop2 surfaces', () => {
    const catalog = buildWorkshop2PgOnlyAuditCatalog();
    expect(catalog.map((c) => c.surface)).toEqual([
      'hub_list',
      'references',
      'setup',
      'inspector',
      'showroom',
      'purchase_orders',
    ]);
  });

  it('hub_list forbids localStorage primary write when PG-only', () => {
    process.env.WORKSHOP2_PG_ONLY = 'true';
    const hub = buildWorkshop2PgOnlyAuditCatalog().find((c) => c.surface === 'hub_list');
    expect(hub?.localStorageRole).toBe('read_on_miss_cache_only');
    expect(hub?.writePrimary).toBe('postgres_fail_closed');
    delete process.env.WORKSHOP2_PG_ONLY;
  });

  it('inspector and showroom use API primary write', () => {
    const inspector = buildWorkshop2PgOnlyAuditCatalog().find((c) => c.surface === 'inspector');
    const showroom = buildWorkshop2PgOnlyAuditCatalog().find((c) => c.surface === 'showroom');
    expect(inspector?.writePrimary).toBe('postgres_api_only');
    expect(showroom?.writePrimary).toBe('postgres_api_only');
  });
});

describe('workshop2 pg-only audit — compliance', () => {
  it('compliant when PG-only flags set', () => {
    process.env.WORKSHOP2_PG_ONLY = 'true';
    const c = evaluateWorkshop2PgOnlyAuditCompliance();
    expect(c.pgOnlyEnabled).toBe(true);
    expect(c.compliant).toBe(true);
    expect(c.violations).toHaveLength(0);
    delete process.env.WORKSHOP2_PG_ONLY;
  });

  it('hint explains PG-only OK state', () => {
    process.env.WORKSHOP2_PG_ONLY = 'true';
    const hint = summarizeWorkshop2PgOnlyAuditHintRu(evaluateWorkshop2PgOnlyAuditCompliance());
    expect(hint).toMatch(/PG-only audit OK/);
    delete process.env.WORKSHOP2_PG_ONLY;
  });
});
