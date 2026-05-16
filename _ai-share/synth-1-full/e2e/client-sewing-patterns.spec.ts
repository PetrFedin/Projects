import { test, expect } from '@playwright/test';

/**
 * Категория-handbook + localStorage: выбор ветки «Одежда» и листа, перезагрузка — тот же путь.
 */
test.describe('client sewing-patterns', () => {
  test('Одежда → Верхняя одежда → Пальто: leaf в localStorage и путь после reload', async ({
    page,
  }) => {
    test.setTimeout(120_000);
    await page.goto('/client/sewing-patterns', { waitUntil: 'domcontentloaded' });
    await expect(page.getByTestId('sewing-path-badge')).toBeVisible({ timeout: 90_000 });

    await page.getByTestId('sewing-select-l1').click();
    await page.getByRole('option', { name: 'Одежда' }).click();

    await page.getByTestId('sewing-select-l2').click();
    await page.getByRole('option', { name: 'Верхняя одежда' }).click();

    await page.getByTestId('sewing-select-l3').click();
    await page.getByRole('option', { name: 'Пальто' }).click();

    await expect(page.getByTestId('sewing-path-badge')).toContainText('Пальто');

    const stored = await page.evaluate(() => localStorage.getItem('synth.sewingPattern.leaf.v1'));
    expect(stored).toBeTruthy();
    const parsed = JSON.parse(stored!) as { leafId?: string };
    expect(parsed.leafId).toMatch(/^catalog-apparel-/);

    await page.reload({ waitUntil: 'domcontentloaded' });
    await expect(page.getByTestId('sewing-path-badge')).toContainText('Пальто', { timeout: 60_000 });
  });

  test('POST sewing-pattern-intent: 200 и categoryHandbook в ответе', async ({ page }) => {
    test.setTimeout(120_000);
    await page.goto('/client/sewing-patterns', { waitUntil: 'domcontentloaded' });
    await expect(page.getByTestId('sewing-commit-intent')).toBeVisible({ timeout: 90_000 });

    const [res] = await Promise.all([
      page.waitForResponse(
        (r) =>
          r.url().includes('/api/client/sewing-pattern-intent') && r.request().method() === 'POST',
        { timeout: 60_000 }
      ),
      page.getByTestId('sewing-commit-intent').click(),
    ]);
    expect(res.status()).toBe(200);
    const json = (await res.json()) as { ok?: boolean; categoryHandbook?: { schemaVersion?: number } };
    expect(json.ok).toBe(true);
    expect(json.categoryHandbook?.schemaVersion).toBeDefined();
  });

  test('POST sewing-pattern-preview: 200, svg и buildLog', async ({ request }) => {
    const res = await request.post('/api/client/sewing-pattern-preview', {
      data: {
        garment: 'bodice_front',
        measures: { bust: 92, waist: 74, hip: 100, shoulder: 42, height: 172 },
        darts: { shoulderDart: true, bustSideDart: true, waistDart: true },
        watermark: false,
      },
    });
    expect(res.status()).toBe(200);
    const json = (await res.json()) as {
      ok?: boolean;
      result?: { svg?: string; buildLog?: { key: string }[]; widthMm?: number };
    };
    expect(json.ok).toBe(true);
    expect(json.result?.svg).toContain('<svg');
    expect(json.result?.widthMm).toBeGreaterThan(0);
    expect(json.result?.buildLog?.length).toBeGreaterThan(0);
  });
});
