/**
 * Флаги E2E-режима runway — без Google Fonts, без cinematic intro, мгновенная видимость stage.
 * NEXT_PUBLIC_E2E доступен на клиенте; E2E — только на сервере при сборке.
 */
export function isRunwayE2eMode(): boolean {
  return process.env.NEXT_PUBLIC_E2E === 'true' || process.env.E2E === 'true';
}
