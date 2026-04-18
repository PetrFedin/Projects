import { test, expect, type Page } from '@playwright/test';

/** Next.js может добавить `?_rsc=…` к URL — сравниваем только pathname. */
function pathnameEquals(expected: string) {
  const norm = (p: string) => (p.replace(/\/$/, '') || '/') as string;
  const want = norm(expected);
  return (url: URL) => norm(url.pathname) === want;
}

const GOTO_RETRIES = 3;
const GOTO_RETRY_BACKOFF_MS = 3_000;
const GOTO_TIMEOUT_MS = 60_000;

function isTransientDevServerNavError(message: string): boolean {
  return (
    message.includes('ERR_EMPTY_RESPONSE') ||
    message.includes('ERR_CONNECTION_REFUSED') ||
    message.includes('ERR_CONNECTION_RESET') ||
    message.includes('ERR_SOCKET_NOT_CONNECTED')
  );
}

/** `next dev` под нагрузкой смока иногда отдаёт пустой ответ; повторяем goto (см. UNIFIED, troubleshooting). */
async function gotoResilient(
  page: Page,
  url: string,
  opts: { waitUntil?: 'load' | 'domcontentloaded'; timeout?: number } = {}
): Promise<void> {
  const waitUntil = opts.waitUntil ?? 'domcontentloaded';
  const timeout = opts.timeout ?? GOTO_TIMEOUT_MS;
  let last: Error | undefined;
  for (let attempt = 0; attempt < GOTO_RETRIES; attempt++) {
    try {
      await page.goto(url, { waitUntil, timeout });
      return;
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      last = e instanceof Error ? e : new Error(msg);
      if (!isTransientDevServerNavError(msg) || attempt === GOTO_RETRIES - 1) throw last;
      await new Promise((r) => setTimeout(r, GOTO_RETRY_BACKOFF_MS));
    }
  }
  throw last;
}

/**
 * Демо-приёмка экосистемы (см. INTEGRATION_MAP §6, docs/UNIFIED_ECOSYSTEM_VERIFICATION.md).
 * Shop inventory: serial — cross-links → logistics → shop shell (порядок важен для стабильного demo-auth в CI).
 */
test.describe('Unified ecosystem smoke (demo)', () => {
  test.describe('Shop inventory contour (serial)', () => {
    /** Shell + upload + cold `next dev` — лимит describe **210s** (см. `playwright.config.ts`). */
    test.describe.configure({ mode: 'serial', timeout: 210_000 });

    test('Brand ↔ Shop inventory cross-links (stock contour)', async ({ page }) => {
      await gotoResilient(page, '/brand/inventory', { waitUntil: 'domcontentloaded' });
      await expect(page.getByTestId('brand-inventory-page')).toBeVisible({ timeout: 30_000 });
      const toShop = page.getByTestId('brand-inventory-shop-stock-upload-link');
      await expect(toShop).toHaveAttribute('href', '/shop/inventory');
      await Promise.all([
        page.waitForURL(pathnameEquals('/shop/inventory'), { timeout: 45_000 }),
        toShop.click({ timeout: 45_000 }),
      ]);
      /** Холодный `next dev`: сегмент `/shop` после клика из `/brand` в CI иногда компилируется дольше 20s (без `waitForLoadState('load')` — при SPA нет второго `load`). */
      await expect(page.getByTestId('shop-inventory-page')).toBeVisible({ timeout: 60_000 });
      await expect(page.getByTestId('shop-stock-sync')).toBeVisible({ timeout: 45_000 });
      const back = page.getByTestId('shop-inventory-brand-matrix-link');
      await back.scrollIntoViewIfNeeded();
      await expect(back).toBeVisible({ timeout: 15_000 });
      await expect(back).toHaveAttribute('href', '/brand/inventory');
      await back.click();
      await page.waitForURL(pathnameEquals('/brand/inventory'), { timeout: 45_000 });
      await expect(page.getByTestId('brand-inventory-page')).toBeVisible({ timeout: 20_000 });
    });

    test('Brand logistics hub → Shop stock upload link', async ({ page }) => {
      await gotoResilient(page, '/brand/logistics', { waitUntil: 'domcontentloaded' });
      await expect(page.getByTestId('brand-logistics-hub-page')).toBeVisible();
      const toShop = page.getByTestId('brand-logistics-shop-stock-upload-link');
      await expect(toShop).toHaveAttribute('href', '/shop/inventory');
      await Promise.all([
        page.waitForURL(pathnameEquals('/shop/inventory'), { timeout: 45_000 }),
        toShop.click({ timeout: 45_000 }),
      ]);
      await expect(page.getByTestId('shop-inventory-page')).toBeVisible({ timeout: 60_000 });
      await expect(page.getByTestId('shop-stock-sync')).toBeVisible({ timeout: 45_000 });
    });

    test('Shop inventory shell', async ({ page }) => {
      /** `load` на SPA иногда гонится с Suspense (`shop/loading`); `domcontentloaded` + проверка URL ловят редирект на `/`. */
      await gotoResilient(page, '/shop/inventory', { waitUntil: 'domcontentloaded' });
      await expect(page).toHaveURL(pathnameEquals('/shop/inventory'), { timeout: 20_000 });
      await expect(page.getByTestId('shop-inventory-page')).toBeVisible({ timeout: 90_000 });
      await expect(page.getByTestId('shop-stock-sync')).toBeVisible({ timeout: 45_000 });
      await page.getByTestId('shop-stock-sync-open-excel').click();
      await expect(page.getByTestId('shop-stock-sync-dialog')).toBeVisible();
      await expect(page.getByTestId('shop-stock-sync-upload-input')).toBeAttached();
      const audit = await page.request.get('/api/shop/inventory/stock-upload');
      expect(audit.status()).toBe(200);
      const auditJson = (await audit.json()) as { ok?: boolean; items?: unknown };
      expect(auditJson.ok).toBe(true);
      expect(Array.isArray(auditJson.items)).toBe(true);

      const uploadDone = page.waitForResponse(
        (res) =>
          res.url().includes('/api/shop/inventory/stock-upload') &&
          res.request().method() === 'POST' &&
          res.ok(),
        { timeout: 30_000 }
      );
      await page.getByTestId('shop-stock-sync-upload-input').setInputFiles({
        name: 'unified-smoke-stock.csv',
        mimeType: 'text/csv',
        buffer: Buffer.from('brand,sku,color,qty\ndemo,sku-1,,\n'),
      });
      await uploadDone;
      await expect(page.getByTestId('shop-stock-sync-last-accepted')).toContainText(/unified-smoke-stock\.csv/i, {
        timeout: 15_000,
      });
    });
  });

  /** Ритейл-дашборд и срез аналитики + хаб маржи (см. docs/RETAIL_CABINET_FULL_PLAYBOOK.md). Параллельно serial inventory. Дублирует контракт ERP с `shop-erp-analytics-strip.spec.ts` на уровне HTTP. */
  test('Shop retail hub + analytics segment + margin hub shell', async ({ page }) => {
    test.setTimeout(120_000);
    const erpSync = await page.request.get('/api/shop/erp-sync-status');
    expect(erpSync.ok()).toBeTruthy();
    const erpBody = (await erpSync.json()) as { lastSuccessAt?: unknown };
    expect(typeof erpBody.lastSuccessAt).toBe('string');

    await gotoResilient(page, '/shop', { waitUntil: 'domcontentloaded' });
    await expect(page.getByTestId('page-shop-retail-dashboard')).toBeVisible({ timeout: 90_000 });
    await expect(page.getByTestId('shop-analytics-segment-nav')).toBeVisible({ timeout: 45_000 });
    await expect(page.getByTestId('shop-dashboard-analytics-footfall-link')).toBeVisible({ timeout: 15_000 });
    await expect(page.getByTestId('shop-dashboard-analytics-margin-link')).toBeVisible({ timeout: 15_000 });

    await gotoResilient(page, '/shop/analytics/footfall', { waitUntil: 'domcontentloaded' });
    await expect(page.getByTestId('shop-analytics-segment-nav')).toBeVisible({ timeout: 45_000 });
    await expect(page.getByTestId('shop-footfall-retail-analytics-link')).toBeVisible({ timeout: 15_000 });
    await expect(page.getByTestId('shop-footfall-b2b-link')).toBeVisible({ timeout: 15_000 });

    await gotoResilient(page, '/shop/b2b/margin-analysis', { waitUntil: 'domcontentloaded' });
    await expect(page.getByTestId('page-shop-b2b-margin-analysis')).toBeVisible({ timeout: 45_000 });
    await expect(page.getByTestId('shop-analytics-segment-nav')).toBeVisible({ timeout: 30_000 });
    await expect(page.getByTestId('margin-hub-retail-analytics-link')).toBeVisible({ timeout: 15_000 });
    await expect(page.getByTestId('margin-hub-b2b-analytics-link')).toBeVisible({ timeout: 15_000 });
  });

  test('Brand logistics hub shell (/brand/logistics)', async ({ page }) => {
    await gotoResilient(page, '/brand/logistics', { waitUntil: 'domcontentloaded' });
    await expect(page.getByTestId('brand-logistics-hub-page')).toBeVisible();
  });

  test('Brand integrations hub shell (/brand/integrations)', async ({ page }) => {
    await gotoResilient(page, '/brand/integrations', { waitUntil: 'domcontentloaded' });
    await expect(page.getByTestId('brand-integrations-page')).toBeVisible({ timeout: 30_000 });
    await expect(page.getByTestId('related-modules-block')).toBeVisible({ timeout: 30_000 });
    const registry = page.getByTestId('brand-integrations-b2b-registry-card');
    await expect(registry).toBeVisible({ timeout: 15_000 });
    await expect(registry).toHaveAttribute('href', '/brand/b2b-orders');
  });
});
