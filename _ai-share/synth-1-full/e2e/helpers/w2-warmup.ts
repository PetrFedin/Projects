/**
 * HTTP + browser прогрев Workshop2 article routes (cold `.next-e2e` compile).
 */
import { expect, type APIRequestContext, type Browser, type Page } from '@playwright/test';
import {
  W2_DEMO_ARTICLE_TZ_FULL_SLUG,
  W2_DEMO_COLLECTION_SLUG,
  w2BrandProductionArticlePath,
} from './w2-demo-routes';
import { waitForDossierLoaded } from './w2-dossier-loaded';

const gotoOpts = { waitUntil: 'commit' as const, timeout: 300_000 };

export async function seedBrandAuth(
  context: import('@playwright/test').BrowserContext
): Promise<void> {
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

async function gotoWithRetry(page: Page, url: string, attempts = 8): Promise<void> {
  let lastErr: unknown;
  for (let i = 0; i < attempts; i += 1) {
    try {
      const response = await page.goto(url, gotoOpts);
      if (response && response.status() >= 500 && i < attempts - 1) {
        await page.waitForTimeout(4_000 * (i + 1));
        continue;
      }
      if (response && response.status() >= 500) {
        throw new Error(`Article route HTTP ${response.status()} — stale .next-e2e?`);
      }
      return;
    } catch (e) {
      lastErr = e;
      const msg = e instanceof Error ? e.message : String(e);
      const retryable =
        msg.includes('ERR_CONNECTION_REFUSED') ||
        msg.includes('ERR_EMPTY_RESPONSE') ||
        msg.includes('net::ERR');
      if (i < attempts - 1) {
        await page.waitForTimeout(retryable ? 8_000 * (i + 1) : 1500 * (i + 1));
      }
    }
  }
  throw lastErr;
}

/** HTTP-прогрев SSR/API (без client chunks). Одна попытка на route — cold compile может занять 5+ мин. */
export async function warmWorkshop2ArticleRoutesHttp(
  request: APIRequestContext,
  panes: Array<Record<string, string | undefined>> = [{ w2pane: 'fit' }]
): Promise<void> {
  const dossierApi = `/api/workshop2/articles/${W2_DEMO_COLLECTION_SLUG}/${W2_DEMO_ARTICLE_TZ_FULL_SLUG}/dossier`;
  await request.get(dossierApi, { timeout: 600_000 }).catch(() => null);

  for (const query of panes) {
    const url = w2BrandProductionArticlePath(W2_DEMO_ARTICLE_TZ_FULL_SLUG, query);
    const res = await request.get(url, { timeout: 600_000 }).catch(() => null);
    if (res && res.status() >= 500) {
      await request.get(url, { timeout: 600_000 }).catch(() => null);
    }
  }
}

/** Browser-прогрев нескольких pane/sub-nav в одной сессии (меньше нагрузка на dev-сервер). */
export async function warmWorkshop2ArticlePanesBrowser(
  browser: Browser,
  panes: Array<Record<string, string | undefined>>
): Promise<void> {
  const context = await browser.newContext();
  await seedBrandAuth(context);
  const page = await context.newPage();
  try {
    for (const query of panes) {
      const pane = query.w2pane ?? 'tz';
      // Release+order: tab strip надёжнее deep-link (совпадает с flow spec).
      if (pane === 'release' && query.w2relsub === 'order') {
        const fitUrl = w2BrandProductionArticlePath(W2_DEMO_ARTICLE_TZ_FULL_SLUG, { w2pane: 'fit' });
        await gotoWithRetry(page, fitUrl);
        await waitForDossierLoaded(page, 'fit', { skipNetworkIdle: true });
        await expect(page.getByTestId('workshop2-sample-panel')).toBeVisible({ timeout: 120_000 });
        const { openReleaseOrderViaTabStrip } = await import('./w2-release-order-nav');
        await openReleaseOrderViaTabStrip(page);
        await expect(page.getByTestId('workshop2-release-sub-tab-order')).toBeVisible({
          timeout: 90_000,
        });
        continue;
      }

      const url = w2BrandProductionArticlePath(W2_DEMO_ARTICLE_TZ_FULL_SLUG, query);
      await gotoWithRetry(page, url);
      await waitForDossierLoaded(page, query.w2pane, { skipNetworkIdle: true });
      if (pane === 'fit') {
        await expect(page.getByTestId('workshop2-sample-panel')).toBeVisible({ timeout: 120_000 });
      }
      if (pane === 'release') {
        await expect(
          page
            .locator('#w2article-section-release')
            .or(page.getByTestId('workshop2-release-sub-tab-order'))
        ).toBeVisible({ timeout: 90_000 });
      }
    }
  } finally {
    try {
      await context.close();
    } catch {
      /* Playwright trace artifact race — ignore close noise */
    }
  }
}

/** Browser-прогрев: client hydration + dynamic import fit/release chunks. */
export async function warmWorkshop2ArticlePaneBrowser(
  browser: Browser,
  query: Record<string, string | undefined>
): Promise<void> {
  await warmWorkshop2ArticlePanesBrowser(browser, [query]);
}
