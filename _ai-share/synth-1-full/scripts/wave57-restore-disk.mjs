#!/usr/bin/env node
/** Wave 57: post-freeze live ops — verify artifacts; chain wave56. */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const root = process.cwd();
const artifacts = [
  'scripts/wave57-restore-disk.mjs',
  'scripts/workshop2-invoice-pdf-playwright.mjs',
  'src/app/api/workshop2/ops/mark-applied/route.ts',
  'src/lib/production/workshop2-ops-applied-org-journal.ts',
  'src/components/shop/b2b/B2bRepOfflineSyncClient.tsx',
  'src/app/api/shop/b2b/inbound/oauth/callback/route.ts',
  'src/lib/production/workshop2-b2b-oauth-inbound.ts',
  'src/lib/production/__tests__/workshop2-wave57-post-freeze-live.test.ts',
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
  console.error('[wave57-restore-disk] missing artifacts:', missing.join(', '));
  process.exit(1);
}

const wave56 = path.join(root, 'scripts/wave56-restore-disk.mjs');
if (fs.existsSync(wave56)) {
  const r = spawnSync(process.execPath, [wave56], { stdio: 'inherit', cwd: root });
  if (r.status !== 0) process.exit(r.status ?? 1);
}

console.log('[wave57-restore-disk] OK', artifacts.length, 'artifacts verified');
