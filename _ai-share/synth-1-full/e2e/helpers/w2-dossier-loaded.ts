/**
 * Ожидание гидрации workspace + вкладки артикула (общий контракт для SS27 / sample-shop E2E).
 */
import { expect, type Page } from '@playwright/test';

export const W2_PANE_SECTION: Record<string, string> = {
  supply: '#w2article-section-supply',
  fit: '#w2article-section-fit',
  vault: '#w2article-section-vault',
  documents: '#w2article-section-vault',
  qc: '#w2article-section-qc',
  plan: '#w2article-section-plan-po',
  release: '#w2article-section-release',
  stock: '#w2article-section-stock',
  sample: '#w2article-section-plan-po',
  nesting: '#w2article-section-plan-nest',
};

/** Cold compile fit/release chunk в `.next-e2e` может занять >90s. */
const DOSSIER_TIMEOUT_MS = 120_000;

/** Соответствие w2pane → label tab strip (fallback если deep link не активировал вкладку). */
const TAB_LABEL_BY_PANE: Record<string, RegExp> = {
  supply: /Снабжение/i,
  fit: /Примерка/i,
  plan: /План/i,
  release: /Производство/i,
  qc: /Контроль качества/i,
  stock: /Склад/i,
  vault: /Документы/i,
};

function resolvePaneFromUrl(page: Page): string {
  try {
    const url = new URL(page.url());
    return url.searchParams.get('w2pane') ?? 'overview';
  } catch {
    return 'overview';
  }
}

async function ensureOperationalPaneVisible(
  page: Page,
  pane: string,
  timeoutMs: number
): Promise<void> {
  const section = W2_PANE_SECTION[pane];
  if (!section) {
    await expect(page.locator('#w2-dossier-main')).toBeVisible({ timeout: timeoutMs });
    return;
  }

  const loc = page.locator(section);
  if (await loc.isVisible().catch(() => false)) return;

  const label = TAB_LABEL_BY_PANE[pane];
  if (label) {
    const tab = page.getByRole('tab', { name: label }).first();
    await tab.scrollIntoViewIfNeeded().catch(() => undefined);
    if (await tab.isVisible().catch(() => false)) {
      const selected = await tab.getAttribute('aria-selected').catch(() => null);
      if (selected !== 'true') {
        await Promise.all([
          page
            .waitForURL(new RegExp(`(?:\\?|&)w2pane=${pane}(?:&|$|#)`), { timeout: timeoutMs })
            .catch(() => undefined),
          tab.click(),
        ]);
      }
    }
  }

  await loc.scrollIntoViewIfNeeded().catch(() => undefined);
  await expect(loc).toBeVisible({ timeout: timeoutMs });
}

/** Ждём скелетон досье и секцию вкладки после cold compile / bundle load. */
export async function waitForDossierLoaded(
  page: Page,
  paneHint?: string,
  opts?: { skipNetworkIdle?: boolean }
): Promise<void> {
  const pane = paneHint ?? resolvePaneFromUrl(page);
  const skeleton = page.locator('[data-testid="workshop2-workspace-dossier-skeleton"]');

  if (pane === 'tz' || pane === 'overview' || !pane) {
    await expect(page.locator('#w2-dossier-main')).toBeVisible({ timeout: DOSSIER_TIMEOUT_MS });
  } else {
    await expect(skeleton).toBeHidden({ timeout: DOSSIER_TIMEOUT_MS }).catch(() => undefined);
    await ensureOperationalPaneVisible(page, pane, DOSSIER_TIMEOUT_MS);

    if (pane === 'fit') {
      await expect(page.getByTestId('workshop2-sample-panel')).toBeVisible({
        timeout: 120_000,
      });
    }
  }

  if (!opts?.skipNetworkIdle) {
    await page.waitForLoadState('networkidle', { timeout: 20_000 }).catch(() => undefined);
  }
}
