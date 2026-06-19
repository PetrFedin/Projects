import { test, expect } from '@playwright/test';
import { gotoPlatformHub, gotoPlatformCoreWorkspace, gotoRoleCoreCabinet } from './helpers/core-chain-overview';

/**
 * Волна B: readiness live/static + slimCore (без AI-виджетов в core).
 * PLAYWRIGHT_SKIP_WEBSERVER=1 npm run test:e2e:core
 */
test.describe('Platform Core readiness & slimCore', () => {
  test('hub: business view по умолчанию без матрицы /10', async ({ page }) => {
    const res = await gotoPlatformHub(page);
    expect(res?.status() ?? 599).toBeLessThan(500);

    await expect(page.getByTestId('platform-core-hub-view-business')).toBeVisible({
      timeout: 60_000,
    });
    await expect(page.getByTestId('platform-core-syntha-style-banner')).toBeVisible({
      timeout: 60_000,
    });
    await expect(page.getByTestId('platform-core-readiness-matrix')).toHaveCount(0);
  });

  test('hub: audit view — режим оценки без npm-команд на UI', async ({ page }) => {
    const res = await gotoPlatformHub(page);
    expect(res?.status() ?? 599).toBeLessThan(500);

    await page.getByTestId('platform-core-hub-view-audit').click();

    const mode = page.getByTestId('platform-core-readiness-mode');
    await expect(mode).toBeVisible({ timeout: 60_000 });

    const dataMode = await mode.getAttribute('data-mode');
    expect(['pg-live', 'static', 'pg-unreachable']).toContain(dataMode);

    const text = (await mode.textContent()) ?? '';
    expect(text).not.toMatch(/npm run/i);
    expect(text).not.toMatch(/core:prep|core:bootstrap/i);
    expect(text).not.toMatch(/\(PG\)|E2E/i);

    if (dataMode === 'pg-live') {
      expect(text).toMatch(/Цепочка активна|готовност/i);
      await expect(page.getByTestId('platform-core-readiness-telemetry')).toHaveCount(0);
    } else if (dataMode === 'pg-unreachable') {
      expect(text).toMatch(/База недоступна/i);
    } else {
      expect(text).toMatch(/ориентировочн|Загрузите данные/i);
    }
  });

  test('slimCore: бренд W2 без голосового ассистента и Global Pulse', async ({ page }) => {
    test.setTimeout(240_000);
    const res = await gotoPlatformCoreWorkspace(page, '/brand/production/workshop2?w2col=SS27');
    expect(res?.status() ?? 599).toBeLessThan(500);
    await expect(page.getByTestId('platform-core-workspace-back')).toBeVisible({
      timeout: 120_000,
    });
    await expect(page.getByTestId('ai-voice-assistant')).toHaveCount(0);
    await expect(page.getByTestId('global-pulse')).toHaveCount(0);
  });

  test('slimCore: бренд оптовые заказы без AI-виджетов', async ({ page }) => {
    const res = await gotoRoleCoreCabinet(page, '/brand/b2b-orders');
    expect(res?.status() ?? 599).toBeLessThan(500);
    await expect(page.getByTestId('ai-voice-assistant')).toHaveCount(0);
    await expect(page.getByTestId('global-pulse')).toHaveCount(0);
    await expect(page.getByRole('link', { name: 'АССОРТИМЕНТ' })).toHaveCount(0);
    await expect(page.getByRole('link', { name: 'ЛОЯЛЬНОСТЬ' })).toHaveCount(0);
  });
});
