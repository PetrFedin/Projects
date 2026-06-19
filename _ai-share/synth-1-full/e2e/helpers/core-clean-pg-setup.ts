import type { APIRequestContext, Page } from '@playwright/test';
import { expect } from '@playwright/test';
import {
  assertW2RegistryResolvesOrder,
  checkoutPgOrderViaMatrix,
  confirmPgOrderViaApi,
  fetchPgContextualMessages,
  handoffPgOrderViaApi,
} from './core-checkout-pg';

/** Shared clean PG order for serial core-39 section deep tests. */
export async function setupCleanPgHandoffOrder(
  page: Page,
  request: APIRequestContext
): Promise<string> {
  const healthRes = await request.get('/api/workshop2/platform-core/health');
  const health = (await healthRes.json()) as { demoSeeded?: boolean };
  if (!health.demoSeeded) {
    throw new Error('skip: нужен db:core:bootstrap');
  }

  const orderId = await checkoutPgOrderViaMatrix(page);
  await confirmPgOrderViaApi(request, orderId);
  await handoffPgOrderViaApi(request, orderId);
  expect(orderId).toMatch(/^B2B-\d+$/);

  await assertW2RegistryResolvesOrder(request, orderId);

  const messages = await fetchPgContextualMessages(request, orderId);
  expect(messages.length).toBeGreaterThanOrEqual(1);
  expect(messages.some((m) => !m.message.includes('B2B-DEMO'))).toBe(true);

  return orderId;
}

export const CORE39_GOTO = { waitUntil: 'domcontentloaded' as const, timeout: 60_000 };
