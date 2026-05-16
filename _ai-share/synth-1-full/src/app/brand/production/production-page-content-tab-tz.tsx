'use client';

import { FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TabsContent } from '@/components/ui/tabs';
import { SectionInfoCard } from '@/components/brand/production/ProductionSectionEnhancements';
import { ProductionSectionHeader } from '@/app/brand/production/production-page-content-chrome';
import { cabinetSurface } from '@/lib/ui/cabinet-surface';

export function ProductionPageContentTabTz({ p }: { p: Record<string, unknown> }) {
  const px = p as Record<string, any>;
  const { productionDocuments, selectedId, setActiveTab } = px;

  return (
<TabsContent value="tz" className={cabinetSurface.cabinetProfileTabPanel}>
  <ProductionSectionHeader title="ТЗ на коллекцию" barColor="bg-text-primary/75" />
  <SectionInfoCard
    title="ТЗ (Техническое задание)"
    description="Техническое задание и бриф на коллекцию. Описание концепции, целевая аудитория, ограничения по материалам и срокам. Связано с коллекцией и документами."
    icon={FileText}
    iconBg="bg-bg-surface2"
    iconColor="text-text-secondary"
    badges={
      <>
        <Badge variant="outline" className="text-[9px]">
          Коллекция
        </Badge>
        <Badge variant="outline" className="text-[9px]">
          Документы
        </Badge>
      </>
    }
  />
  <Card className="border-border-subtle overflow-hidden rounded-2xl border shadow-sm">
    <CardHeader>
      <CardTitle className="text-xs font-black uppercase">ТЗ по коллекциям</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-2">
        {(productionDocuments || [])
          .filter((d: any) => d.type === 'tz')
          .filter((d: any) => !selectedId || d.collection === selectedId)
          .map((d: any, i: number) => (
            <div
              key={i}
              className="bg-bg-surface2 flex items-center justify-between rounded-lg p-3"
            >
              <span className="text-[11px] font-medium">{d.name}</span>
              <Badge variant="outline" className="text-[8px]">
                {d.collection} · {d.status}
              </Badge>
            </div>
          ))}
        {(!productionDocuments ||
          !productionDocuments.some((d: any) => d.type === 'tz')) && (
          <p className="text-text-muted py-4 text-[10px]">
            Нет ТЗ. Добавьте в раздел Документы.
          </p>
        )}
      </div>
      <Button
        variant="outline"
        size="sm"
        className="mt-4 text-[9px]"
        onClick={() => setActiveTab?.('documents')}
      >
        Документы →
      </Button>
    </CardContent>
  </Card>
</TabsContent>

  );
}
