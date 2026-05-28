'use client';

import { Package } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TabsContent } from '@/components/ui/tabs';
import { SectionInfoCard } from '@/components/brand/production/ProductionSectionEnhancements';
import { ProductionSectionHeader } from '@/app/brand/production/production-page-content-chrome';
import { cabinetSurface } from '@/lib/ui/cabinet-surface';

export function ProductionPageContentTabWarehouse({ p }: { p: Record<string, unknown> }) {
  const px = p as Record<string, any>;
  const { filteredMaterials, setActiveTab } = px;

  return (
    <TabsContent value="warehouse" className={cabinetSurface.cabinetProfileTabPanel}>
      <ProductionSectionHeader title="Склад" barColor="bg-blue-600" />
      <SectionInfoCard
        title="Склад (WMS)"
        description="Остатки материалов и готовых изделий. Приёмки по PO, отгрузки. Связь с логистикой и снабжением. Интеграция с приёмкой (GRN)."
        icon={Package}
        iconBg="bg-blue-100"
        iconColor="text-blue-600"
        badges={
          <>
            <Badge variant="outline" className="text-[9px]">
              Логистика
            </Badge>
            <Badge variant="outline" className="text-[9px]">
              Приёмка
            </Badge>
          </>
        }
      />
      <Card className="border-border-subtle overflow-hidden rounded-2xl border shadow-sm">
        <CardHeader>
          <CardTitle className="text-xs font-black uppercase">Остатки по коллекциям</CardTitle>
          <CardDescription className="text-[10px]">Материалы и готовые изделия</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {(filteredMaterials || []).slice(0, 5).map((m: any, i: number) => (
              <div
                key={i}
                className="bg-bg-surface2 flex items-center justify-between rounded-lg p-3"
              >
                <span className="text-[11px] font-medium">{m.name}</span>
                <span className="text-text-secondary text-[10px]">
                  {m.length} · {m.status}
                </span>
              </div>
            ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            className="mt-4 text-[9px]"
            onClick={() => setActiveTab?.('materials')}
          >
            Снабжение →
          </Button>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
