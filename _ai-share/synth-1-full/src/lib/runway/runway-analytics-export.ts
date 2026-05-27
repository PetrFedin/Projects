import type { ScrollExperienceEventLogEntry } from '@/lib/scroll-experience-analytics';
import type { RunwayAnalyticsDashboard } from '@/lib/runway/runway-analytics-aggregation';

function csvEscape(value: string | number | null | undefined): string {
  const raw = value == null ? '' : String(value);
  if (/[",\n\r]/.test(raw)) {
    return `"${raw.replace(/"/g, '""')}"`;
  }
  return raw;
}

/** CSV событий runway для бренд-админки. */
export function formatRunwayAnalyticsEventsCsv(events: ScrollExperienceEventLogEntry[]): string {
  const header = [
    'timestamp',
    'event',
    'productSlug',
    'brand',
    'sectionIndex',
    'sectionLabel',
    'price',
    'interactionType',
    'surface',
  ].join(',');

  const rows = events.map((e) =>
    [
      e.timestamp,
      e.event,
      e.productSlug,
      e.brand ?? '',
      e.sectionIndex ?? '',
      e.sectionLabel ?? '',
      e.price ?? '',
      e.interactionType ?? '',
      e.surface ?? '',
    ]
      .map(csvEscape)
      .join(',')
  );

  return [header, ...rows].join('\n');
}

/** Сводный CSV: KPI + funnel + section popularity. */
export function formatRunwayAnalyticsDashboardCsv(dashboard: RunwayAnalyticsDashboard): string {
  const lines: string[] = [
    '# Runway Analytics Export',
    `generatedAt,${new Date().toISOString()}`,
    '',
  ];

  lines.push('# KPI');
  lines.push('metric,value');
  lines.push(`views,${dashboard.metrics.scroll_experience_view}`);
  lines.push(`section_changes,${dashboard.metrics.scroll_experience_section_change}`);
  lines.push(`add_to_cart,${dashboard.metrics.scroll_experience_add_to_cart}`);
  lines.push(`shares,${dashboard.metrics.scroll_experience_share}`);
  lines.push(`wishlist_toggles,${dashboard.metrics.scroll_experience_wishlist_toggle}`);
  lines.push('');

  lines.push('# Funnel');
  lines.push('step,label,count,rateFromPrevious');
  for (const row of dashboard.funnel) {
    lines.push(
      [row.step, row.label, row.count, row.rateFromPrevious ?? ''].map(csvEscape).join(',')
    );
  }
  lines.push('');

  lines.push('# Section popularity');
  lines.push('sectionIndex,sectionLabel,views');
  for (const row of dashboard.sectionPopularity) {
    lines.push([row.sectionIndex, row.sectionLabel, row.views].map(csvEscape).join(','));
  }

  return lines.join('\n');
}
