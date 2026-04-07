'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ROUTES } from '@/lib/routes';
import { getAgentBrands } from '@/lib/b2b/agent-context';
import { getOrdersWithPaymentState } from '@/lib/b2b/partner-finance-rollup';
import { ArrowLeft, ShoppingCart, Filter } from 'lucide-react';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';
import { getShopB2BHubLinks } from '@/lib/data/entity-links';
import { OrderRecommendationsBlock } from '@/components/b2b/OrderRecommendationsBlock';
import { OrderChatBot } from '@/components/b2b/OrderChatBot';

export default function ShopB2BOrdersPage() {
  const searchParams = useSearchParams();
  const brandFilter = searchParams.get('brand') ?? '';

  const brands = getAgentBrands();
  const ordersWithPayment = getOrdersWithPaymentState();
  const filteredOrders = brandFilter
    ? ordersWithPayment.filter((o) => o.brand === brandFilter)
    : ordersWithPayment;

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
            <ShoppingCart className="h-6 w-6" /> Мои заказы
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Список заказов. Фильтр по бренду для агента: один вход — несколько брендов.
          </p>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-black uppercase tracking-tight flex items-center gap-2">
            <Filter className="h-4 w-4" /> Фильтр по бренду
          </CardTitle>
          <CardDescription>Быстрый фильтр заказов по бренду (мультибренд для агента).</CardDescription>
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
              {brandFilter ? `Бренд: ${brandFilter}` : 'Все бренды'} · {filteredOrders.length} заказ(ов)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredOrders.length === 0 ? (
              <p className="text-slate-500 text-sm">Нет заказов по выбранному фильтру.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-2 font-medium">Заказ</th>
                      <th className="text-left py-2 font-medium">Бренд</th>
                      <th className="text-left py-2 font-medium">Статус</th>
                      <th className="text-right py-2 font-medium">Сумма</th>
                      <th className="text-left py-2 font-medium">Оплата</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((o) => (
                      <tr key={o.order} className="border-b border-slate-100">
                        <td className="py-2 font-mono">{o.order}</td>
                        <td className="py-2">{o.brand}</td>
                        <td className="py-2">
                          <Badge variant="secondary" className="text-[9px]">{o.status}</Badge>
                        </td>
                        <td className="py-2 text-right font-medium">{o.amount}</td>
                        <td className="py-2 text-[10px] text-slate-500">{o.paymentStatus ?? '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
        <OrderChatBot defaultCollapsed={true} className="md:sticky md:top-24 h-fit" />
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <Button variant="outline" size="sm" asChild>
          <Link href={ROUTES.shop.b2bAgentCabinet}>Агентский кабинет</Link>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link href={ROUTES.shop.b2bFinance}>Финансы партнёра</Link>
        </Button>
      </div>
      <RelatedModulesBlock links={getShopB2BHubLinks()} title="Агентский кабинет, финансы" className="mt-6" />
    </div>
  );
}
