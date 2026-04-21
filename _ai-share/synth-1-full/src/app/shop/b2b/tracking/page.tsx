'use client';

import { CabinetPageContent } from '@/components/layout/cabinet-page-content';
import { tid } from '@/lib/ui/test-ids';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/lib/routes';
import { ShopB2bContentHeader } from '@/components/shop/ShopB2bContentHeader';
import { mockB2BOrders } from '@/lib/order-data';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';
import { getShopB2BHubLinks } from '@/lib/data/entity-links';
import { ShopAnalyticsSegmentErpStrip } from '@/components/shop/ShopAnalyticsSegmentErpStrip';
import { B2bMarginAnalysisHubButton } from '@/components/shop/B2bMarginAnalysisHubButton';

export default function B2BTrackingPage() {
  const ordersWithTracking = mockB2BOrders.filter((o) => o.status !== 'Черновик').slice(0, 8);

  return (
    <CabinetPageContent maxWidth="4xl" className="space-y-6" data-testid={tid.page('shop-b2b-tracking')}>
      <ShopB2bContentHeader lead="Сквозной мониторинг отгрузок: JOOR ASN, статусы доставки и ссылки на трекинг перевозчика." />
      <ShopAnalyticsSegmentErpStrip />

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-sm font-black uppercase">Заказы с отгрузкой</CardTitle>
          <CardDescription>Откройте заказ для деталей отгрузки и трекинга.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {ordersWithTracking.length === 0 ? (
            <p className="text-text-secondary text-sm">
              Нет заказов с отгрузкой. После отгрузки здесь появится трекинг.
            </p>
          ) : (
            ordersWithTracking.map((o) => (
              <div
                key={o.order}
                className="border-border-subtle bg-bg-surface2/80 flex items-center justify-between gap-3 rounded-xl border p-4"
              >
                <div>
                  <p className="text-text-primary font-bold">{o.order}</p>
                  <p className="text-text-secondary text-xs">
                    {o.brand} · {o.shop} · {o.deliveryDate}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-lg text-[10px] font-black uppercase"
                  asChild
                >
                  <Link href={ROUTES.shop.b2bOrder(o.order)}>Детали и трекинг</Link>
                </Button>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <div className="border-border-subtle flex flex-wrap items-center gap-2 border-t pt-4">
        <span className="text-text-muted text-[10px] font-black uppercase tracking-widest">
          См. также
        </span>
        <Button variant="outline" size="sm" className="text-xs font-black uppercase" asChild>
          <Link href={ROUTES.shop.analytics} data-testid="shop-b2b-tracking-retail-link">
            Розничная аналитика
          </Link>
        </Button>
        <Button variant="outline" size="sm" className="text-xs font-black uppercase" asChild>
          <Link href={ROUTES.shop.analyticsFootfall} data-testid="shop-b2b-tracking-footfall-link">
            Трафик по зонам
          </Link>
        </Button>
        <B2bMarginAnalysisHubButton />
      </div>

      <RelatedModulesBlock
        title="Связанные разделы"
        links={getShopB2BHubLinks().filter(
          (l) => l.href === ROUTES.shop.b2bOrders || l.href === ROUTES.shop.b2bDeliveryCalendar
        )}
      />
    </CabinetPageContent>
  );
}
