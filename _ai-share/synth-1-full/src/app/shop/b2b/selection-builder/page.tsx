'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Layers,
  ArrowLeft,
  Package,
  Palette,
  Store,
  Sparkles,
  Brain,
  BarChart3,
  Plus,
  Eye,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import { cn } from '@/lib/utils';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';
import { getRelatedLinks } from '@/lib/data/integration-modules';

type SelectionMode = 'stock' | 'brand-season' | 'cross-brand';

/** Mock: товары для селекции */
const MOCK_PRODUCTS = [
  {
    id: '1',
    name: 'Свитер оверсайз',
    brand: 'Syntha',
    category: 'Трикотаж',
    color: 'Черный',
    season: 'SS26',
    inStock: true,
    price: 12900,
    qty: 24,
  },
  {
    id: '2',
    name: 'Брюки карго',
    brand: 'Syntha',
    category: 'Брюки',
    color: 'Бежевый',
    season: 'SS26',
    inStock: true,
    price: 15900,
    qty: 18,
  },
  {
    id: '3',
    name: 'Куртка ветровка',
    brand: 'Syntha',
    category: 'Верхняя одежда',
    color: 'Серый',
    season: 'SS26',
    inStock: false,
    price: 22900,
    qty: 0,
  },
  {
    id: '4',
    name: 'Футболка базовая',
    brand: 'Syntha',
    category: 'Топы',
    color: 'Белый',
    season: 'SS26',
    inStock: true,
    price: 4900,
    qty: 56,
  },
  {
    id: '5',
    name: 'Платье миди',
    brand: 'Elena Moda',
    category: 'Платья',
    color: 'Синий',
    season: 'AW25',
    inStock: true,
    price: 18900,
    qty: 12,
  },
  {
    id: '6',
    name: 'Пиджак oversize',
    brand: 'Elena Moda',
    category: 'Верхняя одежда',
    color: 'Черный',
    season: 'AW25',
    inStock: true,
    price: 24900,
    qty: 8,
  },
  {
    id: '7',
    name: 'Юбка плиссе',
    brand: 'Elena Moda',
    category: 'Юбки',
    color: 'Черный',
    season: 'SS26',
    inStock: false,
    price: 9900,
    qty: 0,
  },
  {
    id: '8',
    name: 'Кроссовки urban',
    brand: 'TechWear',
    category: 'Обувь',
    color: 'Белый',
    season: 'SS26',
    inStock: true,
    price: 12900,
    qty: 32,
  },
  {
    id: '9',
    name: 'Рюкзак',
    brand: 'TechWear',
    category: 'Аксессуары',
    color: 'Черный',
    season: 'SS26',
    inStock: true,
    price: 7900,
    qty: 20,
  },
];

/** Купленные бренды (для селекции по сезону) */
const PURCHASED_BRANDS = ['Syntha', 'Elena Moda', 'TechWear'];

export default function SelectionBuilderPage() {
  const [mode, setMode] = useState<SelectionMode>('stock');
  const [selectedBrand, setSelectedBrand] = useState<string | 'all'>('all');
  const [selectedSeason, setSelectedSeason] = useState<string>('SS26');
  const [selection, setSelection] = useState<typeof MOCK_PRODUCTS>([]);
  const [looks, setLooks] = useState<{ id: string; name: string; productIds: string[] }[]>([]);

  const filteredProducts = useMemo(() => {
    let list = mode === 'stock' ? MOCK_PRODUCTS.filter((p) => p.inStock) : MOCK_PRODUCTS;
    if (mode === 'brand-season') {
      list = list.filter((p) => p.brand === selectedBrand && p.season === selectedSeason);
    } else if (mode === 'cross-brand' && selectedBrand !== 'all') {
      list = list.filter((p) => p.brand === selectedBrand);
    }
    return list;
  }, [mode, selectedBrand, selectedSeason]);

  const analytics = useMemo(() => {
    const items = selection.length ? selection : filteredProducts;
    const byBrand: Record<
      string,
      { count: number; models: number; colors: Set<string>; volume: number }
    > = {};
    const byCategory: Record<string, number> = {};
    const byColor: Record<string, number> = {};
    items.forEach((p) => {
      if (!byBrand[p.brand])
        byBrand[p.brand] = { count: 0, models: 0, colors: new Set(), volume: 0 };
      byBrand[p.brand].count += p.qty || 1;
      byBrand[p.brand].models += 1;
      byBrand[p.brand].colors.add(p.color);
      byBrand[p.brand].volume += (p.price || 0) * (p.qty || 1);
      byCategory[p.category] = (byCategory[p.category] || 0) + 1;
      byColor[p.color] = (byColor[p.color] || 0) + 1;
    });
    return {
      byBrand: Object.entries(byBrand).map(([name, d]) => ({
        name,
        models: d.models,
        units: d.count,
        colors: d.colors.size,
        volume: d.volume,
      })),
      byCategory: Object.entries(byCategory),
      byColor: Object.entries(byColor),
      totalModels: new Set(items.map((p) => p.id)).size,
      totalUnits: items.reduce((s, p) => s + (p.qty || 1), 0),
      totalVolume: items.reduce((s, p) => s + (p.price || 0) * (p.qty || 1), 0),
    };
  }, [selection, filteredProducts]);

  const gaps = useMemo(() => {
    const cats = new Set(MOCK_PRODUCTS.map((p) => p.category));
    const hasCat = new Set(
      (selection.length ? selection : filteredProducts).map((p) => p.category)
    );
    return Array.from(cats).filter((c) => !hasCat.has(c));
  }, [selection, filteredProducts]);

  const addToSelection = (p: (typeof MOCK_PRODUCTS)[0]) => {
    if (selection.some((s) => s.id === p.id)) return;
    setSelection((prev) => [...prev, p]);
  };

  const removeFromSelection = (id: string) => {
    setSelection((prev) => prev.filter((s) => s.id !== id));
  };

  const isSelected = (id: string) => selection.some((s) => s.id === id);
  const displayItems = selection.length ? selection : [];

  return (
    <div className="container mx-auto max-w-6xl space-y-6 px-4 py-6 pb-24">
      <div className="flex items-center gap-3">
        <Link href={ROUTES.shop.b2b}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold uppercase">
            <Layers className="h-6 w-6" /> Формирование селекции
          </h1>
          <p className="mt-0.5 text-sm text-slate-500">
            Сток, бренд-сезон, кросс-бренд — образы, аналитика и AI-рекомендации
          </p>
        </div>
      </div>

      {/* Режимы селекции */}
      <Tabs value={mode} onValueChange={(v) => setMode(v as SelectionMode)}>
        <TabsList className="grid w-full grid-cols-3 lg:inline-grid lg:w-auto">
          <TabsTrigger value="stock" className="gap-2">
            <Package className="h-4 w-4" /> Из стока
          </TabsTrigger>
          <TabsTrigger value="brand-season" className="gap-2">
            <Store className="h-4 w-4" /> Бренд + сезон
          </TabsTrigger>
          <TabsTrigger value="cross-brand" className="gap-2">
            <Sparkles className="h-4 w-4" /> Кросс-бренд
          </TabsTrigger>
        </TabsList>

        {(mode === 'brand-season' || mode === 'cross-brand') && (
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="text-xs font-bold uppercase text-slate-500">Бренд:</span>
            <div className="flex gap-1">
              <Button
                variant={selectedBrand === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedBrand('all')}
              >
                Все
              </Button>
              {PURCHASED_BRANDS.map((b) => (
                <Button
                  key={b}
                  variant={selectedBrand === b ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedBrand(b)}
                >
                  {b}
                </Button>
              ))}
            </div>
            {mode === 'brand-season' && (
              <>
                <span className="ml-2 text-xs font-bold uppercase text-slate-500">Сезон:</span>
                <div className="flex gap-1">
                  {['SS26', 'AW25', 'SS25'].map((s) => (
                    <Button
                      key={s}
                      variant={selectedSeason === s ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedSeason(s)}
                    >
                      {s}
                    </Button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Товары */}
          <div className="space-y-4 lg:col-span-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Товары</CardTitle>
                <CardDescription>
                  {mode === 'stock' && 'Только в наличии. Быстрая отгрузка.'}
                  {mode === 'brand-season' && `Коллекция ${selectedBrand} ${selectedSeason}`}
                  {mode === 'cross-brand' && 'Комбинируйте по стилистике, цветам, категориям'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {filteredProducts.map((p) => (
                    <div
                      key={p.id}
                      className={cn(
                        'cursor-pointer rounded-xl border p-3 transition-all',
                        isSelected(p.id)
                          ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200'
                          : 'border-slate-200 hover:border-indigo-300'
                      )}
                      onClick={() =>
                        isSelected(p.id) ? removeFromSelection(p.id) : addToSelection(p)
                      }
                    >
                      <div className="mb-2 aspect-square rounded-lg bg-slate-100" />
                      <p className="truncate text-xs font-bold">{p.name}</p>
                      <p className="text-[10px] text-slate-500">
                        {p.brand} · {p.color}
                      </p>
                      <div className="mt-1 flex items-center justify-between">
                        <span className="text-xs font-bold">
                          {p.price?.toLocaleString('ru-RU')} ₽
                        </span>
                        {p.inStock && (
                          <Badge
                            variant="outline"
                            className="border-emerald-200 text-[9px] text-emerald-600"
                          >
                            В наличии
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Образы / сочетания */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Eye className="h-4 w-4" /> Образы и сочетания
                </CardTitle>
                <CardDescription>
                  Комбинируйте товары в образы по стилистике, цветам, категориям
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" className="gap-1">
                    <Plus className="h-3 w-3" /> Новый образ
                  </Button>
                  {looks.length === 0 && (
                    <p className="text-sm text-slate-400">
                      Выберите товары и создайте образ — сочетание по стилю, цвету или категории
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Аналитика + AI */}
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <BarChart3 className="h-4 w-4" /> Аналитика селекции
                </CardTitle>
                <CardDescription>
                  Модели, бренды, объёмы, цвета — что взято, чего не хватает
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-lg border border-slate-100 bg-slate-50 p-3">
                    <p className="text-[10px] font-bold uppercase text-slate-500">Моделей</p>
                    <p className="text-lg font-black">{analytics.totalModels}</p>
                  </div>
                  <div className="rounded-lg border border-slate-100 bg-slate-50 p-3">
                    <p className="text-[10px] font-bold uppercase text-slate-500">Единиц</p>
                    <p className="text-lg font-black">{analytics.totalUnits}</p>
                  </div>
                  <div className="col-span-2 rounded-lg border border-slate-100 bg-slate-50 p-3">
                    <p className="text-[10px] font-bold uppercase text-slate-500">Объём (₽)</p>
                    <p className="text-lg font-black">
                      {analytics.totalVolume.toLocaleString('ru-RU')}
                    </p>
                  </div>
                </div>
                {analytics.byBrand.length > 0 && (
                  <div>
                    <p className="mb-2 text-[10px] font-bold uppercase text-slate-500">
                      По брендам
                    </p>
                    <div className="space-y-1">
                      {analytics.byBrand.map((b) => (
                        <div key={b.name} className="flex justify-between text-xs">
                          <span>{b.name}</span>
                          <span>
                            {b.models} мод. · {b.units} ед. · {b.colors} цветов
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {analytics.byCategory.length > 0 && (
                  <div>
                    <p className="mb-2 text-[10px] font-bold uppercase text-slate-500">
                      По категориям
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {analytics.byCategory.map(([cat, n]) => (
                        <Badge key={cat} variant="secondary" className="text-[10px]">
                          {cat} {n}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {analytics.byColor.length > 0 && (
                  <div>
                    <p className="mb-2 text-[10px] font-bold uppercase text-slate-500">По цветам</p>
                    <div className="flex flex-wrap gap-1">
                      {analytics.byColor.map(([color, n]) => (
                        <Badge key={color} variant="outline" className="text-[10px]">
                          {color} {n}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {gaps.length > 0 && (
                  <div>
                    <p className="mb-2 flex items-center gap-1 text-[10px] font-bold uppercase text-amber-600">
                      <AlertCircle className="h-3 w-3" /> Чего не хватает
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {gaps.map((cat) => (
                        <Badge
                          key={cat}
                          variant="outline"
                          className="border-amber-200 text-[10px] text-amber-700"
                        >
                          {cat}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Brain className="h-4 w-4" /> AI-рекомендации
                </CardTitle>
                <CardDescription>Рекомендации по продажам и формированию селекции</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="rounded-lg border border-indigo-100 bg-indigo-50 p-3 text-xs">
                  <p className="mb-1 font-bold text-indigo-900">Дополнить категорию</p>
                  <p className="text-indigo-700">
                    Добавьте верхнюю одежду — в селекции слабая представленность. Тренд: оверсайз и
                    лёгкие куртки.
                  </p>
                </div>
                <div className="rounded-lg border border-emerald-100 bg-emerald-50 p-3 text-xs">
                  <p className="mb-1 flex items-center gap-1 font-bold text-emerald-900">
                    <TrendingUp className="h-3 w-3" /> Хит продаж
                  </p>
                  <p className="text-emerald-700">
                    Свитер оверсайз и брюки карго Syntha — топ-комбо у партнёров. Рекомендуем
                    держать в стоке.
                  </p>
                </div>
                <div className="rounded-lg border border-slate-100 bg-slate-50 p-3 text-xs">
                  <p className="mb-1 flex items-center gap-1 font-bold text-slate-900">
                    <CheckCircle2 className="h-3 w-3" /> Баланс цветов
                  </p>
                  <p className="text-slate-600">
                    Чёрный и бежевый доминируют. Добавьте акценты: синий, зелёный — растут в SS26.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Tabs>

      {/* Действия */}
      <div className="flex flex-wrap gap-2">
        <Button asChild>
          <Link href={ROUTES.shop.b2bMatrix}>Открыть матрицу заказа</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href={ROUTES.shop.b2bAssortmentPlanning}>Планирование ассортимента</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href={ROUTES.shop.b2b}>B2B Hub</Link>
        </Button>
      </div>
      <RelatedModulesBlock
        links={getRelatedLinks('selection-builder').map((l) => ({ label: l.label, href: l.href }))}
        title="Связанные модули"
        className="mt-6"
      />
    </div>
  );
}
