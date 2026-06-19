#!/usr/bin/env node
/**
 * Wave 54: probe escalation — journal always + optional PagerDuty POST when webhook set.
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = process.cwd();
const journalPath = path.join(root, '.planning/workshop2-probe-escalation-journal.json');
const alertScript = path.join(path.dirname(fileURLToPath(import.meta.url)), 'workshop2-probe-alert.mjs');
const baseUrl = process.argv[2] || process.env.WORKSHOP2_PROBE_BASE_URL || 'http://127.0.0.1:3123';

function loadJournal() {
  try {
    if (!fs.existsSync(journalPath)) return { entries: [] };
    return JSON.parse(fs.readFileSync(journalPath, 'utf8'));
  } catch {
    return { entries: [] };
  }
}

function appendJournal(entry) {
  const journal = loadJournal();
  journal.entries = Array.isArray(journal.entries) ? journal.entries : [];
  journal.entries.push(entry);
  fs.mkdirSync(path.dirname(journalPath), { recursive: true });
  fs.writeFileSync(journalPath, JSON.stringify(journal, null, 2), 'utf8');
}

const probe = spawnSync(process.execPath, [alertScript, baseUrl], { encoding: 'utf8' });
const failed = probe.status !== 0;
const at = new Date().toISOString();

async function postPagerDuty() {
  const pdWebhook = String(process.env.WORKSHOP2_PAGERDUTY_WEBHOOK_URL ?? '').trim();
  if (!pdWebhook) {
    console.warn('[probe-escalation] WORKSHOP2_PAGERDUTY_WEBHOOK_URL не задан — skip PagerDuty (fail-closed).');
    return;
  }
  try {
    const res = await fetch(pdWebhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        routing_key: 'workshop2',
        event_action: 'trigger',
        payload: {
          summary: 'Workshop2 probe-alert failed',
          source: 'workshop2-probe-escalation',
          severity: 'critical',
          custom_details: { baseUrl, at },
        },
      }),
    });
    if (!res.ok) console.warn('[probe-escalation] PagerDuty webhook failed (non-fatal).', res.status);
    else console.log('[probe-escalation] PagerDuty webhook POST ok');
  } catch (e) {
    console.warn('[probe-escalation] PagerDuty fetch error (non-fatal).', e);
  }
}

if (failed) {
  appendJournal({
    id: `esc-${Date.now()}`,
    at,
    baseUrl,
    status: 'probe_failed',
    stdout: probe.stdout?.slice(0, 4000) ?? '',
    stderr: probe.stderr?.slice(0, 4000) ?? '',
    labelRu: 'Probe-alert не прошёл — эскалация записана в journal.',
  });

  const sentryDsn = String(process.env.SENTRY_DSN ?? '').trim();
  if (sentryDsn) {
    console.warn('[probe-escalation] SENTRY_DSN задан — см. Sentry Issues + alert rules.');
  } else {
    console.warn('[probe-escalation] SENTRY_DSN не задан — skip Sentry (fail-closed).');
  }

  await postPagerDuty();
  console.error('[probe-escalation] FAIL — journal updated:', journalPath);
  process.exit(1);
}

appendJournal({
  id: `esc-ok-${Date.now()}`,
  at,
  baseUrl,
  status: 'probe_ok',
  labelRu: 'Probe-alert OK — heartbeat записан.',
});
console.log('[probe-escalation] PASS');
process.exit(0);
