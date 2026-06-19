#!/usr/bin/env node
/**
 * Live smoke against running app (alias for staging smoke with explicit base).
 *   node scripts/runway-smoke-live.mjs
 *   STAGING_BASE_URL=https://prod.example npm run smoke:runway-staging
 */
import { spawnSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const base =
  process.env.STAGING_BASE_URL?.trim() ||
  process.env.RUNWAY_VERIFY_BASE?.trim() ||
  'http://127.0.0.1:3000';

const args = ['scripts/runway-staging-smoke.mjs', '--base', base];
const result = spawnSync('node', args, { cwd: root, stdio: 'inherit', env: process.env });
process.exit(result.status ?? 1);
