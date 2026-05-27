'use client';

import { BarChart3 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TabsContent } from '@/components/ui/tabs';
import { SectionInfoCard } from '@/components/brand/production/ProductionSectionEnhancements';
import { ProductionSectionHeader } from '@/app/brand/production/production-page-content-chrome';
import { cabinetSurface } from '@/lib/ui/cabinet-surface';

export function ProductionPageContentTabDemand({ p }: { p: Record<string, unknown> }) {
  const px = p as Record<string, any>;
  const {
    filteredCollections,
    collections,
    filteredSkus,
    toggleCollectionSelection,
    setActiveTab,
  } = px;

  return (
    <TabsContent value="demand" className={cabinetSurface.cabinetProfileTabPanel}>
      <ProductionSectionHeader title="Прогноз спроса" barColor="bg-accent-primary" />
      <SectionInfoCard
        title="Прогноз спроса"
        description="План объёмов по артикулам и коллекциям. Прогнозирование на основе истории продаж и планов байеров. Связь с планом производства (MPS) и заказами."
        icon={BarChart3}
        iconBg="bg-accent-primary/15"
        iconColor="text-accent-primary"
        badges={
          <>
            <Badge variant="outline" className="text-[9px]">
              Артикулы, коллекции
            </Badge>
            <Badge variant="outline" className="text-[9px]">
              MPS →
            </Badge>
          </>
        }
      />
      <Card className="border-border-subtle overflow-hidden rounded-2xl border shadow-sm">
        <CardHeader>
          <CardTitle className="text-xs font-black uppercase">Прогноз по коллекциям</CardTitle>
          <CardDescription className="text-[10px]">
            План объёмов для выбранных коллекций
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {(filteredCollections ?? collections ?? [])
              .filter((c: any) => c.id !== 'ARCHIVE')
              .slice(0, 5)
              .map((c: any) => {
                const skuCount = (filteredSkus || []).filter(
                  (s: any) => s.collection === c.id
                ).length;
                return (
                  <div
                    key={c.id}
                    className="bg-bg-surface2 border-border-subtle flex items-center justify-between rounded-xl border p-3"
                  >
                    <span className="text-[11px] font-bold">{c.name}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-text-secondary text-[10px]">{skuCount} артикулов</span>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-[9px]"
                        onClick={() => {
                          toggleCollectionSelection?.(c.id);
                          setActiveTab?.('mps');
                        }}
                      >
                        План →
                      </Button>
                    </div>
                  </div>
                );
              })}
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
