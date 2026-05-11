import type { Page } from '@playwright/test';

const GOTO_RETRIES = 3;
const GOTO_RETRY_BACKOFF_MS = 3_000;

export const DEFAULT_GOTO_TIMEOUT_MS = 60_000;

function isTransientDevServerNavError(message: string): boolean {
  return (
    message.includes('ERR_EMPTY_RESPONSE') ||
    message.includes('ERR_CONNECTION_REFUSED') ||
    message.includes('ERR_CONNECTION_RESET') ||
    message.includes('ERR_SOCKET_NOT_CONNECTED')
  );
}

/** Cold JIT / overloaded `next dev` — долгий первый ответ на страницу. */
function isNavigationTimeoutError(message: string): boolean {
  return message.includes('page.goto: Timeout') || message.includes('TimeoutError');
}

function isRetriableGotoError(message: string): boolean {
  return isTransientDevServerNavError(message) || isNavigationTimeoutError(message);
}

/**
 * `next dev` под нагрузкой смока: пустой ответ, сброс соединения, долгая компиляция маршрута.
 */
export async function gotoResilient(
  page: Page,
  url: string,
  opts: { waitUntil?: 'load' | 'domcontentloaded'; timeout?: number } = {}
): Promise<void> {
  const waitUntil = opts.waitUntil ?? 'domcontentloaded';
  const timeout = opts.timeout ?? DEFAULT_GOTO_TIMEOUT_MS;
  let last: Error | undefined;

  for (let attempt = 0; attempt < GOTO_RETRIES; attempt++) {
    try {
      await page.goto(url, { waitUntil, timeout });
      if (page.url().startsWith('chrome-error:')) {
        last = new Error(`Navigation landed on chrome-error (attempt ${attempt + 1})`);
        if (attempt === GOTO_RETRIES - 1) throw last;
        await new Promise((r) => setTimeout(r, GOTO_RETRY_BACKOFF_MS));
        continue;
      }
      return;
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      last = e instanceof Error ? e : new Error(msg);
      if (!isRetriableGotoError(msg) || attempt === GOTO_RETRIES - 1) throw last;
      await new Promise((r) => setTimeout(r, GOTO_RETRY_BACKOFF_MS));
    }
  }

  throw last;
}
