/**
 * Wave 56–57: читает статус ops checklist (PagerDuty + Sentry) из JSON/journal, пишется скриптом checklist.mjs или POST mark-applied.
 */
import fs from 'node:fs';
import path from 'node:path';

import { isWorkshop2OpsOrgAppliedFromJournal } from '@/lib/production/workshop2-ops-applied-org-journal';

export const WORKSHOP2_OPS_APPLIED_STATUS_BASENAME =
  '.planning/workshop2-wave55-ops-applied-status.json';

export type Workshop2OpsAppliedStatus = {
  checkedAt: string;
  pagerdutyConfigured: boolean;
  sentryConfigured: boolean;
  opsChecklistApplied: boolean;
  orgApplied?: boolean;
  messageRu: string;
};

function statusPath(): string {
  return path.join(process.cwd(), WORKSHOP2_OPS_APPLIED_STATUS_BASENAME);
}

export function readWorkshop2OpsAppliedStatus(): Workshop2OpsAppliedStatus | null {
  try {
    if (!fs.existsSync(statusPath())) return null;
    return JSON.parse(fs.readFileSync(statusPath(), 'utf8')) as Workshop2OpsAppliedStatus;
  } catch {
    return null;
  }
}

/** Env + status file + org journal — для cutover-dashboard opsAppliedChecklist. */
export function isWorkshop2OpsAppliedChecklistReady(
  env: Record<string, string | undefined> = process.env
): boolean {
  if (isWorkshop2OpsOrgAppliedFromJournal()) return true;
  const status = readWorkshop2OpsAppliedStatus();
  if (status?.opsChecklistApplied || status?.orgApplied) return true;
  const pd = String(env.WORKSHOP2_PAGERDUTY_WEBHOOK_URL ?? '').trim();
  const sentry = String(env.SENTRY_DSN ?? env.NEXT_PUBLIC_SENTRY_DSN ?? '').trim();
  return Boolean(pd && sentry);
}
