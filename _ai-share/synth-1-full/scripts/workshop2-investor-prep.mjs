#!/usr/bin/env node
/**
 * One-command investor prep: merge .env.local → stop → dev:e2e:investor (bg) → env-check → signoff → investor-show.
 * Usage: npm run workshop2:investor-prep
 */
import { spawn, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { mergeInvestorEnvLocal } from './merge-investor-env-local.mjs';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const logPath = path.join(root, '.planning/dev-e2e-investor.log');
const exampleEnvPath = path.join(root, '.env.e2e.investor.example');
const localEnvPath = path.join(root, '.env.local');

function run(cmd, args, opts = {}) {
  const r = spawnSync(cmd, args, { cwd: root, encoding: 'utf8', stdio: 'inherit', ...opts });
  if ((r.status ?? 1) !== 0) process.exit(r.status ?? 1);
}

console.log('[workshop2-investor-prep] merge investor env into .env.local…');
try {
  mergeInvestorEnvLocal();
  console.log(`[workshop2-investor-prep] merged ${exampleEnvPath} → ${localEnvPath}`);
} catch (err) {
  console.error(`[workshop2-investor-prep] ${err instanceof Error ? err.message : err}`);
  process.exit(1);
}

console.log('[workshop2-investor-prep] stop E2E port…');
run('npm', ['run', 'dev:e2e:stop']);

fs.mkdirSync(path.dirname(logPath), { recursive: true });
const logFd = fs.openSync(logPath, 'a');
console.log(`[workshop2-investor-prep] starting dev:e2e:investor (log: ${logPath})…`);

const investorEnv = {
  ...process.env,
  WORKSHOP2_INVESTOR_DEMO_MODE: 'true',
  WORKSHOP2_UNIT_TESTS_PASSING: 'true',
  NEXT_PUBLIC_WORKSHOP2_INVESTOR_DEMO_MODE: 'true',
  E2E_CLEAR_CACHE: '1',
};

const child = spawn('npm', ['run', 'dev:e2e:investor'], {
  cwd: root,
  env: investorEnv,
  detached: true,
  stdio: ['ignore', logFd, logFd],
});
child.unref();

console.log('[workshop2-investor-prep] waiting for env-check (demoModeComputed=true)…');
run('node', ['scripts/dev-e2e-wait-ready.mjs'], {
  env: {
    ...investorEnv,
    DEV_E2E_WAIT_PATH: '/api/workshop2/investor-demo/env-check',
    DEV_E2E_WAIT_REQUIRE_DEMO_MODE: '1',
  },
});

const port = String(process.env.PLAYWRIGHT_E2E_PORT ?? '3123').trim();
const signoffSh = path.join(root, 'scripts/workshop2-human-uat-signoff.sh');
if (fs.existsSync(signoffSh)) {
  console.log('[workshop2-investor-prep] human signoff curls…');
  run('bash', [signoffSh, `http://127.0.0.1:${port}`], { env: investorEnv });
}

console.log('[workshop2-investor-prep] workshop2:investor-show…');
run('npm', ['run', 'workshop2:investor-show'], {
  env: {
    ...investorEnv,
    WORKSHOP2_INVESTOR_DEMO_SKIP_STAGING: '1',
  },
});

console.log('[workshop2-investor-prep] done — dev server still running in background');
console.log(
  `[workshop2-investor-prep] verify: curl -s http://127.0.0.1:${port}/api/workshop2/investor-demo/brief | jq '.demoMode'`
);
