'use client';

import { TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { TabsContent } from '@/components/ui/tabs';
import { SectionInfoCard } from '@/components/brand/production/ProductionSectionEnhancements';
import { ProductionSectionHeader } from '@/app/brand/production/production-page-content-chrome';
import { ProductionPageContentTabLossesBody } from '@/app/brand/production/production-page-content-tab-losses-body';
import { cabinetSurface } from '@/lib/ui/cabinet-surface';

type CnFn = (...args: (string | boolean | undefined | null)[]) => string;

export function ProductionPageContentTabLosses({
  p,
  cn,
}: {
  p: Record<string, unknown>;
  cn: CnFn;
}) {
  return (
    <TabsContent value="losses" className={cabinetSurface.cabinetProfileTabPanel}>
      <ProductionSectionHeader title="Потери" barColor="bg-rose-600" />
      <SectionInfoCard
        title="Потери"
        description="Материалы и готовые изделия: брак, перерасход, списание. Привязка к PO, артикулу, партии. Влияет на бюджет и отчётность."
        icon={TrendingUp}
        iconBg="bg-rose-100"
        iconColor="text-rose-600"
        badges={
          <>
            <Badge variant="outline" className="text-[9px]">
              Брак, перерасход, списание
            </Badge>
          </>
        }
      />
      <ProductionPageContentTabLossesBody p={p} cn={cn} />
    </TabsContent>
  );
}
