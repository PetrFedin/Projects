#!/usr/bin/env node
/** Wave 53: verify prod SLA artifact paths; chain wave52 if exists. */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const root = process.cwd();
const artifacts = [
  'src/lib/production/workshop2-ops-sla-dashboard.ts',
  'src/lib/production/workshop2-b2b-3d-sla.ts',
  'src/lib/production/workshop2-b2b-invoice-stub.ts',
  'src/app/api/workshop2/ops/sla-dashboard/route.ts',
  'src/app/api/shop/b2b/showroom/3d-sla/route.ts',
  'src/app/api/shop/b2b/orders/export/route.ts',
  'src/components/brand/production/Workshop2HubSlaOpsPanel.tsx',
  'scripts/workshop2-probe-escalation.mjs',
  '.planning/workshop2-sla-targets.md',
  '.planning/workshop2-cdn-routing.md',
  '.planning/workshop2-ack-s3-lifecycle.md',
  '.planning/workshop2-sentry-alert-rules.md',
  'src/lib/production/__tests__/workshop2-wave53-prod-sla.test.ts',
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
  console.error('[wave53-restore-disk] missing artifacts:', missing.join(', '));
  process.exit(1);
}

const wave52 = path.join(root, 'scripts/wave52-restore-disk.mjs');
if (fs.existsSync(wave52)) {
  const r = spawnSync(process.execPath, [wave52], { stdio: 'inherit', cwd: root });
  if (r.status !== 0) process.exit(r.status ?? 1);
}

console.log('[wave53-restore-disk] OK', artifacts.length, 'artifacts verified');
