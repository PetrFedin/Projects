'use client';

import { FileSpreadsheet } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { TabsContent } from '@/components/ui/tabs';
import { SectionInfoCard } from '@/components/brand/production/ProductionSectionEnhancements';
import { ProductionSectionHeader } from '@/app/brand/production/production-page-content-chrome';
import { ProductionPageContentTabReportsGrid } from '@/app/brand/production/production-page-content-tab-reports-grid';
import { cabinetSurface } from '@/lib/ui/cabinet-surface';

export function ProductionPageContentTabReports({ p }: { p: Record<string, unknown> }) {
  const px = p as Record<string, any>;
  const { filteredSkus, filteredProductionOrders, samplePendingCount, handleAction, setActiveTab } =
    px;

  return (
    <TabsContent value="reports" className={cabinetSurface.cabinetProfileTabPanel}>
      <ProductionSectionHeader title="Отчёты и аналитика" barColor="bg-accent-primary" />
      <SectionInfoCard
        title="Отчёты"
        description="Сводные отчёты: динамика SKU, бюджет, загрузка фабрик. KPI по коллекциям. Экспорт в CSV. Связь с дашбордом и данными разделов."
        icon={FileSpreadsheet}
        iconBg="bg-accent-primary/15"
        iconColor="text-accent-primary"
        badges={
          <>
            <Badge variant="outline" className="text-[9px]">
              Дашборд
            </Badge>
            <Badge variant="outline" className="text-[9px]">
              Экспорт
            </Badge>
          </>
        }
      />
      <ProductionPageContentTabReportsGrid
        filteredSkus={filteredSkus || []}
        filteredProductionOrders={filteredProductionOrders || []}
        samplePendingCount={samplePendingCount}
        handleAction={handleAction}
        setActiveTab={setActiveTab}
      />
    </TabsContent>
  );
}
