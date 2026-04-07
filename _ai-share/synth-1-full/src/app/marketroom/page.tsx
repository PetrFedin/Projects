'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ROUTES } from '@/lib/routes';
import { getMarketroomLinks } from '@/lib/data/entity-links';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';
import { Store, LayoutGrid, TrendingUp, ShoppingBag, Sparkles, FileSpreadsheet } from 'lucide-react';

/** Мок: лук = набор товаров из каталога */
const MOCK_LOOKS = [
  { id: 'look-1', title: 'Офисный лук FW26', productIds: ['p1', 'p2', 'p3'], productNames: ['Пиджак приталенный', 'Брюки чинос', 'Рубашка оксфорд'], totalPrice: 24900 },
  { id: 'look-2', title: 'Вечерний образ', productIds: ['p4', 'p5'], productNames: ['Платье миди', 'Клатч'], totalPrice: 18900 },
  { id: 'look-3', title: 'Casual выходного дня', productIds: ['p6', 'p7', 'p8'], productNames: ['Свитшот оверсайз', 'Джинсы скинни', 'Кроссовки'], totalPrice: 15200 },
];

/** Мок: тренды для AI Trend Radar */
const MOCK_TRENDS = [
  { id: 't1', label: 'Оверсайз', score: 94, change: 'up' },
  { id: 't2', label: 'Минимализм', score: 88, change: 'up' },
  { id: 't3', label: 'Устойчивая мода', score: 85, change: 'stable' },
  { id: 't4', label: 'Яркие акценты', score: 82, change: 'up' },
  { id: 't5', label: 'Ретро 90-х', score: 78, change: 'down' },
];

export default function MarketroomPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto px-4 py-8 max-w-5xl space-y-12 pb-24">
        {/* Шапка */}
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tight flex items-center gap-2">
              <Store className="h-8 w-8 text-indigo-600" /> Маркетрум
            </h1>
            <p className="text-slate-500 mt-1">
              Каталог, луки и тренды. Покупка в один клик, привязка к заказу и корзине.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href={ROUTES.client.catalog}>Каталог</Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href={ROUTES.client.orders}>Мои заказы</Link>
            </Button>
          </div>
        </header>

        {/* Shop-the-Look — луки из каталога, привязка к заказу/корзине */}
        <section id="shop-the-look" className="scroll-mt-8">
          <div className="flex items-center gap-2 mb-4">
            <LayoutGrid className="h-5 w-5 text-indigo-600" />
            <h2 className="text-xl font-bold uppercase">Shop-the-Look</h2>
          </div>
          <p className="text-sm text-slate-500 mb-4">
            Готовые луки из каталога. Добавьте весь лук в корзину или оформите заказ одним кликом.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {MOCK_LOOKS.map((look) => (
              <Card key={look.id} className="rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="h-32 bg-gradient-to-br from-indigo-100 to-slate-100 flex items-center justify-center">
                  <ShoppingBag className="h-12 w-12 text-indigo-300" />
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{look.title}</CardTitle>
                  <CardDescription className="text-xs">
                    {look.productNames.join(' · ')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0 space-y-2">
                  <p className="text-sm font-semibold">{look.totalPrice.toLocaleString('ru-RU')} ₽</p>
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1 gap-1" asChild>
                      <Link href={`${ROUTES.client.catalog}?look=${look.id}`}>
                        <ShoppingBag className="h-3.5 w-3.5" /> В корзину
                      </Link>
                    </Button>
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`${ROUTES.client.orders}?new=1&look=${look.id}`}>Заказ</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* AI Trend Radar в публичном Маркетруме */}
        <section id="trend-radar" className="scroll-mt-8">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-amber-600" />
            <h2 className="text-xl font-bold uppercase">AI Trend Radar</h2>
            <Badge variant="secondary" className="text-[9px] gap-1">
              <Sparkles className="h-3 w-3" /> AI
            </Badge>
          </div>
          <p className="text-sm text-slate-500 mb-4">
            Актуальные тренды в Маркетруме по данным поиска и продаж. Обновляется автоматически.
          </p>
          <Card className="rounded-xl border border-slate-200 shadow-sm">
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-2">
                {MOCK_TRENDS.map((t) => (
                  <Badge
                    key={t.id}
                    variant="outline"
                    className="text-xs py-2 px-3 rounded-full border-slate-200 hover:border-indigo-200 hover:bg-indigo-50/50 transition-colors cursor-default"
                  >
                    <span className="font-medium">{t.label}</span>
                    <span className="ml-1.5 text-slate-400">{t.score}%</span>
                    {t.change === 'up' && <span className="text-emerald-500 ml-0.5">↑</span>}
                    {t.change === 'down' && <span className="text-rose-500 ml-0.5">↓</span>}
                  </Badge>
                ))}
              </div>
              <p className="text-[11px] text-slate-400 mt-3">
                При API: расчёт трендов по аналитике платформы и внешним источникам.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Импорт контента из 1С/Excel */}
        <section className="rounded-xl border border-slate-100 bg-slate-50/50 p-4">
          <p className="text-xs text-slate-500 flex items-center gap-2">
            <FileSpreadsheet className="h-4 w-4" />
            Импорт контента из 1С/Excel: при необходимости каталог и луки можно выгружать из учётных систем. Настройка в кабинете бренда.
          </p>
        </section>

        <RelatedModulesBlock links={getMarketroomLinks()} title="Каталог, заказы, аналитика Маркетрум" />
      </div>
    </div>
  );
}
