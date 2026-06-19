import { test, expect } from '@playwright/test';
import {
  checkoutPgOrderViaMatrix,
} from './helpers/core-checkout-pg';

const GOTO = { waitUntil: 'domcontentloaded' as const, timeout: 60_000 };

test.describe('core-23: calendar create task → auto-thread', () => {
  test('brand calendar: create task on PG order opens thread link', async ({ page, request }) => {
    const healthRes = await request.get('/api/workshop2/platform-core/health');
    const health = (await healthRes.json()) as { demoSeeded?: boolean };
    test.skip(!health.demoSeeded, 'нужен db:core:bootstrap');

    const orderId = await checkoutPgOrderViaMatrix(page);
    const taskTitle = `E2E task ${Date.now()}`;

    const res = await page.goto(
      `/brand/calendar?collection=SS27&order=${encodeURIComponent(orderId)}`,
      GOTO
    );
    expect(res?.status() ?? 599).toBeLessThan(500);
    await expect(page.getByTestId('platform-core-comms-cross-nav')).toBeVisible({
      timeout: 30_000,
    });
    await expect(page.getByTestId('brand-cm-banner')).toBeVisible({ timeout: 30_000 });
    await expect(page.getByTestId('brand-cm-order-context-strip')).toHaveCount(0);

    await page.getByTestId('calendar-create-event-btn').click();
    await page.locator('#title').fill(taskTitle);
    await page.getByTestId('calendar-event-save-btn').click();

    await expect(page.locator('[data-testid^="calendar-b2b-event-pc-task-"]').first()).toBeVisible({
      timeout: 30_000,
    });

    await page.locator('[data-testid^="calendar-b2b-event-pc-task-"]').first().click();
    await expect(page.getByTestId('calendar-event-thread-link')).toBeVisible({ timeout: 15_000 });
    await expect(page.getByTestId('calendar-event-thread-link')).toHaveAttribute(
      'href',
      new RegExp(orderId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    );
  });
});
