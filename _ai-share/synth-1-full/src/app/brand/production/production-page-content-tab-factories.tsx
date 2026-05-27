'use client';

import { Factory } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { TabsContent } from '@/components/ui/tabs';
import {
  FactoryLoadOverview,
  FactoryRatingCard,
} from '@/components/brand/production/ProductionEnhancementsHub';
import { SectionInfoCard } from '@/components/brand/production/ProductionSectionEnhancements';
import { ProductionSectionHeader } from '@/app/brand/production/production-page-content-chrome';
import { cabinetSurface } from '@/lib/ui/cabinet-surface';

export function ProductionPageContentTabFactories(_props: { p: Record<string, unknown> }) {
  return (
    <TabsContent value="factories" className={cabinetSurface.cabinetProfileTabPanel}>
      <ProductionSectionHeader title="Фабрики" barColor="bg-accent-primary" />
      <SectionInfoCard
        title="Фабрики"
        description="Реестр фабрик: контакты, мощность, специализация. KPI: качество, сроки, коммуникация. История PO, калькулятор себестоимости по фабрике."
        icon={Factory}
        iconBg="bg-accent-primary/15"
        iconColor="text-accent-primary"
        badges={
          <>
            <Badge variant="outline" className="text-[9px]">
              PO, сэмплы
            </Badge>
          </>
        }
      />
      <Card className="border-border-subtle overflow-hidden rounded-2xl border shadow-sm">
        <div className="from-accent-primary h-1 w-full bg-gradient-to-r to-blue-500" />
        <CardContent className="p-5">
          <FactoryLoadOverview />
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[
          {
            name: 'Global Textiles',
            type: 'Пошив',
            status: 'Active',
            qty: '3 PO',
            rating: 4.8,
            quality: 98,
            delivery: 95,
            contact: 'manager@globaltextiles.com',
          },
          {
            name: 'Smart Tailor Lab',
            type: 'CMT',
            status: 'Active',
            qty: '2 PO',
            rating: 4.5,
            quality: 92,
            delivery: 88,
            contact: 'orders@smarttailor.ru',
          },
          {
            name: 'YKK Russia',
            type: 'Фурнитура',
            status: 'Partner',
            qty: '—',
            rating: 4.9,
            contact: 'sales@ykk.ru',
          },
        ].map((f, i) => (
          <Card
            key={i}
            className="border-border-subtle overflow-hidden rounded-2xl border shadow-sm transition-all hover:shadow-md"
          >
            <div className="bg-bg-surface2 h-0.5 w-full" />
            <CardContent className="p-5">
              <FactoryRatingCard
                name={f.name}
                rating={f.rating}
                quality={f.quality}
                delivery={f.delivery}
                contact={f.contact}
              />
            </CardContent>
          </Card>
        ))}
      </div>
    </TabsContent>
  );
}
