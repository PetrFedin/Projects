import { test, expect } from '@playwright/test';

const GOTO = { waitUntil: 'domcontentloaded' as const, timeout: 60_000 };
const DEMO_ORDER = 'B2B-DEMO-SHOP1-SS27';

test.describe('core-21: comms section-groups UI', () => {
  test('brand comms hub: section-groups picker + deep-link', async ({ page }) => {
    test.setTimeout(180_000);
    const res = await page.goto('/brand/core?pillar=comms&collection=SS27', GOTO);
    expect(res?.status() ?? 599).toBeLessThan(500);
    await expect(page.getByTestId('brand-cm-section-groups-picker')).toBeVisible({
      timeout: 60_000,
    });
    const registryGroup = page.getByTestId('brand-cm-section-group-brand-co-registry');
    await expect(registryGroup).toBeVisible({ timeout: 30_000 });
    const href = await registryGroup.getAttribute('href');
    expect(href).toMatch(/pillar=collection_order/);
    expect(href).toMatch(/section=brand-co-registry/);
    expect(href).toMatch(new RegExp(DEMO_ORDER));

    await registryGroup.click();
    await expect(page).toHaveURL(/\/brand\/messages/, { timeout: 60_000 });
    await expect(page).toHaveURL(/section=brand-co-registry/, { timeout: 30_000 });
    await expect(page).toHaveURL(/pillar=collection_order/, { timeout: 30_000 });
  });

  test('shop comms hub: section-groups picker visible', async ({ page }) => {
    const res = await page.goto('/shop/core?pillar=comms&collection=SS27', GOTO);
    expect(res?.status() ?? 599).toBeLessThan(500);
    await expect(page.getByTestId('shop-cm-section-groups-picker')).toBeVisible({
      timeout: 60_000,
    });
    await expect(page.getByTestId('shop-cm-section-group-shop-co-buyer-tracking')).toBeVisible({
      timeout: 30_000,
    });
  });

  test('brand order detail: shop disclosure preview strip', async ({ page }) => {
    const res = await page.goto(`/brand/b2b-orders/${DEMO_ORDER}`, GOTO);
    expect(res?.status() ?? 599).toBeLessThan(500);
    await expect(page.getByTestId('brand-co-shop-disclosure-preview-strip')).toBeVisible({
      timeout: 60_000,
    });
    await expect(page.getByTestId('brand-co-shop-disclosure-preview-tracking-link')).toHaveAttribute(
      'href',
      new RegExp(DEMO_ORDER)
    );
  });
});
