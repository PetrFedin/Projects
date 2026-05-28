/**
 * M8 (4.2): T&A plan-fact — actualDate из domain events + chips просрочки/задержки.
 */
import type { Workshop2TaMilestone } from '@/lib/production/workshop2-dossier-phase1.types';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import { emptyWorkshop2DossierPhase1 } from '@/lib/production/workshop2-phase1-dossier-storage';
import type { Workshop2DomainEventEnvelope } from '@/lib/production/workshop2-domain-event-types';
import {
  resolveWorkshop2TaMilestones,
  summarizeWorkshop2TaMilestonesStatus,
  type Workshop2TaMilestonesStatus,
} from '@/lib/production/workshop2-ta-milestones-status';

export type Workshop2TaPlanFactMilestoneRow = Workshop2TaMilestone & {
  /** Фактическая дата из события (если подставлена автоматически). */
  actualFromEvent?: boolean;
  isOverdue: boolean;
  isDelayed: boolean;
  /** Δ дней: actual − target (отрицательное = раньше плана). */
  deltaDays?: number;
};

export type Workshop2TaPlanFactSummary = Workshop2TaMilestonesStatus & {
  rows: Workshop2TaPlanFactMilestoneRow[];
  planFactLabelRu: string;
};

/** Сопоставление типа domain event → ключевые слова в title вехи T&A. */
const EVENT_TO_MILESTONE_TITLE_HINTS: Array<{
  eventType: Workshop2DomainEventEnvelope['type'];
  titleIncludes: string[];
  statusOnMatch?: Workshop2TaMilestone['status'];
  payloadStatus?: string[];
}> = [
  {
    eventType: 'sample_order.status_changed',
    titleIncludes: ['размещение', 'po', 'заказ'],
    statusOnMatch: 'completed',
    payloadStatus: ['sent', 'in_progress'],
  },
  {
    eventType: 'sample_order.status_changed',
    titleIncludes: ['пошив', 'образец', 'sample'],
    statusOnMatch: 'completed',
    payloadStatus: ['received', 'approved'],
  },
  {
    eventType: 'supply.cut_ticket.created',
    titleIncludes: ['раскрой'],
    statusOnMatch: 'completed',
  },
  {
    eventType: 'qc.inspector_report.saved',
    titleIncludes: ['review', 'отк', 'qc', 'финал'],
    statusOnMatch: 'completed',
  },
  {
    eventType: 'change_request.approved',
    titleIncludes: ['review', 'финал'],
    statusOnMatch: 'completed',
  },
];

function parseDay(iso: string | null | undefined): number | null {
  if (!iso?.trim()) return null;
  const t = Date.parse(iso.slice(0, 10));
  return Number.isFinite(t) ? t : null;
}

function dayIsoFromEvent(createdAt: string): string {
  return createdAt.slice(0, 10);
}

function milestoneTitleMatches(title: string, hints: string[]): boolean {
  const t = title.toLowerCase();
  return hints.some((h) => t.includes(h.toLowerCase()));
}

/** Подставляет actualDate/status из domain events, не затирая ручной ввод. */
export function applyWorkshop2TaMilestonesActualFromDomainEvents(input: {
  milestones: Workshop2TaMilestone[];
  events: Workshop2DomainEventEnvelope[];
}): Workshop2TaMilestone[] {
  const byId = new Map(input.milestones.map((m) => [m.id, { ...m }]));

  for (const ev of input.events) {
    const rules = EVENT_TO_MILESTONE_TITLE_HINTS.filter((r) => r.eventType === ev.type);
    if (rules.length === 0) continue;

    for (const rule of rules) {
      if (rule.payloadStatus?.length) {
        const st = String(ev.payload?.status ?? ev.payload?.toStatus ?? '').toLowerCase();
        if (!rule.payloadStatus.includes(st)) continue;
      }

      for (const m of byId.values()) {
        if (!milestoneTitleMatches(m.title, rule.titleIncludes)) continue;
        if (m.actualDate) continue;
        m.actualDate = dayIsoFromEvent(ev.createdAt);
        if (rule.statusOnMatch && m.status === 'pending') {
          m.status = rule.statusOnMatch;
        }
      }
    }
  }

  return input.milestones.map((m) => byId.get(m.id) ?? m);
}

export function buildWorkshop2TaPlanFactSummary(input: {
  dossier?: Workshop2DossierPhase1 | null;
  bundleTa?: import('@/lib/production/article-workspace/types').TimeAndActionSnapshot | null;
  domainEvents?: Workshop2DomainEventEnvelope[];
  now?: Date;
}): Workshop2TaPlanFactSummary {
  const resolved = resolveWorkshop2TaMilestones({
    dossier: input.dossier,
    bundleTa: input.bundleTa,
  });
  const milestones =
    input.domainEvents?.length && resolved.milestones.length
      ? applyWorkshop2TaMilestonesActualFromDomainEvents({
          milestones: resolved.milestones,
          events: input.domainEvents,
        })
      : resolved.milestones;

  const status = summarizeWorkshop2TaMilestonesStatus({
    dossier: input.dossier
      ? { ...input.dossier, taMilestones: milestones }
      : input.bundleTa
        ? null
        : milestones.length
          ? ({
              ...emptyWorkshop2DossierPhase1(),
              taMilestones: milestones,
            } as Workshop2DossierPhase1)
          : null,
    bundleTa: input.bundleTa,
  });

  const today = input.now ?? new Date();
  const todayMs = new Date(today.toISOString().slice(0, 10)).getTime();

  const rows: Workshop2TaPlanFactMilestoneRow[] = milestones.map((m) => {
    const target = parseDay(m.targetDate);
    const actual = parseDay(m.actualDate);
    const isDelayed = m.status === 'delayed';
    const isOverdue =
      target != null && target < todayMs && m.status !== 'completed' && m.status !== 'delayed';
    let deltaDays: number | undefined;
    if (target != null && actual != null) {
      deltaDays = Math.round((actual - target) / 86400000);
    }
    const manualActual = resolved.milestones.find((x) => x.id === m.id)?.actualDate;
    const actualFromEvent = Boolean(m.actualDate && !manualActual);

    return {
      ...m,
      actualFromEvent,
      isOverdue,
      isDelayed,
      deltaDays,
    };
  });

  const completedWithFact = rows.filter((r) => r.actualDate && r.targetDate).length;
  const planFactLabelRu =
    rows.length === 0
      ? 'Вех T&A нет'
      : `Plan-fact: ${completedWithFact}/${rows.length} с фактом · просрочено ${status.overdueCount} · задержки ${status.delayedCount}`;

  return {
    ...status,
    rows,
    planFactLabelRu,
  };
}

/** Gantt-lite: доля прогресса вехи 0–100 для визуальной полоски (plan tab / timeline). */
export function workshop2TaMilestoneGanttProgressPct(row: Workshop2TaPlanFactMilestoneRow): number {
  if (row.status === 'completed') return 100;
  if (row.isOverdue || row.isDelayed) return 85;
  if (row.actualDate && row.targetDate) return 70;
  if (row.targetDate) return 35;
  return 12;
}
