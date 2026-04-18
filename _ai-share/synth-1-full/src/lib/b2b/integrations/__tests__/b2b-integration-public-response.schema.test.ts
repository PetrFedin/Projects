import {
  b2BIntegrationStatusListSchema,
  catalogSummaryForProductionResponseSchema,
} from '@/lib/b2b/integrations/b2b-integration-public-response.zod';
import {
  getB2BIntegrationStatus,
  getCatalogSummaryForProduction,
} from '@/lib/b2b/integrations/b2b-integration-service';

describe('b2b-integration public API shapes', () => {
  it('getB2BIntegrationStatus matches status list schema', async () => {
    const rows = await getB2BIntegrationStatus();
    const parsed = b2BIntegrationStatusListSchema.safeParse(rows);
    expect(parsed.success).toBe(true);
    expect(rows.length).toBeGreaterThan(0);
  });

  it('getCatalogSummaryForProduction matches catalog-summary schema', async () => {
    const summary = await getCatalogSummaryForProduction('demo-brand');
    const parsed = catalogSummaryForProductionResponseSchema.safeParse(summary);
    expect(parsed.success).toBe(true);
  });
});
