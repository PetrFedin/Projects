#!/usr/bin/env node
/**
 * Wave 57: reads checklist md; writes status JSON when env OR org journal marks applied.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const checklistMd = path.join(root, '.planning/workshop2-wave55-ops-applied-checklist.md');
const statusJson = path.join(root, '.planning/workshop2-wave55-ops-applied-status.json');
const orgJournalJson = path.join(root, '.planning/workshop2-ops-applied-org-journal.json');

if (!fs.existsSync(checklistMd)) {
  console.error('[ops-applied-checklist] missing', checklistMd);
  process.exit(1);
}

const md = fs.readFileSync(checklistMd, 'utf8');
const pagerdutyConfigured = Boolean(String(process.env.WORKSHOP2_PAGERDUTY_WEBHOOK_URL ?? '').trim());
const sentryConfigured = Boolean(
  String(process.env.SENTRY_DSN ?? process.env.NEXT_PUBLIC_SENTRY_DSN ?? '').trim()
);

let orgApplied = false;
try {
  if (fs.existsSync(orgJournalJson)) {
    const journal = JSON.parse(fs.readFileSync(orgJournalJson, 'utf8'));
    orgApplied = Boolean(journal?.orgApplied);
  }
} catch {
  orgApplied = false;
}

const opsChecklistApplied = orgApplied || (pagerdutyConfigured && sentryConfigured);

const payload = {
  checkedAt: new Date().toISOString(),
  pagerdutyConfigured,
  sentryConfigured,
  orgApplied,
  opsChecklistApplied,
  messageRu: orgApplied
    ? 'Ops checklist applied в org journal — PagerDuty+Sentry отмечены админом.'
    : opsChecklistApplied
      ? 'PagerDuty webhook и Sentry DSN заданы — ops checklist можно отмечать applied в org.'
      : 'Задайте WORKSHOP2_PAGERDUTY_WEBHOOK_URL и SENTRY_DSN или POST /api/workshop2/ops/mark-applied.',
  checklistSections: (md.match(/^## /gm) ?? []).length,
};

fs.mkdirSync(path.dirname(statusJson), { recursive: true });
fs.writeFileSync(statusJson, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');

console.log('[ops-applied-checklist] wrote', statusJson);
console.log(JSON.stringify(payload, null, 2));
process.exit(opsChecklistApplied ? 0 : 2);
