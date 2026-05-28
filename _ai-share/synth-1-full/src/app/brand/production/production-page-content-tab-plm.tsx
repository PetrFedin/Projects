'use client';

import { Layers } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { TabsContent } from '@/components/ui/tabs';
import { SectionInfoCard } from '@/components/brand/production/ProductionSectionEnhancements';
import { ProductionSectionHeader } from '@/app/brand/production/production-page-content-chrome';
import { ProductionPageContentTabPlmBody } from '@/app/brand/production/production-page-content-tab-plm-body';
import { ProductionPageContentTabPlmSampleStrip } from '@/app/brand/production/production-page-content-tab-plm-sample-strip';
import { ProductionPageContentTabPlmViewSwitch } from '@/app/brand/production/production-page-content-tab-plm-view-switch';
import { cabinetSurface } from '@/lib/ui/cabinet-surface';

export function ProductionPageContentTabPlm({ p }: { p: Record<string, unknown> }) {
  return (
    <TabsContent value="plm" className={cabinetSurface.cabinetProfileTabPanel}>
      <ProductionSectionHeader title="Артикулы и PLM" barColor="bg-accent-primary" />
      <SectionInfoCard
        title="Артикулы (PLM)"
        description="Артикул привязан к коллекции. У каждого — BOM, варианты, Tech Pack. Сэмплы создаются по артикулам. Матрица, варианты, версии лекал и Tech Pack — основные представления."
        icon={Layers}
        iconBg="bg-accent-primary/15"
        iconColor="text-accent-primary"
        badges={
          <>
            <Badge variant="outline" className="text-[9px]">
              BOM, Tech Pack
            </Badge>
            <Badge variant="outline" className="text-[9px]">
              Сэмплы → артикул
            </Badge>
          </>
        }
      />
      <ProductionPageContentTabPlmSampleStrip p={p} />
      <ProductionPageContentTabPlmViewSwitch p={p} />
      <ProductionPageContentTabPlmBody p={p} />
    </TabsContent>
  );
}
