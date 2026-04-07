import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * A11y-проверки через axe-core: WCAG 2.0 Level A и AA.
 * Запуск: npm run test:e2e (с указанием файла или проекта при необходимости).
 */

const A11Y_ROUTES = [
  { path: '/', name: 'Главная' },
  { path: '/client', name: 'Клиент' },
  { path: '/client/wardrobe', name: 'Digital Wardrobe' },
  { path: '/client/passport', name: 'Digital Passport hub' },
  { path: '/client/try-before-you-buy', name: 'Try Before You Buy' },
  { path: '/brand/analytics/phase2', name: 'Analytics Phase 2' },
  { path: '/brand/marketing/style-me-upsell', name: 'Style-Me Upsell' },
  { path: '/shop/bopis', name: 'BOPIS' },
  { path: '/shop/bnpl', name: 'BNPL' },
] as const;

for (const { path, name } of A11Y_ROUTES) {
  test(`axe WCAG 2a/2aa: ${name} (${path})`, async ({ page }) => {
    await page.goto(path, { waitUntil: 'domcontentloaded' });
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    const violations = results.violations ?? [];
    if (violations.length > 0) {
      const report = violations
        .map(
          (v) =>
            `[${v.id}] ${v.help}\n  Impact: ${v.impact}\n  ${v.nodes?.length ?? 0} node(s)\n  ${v.nodes?.map((n) => n.failureSummary).join('\n  ') ?? ''}`
        )
        .join('\n\n');
      expect(violations, `A11y violations on ${path}:\n${report}`).toHaveLength(0);
    }
  });
}
