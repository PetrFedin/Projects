#!/usr/bin/env node
/**
 * Статический контракт investor demo (без поднятия :3123).
 * Полный `workshop2:investor-demo:full` в CI не гоняем — нужен live Next ~5–15 мин.
 */
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
  'src/app/api/workshop2/investor-demo/env-check/route.ts',
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

if (errors.length) {
  console.error('[check-investor-demo-contract] violations:');
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}

console.log('[check-investor-demo-contract] ok (static contract; full runner deferred in CI)');
