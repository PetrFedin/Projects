'use strict';

/**
 * Перед Playwright `webServer`: освободить TCP-порт E2E (по умолчанию **3123**),
 * иначе `EADDRINUSE` или ответ «упавшего» процесса ломают смок.
 * Отключить: **`PLAYWRIGHT_SKIP_KILL_E2E_PORT=1`**.
 */
const { execSync } = require('node:child_process');

const port = process.env.PLAYWRIGHT_E2E_PORT || '3123';

if (process.env.PLAYWRIGHT_SKIP_KILL_E2E_PORT === '1') {
  process.exit(0);
}

try {
  const out = execSync(`lsof -ti :${port}`, {
    encoding: 'utf8',
    stdio: ['pipe', 'pipe', 'ignore'],
  }).trim();
  if (!out) process.exit(0);
  for (const raw of out.split(/\s+/)) {
    const pid = Number(raw);
    if (pid > 0) {
      try {
        process.kill(pid, 'SIGKILL');
      } catch {
        /* процесс уже завершён */
      }
    }
  }
} catch {
  /* нет слушателей, или нет `lsof` (редкий CI-образ) — не блокируем прогон */
}
