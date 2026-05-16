'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ProductionSectionHeader } from '@/app/brand/production/production-page-content-chrome';

export function ProductionPageContentTabDashboardInsightsSummary({
  p,
}: {
  p: Record<string, unknown>;
}) {
  const px = p as Record<string, any>;
  const { filteredSkus, filteredProductionOrders, samplePendingCount } = px;

  return (
    <>
      <ProductionSectionHeader title="Сводка" barColor="bg-emerald-600" />
      <Card className="border-border-subtle rounded-xl border border-none bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-xs font-black uppercase">Обзор</CardTitle>
          <CardDescription>Сводка по выбранным коллекциям</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-bg-surface2 rounded-xl p-4">
              <p className="text-text-muted text-[10px] font-bold">SKU</p>
              <p className="text-xl font-black">{(filteredSkus || []).length}</p>
            </div>
            <div className="bg-bg-surface2 rounded-xl p-4">
              <p className="text-text-muted text-[10px] font-bold">Заказы (PO)</p>
              <p className="text-xl font-black">{(filteredProductionOrders || []).length}</p>
            </div>
            <div className="bg-bg-surface2 rounded-xl p-4">
              <p className="text-text-muted text-[10px] font-bold">Сэмплы на проверку</p>
              <p className="text-xl font-black">{samplePendingCount ?? 0}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
