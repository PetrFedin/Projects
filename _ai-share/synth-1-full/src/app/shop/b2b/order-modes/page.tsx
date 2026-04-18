'use client';

import { RegistryPageShell } from '@/components/design-system';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Package, Calendar } from 'lucide-react';
import Link from 'next/link';
import { ROUTES } from '@/lib/routes';
import { ShopB2bContentHeader } from '@/components/shop/ShopB2bContentHeader';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';
import { getShopB2BHubLinks } from '@/lib/data/entity-links';
import { tid } from '@/lib/ui/test-ids';

const modes = [
  {
    id: 'buy-now',
    title: 'Buy Now',
    desc: 'Мгновенная отгрузка со склада',
    icon: Package,
<<<<<<< HEAD
    href: '/shop/b2b/orders?mode=buy-now',
=======
    href: `${ROUTES.shop.b2bOrders}?mode=buy-now`,
>>>>>>> recover/cabinet-wip-from-stash
  },
  {
    id: 'reorder',
    title: 'Reorder',
    desc: 'Повтор прошлого заказа по одному клику',
    icon: ShoppingCart,
<<<<<<< HEAD
    href: '/shop/b2b/orders?mode=reorder',
=======
    href: `${ROUTES.shop.b2bOrders}?mode=reorder`,
>>>>>>> recover/cabinet-wip-from-stash
  },
  {
    id: 'pre-order',
    title: 'Pre-order',
    desc: 'Предзаказ коллекции к дате дропа',
    icon: Calendar,
<<<<<<< HEAD
    href: '/shop/b2b/orders?mode=pre-order',
=======
    href: `${ROUTES.shop.b2bOrders}?mode=pre-order`,
>>>>>>> recover/cabinet-wip-from-stash
  },
];

export default function OrderModesPage() {
  return (
<<<<<<< HEAD
    <div className="container max-w-4xl space-y-6 py-6">
      <div className="flex items-center gap-3">
        <Link href="/shop/b2b">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Режимы заказа</h1>
          <p className="text-sm text-slate-500">
            Buy Now / Reorder / Pre-order в одном потоке (NuOrder style)
          </p>
        </div>
      </div>
=======
    <RegistryPageShell
      className="min-h-[200px] max-w-4xl space-y-6"
      data-testid={tid.page('shop-b2b-order-modes')}
    >
      <ShopB2bContentHeader lead="Buy Now, Reorder и Pre-order в одном потоке оформления (NuOrder style)." />
>>>>>>> recover/cabinet-wip-from-stash

      <Card className="border-accent-primary/20">
        <CardHeader>
          <CardTitle>Выберите режим закупки</CardTitle>
          <CardDescription>
            В корзине и при создании заказа можно переключать режим — отгрузка, повтор или
            предзаказ.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {modes.map((mode) => {
            const Icon = mode.icon;
            return (
              <Link key={mode.id} href={mode.href}>
<<<<<<< HEAD
                <Card className="h-full cursor-pointer border-slate-100 transition-colors hover:border-indigo-200 hover:bg-indigo-50/30">
                  <CardContent className="pt-6">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100">
                      <Icon className="h-6 w-6 text-indigo-600" />
                    </div>
                    <h3 className="font-semibold">{mode.title}</h3>
                    <p className="mt-1 text-sm text-slate-500">{mode.desc}</p>
=======
                <Card className="border-border-subtle hover:border-accent-primary/30 hover:bg-accent-primary/10 h-full cursor-pointer transition-colors">
                  <CardContent className="pt-6">
                    <div className="bg-accent-primary/15 mb-3 flex size-12 items-center justify-center rounded-xl">
                      <Icon className="text-accent-primary size-6" />
                    </div>
                    <h3 className="font-semibold">{mode.title}</h3>
                    <p className="text-text-secondary mt-1 text-sm">{mode.desc}</p>
>>>>>>> recover/cabinet-wip-from-stash
                    <Badge variant="outline" className="mt-3">
                      Перейти
                    </Badge>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </CardContent>
      </Card>

      <RelatedModulesBlock
        title="Связанные разделы"
        className="mt-2"
        links={getShopB2BHubLinks().filter(
          (l) =>
            l.href === ROUTES.shop.b2bOrderMode ||
            l.href === ROUTES.shop.b2bMatrix ||
            l.href === ROUTES.shop.b2bOrders
        )}
      />
    </RegistryPageShell>
  );
}
