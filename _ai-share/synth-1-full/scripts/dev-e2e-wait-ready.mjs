#!/usr/bin/env node
/**
 * Poll E2E dev until investor env-check / brief responds (Wave 58 prep).
 */
import { spawnSync } from 'node:child_process';
import { setTimeout } from 'node:timers/promises';

const port = String(process.env.PLAYWRIGHT_E2E_PORT ?? '3123').trim();
const base = `http://127.0.0.1:${port}`;
const pathSuffix =
  process.env.DEV_E2E_WAIT_PATH ?? '/api/workshop2/investor-demo/env-check';
const requireDemoMode =
  process.env.DEV_E2E_WAIT_REQUIRE_DEMO_MODE !== '0' &&
  pathSuffix.includes('investor-demo');
const maxSec = Number(process.env.DEV_E2E_WAIT_MAX_SEC ?? '180') || 180;
const url = `${base}${pathSuffix}`;

function readDemoMode(json) {
  if (!json || typeof json !== 'object') return false;
  return (
    json.demoModeComputed === true ||
    json.investorDemoMode === true ||
    json.demoMode === true ||
    json.humanSignoff?.demoMode === true
  );
}

function tryOnce() {
  const r = spawnSync(
    'curl',
    ['-sfS', '--connect-timeout', '2', '--max-time', '8', url],
    { encoding: 'utf8' }
  );
  if ((r.status ?? 1) !== 0) return { ok: false };
  try {
    const json = JSON.parse(r.stdout ?? '{}');
    if (requireDemoMode && !readDemoMode(json)) {
      return { ok: false, demoMode: false, json };
    }
    return { ok: true, json };
  } catch {
    return { ok: false };
  }
}

const started = Date.now();
while ((Date.now() - started) / 1000 < maxSec) {
  const hit = tryOnce();
  if (hit.ok) {
    console.log(`[dev-e2e-wait-ready] OK ${url}`);
    if (requireDemoMode && hit.json) {
      console.log(
        `[dev-e2e-wait-ready] demoModeComputed=${hit.json.demoModeComputed ?? hit.json.demoMode}`
      );
    }
    process.exit(0);
  }
  await setTimeout(2000);
}

console.error(`[dev-e2e-wait-ready] timeout ${maxSec}s — ${url} недоступен или demoMode=false`);
console.error('[dev-e2e-wait-ready] Запустите: npm run workshop2:investor-prep');
process.exit(1);
