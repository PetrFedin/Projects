'use strict';

/**
 * E2E port lifecycle: освободить :3123, опционально поднять dev:e2e и дождаться health.
 * CI: `node scripts/kill-e2e-port.cjs --spawn-dev` → `--wait-health`
 * Playwright webServer: только kill перед `npm run dev:e2e`.
 * Отключить kill: PLAYWRIGHT_SKIP_KILL_E2E_PORT=1
 */
const { execSync, spawn } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const port = process.env.PLAYWRIGHT_E2E_PORT || '3123';
const base =
  process.env.PLAYWRIGHT_BASE_URL?.replace(/\/$/, '') || `http://127.0.0.1:${port}`;
const root = path.join(__dirname, '..');
const pidFile = path.join(root, '.e2e-dev.pid');
const cliArgs = process.argv.slice(2);

function killPortListeners() {
  try {
    const out = execSync(`lsof -ti :${port}`, {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'ignore'],
    }).trim();
    if (!out) return;
    for (const raw of out.split(/\s+/)) {
      const pid = Number(raw);
      if (pid > 0) {
        try {
          process.kill(pid, 'SIGKILL');
        } catch {
          /* already gone */
        }
      }
    }
  } catch {
    /* no listeners or no lsof */
  }
}

async function healthReady() {
  const res = await fetch(`${base}/api/runway/health`, {
    headers: { Accept: 'application/json' },
    signal: AbortSignal.timeout(8_000),
  });
  return res.status === 200 || res.status === 503;
}

async function waitForHealth() {
  const maxMs = Number(process.env.PLAYWRIGHT_E2E_WAIT_MS || 420_000);
  const started = Date.now();
  while (Date.now() - started < maxMs) {
    try {
      if (await healthReady()) {
        console.log(`[kill-e2e-port] health ok ${base}/api/runway/health`);
        return;
      }
    } catch {
      /* retry */
    }
    await new Promise((r) => setTimeout(r, 2_000));
  }
  console.error(`[kill-e2e-port] health timeout after ${maxMs}ms (${base})`);
  process.exit(1);
}

function spawnDevServer() {
  killPortListeners();
  const pgUrl =
    process.env.WORKSHOP2_DATABASE_URL ||
    'postgresql://workshop2:workshop2_dev@127.0.0.1:5433/workshop2';

  const child = spawn('npm', ['run', 'dev:e2e'], {
    cwd: root,
    detached: true,
    stdio: 'ignore',
    env: {
      ...process.env,
      PLAYWRIGHT_E2E_PORT: port,
      E2E: 'true',
      NEXT_PUBLIC_E2E: 'true',
      WORKSHOP2_DATABASE_URL: pgUrl,
      WORKSHOP2_ALLOW_SAME_ORIGIN_BROWSER:
        process.env.WORKSHOP2_ALLOW_SAME_ORIGIN_BROWSER ?? 'true',
      WORKSHOP2_DEV_BYPASS_AUTH: process.env.WORKSHOP2_DEV_BYPASS_AUTH ?? 'true',
      WORKSHOP2_MARKET: process.env.WORKSHOP2_MARKET ?? 'ru',
    },
  });
  child.unref();
  try {
    fs.writeFileSync(pidFile, String(child.pid));
  } catch {
    /* optional */
  }
  console.log(`[kill-e2e-port] spawned dev:e2e pid=${child.pid} on :${port}`);
}

async function main() {
  if (cliArgs.includes('--wait-health')) {
    await waitForHealth();
    return;
  }

  if (cliArgs.includes('--spawn-dev')) {
    spawnDevServer();
    return;
  }

  if (process.env.PLAYWRIGHT_SKIP_KILL_E2E_PORT === '1') {
    return;
  }

  killPortListeners();
}

main().catch((err) => {
  console.error('[kill-e2e-port]', err);
  process.exit(1);
});
