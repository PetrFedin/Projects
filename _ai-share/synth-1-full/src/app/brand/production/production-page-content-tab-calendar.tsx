'use client';

import { TabsContent } from '@/components/ui/tabs';
import { ProductionGantt } from '@/components/brand/ProductionGantt';
import { ProductionSectionHeader } from '@/app/brand/production/production-page-content-chrome';
import { ProductionPageContentTabCalendarBody } from '@/app/brand/production/production-page-content-tab-calendar-body';
import { cabinetSurface } from '@/lib/ui/cabinet-surface';

type CnFn = (...args: (string | boolean | undefined | null)[]) => string;

export function ProductionPageContentTabCalendar({
  p,
  cn,
}: {
  p: Record<string, unknown>;
  cn: CnFn;
}) {
  const px = p as Record<string, any>;
  const { selectedCollectionIds, setActiveTab } = px;

  return (
    <TabsContent value="calendar" className={cabinetSurface.cabinetProfileTabPanel}>
      <ProductionSectionHeader title="Календарь" barColor="bg-sky-600" />
      <div className="space-y-4">
        <ProductionGantt
          selectedCollectionIds={selectedCollectionIds || []}
          onPeriodChange={() => {}}
          onNavigate={(tab) => setActiveTab?.(tab)}
        />
        <ProductionPageContentTabCalendarBody p={p} cn={cn} />
      </div>
    </TabsContent>
  );
}
