import { test, expect } from '@playwright/test';
import {
  buildWorkshop2Ss27MenCoat01FullTzDemoDossier,
} from '../src/lib/production/workshop2-ss27-demo-full-tz-dossier';
import {
  W2_DEMO_ARTICLE_TZ_CANON_SLUG,
  W2_DEMO_ARTICLE_TZ_FULL_SLUG,
  W2_DEMO_COLLECTION_SLUG,
  W2_DOSSIER_LOCAL_STORAGE_KEY,
  w2BrandProductionArticlePath,
  w2DossierStorageMapKey,
} from './helpers/w2-demo-routes';

const gotoOpts = { waitUntil: 'load' as const, timeout: 120_000 };

test.describe('Workshop2 hub', () => {
  test('brand B2B orders registry loads (operational read-model / API)', async ({ page }) => {
    await page.goto('/brand/b2b-orders', gotoOpts);
    await expect(page).toHaveURL(/\/brand\/b2b-orders/);
    await expect(page.locator('h1').filter({ hasText: /^Заказы$/ })).toBeVisible({ timeout: 30_000 });
    await expect(page.getByRole('link', { name: /^B2B-/ }).first()).toBeVisible({
      timeout: 20_000,
    });
  });

  test('workshop2 page loads', async ({ page }) => {
    await page.goto('/brand/production/workshop2', gotoOpts);
    await expect(page).toHaveURL(/\/brand\/production\/workshop2/);
    await expect(page).toHaveTitle(/(Syntha|Разработка)/i);
  });

  test('demo article workspace loads (SS27 / demo article)', async ({ page }) => {
    await page.goto(w2BrandProductionArticlePath(W2_DEMO_ARTICLE_TZ_FULL_SLUG, { w2pane: 'tz' }), gotoOpts);
    await expect(page).toHaveURL(
      new RegExp(`workshop2/c/${W2_DEMO_COLLECTION_SLUG}/a/${W2_DEMO_ARTICLE_TZ_FULL_SLUG}`)
    );
    await expect(page.locator('#w2-dossier-main')).toBeVisible({ timeout: 30_000 });
    await expect(page.getByText('Демо ТЗ', { exact: true })).toBeVisible({ timeout: 15_000 });
  });

  test('TZ materials tab shows section signoff strip (demo)', async ({ page }) => {
    await page.goto(w2BrandProductionArticlePath(W2_DEMO_ARTICLE_TZ_FULL_SLUG, { w2pane: 'tz' }), gotoOpts);
    await expect(page.locator('#w2-dossier-main')).toBeVisible({ timeout: 30_000 });
    await page.getByRole('button', { name: /Материалы:/ }).click();
    await expect(page.getByTestId('w2-tz-section-signoff-material')).toBeVisible({
      timeout: 20_000,
    });
  });

  test('TZ confirm button is disabled when section has minimum-rule errors', async ({ page }) => {
    await page.goto(
      w2BrandProductionArticlePath(W2_DEMO_ARTICLE_TZ_CANON_SLUG, {
        w2pane: 'tz',
        w2sec: 'material',
        w2view: 'full',
      }),
      gotoOpts
    );
    await expect(page.locator('#w2-dossier-main')).toBeVisible({ timeout: 30_000 });
    await page.getByRole('button', { name: /Материалы:/ }).click();
    const strip = page.getByTestId('w2-tz-section-signoff-material');
    await expect(strip).toBeVisible({ timeout: 20_000 });
    await expect(strip.getByRole('button', { name: 'Подтвердить' }).first()).toBeDisabled();
  });

  test('fully prepared demo dossier has no section minimum errors in material signoff strip', async ({
    page,
  }) => {
    await page.goto(
      w2BrandProductionArticlePath(W2_DEMO_ARTICLE_TZ_FULL_SLUG, {
        w2pane: 'tz',
        w2sec: 'material',
        w2view: 'full',
      }),
      gotoOpts
    );
    await expect(page.locator('#w2-dossier-main')).toBeVisible({ timeout: 30_000 });
    await page.getByRole('button', { name: /Материалы:/ }).click();
    const strip = page.getByTestId('w2-tz-section-signoff-material');
    await expect(strip).toBeVisible({ timeout: 20_000 });
    await expect(strip.getByText('Исправьте перед подтверждением:')).toHaveCount(0);
  });

  test('TZ material flow: disabled -> fix in-place -> rule errors cleared', async ({ page, context }) => {
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
    const canonUrl = w2BrandProductionArticlePath(W2_DEMO_ARTICLE_TZ_CANON_SLUG, {
      w2pane: 'tz',
      w2sec: 'material',
      w2view: 'full',
    });
    await page.goto(
      canonUrl,
      gotoOpts
    );
    await expect(page.locator('#w2-dossier-main')).toBeVisible({ timeout: 30_000 });
    await page.getByRole('button', { name: /Материалы:/ }).click();
    const stripBeforeFix = page.getByTestId('w2-tz-section-signoff-material');
    await expect(stripBeforeFix).toBeVisible({ timeout: 20_000 });
    const confirmBeforeFix = stripBeforeFix.getByRole('button', { name: 'Подтвердить' }).first();
    await expect(confirmBeforeFix).toBeDisabled();
    await expect(stripBeforeFix.getByText('Исправьте перед подтверждением:')).toBeVisible();

    const currentSigner = 'Виктория Белова';
    const seededFull = buildWorkshop2Ss27MenCoat01FullTzDemoDossier(null, currentSigner);
    const patchedForE2E = {
      ...seededFull,
      tzSignatoryBindings: {
        designerDisplayLabel: currentSigner,
      },
      sectionSignoffs: undefined,
      designerSignoff: undefined,
      technologistSignoff: undefined,
      managerSignoff: undefined,
      extraTzSignoffsByRowId: undefined,
    };
    await page.evaluate(
      ({ storageKey, canonKey, patched }) => {
        const raw = localStorage.getItem(storageKey);
        const map = raw ? (JSON.parse(raw) as Record<string, unknown>) : {};
        map[canonKey] = patched;
        localStorage.setItem(storageKey, JSON.stringify(map));
      },
      {
        storageKey: W2_DOSSIER_LOCAL_STORAGE_KEY,
        canonKey: w2DossierStorageMapKey(W2_DEMO_COLLECTION_SLUG, W2_DEMO_ARTICLE_TZ_CANON_SLUG),
        patched: patchedForE2E,
      }
    );

    await page.goto(canonUrl, gotoOpts);
    await expect(page.locator('#w2-dossier-main')).toBeVisible({ timeout: 30_000 });
    await page.getByRole('button', { name: /Материалы:/ }).click();
    const stripAfterFix = page.getByTestId('w2-tz-section-signoff-material');
    await expect(stripAfterFix).toBeVisible({ timeout: 20_000 });
    await expect(stripAfterFix.getByText('Исправьте перед подтверждением:')).toHaveCount(0);
    await expect(stripAfterFix.getByRole('button', { name: 'Подтвердить' }).first()).toBeDisabled();
  });

  test('non-demo SS27 article: workspace loads, no full-TZ demo badge, canonical hint', async ({
    page,
    context,
  }) => {
    await context.addInitScript(
      ({ key, mapKey }: { key: string; mapKey: string }) => {
        try {
          const raw = localStorage.getItem(key);
          if (!raw) return;
          const map = JSON.parse(raw) as Record<string, unknown>;
          delete map[mapKey];
          localStorage.setItem(key, JSON.stringify(map));
        } catch {
          /* ignore */
        }
      },
      {
        key: W2_DOSSIER_LOCAL_STORAGE_KEY,
        mapKey: w2DossierStorageMapKey(W2_DEMO_COLLECTION_SLUG, W2_DEMO_ARTICLE_TZ_CANON_SLUG),
      }
    );

    await page.goto(
      w2BrandProductionArticlePath(W2_DEMO_ARTICLE_TZ_CANON_SLUG, {
        w2pane: 'tz',
        w2sec: 'assignment',
        w2view: 'full',
      }),
      gotoOpts
    );
    await expect(page).toHaveURL(
      new RegExp(`workshop2/c/${W2_DEMO_COLLECTION_SLUG}/a/${W2_DEMO_ARTICLE_TZ_CANON_SLUG}`)
    );
    await expect(page.locator('#w2-dossier-main')).toBeVisible({ timeout: 30_000 });
    await expect(page.getByText('SS27-W-DRS-02').first()).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText('Демо ТЗ', { exact: true })).toHaveCount(0);

    await expect(page.getByTestId('w2-tech-pack-canonical-hint')).toBeVisible({
      timeout: 20_000,
    });
    await expect(page.getByTestId('w2-tech-pack-canonical-hint')).toContainText(/предпросмотр/i);
  });
});
