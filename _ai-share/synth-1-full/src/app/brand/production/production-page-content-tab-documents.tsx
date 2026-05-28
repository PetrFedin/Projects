'use client';

import { FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { TabsContent } from '@/components/ui/tabs';
import { SectionInfoCard } from '@/components/brand/production/ProductionSectionEnhancements';
import { ProductionSectionHeader } from '@/app/brand/production/production-page-content-chrome';
import { ProductionPageContentTabDocumentsFilters } from '@/app/brand/production/production-page-content-tab-documents-filters';
import { ProductionPageContentTabDocumentsTable } from '@/app/brand/production/production-page-content-tab-documents-table';
import { cabinetSurface } from '@/lib/ui/cabinet-surface';

type CnFn = (...args: (string | boolean | undefined | null)[]) => string;

export function ProductionPageContentTabDocuments({
  p,
  cn,
}: {
  p: Record<string, unknown>;
  cn: CnFn;
}) {
  return (
    <TabsContent value="documents" className={cabinetSurface.cabinetProfileTabPanel}>
      <ProductionSectionHeader title="Документы" barColor="bg-text-secondary" />
      <SectionInfoCard
        title="Документы"
        description="ТЗ, контракты, инвойсы, QC-отчёты, CMR. Документы привязаны к коллекциям и PO. Статусы: черновик, на подписи, подписан."
        icon={FileText}
        iconBg="bg-bg-surface2"
        iconColor="text-text-secondary"
        badges={
          <>
            <Badge variant="outline" className="text-[9px]">
              Коллекция, PO
            </Badge>
          </>
        }
      />
      <ProductionPageContentTabDocumentsFilters p={p} cn={cn} />
      <ProductionPageContentTabDocumentsTable p={p} />
    </TabsContent>
  );
}
