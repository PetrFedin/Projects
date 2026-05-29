#!/usr/bin/env node
/** Wave 55: verify investor freeze artifact paths; chain wave54. */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const root = process.cwd();
const artifacts = [
  'scripts/wave55-restore-disk.mjs',
  '.planning/RELEASE-NOTES-WAVES-9-55-RU.md',
  '.planning/INVESTOR-FREEZE-WAVE55.md',
  '.planning/workshop2-wave55-ops-applied-checklist.md',
  'scripts/workshop2-investor-freeze-tag.sh',
  'src/lib/production/workshop2-b2b-invoice-html-stub.ts',
  'src/app/api/shop/b2b/orders/[id]/invoice-stub/route.ts',
  'src/lib/production/__tests__/workshop2-wave55-investor-freeze.test.ts',
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
  console.error('[wave55-restore-disk] missing artifacts:', missing.join(', '));
  process.exit(1);
}

const wave54 = path.join(root, 'scripts/wave54-restore-disk.mjs');
if (fs.existsSync(wave54)) {
  const r = spawnSync(process.execPath, [wave54], { stdio: 'inherit', cwd: root });
  if (r.status !== 0) process.exit(r.status ?? 1);
}

console.log('[wave55-restore-disk] OK', artifacts.length, 'artifacts verified');
