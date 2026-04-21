'use client';

/**
 * Вне контура разработки коллекции: серийное производство, заказы и массовые объёмы.
 */
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getWorkshop2HandoffToSeriesLinks } from '@/lib/data/entity-links';
import { Truck } from 'lucide-react';

export function Workshop2SeriesOrderHandoffCard() {
  return (
    <Card
      className="border-border-subtle bg-bg-surface2/40 border"
      data-testid="workshop2-series-order-handoff"
    >
      <CardHeader className="pb-2 pt-4">
        <CardTitle className="text-text-secondary flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em]">
          <Truck className="text-text-muted size-3.5 shrink-0" aria-hidden />
          Серия, заказы и выпуск
        </CardTitle>
        <CardDescription className="text-text-muted max-w-prose text-[11px] leading-snug">
          Разработка коллекции закрывает контур ТЗ и сэмплов по шкале коллекции (слева ТЗ и согласования, справа — от
          supply-path: снабжение и выпуск в карточке артикула). После утверждений изделие в базе; опт, серию и массовые
          заказы ведите через разделы ниже — вне этого контура.
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-4 pt-0">
        <RelatedModulesBlock
          title="Связанные разделы"
          links={getWorkshop2HandoffToSeriesLinks()}
          className="border-0 bg-transparent shadow-none"
        />
      </CardContent>
    </Card>
  );
}
