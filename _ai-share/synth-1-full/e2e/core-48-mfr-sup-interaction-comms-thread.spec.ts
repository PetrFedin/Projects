import { test, expect } from '@playwright/test';
import {
  assertOrderSectionCommsAutoThread,
  checkoutPgOrderViaMatrix,
  confirmPgOrderViaApi,
  handoffPgOrderViaApi,
  orderSectionCommsMessagesHref,
  supplierProcurementHrefForPgOrder,
} from './helpers/core-checkout-pg';

const GOTO = { waitUntil: 'commit' as const, timeout: 120_000 };

/** Wave 29: mfr×op + sup×op interaction strips → comms section auto-thread on clean PG. */
test.describe('core-48: mfr/sup interaction comms auto-thread', () => {
  test('clean PG: mfr dossier chat → section auto-thread', async ({ page, request }) => {
    test.setTimeout(240_000);
    const healthRes = await request.get('/api/workshop2/platform-core/health');
    const health = (await healthRes.json()) as { demoSeeded?: boolean };
    test.skip(!health.demoSeeded, 'нужен db:core:bootstrap');

    const orderId = await checkoutPgOrderViaMatrix(page);
    await confirmPgOrderViaApi(request, orderId);
    await handoffPgOrderViaApi(request, orderId);
    expect(orderId).toMatch(/^B2B-\d+$/);

    const dossierRes = await page.goto(
      `/factory/production/dossier/demo-ss27-01?pillar=order_production&collection=SS27&order=${encodeURIComponent(orderId)}`,
      GOTO
    );
    expect(dossierRes?.status() ?? 599).toBeLessThan(500);
    await expect(page.getByTestId('mfr-op-dossier-context-strip')).toBeVisible({ timeout: 60_000 });

    await assertOrderSectionCommsAutoThread(page, {
      href: orderSectionCommsMessagesHref({
        roleId: 'manufacturer',
        orderId,
        sectionId: 'mfr-op-dossier',
      }),
      expectedSectionId: 'mfr-op-dossier',
      expectedPillar: 'order_production',
      orderId,
    });
  });

  test('clean PG: handoff queue row chat → section auto-thread', async ({ page, request }) => {
    test.setTimeout(240_000);
    const healthRes = await request.get('/api/workshop2/platform-core/health');
    const health = (await healthRes.json()) as { demoSeeded?: boolean };
    test.skip(!health.demoSeeded, 'нужен db:core:bootstrap');

    const orderId = await checkoutPgOrderViaMatrix(page);
    await confirmPgOrderViaApi(request, orderId);
    await handoffPgOrderViaApi(request, orderId);

    const res = await page.goto('/factory/production?collection=SS27#handoff-queue', GOTO);
    expect(res?.status() ?? 599).toBeLessThan(500);
    await expect(page.getByTestId('mfr-op-handoff-queue-panel')).toBeVisible({ timeout: 60_000 });

    await assertOrderSectionCommsAutoThread(page, {
      href: orderSectionCommsMessagesHref({
        roleId: 'manufacturer',
        orderId,
        sectionId: 'mfr-op-handoff-queue',
      }),
      expectedSectionId: 'mfr-op-handoff-queue',
      expectedPillar: 'order_production',
      orderId,
    });
  });

  test('clean PG: supplier procurement chat → section auto-thread', async ({ page, request }) => {
    test.setTimeout(240_000);
    const healthRes = await request.get('/api/workshop2/platform-core/health');
    const health = (await healthRes.json()) as { demoSeeded?: boolean };
    test.skip(!health.demoSeeded, 'нужен db:core:bootstrap');

    const orderId = await checkoutPgOrderViaMatrix(page);
    await confirmPgOrderViaApi(request, orderId);
    const poId = await handoffPgOrderViaApi(request, orderId);

    const procRes = await page.goto(
      supplierProcurementHrefForPgOrder(orderId, { poId }),
      GOTO
    );
    expect(procRes?.status() ?? 599).toBeLessThan(500);
    await expect(page.getByTestId('sup-op-procurement-context-strip')).toBeVisible({
      timeout: 60_000,
    });

    await assertOrderSectionCommsAutoThread(page, {
      href: orderSectionCommsMessagesHref({
        roleId: 'supplier',
        orderId,
        sectionId: 'sup-op-procurement',
      }),
      expectedSectionId: 'sup-op-procurement',
      expectedPillar: 'order_production',
      orderId,
    });
  });
});
