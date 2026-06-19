/**
 * Phase 1 DoD — E2E smoke: fit → release order → movement / transition UI.
 */
import { test, expect, type Page } from '@playwright/test';
import {
  W2_DEMO_ARTICLE_TZ_FULL_SLUG,
  w2BrandProductionArticlePath,
} from './helpers/w2-demo-routes';
import { waitForDossierLoaded } from './helpers/w2-dossier-loaded';
import { openReleaseOrderViaTabStrip, openReleaseOverflowSubTab } from './helpers/w2-release-order-nav';

/** `commit` — быстрее `load`; cold compile артикула в E2E может занять 3–5 мин. */
const gotoOpts = { waitUntil: 'commit' as const, timeout: 300_000 };

async function seedBrandAuth(context: import('@playwright/test').BrowserContext): Promise<void> {
  await context.addInitScript(() => {
    const authUser = {
      uid: 'brand-001',
      email: 'brand@syntha.ai',
      displayName: 'Виктория Белова',
      roles: ['brand'],
      partnerName: 'Syntha Lab',
      brands: [{ name: 'Syntha Lab' }],
    };
    localStorage.setItem('syntha_auth_user', JSON.stringify(authUser));
    localStorage.setItem('syntha_last_email', 'brand@syntha.ai');
  });
}

async function gotoWithRetry(page: Page, url: string, attempts = 5): Promise<void> {
  let lastErr: unknown;
  for (let i = 0; i < attempts; i += 1) {
    try {
      const response = await page.goto(url, gotoOpts);
      if (response && response.status() >= 500 && i < attempts - 1) {
        await page.waitForTimeout(4_000 * (i + 1));
        continue;
      }
      if (response && response.status() >= 500) {
        throw new Error(
          `Article route HTTP ${response.status()} — вероятно stale .next-e2e или duplicate route. Выполните: node scripts/kill-e2e-port.cjs && rm -rf .next-e2e && PLAYWRIGHT_WORKERS=1 npx playwright test e2e/workshop2-sample-shop-flow.spec.ts`
        );
      }
      return;
    } catch (e) {
      lastErr = e;
      if (i < attempts - 1) await page.waitForTimeout(1500 * (i + 1));
    }
  }
  throw lastErr;
}

/** Fit chunk: deep-link + tab strip fallback (cold `.next-e2e` compile). */
async function openFitViaTabStrip(page: Page): Promise<void> {
  await gotoWithRetry(
    page,
    w2BrandProductionArticlePath(W2_DEMO_ARTICLE_TZ_FULL_SLUG, { w2pane: 'fit' })
  );

  await expect(page.locator('#w2-dossier-main').or(page.getByRole('tablist', { name: /Разделы артикула/i }))).toBeVisible({
    timeout: 180_000,
  });

  const fitTab = page.getByRole('tab', { name: /Примерка/i }).first();
  if (!(await fitTab.getAttribute('aria-selected').catch(() => null))?.includes('true')) {
    await expect(fitTab).toBeVisible({ timeout: 120_000 });
    await Promise.all([
      page.waitForURL(/w2pane=fit/, { timeout: 120_000 }).catch(() => undefined),
      fitTab.click(),
    ]);
  }

  await waitForDossierLoaded(page, 'fit', { skipNetworkIdle: true });
  await expect(page.getByTestId('workshop2-sample-panel')).toBeVisible({ timeout: 120_000 });
}

test.describe('Workshop2 sample shop flow', () => {
  test.beforeAll(async ({ request }) => {
    test.setTimeout(360_000);
    const fitUrl = w2BrandProductionArticlePath(W2_DEMO_ARTICLE_TZ_FULL_SLUG, { w2pane: 'fit' });
    for (let i = 0; i < 2; i += 1) {
      const res = await request.get(fitUrl, { timeout: 300_000 }).catch(() => null);
      if (res && res.status() < 500) return;
      await new Promise((r) => setTimeout(r, 5000));
    }
  });

  test('SS27: fit tab → release order sub-tab → movement / transition UI', async ({
    page,
    context,
  }) => {
    test.setTimeout(360_000);
    await seedBrandAuth(context);

    await openFitViaTabStrip(page);

    await openReleaseOrderViaTabStrip(page);
    await expect(page.getByTestId('workshop2-release-sub-tab-order')).toBeVisible({
      timeout: 90_000,
    });
    await expect(page.getByTestId('workshop2-release-order-status-panel')).toBeVisible({
      timeout: 90_000,
    });

    const transitionBtn = page.getByTestId('workshop2-release-order-advance-status');
    const movementBtn = page.getByTestId('workshop2-release-order-advance-movement');
    const noOrderHint = page.getByText(/Активный заказ не найден|Создайте заказ/i);

    const hasTransition = await transitionBtn.isVisible().catch(() => false);
    const hasMovement = await movementBtn.isVisible().catch(() => false);
    const hasNoOrder = await noOrderHint.isVisible().catch(() => false);

    expect(hasTransition || hasMovement || hasNoOrder).toBe(true);

    if (hasTransition) {
      await expect(transitionBtn).toBeEnabled();
      await expect(page.getByTestId('workshop2-release-order-next-step-wizard')).toBeVisible();
    }
    if (hasMovement) {
      await expect(movementBtn).toBeEnabled();
    }
  });
});

test.describe('Workshop2 release overflow sub-tabs', () => {
  for (const subTab of ['floor', 'cut', 'logistics', 'timeline'] as const) {
    test(`release overflow: ${subTab}`, async ({ page, context }) => {
      test.setTimeout(360_000);
      await seedBrandAuth(context);
      await openFitViaTabStrip(page);
      await openReleaseOverflowSubTab(page, subTab);
    });
  }
});
