import { test, expect } from '@playwright/test';
/** Pane section DOM ids (fit/qc): w2article-section-fit, w2article-section-qc — см. W2_PANE_SECTION helper. */
import { waitForDossierLoaded, W2_PANE_SECTION } from './helpers/w2-dossier-loaded';

/** SS27 E2E — demo-ss27-01 checklist (file-store no PG). rm -rf .next before flaky CI. */
const W2_DEMO_ARTICLE_TZ_FULL_SLUG = 'demo-ss27-01';
const PLAYWRIGHT_BASE_URL = process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:3123';

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

const pgOnlyMode =
  process.env.NEXT_PUBLIC_WORKSHOP2_PG_ONLY === '1' ||
  Boolean(process.env.WORKSHOP2_DATABASE_URL?.trim());

async function gotoArticleWorkspace(page: import('@playwright/test').Page, collectionId: string, articleId: string) {
  await page.goto(`${PLAYWRIGHT_BASE_URL}/brand/production/workshop2/c/${collectionId}/a/${articleId}`, {
    waitUntil: 'commit',
  });
}

async function waitForQcInspectorDeepLink(page: import('@playwright/test').Page) {
  await expect(page.getByTestId('workshop2-qc-inspector-deep-link')).toBeVisible({ timeout: 90_000 });
}

test.describe('SS27 Floor: demo-ss27-01', () => {
  test.skip(pgOnlyMode, 'file-store path — skip when PG-only / WORKSHOP2_DATABASE_URL set');

  test('file-store (no PG) sample-order → QC inspector deep link', async ({ page, context }) => {
    await seedBrandAuth(context);
    await gotoArticleWorkspace(page, 'SS27', W2_DEMO_ARTICLE_TZ_FULL_SLUG);
    await waitForDossierLoaded(page);
    await page.goto(
      `${PLAYWRIGHT_BASE_URL}/api/workshop2/articles/SS27/${W2_DEMO_ARTICLE_TZ_FULL_SLUG}/file-store-demo-ss27-01-sample-order`
    );
    try {
      await page.goto(
        `${PLAYWRIGHT_BASE_URL}/brand/production/workshop2/c/SS27/a/${W2_DEMO_ARTICLE_TZ_FULL_SLUG}?w2pane=qc`,
        { waitUntil: 'commit' }
      );
    } catch (e) {
      if (!(e instanceof Error) || !e.message.includes('ERR_ABORTED')) throw e;
    }
    await waitForDossierLoaded(page, 'qc', { skipNetworkIdle: true });
    await waitForQcInspectorDeepLink(page);
  });
});

test.describe('PG live — SS27 demo-ss27-01', () => {
  test.beforeEach(async ({ request }) => {
    const res = await request.get(`${PLAYWRIGHT_BASE_URL}/api/workshop2/health`);
    test.skip(!res.ok(), 'dev server unavailable — npm run dev:workshop2:pg');
    const json = (await res.json()) as { postgres?: string };
    const pgOk = json.postgres === 'ok' || json.postgres === 'enabled';
    test.skip(!pgOk, 'postgres not ok in /api/workshop2/health');
  });

  test('PG live health + dossier API', async ({ request }) => {
    const dossier = await request.get(
      `${PLAYWRIGHT_BASE_URL}/api/workshop2/articles/SS27/${W2_DEMO_ARTICLE_TZ_FULL_SLUG}/dossier`
    );
    expect(dossier.ok()).toBeTruthy();
    const body = (await dossier.json()) as { articleId?: string };
    expect(body.articleId ?? W2_DEMO_ARTICLE_TZ_FULL_SLUG).toBe(W2_DEMO_ARTICLE_TZ_FULL_SLUG);
  });

  test('PG live sample-order → QC inspector deep link', async ({ page, context }) => {
    test.setTimeout(360_000);
    await seedBrandAuth(context);
    const sample = await page.request.get(
      `${PLAYWRIGHT_BASE_URL}/api/workshop2/articles/SS27/${W2_DEMO_ARTICLE_TZ_FULL_SLUG}/sample-order`
    );
    expect(sample.ok()).toBeTruthy();

    const qcUrl = `${PLAYWRIGHT_BASE_URL}/brand/production/workshop2/c/SS27/a/${W2_DEMO_ARTICLE_TZ_FULL_SLUG}?w2pane=qc`;
    try {
      await page.goto(qcUrl, { waitUntil: 'commit', timeout: 180_000 });
    } catch (e) {
      if (!(e instanceof Error) || !e.message.includes('ERR_ABORTED')) throw e;
    }
    await waitForDossierLoaded(page, 'qc', { skipNetworkIdle: true });
    await expect(page.locator(W2_PANE_SECTION.qc)).toBeVisible();
    await waitForQcInspectorDeepLink(page);
  });
});
