'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Package, ArrowLeft, Clock, Zap } from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import { B2B_ORDERS_REGISTRY_LABEL } from '@/lib/ui/b2b-registry-label';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';
import { getB2BLinks } from '@/lib/data/entity-links';
import { SectionInfoCard } from '@/components/brand/production/ProductionSectionEnhancements';
import { RegistryPageShell } from '@/components/design-system';

/** Last Call / Flash Deals для РФ: закрытый раздел ликвидации остатков для партнёров. Таймер, лимиты, рубль. */
const MOCK_OFFERS = [
  {
    id: '1',
    name: 'Парка Graphene, остаток',
    sku: 'CTP-26-001',
    qty: 24,
    price: '2 400 ₽',
    was: '4 800 ₽',
    endsAt: '2025-03-20',
  },
  {
    id: '2',
    name: 'Свитер Merino',
    sku: 'CTP-26-002',
    qty: 12,
    price: '1 800 ₽',
    was: '3 600 ₽',
    endsAt: '2025-03-18',
  },
];

export default function LastCallPage() {
  return (
<<<<<<< HEAD
    <div className="container mx-auto max-w-5xl space-y-6 px-4 py-6 pb-24">
=======
    <RegistryPageShell className="space-y-6">
>>>>>>> recover/cabinet-wip-from-stash
      <SectionInfoCard
        title="Last Call / Flash Deals"
        description="Закрытый раздел ликвидации остатков для партнёров. Ограниченные по времени офферы в рублях. Доступ только для одобренных ритейлеров."
        icon={Zap}
        iconBg="bg-amber-100"
        iconColor="text-amber-600"
        badges={
          <>
            <Button variant="outline" size="sm" className="h-7 text-[9px]" asChild>
              <Link href={ROUTES.brand.retailers}>Партнёры</Link>
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-[9px]" asChild>
<<<<<<< HEAD
              <Link href={ROUTES.brand.b2bOrders}>B2B Заказы</Link>
=======
              <Link href={ROUTES.brand.b2bOrders}>{B2B_ORDERS_REGISTRY_LABEL}</Link>
>>>>>>> recover/cabinet-wip-from-stash
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-[9px]" asChild>
              <Link href={ROUTES.brand.creditRisk}>Credit Risk</Link>
            </Button>
          </>
        }
      />
      <div className="flex items-center gap-3">
        <Link href={ROUTES.brand.retailers}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="flex items-center gap-2 text-2xl font-bold uppercase tracking-tight">
          <Package className="h-6 w-6" /> Last Call
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Текущие офферы</CardTitle>
          <CardDescription>Ликвидация остатков. Цены в ₽. Срок действия ограничен.</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {MOCK_OFFERS.map((o) => (
              <li
                key={o.id}
<<<<<<< HEAD
                className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-4"
              >
                <div>
                  <p className="font-medium">{o.name}</p>
                  <p className="text-xs text-slate-500">
=======
                className="bg-bg-surface2 border-border-subtle flex items-center justify-between rounded-xl border p-4"
              >
                <div>
                  <p className="font-medium">{o.name}</p>
                  <p className="text-text-secondary text-xs">
>>>>>>> recover/cabinet-wip-from-stash
                    {o.sku} · остаток {o.qty} шт.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-text-muted text-sm line-through">{o.was}</span>
                  <span className="font-semibold text-amber-600">{o.price}</span>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Clock className="h-3 w-3" /> до {o.endsAt}
                  </Badge>
                  <Button size="sm">В заказ</Button>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <RelatedModulesBlock links={getB2BLinks()} title="Партнёры, заказы, финансы, Credit Risk" />
    </RegistryPageShell>
  );
}
