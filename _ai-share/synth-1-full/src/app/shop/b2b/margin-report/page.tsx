'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DollarSign, ArrowLeft, TrendingUp } from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';
import { getShopB2BHubLinks } from '@/lib/data/entity-links';

/** ASOS: маржа и отчётность по брендам/категориям для ритейла (B2B заказы). */
const MOCK_BY_BRAND = [
  { brand: 'Syntha', revenue: 2450000, cost: 1420000, margin: 42, turnover: 2.8 },
  { brand: 'A.P.C.', revenue: 1800000, cost: 1080000, margin: 40, turnover: 2.4 },
  { brand: 'Acne Studios', revenue: 920000, cost: 552000, margin: 40, turnover: 2.1 },
];
const MOCK_BY_CATEGORY = [
  { category: 'Верхняя одежда', revenue: 2100000, margin: 44 },
  { category: 'Трикотаж', revenue: 1580000, margin: 39 },
  { category: 'Брюки', revenue: 1490000, margin: 41 },
];

export default function MarginReportPage() {
  return (
    <div className="container max-w-4xl mx-auto px-4 py-6 pb-24">
      <div className="flex items-center gap-3 mb-6">
        <Link href={ROUTES.shop.b2b}><Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-tight flex items-center gap-2"><DollarSign className="h-6 w-6" /> Маржа по брендам</h1>
          <p className="text-slate-500 text-sm mt-0.5">ASOS: маржа и оборачиваемость по брендам/категориям для ритейла.</p>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>По брендам</CardTitle>
          <CardDescription>Выручка, себестоимость, маржа %, оборачиваемость</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {MOCK_BY_BRAND.map((r) => (
              <li key={r.brand} className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                <div>
                  <p className="font-medium">{r.brand}</p>
                  <p className="text-xs text-slate-500">{r.revenue.toLocaleString('ru-RU')} ₽ выручка · себестоимость {r.cost.toLocaleString('ru-RU')} ₽</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-emerald-600">{r.margin}% маржа</p>
                  <p className="text-xs text-slate-500">{r.turnover} оборота</p>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>По категориям</CardTitle>
          <CardDescription>Выручка и маржа по категориям</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {MOCK_BY_CATEGORY.map((c) => (
              <li key={c.category} className="flex items-center justify-between p-3 rounded-lg border border-slate-100">
                <span className="font-medium">{c.category}</span>
                <div className="text-right">
                  <span className="font-semibold">{c.revenue.toLocaleString('ru-RU')} ₽</span>
                  <span className="text-emerald-600 ml-2">{c.margin}%</span>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <div className="mt-6 flex gap-2">
        <Button variant="outline" size="sm" asChild><Link href={ROUTES.shop.b2bMarginAnalysis}>Анализ маржи</Link></Button>
        <Button variant="outline" size="sm" asChild><Link href={ROUTES.shop.b2bOrders}>Заказы</Link></Button>
      </div>
      <RelatedModulesBlock links={getShopB2BHubLinks()} title="Заказы, аналитика заказов, fulfillment" className="mt-6" />
    </div>
  );
}
