import { test, expect } from '@playwright/test';
import {
  checkoutPgOrderViaMatrix,
  confirmPgOrderViaApi,
  fetchPgChainStatus,
} from './helpers/core-checkout-pg';

test.describe.configure({ mode: 'serial' });

/** Hub/context strip без B2B-DEMO pin; WMS reserve на confirm (если internal WMS включён). */
test.describe('core-27: PG hub labels + WMS on confirm', () => {
  test('context strip shows PG order id, not B2B-DEMO', async ({ page, request }) => {
    const healthRes = await request.get('/api/workshop2/platform-core/health');
    const health = (await healthRes.json()) as { demoSeeded?: boolean };
    test.skip(!health.demoSeeded, 'нужен db:core:bootstrap');

    const orderId = await checkoutPgOrderViaMatrix(page);

    const overviewRes = await request.get(
      `/api/workshop2/platform-core/chain-overview?collectionId=SS27`
    );
    const overviewJson = (await overviewRes.json()) as { overview?: { demoOrderId?: string } };
    expect(overviewJson.overview?.demoOrderId).not.toMatch(/B2B-DEMO/);

    const registryRes = await request.get('/api/brand/b2b/orders?collectionId=SS27');
    const registryJson = (await registryRes.json()) as { orders?: Array<{ id?: string }> };
    expect(registryJson.orders?.some((o) => o.id === orderId)).toBe(true);

    await page.goto(
      `/factory/production/dossier/demo-ss27-01?collection=SS27`,
      { waitUntil: 'domcontentloaded', timeout: 60_000 }
    );
    await expect(page.getByTestId('mfr-dev-dossier-panel')).toBeVisible({ timeout: 30_000 });
    const strip = page.getByTestId('platform-core-demo-id-strip');
    await expect(strip).toBeVisible({ timeout: 30_000 });
    const ordChip = strip.getByTestId('platform-core-ctx-order');
    await expect(ordChip).toBeVisible({ timeout: 30_000 });
    await expect(ordChip).not.toContainText('B2B-DEMO');
    await expect(strip).not.toContainText('B2B-DEMO-SHOP1');
  });

  test('brand confirm triggers inventory_reserved when WMS PG-backed', async ({
    page,
    request,
  }) => {
    const healthRes = await request.get('/api/workshop2/platform-core/health');
    const health = (await healthRes.json()) as { demoSeeded?: boolean; pgReachable?: boolean };
    test.skip(!health.demoSeeded, 'нужен db:core:bootstrap');

    const orderId = await checkoutPgOrderViaMatrix(page);
    await confirmPgOrderViaApi(request, orderId);

    const chain = await fetchPgChainStatus(request, orderId);
    expect(chain.steps?.find((s) => s.id === 'brand_confirmed')?.done).toBe(true);

    if (health.pgReachable) {
      const inventoryStep = chain.steps?.find((s) => s.id === 'inventory_reserved');
      if (inventoryStep?.done) {
        await page.goto('/brand/core?pillar=order_production&collection=SS27', {
          waitUntil: 'domcontentloaded',
          timeout: 60_000,
        });
        await expect(page.getByTestId('brand-op-cabinet-wms-reserve-badge')).toContainText(
          /Резерв WMS/
        );
      }
    }
  });

  test('supplier catalog picker visible when multiple published articles', async ({
    page,
    request,
  }) => {
    const healthRes = await request.get('/api/workshop2/platform-core/health');
    const health = (await healthRes.json()) as { demoSeeded?: boolean };
    test.skip(!health.demoSeeded, 'нужен db:core:bootstrap');

    await checkoutPgOrderViaMatrix(page);

    const pubRes = await request.get('/api/workshop2/collections/SS27/published-articles');
    const pubJson = (await pubRes.json()) as { articles?: unknown[] };
    test.skip((pubJson.articles?.length ?? 0) < 2, 'нужно ≥2 published-articles для picker');

    await page.goto('/factory/supplier/core?pillar=development&collection=SS27', {
      waitUntil: 'domcontentloaded',
      timeout: 60_000,
    });
    await expect(page.getByTestId('supplier-catalog-article-picker')).toBeVisible({
      timeout: 30_000,
    });
  });
});
