import { test, expect } from '@playwright/test';
import { gotoRoleCoreCabinet } from './helpers/core-chain-overview';

const PEER_PANELS = [
  {
    path: '/shop/core?pillar=development&collection=SS27',
    cabinetTestId: 'role-core-cabinet-shop',
    panelTestId: 'shop-development-bridge',
  },
  {
    path: '/factory/production/core?pillar=collection_order&collection=SS27',
    cabinetTestId: 'role-core-cabinet-manufacturer',
    panelTestId: 'manufacturer-po-expectation-mini',
  },
  {
    path: '/factory/supplier/core?pillar=sample_collection&collection=SS27',
    cabinetTestId: 'role-core-cabinet-supplier',
    panelTestId: 'supplier-bom-preview-mini',
  },
] as const;

test.describe('core-96: empty peer-insight panels viewports', () => {
  test('iPhone 393 — peer panels visible, no page overflow', async ({ page, request }) => {
    const healthRes = await request.get('/api/workshop2/platform-core/health');
    const health = (await healthRes.json()) as { demoSeeded?: boolean };
    test.skip(!health.demoSeeded, 'нужен db:core:bootstrap');

    await page.setViewportSize({ width: 393, height: 812 });

    for (const entry of PEER_PANELS) {
      const res = await gotoRoleCoreCabinet(page, entry.path);
      expect(res?.status() ?? 599).toBeLessThan(500);
      await expect(page.getByTestId(entry.cabinetTestId)).toBeVisible({ timeout: 60_000 });
      await expect(page.getByTestId('role-pillar-empty-participant')).toBeVisible({
        timeout: 30_000,
      });
      await expect(page.getByTestId(entry.panelTestId)).toBeVisible({ timeout: 90_000 });

      await expect
        .poll(
          async () =>
            page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1),
          { timeout: 15_000 }
        )
        .toBe(true);
    }
  });
});
