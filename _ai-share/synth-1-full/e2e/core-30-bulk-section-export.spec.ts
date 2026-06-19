import { test, expect } from '@playwright/test';
import { checkoutPgOrderViaMatrix } from './helpers/core-checkout-pg';

test.describe.configure({ mode: 'serial' });

const GOTO = { waitUntil: 'domcontentloaded' as const, timeout: 60_000 };

/** Wave 10: bulk SKU wizard, section contextual thread, matrix import strip, JSON export. */
test.describe('core-30: bulk import + section contextual + matrix import + export json', () => {
  test('W2 bulk import wizard adds SKU to collection', async ({ page, request }) => {
    const healthRes = await request.get('/api/workshop2/platform-core/health');
    const health = (await healthRes.json()) as { demoSeeded?: boolean };
    test.skip(!health.demoSeeded, 'нужен db:core:bootstrap');

    const beforeRes = await request.get('/api/workshop2/collections/SS27/development-status');
    const beforeJson = (await beforeRes.json()) as { status?: { articleIds?: string[] } };
    const beforeCount = beforeJson.status?.articleIds?.length ?? 0;

    await page.goto('/brand/production/workshop2?w2col=SS27', GOTO);
    await expect(page.getByTestId('brand-dev-w2-hub-panel')).toBeVisible({ timeout: 60_000 });

    const bulkBtn = page.getByTestId('brand-w2-bulk-import-btn').first();
    await expect(bulkBtn).toBeVisible({ timeout: 30_000 });
    await bulkBtn.click();

    await expect(page.getByTestId('brand-w2-bulk-import-dialog')).toBeVisible({ timeout: 15_000 });
    const sku = `E2E-BULK-${Date.now()}`;
    await page.getByTestId('brand-w2-bulk-import-textarea').fill(`${sku};E2E bulk article`);
    await page.getByTestId('brand-w2-bulk-import-submit-btn').click();
    await expect(page.getByTestId('brand-w2-bulk-import-dialog')).toBeHidden({ timeout: 30_000 });

    await expect
      .poll(async () => {
        const res = await request.get('/api/workshop2/collections/SS27/development-status');
        const json = (await res.json()) as { status?: { articleIds?: string[] } };
        return json.status?.articleIds?.length ?? 0;
      })
      .toBeGreaterThan(beforeCount);
  });

  test('comms section context ensures PG thread anchor on messages deep-link', async ({
    page,
    request,
  }) => {
    const healthRes = await request.get('/api/workshop2/platform-core/health');
    const health = (await healthRes.json()) as { demoSeeded?: boolean };
    test.skip(!health.demoSeeded, 'нужен db:core:bootstrap');

    const orderId = await checkoutPgOrderViaMatrix(page);
    expect(orderId).toMatch(/^B2B-\d+$/);

    await page.goto('/brand/core?pillar=comms&collection=SS27', GOTO);
    await expect(page.getByTestId('brand-cm-section-groups-picker')).toBeVisible({
      timeout: 60_000,
    });
    const registryGroup = page.getByTestId('brand-cm-section-group-brand-co-registry');
    await expect(registryGroup).toBeVisible({ timeout: 30_000 });
    await registryGroup.click();

    await expect(page).toHaveURL(/\/brand\/messages/, { timeout: 60_000 });
    await expect(page).toHaveURL(/section=brand-co-registry/, { timeout: 30_000 });
    await expect(page.getByTestId('comms-section-context-auto-thread')).toBeVisible({
      timeout: 30_000,
    });

    const ensureRes = await request.post('/api/messages/contextual/ensure-b2b-order', {
      data: {
        orderId,
        pillarId: 'collection_order',
        sectionId: 'brand-co-registry',
        source: 'api',
      },
    });
    expect(ensureRes.ok()).toBeTruthy();
    const ensureJson = (await ensureRes.json()) as { ok?: boolean; messageCount?: number };
    expect(ensureJson.ok).toBe(true);
    expect((ensureJson.messageCount ?? 0) >= 1).toBe(true);
  });

  test('brand sample cabinet shows matrix spine import strip', async ({ page, request }) => {
    const healthRes = await request.get('/api/workshop2/platform-core/health');
    const health = (await healthRes.json()) as { demoSeeded?: boolean };
    test.skip(!health.demoSeeded, 'нужен db:core:bootstrap');

    await page.goto('/brand/b2b-orders?collection=SS27', GOTO);
    await expect(page.getByTestId('brand-co-matrix-import-strip')).toBeVisible({ timeout: 30_000 });
    await expect(page.getByTestId('brand-co-registry-import-toolbar')).toBeVisible();
  });

  test('brand registry export JSON API returns PG orders', async ({ request }) => {
    const healthRes = await request.get('/api/workshop2/platform-core/health');
    const health = (await healthRes.json()) as { demoSeeded?: boolean; pgReachable?: boolean };
    test.skip(!health.demoSeeded || !health.pgReachable, 'нужен db:core:bootstrap + PG');

    const res = await request.get('/api/brand/b2b/orders/export?format=json&collectionId=SS27');
    expect(res.ok()).toBeTruthy();
    const json = (await res.json()) as {
      ok?: boolean;
      count?: number;
      source?: string;
      orders?: unknown[];
    };
    expect(json.ok).toBe(true);
    expect(json.source).toBe('pg');
    expect(Array.isArray(json.orders)).toBe(true);
  });
});
