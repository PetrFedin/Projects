'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Layers, 
  Settings2, 
  Users, 
  Star, 
  Clock, 
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  TrendingUp,
  Warehouse
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useUIState } from '@/providers/ui-state';
import { useB2BState } from '@/providers/b2b-state';
import { cn } from '@/lib/cn';

export function SmartAllocationEngine() {
  const { inventoryATS, retailerProfiles } = useB2BState();
  const [allocationStrategy, setAllocationStrategy] = useState<'fifo' | 'vip' | 'balanced'>('vip');

  const strategies = [
    { id: 'fifo', name: 'Первым пришел — первым ушел', desc: 'Заказы выполняются строго по дате создания.', icon: Clock },
    { id: 'vip', name: 'VIP Приоритет', desc: 'Золотые и VIP клиенты получают приоритетный доступ к дефициту.', icon: Star },
    { id: 'balanced', name: 'Сбалансированное деление', desc: 'Сток делится пропорционально между всеми активными заказами.', icon: Layers }
  ];

  return (
    <div className="space-y-4 p-4 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-indigo-600 flex items-center justify-center">
              <Warehouse className="h-4 w-4 text-white" />
            </div>
            <Badge variant="outline" className="border-indigo-100 text-indigo-600 uppercase font-black tracking-widest text-[9px]">
              ALLOCATION_CORE_v3.4
            </Badge>
          </div>
          <h2 className="text-sm md:text-sm font-black uppercase tracking-tighter text-slate-900 leading-none">
            Умное Распределение<br/>Запасов
          </h2>
          <p className="text-slate-400 font-medium text-xs max-w-md text-left">
            Определение правил распределения ограниченного стока (ATS) при превышении спроса. Автоматическое резервирование на основе уровня ритейлера и его показателей.
          </p>
        </div>

        <Button className="h-10 bg-slate-900 text-white rounded-2xl px-8 font-black uppercase text-[10px] tracking-widest gap-2 shadow-2xl shadow-slate-200">
           Выполнить глобальное перераспределение <Settings2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* Strategy Selection */}
        {strategies.map((s) => (
          <Card 
            key={s.id}
            onClick={() => setAllocationStrategy(s.id as any)}
            className={cn(
              "group border-none shadow-xl shadow-slate-200/50 rounded-xl cursor-pointer transition-all p-4 overflow-hidden relative",
              allocationStrategy === s.id ? "bg-slate-900 text-white" : "bg-white hover:bg-slate-50"
            )}
          >
            {allocationStrategy === s.id && (
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <s.icon className="h-24 w-24" />
              </div>
            )}
            <div className="relative z-10 space-y-6">
              <div className={cn(
                "h-10 w-10 rounded-2xl flex items-center justify-center transition-colors",
                allocationStrategy === s.id ? "bg-white/10" : "bg-slate-50"
              )}>
                <s.icon className={cn(
                  "h-6 w-6",
                  allocationStrategy === s.id ? "text-white" : "text-slate-400"
                )} />
              </div>
              <div>
                <h4 className="text-base font-black uppercase tracking-tight mb-2">{s.name}</h4>
                <p className={cn(
                  "text-[10px] font-medium uppercase tracking-widest leading-relaxed",
                  allocationStrategy === s.id ? "text-slate-400" : "text-slate-400"
                )}>{s.desc}</p>
              </div>
              <div className="flex items-center gap-2">
                {allocationStrategy === s.id ? (
                  <Badge className="bg-emerald-500 text-white border-none text-[8px] font-black uppercase px-2 py-0.5">Active Strategy</Badge>
                ) : (
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-300">Select to activate</span>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        {/* Inventory Queue */}
        <div className="lg:col-span-8 space-y-6">
           <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-xl bg-white overflow-hidden">
             <CardHeader className="p-4 pb-4 flex flex-row items-center justify-between">
               <div className="space-y-1">
                 <CardTitle className="text-base font-black uppercase tracking-tight">Ожидаемые распределения</CardTitle>
                 <CardDescription className="text-[10px] font-bold uppercase text-slate-400">Товары, требующие ручного распределения или правил</CardDescription>
               </div>
               <Badge className="bg-amber-50 text-amber-600 border-none text-[9px] font-black">14 КОНФЛИКТОВ</Badge>
             </CardHeader>
             <CardContent className="p-4 pt-0">
                <div className="space-y-4">
                  {inventoryATS.map((item, i) => (
                    <div key={i} className="group flex items-center justify-between p-4 rounded-3xl bg-slate-50 hover:bg-slate-100 transition-all border border-transparent hover:border-slate-200">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center shadow-sm">
                          <img src={`https://placehold.co/100x100/f1f5f9/94a3b8?text=${item.sku.split('-')[0]}`} className="w-full h-full object-cover" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{item.sku}</p>
                          <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">{item.productName}</h4>
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] font-bold text-slate-400 uppercase">Сток: {item.available}</span>
                            <span className="h-1 w-1 rounded-full bg-slate-200" />
                            <span className="text-[10px] font-bold text-rose-600 uppercase">Спрос: {item.reserved + 450}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                         <div className="text-right">
                           <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Уровень конфликта</p>
                           <Badge className="bg-rose-100 text-rose-600 border-none text-[8px] font-black px-2 py-0.5">КРИТИЧЕСКИЙ</Badge>
                         </div>
                         <Button className="h-12 bg-slate-900 text-white rounded-xl px-6 font-black uppercase text-[10px] tracking-widest gap-2">
                           Решить конфликт <ArrowRight className="h-4 w-4" />
                         </Button>
                      </div>
                    </div>
                  ))}
                </div>
             </CardContent>
           </Card>
        </div>

        {/* Priority Dashboard */}
        <div className="lg:col-span-4 space-y-4">
          <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-xl bg-indigo-600 text-white p-4 space-y-6 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10">
                <Star className="h-32 w-32" />
             </div>
             <h3 className="text-base font-black uppercase tracking-tight relative z-10">Выполнение по уровням</h3>
             <div className="space-y-6 relative z-10">
                {[
                  { tier: 'VIP/Gold', progress: 100, color: 'bg-emerald-400' },
                  { tier: 'Silver', progress: 85, color: 'bg-indigo-300' },
                  { tier: 'Standard', progress: 42, color: 'bg-white/20' }
                ].map((t) => (
                  <div key={t.tier} className="space-y-2">
                    <div className="flex justify-between text-[10px] font-black uppercase">
                      <span>{t.tier}</span>
                      <span>{t.progress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${t.progress}%` }}
                        className={cn("h-full", t.color)}
                      />
                    </div>
                  </div>
                ))}
             </div>
          </Card>

          <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-xl bg-white p-4 space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center">
                <ShieldCheck className="h-5 w-5 text-slate-400" />
              </div>
              <h4 className="text-sm font-black uppercase tracking-tight text-slate-900">Здоровье распределения</h4>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <p className="text-[9px] font-medium text-slate-600 leading-relaxed">
                  92% предзаказов VIP успешно распределены. Текущая оптимизация стока на пике эффективности.
                </p>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-50 border border-amber-100">
                <AlertCircle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-[9px] font-medium text-amber-900 leading-relaxed">
                  Заказы уровня Standard на 'Cyber Tech Parka' задержаны из-за низкого ATS в хабе Москва.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
