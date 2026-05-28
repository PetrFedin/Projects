/**
 * Стабильная клиентская сессия для Playwright (без /login — RHF + fill ломают форму).
 * Совпадает с mock `elena.petrova@example.com` в `src/lib/repositories/mock/auth.ts`.
 */
import type { BrowserContext, Page } from '@playwright/test';

const CLIENT_EMAIL = 'elena.petrova@example.com';

const CLIENT_AUTH_USER = {
  uid: 'client-elena-petrova-001',
  email: CLIENT_EMAIL,
  displayName: 'Елена Петрова',
  nickname: 'elenapetrova',
  roles: ['client'] as const,
};

function seedClientAuthInBrowser(): void {
  localStorage.setItem('syntha_auth_user', JSON.stringify(CLIENT_AUTH_USER));
  localStorage.setItem('syntha_last_email', CLIENT_EMAIL);
}

/** Вызывать до первого `goto` в контексте. */
export async function seedClientAuth(context: BrowserContext): Promise<void> {
  await context.addInitScript(seedClientAuthInBrowser);
}

/** Вызывать до `goto` на странице (одиночный тест без shared context). */
export async function seedClientAuthOnPage(page: Page): Promise<void> {
  await page.addInitScript(seedClientAuthInBrowser);
}
