'use client';

import React, { useState } from 'react';
import {
  Handshake,
  Target,
  TrendingUp,
  ShieldCheck,
  Zap,
  ArrowRight,
  Filter,
  Search,
  Globe,
  Layers,
  BadgePercent,
  Star,
  Info,
  MessageSquare,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const MOCK_DISCOVERY_BRANDS = [
  {
    id: 'b1',
    name: 'Nordic Wool',
    matchScore: 94,
    retailersCount: 42,
    avgMargin: '45%',
    minOrder: '500k ₽',
    tags: ['Eco', 'Premium', 'Contemporary'],
    trends: 'Rising in Urban areas',
    inventoryStatus: 'ATS High',
  },
  {
    id: 'b2',
    name: 'Cyber Silk',
    matchScore: 82,
    retailersCount: 12,
    avgMargin: '52%',
    minOrder: '300k ₽',
    tags: ['Techwear', 'Limited'],
    trends: 'Gen-Z Favorite',
    inventoryStatus: 'Pre-order Only',
  },
];

export function B2BPartnershipDiscovery() {
  const [activeFilter, setActiveFilter] = useState('match');

  return (
    <div className="space-y-10 duration-300 animate-in fade-in">
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
        <Card className="relative overflow-hidden rounded-xl border-none bg-slate-900 p-3 text-white shadow-2xl lg:col-span-2">
          <div className="absolute right-0 top-0 p-4 opacity-10">
            <Target className="h-48 w-48" />
          </div>
          <div className="relative z-10 space-y-6">
            <div className="space-y-2">
              <Badge className="border-none bg-indigo-600 text-[9px] font-black uppercase tracking-widest text-white">
                AI Matchmaker Active
              </Badge>
              <h3 className="text-sm font-black uppercase tracking-tighter">
                Поиск идеальных партнеров
              </h3>
              <p className="max-w-xl font-medium text-slate-400">
                Наш алгоритм анализирует вашу аудиторию и продажи, чтобы предложить бренды с
                максимальным потенциалом прибыли.
              </p>
            </div>
            <div className="flex gap-3">
              <Button className="h-10 rounded-2xl bg-white px-8 text-[10px] font-black uppercase tracking-widest text-slate-900 shadow-2xl transition-transform hover:scale-105">
                Запустить Smart Matching
              </Button>
              <Button
                variant="outline"
                className="h-10 rounded-2xl border-white/20 px-8 text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/5"
              >
                Фильтры сегментов
              </Button>
            </div>
          </div>
        </Card>

        <Card className="flex flex-col justify-between space-y-6 rounded-xl border-none bg-indigo-50 p-4 shadow-xl">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg">
                <TrendingUp className="h-5 w-5" />
              </div>
              <span className="text-[11px] font-black uppercase tracking-widest text-indigo-900">
                Рыночные Тренды
              </span>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Outdoor Tech', val: '+24%', color: 'text-emerald-600' },
                { label: 'Eco Knits', val: '+18%', color: 'text-emerald-600' },
                { label: 'Fast Luxury', val: '-5%', color: 'text-rose-600' },
              ].map((trend, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between border-b border-indigo-100 py-2"
                >
                  <span className="text-[10px] font-bold uppercase text-indigo-900">
                    {trend.label}
                  </span>
                  <span className={cn('text-xs font-black', trend.color)}>{trend.val}</span>
                </div>
              ))}
            </div>
          </div>
          <p className="text-[9px] font-medium italic text-indigo-700/60">
            «Обновлено 5 минут назад на основе данных B2B заказов»
          </p>
        </Card>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-400">
            Рекомендуемые бренды для вашего магазина
          </h4>
          <div className="flex gap-2 rounded-xl border border-slate-100 bg-white p-1 shadow-sm">
            {['match', 'margin', 'new'].map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={cn(
                  'rounded-lg px-4 py-2 text-[9px] font-black uppercase transition-all',
                  activeFilter === f
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-400 hover:text-slate-600'
                )}
              >
                {f === 'match' ? 'Match Score' : f === 'margin' ? 'Высокая маржа' : 'Новинки'}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {MOCK_DISCOVERY_BRANDS.map((brand) => (
            <Card
              key={brand.id}
              className="group overflow-hidden rounded-xl border-none bg-white shadow-xl transition-all hover:shadow-2xl"
            >
              <CardContent className="p-0">
                <div className="grid grid-cols-1 md:grid-cols-12">
                  <div className="relative flex flex-col items-center justify-center border-r border-slate-100 bg-slate-50 p-4 md:col-span-4">
                    <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-white shadow-lg transition-transform group-hover:scale-110">
                      <Globe className="h-10 w-10 text-slate-200" />
                    </div>
                    <h4 className="text-base font-black uppercase tracking-tighter text-slate-900">
                      {brand.name}
                    </h4>
                    <Badge className="mt-2 border-none bg-indigo-50 text-[8px] font-black text-indigo-600">
                      {brand.inventoryStatus}
                    </Badge>

                    <div className="absolute left-4 top-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full border-4 border-emerald-50 bg-white shadow-sm">
                        <span className="text-xs font-black text-emerald-600">
                          {brand.matchScore}%
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-6 p-4 md:col-span-8">
                    <div className="grid grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <p className="text-[8px] font-black uppercase text-slate-400">Ср. Маржа</p>
                        <p className="text-sm font-black text-slate-900">{brand.avgMargin}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[8px] font-black uppercase text-slate-400">Мин. заказ</p>
                        <p className="text-sm font-black text-slate-900">{brand.minOrder}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[8px] font-black uppercase text-slate-400">Ритейлеров</p>
                        <p className="text-sm font-black text-slate-900">{brand.retailersCount}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {brand.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="border-slate-200 text-[8px] font-bold uppercase"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4">
                      <p className="flex items-center gap-2 text-[9px] font-black uppercase text-amber-900">
                        <Zap className="h-3 w-3 fill-amber-500 text-amber-500" /> AI Insight
                      </p>
                      <p className="mt-1 text-[10px] font-medium italic text-amber-800/80">
                        {brand.trends}
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <Button className="h-12 flex-1 rounded-xl bg-black text-[9px] font-black uppercase tracking-widest text-white shadow-xl transition-colors group-hover:bg-indigo-600">
                        Запросить партнерство
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-12 w-12 rounded-xl bg-slate-50"
                      >
                        <Info className="h-4 w-4 text-slate-400" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
