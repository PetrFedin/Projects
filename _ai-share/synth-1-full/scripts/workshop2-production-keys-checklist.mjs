#!/usr/bin/env node
/**
 * Wave 52: production keys checklist — аналог staging keys → .planning/workshop2-production-keys-status.json
 */
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const outJson = path.join(root, '.planning/workshop2-production-keys-status.json');
const outMd = path.join(root, '.planning/workshop2-production-keys-report.md');

const KEYS = [
  { id: 'kontur_diadoc', env: 'WORKSHOP2_KONTUR_DIADOC_TOKEN', labelRu: 'Контур Диадок token' },
  { id: 'marking_api', env: 'WORKSHOP2_MARKING_API_TOKEN', labelRu: 'ЦРПТ marking API token' },
  { id: 'matterport_sdk', env: 'WORKSHOP2_MATTERPORT_SDK_KEY', labelRu: 'Matterport SDK key' },
  { id: 'matterport_space', env: 'WORKSHOP2_MATTERPORT_SPACE_ID', labelRu: 'Matterport spaceId' },
  { id: 'sentry_dsn', env: 'SENTRY_DSN', labelRu: 'Sentry DSN' },
  { id: 'ack_archive_s3', env: 'WORKSHOP2_ACK_ARCHIVE_S3_BUCKET', labelRu: 'ACK archive S3 bucket' },
  { id: 'production_public_url', env: 'WORKSHOP2_PRODUCTION_PUBLIC_URL', labelRu: 'Production public URL' },
  { id: 'staging_public_url', env: 'WORKSHOP2_STAGING_PUBLIC_URL', labelRu: 'Staging public URL' },
  { id: 'brand_tenant_registry', env: 'WORKSHOP2_BRAND_TENANT_REGISTRY_JSON', labelRu: 'Brand tenant registry JSON' },
  { id: 'oauth_vault_webhook', env: 'WORKSHOP2_B2B_OAUTH_VAULT_WEBHOOK_SECRET', labelRu: 'OAuth vault webhook secret' },
];

const status = KEYS.map((k) => ({
  ...k,
  configured: Boolean(String(process.env[k.env] ?? '').trim()),
}));

const configuredCount = status.filter((s) => s.configured).length;
const payload = {
  generatedAt: new Date().toISOString(),
  configuredCount,
  total: status.length,
  keys: status,
  labelRu: `${configuredCount}/${status.length} production keys configured (fail-closed без fake ACK).`,
};

fs.mkdirSync(path.dirname(outJson), { recursive: true });
fs.writeFileSync(outJson, JSON.stringify(payload, null, 2), 'utf8');

const mdLines = [
  '# Workshop2 — production keys checklist',
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
console.log(`[production-keys-checklist] wrote ${outJson} and ${outMd}`);
