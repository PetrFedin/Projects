'use strict';

/**
 * E2E (`next dev` :3123) и dev:fast (:3000) делят один каталог `.next`.
 * Параллельный запуск → ENOENT / turbopack runtime / каскад 500.
 *
 * Usage:
 *   node scripts/check-shared-next-conflict.cjs bench   # перед dev:bench:*
 *   node scripts/check-shared-next-conflict.cjs e2e     # перед test:e2e:*
 *
 * Обход: DEV_BENCH_IGNORE_E2E=1 | PLAYWRIGHT_IGNORE_DEV3000=1
 */
const { execSync } = require('node:child_process');

const mode = process.argv[2] || 'bench';

function portListening(port) {
  try {
    const out = execSync(`lsof -t -iTCP:${port} -sTCP:LISTEN`, {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'ignore'],
    }).trim();
    return Boolean(out);
  } catch {
    return false;
  }
}

const e2ePort = process.env.PLAYWRIGHT_E2E_PORT || '3123';
const devPort = '3000';

if (mode === 'bench') {
  if (process.env.DEV_BENCH_IGNORE_E2E === '1') process.exit(0);
  if (portListening(e2ePort)) {
    console.error(
      `[check-shared-next-conflict] Порт :${e2ePort} занят (вероятно test:e2e / next dev).\n` +
        `  Остановите E2E dev: kill $(lsof -t -iTCP:${e2ePort} -sTCP:LISTEN)\n` +
        `  Затем: npm run dev:fast:clean\n` +
        `  Или обход: DEV_BENCH_IGNORE_E2E=1 npm run dev:bench:routes`
    );
    process.exit(1);
  }
  process.exit(0);
}

if (mode === 'e2e') {
  if (process.env.PLAYWRIGHT_IGNORE_DEV3000 === '1') process.exit(0);
  if (portListening(devPort)) {
    console.error(
      `[check-shared-next-conflict] Порт :${devPort} занят (dev:fast / turbopack).\n` +
        `  E2E очистит .next (E2E_CLEAR_CACHE=1) и сломает dev на :3000.\n` +
        `  Остановите: kill $(lsof -t -iTCP:${devPort} -sTCP:LISTEN)\n` +
        `  Или обход: PLAYWRIGHT_IGNORE_DEV3000=1 npm run test:e2e:light`
    );
    process.exit(1);
  }
  process.exit(0);
}

console.error(`Unknown mode: ${mode}. Use bench | e2e`);
process.exit(2);
