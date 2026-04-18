'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  HeartPulse,
  Target,
  TrendingUp,
  AlertTriangle,
  Info,
  ShoppingBag,
  ExternalLink,
  RefreshCw,
  BarChart3,
} from 'lucide-react';
import { products } from '@/lib/products';
import { getMarketplaceHealth } from '@/lib/fashion/marketplace-health';
import { Button } from '@/components/ui/button';

export default function MarketplaceHealthPage() {
  const healthData = products.slice(0, 10).map((p) => ({
    product: p,
    health: getMarketplaceHealth(p),
  }));

  return (
    <div className="mx-auto max-w-6xl p-8">
      <div className="mb-8">
        <div className="mb-2 flex items-center gap-3">
          <div className="rounded-lg bg-emerald-100 p-2 shadow-sm">
            <HeartPulse className="h-6 w-6 text-emerald-600" />
          </div>
          <h1 className="text-text-primary text-3xl font-bold uppercase tracking-tight tracking-tighter">
            Marketplace Health Card
          </h1>
        </div>
        <p className="font-medium text-muted-foreground">
          Глубокая аналитика карточек товаров на WB и Ozon: Buybox, рейтинг, риски OOS и процент
          выкупа.
        </p>
      </div>

      <div className="space-y-4">
        {healthData.map(({ product, health }) => (
          <Card
            key={product.id}
            className="border-border-subtle overflow-hidden border-2 p-5 shadow-sm transition-all hover:border-emerald-100"
          >
            <div className="flex flex-col items-center gap-8 lg:flex-row">
              <div className="flex w-full items-center gap-4 lg:w-1/4">
                <div className="h-18 bg-bg-surface2 w-14 shrink-0 overflow-hidden rounded border">
                  <img
                    src={product.images?.[0]?.url ?? ''}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-text-muted mb-1 text-[10px] font-black uppercase leading-none">
                    {product.sku}
                  </div>
                  <div className="text-text-primary truncate text-sm font-bold">{product.name}</div>
                  <Badge variant="outline" className="mt-1 h-3.5 text-[9px] font-black uppercase">
                    {product.category}
                  </Badge>
                </div>
              </div>

              <div className="grid w-full flex-1 grid-cols-2 gap-4">
                {health.map((h, i) => (
                  <div
                    key={i}
                    className="group relative rounded-xl border border-emerald-50 bg-emerald-50/20 p-4"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <Badge className="h-4 border-none bg-emerald-600 text-[10px] font-black uppercase text-white">
                        {h.marketplace}
                      </Badge>
                      <div
                        className={`flex items-center gap-1 text-[10px] font-black uppercase ${h.buyboxStatus === 'won' ? 'text-green-600' : 'text-rose-600'}`}
                      >
                        {h.buyboxStatus === 'won' ? (
                          <Target className="h-3.5 w-3.5" />
                        ) : (
                          <Info className="h-3.5 w-3.5" />
                        )}
                        Buybox {h.buyboxStatus}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col">
                        <span className="text-text-muted mb-1 text-[9px] font-black uppercase leading-none">
                          Buyback (Выкуп)
                        </span>
                        <span className="text-sm font-black text-emerald-700">
                          {h.buybackRate}%
                        </span>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-text-muted mb-1 text-[9px] font-black uppercase leading-none">
                          OOS Risk
                        </span>
                        <span
                          className={`text-sm font-black ${h.outOfStockRisk > 30 ? 'text-orange-500' : 'text-green-500'}`}
                        >
                          {h.outOfStockRisk}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex w-full items-center justify-between gap-3 lg:w-32 lg:flex-col lg:items-end">
                <div className="text-right">
                  <div className="text-text-muted mb-1 text-[10px] font-black uppercase leading-none">
                    Health Score
                  </div>
                  <div className="text-text-primary text-2xl font-black leading-none">88%</div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 text-[10px] font-black uppercase text-emerald-600 hover:bg-emerald-50"
                >
                  Details <ExternalLink className="ml-1 h-3 w-3" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="group relative overflow-hidden border-2 border-emerald-50 bg-emerald-50/10 p-6 shadow-md transition-all hover:scale-[1.02]">
          <div className="absolute right-0 top-0 rotate-12 p-4 opacity-5 transition-transform group-hover:scale-110">
            <RefreshCw className="h-16 w-16 text-emerald-600" />
          </div>
          <div className="mb-4 flex items-center gap-3 text-emerald-600">
            <RefreshCw className="h-5 w-5" />
            <h3 className="text-sm font-bold uppercase tracking-tighter">Aggregated Sync</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-text-secondary text-[10px] font-bold uppercase">
                Active Cards
              </span>
              <span className="font-black">124</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-text-secondary text-[10px] font-bold uppercase">
                Critical Alerts
              </span>
              <span className="font-black text-rose-500">3</span>
            </div>
          </div>
        </Card>

        <Card className="group relative overflow-hidden border-2 border-emerald-50 bg-emerald-50/10 p-6 shadow-md transition-all hover:scale-[1.02]">
          <div className="absolute right-0 top-0 rotate-12 p-4 opacity-5 transition-transform group-hover:scale-110">
            <Target className="h-16 w-16 text-emerald-600" />
          </div>
          <div className="mb-4 flex items-center gap-3 text-emerald-600">
            <BarChart3 className="h-5 w-5" />
            <h3 className="text-sm font-bold uppercase tracking-tighter">Buyback Optimization</h3>
          </div>
          <p className="mb-4 text-[11px] font-medium leading-tight text-emerald-600">
            Средний процент выкупа по коллекции вырос на 4.2% после внедрения AI-фиттинга.
          </p>
        </Card>

        <Card className="group relative overflow-hidden border-2 border-emerald-50 bg-emerald-50/10 p-6 shadow-md transition-all hover:scale-[1.02]">
          <div className="absolute right-0 top-0 rotate-12 p-4 opacity-5 transition-transform group-hover:scale-110">
            <AlertTriangle className="h-16 w-16 text-orange-600" />
          </div>
          <div className="mb-4 flex items-center gap-3 text-orange-600">
            <AlertTriangle className="h-5 w-5" />
            <h3 className="text-sm font-bold uppercase tracking-tighter">Inventory Risk</h3>
          </div>
          <p className="mb-4 text-[11px] font-medium leading-tight text-orange-600">
            5 SKU в категории "Верхняя одежда" имеют риск OOS более 60% в ближайшие 7 дней.
          </p>
        </Card>
      </div>
    </div>
  );
}
