import { test, expect } from '@playwright/test';

const GOTO = { waitUntil: 'domcontentloaded' as const, timeout: 90_000 };
const W2_DEV_HEADERS = {
  'x-syntha-dev-bypass': '1',
  'x-syntha-workshop2-dev': '1',
} as const;

/**
 * P0 tail: margin PATCH all tiers, investor brief, tier assign API, supplier BOM fill-rate.
 * PLAYWRIGHT_SKIP_WEBSERVER=1 npm run test:e2e:core -- e2e/core-53-p0-tz-margin-investor.spec.ts
 */
test.describe('core-53: P0 TZ margin investor', () => {
  test('range planner: PATCH margin+budget для core/trend/novelty', async ({ request, page }) => {
    const healthRes = await request.get('/api/workshop2/platform-core/health');
    test.skip(!healthRes.ok(), 'health API недоступен');

    const tiers = [
      { tier: 'core', budget: 1_200_000, targetMargin: 58 },
      { tier: 'trend', budget: 800_000, targetMargin: 52 },
      { tier: 'novelty', budget: 600_000, targetMargin: 48 },
    ] as const;

    for (const row of tiers) {
      const patchRes = await request.patch('/api/workshop2/collections/SS27/range-planner', {
        headers: W2_DEV_HEADERS,
        data: row,
      });
      expect(patchRes.ok()).toBeTruthy();
      const json = (await patchRes.json()) as { ok?: boolean };
      expect(json.ok).toBe(true);
    }

    const res = await page.goto('/brand/range-planner?collection=SS27', GOTO);
    expect(res?.status() ?? 599).toBeLessThan(500);
    await expect(page.getByTestId('brand-dev-range-panel')).toBeVisible({ timeout: 60_000 });
    for (const tier of ['core', 'trend', 'novelty'] as const) {
      await expect(page.getByTestId(`range-planner-tier-margin-input-${tier}`)).toBeVisible({
        timeout: 30_000,
      });
      await expect(page.getByTestId(`range-planner-core-pg-tier-${tier}`)).toBeVisible({
        timeout: 15_000,
      });
    }
  });

  test('range planner: assign tier для артикула через PATCH API', async ({ request }) => {
    const healthRes = await request.get('/api/workshop2/platform-core/health');
    test.skip(!healthRes.ok(), 'health API недоступен');

    const patchRes = await request.patch('/api/workshop2/collections/SS27/range-planner', {
      headers: W2_DEV_HEADERS,
      data: { articleId: 'demo-ss27-02', tier: 'trend' },
    });
    expect(patchRes.ok()).toBeTruthy();
    const json = (await patchRes.json()) as { ok?: boolean; assigned?: boolean };
    expect(json.ok).toBe(true);
    expect(json.assigned).toBe(true);
  });

  test('investor-readiness API + investor brief page', async ({ page, request }) => {
    const readinessRes = await request.get('/api/workshop2/investor-readiness');
    expect(readinessRes.ok()).toBeTruthy();
    const readiness = (await readinessRes.json()) as {
      ok?: boolean;
      report?: { readyForInvestorDemo?: boolean };
    };
    expect(readiness.ok ?? readiness.report).toBeTruthy();

    const briefApi = await request.get('/api/workshop2/investor-demo/brief');
    expect(briefApi.ok()).toBeTruthy();

    const res = await page.goto('/brand/production/workshop2/investor-brief', GOTO);
    expect(res?.status() ?? 599).toBeLessThan(500);
    await expect(page.getByTestId('workshop2-investor-brief-page')).toBeVisible({
      timeout: 60_000,
    });
    await expect(page.getByText(/Investor brief/i)).toBeVisible({ timeout: 15_000 });
    await expect(page.getByTestId('brand-w2-investor-pdf-export-btn')).toBeVisible({
      timeout: 15_000,
    });

    const pdfRes = await request.get('/api/workshop2/investor-demo/brief.pdf');
    expect(pdfRes.status()).toBeLessThan(500);
    expect(pdfRes.headers()['content-type']).toContain('application/pdf');
    const pdfBody = await pdfRes.body();
    expect(pdfBody.byteLength).toBeGreaterThan(200);
    expect(pdfBody.subarray(0, 4).toString()).toBe('%PDF');
  });

  test('supplier BOM: fill-rate на development materials view', async ({ page }) => {
    const res = await page.goto(
      '/factory/production/materials?collection=SS27&article=demo-ss27-01&view=development',
      GOTO
    );
    expect(res?.status() ?? 599).toBeLessThan(500);
    await expect(page.getByTestId('factory-materials-core')).toBeVisible({ timeout: 60_000 });
    await expect(page.getByTestId('materials-bom-fill-rate')).toBeVisible({ timeout: 30_000 });
    await expect(page.getByTestId('materials-bom-weighted-fill-rate')).toBeVisible({ timeout: 30_000 });
    await expect(page.getByTestId('materials-supplier-reference')).toBeVisible({ timeout: 30_000 });
  });
});
