import { test, expect } from '@playwright/test';

/**
 * PG-primary mode (SPINE_OPERATIONAL_PG_PRIMARY=1): health + integrations hub.
 * Строгий режим: CORE_VERIFY_PG_PRIMARY=1 в окружении Playwright (CI / local verify).
 */
test.describe('core-17: PG-primary mode', () => {
  test('health exposes spineOperationalPgPrimary flag', async ({ request }) => {
    const res = await request.get('/api/workshop2/platform-core/health');
    expect(res.ok()).toBeTruthy();
    const json = (await res.json()) as {
      ok?: boolean;
      pgReachable?: boolean;
      spineOperationalPgPrimary?: boolean;
      operationalOrdersSource?: string;
    };
    expect(json.ok).toBe(true);
    expect(json.pgReachable).toBe(true);
    expect(typeof json.spineOperationalPgPrimary).toBe('boolean');
    expect(json.operationalOrdersSource).toMatch(/postgres/);

    if (process.env.CORE_VERIFY_PG_PRIMARY === '1') {
      expect(json.spineOperationalPgPrimary).toBe(true);
      expect(json.operationalOrdersSource).toBe('postgres-primary');
    }
  });

  test('integrations hub reports postgres-primary when PG-primary enabled', async ({ request }) => {
    test.skip(process.env.CORE_VERIFY_PG_PRIMARY !== '1', 'strict: CORE_VERIFY_PG_PRIMARY=1');

    const res = await request.get('/api/integrations/v1/status');
    expect(res.ok()).toBeTruthy();
    const body = await res.text();
    expect(body).toContain('postgres-primary');
  });
});
