#!/usr/bin/env node
/** Wave 56: post-freeze maintenance — verify artifacts; chain wave55. */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const root = process.cwd();
const artifacts = [
  'scripts/wave56-restore-disk.mjs',
  'scripts/workshop2-wave55-ops-applied-checklist.mjs',
  '.planning/workshop2-multi-brand-rollout-playbook-RU.md',
  '.planning/ROADMAP-V2-POST-FREEZE-RU.md',
  'src/lib/production/workshop2-b2b-rep-offline-pack.ts',
  'src/app/api/shop/b2b/rep/offline-pack/route.ts',
  'src/lib/production/__tests__/workshop2-wave56-post-freeze.test.ts',
  'src/lib/production/workshop2-wave-ops-applied-status.ts',
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
  console.error('[wave56-restore-disk] missing artifacts:', missing.join(', '));
  process.exit(1);
}

const wave55 = path.join(root, 'scripts/wave55-restore-disk.mjs');
if (fs.existsSync(wave55)) {
  const r = spawnSync(process.execPath, [wave55], { stdio: 'inherit', cwd: root });
  if (r.status !== 0) process.exit(r.status ?? 1);
}

console.log('[wave56-restore-disk] OK', artifacts.length, 'artifacts verified');
