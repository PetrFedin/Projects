'use client';

import { Coins } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TabsContent } from '@/components/ui/tabs';
import { ProductionCostBreakdown } from '@/components/brand/production/ProductionCostBreakdown';
import { SectionInfoCard } from '@/components/brand/production/ProductionSectionEnhancements';
import { ProductionSectionHeader } from '@/app/brand/production/production-page-content-chrome';
import { cabinetSurface } from '@/lib/ui/cabinet-surface';

export function ProductionPageContentTabCosting({ p }: { p: Record<string, unknown> }) {
  const px = p as Record<string, any>;
  const { selectedId, setIsCostingOpen, setActiveTab } = px;

  return (
    <TabsContent value="costing" className={cabinetSurface.cabinetProfileTabPanel}>
      <ProductionSectionHeader title="Костинг" barColor="bg-amber-600" />
      <SectionInfoCard
        title="Костинг"
        description="Статьи затрат по категориям. Калькулятор себестоимости. Данные уходят в бюджет коллекции. Розничная цена от себестоимости и наценки. Связано с BOM и материалами."
        icon={Coins}
        iconBg="bg-amber-100"
        iconColor="text-amber-600"
        badges={
          <>
            <Badge variant="outline" className="text-[9px]">
              Костинг → Бюджет
            </Badge>
          </>
        }
      />
      <ProductionCostBreakdown collectionId={selectedId} />
      <div className="flex gap-3">
        <Button variant="outline" size="sm" onClick={() => setIsCostingOpen?.(true)}>
          Калькулятор себестоимости
        </Button>
        <Button variant="ghost" size="sm" onClick={() => setActiveTab?.('budget')}>
          Бюджет →
        </Button>
      </div>
    </TabsContent>
  );
}
