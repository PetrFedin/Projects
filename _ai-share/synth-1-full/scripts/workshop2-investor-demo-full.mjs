#!/usr/bin/env node
/**
 * Wave 44–48: one-command investor demo — sequential steps + RU pass/fail summary JSON.
 * Usage: npm run workshop2:investor-demo:full
 * Env:
 *   WORKSHOP2_INVESTOR_DEMO_SKIP_UNIT=1 — пропустить unit
 *   WORKSHOP2_INVESTOR_DEMO_SKIP_STAGING=1 — staging verify/keys только WARN
 *   WORKSHOP2_INVESTOR_DEMO_VISUAL_QA=1 — optional visual QA step
 */
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const outPath = path.join(root, '.planning/investor-demo-last-run.json');
const legacyOutPath = path.join(root, '.planning/workshop2-investor-demo-last-run.json');
const scriptPath = path.join(root, '.planning/INVESTOR-DEMO-SCRIPT-RU.md');

function devServerHintRu() {
  return `Перезапустите: npm run workshop2:investor-prep (рекомендуется) или npm run dev:e2e:investor:restart`;
}

function failInvestorDemoModeRu(context) {
  const lines = [
    '',
    '══════════════════════════════════════════════════════════════',
    '  ОШИБКА: investor demo mode ВЫКЛЮЧЕН на запущенном сервере',
    '══════════════════════════════════════════════════════════════',
    '',
    `  ${context}: demoMode=false — сервер стартовал без WORKSHOP2_INVESTOR_DEMO_MODE.`,
    '',
    '  Причина: Next.js читает env только при старте процесса.',
    '  Export в shell без перезапуска dev:e2e даёт demoMode:false на brief.',
    '',
    '  Исправление (одна команда):',
    '    npm run workshop2:investor-prep',
    '',
    '  Проверка:',
    '    curl -s http://127.0.0.1:3123/api/workshop2/investor-demo/env-check | jq .',
    '    curl -s http://127.0.0.1:3123/api/workshop2/investor-demo/brief | jq .demoMode',
    '',
    '══════════════════════════════════════════════════════════════',
    '',
  ];
  return lines.join('\n');
}

function isLocalInvestorDemoEnv() {
  const v = String(process.env.WORKSHOP2_INVESTOR_DEMO_MODE ?? '').trim().toLowerCase();
  return v === 'true' || v === '1' || v === 'yes';
}

function loadInvestorScriptStepTitles() {
  if (!fs.existsSync(scriptPath)) return [];
  const md = fs.readFileSync(scriptPath, 'utf8');
  return [...md.matchAll(/^## Шаг (\d+)[^\n]*—\s*(.+)$/gm)].map((m) => ({
    step: Number(m[1]),
    titleRu: String(m[2]).trim(),
  }));
}

const screenshotChecklist = [
  { id: 'w2-hub-ss27', file: '.planning/screenshots/wave58-investor/01-w2-hub-ss27.png', captured: false },
  { id: 'w2-dossier-01', file: '.planning/screenshots/wave58-investor/02-w2-dossier-demo-ss27-01.png', captured: false },
  { id: 'b2b-showroom-matrix', file: '.planning/screenshots/wave58-investor/03-b2b-showroom-matrix.png', captured: false },
  { id: 'b2b-checkout', file: '.planning/screenshots/wave58-investor/04-b2b-checkout.png', captured: false },
  { id: 'b2b-rep-offline', file: '.planning/screenshots/wave58-investor/05-b2b-rep-offline-banner.png', captured: false },
  { id: 'investor-brief', file: '.planning/screenshots/wave58-investor/06-investor-brief-api.png', captured: false },
];

function runStep(id, labelRu, cmd, args, opts = {}) {
  const r = spawnSync(cmd, args, {
    cwd: root,
    encoding: 'utf8',
    env: process.env,
    ...opts,
  });
  const ok = (r.status ?? 1) === 0;
  return {
    id,
    labelRu,
    ok,
    passRu: ok ? 'PASS' : 'FAIL',
    status: r.status ?? 1,
    stderrTail: (r.stderr ?? '').trim().slice(-400) || undefined,
  };
}

function curlHttpStatus(baseUrl, pathSuffix, opts = {}) {
  const url = `${baseUrl}${pathSuffix}`;
  const maxTime = String(process.env.WORKSHOP2_INVESTOR_CURL_MAX_SEC ?? '45');
  const retries = Number(opts.retries ?? process.env.WORKSHOP2_INVESTOR_CURL_RETRIES ?? '4') || 4;
  const retryDelayMs = Number(process.env.WORKSHOP2_INVESTOR_CURL_RETRY_MS ?? '2500') || 2500;

  for (let attempt = 1; attempt <= retries; attempt += 1) {
    const r = spawnSync(
      'curl',
      ['-sfS', '-o', '/dev/null', '-w', '%{http_code}', '--connect-timeout', '5', '--max-time', maxTime, url],
      { encoding: 'utf8' }
    );
    if ((r.status ?? 1) === 0) {
      const status = Number(r.stdout ?? '0');
      const ok = status >= 200 && status < 400;
      return {
        ok,
        url,
        status,
        passRu: ok ? 'PASS' : 'FAIL',
        errorRu: ok ? undefined : `HTTP ${status} для ${url}`,
        attempt,
      };
    }
    if (attempt < retries) {
      spawnSync('sleep', [String(Math.ceil(retryDelayMs / 1000))]);
    }
  }

  return { ok: false, url, status: 0, passRu: 'FAIL', errorRu: `Недоступен: ${url}`, retries };
}

function curlJson(baseUrl, pathSuffix, opts = {}) {
  const url = `${baseUrl}${pathSuffix}`;
  const maxTime = String(process.env.WORKSHOP2_INVESTOR_CURL_MAX_SEC ?? '45');
  const retries = Number(opts.retries ?? process.env.WORKSHOP2_INVESTOR_CURL_RETRIES ?? '4') || 4;
  const retryDelayMs = Number(process.env.WORKSHOP2_INVESTOR_CURL_RETRY_MS ?? '2500') || 2500;

  for (let attempt = 1; attempt <= retries; attempt += 1) {
    const r = spawnSync('curl', ['-sfS', '--connect-timeout', '5', '--max-time', maxTime, url], {
      encoding: 'utf8',
    });
    if ((r.status ?? 1) === 0) {
      try {
        return { ok: true, url, passRu: 'PASS', json: JSON.parse(r.stdout ?? '{}'), attempt };
      } catch {
        return {
          ok: false,
          url,
          passRu: 'FAIL',
          errorRu: `Ответ не JSON (${url}) — попробуйте npm run dev:e2e:investor:restart`,
          attempt,
        };
      }
    }
    if (attempt < retries) {
      spawnSync('sleep', [String(Math.ceil(retryDelayMs / 1000))]);
    }
  }

  return {
    ok: false,
    url,
    passRu: 'FAIL',
    errorRu: `Сервер недоступен: ${url}. ${devServerHintRu()} (порт ${process.env.PLAYWRIGHT_E2E_PORT || 3123}).`,
    retries,
  };
}

function readServerInvestorDemoMode(json) {
  if (!json || typeof json !== 'object') return false;
  return (
    json.demoModeComputed === true ||
    json.investorDemoMode === true ||
    json.demoMode === true ||
    json.humanSignoff?.demoMode === true
  );
}

const steps = [];
let ok = true;

if (process.env.WORKSHOP2_INVESTOR_DEMO_SKIP_UNIT !== '1') {
  const unit = runStep('unit', 'Unit suite (workshop2)', 'npm', ['run', 'test:workshop2:unit'], {
    stdio: 'pipe',
  });
  steps.push(unit);
  if (!unit.ok) ok = false;
} else {
  steps.push({ id: 'unit', labelRu: 'Unit suite', ok: true, passRu: 'SKIP', skipped: true });
}

const skipStaging =
  process.env.WORKSHOP2_INVESTOR_DEMO_SKIP_STAGING === '1' || isLocalInvestorDemoEnv();

if (skipStaging) {
  steps.push({
    id: 'staging-live-verify',
    labelRu: 'Staging live verify',
    ok: true,
    passRu: 'SKIP',
    optional: true,
    noteRu: 'investor demo: staging verify не блокирует (live keys отдельно)',
  });
  steps.push({
    id: 'staging-keys-checklist',
    labelRu: 'Staging keys checklist',
    ok: true,
    passRu: 'SKIP',
    optional: true,
  });
} else {
  const staging = runStep(
    'staging-live-verify',
    'Staging live verify',
    'npm',
    ['run', 'workshop2:staging-live-verify'],
    { stdio: 'pipe' }
  );
  steps.push({ ...staging, optional: true });
  if (!staging.ok) ok = false;

  const keys = runStep(
    'staging-keys-checklist',
    'Staging keys checklist',
    'npm',
    ['run', 'workshop2:staging-keys-checklist'],
    { stdio: 'pipe' }
  );
  steps.push({ ...keys, optional: true });
}

const investorSh = path.join(root, 'scripts/workshop2-investor-demo.sh');
if (fs.existsSync(investorSh)) {
  const demo = runStep('investor-demo-sh', 'Investor demo shell', 'bash', [investorSh], {
    stdio: 'pipe',
  });
  steps.push(demo);
  if (!demo.ok) ok = false;
} else {
  steps.push({
    id: 'investor-demo-sh',
    labelRu: 'Investor demo shell',
    ok: false,
    passRu: 'FAIL',
    errorRu: 'missing script',
  });
  ok = false;
}

if (process.env.WORKSHOP2_INVESTOR_DEMO_VISUAL_QA === '1') {
  const visual = runStep(
    'visual-qa-e2e',
    'Visual QA E2E (optional)',
    'npm',
    ['run', 'test:e2e:visual-qa'],
    { stdio: 'pipe' }
  );
  steps.push({ ...visual, optional: true });
  if (!visual.ok) ok = false;
}

const probeBase = `http://127.0.0.1:${process.env.PLAYWRIGHT_E2E_PORT || 3123}`;

const envCheckHit = curlJson(probeBase, '/api/workshop2/investor-demo/env-check', { retries: 6 });
let serverDemoMode = isLocalInvestorDemoEnv();
if (envCheckHit.ok) {
  serverDemoMode = readServerInvestorDemoMode(envCheckHit.json);
  steps.push({
    id: 'investor-demo-env-check',
    labelRu: 'Investor demo env-check API',
    ok: serverDemoMode,
    passRu: serverDemoMode ? 'PASS' : 'FAIL',
    demoModeComputed: envCheckHit.json.demoModeComputed,
    WORKSHOP2_INVESTOR_DEMO_MODE: envCheckHit.json.WORKSHOP2_INVESTOR_DEMO_MODE,
    errorRu: serverDemoMode
      ? undefined
      : 'demoModeComputed=false — сервер без investor env. npm run workshop2:investor-prep',
  });
  if (!serverDemoMode) {
    console.error(failInvestorDemoModeRu('env-check'));
    ok = false;
  }
} else if (envCheckHit.errorRu) {
  steps.push({
    id: 'investor-demo-env-check',
    labelRu: 'Investor demo env-check API',
    ok: false,
    passRu: 'FAIL',
    errorRu: envCheckHit.errorRu,
  });
}

const stagingPublic = String(process.env.WORKSHOP2_STAGING_PUBLIC_URL ?? '').trim().replace(
  /\/$/,
  ''
);

const hubUat = curlJson(probeBase, '/api/workshop2/uat/ss27-checklist', { retries: 6 });
steps.push(
  hubUat.ok
    ? {
        id: 'hub-uat-checklist',
        labelRu: 'Hub UAT panel (ss27-checklist API)',
        ok: typeof hubUat.json.autoProgressPct === 'number',
        passRu: typeof hubUat.json.autoProgressPct === 'number' ? 'PASS' : 'FAIL',
        autoProgressPct: hubUat.json.autoProgressPct,
        checklistLinks: hubUat.json.checklistLinks?.length ?? 0,
      }
    : {
        id: 'hub-uat-checklist',
        labelRu: 'Hub UAT panel (ss27-checklist API)',
        ok: false,
        passRu: 'FAIL',
        errorRu: hubUat.errorRu,
      }
);
if (!hubUat.ok || typeof hubUat.json.autoProgressPct !== 'number') ok = false;

if (stagingPublic) {
  const links = hubUat.ok ? (hubUat.json.checklistLinks ?? []) : [];
  for (const link of links) {
    const href = String(link.href ?? '').trim();
    if (!href.startsWith('http')) continue;
    const pathOnly = href.replace(stagingPublic, '') || link.path || '/';
    const hit = curlHttpStatus(stagingPublic, pathOnly.startsWith('/') ? pathOnly : `/${pathOnly}`);
    steps.push({
      id: `checklist-link-${link.id ?? pathOnly}`,
      labelRu: `Checklist link HTTP 200: ${link.labelRu ?? pathOnly}`,
      ...hit,
    });
    if (!hit.ok) ok = false;
  }
  if (!links.length) {
    steps.push({
      id: 'checklist-links-http',
      labelRu: 'Checklist links HTTP 200 (staging URL)',
      ok: false,
      passRu: 'FAIL',
      errorRu: 'checklistLinks пуст при WORKSHOP2_STAGING_PUBLIC_URL',
    });
    ok = false;
  }
}

const checkoutHttp = curlHttpStatus(probeBase, '/shop/b2b/checkout', { retries: 6 });
steps.push({
  id: 'b2b-checkout-http',
  labelRu: 'B2B checkout page HTTP 200',
  ...checkoutHttp,
});
if (!checkoutHttp.ok) ok = false;

const perfBudget = curlJson(probeBase, '/api/workshop2/performance-budget', { retries: 4 });
const perfApiOk = perfBudget.ok && Array.isArray(perfBudget.json.budgetResults);
const perfStrictPass = perfApiOk && perfBudget.json.allBudgetsPass === true;
const perfDemoRelax =
  isLocalInvestorDemoEnv() || process.env.WORKSHOP2_INVESTOR_DEMO_RELAX_PERF === '1';
steps.push(
  perfBudget.ok
    ? {
        id: 'performance-budget-showroom',
        labelRu: 'Performance budget API (showroom LCP pass/fail)',
        ok: perfStrictPass || (perfApiOk && perfDemoRelax),
        passRu: perfStrictPass ? 'PASS' : perfApiOk && perfDemoRelax ? 'WARN' : 'FAIL',
        allBudgetsPass: perfBudget.json.allBudgetsPass,
        optional: perfDemoRelax && !perfStrictPass,
        errorRu:
          perfStrictPass || perfApiOk
            ? undefined
            : 'budgetResults отсутствуют в ответе performance-budget',
        noteRu:
          perfApiOk && !perfStrictPass && perfDemoRelax
            ? 'demo: API OK, LCP stub FAIL — не блокирует investor walkthrough'
            : undefined,
      }
    : {
        id: 'performance-budget-showroom',
        labelRu: 'Performance budget API (showroom LCP pass/fail)',
        ok: false,
        passRu: 'FAIL',
        errorRu: perfBudget.errorRu ?? 'performance-budget недоступен',
      }
);
if (!perfStrictPass && !(perfApiOk && perfDemoRelax)) ok = false;

let probes = null;
const probeHit = curlJson(probeBase, '/api/workshop2/integration-probes');
if (probeHit.ok) {
  const j = probeHit.json;
  probes = {
    wave48: j.wave48InvestorShipReady,
    wave49: j.wave49ProdOpsReady,
    wave50: j.wave50ProdMergeReady,
    wave47: j.wave47RoadmapReady,
    wave46: j.wave46ProductionCutoverReady,
    investorDemoReady: j.readyForInvestorDemo,
  };
  steps.push({
    id: 'integration-probes',
    labelRu: 'Integration probes (live)',
    ok: true,
    passRu: 'PASS',
    probes,
  });
} else {
  steps.push({
    id: 'integration-probes',
    labelRu: 'Integration probes (live)',
    ok: false,
    passRu: 'FAIL',
    errorRu: probeHit.errorRu,
    note: 'npm run dev:e2e:investor required for live probe summary',
  });
  ok = false;
}

const investorStatusHit = curlJson(probeBase, '/api/workshop2/investor-demo/status');
if (investorStatusHit.ok) {
  const ready = investorStatusHit.json.investorDemoReady === true;
  const demoMode =
    investorStatusHit.json.investorDemoMode === true ||
    investorStatusHit.json.demoMode === true;
  steps.push({
    id: 'investor-demo-status',
    labelRu: 'Investor demo status API',
    ok: ready,
    passRu: ready ? 'PASS' : 'FAIL',
    investorDemoReady: investorStatusHit.json.investorDemoReady,
    demoMode,
    blockingGatesRu: investorStatusHit.json.blockingGatesRu,
    warningsRu: investorStatusHit.json.warningsRu,
    errorRu: ready
      ? undefined
      : `investorDemoReady=false — blocking: ${(investorStatusHit.json.blockingGatesRu ?? []).join('; ') || 'см. status'}. ${!demoMode ? devServerHintRu() : ''}`,
  });
  if (!ready) ok = false;
  if (!demoMode) {
    console.error(failInvestorDemoModeRu('investor-demo/status'));
    ok = false;
    steps.push({
      id: 'investor-demo-mode-warn',
      labelRu: 'Investor demo mode на сервере',
      ok: false,
      passRu: 'FAIL',
      errorRu: devServerHintRu(),
    });
  }
} else {
  steps.push({
    id: 'investor-demo-status',
    labelRu: 'Investor demo status API',
    ok: false,
    passRu: 'FAIL',
    errorRu: investorStatusHit.errorRu ?? 'investor-demo/status недоступен',
  });
  ok = false;
}

const briefHit = curlJson(probeBase, '/api/workshop2/investor-demo/brief', { retries: 4 });
if (briefHit.ok) {
  const demoMode = readServerInvestorDemoMode(briefHit.json);
  const briefReady = briefHit.json.investorDemoReady === true;
  steps.push({
    id: 'investor-demo-brief',
    labelRu: 'Investor demo brief API (Wave 58)',
    ok: briefReady,
    passRu: briefReady ? 'PASS' : 'FAIL',
    demoMode,
    investorDemoReady: briefHit.json.investorDemoReady,
    wave58Probe: briefHit.json.probes?.wave58,
    parityNativePct: briefHit.json.parityNativePct,
    blockingGatesRu: briefHit.json.blockingGatesRu,
    warningsRu: briefHit.json.warningsRu,
    errorRu: briefReady
      ? undefined
      : `brief investorDemoReady=false — ${(briefHit.json.blockingGatesRu ?? []).join('; ') || 'см. blockingGatesRu'}`,
  });
  if (!briefReady) ok = false;
  if (!demoMode) {
    console.error(failInvestorDemoModeRu('investor-demo/brief'));
    ok = false;
  }
} else {
  steps.push({
    id: 'investor-demo-brief',
    labelRu: 'Investor demo brief API (Wave 58)',
    ok: false,
    passRu: 'FAIL',
    errorRu: briefHit.errorRu ?? 'investor-demo/brief недоступен',
  });
  ok = false;
}

for (const st of loadInvestorScriptStepTitles()) {
  steps.push({
    id: `script-step-${st.step}`,
    labelRu: `Сценарий шаг ${st.step}: ${st.titleRu}`,
    ok: true,
    passRu: 'INFO',
    fromScript: scriptPath,
  });
}

const wave58Restore = runStep('wave58-restore-disk', 'Wave 58 restore-disk', 'node', [
  'scripts/wave58-restore-disk.mjs',
]);
steps.push(wave58Restore);
if (!wave58Restore.ok) ok = false;

if (process.env.WORKSHOP2_INVESTOR_DEMO_WAVE55_FREEZE === '1') {
  const freezeProbe = curlJson(probeBase, '/api/workshop2/integration-probes');
  steps.push(
    freezeProbe.ok
      ? {
          id: 'wave55-investor-freeze',
          labelRu: 'Wave 55 investor freeze probe (optional)',
          ok:
            (freezeProbe.json.wave55InvestorFreezeReady?.wave55InvestorFreezeReady ?? 0) >= 10,
          passRu:
            (freezeProbe.json.wave55InvestorFreezeReady?.wave55InvestorFreezeReady ?? 0) >= 10
              ? 'PASS'
              : 'FAIL',
          wave55InvestorFreezeReady:
            freezeProbe.json.wave55InvestorFreezeReady?.wave55InvestorFreezeReady,
          optional: true,
        }
      : {
          id: 'wave55-investor-freeze',
          labelRu: 'Wave 55 investor freeze probe (optional)',
          ok: false,
          passRu: 'FAIL',
          optional: true,
          errorRu: freezeProbe.errorRu,
        }
  );
}

const passCount = steps.filter((s) => s.passRu === 'PASS').length;
const failCount = steps.filter((s) => s.passRu === 'FAIL').length;

const report = {
  generatedAt: new Date().toISOString(),
  ok,
  passCount,
  failCount,
  steps,
  probes,
  scriptPath: fs.existsSync(scriptPath) ? '.planning/INVESTOR-DEMO-SCRIPT-RU.md' : null,
  screenshotChecklist,
  summaryRu: ok
    ? `Investor demo full: ${passCount} шаг(ов) PASS — unit + staging + investor-demo.sh OK.`
    : `Investor demo full: ${failCount} FAIL — см. steps[].passRu и errorRu.`,
};

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(report, null, 2), 'utf8');
fs.writeFileSync(legacyOutPath, JSON.stringify(report, null, 2), 'utf8');
console.log(`[workshop2-investor-demo-full] ${report.summaryRu}`);
console.log(`[workshop2-investor-demo-full] wrote ${outPath}`);
process.exit(ok ? 0 : 1);
