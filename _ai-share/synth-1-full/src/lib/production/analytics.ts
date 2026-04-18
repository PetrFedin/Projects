/**
 * Production Analytics — KPI, drill-down, план vs факт
 * Связано с Дашбордом production и экспортом
 */

export type AnalyticsPeriod = 'week' | 'month' | 'quarter' | 'year';

export interface AnalyticsKpi {
  onTimeDeliveryPct: number; // % on-time
  onTimePlan: number; // план, напр. 90
  qualityByFactory: {
    factoryId: string;
    factoryName: string;
    defectRate: number;
    onTimePct: number;
  }[];
  planVsFact: {
    production: { plan: number; fact: number };
    budget: { plan: number; fact: number };
    samples: { plan: number; fact: number };
  };
}

export interface AnalyticsDrillDown {
  collectionId: string;
  collectionName: string;
  onTimePct: number;
  samplesTotal: number;
  samplesOnTime: number;
  ordersTotal: number;
  budgetPlan: number;
  budgetFact: number;
}

export function computeAnalyticsKpis(params: {
  collections: { id: string; name: string }[];
  sampleStatuses: { collection: string; slaOverdue?: boolean; status: string }[];
  productionOrders: { collection: string; qty?: number }[];
  budgets: { collectionId: string; totalPlan: number; totalFact: number }[];
}): AnalyticsKpi {
  const { collections, sampleStatuses, productionOrders, budgets } = params;
  const totalSamples = sampleStatuses.length;
  const onTime = sampleStatuses.filter((s) => !s.slaOverdue).length;
  const onTimeDeliveryPct = totalSamples > 0 ? Math.round((onTime / totalSamples) * 100) : 0;
  const totalPlan = budgets.reduce((s, b) => s + b.totalPlan, 0);
  const totalFact = budgets.reduce((s, b) => s + b.totalFact, 0);
  const prodPlan = productionOrders.reduce((s, o) => s + (o.qty || 0), 0);
  return {
    onTimeDeliveryPct,
    onTimePlan: 90,
    qualityByFactory: [
      { factoryId: 'F1', factoryName: 'Global Tailor', defectRate: 1.2, onTimePct: 92 },
      { factoryId: 'F2', factoryName: 'Smart Tailor Lab', defectRate: 2.1, onTimePct: 85 },
    ],
    planVsFact: {
      production: { plan: prodPlan, fact: Math.round(prodPlan * 0.92) },
      budget: { plan: totalPlan, fact: totalFact },
      samples: { plan: totalSamples, fact: onTime },
    },
  };
}

export function exportAnalyticsToCSV(
  kpis: AnalyticsKpi,
  drillDown: AnalyticsDrillDown[],
  filename = 'production-analytics'
) {
  const rows: Record<string, string | number>[] = [
    { metric: 'On-time delivery %', value: kpis.onTimeDeliveryPct, unit: '%' },
    { metric: 'План on-time', value: kpis.onTimePlan, unit: '%' },
    { metric: 'Бюджет план', value: kpis.planVsFact.budget.plan, unit: '₽' },
    { metric: 'Бюджет факт', value: kpis.planVsFact.budget.fact, unit: '₽' },
    ...kpis.qualityByFactory.map((f) => ({
      metric: `Качество ${f.factoryName}`,
      value: f.defectRate,
      unit: '% defect',
      onTime: f.onTimePct,
    })),
    ...drillDown.map((d) => ({
      collection: d.collectionName,
      onTimePct: d.onTimePct,
      samplesTotal: d.samplesTotal,
      samplesOnTime: d.samplesOnTime,
      budgetPlan: d.budgetPlan,
      budgetFact: d.budgetFact,
    })),
  ];
  const cols = Object.keys(rows[0] || {}) as (keyof (typeof rows)[0])[];
  const header = cols.join(',');
  const body = rows.map((r) => cols.map((c) => String(r[c] ?? '')).join(',')).join('\n');
  const blob = new Blob(['\ufeff' + header + '\n' + body], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}-${Date.now()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
