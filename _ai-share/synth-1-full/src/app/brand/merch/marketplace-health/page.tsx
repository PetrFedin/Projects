'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { HeartPulse, Target, TrendingUp, AlertTriangle, Info, ShoppingBag, ExternalLink, RefreshCw, BarChart3 } from 'lucide-react';
import { products } from '@/lib/products';
import { getMarketplaceHealth } from '@/lib/fashion/marketplace-health';
import { Button } from '@/components/ui/button';

export default function MarketplaceHealthPage() {
  const healthData = products.slice(0, 10).map(p => ({
    product: p,
    health: getMarketplaceHealth(p)
  }));
  
  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-emerald-100 rounded-lg shadow-sm">
            <HeartPulse className="w-6 h-6 text-emerald-600" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800 tracking-tighter uppercase">Marketplace Health Card</h1>
        </div>
        <p className="text-muted-foreground font-medium">
           Глубокая аналитика карточек товаров на WB и Ozon: Buybox, рейтинг, риски OOS и процент выкупа.
        </p>
      </div>

      <div className="space-y-4">
        {healthData.map(({ product, health }) => (
          <Card key={product.id} className="p-5 overflow-hidden border-2 border-slate-50 hover:border-emerald-100 transition-all shadow-sm">
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
                {health.map((h, i) => (
                  <div key={i} className="p-4 bg-emerald-50/20 rounded-xl border border-emerald-50 relative group">
                     <div className="flex justify-between items-center mb-3">
                        <Badge className="bg-emerald-600 text-[10px] font-black h-4 border-none text-white uppercase">{h.marketplace}</Badge>
                        <div className={`text-[10px] font-black uppercase flex items-center gap-1 ${h.buyboxStatus === 'won' ? 'text-green-600' : 'text-rose-600'}`}>
                           {h.buyboxStatus === 'won' ? <Target className="w-3.5 h-3.5" /> : <Info className="w-3.5 h-3.5" />}
                           Buybox {h.buyboxStatus}
                        </div>
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col">
                           <span className="text-[9px] font-black text-slate-400 uppercase mb-1 leading-none">Buyback (Выкуп)</span>
                           <span className="text-sm font-black text-emerald-700">{h.buybackRate}%</span>
                        </div>
                        <div className="flex flex-col items-end">
                           <span className="text-[9px] font-black text-slate-400 uppercase mb-1 leading-none">OOS Risk</span>
                           <span className={`text-sm font-black ${h.outOfStockRisk > 30 ? 'text-orange-500' : 'text-green-500'}`}>{h.outOfStockRisk}%</span>
                        </div>
                     </div>
                  </div>
                ))}
              </div>

              <div className="w-full lg:w-32 flex lg:flex-col items-center lg:items-end justify-between gap-3">
                 <div className="text-right">
                    <div className="text-[10px] font-black text-slate-400 uppercase leading-none mb-1">Health Score</div>
                    <div className="text-2xl font-black text-slate-800 leading-none">88%</div>
                 </div>
                 <Button variant="ghost" size="sm" className="h-8 px-2 text-[10px] font-black uppercase hover:bg-emerald-50 text-emerald-600">
                    Details <ExternalLink className="w-3 h-3 ml-1" />
                 </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 border-2 border-emerald-50 bg-emerald-50/10 shadow-md relative overflow-hidden group transition-all hover:scale-[1.02]">
           <div className="absolute top-0 right-0 p-4 opacity-5 rotate-12 group-hover:scale-110 transition-transform">
              <RefreshCw className="w-16 h-16 text-emerald-600" />
           </div>
           <div className="flex items-center gap-3 mb-4 text-emerald-600">
              <RefreshCw className="w-5 h-5" />
              <h3 className="font-bold text-sm uppercase tracking-tighter">Aggregated Sync</h3>
           </div>
           <div className="space-y-3">
              <div className="flex justify-between items-center text-xs">
                 <span className="text-slate-500 font-bold uppercase text-[10px]">Active Cards</span>
                 <span className="font-black">124</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                 <span className="text-slate-500 font-bold uppercase text-[10px]">Critical Alerts</span>
                 <span className="font-black text-rose-500">3</span>
              </div>
           </div>
        </Card>

        <Card className="p-6 border-2 border-emerald-50 bg-emerald-50/10 shadow-md relative overflow-hidden group transition-all hover:scale-[1.02]">
           <div className="absolute top-0 right-0 p-4 opacity-5 rotate-12 group-hover:scale-110 transition-transform">
              <Target className="w-16 h-16 text-emerald-600" />
           </div>
           <div className="flex items-center gap-3 mb-4 text-emerald-600">
              <BarChart3 className="w-5 h-5" />
              <h3 className="font-bold text-sm uppercase tracking-tighter">Buyback Optimization</h3>
           </div>
           <p className="text-[11px] text-emerald-600 font-medium leading-tight mb-4">
              Средний процент выкупа по коллекции вырос на 4.2% после внедрения AI-фиттинга.
           </p>
        </Card>

        <Card className="p-6 border-2 border-emerald-50 bg-emerald-50/10 shadow-md relative overflow-hidden group transition-all hover:scale-[1.02]">
           <div className="absolute top-0 right-0 p-4 opacity-5 rotate-12 group-hover:scale-110 transition-transform">
              <AlertTriangle className="w-16 h-16 text-orange-600" />
           </div>
           <div className="flex items-center gap-3 mb-4 text-orange-600">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="font-bold text-sm uppercase tracking-tighter">Inventory Risk</h3>
           </div>
           <p className="text-[11px] text-orange-600 font-medium leading-tight mb-4">
              5 SKU в категории "Верхняя одежда" имеют риск OOS более 60% в ближайшие 7 дней.
           </p>
        </Card>
      </div>
    </div>
  );
}
