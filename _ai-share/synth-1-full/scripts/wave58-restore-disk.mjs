#!/usr/bin/env node
/** Wave 58: investor show — verify artifacts; chain wave57. */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const root = process.cwd();
const artifacts = [
  'scripts/dev-e2e-stop.mjs',
  'scripts/wave58-restore-disk.mjs',
  '.planning/INVESTOR-DEMO-SCRIPT-RU.md',
  '.planning/INVESTOR-DEMO-VS-LIVE-RU.md',
  '.planning/workshop2-investor-visual-checklist.md',
  'src/lib/production/workshop2-investor-demo-status.ts',
  'src/lib/production/workshop2-investor-demo-brief.ts',
  'src/lib/production/workshop2-investor-presentation-tips-ru.ts',
  'src/app/api/workshop2/investor-demo/brief/route.ts',
  'src/app/api/workshop2/demo/apply-ss27-uat-seed/route.ts',
  '.planning/INVESTOR-QA-RU.md',
  '.planning/INVESTOR-DEMO-TOMORROW-RU.md',
  'src/app/api/workshop2/investor-demo/status/route.ts',
  'src/app/brand/production/workshop2/investor-brief/page.tsx',
  'src/components/shop/b2b/B2bWorkshopChrome.tsx',
  'src/app/shop/b2b/layout.tsx',
  'src/components/brand/production/Workshop2InvestorDemoHubBanner.tsx',
  'e2e/workshop2-investor-golden-path.spec.ts',
  'e2e/workshop2-visual-qa-screenshots.spec.ts',
  'src/lib/production/__tests__/workshop2-wave58-investor-show.test.ts',
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
  console.error('[wave58-restore-disk] missing artifacts:', missing.join(', '));
  process.exit(1);
}

const wave57 = path.join(root, 'scripts/wave57-restore-disk.mjs');
if (fs.existsSync(wave57)) {
  const r = spawnSync(process.execPath, [wave57], { stdio: 'inherit', cwd: root });
  if (r.status !== 0) process.exit(r.status ?? 1);
}

console.log('[wave58-restore-disk] OK', artifacts.length, 'artifacts verified');
