'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DollarSign,
  ArrowLeft,
  CreditCard,
  Clock,
  CheckCircle2,
  FileText,
  ShoppingCart,
} from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import { getPartnerFinanceRollup } from '@/lib/b2b/partner-finance-rollup';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';
import { getShopB2BHubLinks } from '@/lib/data/entity-links';

export default function PartnerFinancePage() {
  const rollup = getPartnerFinanceRollup();
  const {
    credit,
    awaitingPayment,
    paidThisPeriod,
    ordersByStatus,
    ordersAwaitingPayment,
    recentOrders,
  } = rollup;

  const formatMoney = (n: number) => n.toLocaleString('ru-RU', { maximumFractionDigits: 0 }) + ' ₽';

  return (
    <div className="container mx-auto max-w-4xl px-4 py-6 pb-24">
      <div className="mb-6 flex items-center gap-3">
        <Link href={ROUTES.shop.b2b}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold uppercase tracking-tight">
            <DollarSign className="h-6 w-6" /> Финансы партнёра
          </h1>
          <p className="mt-0.5 text-sm text-slate-500">
            Единый экран: заказы по статусам, кредитный лимит, ожидаемые платежи, оплачено за
            период. JOOR Pay и документы.
          </p>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="border-slate-100">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-black uppercase tracking-tight">
              <CreditCard className="h-4 w-4 text-indigo-600" /> Кредитный лимит
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <p className="text-2xl font-black text-slate-900">{formatMoney(credit.available)}</p>
            <p className="text-xs text-slate-500">доступно из {formatMoney(credit.limit)}</p>
            <p className="text-[10px] text-slate-400">использовано {formatMoney(credit.used)}</p>
            {credit.blocked && (
              <Badge variant="destructive" className="mt-2 text-[9px] font-black">
                Лимит исчерпан
              </Badge>
            )}
          </CardContent>
        </Card>

        <Card className="border-slate-100">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-black uppercase tracking-tight">
              <Clock className="h-4 w-4 text-amber-600" /> Ожидает оплаты
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <p className="text-2xl font-black text-amber-700">{formatMoney(awaitingPayment)}</p>
            <p className="text-xs text-slate-500">{ordersAwaitingPayment.length} заказ(ов)</p>
          </CardContent>
        </Card>

        <Card className="border-slate-100">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-black uppercase tracking-tight">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Оплачено за период
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <p className="text-2xl font-black text-emerald-700">{formatMoney(paidThisPeriod)}</p>
            <p className="text-xs text-slate-500">мок: все оплаченные</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Заказы по статусам</CardTitle>
            <CardDescription>Количество заказов в каждом статусе.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {Object.entries(ordersByStatus).map(([status, count]) => (
                <Badge key={status} variant="secondary" className="text-[10px] font-bold">
                  {status}: {count}
                </Badge>
              ))}
            </div>
            <Button variant="outline" size="sm" className="mt-4 rounded-lg" asChild>
              <Link href={ROUTES.shop.b2bOrders}>
                <ShoppingCart className="mr-1.5 h-3.5 w-3.5" /> Все заказы
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Ожидающие оплаты</CardTitle>
            <CardDescription>Заказы с неоплаченной или просроченной суммой.</CardDescription>
          </CardHeader>
          <CardContent>
            {ordersAwaitingPayment.length === 0 ? (
              <p className="text-sm text-slate-500">Нет заказов, ожидающих оплаты.</p>
            ) : (
              <ul className="space-y-2">
                {ordersAwaitingPayment.map((o) => (
                  <li
                    key={o.order}
                    className="flex items-center justify-between border-b border-slate-100 py-2 last:border-0"
                  >
                    <span className="font-mono text-sm">{o.order}</span>
                    <span className="font-bold text-amber-700">{o.amount}</span>
                    <Badge variant="outline" className="text-[9px]">
                      {o.paymentStatus}
                    </Badge>
                  </li>
                ))}
              </ul>
            )}
            <Button variant="outline" size="sm" className="mt-4 rounded-lg" asChild>
              <Link href={ROUTES.shop.b2bPayment}>
                <CreditCard className="mr-1.5 h-3.5 w-3.5" /> Оплатить (JOOR Pay)
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base">Последние заказы</CardTitle>
          <CardDescription>Недавние заказы (без черновиков).</CardDescription>
        </CardHeader>
        <CardContent>
          {recentOrders.length === 0 ? (
            <p className="text-sm text-slate-500">Нет подтверждённых заказов.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="py-2 text-left font-medium">Заказ</th>
                    <th className="py-2 text-left font-medium">Бренд</th>
                    <th className="py-2 text-right font-medium">Сумма</th>
                    <th className="py-2 text-left font-medium">Статус</th>
                    <th className="py-2 text-left font-medium">Оплата</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((o) => (
                    <tr key={o.order} className="border-b border-slate-100">
                      <td className="py-2">
                        <Link
                          href={ROUTES.shop.b2bOrders}
                          className="font-mono text-indigo-600 hover:underline"
                        >
                          {o.order}
                        </Link>
                      </td>
                      <td className="py-2 text-slate-600">{o.brand}</td>
                      <td className="py-2 text-right font-medium">{o.amount}</td>
                      <td className="py-2">
                        <Badge variant="secondary" className="text-[9px]">
                          {o.status}
                        </Badge>
                      </td>
                      <td className="py-2 text-[10px] text-slate-500">{o.paymentStatus ?? '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="mt-6 flex flex-wrap gap-2">
        <Button asChild className="rounded-xl">
          <Link href={ROUTES.shop.b2bPayment}>
            <CreditCard className="mr-2 h-4 w-4" /> Оплата заказов (JOOR Pay)
          </Link>
        </Button>
        <Button variant="outline" asChild className="rounded-xl">
          <Link href={ROUTES.shop.b2bDocuments}>
            <FileText className="mr-2 h-4 w-4" /> Документы
          </Link>
        </Button>
        <Button variant="outline" asChild className="rounded-xl">
          <Link href={ROUTES.shop.b2bOrders}>
            <ShoppingCart className="mr-2 h-4 w-4" /> Мои заказы
          </Link>
        </Button>
      </div>

      <RelatedModulesBlock
        links={getShopB2BHubLinks()}
        title="Заказы, оплата, документы"
        className="mt-6"
      />
    </div>
  );
}
