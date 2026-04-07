'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, RefreshCcw, TrendingUp, TrendingDown, Minus, Package } from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import { mockB2BOrders } from '@/lib/order-data';
import { getReorderLinesWithSellThrough, getReorderLinesByOrder } from '@/lib/b2b/reorder-sellthrough';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';
import { getShopB2BHubLinks } from '@/lib/data/entity-links';

export default function B2BReorderPage() {
  const searchParams = useSearchParams();
  const copyFrom = searchParams.get('copyFrom') ?? '';

  const allLines = getReorderLinesWithSellThrough();
  const ordersWithLines = Array.from(new Set(allLines.map((l) => l.orderId))).map((id) => {
    const order = mockB2BOrders.find((o) => o.order === id);
    return { orderId: id, brand: order?.brand ?? '', status: order?.status, lines: getReorderLinesByOrder(id) };
  });

  const highlightOrderId = copyFrom && ordersWithLines.some((o) => o.orderId === copyFrom) ? copyFrom : null;

  return (
    <div className="container mx-auto px-4 py-6 pb-24">
      <div className="flex items-center gap-3 mb-6">
        <Link href={ROUTES.shop.b2bOrders}>
          <Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-tight">Reorder по истории</h1>
          <p className="text-slate-500 text-sm mt-0.5">NuORDER: повтор заказа из истории с подсказками по sell-through (мок).</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><RefreshCcw className="h-5 w-5" /> Заказы и подсказки по продажам</CardTitle>
          <CardDescription>
            Выберите заказ и посмотрите, как шли продажи по артикулам. Рекомендуемое кол-во к повторному заказу рассчитано по sell-through (мок).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {ordersWithLines.map(({ orderId, brand, status, lines }) => (
            <div
              key={orderId}
              className={highlightOrderId === orderId ? 'rounded-xl border-2 border-indigo-300 bg-indigo-50/30 p-4' : 'rounded-xl border border-slate-200 p-4'}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-semibold">{orderId}</span>
                  <span className="text-slate-600">{brand}</span>
                  {status && <Badge variant="secondary">{status}</Badge>}
                </div>
                <Button size="sm" asChild>
                  <Link href={`${ROUTES.shop.b2bMatrix}?mode=reorder&copyFrom=${orderId}`}>
                    <RefreshCcw className="h-3.5 w-3.5 mr-1.5" /> Reorder
                  </Link>
                </Button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-2 font-medium">Артикул / Товар</th>
                      <th className="text-right py-2 font-medium">Заказывали</th>
                      <th className="text-right py-2 font-medium">Продано (мок)</th>
                      <th className="text-right py-2 font-medium">Sell-through</th>
                      <th className="text-right py-2 font-medium">Рекомендация</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lines.map((l) => (
                      <tr key={`${l.orderId}-${l.sku}`} className="border-b border-slate-100">
                        <td className="py-2">
                          <span className="font-mono text-xs">{l.sku}</span>
                          <span className="text-slate-500 block truncate max-w-[180px]">{l.productName}</span>
                        </td>
                        <td className="text-right py-2">{l.previousQty}</td>
                        <td className="text-right py-2">{l.soldQty}</td>
                        <td className="text-right py-2">
                          <span className={l.sellThroughRate >= 0.8 ? 'text-emerald-600' : l.sellThroughRate < 0.5 ? 'text-amber-600' : 'text-slate-600'}>
                            {Math.round(l.sellThroughRate * 100)}%
                          </span>
                        </td>
                        <td className="text-right py-2">
                          <span className="font-semibold">{l.suggestedQty}</span>
                          {l.hint === 'increase' && <TrendingUp className="h-3.5 w-3.5 inline ml-1 text-emerald-500" />}
                          {l.hint === 'decrease' && <TrendingDown className="h-3.5 w-3.5 inline ml-1 text-amber-500" />}
                          {l.hint === 'same' && <Minus className="h-3.5 w-3.5 inline ml-1 text-slate-400" />}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="mt-4 flex gap-2 flex-wrap">
        <Button variant="outline" size="sm" asChild><Link href={ROUTES.shop.b2bOrders}>Мои заказы</Link></Button>
        <Button variant="outline" size="sm" asChild><Link href={ROUTES.shop.b2bMatrix}>Матрица заказа</Link></Button>
        <Button variant="outline" size="sm" asChild><Link href={ROUTES.shop.b2bCatalog}><Package className="h-3.5 w-3.5 mr-1" /> Каталог</Link></Button>
        <Button variant="outline" size="sm" asChild><Link href={ROUTES.shop.b2bSizeFinder}>Подбор размера</Link></Button>
      </div>
      <RelatedModulesBlock links={getShopB2BHubLinks()} title="Заказы, матрица, каталог" className="mt-6" />
    </div>
  );
}
