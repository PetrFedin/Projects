'use client';

import { Package } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TabsContent } from '@/components/ui/tabs';
import { MaterialsShortagePanel } from '@/components/brand/production/MaterialsShortagePanel';
import { SectionInfoCard } from '@/components/brand/production/ProductionSectionEnhancements';
import { ProductionSectionHeader } from '@/app/brand/production/production-page-content-chrome';
import { cabinetSurface } from '@/lib/ui/cabinet-surface';
import { ProductionPageContentTabMaterialsBody } from '@/app/brand/production/production-page-content-tab-materials-body';

type CnFn = (...args: (string | boolean | undefined | null)[]) => string;

export function ProductionPageContentTabMaterials({
  p,
  cn,
}: {
  p: Record<string, unknown>;
  cn: CnFn;
}) {
  const px = p as Record<string, any>;
  const { setIsMarketplaceOpen, selectedId } = px;

  return (
    <TabsContent value="materials" className={cabinetSurface.cabinetProfileTabPanel}>
      <ProductionSectionHeader title="Снабжение" barColor="bg-accent-primary" />
      <SectionInfoCard
        title="Снабжение"
        description="Рулоны ткани, фурнитура, заявки, КП, PO и приёмка материалов. Связано с BOM артикулов. Цепочка: заявка → КП → PO → приёмка. SFC-операции — учёт по производству."
        icon={Package}
        iconBg="bg-accent-primary/15"
        iconColor="text-accent-primary"
        badges={
          <>
            <Badge variant="outline" className="text-[9px]">
              BOM → заявки
            </Badge>
            <Badge variant="outline" className="text-[9px]">
              Маркетплейс
            </Badge>
          </>
        }
      />
      <Button
        variant="outline"
        size="sm"
        className="mb-3"
        onClick={() => setIsMarketplaceOpen?.(true)}
      >
        Маркетплейс материалов
      </Button>
      <MaterialsShortagePanel
        items={[
          {
            id: '1',
            name: 'Silk Satin',
            category: 'fabric',
            needed: 500,
            unit: 'м',
            stock: 200,
            collection: selectedId,
            skuIds: [],
          },
          {
            id: '2',
            name: 'Пуговицы 18мм',
            category: 'haberdashery',
            needed: 1000,
            unit: 'шт',
            stock: 300,
            collection: selectedId,
            skuIds: [],
          },
        ]}
        onSearchMarketplace={() => {}}
        onSearchAuctions={() => {}}
      />
      <ProductionPageContentTabMaterialsBody p={p} cn={cn} />
    </TabsContent>
  );
}
