import { test, expect } from '@playwright/test';

const GOTO = { waitUntil: 'domcontentloaded' as const, timeout: 60_000 };
const DEMO_FACTORY_ID = 'fact-1';

test.describe('core-22: empty checkout (no seed cart)', () => {
  test('checkout без корзины: CTA в матрицу, confirm disabled', async ({ page }) => {
    await page.context().clearCookies();
    await page.addInitScript(() => {
      window.localStorage.clear();
      window.sessionStorage.clear();
    });

    const res = await page.goto('/shop/b2b/checkout?collection=SS27', GOTO);
    expect(res?.status() ?? 599).toBeLessThan(500);
    await expect(page.getByTestId('shop-co-checkout-panel')).toBeVisible({ timeout: 30_000 });
    await expect(page.getByTestId('shop-co-checkout-empty-matrix-link')).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.getByTestId('shop-co-checkout-confirm')).toBeDisabled();
  });
});

test.describe('core-22: mfr unified PO inbox (comms pillar)', () => {
  test('factory comms: PO inbox из handoff queue', async ({ page, request }) => {
    const healthRes = await request.get('/api/workshop2/platform-core/health');
    const health = (await healthRes.json()) as { demoSeeded?: boolean };
    test.skip(!health.demoSeeded, 'нужен db:core:bootstrap (handoff queue)');

    const queueRes = await request.get(
      `/api/workshop2/factory/production-handoff-queue?factoryId=${encodeURIComponent(DEMO_FACTORY_ID)}`
    );
    test.skip(!queueRes.ok(), 'handoff queue API недоступен');
    const queueJson = (await queueRes.json()) as {
      ok?: boolean;
      items?: Array<{ b2bOrderId?: string; productionOrderId?: string }>;
    };
    test.skip(
      !queueJson.ok || !Array.isArray(queueJson.items) || queueJson.items.length === 0,
      'очередь цеха пуста'
    );

    const res = await page.goto('/factory/production/core?pillar=comms&collection=SS27', GOTO);
    expect(res?.status() ?? 599).toBeLessThan(500);
    await expect(page.getByTestId('mfr-cm-cabinet-thread-strip')).toBeVisible({
      timeout: 30_000,
    });
    await expect(page.getByTestId('mfr-cm-cabinet-po-inbox')).toBeVisible({ timeout: 30_000 });
    const firstPo = queueJson.items![0]!;
    const b2bId = firstPo.b2bOrderId?.trim() ?? '';
    const poId = firstPo.productionOrderId?.trim() ?? '';
    test.skip(!b2bId || !poId, 'handoff item без b2bOrderId/productionOrderId');

    await expect(page.getByTestId('mfr-cm-cabinet-po-inbox')).toContainText(`PO ${poId}`);
    await expect(page.getByTestId('mfr-cm-cabinet-po-inbox')).toContainText(b2bId);
  });
});
