'use client';

import { CabinetPageContent } from '@/components/layout/cabinet-page-content';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Truck } from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import { ShopB2bContentHeader } from '@/components/shop/ShopB2bContentHeader';
import { joorGetDeliveryWindows } from '@/lib/b2b/integrations';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';
import { getShopB2BHubLinks } from '@/lib/data/entity-links';
import { ShopAnalyticsSegmentErpStrip } from '@/components/shop/ShopAnalyticsSegmentErpStrip';
import { B2bMarginAnalysisHubButton } from '@/components/shop/B2bMarginAnalysisHubButton';

export default function B2BDeliveryCalendarPage() {
  const windows = joorGetDeliveryWindows();

  return (
    <CabinetPageContent maxWidth="4xl" className="space-y-6">
      <ShopB2bContentHeader lead="Окна доставки (drop dates) по коллекциям: Start Ship Date — Complete Ship Date (JOOR / NuOrder)." />
      <ShopAnalyticsSegmentErpStrip />

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
              className="border-border-subtle bg-bg-surface2/80 flex flex-wrap items-center justify-between gap-3 rounded-xl border p-4"
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
    </CabinetPageContent>
  );
}
