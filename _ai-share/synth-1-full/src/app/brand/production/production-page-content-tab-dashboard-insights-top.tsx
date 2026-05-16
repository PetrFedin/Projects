'use client';

import { Card, CardContent } from '@/components/ui/card';
import { BottleneckPanel } from '@/components/brand/production/BottleneckPanel';
import { SLACountdown } from '@/components/brand/production/ProductionSectionEnhancements';
import { ProductionSectionHeader } from '@/app/brand/production/production-page-content-chrome';

export function ProductionPageContentTabDashboardInsightsTop({ p }: { p: Record<string, unknown> }) {
  const px = p as Record<string, any>;
  const { collections, filteredSlaSamples, filteredLosses, filteredCollections } = px;

  const bottleneckItems = [
    ...(filteredSlaSamples || [])
      .filter((s: any) => s.slaOverdue)
      .map((s: any) => ({
        id: `sla-${s.skuId}`,
        type: 'sla' as const,
        title: `${s.skuName} просрочен`,
        detail: s.dueDate,
        severity: 'high' as const,
      })),
    ...((filteredLosses || []).length > 2
      ? [
          {
            id: 'loss',
            type: 'material' as const,
            title: 'Потери выше нормы',
            detail: `${(filteredLosses || []).length} записей`,
            severity: 'medium' as const,
          },
        ]
      : []),
  ];

  const deadlineRows = [
    ...(filteredSlaSamples || [])
      .filter((s: any) => s.slaOverdue)
      .slice(0, 3)
      .map((s: any) => ({
        type: 'sla',
        label: s.skuName,
        date: s.dueDate,
        overdue: true,
      })),
    ...(filteredSlaSamples || [])
      .filter((s: any) => !s.slaOverdue)
      .slice(0, 5)
      .map((s: any) => ({
        type: 'sla',
        label: s.skuName,
        date: s.dueDate,
        overdue: false,
      })),
    ...(filteredCollections ?? collections ?? [])
      .filter((c: any) => c.deadline && c.deadline !== '—')
      .slice(0, 3)
      .map((c: any) => ({
        type: 'coll',
        label: c.name,
        date: c.deadline,
        overdue: false,
      })),
  ].slice(0, 8);

  return (
    <>
      <BottleneckPanel items={bottleneckItems} onResolve={() => {}} />
      <ProductionSectionHeader title="Ближайшие дедлайны" barColor="bg-amber-500" />
      <Card className="overflow-hidden rounded-xl border border-amber-100 shadow-sm">
        <CardContent className="pt-4">
          <div className="max-h-40 space-y-2 overflow-y-auto">
            {deadlineRows.map((item: any, i: number) => (
              <div
                key={i}
                className="border-border-subtle flex items-center justify-between border-b py-1.5 last:border-0"
              >
                <span className="flex-1 truncate text-[10px] font-medium">{item.label}</span>
                <SLACountdown dueDate={item.date} overdue={item.overdue} />
              </div>
            ))}
            {!filteredSlaSamples?.length &&
              !(filteredCollections ?? collections ?? []).some((c: any) => c.deadline) && (
                <p className="text-text-muted py-4 text-[10px]">Нет активных дедлайнов</p>
              )}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
