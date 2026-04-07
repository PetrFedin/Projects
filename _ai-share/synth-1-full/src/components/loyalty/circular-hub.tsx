'use client';

import React, { useState } from 'react';
import { 
  RefreshCcw, Leaf, ShoppingBag, ArrowRight, 
  CheckCircle2, Zap, Smartphone, Globe, ShieldCheck,
  History, Recycle, Trash2, Heart, Award, Sparkles,
  ChevronRight, Box, DollarSign, Gem, TrendingUp
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

import Link from 'next/link';

const MOCK_RETURNABLE = [
  { id: 'r1', name: 'Urban Tech Parka', purchased: 'Янв 2024', status: 'returnable', tokens: 4500, collateral: 12500, image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=200' },
  { id: 'r2', name: 'Graphite Trousers', purchased: 'Май 2024', status: 'returnable', tokens: 1200, collateral: 4800, image: 'https://images.unsplash.com/photo-1624372927054-66634eabb591?w=200' }
];

export function CircularHub() {
  const [activeTab, setActiveTab] = useState<'return' | 'tokens'>('return');

  return (
    <Card className="rounded-xl border-none shadow-2xl overflow-hidden bg-white">
      <CardHeader className="p-3 pb-4 bg-emerald-900 text-white">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <div className="flex items-center gap-2 mb-1">
              <Recycle className="h-6 w-6 text-emerald-400" />
              <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Circular Economy Hub</span>
            </div>
            <CardTitle className="text-base font-black uppercase tracking-tighter">Вторая жизнь вещей</CardTitle>
            <CardDescription className="text-emerald-100/60 font-medium">Ваш гардероб — это актив. Управляйте ликвидностью через программы апсайклинга и залогового кредитования.</CardDescription>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
               <p className="text-[10px] font-black uppercase text-emerald-400 tracking-widest">Ликвидность гардероба</p>
               <h4 className="text-base font-black text-white tabular-nums">17,300 <span className="text-sm opacity-40 uppercase">₽</span></h4>
            </div>
            <div className="h-12 w-px bg-white/10" />
            <div className="text-right">
               <p className="text-[10px] font-black uppercase text-emerald-400 tracking-widest">Ваш баланс</p>
               <h4 className="text-base font-black text-white tabular-nums">8,450 <span className="text-sm opacity-40 uppercase">Tokens</span></h4>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-3 pt-10 space-y-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
          {/* Action Area */}
          <div className="lg:col-span-8 space-y-4">
             <div className="flex items-center justify-between">
                <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-400">Вещи, готовые к возврату</h4>
                <Badge className="bg-slate-100 text-slate-500 border-none font-black text-[8px] uppercase">Основано на цифровом паспорте</Badge>
             </div>

             <div className="space-y-4">
                {MOCK_RETURNABLE.map((item) => (
                  <div key={item.id} className="p-4 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between group hover:bg-white hover:shadow-xl transition-all">
                    <div className="flex items-center gap-3">
                       <div className="relative h-20 w-12 rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
                          <img src={item.image} alt={item.name} className="absolute inset-0 w-full h-full object-cover opacity-80" />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                             <Recycle className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                       </div>
                       <div>
                          <h5 className="text-sm font-black uppercase text-slate-900 tracking-tight">{item.name}</h5>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Куплено: {item.purchased}</p>
                          <div className="flex items-center gap-2 mt-2">
                             <Badge className="bg-emerald-100 text-emerald-700 border-none text-[8px] font-black uppercase px-2">+{item.tokens} Tokens</Badge>
                             <div className="flex items-center gap-1.5 px-2 py-0.5 bg-indigo-50 rounded text-[8px] font-black text-indigo-600 border border-indigo-100">
                                <DollarSign className="h-2 w-2" />
                                <span>{item.collateral.toLocaleString('ru-RU')} ₽ залог</span>
                             </div>
                             <span className="text-[9px] font-bold text-slate-400 uppercase">Оценка AI: Good</span>
                          </div>
                       </div>
                    </div>
                    <div className="flex gap-2">
                       <Button variant="outline" className="h-12 px-6 rounded-2xl border-slate-100 font-black uppercase text-[10px] tracking-widest hover:bg-slate-50">
                          Апсайклинг
                       </Button>
                       <Button className="h-12 bg-emerald-900 text-white rounded-2xl px-8 font-black uppercase text-[10px] tracking-widest hover:bg-emerald-800 transition-all shadow-lg">
                          Сдать на переработку
                       </Button>
                    </div>
                  </div>
                ))}
             </div>

             <div className="p-4 bg-slate-900 rounded-xl text-white flex items-center justify-between overflow-hidden relative">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                   <TrendingUp className="h-32 w-32 text-indigo-500" />
                </div>
                <div className="flex items-center gap-3 relative z-10">
                   <div className="h-12 w-12 bg-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl">
                      <Gem className="h-8 w-8 text-white" />
                   </div>
                   <div>
                      <h4 className="text-base font-black uppercase tracking-tighter">Wardrobe Credit Line</h4>
                      <p className="text-xs text-white/60 font-medium">Ваш гардероб позволяет разблокировать лимит до <span className="text-indigo-400 font-black">45,000 ₽</span>.</p>
                   </div>
                </div>
                <Button className="relative z-10 h-12 px-6 bg-white text-slate-900 rounded-xl font-black uppercase text-[9px] tracking-widest shadow-2xl" asChild>
                   <Link href="/wallet">Активировать в кошельке</Link>
                </Button>
             </div>
          </div>

          {/* Stats & Info Sidebar */}
          <div className="lg:col-span-4 space-y-4">
             <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 space-y-6">
                <div className="flex items-center gap-2 text-emerald-900">
                   <Sparkles className="h-5 w-5" />
                   <h4 className="text-[11px] font-black uppercase tracking-widest">Как это работает?</h4>
                </div>
                <div className="space-y-6">
                   {[
                     { step: '1', title: 'Сканируйте бирку', desc: 'Цифровой паспорт подтвердит состав и оригинальность.' },
                     { step: '2', title: 'Выберите способ', desc: 'Апсайклинг для вещей в хорошем состоянии или ресайкл.' },
                     { step: '3', title: 'Получите выгоду', desc: 'Токены Syntha эквивалентны рублям при покупке новых коллекций.' }
                   ].map((item, i) => (
                     <div key={i} className="flex gap-3">
                        <span className="h-6 w-6 rounded-full bg-white border border-emerald-200 flex items-center justify-center text-[10px] font-black text-emerald-600 shrink-0">{item.step}</span>
                        <div className="space-y-1">
                           <p className="text-[10px] font-black uppercase text-emerald-900 leading-none">{item.title}</p>
                           <p className="text-[9px] text-emerald-700/70 font-medium leading-relaxed">{item.desc}</p>
                        </div>
                     </div>
                   ))}
                </div>
             </div>

             <div className="p-4 bg-white border border-slate-100 rounded-xl shadow-xl space-y-6">
                <div className="flex justify-between items-center">
                   <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-900">Ближайшие боксы</h4>
                   <Globe className="h-4 w-4 text-indigo-600" />
                </div>
                <div className="space-y-4">
                   <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <p className="text-[10px] font-black uppercase text-slate-900">Syntha HQ Moscow</p>
                      <p className="text-[9px] text-slate-400 font-bold uppercase mt-1">Петровка, 12 • 1.2 км</p>
                   </div>
                   <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 opacity-50">
                      <p className="text-[10px] font-black uppercase text-slate-900">ЦУМ (Box #4)</p>
                      <p className="text-[9px] text-slate-400 font-bold uppercase mt-1">Кузнецкий Мост • 2.4 км</p>
                   </div>
                </div>
                <Button variant="ghost" className="w-full text-[9px] font-black uppercase text-indigo-600 hover:text-indigo-700">Показать на карте</Button>
             </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
