#!/usr/bin/env node
/**
 * Статический контракт investor demo (без поднятия :3123).
 * Полный `workshop2:investor-demo:full` в CI не гоняем — нужен live Next ~5–15 мин.
 */
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const scripts = pkg.scripts || {};

const requiredFiles = [
  '.env.e2e.investor.example',
  'scripts/merge-investor-env-local.mjs',
  'scripts/dev-e2e-investor.mjs',
  'scripts/workshop2-investor-prep.mjs',
  'scripts/workshop2-investor-demo-full.mjs',
  '.planning/INVESTOR-DEMO-SCRIPT-RU.md',
  '.planning/INVESTOR-DEMO-RUNBOOK-RU.md',
  'src/app/api/workshop2/investor-demo/env-check/route.ts',
  'src/lib/production/workshop2-wave-ops-applied-status.ts',
  'src/lib/production/workshop2-ops-applied-org-journal.ts',
];

const requiredScripts = [
  'dev:e2e:investor',
  'workshop2:investor-prep',
  'workshop2:investor-demo:full',
  'workshop2:investor-show',
];

const errors = [];

for (const rel of requiredFiles) {
  if (!fs.existsSync(path.join(root, rel))) {
    errors.push(`missing file: ${rel}`);
  }
}

for (const key of requiredScripts) {
  if (!scripts[key]) errors.push(`missing package.json script: ${key}`);
}

const devInvestor = fs.readFileSync(path.join(root, 'scripts/dev-e2e-investor.mjs'), 'utf8');
if (!devInvestor.includes('mergeInvestorEnvLocal')) {
  errors.push('dev-e2e-investor.mjs must import mergeInvestorEnvLocal');
}

const example = fs.readFileSync(path.join(root, '.env.e2e.investor.example'), 'utf8');
if (!example.includes('WORKSHOP2_INVESTOR_DEMO_MODE=true')) {
  errors.push('.env.e2e.investor.example must set WORKSHOP2_INVESTOR_DEMO_MODE=true');
}

const fullRunner = fs.readFileSync(path.join(root, 'scripts/workshop2-investor-demo-full.mjs'), 'utf8');
if (!fullRunner.includes('preflightInvestorDemoRunnerEnv')) {
  errors.push('workshop2-investor-demo-full.mjs must call preflightInvestorDemoRunnerEnv()');
}

if (errors.length) {
  console.error('[check-investor-demo-contract] violations:');
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}

const jest = spawnSync(
  'npx',
  [
    'jest',
    'src/lib/production/__tests__/workshop2-investor-demo-mode.test.ts',
    'src/lib/production/__tests__/workshop2-wave58-investor-show.test.ts',
    '--testNamePattern',
    'buildWorkshop2InvestorDemoEnvCheck|brief exposes blockingGatesRu',
  ],
  { cwd: root, encoding: 'utf8', stdio: 'pipe' }
);
if ((jest.status ?? 1) !== 0) {
  console.error('[check-investor-demo-contract] jest investor contract failed');
  if (jest.stdout) process.stdout.write(jest.stdout);
  if (jest.stderr) process.stderr.write(jest.stderr);
  process.exit(1);
}

console.log('[check-investor-demo-contract] ok (static + unit subset; full runner deferred in CI)');
