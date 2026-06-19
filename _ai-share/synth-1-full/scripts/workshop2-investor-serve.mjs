#!/usr/bin/env node
/**
 * Start investor dev server in background + wait env-check. Без investor-show.
 * Сервер остаётся после exit скрипта — для browser demo держите ноутбук включённым,
 * терминал prep/serve можно закрыть (процесс detached).
 *
 * Usage: npm run workshop2:investor-serve
 * Env:
 *   WORKSHOP2_INVESTOR_SERVE_SKIP_STOP=1 — не убивать :3123 если уже запущен
 *   WORKSHOP2_INVESTOR_SERVE_WITH_SEED=1 — POST SS27 seed после ready (default: 1)
 */
import {
  curlEnvCheck,
  curlPostOk,
  mergeInvestorEnvIntoLocal,
  printInvestorServeHints,
  startInvestorDevDetached,
  stopE2ePort,
  waitDossierHttpOk,
  waitInvestorEnvCheck,
} from './workshop2-investor-dev-shared.mjs';

const port = String(process.env.PLAYWRIGHT_E2E_PORT ?? '3123').trim();
const skipStop = process.env.WORKSHOP2_INVESTOR_SERVE_SKIP_STOP === '1';
const withSeed = process.env.WORKSHOP2_INVESTOR_SERVE_WITH_SEED !== '0';

console.log('[workshop2-investor-serve] merge investor env → .env.local…');
try {
  mergeInvestorEnvIntoLocal();
} catch (err) {
  console.error(`[workshop2-investor-serve] ${err instanceof Error ? err.message : err}`);
  process.exit(1);
}

if (!skipStop) {
  console.log(`[workshop2-investor-serve] stop E2E port :${port}…`);
  stopE2ePort(port);
} else {
  const existing = curlEnvCheck(port);
  if (existing.ok) {
    console.log(`[workshop2-investor-serve] :${port} уже отвечает demoMode — skip start`);
    printInvestorServeHints(existing.probeBase);
    if (withSeed) {
      console.log('[workshop2-investor-serve] apply SS27 UAT seed…');
      curlPostOk(existing.probeBase, '/api/workshop2/demo/apply-ss27-uat-seed', {});
    }
    process.exit(0);
  }
  console.log(`[workshop2-investor-serve] skip-stop: сервер не готов — стартуем новый`);
}

console.log('[workshop2-investor-serve] starting dev:e2e:investor in background…');
const pid = startInvestorDevDetached(port);
console.log(`[workshop2-investor-serve] background pid=${pid ?? '?'}`);

console.log('[workshop2-investor-serve] waiting env-check (demoModeComputed=true, timeout 180s)…');
waitInvestorEnvCheck(port, 180);

const probeBase = `http://127.0.0.1:${port}`;
const hit = curlEnvCheck(port);
if (!hit.ok) {
  console.error('[workshop2-investor-serve] env-check FAIL после wait — см. .planning/dev-e2e-investor.log');
  process.exit(1);
}

if (withSeed) {
  console.log('[workshop2-investor-serve] apply SS27 UAT seed…');
  const seedJson = curlPostOk(probeBase, '/api/workshop2/demo/apply-ss27-uat-seed', {});
  console.log(`[workshop2-investor-serve] seed: ${seedJson.messageRu ?? 'ok'}`);
}

const dossierUrl = `${probeBase}/brand/production/workshop2/c/SS27/a/demo-ss27-01`;
console.log('[workshop2-investor-serve] waiting dossier HTTP 200 (first compile up to 180s)…');
const dossierHttp = await waitDossierHttpOk(dossierUrl, 180);
console.log(
  `[workshop2-investor-serve] dossier HTTP ${dossierHttp.status} — ${dossierHttp.ok ? 'OK' : 'WARN (откройте URL в браузере после Ready в log)'}`
);

printInvestorServeHints(probeBase);
console.log('[workshop2-investor-serve] done — сервер работает в фоне');
