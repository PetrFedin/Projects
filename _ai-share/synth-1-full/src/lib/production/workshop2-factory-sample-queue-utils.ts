import type { Workshop2SampleOrderStatus } from '@/lib/production/workshop2-dossier-phase1.types';

/** Просрочен, если due_date < сегодня и заказ не завершён. */
export function isWorkshop2FactorySampleQueueItemOverdue(input: {
  dueDate?: string;
  status?: string;
  now?: Date;
}): boolean {
  const due = input.dueDate?.trim();
  if (!due) return false;
  const terminal = new Set(['received', 'approved', 'cancelled']);
  if (input.status && terminal.has(input.status)) return false;
  const dueMs = Date.parse(`${due}T23:59:59`);
  if (!Number.isFinite(dueMs)) return false;
  const now = input.now ?? new Date();
  const todayEnd = new Date(now);
  todayEnd.setHours(23, 59, 59, 999);
  return dueMs < todayEnd.getTime();
}

export function parseWorkshop2FactorySampleQueueStatusFilter(
  raw: string | null | undefined
): Workshop2SampleOrderStatus[] | undefined {
  const tokens = raw
    ?.split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  if (!tokens?.length) return undefined;
  const allowed = new Set<Workshop2SampleOrderStatus>([
    'draft',
    'sent',
    'in_progress',
    'received',
    'approved',
    'cancelled',
  ]);
  const filtered = tokens.filter((t): t is Workshop2SampleOrderStatus =>
    allowed.has(t as Workshop2SampleOrderStatus)
  );
  return filtered.length ? filtered : undefined;
}

const SAMPLE_QUEUE_STATUS_PRIORITY: Record<string, number> = {
  in_progress: 0,
  sent: 1,
  draft: 2,
  received: 3,
  approved: 4,
  cancelled: 5,
};

/** Просрочка → срок → статус (активные выше завершённых). */
export function sortWorkshop2FactorySampleQueueItems<
  T extends { dueOverdue?: boolean; dueDate?: string; status: string },
>(items: readonly T[]): T[] {
  return [...items].sort((a, b) => {
    if (a.dueOverdue && !b.dueOverdue) return -1;
    if (!a.dueOverdue && b.dueOverdue) return 1;
    const aDue = a.dueDate ? Date.parse(`${a.dueDate}T00:00:00`) : Number.POSITIVE_INFINITY;
    const bDue = b.dueDate ? Date.parse(`${b.dueDate}T00:00:00`) : Number.POSITIVE_INFINITY;
    if (aDue !== bDue) return aDue - bDue;
    const aPri = SAMPLE_QUEUE_STATUS_PRIORITY[a.status] ?? 99;
    const bPri = SAMPLE_QUEUE_STATUS_PRIORITY[b.status] ?? 99;
    return aPri - bPri;
  });
}
