#!/usr/bin/env node
/**
 * Guard: dev-perf route subset typecheck must stay in check:contracts:ci.
 */
import fs from 'node:fs';
import path from 'node:path';

const pkgPath = path.join(process.cwd(), 'package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
const scripts = pkg.scripts || {};
const ci = scripts['check:contracts:ci'] || '';
const errors = [];

if (!scripts['typecheck:dev-perf']) {
  errors.push('missing scripts.typecheck:dev-perf');
}

if (!ci.includes('typecheck:dev-perf')) {
  errors.push('check:contracts:ci must run npm run -s typecheck:dev-perf');
}

const tsconfigPath = path.join(process.cwd(), 'tsconfig.dev-perf.json');
if (!fs.existsSync(tsconfigPath)) {
  errors.push('missing tsconfig.dev-perf.json');
}

if (errors.length) {
  console.error('[dev-perf-typecheck-guard] violations:');
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}

console.log('[dev-perf-typecheck-guard] ok');
