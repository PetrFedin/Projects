import { test, expect } from '@playwright/test';
import { gotoPlatformCoreWorkspace } from './helpers/core-chain-overview';

const BRAND_ORDER_MESSAGES =
  '/brand/messages?contextType=b2b_order&contextId=B2B-DEMO-SHOP1-SS27&order=B2B-DEMO-SHOP1-SS27&orderId=B2B-DEMO-SHOP1-SS27';

const SHOP_ORDER_MESSAGES =
  '/shop/messages?contextType=b2b_order&contextId=B2B-DEMO-SHOP1-SS27&order=B2B-DEMO-SHOP1-SS27&orderId=B2B-DEMO-SHOP1-SS27';

async function expectNoPageOverflow(page: import('@playwright/test').Page): Promise<void> {
  await expect
    .poll(
      () =>
        page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1),
      { timeout: 30_000 }
    )
    .toBe(true);
}

test.describe('core-101: comms mobile list/chat split', () => {
  test('iPhone 393 — thread list, open chat pane, back to list', async ({ page }) => {
    test.setTimeout(240_000);
    await page.setViewportSize({ width: 393, height: 812 });

    const res = await gotoPlatformCoreWorkspace(page, BRAND_ORDER_MESSAGES);
    expect(res?.status() ?? 599).toBeLessThan(500);
    await page
      .waitForResponse(
        (r) => r.url().includes('/api/brand/messages/threads') && r.ok(),
        { timeout: 120_000 }
      )
      .catch(() => undefined);

    await expect(page.getByTestId('platform-core-comms-inbox-shell')).toBeVisible({
      timeout: 120_000,
    });

    const chatPane = page.getByTestId('platform-core-comms-chat-pane');
    const threadList = page.getByTestId('platform-core-comms-thread-list');

    // Deep-link с order context → сразу chat pane на < md (список скрыт)
    await expect(chatPane).toBeVisible({ timeout: 60_000 });
    await expect(threadList).toBeHidden();
    await expect(page.getByTestId('platform-core-comms-chat-back')).toBeVisible();

    await page.getByTestId('platform-core-comms-chat-back').click();
    await expect(threadList).toBeVisible({ timeout: 30_000 });
    await expect(page.getByTestId('brand-cm-thread-search')).toBeVisible();
    await expect(chatPane).toBeHidden();

    const firstThread = threadList
      .getByTestId('platform-core-comms-thread-item')
      .or(threadList.locator('[class*="group/chat-item"] button'))
      .first();
    await expect
      .poll(() => firstThread.count().then((n) => n > 0), { timeout: 60_000 })
      .toBe(true);
    await firstThread.click();

    await expect(chatPane).toBeVisible({ timeout: 30_000 });
    await expect(threadList).toBeHidden();

    await page.getByTestId('platform-core-comms-chat-back').click();
    await expect(threadList).toBeVisible();
    await expect(chatPane).toBeHidden();

    await expectNoPageOverflow(page);
  });

  test('shop iPhone 393 — deep-link chat pane + back to threads', async ({ page }) => {
    test.setTimeout(240_000);
    await page.setViewportSize({ width: 393, height: 812 });

    const res = await gotoPlatformCoreWorkspace(page, SHOP_ORDER_MESSAGES);
    expect(res?.status() ?? 599).toBeLessThan(500);

    await expect(page.getByTestId('platform-core-comms-inbox-shell')).toBeVisible({
      timeout: 120_000,
    });

    const chatPane = page.getByTestId('platform-core-comms-chat-pane');
    const threadList = page.getByTestId('platform-core-comms-thread-list');

    await expect(chatPane).toBeVisible({ timeout: 60_000 });
    await page.getByTestId('platform-core-comms-chat-back').click();
    await expect(threadList).toBeVisible({ timeout: 30_000 });
    await expect(page.getByTestId('shop-cm-thread-search')).toBeVisible();

    await expectNoPageOverflow(page);
  });

  test('iPad 834 — split list + chat visible', async ({ page }) => {
    test.setTimeout(240_000);
    await page.setViewportSize({ width: 834, height: 1194 });

    const res = await gotoPlatformCoreWorkspace(page, BRAND_ORDER_MESSAGES);
    expect(res?.status() ?? 599).toBeLessThan(500);

    await expect(page.getByTestId('platform-core-comms-inbox-shell')).toBeVisible({
      timeout: 120_000,
    });
    await expect(page.getByTestId('platform-core-comms-thread-list')).toBeVisible();
    await expect(page.getByTestId('platform-core-comms-chat-pane')).toBeVisible();
    await expect(page.getByTestId('platform-core-comms-chat-back')).toBeHidden();

    await expectNoPageOverflow(page);
  });
});
