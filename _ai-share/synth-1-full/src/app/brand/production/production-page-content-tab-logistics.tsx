'use client';

import { Truck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { TabsContent } from '@/components/ui/tabs';
import { SectionInfoCard } from '@/components/brand/production/ProductionSectionEnhancements';
import { ProductionSectionHeader } from '@/app/brand/production/production-page-content-chrome';
import { ProductionPageContentTabLogisticsBody } from '@/app/brand/production/production-page-content-tab-logistics-body';
import { cabinetSurface } from '@/lib/ui/cabinet-surface';

type CnFn = (...args: (string | boolean | undefined | null)[]) => string;

export function ProductionPageContentTabLogistics({
  p,
  cn,
}: {
  p: Record<string, unknown>;
  cn: CnFn;
}) {
  return (
    <TabsContent value="logistics" className={cabinetSurface.cabinetProfileTabPanel}>
      <ProductionSectionHeader title="Логистика" barColor="bg-blue-600" />
      <SectionInfoCard
        title="Логистика"
        description="Обслуживает PO: отгрузки, приёмки. Трекинг грузов, расписание приёмок. CMR, инвойсы, таможня. Связь с PO — что в пути, остатки на складе."
        icon={Truck}
        iconBg="bg-blue-100"
        iconColor="text-blue-600"
        badges={
          <>
            <Badge variant="outline" className="text-[9px]">
              PO → отгрузки
            </Badge>
          </>
        }
      />
      <ProductionPageContentTabLogisticsBody p={p} cn={cn} />
    </TabsContent>
  );
}
