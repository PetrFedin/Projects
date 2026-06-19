#!/usr/bin/env node
/**
 * One-command investor prep: merge .env.local → stop port 3123 → dev:e2e:investor (bg) →
 * env-check (180s) → SS27 seed → signoff → investor-show → verify last-run 0 FAIL.
 * Сервер остаётся в фоне после exit — prep НЕ вызывает dev:e2e:stop в конце.
 * Для demo без investor-show: npm run workshop2:investor-serve
 * Env: WORKSHOP2_INVESTOR_PREP_SKIP_SHOW=1 — пропустить investor-show (быстрее, сервер жив)
 * Usage: npm run workshop2:investor-prep
 */
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

import {
  buildInvestorEnv,
  curlEnvCheck,
  curlPostOk,
  mergeInvestorEnvIntoLocal,
  printInvestorServeHints,
  root,
  startInvestorDevDetached,
  stopE2ePort,
  waitInvestorEnvCheck,
} from './workshop2-investor-dev-shared.mjs';

const lastRunPath = path.join(root, '.planning/investor-demo-last-run.json');

function run(cmd, args, opts = {}) {
  const r = spawnSync(cmd, args, { cwd: root, encoding: 'utf8', stdio: 'inherit', ...opts });
  if ((r.status ?? 1) !== 0) process.exit(r.status ?? 1);
}

function assertLastRunZeroFail() {
  if (!fs.existsSync(lastRunPath)) {
    console.error(`[workshop2-investor-prep] missing ${lastRunPath} — investor-show не записал отчёт`);
    process.exit(1);
  }
  const report = JSON.parse(fs.readFileSync(lastRunPath, 'utf8'));
  if (report.ok !== true || (report.failCount ?? 0) > 0) {
    console.error(
      `[workshop2-investor-prep] last-run FAIL: ok=${report.ok} failCount=${report.failCount ?? '?'}`
    );
    process.exit(1);
  }
  console.log(
    `[workshop2-investor-prep] last-run OK — passCount=${report.passCount ?? '?'} failCount=0`
  );
}

console.log('[workshop2-investor-prep] merge investor env into .env.local…');
try {
  mergeInvestorEnvIntoLocal();
} catch (err) {
  console.error(`[workshop2-investor-prep] ${err instanceof Error ? err.message : err}`);
  process.exit(1);
}

const port = String(process.env.PLAYWRIGHT_E2E_PORT ?? '3123').trim();
const probeBase = `http://127.0.0.1:${port}`;
const investorEnv = buildInvestorEnv(port);

console.log(`[workshop2-investor-prep] stop E2E port :${port}…`);
stopE2ePort(port);

console.log('[workshop2-investor-prep] starting dev:e2e:investor in background…');
startInvestorDevDetached(port);

console.log('[workshop2-investor-prep] waiting for env-check (demoModeComputed=true, timeout 180s)…');
waitInvestorEnvCheck(port, 180);

console.log('[workshop2-investor-prep] apply SS27 UAT seed…');
const seedJson = curlPostOk(probeBase, '/api/workshop2/demo/apply-ss27-uat-seed', {});
console.log(`[workshop2-investor-prep] seed: ${seedJson.messageRu ?? seedJson.seededArticleIds?.join(', ')}`);

const signoffSh = path.join(root, 'scripts/workshop2-human-uat-signoff.sh');
if (fs.existsSync(signoffSh)) {
  console.log('[workshop2-investor-prep] human signoff curls…');
  run('bash', [signoffSh, probeBase], { env: investorEnv });
}

if (process.env.WORKSHOP2_INVESTOR_PREP_SKIP_SHOW !== '1') {
  console.log('[workshop2-investor-prep] workshop2:investor-show…');
  run('npm', ['run', 'workshop2:investor-show'], {
    env: {
      ...investorEnv,
      WORKSHOP2_INVESTOR_DEMO_SKIP_STAGING: '1',
      WORKSHOP2_INVESTOR_DEMO_SKIP_UNIT: '1',
    },
  });
  assertLastRunZeroFail();
} else {
  console.log('[workshop2-investor-prep] SKIP investor-show (WORKSHOP2_INVESTOR_PREP_SKIP_SHOW=1)');
}

const postCheck = curlEnvCheck(port);
if (!postCheck.ok) {
  console.error(
    '[workshop2-investor-prep] WARN: после prep сервер не отвечает env-check — npm run workshop2:investor-serve'
  );
  process.exit(1);
}

console.log('[workshop2-investor-prep] done — dev server still running in background');
printInvestorServeHints(probeBase);
console.log(
  `[workshop2-investor-prep] verify: curl -s ${probeBase}/api/workshop2/investor-demo/brief | jq '{demoMode,investorDemoReady,presentationTipsRu:(.presentationTipsRu|length),qaDocPath}'`
);
