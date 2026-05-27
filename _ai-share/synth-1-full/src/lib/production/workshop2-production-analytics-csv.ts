/**
 * M10 CFO export: CSV из production analytics snapshot.
 */
import type { Workshop2ProductionAnalyticsSnapshot } from '@/lib/production/workshop2-production-analytics';

export function buildWorkshop2ProductionAnalyticsCsv(
  snapshot: Workshop2ProductionAnalyticsSnapshot
): string {
  const rows: Array<[string, string | number | null]> = [
    ['collection_id', snapshot.collectionId],
    ['article_id', snapshot.articleId],
    ['period_from', snapshot.period.from ?? ''],
    ['period_to', snapshot.period.to ?? ''],
    ['sample_lead_time_days', snapshot.sampleLeadTimeDays],
    ['rework_rate', snapshot.reworkRate],
    ['defect_count', snapshot.defectCount],
    ['major_critical_count', snapshot.majorCriticalCount],
    ['domain_event_count', snapshot.domainEventCount],
    ['operations_progress_pct', snapshot.operationsProgressPct],
    ['routing_variance_pct', snapshot.routingVariancePct],
    ['economics_plan_rub', snapshot.economicsPlanRub],
    ['economics_actual_proxy_rub', snapshot.economicsActualProxyRub],
    ['economics_variance_pct', snapshot.economicsVariancePct],
    ['hint_ru', snapshot.hintRu],
    ['computed_at', snapshot.computedAt],
  ];
  const header = 'metric,value';
  const body = rows
    .map(([metric, value]) => {
      const v =
        value == null
          ? ''
          : String(value).includes(',') || String(value).includes('"')
            ? `"${String(value).replace(/"/g, '""')}"`
            : String(value);
      return `${metric},${v}`;
    })
    .join('\n');
  return `\uFEFF${header}\n${body}`;
}
