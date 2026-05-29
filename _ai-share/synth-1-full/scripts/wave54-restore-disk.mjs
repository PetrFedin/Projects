#!/usr/bin/env node
/** Wave 54: verify prod hardening artifact paths; chain wave53 if exists. */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const root = process.cwd();
const artifacts = [
  'scripts/wave54-restore-disk.mjs',
  'scripts/workshop2-probe-prod.mjs',
  'scripts/workshop2-probe-escalation.mjs',
  'scripts/workshop2-ack-s3-lifecycle-apply.mjs',
  'scripts/workshop2-ack-restore-drill-quarterly.mjs',
  'db/migrations/022_workshop2_b2b_invoice.sql',
  'src/lib/server/workshop2-b2b-invoice-repository.ts',
  'src/lib/production/workshop2-performance-budget-api.ts',
  '.github/workflows/workshop2-probe-prod.yml',
  'src/lib/production/__tests__/workshop2-wave54-prod-hardening.test.ts',
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
  console.error('[wave54-restore-disk] missing artifacts:', missing.join(', '));
  process.exit(1);
}

const wave53 = path.join(root, 'scripts/wave53-restore-disk.mjs');
if (fs.existsSync(wave53)) {
  const r = spawnSync(process.execPath, [wave53], { stdio: 'inherit', cwd: root });
  if (r.status !== 0) process.exit(r.status ?? 1);
}

console.log('[wave54-restore-disk] OK', artifacts.length, 'artifacts verified');
