'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Package, Calendar, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const modes = [
  {
    id: 'buy-now',
    title: 'Buy Now',
    desc: 'Мгновенная отгрузка со склада',
    icon: Package,
    href: '/shop/b2b/orders?mode=buy-now',
  },
  {
    id: 'reorder',
    title: 'Reorder',
    desc: 'Повтор прошлого заказа по одному клику',
    icon: ShoppingCart,
    href: '/shop/b2b/orders?mode=reorder',
  },
  {
    id: 'pre-order',
    title: 'Pre-order',
    desc: 'Предзаказ коллекции к дате дропа',
    icon: Calendar,
    href: '/shop/b2b/orders?mode=pre-order',
  },
];

export default function OrderModesPage() {
  return (
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

      <Card className="border-indigo-100">
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
                <Card className="h-full cursor-pointer border-slate-100 transition-colors hover:border-indigo-200 hover:bg-indigo-50/30">
                  <CardContent className="pt-6">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100">
                      <Icon className="h-6 w-6 text-indigo-600" />
                    </div>
                    <h3 className="font-semibold">{mode.title}</h3>
                    <p className="mt-1 text-sm text-slate-500">{mode.desc}</p>
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
    </div>
  );
}
