'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ROUTES } from '@/lib/routes';
import { getAgentBrands } from '@/lib/b2b/agent-context';
import { getOrdersWithPaymentState } from '@/lib/b2b/partner-finance-rollup';
import { Filter } from 'lucide-react';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';
import { ShopB2bContentHeader } from '@/components/shop/ShopB2bContentHeader';
import {
  dedupeEntityLinksByHref,
  finalizeRelatedModuleLinks,
  getShopB2BHubLinks,
  getShopB2bOrdersCrossRoleLinks,
} from '@/lib/data/entity-links';
import { OrderRecommendationsBlock } from '@/components/b2b/OrderRecommendationsBlock';
import { OrderChatBot } from '@/components/b2b/OrderChatBot';
import { RegistryPageShell } from '@/components/design-system';
import { tid } from '@/lib/ui/test-ids';
import { ShopAnalyticsSegmentErpStrip } from '@/components/shop/ShopAnalyticsSegmentErpStrip';
import { B2bMarginAnalysisHubButton } from '@/components/shop/B2bMarginAnalysisHubButton';

export default function ShopB2BOrdersPage() {
  const searchParams = useSearchParams();
  const brandFilter = searchParams.get('brand') ?? '';

  const brands = getAgentBrands();
  const ordersWithPayment = getOrdersWithPaymentState();
  const filteredOrders = brandFilter
    ? ordersWithPayment.filter((o) => o.brand === brandFilter)
    : ordersWithPayment;

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
            <ShoppingCart className="h-6 w-6" /> Мои заказы
          </h1>
          <p className="mt-0.5 text-sm text-slate-500">
            Список заказов. Фильтр по бренду для агента: один вход — несколько брендов.
          </p>
        </div>
      </div>
=======
    <RegistryPageShell className="max-w-4xl space-y-6" data-testid={tid.page('shop-b2b-orders')}>
      <ShopB2bContentHeader lead="Список заказов; фильтр по бренду для агента — один вход, несколько брендов." />
      <ShopAnalyticsSegmentErpStrip />
>>>>>>> recover/cabinet-wip-from-stash

      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm font-black uppercase tracking-tight">
            <Filter className="h-4 w-4" /> Фильтр по бренду
          </CardTitle>
          <CardDescription>
            Быстрый фильтр заказов по бренду (мультибренд для агента).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={!brandFilter ? 'default' : 'outline'}
              size="sm"
              className="rounded-lg text-[10px] font-black uppercase"
              asChild
            >
              <Link href={ROUTES.shop.b2bOrders}>Все</Link>
            </Button>
            {brands.map((b) => (
              <Button
                key={b.id}
                variant={brandFilter === b.name ? 'default' : 'outline'}
                size="sm"
                className="rounded-lg text-[10px] font-black uppercase"
                asChild
              >
                <Link href={`${ROUTES.shop.b2bOrders}?brand=${encodeURIComponent(b.name)}`}>
                  {b.name}
                </Link>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <OrderRecommendationsBlock orderLineCount={filteredOrders.length * 3} />

      <div className="grid gap-4 md:grid-cols-[1fr,280px]">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Заказы</CardTitle>
            <CardDescription>
              {brandFilter ? `Бренд: ${brandFilter}` : 'Все бренды'} · {filteredOrders.length}{' '}
              заказ(ов)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredOrders.length === 0 ? (
<<<<<<< HEAD
              <p className="text-sm text-slate-500">Нет заказов по выбранному фильтру.</p>
=======
              <p className="text-text-secondary text-sm">Нет заказов по выбранному фильтру.</p>
>>>>>>> recover/cabinet-wip-from-stash
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
<<<<<<< HEAD
                    <tr className="border-b border-slate-200">
                      <th className="py-2 text-left font-medium">Заказ</th>
=======
                    <tr className="border-border-default border-b">
                      <th className="py-2 text-left font-medium">ID заказа опта</th>
>>>>>>> recover/cabinet-wip-from-stash
                      <th className="py-2 text-left font-medium">Бренд</th>
                      <th className="py-2 text-left font-medium">Статус</th>
                      <th className="py-2 text-right font-medium">Сумма</th>
                      <th className="py-2 text-left font-medium">Оплата</th>
<<<<<<< HEAD
=======
                      <th className="whitespace-nowrap py-2 text-right font-medium">Быстро</th>
>>>>>>> recover/cabinet-wip-from-stash
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((o) => (
                      <tr key={o.order} className="border-border-subtle border-b">
                        <td className="py-2 font-mono">
                          <Link
                            className="text-accent-primary hover:underline"
                            href={ROUTES.shop.b2bOrder(o.order)}
                          >
                            {o.order}
                          </Link>
                        </td>
                        <td className="py-2">{o.brand}</td>
                        <td className="py-2">
                          <Badge variant="secondary" className="text-[9px]">
                            {o.status}
                          </Badge>
                        </td>
                        <td className="py-2 text-right font-medium">{o.amount}</td>
<<<<<<< HEAD
                        <td className="py-2 text-[10px] text-slate-500">
                          {o.paymentStatus ?? '—'}
                        </td>
=======
                        <td className="text-text-secondary py-2 text-[10px]">
                          {o.paymentStatus ?? '—'}
                        </td>
                        <td className="py-2 text-right">
                          <div className="flex flex-wrap justify-end gap-x-2 gap-y-0.5 text-[10px] font-semibold uppercase tracking-wide">
                            <Link
                              className="text-accent-primary hover:underline"
                              href={`${ROUTES.shop.b2bPayment}?orderId=${encodeURIComponent(o.order)}`}
                            >
                              Оплата
                            </Link>
                            <Link
                              className="text-accent-primary hover:underline"
                              href={ROUTES.shop.b2bTracking}
                            >
                              Трек
                            </Link>
                            <Link
                              className="text-accent-primary hover:underline"
                              href={ROUTES.shop.b2bClaims}
                            >
                              Претензия
                            </Link>
                          </div>
                        </td>
>>>>>>> recover/cabinet-wip-from-stash
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
        <OrderChatBot defaultCollapsed={true} className="h-fit md:sticky md:top-24" />
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <Button variant="outline" size="sm" asChild>
          <Link href={ROUTES.shop.b2bAgentCabinet}>Агентский кабинет</Link>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link href={ROUTES.shop.b2bFinance}>Финансы партнёра</Link>
        </Button>
      </div>
<<<<<<< HEAD
      <RelatedModulesBlock
        links={getShopB2BHubLinks()}
        title="Агентский кабинет, финансы"
        className="mt-6"
      />
    </div>
=======

      <div className="border-border-subtle flex flex-wrap items-center gap-2 border-t pt-4">
        <span className="text-text-muted text-[10px] font-black uppercase tracking-widest">
          См. также
        </span>
        <Button variant="outline" size="sm" className="text-xs font-black uppercase" asChild>
          <Link href={ROUTES.shop.analytics} data-testid="shop-b2b-orders-retail-link">
            Розничная аналитика
          </Link>
        </Button>
        <Button variant="outline" size="sm" className="text-xs font-black uppercase" asChild>
          <Link href={ROUTES.shop.analyticsFootfall} data-testid="shop-b2b-orders-footfall-link">
            Трафик по зонам
          </Link>
        </Button>
        <B2bMarginAnalysisHubButton />
      </div>

      <RelatedModulesBlock
        links={finalizeRelatedModuleLinks(
          dedupeEntityLinksByHref([...getShopB2bOrdersCrossRoleLinks(), ...getShopB2BHubLinks()])
        )}
        title="Связанные кабинеты и B2B-модули"
        className="mt-6"
      />
    </RegistryPageShell>
>>>>>>> recover/cabinet-wip-from-stash
  );
}
