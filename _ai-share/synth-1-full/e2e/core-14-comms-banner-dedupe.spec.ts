import { test, expect } from '@playwright/test';

/**
 * Dedupe контекст-баннеров при ?order= во всех 4 ролях (parity с core-02 brand/shop).
 */
const GOTO = { waitUntil: 'commit' as const, timeout: 120_000 };
const DEMO_ORDER = 'B2B-DEMO-SHOP1-SS27';
const ORDER_QS = `order=${DEMO_ORDER}&orderId=${DEMO_ORDER}`;

test.describe.configure({ mode: 'serial' });

test.describe('core-14: comms banner dedupe', () => {
  test('brand + shop: один role-cm-banner при order в URL', async ({ page }) => {
    const cases: Array<{ path: string; testId: string }> = [
      { path: `/brand/messages?${ORDER_QS}`, testId: 'brand-cm-banner' },
      { path: `/brand/calendar?${ORDER_QS}`, testId: 'brand-cm-banner' },
      { path: `/shop/messages?${ORDER_QS}`, testId: 'shop-cm-banner' },
      { path: `/shop/b2b/calendar?${ORDER_QS}`, testId: 'shop-cm-banner' },
    ];
    for (const { path, testId } of cases) {
      const res = await page.goto(path, GOTO);
      expect(res?.status() ?? 599).toBeLessThan(500);
      await expect(page.getByTestId(testId)).toHaveCount(1, { timeout: 30_000 });
    }
  });

  test('factory calendar workspace: policy strip off, demo banner без order', async ({ page }) => {
    const res = await page.goto('/factory/production/calendar', GOTO);
    expect(res?.status() ?? 599).toBeLessThan(500);
    await expect(page.getByTestId('mfr-cm-banner')).toHaveCount(1, { timeout: 30_000 });
    await expect(page.getByTestId('communications-artifact-policy-strip')).toHaveCount(0);
  });

  test('factory: без demo-баннера при order в URL', async ({ page }) => {
    for (const path of [
      `/factory/production/messages?${ORDER_QS}`,
      `/factory/supplier/messages?${ORDER_QS}`,
      `/factory/production/calendar?${ORDER_QS}`,
      `/factory/calendar?role=supplier&${ORDER_QS}`,
    ]) {
      const res = await page.goto(path, GOTO);
      expect(res?.status() ?? 599).toBeLessThan(500);
      await expect(page.getByTestId('mfr-cm-banner')).toHaveCount(0, { timeout: 30_000 });
      await expect(page.getByTestId('sup-cm-banner')).toHaveCount(0, { timeout: 30_000 });
    }
  });

  test('supplier messages: без дубля баннера при order в URL', async ({ page }) => {
    const res = await page.goto(`/factory/supplier/messages?${ORDER_QS}`, GOTO);
    expect(res?.status() ?? 599).toBeLessThan(500);
    await expect(page.getByTestId('factory-messages-core')).toBeVisible({ timeout: 30_000 });
    await expect(page.getByTestId('sup-cm-banner')).toHaveCount(0, { timeout: 30_000 });
    await expect(page.getByTestId('mfr-cm-banner')).toHaveCount(0);
    await expect(page.getByText(DEMO_ORDER).first()).toBeVisible({ timeout: 30_000 });
  });

  test('article context: без дубля баннера при order + workshop2_article', async ({ page }) => {
    const articleCtx =
      'contextType=workshop2_article&contextId=SS27%3Ademo-ss27-01&collection=SS27&article=demo-ss27-01';
    const paths = [
      `/brand/messages?${articleCtx}&${ORDER_QS}`,
      `/factory/production/messages?${articleCtx}&${ORDER_QS}`,
    ];
    for (const path of paths) {
      const res = await page.goto(path, GOTO);
      expect(res?.status() ?? 599).toBeLessThan(500);
      await expect(page.getByTestId('brand-cm-banner')).toHaveCount(
        path.startsWith('/brand') ? 1 : 0,
        { timeout: 30_000 }
      );
      await expect(page.getByTestId('mfr-cm-banner')).toHaveCount(0);
      await expect(page.getByTestId('sup-cm-banner')).toHaveCount(0);
    }
  });

  test('B2B шаблоны сообщений на brand messages', async ({ page }) => {
    const res = await page.goto(
      `/brand/messages?contextType=b2b_order&contextId=${DEMO_ORDER}&${ORDER_QS}`,
      GOTO
    );
    expect(res?.status() ?? 599).toBeLessThan(500);
    const templates = page.getByTestId('platform-core-b2b-message-templates');
    await expect(templates).toBeVisible({ timeout: 30_000 });
    await expect(page.getByTestId('platform-core-b2b-message-template-ship-window')).toBeVisible();
    await page.getByTestId('platform-core-b2b-message-template-ship-window').click();
    const textarea = page.locator('textarea').first();
    await expect(textarea).toContainText(DEMO_ORDER, { timeout: 15_000 });
  });
});
