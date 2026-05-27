'use client';

import { Calendar, GanttChart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TabsContent } from '@/components/ui/tabs';
import Link from 'next/link';
import { ProductionGantt } from '@/components/brand/ProductionGantt';
import { SectionInfoCard } from '@/components/brand/production/ProductionSectionEnhancements';
import { ProductionSectionHeader } from '@/app/brand/production/production-page-content-chrome';
import { cabinetSurface } from '@/lib/ui/cabinet-surface';
import { ROUTES } from '@/lib/routes';

export function ProductionPageContentTabMps({ p }: { p: Record<string, unknown> }) {
  const px = p as Record<string, any>;
  const { selectedCollectionIds, setActiveTab } = px;

  return (
    <TabsContent value="mps" className={cabinetSurface.cabinetProfileTabPanel}>
      <ProductionSectionHeader title="План производства (MPS)" barColor="bg-accent-primary" />
      <SectionInfoCard
        title="MPS (Master Production Schedule)"
        description="Календарный план запусков: квартал, месяц, неделя. Связь с прогнозом спроса и заказами. Определяет загрузку фабрик и сроки поставок."
        icon={GanttChart}
        iconBg="bg-accent-primary/15"
        iconColor="text-accent-primary"
        badges={
          <>
            <Badge variant="outline" className="text-[9px]">
              Прогноз →
            </Badge>
            <Badge variant="outline" className="text-[9px]">
              PO, Цех
            </Badge>
            <Button variant="outline" size="sm" className="h-7 text-[9px]" asChild>
              <Link href={`${ROUTES.brand.calendar}?layers=production,orders`}>
                <Calendar className="mr-1 h-3 w-3" /> Strategic Planner
              </Link>
            </Button>
          </>
        }
      />
      <ProductionGantt
        selectedCollectionIds={selectedCollectionIds || []}
        onPeriodChange={() => {}}
        onNavigate={(tab) =>
          setActiveTab?.(
            tab === 'sample'
              ? 'samples'
              : tab === 'po'
                ? 'orders'
                : tab === 'execution'
                  ? 'execution'
                  : tab
          )
        }
      />
    </TabsContent>
  );
}
