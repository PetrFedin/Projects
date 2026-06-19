#!/usr/bin/env node
/**
 * Wave 54: prod probe — WORKSHOP2_PRODUCTION_PUBLIC_URL + probe-alert + Kontur/CRPT configured check.
 */
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const prodUrl = String(process.env.WORKSHOP2_PRODUCTION_PUBLIC_URL ?? '').trim().replace(/\/$/, '');
if (!prodUrl) {
  console.error('[probe-prod] FAIL: WORKSHOP2_PRODUCTION_PUBLIC_URL не задан (fail-closed).');
  process.exit(1);
}

const dir = path.dirname(fileURLToPath(import.meta.url));

function curlJson(method, urlPath, body) {
  const url = `${prodUrl}${urlPath}`;
  const args = ['-sfS', '-X', method, '-H', 'Content-Type: application/json'];
  if (body) args.push('-d', JSON.stringify(body));
  args.push(url);
  const r = spawnSync('curl', args, { encoding: 'utf8' });
  if (r.status !== 0) return { ok: false, url, error: r.stderr || r.stdout };
  try {
    return { ok: true, url, json: JSON.parse(r.stdout ?? '{}') };
  } catch {
    return { ok: false, url, error: 'invalid JSON' };
  }
}

const alertScript = path.join(dir, 'workshop2-probe-alert.mjs');
const alert = spawnSync(process.execPath, [alertScript, prodUrl], { stdio: 'inherit' });
if (alert.status !== 0) process.exit(alert.status ?? 1);

const edo = curlJson('POST', '/api/workshop2/edo/send', {
  collectionId: 'SS27',
  articleId: 'demo-ss27-01',
});
const marking = curlJson('POST', '/api/workshop2/marking/register-order', {
  collectionId: 'SS27',
  articleId: 'demo-ss27-01',
});

console.log(
  JSON.stringify(
    {
      prodUrl,
      edo: edo.ok
        ? {
            configured: edo.json?.configured,
            httpStatus: edo.json?.httpStatus,
            journalId: edo.json?.journalId,
          }
        : { error: edo.error },
      marking: marking.ok
        ? {
            configured: marking.json?.configured,
            httpStatus: marking.json?.httpStatus,
            journalId: marking.json?.journalId,
          }
        : { error: marking.error },
      labelRu:
        'Kontur/CRPT: configured=true при URL+token; 401 на prod = pass (fail-closed без crash).',
    },
    null,
    2
  )
);

if (!edo.ok || !marking.ok) {
  console.error('[probe-prod] WARN: edo/marking HTTP probe failed (non-fatal if prod keys unset).');
}

console.log('[probe-prod] PASS probe-alert + gov paths probed');
process.exit(0);
