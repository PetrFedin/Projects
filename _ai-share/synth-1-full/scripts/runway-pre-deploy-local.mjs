#!/usr/bin/env node
/**
 * Локальная симуляция staging pre-deploy gate:
 * 1) STAGING_BASE_URL=http://127.0.0.1:{port} (port = PLAYWRIGHT_E2E_PORT || 3000)
 * 2) Опционально поднимает dev-сервер, если недоступен
 * 3) deploy:runway-check + smoke:runway-staging (3 hero PDP)
 *
 *   npm run pre-deploy:runway:local
 *   PLAYWRIGHT_SKIP_WEBSERVER=1 npm run pre-deploy:runway:local   # сервер уже запущен
 *   RUNWAY_LOCAL_START_SERVER=1 npm run pre-deploy:runway:local   # явный autostart
 *   PLAYWRIGHT_E2E_PORT=3123 npm run pre-deploy:runway:local      # dev:e2e порт
 */
import { spawn, spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

for (const file of ['.env', '.env.local']) {
  const p = join(root, file);
  if (existsSync(p)) {
    dotenv.config({ path: p, override: file === '.env.local' });
  }
}

const port = String(process.env.PLAYWRIGHT_E2E_PORT ?? '3000').trim();
const stagingBase = `http://127.0.0.1:${port}`;
const skipWebserver = process.env.PLAYWRIGHT_SKIP_WEBSERVER === '1';
const startServer =
  process.env.RUNWAY_LOCAL_START_SERVER === '1' ||
  (!skipWebserver && process.env.RUNWAY_LOCAL_START_SERVER !== '0');
const readyTimeoutMs = Number(process.env.RUNWAY_LOCAL_READY_TIMEOUT_MS ?? 180_000);

let devChild = null;

/** Jest rate-limit tests требуют E2E=false; .env.local часто содержит E2E=true для dev:e2e. */
function envForUnitTests(extraEnv = {}) {
  const env = { ...process.env, STAGING_BASE_URL: stagingBase, ...extraEnv };
  delete env.E2E;
  delete env.NEXT_PUBLIC_E2E;
  return env;
}

function run(label, cmd, args, extraEnv = {}) {
  console.log(`\n=== ${label} ===\n`);
  const result = spawnSync(cmd, args, {
    cwd: root,
    stdio: 'inherit',
    env: { ...process.env, STAGING_BASE_URL: stagingBase, ...extraEnv },
  });
  if (result.status !== 0) {
    console.error(`\nrunway-pre-deploy-local: failed at "${label}" (exit ${result.status ?? 1})`);
    process.exit(result.status ?? 1);
  }
}

function runUnit(label, cmd, args, extraEnv = {}) {
  console.log(`\n=== ${label} ===\n`);
  const result = spawnSync(cmd, args, {
    cwd: root,
    stdio: 'inherit',
    env: envForUnitTests(extraEnv),
  });
  if (result.status !== 0) {
    console.error(`\nrunway-pre-deploy-local: failed at "${label}" (exit ${result.status ?? 1})`);
    process.exit(result.status ?? 1);
  }
}

async function healthReady() {
  try {
    const res = await fetch(`${stagingBase}/api/runway/health`, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(5000),
    });
    return res.status === 200 || res.status === 503;
  } catch {
    return false;
  }
}

async function waitForServerReady() {
  const started = Date.now();
  while (Date.now() - started < readyTimeoutMs) {
    if (await healthReady()) return true;
    await new Promise((r) => setTimeout(r, 2000));
  }
  return false;
}

function spawnLocalDev() {
  const useE2ePort = port !== '3000';
  const npmScript = useE2ePort ? 'dev:e2e' : 'dev:fast';
  console.log(`[runway-pre-deploy-local] Сервер недоступен — npm run ${npmScript} (фон)`);
  devChild = spawn('npm', ['run', npmScript], {
    cwd: root,
    env: {
      ...process.env,
      PLAYWRIGHT_E2E_PORT: port,
      STAGING_BASE_URL: stagingBase,
    },
    stdio: 'ignore',
    detached: true,
  });
  devChild.unref();
}

console.log('\n=== Runway pre-deploy (local staging simulation) ===');
console.log(`STAGING_BASE_URL=${stagingBase}`);
console.log(`PLAYWRIGHT_E2E_PORT=${port}`);

if (skipWebserver) {
  console.log(
    '[INFO] PLAYWRIGHT_SKIP_WEBSERVER=1 — ожидаем уже запущенный сервер (npm run dev / dev:e2e)'
  );
} else if (startServer) {
  console.log('[INFO] RUNWAY_LOCAL_START_SERVER — autostart при недоступном health');
} else {
  console.log('[INFO] Autostart отключён — запустите сервер вручную: npm run dev');
}

const alreadyUp = await healthReady();
if (!alreadyUp) {
  if (skipWebserver) {
    console.error(`\n[FAIL] Сервер не отвечает на ${stagingBase}/api/runway/health`);
    console.error('  Запустите: npm run dev  (или npm run dev:e2e для порта 3123)');
    console.error('  Либо: RUNWAY_LOCAL_START_SERVER=1 npm run pre-deploy:runway:local\n');
    process.exit(1);
  }
  if (startServer) {
    spawnLocalDev();
    const ready = await waitForServerReady();
    if (!ready) {
      console.error(
        `\n[FAIL] dev-сервер не поднялся за ${readyTimeoutMs / 1000}s (${stagingBase})\n`
      );
      process.exit(1);
    }
    console.log(`[OK] Сервер готов: ${stagingBase}`);
    const settleMs = Number(process.env.RUNWAY_LOCAL_SMOKE_SETTLE_MS ?? 5000);
    if (settleMs > 0) {
      console.log(`[INFO] Ждём ${settleMs}ms перед smoke (SSR стабилизация)`);
      await new Promise((r) => setTimeout(r, settleMs));
    }
  } else {
    console.error(`\n[FAIL] Сервер недоступен: ${stagingBase}`);
    console.error('  npm run dev  или  RUNWAY_LOCAL_START_SERVER=1 npm run pre-deploy:runway:local\n');
    process.exit(1);
  }
} else {
  console.log(`[OK] Сервер уже доступен: ${stagingBase}`);
}

runUnit('deploy:runway-check', 'npm', ['run', 'deploy:runway-check']);
run('smoke:runway-staging', 'npm', ['run', 'smoke:runway-staging']);

console.log('\nrunway-pre-deploy-local: all steps passed');
console.log('  Hero PDP smoke: silk-midi-dress, cashmere-crewneck-sweater, tech-anorak-men');
console.log(
  `  Для remote staging: STAGING_BASE_URL=https://staging.example.com npm run pre-deploy:runway\n`
);
