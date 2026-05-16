'use client';

import { ProductionPageContentTabDashboardInsightsBudget } from '@/app/brand/production/production-page-content-tab-dashboard-insights-budget';
import { ProductionPageContentTabDashboardInsightsEvents } from '@/app/brand/production/production-page-content-tab-dashboard-insights-events';
import { ProductionPageContentTabDashboardInsightsSummary } from '@/app/brand/production/production-page-content-tab-dashboard-insights-summary';
import { ProductionPageContentTabDashboardInsightsTop } from '@/app/brand/production/production-page-content-tab-dashboard-insights-top';

export function ProductionPageContentTabDashboardInsights({ p }: { p: Record<string, unknown> }) {
  return (
    <>
      <ProductionPageContentTabDashboardInsightsTop p={p} />
      <ProductionPageContentTabDashboardInsightsBudget p={p} />
      <ProductionPageContentTabDashboardInsightsEvents p={p} />
      <ProductionPageContentTabDashboardInsightsSummary p={p} />
    </>
  );
}
