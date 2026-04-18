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
<<<<<<< HEAD
    <div className="container mx-auto max-w-3xl px-4 py-6 pb-24">
      <div className="mb-6 flex items-center gap-3">
        <Link href={ROUTES.shop.b2b}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold uppercase tracking-tight">
            <FileText className="h-6 w-6" /> Passport выставки
          </h1>
          <p className="mt-0.5 text-sm text-slate-500">
            Единый портал события: нетворкинг, каталог, заказы с выставки.
          </p>
        </div>
      </div>
=======
    <RegistryPageShell className="max-w-3xl space-y-6">
      <ShopB2bContentHeader lead="Единый портал события: нетворкинг, каталог, заказы с выставки (JOOR Passport)." />
>>>>>>> recover/cabinet-wip-from-stash

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{MOCK_EVENT.name}</CardTitle>
          <CardDescription>{MOCK_EVENT.date}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-3">
<<<<<<< HEAD
          <div className="rounded-xl border border-slate-200 p-4">
            <Users className="mb-2 h-8 w-8 text-slate-500" />
=======
          <div className="border-border-default rounded-xl border p-4">
            <Users className="text-text-secondary mb-2 h-8 w-8" />
>>>>>>> recover/cabinet-wip-from-stash
            <p className="font-medium">Участники</p>
            <p className="text-text-secondary text-xs">Контакты бренда и байеров</p>
          </div>
          <Link
            href={`${ROUTES.shop.b2bCreateOrder}?eventId=fw26`}
<<<<<<< HEAD
            className="block rounded-xl border border-slate-200 p-4 transition-colors hover:border-indigo-300 hover:bg-indigo-50/50"
          >
            <Layers className="mb-2 h-8 w-8 text-indigo-600" />
=======
            className="border-border-default hover:border-accent-primary/30 hover:bg-accent-primary/10 block rounded-xl border p-4 transition-colors"
          >
            <Layers className="text-accent-primary mb-2 h-8 w-8" />
>>>>>>> recover/cabinet-wip-from-stash
            <p className="font-medium">Создать заказ с выставки</p>
            <p className="text-text-secondary text-xs">
              Написание заказа → привязка к событию FW26
            </p>
          </Link>
          <Link
            href={ROUTES.shop.b2bOrders}
<<<<<<< HEAD
            className="block rounded-xl border border-slate-200 p-4 transition-colors hover:border-indigo-300 hover:bg-indigo-50/50"
          >
            <Package className="mb-2 h-8 w-8 text-indigo-600" />
=======
            className="border-border-default hover:border-accent-primary/30 hover:bg-accent-primary/10 block rounded-xl border p-4 transition-colors"
          >
            <Package className="text-accent-primary mb-2 h-8 w-8" />
>>>>>>> recover/cabinet-wip-from-stash
            <p className="font-medium">Мои заказы</p>
            <p className="text-text-secondary text-xs">В т.ч. заказы с этого события</p>
          </Link>
        </CardContent>
      </Card>

      <RelatedModulesBlock links={getShopB2BHubLinks()} title="Выставки, заказы, матрица" />
    </RegistryPageShell>
  );
}
