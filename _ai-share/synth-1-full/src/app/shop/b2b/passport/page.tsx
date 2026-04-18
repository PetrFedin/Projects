'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Package, Layers } from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import { ShopB2bContentHeader } from '@/components/shop/ShopB2bContentHeader';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';
import { getShopB2BHubLinks } from '@/lib/data/entity-links';
import { RegistryPageShell } from '@/components/design-system';

/** JOOR Passport для байера: портал выставки — участники, каталог события, заказы с выставки. */
const MOCK_EVENT = { name: 'FW26 Syntha', date: '15–20 марта 2026' };

export default function ShopB2BPassportPage() {
  return (
    <RegistryPageShell className="max-w-3xl space-y-6">
      <ShopB2bContentHeader lead="Единый портал события: нетворкинг, каталог, заказы с выставки (JOOR Passport)." />

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{MOCK_EVENT.name}</CardTitle>
          <CardDescription>{MOCK_EVENT.date}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-3">
          <div className="border-border-default rounded-xl border p-4">
            <Users className="text-text-secondary mb-2 h-8 w-8" />
            <p className="font-medium">Участники</p>
            <p className="text-text-secondary text-xs">Контакты бренда и байеров</p>
          </div>
          <Link
            href={`${ROUTES.shop.b2bCreateOrder}?eventId=fw26`}
            className="border-border-default hover:border-accent-primary/30 hover:bg-accent-primary/10 block rounded-xl border p-4 transition-colors"
          >
            <Layers className="text-accent-primary mb-2 h-8 w-8" />
            <p className="font-medium">Создать заказ с выставки</p>
            <p className="text-text-secondary text-xs">
              Написание заказа → привязка к событию FW26
            </p>
          </Link>
          <Link
            href={ROUTES.shop.b2bOrders}
            className="border-border-default hover:border-accent-primary/30 hover:bg-accent-primary/10 block rounded-xl border p-4 transition-colors"
          >
            <Package className="text-accent-primary mb-2 h-8 w-8" />
            <p className="font-medium">Мои заказы</p>
            <p className="text-text-secondary text-xs">В т.ч. заказы с этого события</p>
          </Link>
        </CardContent>
      </Card>

      <RelatedModulesBlock links={getShopB2BHubLinks()} title="Выставки, заказы, матрица" />
    </RegistryPageShell>
  );
}
