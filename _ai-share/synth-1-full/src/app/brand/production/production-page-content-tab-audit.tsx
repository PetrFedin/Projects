'use client';

import { History } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { TabsContent } from '@/components/ui/tabs';
import { SectionInfoCard } from '@/components/brand/production/ProductionSectionEnhancements';
import { ProductionSectionHeader } from '@/app/brand/production/production-page-content-chrome';
import { ProductionPageContentTabAuditBody } from '@/app/brand/production/production-page-content-tab-audit-body';
import { cabinetSurface } from '@/lib/ui/cabinet-surface';

type CnFn = (...args: (string | boolean | undefined | null)[]) => string;

export function ProductionPageContentTabAudit({ p, cn }: { p: Record<string, unknown>; cn: CnFn }) {
  return (
    <TabsContent value="audit" className={cabinetSurface.cabinetProfileTabPanel}>
      <ProductionSectionHeader title="Аудит" barColor="bg-text-secondary" />
      <SectionInfoCard
        title="Аудит"
        description="Журнал изменений: BOM, сэмплы, PO, статусы. Кто и когда изменил. Детали: было/стало. Фильтр по типу, дате, пользователю."
        icon={History}
        iconBg="bg-bg-surface2"
        iconColor="text-text-secondary"
        badges={
          <>
            <Badge variant="outline" className="text-[9px]">
              BOM, sample, po, status
            </Badge>
          </>
        }
      />
      <ProductionPageContentTabAuditBody p={p} cn={cn} />
    </TabsContent>
  );
}
