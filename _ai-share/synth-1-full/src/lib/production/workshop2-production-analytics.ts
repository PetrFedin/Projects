/**
 * M10 (4.1): Production analytics — lead time, rework rate, routing variance.
 */
import type { ProductionOperation } from '@/lib/production/article-workspace/types';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import type { Workshop2DomainEventEnvelope } from '@/lib/production/workshop2-domain-event-types';
import type { Workshop2SampleOrderStatusHistoryEntry } from '@/lib/server/workshop2-sample-order-repository';
import { summarizeWorkshop2ReleaseOperationsPlanFact } from '@/lib/production/workshop2-release-operations-plan-fact';
import { computeSampleEconomicsDraftTotal } from '@/lib/production/workshop2-sample-economics';

export type Workshop2ProductionAnalyticsDefectRow = {
  defectCode: string;
  severity: string;
  source: string;
  createdAt: string;
};

export type Workshop2ProductionAnalyticsInput = {
  collectionId: string;
  articleId: string;
  from?: string;
  to?: string;
  dossier?: Workshop2DossierPhase1 | null;
  releaseOperations?: ProductionOperation[] | null;
  statusHistory?: Workshop2SampleOrderStatusHistoryEntry[];
  qcDefects?: Workshop2ProductionAnalyticsDefectRow[];
  domainEvents?: Workshop2DomainEventEnvelope[];
};

export type Workshop2ProductionAnalyticsSnapshot = {
  collectionId: string;
  articleId: string;
  period: { from: string | null; to: string | null };
  /** Lead time draft → approved (дни), null если нет полного цикла. */
  sampleLeadTimeDays: number | null;
  /** Доля major+critical среди дефектов (0–1). */
  reworkRate: number | null;
  defectCount: number;
  majorCriticalCount: number;
  domainEventCount: number;
  /** Plan-fact SASH по release operations (%). */
  operationsProgressPct: number;
  routingVariancePct: number | null;
  /** План sample economics vs факт release SASH cost proxy. */
  economicsPlanRub: number | null;
  economicsActualProxyRub: number | null;
  economicsVariancePct: number | null;
  hintRu: string;
  computedAt: string;
};

function inPeriod(iso: string, from?: string, to?: string): boolean {
  const t = Date.parse(iso);
  if (!Number.isFinite(t)) return false;
  if (from && t < Date.parse(from)) return false;
  if (to && t > Date.parse(to)) return false;
  return true;
}

function computeLeadTimeDays(
  history: Workshop2SampleOrderStatusHistoryEntry[] | undefined
): number | null {
  if (!history?.length) return null;
  const draft = history.find((h) => h.to === 'draft') ?? history[0];
  const approved = [...history].reverse().find((h) => h.to === 'approved');
  if (!draft?.at || !approved?.at) return null;
  const start = Date.parse(draft.at);
  const end = Date.parse(approved.at);
  if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) return null;
  return Math.round((end - start) / 86400000);
}

export function computeWorkshop2RoutingVariancePct(input: {
  routingSteps?: Array<{ sash?: number | null; name?: string }> | null;
  releaseOperations?: ProductionOperation[] | null;
}): number | null {
  const plannedRouting = (input.routingSteps ?? []).reduce(
    (acc, s) => acc + (Number.isFinite(s.sash) ? (s.sash as number) : 0),
    0
  );
  const planFact = summarizeWorkshop2ReleaseOperationsPlanFact(input.releaseOperations);
  if (plannedRouting <= 0 || planFact.totalPlannedSash <= 0) return null;
  const delta = planFact.totalPlannedSash - plannedRouting;
  return Math.round((delta / plannedRouting) * 1000) / 10;
}

export function buildWorkshop2ProductionAnalyticsSnapshot(
  input: Workshop2ProductionAnalyticsInput
): Workshop2ProductionAnalyticsSnapshot {
  const from = input.from?.trim() || null;
  const to = input.to?.trim() || null;

  const filteredDefects = (input.qcDefects ?? []).filter((d) =>
    inPeriod(d.createdAt, from ?? undefined, to ?? undefined)
  );
  const filteredEvents = (input.domainEvents ?? []).filter((e) =>
    inPeriod(e.createdAt, from ?? undefined, to ?? undefined)
  );
  const filteredHistory = (input.statusHistory ?? []).filter((h) =>
    inPeriod(h.at, from ?? undefined, to ?? undefined)
  );

  const majorCriticalCount = filteredDefects.filter(
    (d) => d.severity === 'major' || d.severity === 'critical'
  ).length;
  const reworkRate =
    filteredDefects.length > 0
      ? Math.round((majorCriticalCount / filteredDefects.length) * 1000) / 1000
      : null;

  const planFact = summarizeWorkshop2ReleaseOperationsPlanFact(input.releaseOperations);
  const routingVariancePct = computeWorkshop2RoutingVariancePct({
    routingSteps: input.dossier?.routingSteps ?? input.dossier?.smartRoutingSequence,
    releaseOperations: input.releaseOperations,
  });

  const economicsPlanRub = input.dossier?.sampleEconomicsDraft
    ? computeSampleEconomicsDraftTotal(input.dossier.sampleEconomicsDraft)
    : null;
  const economicsActualProxyRub =
    planFact.totalActualSash > 0 ? Math.round(planFact.totalActualSash * 100) / 100 : null;
  let economicsVariancePct: number | null = null;
  if (economicsPlanRub != null && economicsPlanRub > 0 && economicsActualProxyRub != null) {
    economicsVariancePct =
      Math.round(((economicsActualProxyRub - economicsPlanRub) / economicsPlanRub) * 1000) / 10;
  }

  const sampleLeadTimeDays = computeLeadTimeDays(
    filteredHistory.length ? filteredHistory : input.statusHistory
  );

  let hintRu = 'Аналитика по образцу: lead time, rework, plan-fact SASH.';
  if (filteredDefects.length === 0 && !sampleLeadTimeDays) {
    hintRu = 'Мало данных — нужны status_history образца и/или qc_defects.';
  } else if (reworkRate != null && reworkRate > 0.3) {
    hintRu = `Высокий rework rate ${Math.round(reworkRate * 100)}% — проверьте ОТК и CR.`;
  }

  return {
    collectionId: input.collectionId,
    articleId: input.articleId,
    period: { from, to },
    sampleLeadTimeDays,
    reworkRate,
    defectCount: filteredDefects.length,
    majorCriticalCount,
    domainEventCount: filteredEvents.length,
    operationsProgressPct: planFact.progressPct,
    routingVariancePct,
    economicsPlanRub,
    economicsActualProxyRub,
    economicsVariancePct,
    hintRu,
    computedAt: new Date().toISOString(),
  };
}

/** Компактный JSON для export-tz-bundle / analytics.json. */
export function buildWorkshop2ProductionAnalyticsExportSnippet(
  snapshot: Workshop2ProductionAnalyticsSnapshot
): Record<string, unknown> {
  return {
    labelRu: 'Production analytics (образец)',
    ...snapshot,
  };
}
