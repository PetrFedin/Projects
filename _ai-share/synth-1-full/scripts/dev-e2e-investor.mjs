#!/usr/bin/env node
/**
 * E2E dev with investor demo env — merges .env.local + explicit env for Next process.
 * Replaces fragile inline WORKSHOP2_* prefixes in package.json (Next often sees null).
 */
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { mergeInvestorEnvLocal } from './merge-investor-env-local.mjs';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

function rmDist(name) {
  const target = path.join(root, name);
  try {
    fs.rmSync(target, { recursive: true, force: true });
  } catch {
    /* ignore */
  }
}

const ensure = spawnSync('node', ['scripts/ensure-supported-node.mjs'], {
  cwd: root,
  stdio: 'inherit',
});
if ((ensure.status ?? 1) !== 0) process.exit(ensure.status ?? 1);

if (process.env.E2E_CLEAR_CACHE === '1') {
  rmDist('.next');
  rmDist('.next-e2e');
}

try {
  mergeInvestorEnvLocal();
  console.log('[dev-e2e-investor] merged .env.e2e.investor.example → .env.local');
} catch (err) {
  console.error(`[dev-e2e-investor] ${err instanceof Error ? err.message : err}`);
  process.exit(1);
}

const port = String(process.env.PLAYWRIGHT_E2E_PORT ?? '3123').trim();
const env = {
  ...process.env,
  WORKSHOP2_INVESTOR_DEMO_MODE: 'true',
  WORKSHOP2_UNIT_TESTS_PASSING: 'true',
  NEXT_PUBLIC_WORKSHOP2_INVESTOR_DEMO_MODE: 'true',
  E2E: 'true',
  NEXT_PUBLIC_E2E: 'true',
  NEXT_PUBLIC_DISABLE_FONTS: '1',
  SYNTH_SKIP_ENTERPRISE_BOOTSTRAP: '1',
  NEXT_DIST_DIR: '.next-e2e',
  NODE_OPTIONS: process.env.NODE_OPTIONS || '--max-old-space-size=8192',
};

const next = spawnSync(
  'npx',
  ['next', 'dev', '--hostname', '127.0.0.1', '--port', port],
  { cwd: root, env, stdio: 'inherit' }
);
process.exit(next.status ?? 1);
