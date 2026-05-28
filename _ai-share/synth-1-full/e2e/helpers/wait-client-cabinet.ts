/**
 * Ждём NuOrder client shell, не внешний `<main>` из `client-layout.tsx`.
 */
import { expect, type Page } from '@playwright/test';

export async function waitForClientCabinetShell(page: Page): Promise<void> {
  await expect(page.locator('[data-client-cabinet-nuorder="true"]')).toBeVisible({
    timeout: 90_000,
  });
  await expect(page.getByRole('navigation', { name: /клиентское меню/i })).toBeVisible({
    timeout: 30_000,
  });
}
