/**
 * Навигация на вкладку «Производство» → sub-tab order (как в flow spec).
 * Deep-link w2pane=release&w2relsub=* монтирует chunk только после первого клика по tab strip.
 */
import { expect, type Locator, type Page } from '@playwright/test';
import {
  W2_DEMO_ARTICLE_TZ_FULL_SLUG,
  w2BrandProductionArticlePath,
} from './w2-demo-routes';
import { waitForDossierLoaded } from './w2-dossier-loaded';

export type W2ReleaseOverflowSubTab = 'floor' | 'cut' | 'logistics' | 'timeline';

const gotoOpts = { waitUntil: 'commit' as const, timeout: 120_000 };

function overflowSubpanelLocator(page: Page, subTab: W2ReleaseOverflowSubTab): Locator {
  const wrapper = page.getByTestId(`workshop2-release-subpanel-${subTab}`);
  const inner: Record<W2ReleaseOverflowSubTab, string> = {
    floor: 'workshop2-release-floor-panel',
    cut: 'workshop2-release-cut-panel',
    logistics: 'workshop2-release-logistics-panel',
    timeline: 'workshop2-release-timeline-panel',
  };
  return wrapper.or(page.getByTestId(inner[subTab])).first();
}

/** Открывает release pane через tab strip (без выбора sub-tab). */
export async function openReleaseViaTabStrip(page: Page): Promise<void> {
  const releaseTab = page.getByRole('tab', { name: /Производство/i }).first();
  await releaseTab.scrollIntoViewIfNeeded().catch(() => undefined);
  await Promise.all([
    page.waitForURL(/w2pane=release/, { timeout: 120_000 }).catch(() => undefined),
    releaseTab.click(),
  ]);
  await waitForDossierLoaded(page, 'release', { skipNetworkIdle: true });

  const subNav = page.getByTestId('workshop2-release-sub-nav');
  const releaseSection = page.locator('#w2article-section-release');
  await expect(subNav.or(releaseSection).first()).toBeVisible({ timeout: 90_000 });
}

export async function openReleaseOrderViaTabStrip(page: Page): Promise<void> {
  await openReleaseViaTabStrip(page);

  await page.goto(
    w2BrandProductionArticlePath(W2_DEMO_ARTICLE_TZ_FULL_SLUG, {
      w2pane: 'release',
      w2relsub: 'order',
    }),
    gotoOpts
  );

  await page.waitForURL(/w2relsub=order/, { timeout: 30_000 }).catch(() => undefined);
  await waitForDossierLoaded(page, 'release', { skipNetworkIdle: true });

  await expect(page.getByTestId('workshop2-release-sub-nav')).toBeVisible({ timeout: 90_000 });
  await expect(page.getByTestId('workshop2-release-sub-tab-order')).toBeVisible({ timeout: 90_000 });
}

/**
 * Overflow sub-tabs: после tab strip — deep-link w2relsub (быстрее dropdown в E2E).
 * Chunk release уже загружен, повторный клик «Производство» не нужен.
 */
export async function selectReleaseOverflowSubTab(
  page: Page,
  subTab: W2ReleaseOverflowSubTab
): Promise<void> {
  await page.goto(
    w2BrandProductionArticlePath(W2_DEMO_ARTICLE_TZ_FULL_SLUG, {
      w2pane: 'release',
      w2relsub: subTab,
    }),
    gotoOpts
  );

  await expect(page.getByTestId('workshop2-release-sub-nav')).toBeVisible({ timeout: 90_000 });
  await page
    .waitForURL(new RegExp(`w2relsub=${subTab}`), { timeout: 30_000 })
    .catch(() => undefined);

  await expect(overflowSubpanelLocator(page, subTab)).toBeVisible({ timeout: 90_000 });
}

/** Совместимость: при необходимости сначала открывает release через tab strip. */
export async function openReleaseOverflowSubTab(
  page: Page,
  subTab: W2ReleaseOverflowSubTab,
  opts?: { ensureReleaseOpen?: boolean }
): Promise<void> {
  const subNav = page.getByTestId('workshop2-release-sub-nav');
  if (opts?.ensureReleaseOpen !== false && !(await subNav.isVisible().catch(() => false))) {
    await openReleaseViaTabStrip(page);
  }
  await selectReleaseOverflowSubTab(page, subTab);
}
