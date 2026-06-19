#!/usr/bin/env node
/**
 * Guard: dev-perf layout gate tests must stay wired in package.json.
 * Workshop2 WIP иногда случайно удаляет test:layout:gates из check:contracts:ci.
 */
import fs from 'node:fs';
import path from 'node:path';

const pkgPath = path.join(process.cwd(), 'package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
const scripts = pkg.scripts || {};

const script = scripts['test:layout:gates'];
const ci = scripts['check:contracts:ci'] || '';

const errors = [];

if (!script || !script.includes('root-layout-wiring.test.ts')) {
  errors.push('missing or incomplete scripts.test:layout:gates (expect root-layout-wiring.test.ts)');
}

if (!ci.includes('test:layout:gates')) {
  errors.push('check:contracts:ci must run npm run -s test:layout:gates');
}

if (errors.length) {
  console.error('[layout-gates-package-guard] violations:');
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}

console.log('[layout-gates-package-guard] ok');
