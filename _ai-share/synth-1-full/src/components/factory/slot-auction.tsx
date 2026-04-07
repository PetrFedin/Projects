'use client';

import React, { useState } from 'react';
import { 
  Factory, Gavel, Clock, Zap, TrendingUp, 
  ArrowRight, ShieldCheck, CheckCircle2, 
  RefreshCcw, Info, Activity, Calendar,
  Layout, Grid2X2, DollarSign
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const MOCK_SLOTS = [
  { id: 's1', factory: 'Syntha Moscow 01', line: 'Line A (Outerwear)', capacity: '500 ед.', date: '12 фев - 18 фев', currentBid: '42,000 ₽', timeLeft: '02:45:12', bids: 12 },
  { id: 's2', factory: 'Textile Hub Spb', line: 'Line B (Knitwear)', capacity: '1,200 ед.', date: '05 мар - 15 мар', currentBid: '125,000 ₽', timeLeft: '14:20:00', bids: 8 },
  { id: 's3', factory: 'Denim Lab 04', line: 'Line D (Denim)', capacity: '300 ед.', date: '18 фев - 22 фев', currentBid: '28,500 ₽', timeLeft: '00:15:42', bids: 24 }
];

export function SlotAuction() {
  const [activeTab, setActiveTab] = useState<'live' | 'upcoming'>('live');

  return (
    <Card className="rounded-xl border-none shadow-2xl overflow-hidden bg-white">
      <CardHeader className="p-3 pb-4">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <div className="flex items-center gap-2 mb-1">
              <div className="h-6 w-6 bg-amber-500 rounded-lg flex items-center justify-center shadow-lg shadow-amber-200">
                <Gavel className="h-4 w-4 text-white" />
              </div>
              <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Predictive Production Hub</span>
            </div>
            <CardTitle className="text-base font-black uppercase tracking-tighter">Аукцион производственных слотов</CardTitle>
            <CardDescription className="text-sm font-medium">Выкупайте «горящие окна» на фабриках со скидкой до 30% или торгуйтесь за приоритетное производство.</CardDescription>
          </div>
          <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200">
             <button 
                onClick={() => setActiveTab('live')}
                className={cn("px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all", activeTab === 'live' ? "bg-white text-black shadow-sm" : "text-slate-400")}
             >
               Live Торги
             </button>
             <button 
                onClick={() => setActiveTab('upcoming')}
                className={cn("px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all", activeTab === 'upcoming' ? "bg-white text-black shadow-sm" : "text-slate-400")}
             >
               Анонсы слотов
             </button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-3 pt-4 space-y-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          {MOCK_SLOTS.map((slot) => (
            <motion.div 
              key={slot.id}
              whileHover={{ y: -10 }}
              className="group relative flex flex-col bg-slate-50 border border-slate-100 rounded-xl p-4 shadow-sm hover:shadow-2xl hover:border-amber-200 transition-all overflow-hidden"
            >
               <div className="flex justify-between items-start mb-6">
                  <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center shadow-sm">
                     <Factory className="h-6 w-6 text-slate-400 group-hover:text-amber-500 transition-colors" />
                  </div>
                  <Badge className="bg-rose-500 text-white border-none text-[8px] font-black uppercase px-2 py-1 animate-pulse">Live Auction</Badge>
               </div>

               <div className="space-y-4 mb-8">
                  <div>
                     <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{slot.factory}</p>
                     <h4 className="text-base font-black uppercase tracking-tighter text-slate-900">{slot.line}</h4>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                     <div className="space-y-1">
                        <p className="text-[8px] font-black text-slate-400 uppercase">Мощность</p>
                        <p className="text-xs font-black text-slate-900">{slot.capacity}</p>
                     </div>
                     <div className="space-y-1">
                        <p className="text-[8px] font-black text-slate-400 uppercase">Даты окна</p>
                        <p className="text-xs font-black text-indigo-600">{slot.date}</p>
                     </div>
                  </div>
               </div>

               <div className="p-4 bg-white rounded-3xl border border-slate-100 shadow-sm space-y-4">
                  <div className="flex justify-between items-end">
                     <div>
                        <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Текущая ставка (слот)</p>
                        <p className="text-sm font-black text-slate-900 tabular-nums">{slot.currentBid}</p>
                     </div>
                     <div className="text-right">
                        <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Ставок</p>
                        <p className="text-sm font-black text-indigo-600 tabular-nums">{slot.bids}</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-rose-500">
                     <Clock className="h-3 w-3" />
                     До конца: {slot.timeLeft}
                  </div>
               </div>

               <Button className="mt-6 w-full h-10 bg-black text-white rounded-[1.5rem] font-black uppercase text-[10px] tracking-widest hover:bg-amber-500 hover:scale-105 transition-all shadow-xl">
                  Сделать ставку +5,000 ₽
               </Button>

               {/* Background pattern */}
               <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:scale-110 transition-transform">
                  <Gavel className="h-32 w-32" />
               </div>
            </motion.div>
          ))}
        </div>

        {/* Predictive Insight */}
        <div className="p-4 bg-slate-900 rounded-xl text-white flex items-center justify-between overflow-hidden relative">
           <div className="absolute top-0 right-0 p-4 opacity-10">
              <Zap className="h-32 w-32" />
           </div>
           <div className="flex items-center gap-3 relative z-10">
              <div className="h-12 w-12 bg-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl">
                 <RefreshCcw className="h-8 w-8 animate-spin-slow" />
              </div>
              <div className="space-y-1">
                 <h4 className="text-sm font-black uppercase tracking-tighter">AI Production Predictor</h4>
                 <p className="text-sm text-white/60 font-medium">Система прогнозирует высвобождение мощностей на 3-х фабриках через 48 часов. Будьте готовы к торгам.</p>
              </div>
           </div>
           <div className="flex gap-3 relative z-10">
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 rounded-2xl h-12 px-6 font-black uppercase text-[9px] tracking-widest">
                 Настроить алерты
              </Button>
              <Button className="bg-white text-slate-900 hover:bg-slate-100 rounded-2xl h-12 px-8 font-black uppercase text-[9px] tracking-widest shadow-2xl">
                 Анализ мощностей
              </Button>
           </div>
        </div>
      </CardContent>
    </Card>
  );
}
