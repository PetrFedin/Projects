#!/usr/bin/env node
/**
 * Pre-deploy gate для Runway staging:
 * 1) deploy:runway-check (unit + validate + doctor + video-lint)
 * 2) smoke:runway-staging — только если STAGING_BASE_URL в env или .env.local
 *
 *   npm run pre-deploy:runway
 *   STAGING_BASE_URL=https://staging.example.com npm run pre-deploy:runway
 */
import { spawnSync } from 'node:child_process';
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

function run(label, cmd, args) {
  console.log(`\n=== ${label} ===\n`);
  const result = spawnSync(cmd, args, {
    cwd: root,
    stdio: 'inherit',
    env: process.env,
  });
  if (result.status !== 0) {
    console.error(`\nrunway-pre-deploy: failed at "${label}" (exit ${result.status ?? 1})`);
    process.exit(result.status ?? 1);
  }
}

run('deploy:runway-check', 'npm', ['run', 'deploy:runway-check']);

const stagingBase = process.env.STAGING_BASE_URL?.trim();

if (stagingBase) {
  console.log(`\nSTAGING_BASE_URL=${stagingBase} — HTTP smoke\n`);
  run('smoke:runway-staging', 'npm', ['run', 'smoke:runway-staging']);
} else {
  console.log('\n[SKIP] STAGING_BASE_URL не задан — smoke:runway-staging пропущен');
  console.log('  Для полного gate: добавьте в .env.local или export:');
  console.log('  STAGING_BASE_URL=https://staging.example.com\n');
}

console.log('runway-pre-deploy: all steps passed\n');
