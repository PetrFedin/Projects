'use client';

import { Wallet } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TabsContent } from '@/components/ui/tabs';
import { SectionInfoCard } from '@/components/brand/production/ProductionSectionEnhancements';
import { ProductionSectionHeader } from '@/app/brand/production/production-page-content-chrome';
import { ProductionPageContentTabBudgetCards } from '@/app/brand/production/production-page-content-tab-budget-cards';
import { cabinetSurface } from '@/lib/ui/cabinet-surface';

type CnFn = (...args: (string | boolean | undefined | null)[]) => string;

export function ProductionPageContentTabBudget({
  p,
  cn: _cn,
}: {
  p: Record<string, unknown>;
  cn: CnFn;
}) {
  const px = p as Record<string, any>;
  const { setActiveTab } = px;

  return (
    <TabsContent value="budget" className={cabinetSurface.cabinetProfileTabPanel}>
      <ProductionSectionHeader title="Бюджет" barColor="bg-rose-600" />
      <SectionInfoCard
        title="Что такое бюджет коллекции"
        description="Бюджет задаётся при создании коллекции (Костинг → Бюджет) и разбивается на статьи: Материалы, Пошив, Логистика. Факт заполняется автоматически по PO, приёмкам, накладным. Остаток влияет на алерты при перерасходе и показывает, сколько можно ещё потратить."
        icon={Wallet}
        iconBg="bg-rose-100"
        iconColor="text-rose-600"
        badges={
          <>
            <Badge variant="outline" className="text-[9px]">
              Источник: создание коллекции
            </Badge>
            <Badge variant="outline" className="text-[9px]">
              Влияет: алерты, дашборд
            </Badge>
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-[9px]"
              onClick={() => setActiveTab?.('costing')}
            >
              Редактировать план → Костинг
            </Button>
          </>
        }
      />
      <ProductionPageContentTabBudgetCards p={p} />
    </TabsContent>
  );
}
