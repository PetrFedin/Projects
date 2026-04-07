'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart2, ArrowLeft, TrendingUp, Package } from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';
import { getShopB2BHubLinks } from '@/lib/data/entity-links';

/** NuOrder: аналитика по заказам — топ стилей, тренды по категориям, сравнение с прошлым сезоном. */
const MOCK_TOP_STYLES = [
  { sku: 'CTP-26-001', name: 'Graphene Parka', category: 'Верхняя одежда', brand: 'Syntha', units: 420, change: '+18%' },
  { sku: 'CTP-26-002', name: 'Merino Sweater', category: 'Трикотаж', brand: 'Syntha', units: 380, change: '+5%' },
  { sku: 'CTP-26-003', name: 'Tech Trousers', category: 'Брюки', brand: 'Syntha', units: 290, change: '-2%' },
  { sku: 'APC-DJ-01', name: 'Classic Denim', category: 'Деним', brand: 'A.P.C.', units: 210, change: '+12%' },
  { sku: 'ACNE-BAG-1', name: 'Scarf Wool', category: 'Аксессуары', brand: 'Acne Studios', units: 180, change: '-5%' },
];
const MOCK_TRENDS = [
  { category: 'Верхняя одежда', thisSeason: 1200, lastSeason: 980, change: '+22%' },
  { category: 'Трикотаж', thisSeason: 890, lastSeason: 910, change: '-2%' },
  { category: 'Брюки', thisSeason: 650, lastSeason: 520, change: '+25%' },
];
/** Заказы по месяцам (NuOrder-style дашборд) */
const MOCK_ORDERS_BY_MONTH = [
  { month: 'Сен 25', orders: 8, amount: 2.1 },
  { month: 'Окт 25', orders: 12, amount: 3.4 },
  { month: 'Ноя 25', orders: 10, amount: 2.8 },
  { month: 'Дек 25', orders: 15, amount: 4.2 },
  { month: 'Янв 26', orders: 11, amount: 3.1 },
  { month: 'Фев 26', orders: 14, amount: 3.9 },
  { month: 'Мар 26', orders: 9, amount: 2.5 },
];
const BRANDS = ['Все бренды', 'Syntha', 'A.P.C.', 'Acne Studios'];

export default function OrderAnalyticsPage() {
  const [brandFilter, setBrandFilter] = useState('Все бренды');
  const maxOrders = Math.max(...MOCK_ORDERS_BY_MONTH.map(m => m.orders));
  const filteredStyles = brandFilter === 'Все бренды' ? MOCK_TOP_STYLES : MOCK_TOP_STYLES.filter(s => s.brand === brandFilter);

  return (
    <div className="container max-w-4xl mx-auto px-4 py-6 pb-24">
      <div className="flex items-center gap-3 mb-6">
        <Link href={ROUTES.shop.b2b}><Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-tight flex items-center gap-2"><BarChart2 className="h-6 w-6" /> Аналитика по заказам</h1>
          <p className="text-slate-500 text-sm mt-0.5">NuOrder: топ стилей, тренды по категориям, заказы по месяцам.</p>
        </div>
        <div>
          <label className="text-xs text-slate-500 block mb-1">Бренд</label>
          <select value={brandFilter} onChange={(e) => setBrandFilter(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
            {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Заказы по месяцам</CardTitle>
          <CardDescription>Количество заказов и сумма (млн ₽) — тренд для планирования</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-2 h-32">
            {MOCK_ORDERS_BY_MONTH.map((m) => (
              <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex flex-col justify-end h-24" title={`${m.orders} заказов, ${m.amount} млн ₽`}>
                  <div className="bg-indigo-500 rounded-t text-[10px] text-white text-center" style={{ height: `${(m.orders / maxOrders) * 100}%`, minHeight: m.orders ? '8px' : 0 }}>{m.orders}</div>
                </div>
                <span className="text-[10px] font-medium text-slate-500">{m.month}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Топ стилей (текущий сезон)</CardTitle>
          <CardDescription>По объёму заказов {brandFilter !== 'Все бренды' ? `· ${brandFilter}` : ''}</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {filteredStyles.map((s, i) => (
              <li key={s.sku} className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                <div className="flex items-center gap-3">
                  <span className="text-slate-400 font-mono w-6">{i + 1}</span>
                  <div>
                    <p className="font-medium">{s.name}</p>
                    <p className="text-xs text-slate-500">{s.sku} · {s.category} · {s.brand}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{s.units} ед.</p>
                  <p className={`text-xs ${s.change.startsWith('+') ? 'text-emerald-600' : 'text-slate-500'}`}>{s.change} к прошлому сезону</p>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Тренды по категориям</CardTitle>
          <CardDescription>Сравнение с прошлым сезоном</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {MOCK_TRENDS.map((t) => (
              <li key={t.category} className="flex items-center justify-between p-3 rounded-lg border border-slate-100">
                <span className="font-medium">{t.category}</span>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-slate-600">{t.lastSeason} → {t.thisSeason} ед.</span>
                  <span className={t.change.startsWith('+') ? 'text-emerald-600 font-medium' : 'text-slate-500'}>{t.change}</span>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <div className="mt-6 flex gap-2">
        <Button variant="outline" size="sm" asChild><Link href={ROUTES.shop.b2bOrders}>Мои заказы</Link></Button>
        <Button variant="outline" size="sm" asChild><Link href={ROUTES.shop.b2bAnalytics}>B2B Аналитика</Link></Button>
      </div>
      <RelatedModulesBlock links={getShopB2BHubLinks()} title="Заказы, матрица, маржа, fulfillment" className="mt-6" />
    </div>
  );
}
