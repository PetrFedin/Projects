'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Target, Search, TrendingUp, TrendingDown, RefreshCw, BarChart3, ArrowRight, ExternalLink } from 'lucide-react';
import { products } from '@/lib/products';
import { getMarketplaceSeo } from '@/lib/fashion/marketplace-seo';
import { Button } from '@/components/ui/button';

export default function VisibilityIndexPage() {
  const seoData = products.slice(0, 10).map(p => ({
    product: p,
    seo: getMarketplaceSeo(p)
  }));
  
  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-purple-100 rounded-lg shadow-sm">
            <Target className="w-6 h-6 text-purple-600" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800 tracking-tighter uppercase">Marketplace Visibility Index</h1>
        </div>
        <p className="text-muted-foreground font-medium">
           Мониторинг позиций SKU в поисковой выдаче WB и Ozon по ключевым запросам и анализ трендов видимости.
        </p>
      </div>

      <div className="space-y-4">
        {seoData.map(({ product, seo }) => (
          <Card key={product.id} className="p-5 overflow-hidden border-2 border-slate-50 hover:border-purple-100 transition-all shadow-sm">
            <div className="flex flex-col lg:flex-row gap-8 items-center">
              <div className="flex items-center gap-4 w-full lg:w-1/4">
                <div className="w-14 h-18 bg-slate-100 rounded overflow-hidden border shrink-0">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[10px] font-black text-slate-400 uppercase leading-none mb-1">{product.sku}</div>
                  <div className="text-sm font-bold truncate text-slate-700">{product.name}</div>
                  <Badge variant="outline" className="text-[9px] h-3.5 mt-1 uppercase font-black">{product.category}</Badge>
                </div>
              </div>

              <div className="flex-1 w-full grid grid-cols-2 gap-4">
                {seo.map((s, i) => (
                  <div key={i} className="p-4 bg-purple-50/20 rounded-xl border border-purple-50 relative group">
                     <div className="flex justify-between items-center mb-3">
                        <Badge className="bg-purple-600 text-[10px] font-black h-4 border-none text-white uppercase">{s.marketplace}</Badge>
                        <div className={`text-[10px] font-black uppercase flex items-center gap-1 ${s.searchTrend === 'rising' ? 'text-green-600' : 'text-slate-400'}`}>
                           Trend {s.searchTrend}
                        </div>
                     </div>
                     <div className="flex items-end justify-between">
                        <div>
                           <div className="text-[9px] font-black text-slate-400 uppercase mb-1 leading-none">Top Keyword</div>
                           <div className="text-xs font-bold text-purple-800 italic">"{s.keyword}"</div>
                        </div>
                        <div className="text-right">
                           <div className="text-2xl font-black text-slate-800 leading-none">#{s.rank}</div>
                           <div className="text-[9px] font-black text-slate-400 uppercase leading-none mt-1">Search Rank</div>
                        </div>
                     </div>
                  </div>
                ))}
              </div>

              <div className="w-full lg:w-32 flex lg:flex-col items-center lg:items-end justify-between gap-3">
                 <div className="text-right">
                    <div className="text-[10px] font-black text-slate-400 uppercase leading-none mb-1">Visibility Score</div>
                    <div className="text-2xl font-black text-slate-800 leading-none">74%</div>
                 </div>
                 <Button variant="ghost" size="sm" className="h-8 px-2 text-[10px] font-black uppercase hover:bg-purple-50 text-purple-600">
                    SEO Tools <ExternalLink className="w-3 h-3 ml-1" />
                 </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 border-2 border-purple-50 bg-purple-50/10 shadow-md">
           <div className="flex items-center gap-3 mb-4 text-purple-600">
              <RefreshCw className="w-5 h-5" />
              <h3 className="font-bold text-sm uppercase tracking-tighter">Rank Tracker Sync</h3>
           </div>
           <p className="text-[11px] text-purple-600 font-medium leading-tight mb-4">
              Обновление позиций по 1,200 ключевым словам завершено. Обнаружен рост видимости в категории "Трикотаж".
           </p>
           <Button size="sm" className="w-full bg-purple-600 hover:bg-purple-700 text-white font-black uppercase text-[9px] h-8 shadow-sm">
              Full SEO Report
           </Button>
        </Card>

        <Card className="p-6 border-2 border-purple-50 bg-purple-50/10 shadow-md">
           <div className="flex items-center gap-3 mb-4 text-purple-600">
              <BarChart3 className="w-5 h-5" />
              <h3 className="font-bold text-sm uppercase tracking-tighter">Keyword Gaps</h3>
           </div>
           <p className="text-[11px] text-purple-600 font-medium leading-tight mb-4">
              Ваши SKU выпадают из ТОП-10 по запросу "кардиган шерсть". Рекомендуется оптимизация описания.
           </p>
        </Card>

        <Card className="p-6 border-2 border-slate-100 bg-slate-50/20 shadow-md">
           <h3 className="font-black text-[10px] uppercase text-slate-400 mb-4 tracking-widest">Visibility Heatmap</h3>
           <div className="h-20 flex items-end gap-1.5">
              {[40, 60, 45, 90, 75, 80, 55, 95].map((h, i) => (
                <div key={i} className="flex-1 bg-purple-200 rounded-t-sm hover:bg-purple-400 transition-colors" style={{ height: `${h}%` }} />
              ))}
           </div>
           <div className="mt-2 text-[8px] font-bold text-slate-400 uppercase flex justify-between">
              <span>Mon</span>
              <span>Today</span>
           </div>
        </Card>
      </div>
    </div>
  );
}
