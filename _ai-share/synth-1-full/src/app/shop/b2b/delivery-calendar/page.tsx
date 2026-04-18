'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Truck } from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import { ShopB2bContentHeader } from '@/components/shop/ShopB2bContentHeader';
import { joorGetDeliveryWindows } from '@/lib/b2b/integrations';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';
import { getShopB2BHubLinks } from '@/lib/data/entity-links';
import { RegistryPageShell } from '@/components/design-system';
import { ShopAnalyticsSegmentErpStrip } from '@/components/shop/ShopAnalyticsSegmentErpStrip';
import { B2bMarginAnalysisHubButton } from '@/components/shop/B2bMarginAnalysisHubButton';

export default function B2BDeliveryCalendarPage() {
  const windows = joorGetDeliveryWindows();

  return (
<<<<<<< HEAD
    <div className="container mx-auto max-w-4xl px-4 py-6 pb-24">
      <div className="mb-6 flex items-center gap-3">
        <Link href={ROUTES.shop.b2b}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold uppercase tracking-tight">
            <Calendar className="h-6 w-6" /> Календарь поставок
          </h1>
          <p className="mt-0.5 text-sm text-slate-500">
            Окна доставки (drop dates) по коллекциям. JOOR/NuOrder: Start Ship Date — Complete Ship
            Date.
          </p>
        </div>
      </div>
=======
    <RegistryPageShell className="max-w-4xl space-y-6">
      <ShopB2bContentHeader lead="Окна доставки (drop dates) по коллекциям: Start Ship Date — Complete Ship Date (JOOR / NuOrder)." />
      <ShopAnalyticsSegmentErpStrip />
>>>>>>> recover/cabinet-wip-from-stash

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm font-black uppercase">
            <Truck className="h-4 w-4" /> Окна доставки
          </CardTitle>
          <CardDescription>
            Выберите дроп при создании заказа. Дедлайн отмены — до cancel date.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {windows.map((w) => (
            <div
              key={w.id}
<<<<<<< HEAD
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-4"
=======
              className="border-border-subtle bg-bg-surface2/80 flex flex-wrap items-center justify-between gap-3 rounded-xl border p-4"
>>>>>>> recover/cabinet-wip-from-stash
            >
              <div>
                <p className="text-text-primary font-bold">{w.label}</p>
                <p className="text-text-secondary text-xs">
                  Отгрузка: {w.startShipDate} — {w.completeShipDate}
                  {w.cancelDate && ` · Отмена до ${w.cancelDate}`}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="rounded-lg text-[10px] font-black uppercase"
                asChild
              >
                <Link href={ROUTES.shop.b2bCreateOrder + `?drop=${encodeURIComponent(w.id)}`}>
                  Заказать в дроп
                </Link>
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="border-border-subtle flex flex-wrap items-center gap-2 border-t pt-4">
        <span className="text-text-muted text-[10px] font-black uppercase tracking-widest">
          См. также
        </span>
        <Button variant="outline" size="sm" className="text-xs font-black uppercase" asChild>
          <Link href={ROUTES.shop.analytics} data-testid="shop-b2b-delivery-calendar-retail-link">
            Розничная аналитика
          </Link>
        </Button>
        <Button variant="outline" size="sm" className="text-xs font-black uppercase" asChild>
          <Link
            href={ROUTES.shop.analyticsFootfall}
            data-testid="shop-b2b-delivery-calendar-footfall-link"
          >
            Трафик по зонам
          </Link>
        </Button>
        <B2bMarginAnalysisHubButton />
      </div>

      <RelatedModulesBlock
        title="Связанные разделы"
        links={getShopB2BHubLinks().filter((l) =>
          [ROUTES.shop.b2bCreateOrder, ROUTES.shop.b2bCollectionTerms].includes(l.href as string)
        )}
      />
    </RegistryPageShell>
  );
}
