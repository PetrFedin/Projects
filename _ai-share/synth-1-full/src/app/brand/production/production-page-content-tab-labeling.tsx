'use client';

import { QrCode } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { TabsContent } from '@/components/ui/tabs';
import { MarketplaceLabelStatus } from '@/components/brand/MarketplaceLabelStatus';
import { SectionInfoCard } from '@/components/brand/production/ProductionSectionEnhancements';
import { ProductionSectionHeader } from '@/app/brand/production/production-page-content-chrome';
import { cabinetSurface } from '@/lib/ui/cabinet-surface';

export function ProductionPageContentTabLabeling({ p }: { p: Record<string, unknown> }) {
  const px = p as Record<string, any>;
  const { setIsLabellingWizardOpen } = px;

  return (
<TabsContent value="labeling" className={cabinetSurface.cabinetProfileTabPanel}>
  <ProductionSectionHeader title="Маркировка" barColor="bg-teal-600" />
  <SectionInfoCard
    title="Маркировка"
    description="КИЗ, этикетки, требования маркетплейсов. Маркировка привязана к артикулам. Статусы по партиям и PO."
    icon={QrCode}
    iconBg="bg-teal-100"
    iconColor="text-teal-600"
    badges={
      <>
        <Badge variant="outline" className="text-[9px]">
          Артикулы, маркетплейсы
        </Badge>
      </>
    }
  />
  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
    <Card className="border-border-subtle rounded-xl border border-none bg-white p-4 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-100 text-teal-600">
          <QrCode className="h-6 w-6" />
        </div>
        <div>
          <p className="text-[11px] font-black uppercase">Мастер маркировки</p>
          <p className="text-text-secondary text-[9px]">Генерация КИЗ, этикеток</p>
        </div>
      </div>
      <Button
        className="mt-4 w-full"
        size="sm"
        onClick={() => setIsLabellingWizardOpen?.(true)}
      >
        <QrCode className="mr-2 h-4 w-4" /> Открыть
      </Button>
    </Card>
    <Card className="border-border-subtle rounded-xl border border-none bg-white p-4 shadow-sm">
      <MarketplaceLabelStatus />
    </Card>
  </div>
</TabsContent>
  );
}
