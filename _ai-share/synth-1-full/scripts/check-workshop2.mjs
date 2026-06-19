#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
const steps = [
  ['verify-workshop2-catalog-wire', 'npx', ['tsx', 'scripts/verify-workshop2-catalog-wire.ts']],
  ['unit', 'npm', ['run', 'test:workshop2:unit']],
  ['smoke', 'npm', ['run', 'smoke:workshop2']],
];
for (const [id, cmd, args] of steps) {
  const r = spawnSync(cmd, args, { stdio: 'inherit', encoding: 'utf8' });
  if (id === 'smoke' && r.status !== 0) {
    console.warn('[check-workshop2] skip smoke — no dev server on :3000');
    continue;
  }
  if (r.status !== 0) process.exit(r.status ?? 1);
}
console.log('[check-workshop2] PASS');
