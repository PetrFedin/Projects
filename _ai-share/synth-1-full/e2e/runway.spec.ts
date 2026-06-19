import { test, expect, type Page } from '@playwright/test';

/**
 * Runway E2E — silk-midi-dress, compare, embed, playlist, demo redirect, cart, share, analytics.
 * Dev: npm run test:e2e:runway
 * CI:  npm run test:e2e:runway:ci
 */

const RUNWAY_PRODUCT = '/products/silk-midi-dress?view=runway';

/** 3 hero scroll-video SKU — regression gate (Iteration 9). */
const HERO_RUNWAY_SKUS = [
  'silk-midi-dress',
  'cashmere-crewneck-sweater',
  'tech-anorak-men',
] as const;

test.describe.configure({ mode: 'serial' });

/** Минимальный mp4 — снижает RAM при serial прогоне hero PDP. */
const MINIMAL_MP4 = Buffer.from([
  0x00, 0x00, 0x00, 0x1c, 0x66, 0x74, 0x79, 0x70, 0x69, 0x73, 0x6f, 0x6d,
  0x00, 0x00, 0x02, 0x00, 0x69, 0x73, 0x6f, 0x6d, 0x69, 0x73, 0x6f, 0x32,
  0x6d, 0x70, 0x34, 0x31,
]);

async function blockExternalFonts(page: Page) {
  await page.route(/fonts\.(googleapis|gstatic)\.com/, (route) => route.abort());
}

async function stubRunwayVideos(page: Page) {
  await page.route(/\/videos\/.*\.mp4(\?|$)/i, (route) =>
    route.fulfill({ status: 200, contentType: 'video/mp4', body: MINIMAL_MP4 })
  );
}

async function configureRunwayPage(page: Page) {
  await blockExternalFonts(page);
  await stubRunwayVideos(page);
}

async function waitForRunwayStage(page: Page) {
  await configureRunwayPage(page);
  await page
    .waitForResponse((res) => res.url().includes('/api/runway/config') && res.ok(), {
      timeout: 90_000,
    })
    .catch(() => undefined);

  const stage = page.locator('[data-runway-stage]').first();
  await stage.waitFor({ state: 'attached', timeout: 120_000 });
  await expect(stage).toHaveAttribute('data-runway-ready', 'true', { timeout: 90_000 });
  await expect(stage).toBeVisible({ timeout: 30_000 });
  await expect(page.locator('[data-runway-thumb]').first()).toBeVisible({ timeout: 45_000 });
}

async function gotoRunwayProduct(page: Page, path = RUNWAY_PRODUCT) {
  let lastErr: unknown;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      await page.goto(path, { waitUntil: 'domcontentloaded', timeout: 120_000 });
      await waitForRunwayStage(page);
      return;
    } catch (err) {
      lastErr = err;
      const msg = err instanceof Error ? err.message : String(err);
      const bodyText = await page.locator('body').innerText().catch(() => '');
      if (/Application error|502|503|ECONNREFUSED|ERR_CONNECTION_REFUSED/i.test(`${msg} ${bodyText}`)) {
        if (attempt === 2) {
          throw new Error(
            `runway PDP unavailable (attempt ${attempt + 1}/3): ${msg.slice(0, 200)}`
          );
        }
        await new Promise((r) => setTimeout(r, 5000));
        continue;
      }
      if (attempt === 2) throw err;
      await new Promise((r) => setTimeout(r, 3000));
    }
  }
  throw lastErr instanceof Error ? lastErr : new Error('runway PDP load failed');
}

test.beforeEach(async ({ page }) => {
  await configureRunwayPage(page);
  await page.addInitScript(() => {
    localStorage.setItem('runway-onboarding-dismissed', '1');
    localStorage.setItem('runway-compare-hint-dismissed', '1');
  });
});

/** Сброс video/DOM между serial browser-тестами — снижает peak RAM и OOM next start. */
test.afterEach(async ({ page }) => {
  await page
    .evaluate(() => {
      document.querySelectorAll('video').forEach((el) => {
        el.pause();
        el.removeAttribute('src');
        el.load();
      });
    })
    .catch(() => undefined);
  await page.goto('about:blank').catch(() => undefined);
});

test.describe('Runway scroll switcher', () => {
  test.beforeAll(async ({ request }) => {
    await request.get('/api/runway/health', { timeout: 60_000 }).catch(() => undefined);
    await request.get('/api/runway/config', { timeout: 60_000 }).catch(() => undefined);
    await request.get('/api/products/silk-midi-dress', { timeout: 60_000 }).catch(() => undefined);
    await request.get('/products/silk-midi-dress?view=runway', { timeout: 120_000 }).catch(() => undefined);
    await request
      .post('/api/runway/analytics', {
        timeout: 60_000,
        data: {
          events: [
            {
              event: 'scroll_experience_view',
              productSlug: 'silk-midi-dress',
              sectionIndex: 0,
              timestamp: Date.now(),
            },
          ],
        },
      })
      .catch(() => undefined);
    await request.get('/api/runway/analytics', { timeout: 60_000 }).catch(() => undefined);
  });

  test('runway health API returns operational snapshot', async ({ request }) => {
    let lastStatus = 0;
    let body: Record<string, unknown> | null = null;

    for (let attempt = 0; attempt < 30; attempt++) {
      const res = await request.get('/api/runway/health', { timeout: 15_000 });
      lastStatus = res.status();
      if ([200, 503].includes(lastStatus)) {
        body = await res.json();
        break;
      }
      if (lastStatus >= 500) {
        await new Promise((r) => setTimeout(r, 2000));
        continue;
      }
      await new Promise((r) => setTimeout(r, 1500));
    }

    expect([200, 503]).toContain(lastStatus);
    expect(body).toBeTruthy();
    expect(typeof body!.healthy).toBe('boolean');
    expect(body!.scrollVideoProductCount).toBeGreaterThan(0);
    expect(body!.checks).toBeTruthy();
    expect((body!.checks as { catalog?: string }).catalog).toBe('ok');
    expect(body!.configLoaded).toBe(true);
    expect(body!.analyticsStoreWritable).toBe(true);
  });

  test('runway analytics API returns dashboard', async ({ request }) => {
    const post = await request.post('/api/runway/analytics', {
      data: {
        events: [
          {
            event: 'scroll_experience_view',
            productSlug: 'silk-midi-dress',
            sectionIndex: 0,
            timestamp: Date.now(),
          },
        ],
      },
    });
    expect(post.ok()).toBeTruthy();

    const get = await request.get('/api/runway/analytics');
    expect(get.ok()).toBeTruthy();
    const body = await get.json();
    expect(body.metrics).toBeTruthy();
    expect(body.funnel).toBeTruthy();
  });

  test('runway analytics API supports date filter and pagination', async ({ request }) => {
    const ts = Date.UTC(2026, 4, 15, 12, 0, 0);
    await request.post('/api/runway/analytics', {
      data: {
        events: [
          {
            event: 'scroll_experience_section_change',
            productSlug: 'silk-midi-dress',
            sectionIndex: 1,
            timestamp: ts,
          },
        ],
      },
    });

    const get = await request.get(
      '/api/runway/analytics?from=2026-05-15&to=2026-05-15&page=1&pageSize=10'
    );
    expect(get.ok()).toBeTruthy();
    const body = await get.json();
    expect(body.dateRange).toEqual({ from: '2026-05-15', to: '2026-05-15' });
    expect(body.eventsPage).toBeTruthy();
    expect(typeof body.eventsPage.page).toBe('number');
    expect(Array.isArray(body.eventsPage.items)).toBe(true);
  });

  test('runway openapi endpoint returns yaml spec', async ({ request }) => {
    const res = await request.get('/api/runway/openapi');
    expect(res.ok()).toBeTruthy();
    const text = await res.text();
    expect(text).toContain('openapi:');
    expect(text).toContain('/analytics');
  });

  test('runway analytics API rejects invalid body', async ({ request }) => {
    const res = await request.post('/api/runway/analytics', {
      data: { events: [{ event: 'bad_event', productSlug: 'x', timestamp: 1 }] },
    });
    expect(res.status()).toBe(400);
  });

  test('runway config API returns scroll-experience config', async ({ request }) => {
    const res = await request.get('/api/runway/config');
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body.featuredProductSlug).toBeTruthy();
    expect(body.analyticsEnabled).toBeTruthy();
    expect(typeof body.analyticsEnabled.ga4).toBe('boolean');
    expect(typeof body.analyticsEnabled.posthog).toBe('boolean');
  });

  test('runway-onboard-brand.mjs smoke (checklist only)', async () => {
    if (process.env.CI === 'true' || process.env.CI === '1') {
      test.skip(true, 'Onboard CLI smoke skipped in CI');
    }
    const { spawnSync } = await import('node:child_process');
    const r = spawnSync(
      'node',
      ['scripts/runway-onboard-brand.mjs', 'Nordic Wool', 'silk-midi-dress'],
      { cwd: process.cwd(), encoding: 'utf8' }
    );
    expect(r.status).toBe(0);
    expect(r.stdout).toContain('Nordic Wool');
  });

  test('products API returns silk-midi-dress', async ({ request }) => {
    const res = await request.get('/api/products/silk-midi-dress');
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body.slug).toBe('silk-midi-dress');
    expect(body.displayMode).toBe('scroll-video');
  });

  test('cashmere section videos are distinct from silk paths', async ({ request }) => {
    const res = await request.get('/api/products/cashmere-crewneck-sweater');
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    const urls = (body.scrollSwitcherSections ?? []).map(
      (s: { sectionVideoUrl?: string }) => s.sectionVideoUrl
    );
    expect(urls).toHaveLength(3);
    for (const url of urls) {
      expect(url).not.toMatch(/\/videos\/sections\/silk-\d+\.mp4$/);
    }
  });

  test('tech-anorak-men section videos use anorak paths', async ({ request }) => {
    const res = await request.get('/api/products/tech-anorak-men');
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body.displayMode).toBe('scroll-video');
    const urls = (body.scrollSwitcherSections ?? []).map(
      (s: { sectionVideoUrl?: string }) => s.sectionVideoUrl
    );
    expect(urls).toHaveLength(3);
    for (const url of urls) {
      expect(url).toMatch(/\/videos\/sections\/anorak-\d+\.mp4$/);
    }
  });

  test('runway products API returns scroll-video array', async ({ request }) => {
    const res = await request.get('/api/runway/products');
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(Array.isArray(body)).toBe(true);
    expect(body).toHaveLength(3);
    for (const slug of HERO_RUNWAY_SKUS) {
      expect(body.some((p: { slug?: string }) => p.slug === slug)).toBe(true);
    }
  });

  test('runway analytics CSV export returns attachment', async ({ request }) => {
    await request.post('/api/runway/analytics', {
      data: {
        events: [
          {
            event: 'scroll_experience_view',
            productSlug: 'silk-midi-dress',
            sectionIndex: 0,
            timestamp: Date.now(),
          },
        ],
      },
    });

    const res = await request.get('/api/runway/analytics/export?format=dashboard');
    expect(res.ok()).toBeTruthy();
    expect(res.headers()['content-type']).toContain('text/csv');
    const body = await res.text();
    expect(body).toContain('# KPI');
    expect(body).toContain('views');
  });

  test('runway products API serves api data source mode', async ({ request }) => {
    const res = await request.get('/api/runway/products');
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body).toHaveLength(3);
    expect(body[0]).toHaveProperty('slug');
    expect(body[0]).toHaveProperty('displayMode');
  });

  test('api data source: silk-midi-dress product API returns scroll-video payload', async ({
    request,
  }) => {
    const apiRes = await request.get('/api/products/silk-midi-dress');
    expect(apiRes.ok()).toBeTruthy();
    const product = await apiRes.json();
    expect(product.slug).toBe('silk-midi-dress');
    expect(product.displayMode).toBe('scroll-video');
    expect(product.scrollSwitcherSections?.length).toBe(3);
    expect(product.scrollSwitcherSections?.[0]?.posterUrl).toMatch(/silk-midi-dress-section-0\.jpg$/);
  });

  for (const slug of HERO_RUNWAY_SKUS) {
    test(`hero SKU ${slug} loads ?view=runway with data-runway marker`, async ({ page, request }) => {
      test.setTimeout(300_000);
      const apiRes = await request.get(`/api/products/${slug}`);
      expect(apiRes.ok()).toBeTruthy();
      expect((await apiRes.json()).displayMode).toBe('scroll-video');
      await gotoRunwayProduct(page, `/products/${slug}?view=runway`);
      await page.evaluate(() => {
        document.querySelectorAll('video').forEach((el) => {
          el.pause();
          el.removeAttribute('src');
          el.load();
        });
      });
    });
  }

  test('silk-midi-dress runway: thumb 2 updates price region', async ({ page, request }) => {
    test.setTimeout(240_000);
    const apiRes = await request.get('/api/products/silk-midi-dress');
    expect(apiRes.ok()).toBeTruthy();
    const product = await apiRes.json();
    const section1 = product.scrollSwitcherSections?.[1];
    const expectedPrice = section1?.price ?? product.price;
    expect(typeof expectedPrice).toBe('number');
    const priceDigits = String(expectedPrice);
    const pricePattern = new RegExp(
      priceDigits.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1[\\s\\u00a0]?')
    );

    await page.goto(`${RUNWAY_PRODUCT}&section=1`, {
      waitUntil: 'domcontentloaded',
      timeout: 120_000,
    });
    await waitForRunwayStage(page);

    const thumb1 = page.locator('[data-runway-thumb="1"]');
    await expect(thumb1).toHaveAttribute('aria-selected', 'true', { timeout: 30_000 });
    await expect(thumb1).toHaveAttribute('aria-label', pricePattern, {
      timeout: 15_000,
    });
  });

  test('section favorite toggle persists aria-pressed', async ({ page }) => {
    await gotoRunwayProduct(page);

    const favorite = page.locator('[data-runway-favorite]').first();
    test.skip((await favorite.count()) === 0, 'Favorite control hidden in minimal layout');
    await favorite.scrollIntoViewIfNeeded();
    await expect(favorite).toBeVisible({ timeout: 15_000 });
    const before = await favorite.getAttribute('aria-pressed');
    await favorite.evaluate((node: HTMLButtonElement) => node.click());
    await expect(favorite).toHaveAttribute('aria-pressed', before === 'true' ? 'false' : 'true', {
      timeout: 5000,
    });
  });

  test('options panel scroll sensitivity slider updates value', async ({ page }) => {
    await gotoRunwayProduct(page);

    const trigger = page.locator('[data-runway-options-trigger]').first();
    test.skip((await trigger.count()) === 0, 'Options panel disabled (enableUserOptions=false)');
    await expect(trigger).toBeVisible({ timeout: 15_000 });
    await trigger.click();

    const panel = page.locator('[data-runway-options-panel]');
    await expect(panel).toBeVisible({ timeout: 10_000 });

    const slider = page.locator('[data-runway-scroll-sensitivity] [role="slider"]').first();
    await expect(slider).toBeVisible();

    await expect(async () => {
      const valueBefore = await slider.getAttribute('aria-valuenow');
      await slider.focus();
      await page.keyboard.press('End');
      await page.keyboard.press('ArrowLeft');
      await page.keyboard.press('ArrowLeft');
      const valueAfter = await slider.getAttribute('aria-valuenow');
      expect(valueBefore).toBeTruthy();
      expect(valueAfter).toBeTruthy();
      expect(Number(valueAfter)).not.toEqual(Number(valueBefore));
    }).toPass({ timeout: 10_000 });
  });

  test('kiosk mode loads with data-runway-kiosk marker', async ({ page }) => {
    await configureRunwayPage(page);
    await page.goto(`${RUNWAY_PRODUCT}&kiosk=1`, {
      waitUntil: 'domcontentloaded',
      timeout: 90_000,
    });
    await page.waitForResponse(
      (res) => res.url().includes('/api/runway/config') && res.ok(),
      { timeout: 60_000 }
    ).catch(() => undefined);
    await expect(page.locator('[data-runway-kiosk]')).toBeVisible({ timeout: 120_000 });
    await expect(page.locator('[data-runway-stage][data-runway-ready="true"]').first()).toBeVisible({
      timeout: 60_000,
    });
  });

  test('kiosk mode: Escape dismisses shell', async ({ page }) => {
    await configureRunwayPage(page);
    await page.goto(`${RUNWAY_PRODUCT}&kiosk=1`, {
      waitUntil: 'domcontentloaded',
      timeout: 90_000,
    });
    await expect(page.locator('[data-runway-kiosk]')).toBeVisible({ timeout: 120_000 });
    await page.keyboard.press('Escape');
    await expect(page.locator('[data-runway-kiosk]')).not.toBeVisible({ timeout: 5_000 });
  });

  test('kiosk mode hides more menu', async ({ page }) => {
    await configureRunwayPage(page);
    await page.goto(`${RUNWAY_PRODUCT}&kiosk=1`, {
      waitUntil: 'domcontentloaded',
      timeout: 90_000,
    });
    await expect(page.locator('[data-runway-kiosk]')).toBeVisible({ timeout: 120_000 });
    await expect(page.locator('[data-runway-more-menu]')).toHaveCount(0);
    await expect(page.locator('[data-runway-more-menu-trigger]')).toHaveCount(0);
  });

  test('kiosk autoadvance sets tour interval attribute', async ({ page }) => {
    await configureRunwayPage(page);
    await page.goto(`${RUNWAY_PRODUCT}&kiosk=1&autoadvance=30`, {
      waitUntil: 'domcontentloaded',
      timeout: 90_000,
    });
    await expect(page.locator('[data-runway-kiosk]')).toBeVisible({ timeout: 120_000 });
    await expect(page.locator('[data-runway-kiosk]')).toHaveAttribute(
      'data-runway-kiosk-tour-ms',
      '30000'
    );
  });

  test('compare view renders with compare=0,2', async ({ page }) => {
    await page.goto(`${RUNWAY_PRODUCT}&compare=0,2`, {
      waitUntil: 'domcontentloaded',
      timeout: 60_000,
    });
    await expect(page.locator('[data-runway-compare-view]')).toBeVisible({ timeout: 90_000 });
  });

  test('compare mobile flip toggle works', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${RUNWAY_PRODUCT}&compare=0,2`, {
      waitUntil: 'domcontentloaded',
      timeout: 60_000,
    });
    await expect(page.locator('[data-runway-compare-view]')).toBeVisible({ timeout: 90_000 });
    const flip = page.locator('[data-runway-compare-flip]');
    await expect(flip).toBeVisible({ timeout: 15_000 });
    await flip.evaluate((node: HTMLButtonElement) => node.click());
  });

  test('embed runway loads with data-runway-embed marker', async ({ page }) => {
    await page.goto('/embed/runway/silk-midi-dress?token=e2e-embed-token&compact=1&section=0', {
      waitUntil: 'domcontentloaded',
      timeout: 60_000,
    });
    await expect(page.locator('[data-runway-embed]')).toBeVisible({ timeout: 90_000 });
    await expect(page.locator('[data-runway-embed-root]')).toBeVisible({ timeout: 30_000 });
    await expect(page.locator('[data-runway-thumb]').first()).toBeVisible({ timeout: 30_000 });
  });

  test('embed runway denies access without token when token configured', async ({ page }) => {
    await page.goto('/embed/runway/silk-midi-dress?token=__e2e_probe_invalid__', {
      waitUntil: 'domcontentloaded',
      timeout: 60_000,
    });
    const tokenGateActive = await page
      .locator('[data-runway-embed-token-denied]')
      .isVisible()
      .catch(() => false);
    test.skip(
      !tokenGateActive,
      'NEXT_PUBLIC_RUNWAY_EMBED_TOKEN not set on server — embed deny gate inactive'
    );

    await page.goto('/embed/runway/silk-midi-dress', {
      waitUntil: 'domcontentloaded',
      timeout: 60_000,
    });
    await expect(page.locator('[data-runway-embed-token-denied]')).toBeVisible({ timeout: 30_000 });
    await expect(page.locator('[data-runway-stage]')).toHaveCount(0);
  });

  test('runway preferences API persists favorites to file store', async ({ request }) => {
    const userId = `e2e-prefs-${Date.now()}`;
    const put = await request.put('/api/runway/preferences', {
      headers: { 'X-Runway-User-Id': userId, 'Content-Type': 'application/json' },
      data: { userId, sectionFavorites: { 'silk-midi-dress': 2 } },
    });
    expect(put.ok()).toBeTruthy();

    const get = await request.get(`/api/runway/preferences?userId=${encodeURIComponent(userId)}`, {
      headers: { 'X-Runway-User-Id': userId },
    });
    expect(get.ok()).toBeTruthy();
    const body = await get.json();
    expect(body.sectionFavorites['silk-midi-dress']).toBe(2);
  });

  test('runway playlist shows multiple products', async ({ page }) => {
    await page.goto('/runway/playlist', { waitUntil: 'domcontentloaded', timeout: 60_000 });
    await expect(page.getByRole('heading', { name: /runway playlist/i })).toBeVisible({
      timeout: 60_000,
    });
    await expect(page.locator('[role="feed"]')).toBeVisible();
    await expect(page.locator('[data-runway-stage]').first()).toBeVisible({ timeout: 90_000 });
  });

  test('/demo/runway redirects to flagship silk runway PDP', async ({ page }) => {
    await page.goto('/demo/runway', { waitUntil: 'domcontentloaded', timeout: 60_000 });
    await expect(page).toHaveURL(/products\/silk-midi-dress.*view=runway/, { timeout: 60_000 });
    await expect(page.locator('[data-runway-stage][data-runway-ready="true"]')).toBeVisible({
      timeout: 90_000,
    });
  });

  test('add to cart opens cart drawer', async ({ page }) => {
    await gotoRunwayProduct(page);

    const detailsPanel = page.locator('[data-runway-details-panel]');
    await expect(detailsPanel).toBeVisible({ timeout: 30_000 });

    const addBtn = detailsPanel.locator('[data-runway-add-to-cart]');
    test.skip((await addBtn.count()) === 0, 'Add-to-cart control not rendered in details panel');

    const sizeButtons = detailsPanel.locator('button[aria-pressed]');
    const sizeCount = await sizeButtons.count();
    if (sizeCount > 0) {
      for (let i = 0; i < sizeCount; i++) {
        await sizeButtons.nth(i).click();
        const label = (await addBtn.innerText()).toLowerCase();
        if (!label.includes('выберите размер') && !label.includes('select size')) break;
        await page.keyboard.press('Escape').catch(() => undefined);
      }
    }

    const addLabel = (await addBtn.innerText()).toLowerCase();
    test.skip(
      addLabel.includes('выберите размер') || addLabel.includes('select size'),
      'No in-stock size selectable on runway PDP'
    );

    await addBtn.click();
    await expect(page.getByText(/товар добавлен в корзину|added to cart/i).first()).toBeVisible({
      timeout: 15_000,
    });

    const cartDialog = page.getByRole('dialog').filter({ hasText: /Корзина|Cart/i });
    if (!(await cartDialog.isVisible().catch(() => false))) {
      await page
        .getByRole('button', { name: /корзина|cart/i })
        .first()
        .click({ timeout: 10_000 })
        .catch(() => undefined);
    }
    await expect(cartDialog).toBeVisible({ timeout: 30_000 });
  });

  test('share button opens popover or copies link', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await gotoRunwayProduct(page);

    const shareBtn = page.getByRole('button', { name: /поделиться runway|share runway/i });
    test.skip((await shareBtn.count()) === 0, 'Share action hidden in minimal layout menu');
    await expect(shareBtn).toBeVisible({ timeout: 15_000 });
    await shareBtn.click({ modifiers: ['Shift'] });

    await expect(
      page.getByText(/ссылка скопирована|скопировано|link copied|copied/i).first()
    ).toBeVisible({ timeout: 10_000 });
  });

  test('demo ribbon hidden without ?demo=1', async ({ page }) => {
    await gotoRunwayProduct(page);
    await expect(page.getByText('Demo · Product Scroll Switcher')).toHaveCount(0);
  });

  test('runway playlist add to cart shows toast', async ({ page }) => {
    test.setTimeout(240_000);
    await page.goto('/runway/playlist', { waitUntil: 'domcontentloaded', timeout: 90_000 });
    await expect(page.locator('[data-runway-stage]').first()).toBeVisible({ timeout: 120_000 });
    // Не waitForRunwayStage на playlist — 3 сцены одновременно дают OOM на low-RAM.

    const addBtn = page.locator('[data-runway-add-to-cart]').first();
    test.skip((await addBtn.count()) === 0, 'Playlist card has no add-to-cart in minimal layout');
    const details = page.locator('[data-runway-details-panel], [data-runway-mobile-bar]').first();
    const sizeBtn = details.getByRole('button', { name: /^S$|^M$|^L$|^XS$/ }).first();
    if (await sizeBtn.isVisible().catch(() => false)) {
      await sizeBtn.click();
    }

    await expect(addBtn).toBeVisible({ timeout: 30_000 });
    await addBtn.click();

    await expect(
      page.locator('[data-sonner-toast], [role="status"]').filter({ hasText: /добавлен|корзин|cart/i }).first()
    ).toBeVisible({ timeout: 20_000 });
  });

  test('onboarding dismiss allows normal thumb click', async ({ page }) => {
    test.setTimeout(240_000);
    await page.addInitScript(() => {
      localStorage.removeItem('runway-onboarding-dismissed');
      localStorage.removeItem('runway-compare-hint-dismissed');
      localStorage.setItem('runway-guided-tour-done', '1');
    });
    await gotoRunwayProduct(page);

    const compareHint = page.locator('[data-runway-onboarding-compare]');
    if (await compareHint.isVisible().catch(() => false)) {
      await compareHint.getByRole('button').first().click();
    }

    const wheelHint = page.locator('[data-runway-onboarding-wheel]');
    if (await wheelHint.isVisible().catch(() => false)) {
      await wheelHint.getByRole('button').first().click();
    }

    const thumbs = page.locator('[data-runway-thumb]');
    await expect(thumbs.nth(1)).toBeVisible({ timeout: 15_000 });
    await thumbs.nth(1).click();
    await expect(page.locator('[data-runway-thumb="1"]')).toHaveAttribute('aria-selected', 'true', {
      timeout: 10_000,
    });
  });

  test('complete look add opens cart drawer', async ({ page }) => {
    test.setTimeout(240_000);
    await gotoRunwayProduct(page);

    const addLook = page.locator('[data-runway-look-add]').first();
    test.skip((await addLook.count()) === 0, 'Complete look hidden in minimal layout');
    await expect(addLook).toBeVisible({ timeout: 30_000 });

    await addLook.click();
    const sizeInPopover = page.locator('[data-runway-look-size]').first();
    if (await sizeInPopover.isVisible({ timeout: 5000 }).catch(() => false)) {
      await sizeInPopover.click();
    }

    await expect(page.getByRole('heading', { name: 'Корзина' })).toBeVisible({ timeout: 15_000 });
  });

  test('complete look add-all adds items and opens cart', async ({ page }) => {
    test.setTimeout(240_000);
    await gotoRunwayProduct(page);

    const addAll = page.locator('[data-runway-look-add-all]').first();
    test.skip((await addAll.count()) === 0, 'Complete look hidden in minimal layout');
    await expect(addAll).toBeVisible({ timeout: 30_000 });
    await addAll.click();

    await expect(page.getByRole('heading', { name: 'Корзина' })).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText(/\d+\s+товар(ов)?\s+в\s+корзине/i).first()).toBeVisible({
      timeout: 10_000,
    });
  });

  test('runway analytics summary API returns weekly KPIs', async ({ request }) => {
    await request.post('/api/runway/analytics', {
      data: {
        events: [
          {
            event: 'scroll_experience_view',
            productSlug: 'silk-midi-dress',
            timestamp: Date.now(),
          },
        ],
      },
    });

    const res = await request.get('/api/runway/analytics/summary?period=week');
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body.period).toBe('week');
    expect(body.dashboard?.metrics).toBeTruthy();
    expect(typeof body.uniqueProductSlugs).toBe('number');
  });

  test('runway landing page /runway shows catalog grid', async ({ page }) => {
    await page.goto('/runway', { waitUntil: 'domcontentloaded', timeout: 60_000 });
    await expect(page.getByRole('heading', { name: /Product Scroll Switcher/i })).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.locator('[data-runway-landing-grid]')).toBeVisible({ timeout: 15_000 });
    await expect(page.getByRole('link', { name: /Демо flagship/i })).toHaveAttribute(
      'href',
      /silk-midi-dress\?view=runway/
    );
    await expect(page.getByRole('link', { name: /Playlist/i })).toHaveAttribute(
      'href',
      '/runway/playlist'
    );
  });

  test('runway upload API accepts mp4 in dev', async ({ request }) => {
    const mp4 = Buffer.from([
      0x00, 0x00, 0x00, 0x1c, 0x66, 0x74, 0x79, 0x70, 0x69, 0x73, 0x6f, 0x6d,
    ]);
    const res = await request.post('/api/runway/upload', {
      multipart: {
        brandSlug: 'syntha-1',
        file: {
          name: 'e2e-test.mp4',
          mimeType: 'video/mp4',
          buffer: mp4,
        },
      },
    });
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body.url).toMatch(/^\/videos\/brands\/syntha-1\/.+\.mp4$/);
  });

  test('runway analytics SSE stream returns event-stream', async ({ baseURL }) => {
    const url = `${baseURL ?? 'http://127.0.0.1:3000'}/api/runway/analytics/stream`;
    const res = await fetch(url);
    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toContain('text/event-stream');

    const reader = res.body?.getReader();
    expect(reader).toBeTruthy();
    const { value } = await reader!.read();
    const chunk = new TextDecoder().decode(value ?? new Uint8Array());
    expect(chunk).toContain('data:');
    expect(chunk).toContain('metrics');
    await reader!.cancel();
  });
});
