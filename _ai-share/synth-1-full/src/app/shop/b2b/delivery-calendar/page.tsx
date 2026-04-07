'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, ArrowLeft, Truck } from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import { joorGetDeliveryWindows } from '@/lib/b2b/integrations';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';
import { getShopB2BHubLinks } from '@/lib/data/entity-links';

export default function B2BDeliveryCalendarPage() {
  const windows = joorGetDeliveryWindows();

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
            <Calendar className="h-6 w-6" /> Календарь поставок
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Окна доставки (drop dates) по коллекциям. JOOR/NuOrder: Start Ship Date — Complete Ship Date.
          </p>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-sm font-black uppercase flex items-center gap-2">
            <Truck className="h-4 w-4" /> Окна доставки
          </CardTitle>
          <CardDescription>Выберите дроп при создании заказа. Дедлайн отмены — до cancel date.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {windows.map((w) => (
            <div
              key={w.id}
              className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl border border-slate-100 bg-slate-50/50"
            >
              <div>
                <p className="font-bold text-slate-900">{w.label}</p>
                <p className="text-xs text-slate-500">
                  Отгрузка: {w.startShipDate} — {w.completeShipDate}
                  {w.cancelDate && ` · Отмена до ${w.cancelDate}`}
                </p>
              </div>
              <Button variant="outline" size="sm" className="rounded-lg text-[10px] font-black uppercase" asChild>
                <Link href={ROUTES.shop.b2bCreateOrder + `?drop=${encodeURIComponent(w.id)}`}>Заказать в дроп</Link>
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <RelatedModulesBlock
        title="Связанные разделы"
        links={getShopB2BHubLinks().filter((l) =>
          [ROUTES.shop.b2bCreateOrder, ROUTES.shop.b2bCollectionTerms].includes(l.href as string)
        )}
      />
    </div>
  );
}
