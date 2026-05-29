#!/usr/bin/env node
/**
 * Guard: dev-perf route subset typecheck must stay in check:contracts:ci.
 * Gate .tsx files and lazy-import stubs must remain wired in tsconfig.dev-perf.json.
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
} else {
  const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));
  const include = tsconfig.include || [];
  const requiredGates = [
    'src/components/layout/AuthProviderGate.tsx',
    'src/components/layout/B2BStateProviderGate.tsx',
    'src/components/layout/UIStateProviderGate.tsx',
    'src/components/layout/QueryProviderGate.tsx',
    'src/components/layout/NotificationsProviderGate.tsx',
    'src/components/layout/BrandCenterProviderGate.tsx',
    'src/components/layout/RouteGuardGate.tsx',
    'src/components/layout/RolePanelGate.tsx',
  ];
  for (const gate of requiredGates) {
    if (!include.includes(gate)) {
      errors.push(`tsconfig.dev-perf.json must include ${gate}`);
    }
  }

  const paths = tsconfig.compilerOptions?.paths || {};
  if (!paths['@/providers/auth-provider-stub']) {
    errors.push('tsconfig.dev-perf.json must path-map lazy auth stub for subset typecheck');
  }
}

const stubsDir = path.join(process.cwd(), 'src/lib/layout/dev-perf-typecheck-stubs');
if (!fs.existsSync(stubsDir)) {
  errors.push('missing src/lib/layout/dev-perf-typecheck-stubs/');
}

if (errors.length) {
  console.error('[dev-perf-typecheck-guard] violations:');
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}

console.log('[dev-perf-typecheck-guard] ok');
