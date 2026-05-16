'use client';

import { Factory } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { TabsContent } from '@/components/ui/tabs';
import { DigitalProductionView } from '@/components/brand/digital-production-view';
import { ProductionDigitalTwin } from '@/components/brand/ProductionDigitalTwin';
import { BatchComments } from '@/components/brand/production/BatchComments';
import { FactoryLoadOverview } from '@/components/brand/production/ProductionEnhancementsHub';
import { SectionInfoCard } from '@/components/brand/production/ProductionSectionEnhancements';
import { ProductionSectionHeader } from '@/app/brand/production/production-page-content-chrome';
import { cabinetSurface } from '@/lib/ui/cabinet-surface';

type CnFn = (...args: (string | boolean | undefined | null)[]) => string;

export function ProductionPageContentTabExecution({
  p,
  cn,
}: {
  p: Record<string, unknown>;
  cn: CnFn;
}) {
  const px = p as Record<string, any>;
  const {
    setExecutionView,
    executionView,
    selectedId,
    selectedCollectionIds,
    selectedPoId,
    selectedSkuId,
  } = px;

  return (
<TabsContent value="execution" className={cabinetSurface.cabinetProfileTabPanel}>
  <ProductionSectionHeader title="Цех" barColor="bg-sky-600" />
  <SectionInfoCard
    title="Цех"
    description="Выполнение PO на фабриках. Загрузка по фабрикам, мониторинг и Digital Twin. Прогресс по заказам, отчёты с производства."
    icon={Factory}
    iconBg="bg-sky-100"
    iconColor="text-sky-600"
    badges={
      <>
        <Badge variant="outline" className="text-[9px]">
          Загрузка фабрик
        </Badge>
      </>
    }
  />
  <FactoryLoadOverview
    data={[
      { factory: 'Global Textiles', week: '12–18.03', load: 85, poCount: 3 },
      { factory: 'Smart Tailor', week: '12–18.03', load: 60, poCount: 2 },
    ]}
  />
  <div className="bg-bg-surface2 border-border-default mb-4 flex w-fit rounded-2xl border p-1">
    <button
      type="button"
      onClick={() => setExecutionView?.('monitor')}
      className={cn(
        'rounded-xl px-4 py-2 text-[10px] font-bold uppercase transition-all',
        executionView === 'monitor'
          ? 'text-accent-primary bg-white shadow-sm'
          : 'text-text-secondary'
      )}
    >
      Мониторинг
    </button>
    <button
      type="button"
      onClick={() => setExecutionView?.('twin')}
      className={cn(
        'rounded-xl px-4 py-2 text-[10px] font-bold uppercase transition-all',
        executionView === 'twin'
          ? 'text-accent-primary bg-white shadow-sm'
          : 'text-text-secondary'
      )}
    >
      Digital Twin
    </button>
  </div>
  {executionView === 'monitor' ? (
    <DigitalProductionView collectionId={selectedId} />
  ) : (
    <ProductionDigitalTwin
      collectionId={
        selectedId || (selectedCollectionIds?.length ? selectedCollectionIds[0] : null)
      }
    />
  )}
  {selectedPoId && (
    <BatchComments batchId={selectedPoId} skuId={selectedSkuId || undefined} />
  )}
</TabsContent>

  );
}
