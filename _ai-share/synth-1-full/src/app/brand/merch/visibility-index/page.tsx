'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Target,
  Search,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  BarChart3,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { products } from '@/lib/products';
import { getMarketplaceSeo } from '@/lib/fashion/marketplace-seo';
import { Button } from '@/components/ui/button';

export default function VisibilityIndexPage() {
  const seoData = products.slice(0, 10).map((p) => ({
    product: p,
    seo: getMarketplaceSeo(p),
  }));

  return (
    <div className="mx-auto max-w-6xl p-8">
      <div className="mb-8">
        <div className="mb-2 flex items-center gap-3">
          <div className="rounded-lg bg-purple-100 p-2 shadow-sm">
            <Target className="h-6 w-6 text-purple-600" />
          </div>
          <h1 className="text-3xl font-bold uppercase tracking-tight tracking-tighter text-slate-800">
            Marketplace Visibility Index
          </h1>
        </div>
        <p className="font-medium text-muted-foreground">
          Мониторинг позиций SKU в поисковой выдаче WB и Ozon по ключевым запросам и анализ трендов
          видимости.
        </p>
      </div>

      <div className="space-y-4">
        {seoData.map(({ product, seo }) => (
          <Card
            key={product.id}
            className="overflow-hidden border-2 border-slate-50 p-5 shadow-sm transition-all hover:border-purple-100"
          >
            <div className="flex flex-col items-center gap-8 lg:flex-row">
              <div className="flex w-full items-center gap-4 lg:w-1/4">
                <div className="h-18 w-14 shrink-0 overflow-hidden rounded border bg-slate-100">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="mb-1 text-[10px] font-black uppercase leading-none text-slate-400">
                    {product.sku}
                  </div>
                  <div className="truncate text-sm font-bold text-slate-700">{product.name}</div>
                  <Badge variant="outline" className="mt-1 h-3.5 text-[9px] font-black uppercase">
                    {product.category}
                  </Badge>
                </div>
              </div>

              <div className="grid w-full flex-1 grid-cols-2 gap-4">
                {seo.map((s, i) => (
                  <div
                    key={i}
                    className="group relative rounded-xl border border-purple-50 bg-purple-50/20 p-4"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <Badge className="h-4 border-none bg-purple-600 text-[10px] font-black uppercase text-white">
                        {s.marketplace}
                      </Badge>
                      <div
                        className={`flex items-center gap-1 text-[10px] font-black uppercase ${s.searchTrend === 'rising' ? 'text-green-600' : 'text-slate-400'}`}
                      >
                        Trend {s.searchTrend}
                      </div>
                    </div>
                    <div className="flex items-end justify-between">
                      <div>
                        <div className="mb-1 text-[9px] font-black uppercase leading-none text-slate-400">
                          Top Keyword
                        </div>
                        <div className="text-xs font-bold italic text-purple-800">
                          "{s.keyword}"
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-black leading-none text-slate-800">
                          #{s.rank}
                        </div>
                        <div className="mt-1 text-[9px] font-black uppercase leading-none text-slate-400">
                          Search Rank
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex w-full items-center justify-between gap-3 lg:w-32 lg:flex-col lg:items-end">
                <div className="text-right">
                  <div className="mb-1 text-[10px] font-black uppercase leading-none text-slate-400">
                    Visibility Score
                  </div>
                  <div className="text-2xl font-black leading-none text-slate-800">74%</div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 text-[10px] font-black uppercase text-purple-600 hover:bg-purple-50"
                >
                  SEO Tools <ExternalLink className="ml-1 h-3 w-3" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="border-2 border-purple-50 bg-purple-50/10 p-6 shadow-md">
          <div className="mb-4 flex items-center gap-3 text-purple-600">
            <RefreshCw className="h-5 w-5" />
            <h3 className="text-sm font-bold uppercase tracking-tighter">Rank Tracker Sync</h3>
          </div>
          <p className="mb-4 text-[11px] font-medium leading-tight text-purple-600">
            Обновление позиций по 1,200 ключевым словам завершено. Обнаружен рост видимости в
            категории "Трикотаж".
          </p>
          <Button
            size="sm"
            className="h-8 w-full bg-purple-600 text-[9px] font-black uppercase text-white shadow-sm hover:bg-purple-700"
          >
            Full SEO Report
          </Button>
        </Card>

        <Card className="border-2 border-purple-50 bg-purple-50/10 p-6 shadow-md">
          <div className="mb-4 flex items-center gap-3 text-purple-600">
            <BarChart3 className="h-5 w-5" />
            <h3 className="text-sm font-bold uppercase tracking-tighter">Keyword Gaps</h3>
          </div>
          <p className="mb-4 text-[11px] font-medium leading-tight text-purple-600">
            Ваши SKU выпадают из ТОП-10 по запросу "кардиган шерсть". Рекомендуется оптимизация
            описания.
          </p>
        </Card>

        <Card className="border-2 border-slate-100 bg-slate-50/20 p-6 shadow-md">
          <h3 className="mb-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
            Visibility Heatmap
          </h3>
          <div className="flex h-20 items-end gap-1.5">
            {[40, 60, 45, 90, 75, 80, 55, 95].map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-t-sm bg-purple-200 transition-colors hover:bg-purple-400"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
          <div className="mt-2 flex justify-between text-[8px] font-bold uppercase text-slate-400">
            <span>Mon</span>
            <span>Today</span>
          </div>
        </Card>
      </div>
    </div>
  );
}
