'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Package, Truck, CreditCard, Layers } from 'lucide-react';
import { SectionInfoCard } from '@/components/brand/production/ProductionSectionEnhancements';
import { getProductionLinks } from '@/lib/data/entity-links';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';
import { AcronymWithTooltip } from '@/components/ui/acronym-with-tooltip';
import { ROUTES } from '@/lib/routes';
import { RegistryPageShell } from '@/components/design-system';

export default function ReadyMadeProductionPage() {
  return (
    <RegistryPageShell className="max-w-5xl space-y-6 pb-16">
      <SectionInfoCard
        title="Готовый товар — упрощённый flow"
        description={
          <>
            Товар уже произведён в другой стране. Минуем: сэмплы, <AcronymWithTooltip abbr="PO" />,
            производство. Только: заведение коллекции, информация о товарах, настройка логистики и
            оплат.
          </>
        }
        icon={Package}
        iconBg="bg-amber-100"
        iconColor="text-amber-600"
        badges={
          <>
            <Badge variant="outline" className="text-[9px]">
              Готовый товар
            </Badge>
            <Button variant="outline" size="sm" className="h-7 text-[9px]" asChild>
              <Link href={ROUTES.brand.production}>Производство</Link>
            </Button>
          </>
        }
      />
      <h1 className="text-2xl font-bold uppercase">Готовый товар</h1>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="rounded-xl border border-amber-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layers className="h-5 w-5" /> 1. Коллекция и артикулы
            </CardTitle>
            <CardDescription>
              Создайте коллекцию и добавьте информацию о товарах (<AcronymWithTooltip abbr="SKU" />
              -карточки)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" size="sm" asChild>
              <Link href={ROUTES.brand.productsCreateReady}>Создать карточки</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border-subtle rounded-xl border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5" /> 2. Логистика
            </CardTitle>
            <CardDescription>Настройте доставку, склады, таможню</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" size="sm" asChild>
              <Link href={ROUTES.brand.warehouse}>Склад</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border-subtle rounded-xl border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" /> 3. Оплаты и цены
            </CardTitle>
            <CardDescription>Настройте цены, условия оплаты</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" size="sm" asChild>
              <Link href={ROUTES.brand.finance}>Финансы</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border-subtle rounded-xl border">
        <CardHeader>
          <CardTitle>Чеклист</CardTitle>
          <CardDescription>Шаги при добавлении уже произведённого товара</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <Package className="h-4 w-4 text-emerald-500" /> Заведение коллекции (без{' '}
              <AcronymWithTooltip abbr="PO" /> и сэмплов)
            </li>
            <li className="flex items-center gap-2">
              <Package className="h-4 w-4 text-emerald-500" /> Создание карточек товаров
            </li>
            <li className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-emerald-500" /> Настройка логистики (склады, доставка)
            </li>
            <li className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-emerald-500" /> Цены и условия оплаты
            </li>
          </ul>
        </CardContent>
      </Card>

      <RelatedModulesBlock links={getProductionLinks()} />
    </RegistryPageShell>
  );
}
