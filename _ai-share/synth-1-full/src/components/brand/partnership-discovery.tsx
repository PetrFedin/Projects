'use client';

import React, { useState } from 'react';
import { 
  Handshake, Target, TrendingUp, ShieldCheck, 
  Zap, ArrowRight, Filter, Search, Globe, 
  Layers, BadgePercent, Star, Info, MessageSquare
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
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
    inventoryStatus: 'ATS High'
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
    inventoryStatus: 'Pre-order Only'
  }
];

export function B2BPartnershipDiscovery() {
  const [activeFilter, setActiveFilter] = useState('match');

  return (
    <div className="space-y-10 animate-in fade-in duration-300">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
         <Card className="lg:col-span-2 rounded-xl border-none shadow-2xl bg-slate-900 text-white p-3 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
               <Target className="h-48 w-48" />
            </div>
            <div className="relative z-10 space-y-6">
               <div className="space-y-2">
                  <Badge className="bg-indigo-600 text-white border-none uppercase text-[9px] font-black tracking-widest">AI Matchmaker Active</Badge>
                  <h3 className="text-sm font-black uppercase tracking-tighter">Поиск идеальных партнеров</h3>
                  <p className="text-slate-400 font-medium max-w-xl">
                     Наш алгоритм анализирует вашу аудиторию и продажи, чтобы предложить бренды с максимальным потенциалом прибыли.
                  </p>
               </div>
               <div className="flex gap-3">
                  <Button className="h-10 px-8 bg-white text-slate-900 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:scale-105 transition-transform shadow-2xl">Запустить Smart Matching</Button>
                  <Button variant="outline" className="h-10 px-8 border-white/20 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-white/5">Фильтры сегментов</Button>
               </div>
            </div>
         </Card>

         <Card className="rounded-xl border-none shadow-xl bg-indigo-50 p-4 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
               <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                     <TrendingUp className="h-5 w-5" />
                  </div>
                  <span className="text-[11px] font-black uppercase text-indigo-900 tracking-widest">Рыночные Тренды</span>
               </div>
               <div className="space-y-3">
                  {[
                    { label: 'Outdoor Tech', val: '+24%', color: 'text-emerald-600' },
                    { label: 'Eco Knits', val: '+18%', color: 'text-emerald-600' },
                    { label: 'Fast Luxury', val: '-5%', color: 'text-rose-600' }
                  ].map((trend, i) => (
                    <div key={i} className="flex justify-between items-center py-2 border-b border-indigo-100">
                       <span className="text-[10px] font-bold text-indigo-900 uppercase">{trend.label}</span>
                       <span className={cn("text-xs font-black", trend.color)}>{trend.val}</span>
                    </div>
                  ))}
               </div>
            </div>
            <p className="text-[9px] text-indigo-700/60 font-medium italic">«Обновлено 5 минут назад на основе данных B2B заказов»</p>
         </Card>
      </div>

      <div className="space-y-6">
         <div className="flex items-center justify-between">
            <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-400">Рекомендуемые бренды для вашего магазина</h4>
            <div className="flex gap-2 p-1 bg-white rounded-xl border border-slate-100 shadow-sm">
               {['match', 'margin', 'new'].map(f => (
                 <button 
                   key={f}
                   onClick={() => setActiveFilter(f)}
                   className={cn(
                     "px-4 py-2 rounded-lg text-[9px] font-black uppercase transition-all",
                     activeFilter === f ? "bg-slate-900 text-white" : "text-slate-400 hover:text-slate-600"
                   )}
                 >
                   {f === 'match' ? 'Match Score' : f === 'margin' ? 'Высокая маржа' : 'Новинки'}
                 </button>
               ))}
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {MOCK_DISCOVERY_BRANDS.map(brand => (
              <Card key={brand.id} className="rounded-xl border-none shadow-xl overflow-hidden bg-white group hover:shadow-2xl transition-all">
                 <CardContent className="p-0">
                    <div className="grid grid-cols-1 md:grid-cols-12">
                       <div className="md:col-span-4 bg-slate-50 p-4 flex flex-col items-center justify-center border-r border-slate-100 relative">
                          <div className="h-20 w-20 bg-white rounded-3xl shadow-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                             <Globe className="h-10 w-10 text-slate-200" />
                          </div>
                          <h4 className="text-base font-black uppercase tracking-tighter text-slate-900">{brand.name}</h4>
                          <Badge className="mt-2 bg-indigo-50 text-indigo-600 border-none text-[8px] font-black">{brand.inventoryStatus}</Badge>
                          
                          <div className="absolute top-4 left-4">
                             <div className="h-12 w-12 rounded-full border-4 border-emerald-50 flex items-center justify-center bg-white shadow-sm">
                                <span className="text-xs font-black text-emerald-600">{brand.matchScore}%</span>
                             </div>
                          </div>
                       </div>
                       <div className="md:col-span-8 p-4 space-y-6">
                          <div className="grid grid-cols-3 gap-3">
                             <div className="space-y-1">
                                <p className="text-[8px] font-black text-slate-400 uppercase">Ср. Маржа</p>
                                <p className="text-sm font-black text-slate-900">{brand.avgMargin}</p>
                             </div>
                             <div className="space-y-1">
                                <p className="text-[8px] font-black text-slate-400 uppercase">Мин. заказ</p>
                                <p className="text-sm font-black text-slate-900">{brand.minOrder}</p>
                             </div>
                             <div className="space-y-1">
                                <p className="text-[8px] font-black text-slate-400 uppercase">Ритейлеров</p>
                                <p className="text-sm font-black text-slate-900">{brand.retailersCount}</p>
                             </div>
                          </div>

                          <div className="flex flex-wrap gap-2">
                             {brand.tags.map(tag => (
                               <Badge key={tag} variant="outline" className="text-[8px] font-bold uppercase border-slate-200">{tag}</Badge>
                             ))}
                          </div>

                          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
                             <p className="text-[9px] font-black text-amber-900 uppercase flex items-center gap-2">
                                <Zap className="h-3 w-3 fill-amber-500 text-amber-500" /> AI Insight
                             </p>
                             <p className="text-[10px] text-amber-800/80 font-medium mt-1 italic">{brand.trends}</p>
                          </div>

                          <div className="flex gap-3">
                             <Button className="flex-1 h-12 bg-black text-white rounded-xl font-black uppercase text-[9px] tracking-widest shadow-xl group-hover:bg-indigo-600 transition-colors">Запросить партнерство</Button>
                             <Button variant="ghost" size="icon" className="h-12 w-12 rounded-xl bg-slate-50"><Info className="h-4 w-4 text-slate-400" /></Button>
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
