/**
 * Wave 57: org-applied ops journal — admin marks PagerDuty+Sentry applied in org (not only env).
 */
import fs from 'node:fs';
import path from 'node:path';

export const WORKSHOP2_OPS_APPLIED_JOURNAL_BASENAME =
  '.planning/workshop2-ops-applied-org-journal.json';

export type Workshop2OpsAppliedOrgJournalEntry = {
  appliedAt: string;
  appliedBy: string;
  pagerdutyApplied: boolean;
  sentryApplied: boolean;
  notesRu?: string;
  source: 'admin_api' | 'checklist_script';
};

export type Workshop2OpsAppliedOrgJournal = {
  updatedAt: string;
  entries: Workshop2OpsAppliedOrgJournalEntry[];
  orgApplied: boolean;
};

function journalPath(): string {
  return path.join(process.cwd(), WORKSHOP2_OPS_APPLIED_JOURNAL_BASENAME);
}

export function readWorkshop2OpsAppliedOrgJournal(): Workshop2OpsAppliedOrgJournal | null {
  try {
    if (!fs.existsSync(journalPath())) return null;
    return JSON.parse(fs.readFileSync(journalPath(), 'utf8')) as Workshop2OpsAppliedOrgJournal;
  } catch {
    return null;
  }
}

export function appendWorkshop2OpsAppliedOrgJournal(
  entry: Omit<Workshop2OpsAppliedOrgJournalEntry, 'appliedAt'> & { appliedAt?: string }
): Workshop2OpsAppliedOrgJournal {
  const prev = readWorkshop2OpsAppliedOrgJournal();
  const appliedAt = entry.appliedAt ?? new Date().toISOString();
  const row: Workshop2OpsAppliedOrgJournalEntry = { ...entry, appliedAt };
  const payload: Workshop2OpsAppliedOrgJournal = {
    updatedAt: appliedAt,
    orgApplied: row.pagerdutyApplied && row.sentryApplied,
    entries: [...(prev?.entries ?? []), row],
  };
  fs.mkdirSync(path.dirname(journalPath()), { recursive: true });
  fs.writeFileSync(journalPath(), `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
  return payload;
}

export function isWorkshop2OpsOrgAppliedFromJournal(): boolean {
  const journal = readWorkshop2OpsAppliedOrgJournal();
  return Boolean(journal?.orgApplied);
}
