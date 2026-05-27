/**
 * Legacy globalSetup — прогрев перенесён в e2e/runway.setup.ts (setup project после webServer).
 * Оставлен no-op для совместимости с playwright.config.ts / CI.
 */
import type { FullConfig } from '@playwright/test';

export default async function globalSetup(_config: FullConfig): Promise<void> {
  /* warmup: см. e2e/runway.setup.ts + playwright.runway.config.ts */
}
