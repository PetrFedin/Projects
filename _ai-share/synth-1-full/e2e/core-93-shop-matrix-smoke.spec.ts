import { test, expect } from '@playwright/test';
import { expectWorkspacePillarStrip, waitForChainOverview } from './helpers/core-chain-overview';

const GOTO = { waitUntil: 'domcontentloaded' as const, timeout: 120_000 };

test('shop matrix core — list chrome without B2B error', async ({ page }) => {
  await page.setViewportSize({ width: 393, height: 812 });
  const chain = waitForChainOverview(page, { collectionId: 'SS27' });
  const res = await page.goto('/shop/b2b/matrix?collection=SS27', GOTO);
  expect(res?.status() ?? 599).toBeLessThan(500);
  await chain;
  await expect(page.getByText('Ошибка B2B магазина')).toHaveCount(0);
  const chrome = page.getByTestId('platform-core-list-chrome');
  await expect(chrome).toBeVisible({ timeout: 60_000 });
  await expectWorkspacePillarStrip(page, chrome);
  await expect(page.getByTestId('shop-co-matrix-shell')).toBeVisible({ timeout: 60_000 });
});

test('shop matrix core — iPad sticky article col on horizontal scroll', async ({ page }) => {
  await page.setViewportSize({ width: 834, height: 1194 });
  const chain = waitForChainOverview(page, { collectionId: 'SS27' });
  const res = await page.goto('/shop/b2b/matrix?collection=SS27', GOTO);
  expect(res?.status() ?? 599).toBeLessThan(500);
  await chain;
  await expect(page.getByTestId('shop-co-matrix-shell')).toBeVisible({ timeout: 60_000 });

  const scroll = page.locator('[data-testid^="shop-co-matrix-size-scroll-"]').first();
  await expect(scroll).toBeVisible({ timeout: 30_000 });

  const sticky = await page.evaluate(() => {
    const scroller = document.querySelector('[data-testid^="shop-co-matrix-size-scroll-"]');
    if (!scroller) return { ok: false, reason: 'no scroll container' };
    const stickyCol = scroller.firstElementChild;
    if (!stickyCol) return { ok: false, reason: 'no sticky col' };
    const before = stickyCol.getBoundingClientRect().left;
    scroller.scrollLeft = Math.min(120, scroller.scrollWidth);
    const after = stickyCol.getBoundingClientRect().left;
    const style = window.getComputedStyle(stickyCol);
    return {
      ok: Math.abs(before - after) < 2 && style.position === 'sticky',
      reason: `left ${before}→${after}, position=${style.position}`,
    };
  });
  expect(sticky.ok, sticky.reason).toBe(true);

  const rowCount = await page.locator('[data-testid^="shop-co-matrix-row-"]').count();
  expect(rowCount).toBeGreaterThan(0);
});
