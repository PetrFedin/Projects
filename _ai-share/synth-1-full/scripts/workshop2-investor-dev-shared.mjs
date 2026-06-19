#!/usr/bin/env node
/**
 * Shared helpers: investor dev server in background + env-check wait.
 * Used by workshop2-investor-serve.mjs and workshop2-investor-prep.mjs.
 */
import { spawn, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { mergeInvestorEnvLocal } from './merge-investor-env-local.mjs';

export const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
export const logPath = path.join(root, '.planning/dev-e2e-investor.log');
export const pidPath = path.join(root, '.planning/dev-e2e-investor.pid');

export function buildInvestorEnv(port = '3123') {
  return {
    ...process.env,
    PLAYWRIGHT_E2E_PORT: String(port).trim(),
    WORKSHOP2_INVESTOR_DEMO_MODE: 'true',
    WORKSHOP2_UNIT_TESTS_PASSING: 'true',
    NEXT_PUBLIC_WORKSHOP2_INVESTOR_DEMO_MODE: 'true',
    NEXT_PUBLIC_WORKSHOP2_DISABLE_NOTIFICATIONS_POLL: 'true',
    E2E_CLEAR_CACHE: '1',
  };
}

export function mergeInvestorEnvIntoLocal() {
  mergeInvestorEnvLocal();
}

export function stopE2ePort(port) {
  const r = spawnSync('npm', ['run', 'dev:e2e:stop'], {
    cwd: root,
    encoding: 'utf8',
    stdio: 'inherit',
    env: { ...process.env, PLAYWRIGHT_E2E_PORT: String(port).trim() },
  });
  if ((r.status ?? 1) !== 0) process.exit(r.status ?? 1);
}

/** Start dev:e2e:investor detached; write PID + log path. Does NOT block on Next compile. */
export function startInvestorDevDetached(port) {
  fs.mkdirSync(path.dirname(logPath), { recursive: true });
  const logFd = fs.openSync(logPath, 'a');

  const investorEnv = buildInvestorEnv(port);
  const child = spawn('npm', ['run', 'dev:e2e:investor'], {
    cwd: root,
    env: investorEnv,
    detached: true,
    stdio: ['ignore', logFd, logFd],
  });
  child.unref();

  if (child.pid) {
    fs.writeFileSync(
      pidPath,
      JSON.stringify(
        {
          pid: child.pid,
          port: String(port).trim(),
          startedAt: new Date().toISOString(),
          logPath: '.planning/dev-e2e-investor.log',
        },
        null,
        2
      ),
      'utf8'
    );
  }

  try {
    fs.closeSync(logFd);
  } catch {
    /* ignore */
  }

  return child.pid;
}

export function waitInvestorEnvCheck(port, maxSec = 180) {
  const investorEnv = buildInvestorEnv(port);
  const r = spawnSync('node', ['scripts/dev-e2e-wait-ready.mjs'], {
    cwd: root,
    encoding: 'utf8',
    stdio: 'inherit',
    env: {
      ...investorEnv,
      DEV_E2E_WAIT_PATH: '/api/workshop2/investor-demo/env-check',
      DEV_E2E_WAIT_REQUIRE_DEMO_MODE: '1',
      DEV_E2E_WAIT_MAX_SEC: String(maxSec),
    },
  });
  if ((r.status ?? 1) !== 0) process.exit(r.status ?? 1);
}

export function curlEnvCheck(port) {
  const probeBase = `http://127.0.0.1:${String(port).trim()}`;
  const r = spawnSync(
    'curl',
    ['-sfS', '--connect-timeout', '3', '--max-time', '10', `${probeBase}/api/workshop2/investor-demo/env-check`],
    { encoding: 'utf8' }
  );
  if ((r.status ?? 1) !== 0) return { ok: false, probeBase };
  try {
    const json = JSON.parse(r.stdout ?? '{}');
    const demoOk = json.demoModeComputed === true || json.demoMode === true;
    return { ok: demoOk, probeBase, json };
  } catch {
    return { ok: false, probeBase };
  }
}

export function curlHttpOk(url, maxTimeSec = 45) {
  const r = spawnSync(
    'curl',
    [
      '-sfS',
      '-o',
      '/dev/null',
      '-w',
      '%{http_code}',
      '--connect-timeout',
      '5',
      '--max-time',
      String(maxTimeSec),
      url,
    ],
    { encoding: 'utf8' }
  );
  if ((r.status ?? 1) !== 0) return { ok: false, status: 0 };
  const status = Number(r.stdout ?? '0');
  return { ok: status >= 200 && status < 400, status };
}

/** Poll dossier (or any page) until HTTP 2xx/3xx — first compile может занять 2–3 мин. */
export async function waitDossierHttpOk(url, maxSec = 180) {
  const started = Date.now();
  let lastStatus = 0;
  while ((Date.now() - started) / 1000 < maxSec) {
    const hit = curlHttpOk(url, 60);
    lastStatus = hit.status;
    if (hit.ok) return { ok: true, status: hit.status };
    await new Promise((r) => setTimeout(r, 5000));
  }
  return { ok: false, status: lastStatus };
}

export function curlPostOk(baseUrl, pathSuffix, bodyObj) {
  const url = `${baseUrl}${pathSuffix}`;
  const r = spawnSync(
    'curl',
    [
      '-sfS',
      '-X',
      'POST',
      '-H',
      'Content-Type: application/json',
      '-d',
      JSON.stringify(bodyObj ?? {}),
      '--connect-timeout',
      '5',
      '--max-time',
      '45',
      url,
    ],
    { encoding: 'utf8' }
  );
  if ((r.status ?? 1) !== 0) {
    console.error(`[workshop2-investor] POST failed: ${url}`);
    process.exit(1);
  }
  try {
    const json = JSON.parse(r.stdout ?? '{}');
    if (json.ok !== true) {
      console.error(`[workshop2-investor] POST ${pathSuffix} ok!=true`, json);
      process.exit(1);
    }
    return json;
  } catch {
    console.error(`[workshop2-investor] POST ${pathSuffix} — не JSON`);
    process.exit(1);
  }
}

export function printInvestorServeHints(probeBase) {
  console.log('');
  console.log('[workshop2-investor] ✓ dev server в фоне — prep/serve НЕ убивают его при exit');
  console.log(`[workshop2-investor] PID: ${pidPath}`);
  console.log(`[workshop2-investor] log: ${logPath}`);
  console.log('[workshop2-investor] Остановить: npm run dev:e2e:stop');
  console.log('');
  console.log('  Dossier:  ' + `${probeBase}/brand/production/workshop2/c/SS27/a/demo-ss27-01`);
  console.log('  Hub:      ' + `${probeBase}/brand/production/workshop2?w2col=SS27`);
  console.log('  Brief:    ' + `${probeBase}/brand/production/workshop2/investor-brief`);
  console.log('');
  console.log(`  curl -s ${probeBase}/api/workshop2/investor-demo/env-check | jq .`);
}
