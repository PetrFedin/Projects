#!/usr/bin/env node
/**
 * Wave 34/52: staging keys checklist из .env.staging.live.ru.example → JSON + MD.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const examplePath = path.join(root, '.env.staging.live.ru.example');
const outJson = path.join(root, '.planning/workshop2-staging-keys-status.json');
const outMd = path.join(root, '.planning/workshop2-staging-keys-report.md');

const KEYS = [
  { id: 'kontur_diadoc_url', env: 'WORKSHOP2_KONTUR_DIADOC_URL', labelRu: 'Контур Diadoc URL' },
  { id: 'kontur_diadoc_token', env: 'WORKSHOP2_KONTUR_DIADOC_TOKEN', labelRu: 'Контур Diadoc token' },
  { id: 'marking_api_url', env: 'WORKSHOP2_MARKING_API_URL', labelRu: 'ЧЗ API URL' },
  { id: 'marking_api_token', env: 'WORKSHOP2_MARKING_API_TOKEN', labelRu: 'ЧЗ API token' },
  { id: 'staging_public_url', env: 'WORKSHOP2_STAGING_PUBLIC_URL', labelRu: 'Staging public URL' },
  { id: 'production_public_url', env: 'WORKSHOP2_PRODUCTION_PUBLIC_URL', labelRu: 'Production public URL' },
];

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

let parsed = {};
try {
  parsed = parseDotEnv(fs.readFileSync(examplePath, 'utf8'));
} catch {
  console.error(`[staging-keys-checklist] missing ${examplePath}`);
  process.exit(1);
}

const status = KEYS.map((k) => {
  const raw = String(process.env[k.env] ?? parsed[k.env] ?? '').trim();
  const configured = Boolean(raw) && !raw.includes('YOUR-');
  return { ...k, configured, valuePresent: Boolean(raw) };
});

const configuredCount = status.filter((s) => s.configured).length;
const payload = {
  generatedAt: new Date().toISOString(),
  envSource: '.env.staging.live.ru.example',
  configuredCount,
  total: status.length,
  keys: status,
  labelRu: `${configuredCount}/${status.length} staging keys configured (investor demo: warning-only).`,
};

fs.mkdirSync(path.dirname(outJson), { recursive: true });
fs.writeFileSync(outJson, JSON.stringify(payload, null, 2), 'utf8');

const mdLines = [
  '# Workshop2 — staging keys checklist',
  '',
  `Сгенерировано: ${payload.generatedAt}`,
  '',
  '| Key | Env | Configured |',
  '| --- | --- | --- |',
  ...status.map((s) => `| ${s.labelRu} | \`${s.env}\` | ${s.configured ? '✓' : '—'} |`),
  '',
  payload.labelRu,
];
fs.writeFileSync(outMd, mdLines.join('\n'), 'utf8');

console.log(JSON.stringify(payload, null, 2));
console.log(`[staging-keys-checklist] wrote ${outJson} and ${outMd}`);
process.exit(0);
