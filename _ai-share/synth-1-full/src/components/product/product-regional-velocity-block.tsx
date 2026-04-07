'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Target, Info, Activity, Globe } from 'lucide-react';
import { getNationalVelocitySummary } from '@/lib/fashion/regional-velocity';
import type { Product } from '@/lib/types';
import { Progress } from '@/components/ui/progress';

export function ProductRegionalVelocityBlock({ product }: { product: Product }) {
  const velocityData = getNationalVelocitySummary(product.sku);

  return (
    <Card className="p-4 border-2 border-slate-100 bg-white shadow-sm my-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-indigo-600" />
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-700">Predictive Regional Sell-Through</h4>
        </div>
        <Badge variant="outline" className="text-[8px] font-black border-slate-200 uppercase">
           AI Velocity V2
        </Badge>
      </div>

      <div className="space-y-3">
         {velocityData.map(item => (
           <div key={item.region} className="space-y-1.5">
              <div className="flex justify-between items-center text-[9px] font-black uppercase">
                 <span className="text-slate-500">{item.region}</span>
                 <span className="text-indigo-600">{item.predictedSellThrough}% Forecast</span>
              </div>
              <Progress value={item.predictedSellThrough} className="h-1 bg-slate-50 fill-indigo-500" />
              <div className="flex justify-between items-center text-[7px] font-bold text-slate-400 uppercase">
                 <span>Top Size: {item.topSizeRank[0]}</span>
                 <span>Trend Factor: {item.localTrendFactor}x</span>
              </div>
           </div>
         ))}
      </div>

      <div className="mt-4 p-2.5 bg-indigo-50 rounded-lg border border-indigo-100 flex gap-2 items-start">
         <Target className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
         <div className="text-[9px] text-indigo-700 font-medium leading-tight">
            <b>Прогноз оборачиваемости:</b> Данные основаны на анализе продаж аналогичных товаров в ФО РФ за последние 24 месяца. Рекомендуется увеличить аллокацию в Центральный и Южный регионы.
         </div>
      </div>
    </Card>
  );
}
