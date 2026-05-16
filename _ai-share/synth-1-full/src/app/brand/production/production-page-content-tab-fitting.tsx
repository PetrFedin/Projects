'use client';

import { ClipboardCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TabsContent } from '@/components/ui/tabs';
import { SectionInfoCard } from '@/components/brand/production/ProductionSectionEnhancements';
import { ProductionSectionHeader } from '@/app/brand/production/production-page-content-chrome';
import { cabinetSurface } from '@/lib/ui/cabinet-surface';

export function ProductionPageContentTabFitting({ p }: { p: Record<string, unknown> }) {
  const px = p as Record<string, any>;
  const {
    setIsFittingLogOpen,
    displaySampleStatuses,
    filteredSampleStatuses,
    STAGE_LABELS = {},
    setSelectedSkuId,
    setActiveTab,
  } = px;

  return (
<TabsContent value="fitting" className={cabinetSurface.cabinetProfileTabPanel}>
  <ProductionSectionHeader title="Примерки" barColor="bg-teal-600" />
  <SectionInfoCard
    title="Примерки (Fitting)"
    description="Журнал примерок: дата, артикул, комментарии по посадке, изменения. Связано со сэмплами. Результаты влияют на утверждение и корректировку лекал."
    icon={ClipboardCheck}
    iconBg="bg-teal-100"
    iconColor="text-teal-600"
    badges={
      <>
        <Badge variant="outline" className="text-[9px]">
          Сэмплы
        </Badge>
      </>
    }
  />
  <Card className="border-border-subtle overflow-hidden rounded-2xl border shadow-sm">
    <CardHeader className="flex flex-row justify-between">
      <CardTitle className="text-xs font-black uppercase">Журнал примерок</CardTitle>
      <Button
        size="sm"
        className="h-8 text-[9px]"
        onClick={() => setIsFittingLogOpen?.(true)}
      >
        Открыть журнал
      </Button>
    </CardHeader>
    <CardContent>
      <p className="text-text-secondary mb-4 text-[11px]">
        Примерки по артикулам Proto1, Proto2. Фиксация замеров и комментариев.
      </p>
      <div className="space-y-2">
        {(displaySampleStatuses || filteredSampleStatuses || [])
          .filter((s: any) => s.stage === 'Proto1' || s.stage === 'Proto2')
          .slice(0, 5)
          .map((s: any) => (
            <div
              key={s.skuId}
              className="bg-bg-surface2 flex items-center justify-between rounded-lg p-3"
            >
              <span className="text-[11px] font-medium">{s.skuName}</span>
              <Badge variant="outline" className="text-[8px]">
                {STAGE_LABELS[s.stage] || s.stage}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-[9px]"
                onClick={() => {
                  setSelectedSkuId?.(s.skuId);
                  setIsFittingLogOpen?.(true);
                }}
              >
                Примерка
              </Button>
            </div>
          ))}
      </div>
      <Button
        variant="outline"
        size="sm"
        className="mt-4 text-[9px]"
        onClick={() => setActiveTab?.('samples')}
      >
        К сэмплам →
      </Button>
    </CardContent>
  </Card>
</TabsContent>

  );
}
