import { b2bIntegrationsDashboardSchema } from '@/lib/b2b/integrations/b2b-integration-public-response.zod';
import { __resetSynthaHealthProbeForTests } from '@/lib/b2b/integrations/integration-health-probe';
import { loadB2bIntegrationsDashboard } from '@/lib/use-cases/b2b/load-integrations-dashboard';

describe('loadB2bIntegrationsDashboard', () => {
  beforeEach(() => {
    __resetSynthaHealthProbeForTests();
  });

  it('assembles integrations + catalog with stable contract shapes', async () => {
    const dash = await loadB2bIntegrationsDashboard('test-brand');
    expect(dash.assembledAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    expect(b2bIntegrationsDashboardSchema.safeParse(dash).success).toBe(true);
  });
});
