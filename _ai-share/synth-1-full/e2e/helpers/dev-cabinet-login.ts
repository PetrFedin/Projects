import { expect, type Page } from '@playwright/test';
import { SYNTH_MOCK_KNOWN_PASSWORD } from '@/lib/auth/dev-auth-bootstrap';

/** Длинные префиксы первыми (`/factory/supplier` до `/factory`). */
const DEV_EMAIL_BY_PREFIX: readonly [string, string][] = [
  ['/admin', 'admin@syntha.ai'],
  ['/brand', 'brand@syntha.ai'],
  ['/distributor', 'dist@syntha.ai'],
  ['/factory/supplier', 'supplier@syntha.ai'],
  ['/factory', 'factory@syntha.ai'],
  ['/client', 'elena.petrova@example.com'],
  ['/shop', 'shop@syntha.ai'],
];

export function devEmailForCabinetPath(path: string): string | null {
  for (const [prefix, email] of DEV_EMAIL_BY_PREFIX) {
    if (path === prefix || path.startsWith(`${prefix}/`)) return email;
  }
  return null;
}

/**
 * Mock sign-in под роль кабинета. Нужен в serial smoke: после `/shop/*` в localStorage
 * остаётся shop@, а `/client/*` требует client role для HubSidebar.
 */
export async function ensureDevCabinetLogin(page: Page, path: string): Promise<void> {
  const email = devEmailForCabinetPath(path);
  if (!email) return;

  await page.goto('/login', { waitUntil: 'domcontentloaded', timeout: 60_000 });
  await page.locator('input[type="email"]').fill(email);
  await page.locator('input[type="password"]').fill(SYNTH_MOCK_KNOWN_PASSWORD);
  await page.getByRole('button', { name: /^Войти$/ }).click();
  await expect(page).not.toHaveURL(/\/login(?:\?|$)/, { timeout: 30_000 });
}
