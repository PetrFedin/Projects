'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Map, CloudRain, Sun, Snowflake, Thermometer, TrendingDown, TrendingUp, Info, ShoppingBag } from 'lucide-react';
import { getStoreWeatherImpact } from '@/lib/fashion/weather-impact';

export default function WeatherTrafficPage() {
  const data = getStoreWeatherImpact();
  
  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-sky-100 rounded-lg shadow-sm">
            <CloudRain className="w-6 h-6 text-sky-600" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800 tracking-tighter uppercase">Store Weather Correlation</h1>
        </div>
        <p className="text-muted-foreground font-medium">
           Анализ влияния погодных условий на трафик оффлайн-магазинов и рекомендации по ассортименту.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {data.map((item, idx) => {
          const isPositive = item.trafficImpact > 0;
          
          return (
            <Card key={idx} className="p-6 border-2 border-slate-50 hover:border-sky-100 transition-all shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                {item.weatherCondition === 'rain' ? <CloudRain className="w-16 h-16 text-sky-600" /> : <Snowflake className="w-16 h-16 text-blue-400" />}
              </div>

              <div className="flex items-center justify-between mb-6">
                 <div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.date}</div>
                    <div className="text-xl font-black text-slate-800 mt-1">{item.storeId}</div>
                 </div>
                 <div className="text-right">
                    <div className={`text-2xl font-black uppercase flex items-center gap-1.5 justify-end ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                       {isPositive ? <TrendingUp className="w-6 h-6" /> : <TrendingDown className="w-6 h-6" />}
                       {isPositive ? '+' : ''}{item.trafficImpact}%
                    </div>
                    <div className="text-[10px] font-black text-slate-400 uppercase leading-none mt-1">Traffic Impact</div>
                 </div>
              </div>

              <div className="p-4 bg-sky-50/50 rounded-xl border border-sky-100 mb-6 flex items-center gap-4">
                 <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border shadow-sm shrink-0">
                    <Thermometer className="w-5 h-5 text-sky-600" />
                 </div>
                 <div className="flex-1 min-w-0">
                    <div className="text-[10px] font-black text-sky-500 uppercase mb-0.5 leading-none">Condition</div>
                    <div className="text-sm font-bold text-sky-700 capitalize">{item.weatherCondition}</div>
                 </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-50">
                 <div className="text-[10px] font-black text-slate-400 uppercase mb-2 flex items-center gap-1.5">
                    <ShoppingBag className="w-3.5 h-3.5" /> Recommended Stock Push
                 </div>
                 <div className="flex flex-wrap gap-2">
                    {item.recommendedStock.map(sku => (
                      <Badge key={sku} variant="outline" className="text-[9px] h-5 bg-white border-sky-200 text-sky-700 font-bold uppercase shadow-sm">
                        {sku}
                      </Badge>
                    ))}
                 </div>
              </div>

              <div className="mt-6 pt-3 border-t border-slate-50 flex items-center gap-2 text-[9px] text-slate-400 font-bold uppercase italic leading-none">
                 <Info className="w-3 h-3" /> Met Office Integration Active • Local Ops v2.4
              </div>
            </Card>
          );
        })}
      </div>

      <div className="mt-8 p-6 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col md:flex-row gap-6 items-center shadow-md">
        <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center border-2 border-slate-300 shadow-md shrink-0">
          <CloudRain className="w-7 h-7 text-sky-600" />
        </div>
        <div className="flex-1">
          <div className="text-xs font-black text-slate-400 uppercase mb-1 tracking-tight">AI Weather Attribution</div>
          <div className="text-[14px] text-slate-700 font-medium leading-tight tracking-tight">
             На основе прогноза погоды на ближайшие 48 часов в Москве (дождь), рекомендуется <b>увеличить фронтальную выкладку зонтов и дождевиков</b> в магазине MSK-CITY.
          </div>
        </div>
        <Button size="sm" className="w-full md:w-auto bg-slate-800 hover:bg-slate-900 font-bold uppercase text-[10px] h-10 tracking-widest text-white shadow-lg">
           View Full Forecast
        </Button>
      </div>
    </div>
  );
}
