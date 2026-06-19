#!/usr/bin/env node
/**
 * Wave 34 CLI: staging live verify → .planning/workshop2-staging-live-verify.json
 * Fail-closed без API keys (401/503 OK); network crash → exit 1.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const outPath = path.join(root, '.planning/workshop2-staging-live-verify.json');
const examplePath = path.join(root, '.env.staging.live.ru.example');

function parseDotEnv(content) {
  const out = {};
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq <= 0) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    out[key] = val;
  }
  return out;
}

async function probeUrl(url, labelRu) {
  const id = labelRu.toLowerCase().includes('диадoc') ? 'kontur_diadoc' : 'marking_api';
  if (!url || url.includes('YOUR-')) {
    return {
      id,
      url,
      probed: false,
      ok: false,
      expectedFailClosed: true,
      messageRu: `${labelRu}: URL не заполнен в example — probe пропущен.`,
    };
  }
  try {
    const target = `${url.replace(/\/$/, '')}/health`;
    const res = await fetch(target, { method: 'HEAD', signal: AbortSignal.timeout(8_000) });
    const expectedFailClosed = res.status === 401 || res.status === 403 || res.status === 503;
    const ok = res.ok || expectedFailClosed;
    return {
      id,
      url,
      probed: true,
      ok,
      status: res.status,
      expectedFailClosed,
      messageRu: ok
        ? expectedFailClosed
          ? `${labelRu}: HTTP ${res.status} — fail-closed без ключа (ожидаемо).`
          : `${labelRu}: HTTP ${res.status} — endpoint доступен.`
        : `${labelRu}: HTTP ${res.status} — неожиданный ответ.`,
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return {
      id,
      url,
      probed: true,
      ok: false,
      expectedFailClosed: false,
      messageRu: `${labelRu}: сеть недоступна (${msg}) — не crash-safe.`,
    };
  }
}

let exampleContent = '';
try {
  exampleContent = fs.readFileSync(examplePath, 'utf8');
} catch {
  console.error(`[staging-live-verify] missing ${examplePath}`);
  process.exit(1);
}

const parsed = parseDotEnv(exampleContent);
const diadocUrl = String(process.env.WORKSHOP2_KONTUR_DIADOC_URL ?? parsed.WORKSHOP2_KONTUR_DIADOC_URL ?? '').trim();
const markingUrl = String(process.env.WORKSHOP2_MARKING_API_URL ?? parsed.WORKSHOP2_MARKING_API_URL ?? '').trim();

const probes = await Promise.all([
  probeUrl(diadocUrl, 'Контур Diadoc'),
  probeUrl(markingUrl, 'Честный ЗНАК API'),
]);

const ok = probes.every((p) => p.ok || !p.probed);
const report = {
  generatedAt: new Date().toISOString(),
  envSource: '.env.staging.live.ru.example',
  market: String(process.env.WORKSHOP2_MARKET ?? parsed.WORKSHOP2_MARKET ?? 'ru'),
  ok,
  probes,
  summaryRu: ok
    ? 'Staging live verify: fail-closed без ключей — без crash.'
    : 'Staging live verify: есть ошибки probe (см. probes).',
};

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(report, null, 2), 'utf8');
console.log(`[staging-live-verify] ${report.summaryRu}`);
console.log(`[staging-live-verify] wrote ${outPath}`);
process.exit(ok ? 0 : 1);
