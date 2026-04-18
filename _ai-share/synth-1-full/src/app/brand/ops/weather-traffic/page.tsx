'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
<<<<<<< HEAD
=======
import { Button } from '@/components/ui/button';
>>>>>>> recover/cabinet-wip-from-stash
import {
  Map,
  CloudRain,
  Sun,
  Snowflake,
  Thermometer,
  TrendingDown,
  TrendingUp,
  Info,
  ShoppingBag,
} from 'lucide-react';
import { getStoreWeatherImpact } from '@/lib/fashion/weather-impact';

export default function WeatherTrafficPage() {
  const data = getStoreWeatherImpact();

  return (
    <div className="mx-auto max-w-5xl p-8">
      <div className="mb-8">
        <div className="mb-2 flex items-center gap-3">
          <div className="rounded-lg bg-sky-100 p-2 shadow-sm">
            <CloudRain className="h-6 w-6 text-sky-600" />
          </div>
<<<<<<< HEAD
          <h1 className="text-3xl font-bold uppercase tracking-tight tracking-tighter text-slate-800">
=======
          <h1 className="text-text-primary text-3xl font-bold uppercase tracking-tight tracking-tighter">
>>>>>>> recover/cabinet-wip-from-stash
            Store Weather Correlation
          </h1>
        </div>
        <p className="font-medium text-muted-foreground">
          Анализ влияния погодных условий на трафик оффлайн-магазинов и рекомендации по
          ассортименту.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {data.map((item, idx) => {
          const isPositive = item.trafficImpact > 0;

          return (
            <Card
              key={idx}
<<<<<<< HEAD
              className="group relative overflow-hidden border-2 border-slate-50 p-6 shadow-sm transition-all hover:border-sky-100"
=======
              className="border-border-subtle group relative overflow-hidden border-2 p-6 shadow-sm transition-all hover:border-sky-100"
>>>>>>> recover/cabinet-wip-from-stash
            >
              <div className="absolute right-0 top-0 p-4 opacity-10 transition-transform group-hover:scale-110">
                {item.weatherCondition === 'rain' ? (
                  <CloudRain className="h-16 w-16 text-sky-600" />
                ) : (
                  <Snowflake className="h-16 w-16 text-blue-400" />
                )}
              </div>

              <div className="mb-6 flex items-center justify-between">
                <div>
<<<<<<< HEAD
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    {item.date}
                  </div>
                  <div className="mt-1 text-xl font-black text-slate-800">{item.storeId}</div>
=======
                  <div className="text-text-muted text-[10px] font-black uppercase tracking-widest">
                    {item.date}
                  </div>
                  <div className="text-text-primary mt-1 text-xl font-black">{item.storeId}</div>
>>>>>>> recover/cabinet-wip-from-stash
                </div>
                <div className="text-right">
                  <div
                    className={`flex items-center justify-end gap-1.5 text-2xl font-black uppercase ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}
                  >
                    {isPositive ? (
                      <TrendingUp className="h-6 w-6" />
                    ) : (
                      <TrendingDown className="h-6 w-6" />
                    )}
                    {isPositive ? '+' : ''}
                    {item.trafficImpact}%
                  </div>
<<<<<<< HEAD
                  <div className="mt-1 text-[10px] font-black uppercase leading-none text-slate-400">
=======
                  <div className="text-text-muted mt-1 text-[10px] font-black uppercase leading-none">
>>>>>>> recover/cabinet-wip-from-stash
                    Traffic Impact
                  </div>
                </div>
              </div>

              <div className="mb-6 flex items-center gap-4 rounded-xl border border-sky-100 bg-sky-50/50 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border bg-white shadow-sm">
                  <Thermometer className="h-5 w-5 text-sky-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="mb-0.5 text-[10px] font-black uppercase leading-none text-sky-500">
                    Condition
                  </div>
                  <div className="text-sm font-bold capitalize text-sky-700">
                    {item.weatherCondition}
                  </div>
                </div>
              </div>

<<<<<<< HEAD
              <div className="space-y-4 border-t border-slate-50 pt-4">
                <div className="mb-2 flex items-center gap-1.5 text-[10px] font-black uppercase text-slate-400">
=======
              <div className="border-border-subtle space-y-4 border-t pt-4">
                <div className="text-text-muted mb-2 flex items-center gap-1.5 text-[10px] font-black uppercase">
>>>>>>> recover/cabinet-wip-from-stash
                  <ShoppingBag className="h-3.5 w-3.5" /> Recommended Stock Push
                </div>
                <div className="flex flex-wrap gap-2">
                  {item.recommendedStock.map((sku) => (
                    <Badge
                      key={sku}
                      variant="outline"
                      className="h-5 border-sky-200 bg-white text-[9px] font-bold uppercase text-sky-700 shadow-sm"
                    >
                      {sku}
                    </Badge>
                  ))}
                </div>
              </div>

<<<<<<< HEAD
              <div className="mt-6 flex items-center gap-2 border-t border-slate-50 pt-3 text-[9px] font-bold uppercase italic leading-none text-slate-400">
=======
              <div className="border-border-subtle text-text-muted mt-6 flex items-center gap-2 border-t pt-3 text-[9px] font-bold uppercase italic leading-none">
>>>>>>> recover/cabinet-wip-from-stash
                <Info className="h-3 w-3" /> Met Office Integration Active • Local Ops v2.4
              </div>
            </Card>
          );
        })}
      </div>

<<<<<<< HEAD
      <div className="mt-8 flex flex-col items-center gap-6 rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-md md:flex-row">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-slate-300 bg-white shadow-md">
          <CloudRain className="h-7 w-7 text-sky-600" />
        </div>
        <div className="flex-1">
          <div className="mb-1 text-xs font-black uppercase tracking-tight text-slate-400">
            AI Weather Attribution
          </div>
          <div className="text-[14px] font-medium leading-tight tracking-tight text-slate-700">
=======
      <div className="bg-bg-surface2 border-border-default mt-8 flex flex-col items-center gap-6 rounded-2xl border p-6 shadow-md md:flex-row">
        <div className="border-border-default flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 bg-white shadow-md">
          <CloudRain className="h-7 w-7 text-sky-600" />
        </div>
        <div className="flex-1">
          <div className="text-text-muted mb-1 text-xs font-black uppercase tracking-tight">
            AI Weather Attribution
          </div>
          <div className="text-text-primary text-[14px] font-medium leading-tight tracking-tight">
>>>>>>> recover/cabinet-wip-from-stash
            На основе прогноза погоды на ближайшие 48 часов в Москве (дождь), рекомендуется{' '}
            <b>увеличить фронтальную выкладку зонтов и дождевиков</b> в магазине MSK-CITY.
          </div>
        </div>
        <Button
          size="sm"
<<<<<<< HEAD
          className="h-10 w-full bg-slate-800 text-[10px] font-bold uppercase tracking-widest text-white shadow-lg hover:bg-slate-900 md:w-auto"
=======
          className="bg-text-primary/90 hover:bg-text-primary/90 h-10 w-full text-[10px] font-bold uppercase tracking-widest text-white shadow-lg md:w-auto"
>>>>>>> recover/cabinet-wip-from-stash
        >
          View Full Forecast
        </Button>
      </div>
    </div>
  );
}
