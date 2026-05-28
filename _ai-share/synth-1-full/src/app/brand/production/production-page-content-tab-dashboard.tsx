'use client';

import { Activity } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { TabsContent } from '@/components/ui/tabs';
import { CollectionProgressPanel } from '@/components/brand/production/CollectionProgressPanel';
import { ProductionCommandCenter } from '@/components/brand/production/ProductionCommandCenter';
import { SectionInfoCard } from '@/components/brand/production/ProductionSectionEnhancements';
import { ProductionSectionHeader } from '@/app/brand/production/production-page-content-chrome';
import { cabinetSurface } from '@/lib/ui/cabinet-surface';
import { ProductionPageContentTabDashboardInsights } from '@/app/brand/production/production-page-content-tab-dashboard-insights';

export function ProductionPageContentTabDashboard({ p }: { p: Record<string, unknown> }) {
  const px = p as Record<string, any>;
  const {
    setActiveTab,
    selectedId,
    collections,
    filteredSkus,
    filteredSampleStatuses,
    filteredProductionOrders,
  } = px;

  return (
    <TabsContent value="dashboard" className={cabinetSurface.cabinetProfileTabPanel}>
      <ProductionSectionHeader title="Командный центр" barColor="bg-accent-primary" />
      <SectionInfoCard
        title="Дашборд"
        description="Сводный центр: агрегирует данные по выбранным коллекциям. Показывает узкие места (SLA, потери), прогресс этапов, ближайшие дедлайны и события. Отсюда навигация по всем разделам производства."
        icon={Activity}
        iconBg="bg-accent-primary/15"
        iconColor="text-accent-primary"
        badges={
          <>
            <Badge variant="outline" className="text-[9px]">
              Узкие места
            </Badge>
            <Badge variant="outline" className="text-[9px]">
              Дедлайны
            </Badge>
          </>
        }
      />
      <ProductionCommandCenter onNavigate={(tab) => setActiveTab?.(tab)} />
      {selectedId && (
        <CollectionProgressPanel
          collectionId={selectedId}
          collectionName={collections?.find((c: any) => c.id === selectedId)?.name}
          readiness={
            parseInt(collections?.find((c: any) => c.id === selectedId)?.readiness || '0', 10) || 65
          }
          stageStatus={{
            design: 'completed',
            tz: 'completed',
            bom: 'completed',
            sample: 'active',
            approval: 'locked',
            po: 'locked',
            production: 'locked',
          }}
          skuCount={(filteredSkus || []).length}
          approvedCount={
            (filteredSampleStatuses || []).filter((s: any) => s.status === 'approved').length
          }
          poCount={(filteredProductionOrders || []).length}
          onNavigate={(stage) =>
            setActiveTab?.(
              stage === 'sample'
                ? 'samples'
                : stage === 'po'
                  ? 'orders'
                  : stage === 'production'
                    ? 'execution'
                    : stage
            )
          }
        />
      )}
      <ProductionPageContentTabDashboardInsights p={p} />
    </TabsContent>
  );
}
