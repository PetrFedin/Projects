import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * Runway PDP minimal layout — axe gate (0 critical violations).
 */
const SKIP_A11Y = process.env.RUNWAY_SKIP_A11Y === '1' || process.env.CI === 'true';

test.describe('Runway a11y — minimal PDP', () => {
  test.skip(SKIP_A11Y, 'Skipped via RUNWAY_SKIP_A11Y or CI default');

  test.beforeEach(async ({ page }) => {
    await page.route(/fonts\.(googleapis|gstatic)\.com/, (route) => route.abort());
    await page.addInitScript(() => {
      localStorage.setItem('runway-onboarding-dismissed', '1');
      localStorage.setItem('runway-compare-hint-dismissed', '1');
    });
  });

  test('axe: silk-midi-dress minimal layout has no critical violations', async ({ page }) => {
    await page.goto('/products/silk-midi-dress?view=runway', {
      waitUntil: 'domcontentloaded',
      timeout: 120_000,
    });

    await page
      .waitForResponse((res) => res.url().includes('/api/runway/config') && res.ok(), {
        timeout: 60_000,
      })
      .catch(() => undefined);

    const stage = page.locator('[data-runway-stage]').first();
    await stage.waitFor({ state: 'attached', timeout: 180_000 });
    await expect(stage).toHaveAttribute('data-runway-ready', 'true', { timeout: 90_000 });

    const results = await new AxeBuilder({ page })
      .include('[data-runway-stage]')
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    const critical = (results.violations ?? []).filter((v) => v.impact === 'critical');
    if (critical.length > 0) {
      const report = critical
        .map((v) => `[${v.id}] ${v.help} — ${v.nodes?.length ?? 0} node(s)`)
        .join('\n');
      expect(critical, `Critical a11y on runway PDP:\n${report}`).toHaveLength(0);
    }
  });
});
