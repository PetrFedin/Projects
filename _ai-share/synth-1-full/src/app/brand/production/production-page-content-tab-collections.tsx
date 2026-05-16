'use client';

import { Layers } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { TabsContent } from '@/components/ui/tabs';
import { CollectionFiltersAndRisk } from '@/components/brand/production/CollectionFiltersAndRisk';
import { SectionInfoCard } from '@/components/brand/production/ProductionSectionEnhancements';
import { ProductionSectionHeader } from '@/app/brand/production/production-page-content-chrome';
import { ProductionPageContentTabCollectionsGrid } from '@/app/brand/production/production-page-content-tab-collections-grid';
import { ProductionPageContentTabCollectionsToolbar } from '@/app/brand/production/production-page-content-tab-collections-toolbar';
import { cabinetSurface } from '@/lib/ui/cabinet-surface';

type CnFn = (...args: (string | boolean | undefined | null)[]) => string;

export function ProductionPageContentTabCollections({
  p,
  cn,
}: {
  p: Record<string, unknown>;
  cn: CnFn;
}) {
  const px = p as Record<string, any>;
  const {
    collections,
    selectedCollectionIds,
    setCollectionFilter,
    setSelectedCollectionIds,
    setActiveTab,
    setIsCreatingCollection,
  } = px;

  return (
    <TabsContent value="collections" className={cabinetSurface.cabinetProfileTabPanel}>
      <ProductionSectionHeader title="Коллекции" barColor="bg-text-primary" />
      <SectionInfoCard
        title="Что такое коллекции"
        description="Коллекция — корневая сущность производства: сезонный ассортимент (SS26, дропы). Из неё идут артикулы, сэмплы, PO, снабжение и бюджет. Здесь вы создаёте новые коллекции, копируете по шаблону, сравниваете и отслеживаете прогресс."
        icon={Layers}
        iconBg="bg-bg-surface2"
        iconColor="text-text-secondary"
        badges={
          <>
            <Badge variant="outline" className="text-[9px]">
              Артикулы → коллекция
            </Badge>
            <Badge variant="outline" className="text-[9px]">
              PO, сэмплы, бюджет
            </Badge>
          </>
        }
      />
      {typeof setCollectionFilter === 'function' && (
        <CollectionFiltersAndRisk
          collections={collections || []}
          selectedIds={selectedCollectionIds || []}
          onFilter={(f) => setCollectionFilter?.((prev: any) => ({ ...(prev || {}), ...f }))}
          onCompare={(ids) => {
            setSelectedCollectionIds?.(ids);
            setActiveTab?.('dashboard');
          }}
          onTemplateFrom={(id) => {
            px.setDuplicateFromCollection?.({
              id,
              name: collections?.find((c: any) => c.id === id)?.name || id,
            });
            setIsCreatingCollection?.(true);
          }}
          riskForecast={[]}
        />
      )}
      <ProductionPageContentTabCollectionsToolbar p={p} cn={cn} />
      <ProductionPageContentTabCollectionsGrid p={p} cn={cn} />
    </TabsContent>
  );
}
