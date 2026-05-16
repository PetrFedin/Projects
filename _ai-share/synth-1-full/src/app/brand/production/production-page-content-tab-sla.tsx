'use client';

import { Timer } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { TabsContent } from '@/components/ui/tabs';
import { SectionInfoCard } from '@/components/brand/production/ProductionSectionEnhancements';
import { ProductionSectionHeader } from '@/app/brand/production/production-page-content-chrome';
import { ProductionPageContentTabSlaOverdueBanner } from '@/app/brand/production/production-page-content-tab-sla-overdue-banner';
import { ProductionPageContentTabSlaTableCard } from '@/app/brand/production/production-page-content-tab-sla-table-card';
import { cabinetSurface } from '@/lib/ui/cabinet-surface';

export function ProductionPageContentTabSla({ p }: { p: Record<string, unknown> }) {
  return (
    <TabsContent value="sla" className={cabinetSurface.cabinetProfileTabPanel}>
      <ProductionSectionHeader title="SLA по сэмплам" barColor="bg-amber-600" />
      <SectionInfoCard
        title="SLA"
        description="Сроки по этапам сэмплов: Proto, PP, Size Set. Оставшееся время до дедлайна. Уведомления при риске просрочки. Сводка просрочек, редактирование дедлайнов."
        icon={Timer}
        iconBg="bg-amber-100"
        iconColor="text-amber-600"
        badges={
          <>
            <Badge variant="outline" className="text-[9px]">
              Сэмплы
            </Badge>
          </>
        }
      />
      <ProductionPageContentTabSlaOverdueBanner p={p} />
      <ProductionPageContentTabSlaTableCard p={p} />
    </TabsContent>
  );
}
