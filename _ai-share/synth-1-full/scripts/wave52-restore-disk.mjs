#!/usr/bin/env node
/** Wave 52: verify prod live artifact paths; chain wave51 if exists. */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = process.cwd();
const artifacts = [
  'src/lib/production/workshop2-cutover-dashboard.ts',
  'src/app/api/workshop2/cutover-dashboard/route.ts',
  'src/lib/production/workshop2-brand-tenant-registry.ts',
  'src/app/api/shop/b2b/brand-registry/route.ts',
  'src/components/shop/b2b/B2bRepBrandSwitcher.tsx',
  'scripts/workshop2-production-keys-checklist.mjs',
  'scripts/workshop2-merge-assist.sh',
  'scripts/workshop2-probe-alert.mjs',
  'scripts/workshop2-probe-prod.mjs',
  'src/lib/production/__tests__/workshop2-wave52-prod-live.test.ts',
  '.env.production.ru.example',
];

function exists(rel) {
  try {
    return fs.statSync(path.join(root, rel)).isFile();
  } catch {
    return false;
  }
}

const missing = artifacts.filter((a) => !exists(a));
if (missing.length) {
  console.error('[wave52-restore-disk] missing artifacts:', missing.join(', '));
  process.exit(1);
}

const wave51 = path.join(root, 'scripts/wave51-restore-disk.mjs');
if (fs.existsSync(wave51)) {
  const r = spawnSync(process.execPath, [wave51], { stdio: 'inherit', cwd: root });
  if (r.status !== 0) process.exit(r.status ?? 1);
}

console.log('[wave52-restore-disk] OK', artifacts.length, 'artifacts verified');
