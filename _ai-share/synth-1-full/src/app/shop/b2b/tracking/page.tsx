'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Truck, ArrowLeft } from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import { mockB2BOrders } from '@/lib/order-data';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';
import { getShopB2BHubLinks } from '@/lib/data/entity-links';

export default function B2BTrackingPage() {
  const ordersWithTracking = mockB2BOrders.filter((o) => o.status !== 'Черновик').slice(0, 8);

  return (
    <div className="container max-w-4xl mx-auto px-4 py-6 pb-24">
      <div className="flex items-center gap-3 mb-6">
        <Link href={ROUTES.shop.b2b}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-tight flex items-center gap-2">
            <Truck className="h-6 w-6" /> Трекинг заказов
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Сквозной мониторинг отгрузок. JOOR ASN, статусы доставки и ссылки на трекинг перевозчика.
          </p>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-sm font-black uppercase">Заказы с отгрузкой</CardTitle>
          <CardDescription>Откройте заказ для деталей отгрузки и трекинга.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {ordersWithTracking.length === 0 ? (
            <p className="text-slate-500 text-sm">Нет заказов с отгрузкой. После отгрузки здесь появится трекинг.</p>
          ) : (
            ordersWithTracking.map((o) => (
              <div
                key={o.order}
                className="flex items-center justify-between gap-3 p-4 rounded-xl border border-slate-100 bg-slate-50/50"
              >
                <div>
                  <p className="font-bold text-slate-900">{o.order}</p>
                  <p className="text-xs text-slate-500">{o.brand} · {o.shop} · {o.deliveryDate}</p>
                </div>
                <Button variant="outline" size="sm" className="rounded-lg text-[10px] font-black uppercase" asChild>
                  <Link href={`${ROUTES.shop.b2bOrders}/${o.order}`}>Детали и трекинг</Link>
                </Button>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <RelatedModulesBlock
        title="Связанные разделы"
        links={getShopB2BHubLinks().filter((l) =>
          [ROUTES.shop.b2bOrders, ROUTES.shop.b2bDeliveryCalendar].includes(l.href as string)
        )}
      />
    </div>
  );
}
