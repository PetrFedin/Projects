'use client';

import React, { useState } from 'react';
import { 
  User, Shirt, Scissors, ChevronRight, CheckCircle2, 
  Clock, Zap, Layout, Settings, Sparkles, Box,
  Smartphone, MessageSquare, AlertTriangle, Filter
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const MOCK_MTO_ORDERS = [
  { id: 'mto-1', client: 'Анна С.', item: 'Urban Parka Custom', mods: ['Вышивка "AS"', 'Удлиненный рукав +2см'], status: 'cutting', priority: 'high', time: '1ч назад' },
  { id: 'mto-2', client: 'Иван К.', item: 'Tech Blazer', mods: ['Контрастный подклад', 'Скрытый карман'], status: 'queue', priority: 'medium', time: '3ч назад' },
  { id: 'mto-3', client: 'Елена М.', item: 'Silk Dress', mods: ['Длина миди', 'Пояс в цвет'], status: 'sewing', priority: 'urgent', time: '15 мин назад' }
];

export function MtoBridge() {
  const [activeTab, setActiveTab] = useState<'orders' | 'config'>('orders');

  return (
    <Card className="rounded-xl border-none shadow-2xl overflow-hidden bg-white">
      <CardHeader className="p-3 pb-4 bg-indigo-600 text-white">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <div className="flex items-center gap-2 mb-1">
              <Shirt className="h-6 w-6 text-white" />
              <span className="text-[10px] font-black text-indigo-200 uppercase tracking-widest">Made-to-Order Bridge</span>
            </div>
            <CardTitle className="text-base font-black uppercase tracking-tighter">MTO Direct Channel</CardTitle>
            <CardDescription className="text-indigo-100 font-medium italic">Прямой поток кастомных заказов от клиентов в производственный цех.</CardDescription>
          </div>
          <div className="flex bg-white/10 p-1 rounded-2xl backdrop-blur-md">
             <button 
                onClick={() => setActiveTab('orders')}
                className={cn("px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all", activeTab === 'orders' ? "bg-white text-indigo-600 shadow-lg" : "text-white/60")}
             >
               Очередь заказов
             </button>
             <button 
                onClick={() => setActiveTab('config')}
                className={cn("px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all", activeTab === 'config' ? "bg-white text-indigo-600 shadow-lg" : "text-white/60")}
             >
               Настройка MTO
             </button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-3 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
          {/* Main List Area */}
          <div className="lg:col-span-8 space-y-4">
             <div className="flex items-center justify-between">
                <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-400">Активные MTO-слоты</h4>
                <div className="flex gap-2">
                   <Badge className="bg-emerald-50 text-emerald-600 border-none font-black text-[8px] uppercase">Online: 3 Sewing Lines</Badge>
                </div>
             </div>

             <div className="space-y-4">
                {MOCK_MTO_ORDERS.map((order) => (
                  <motion.div 
                    key={order.id}
                    layoutId={order.id}
                    className="p-4 bg-slate-50 border border-slate-100 rounded-xl hover:shadow-xl hover:bg-white hover:border-indigo-100 transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                       <div className="h-12 w-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center shadow-sm shrink-0">
                          <User className="h-8 w-8 text-slate-300" />
                       </div>
                       <div className="space-y-2">
                          <div className="flex items-center gap-2">
                             <h5 className="text-sm font-black uppercase text-slate-900 tracking-tight">{order.item} / {order.client}</h5>
                             <Badge className={cn(
                               "text-[7px] font-black uppercase h-4 px-1.5",
                               order.priority === 'urgent' ? "bg-rose-500 text-white" :
                               order.priority === 'high' ? "bg-amber-500 text-white" :
                               "bg-slate-200 text-slate-500"
                             )}>
                               {order.priority}
                             </Badge>
                          </div>
                          <div className="flex flex-wrap gap-2">
                             {order.mods.map((mod, i) => (
                               <span key={i} className="text-[9px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                                  {mod}
                               </span>
                             ))}
                          </div>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{order.time} • ID: {order.id}</p>
                       </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                       <div className="text-right">
                          <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Статус</p>
                          <div className="flex items-center gap-2">
                             <div className={cn(
                                "h-2 w-2 rounded-full animate-pulse",
                                order.status === 'sewing' ? "bg-emerald-500" :
                                order.status === 'cutting' ? "bg-amber-500" : "bg-slate-300"
                             )} />
                             <span className="text-[10px] font-black uppercase text-slate-900">{order.status}</span>
                          </div>
                       </div>
                       <Button className="h-12 bg-slate-900 text-white rounded-2xl px-6 font-black uppercase text-[10px] tracking-widest hover:bg-indigo-600 transition-colors shadow-lg">
                          Взять в работу
                       </Button>
                    </div>
                  </motion.div>
                ))}
             </div>
          </div>

          {/* MTO Config Sidebar */}
          <div className="lg:col-span-4 space-y-4">
             <div className="p-4 bg-slate-900 rounded-xl text-white space-y-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                   <Scissors className="h-32 w-32" />
                </div>
                
                <div className="space-y-1 relative z-10">
                   <p className="text-[10px] font-black uppercase text-indigo-400 tracking-widest">MTO Capacity</p>
                   <h3 className="text-sm font-black tabular-nums">12 <span className="text-sm text-white/40">/ 20</span></h3>
                   <p className="text-[9px] text-indigo-300/60 font-bold uppercase">Слотов забронировано на сегодня</p>
                </div>

                <div className="space-y-4 relative z-10 pt-4">
                   <div className="p-4 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                         <Zap className="h-4 w-4 text-amber-400" />
                         <span className="text-[10px] font-black uppercase">Auto-Sourcing</span>
                      </div>
                      <Badge className="bg-emerald-500 text-white border-none text-[8px] font-black uppercase">Active</Badge>
                   </div>
                   <div className="p-4 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                         <MessageSquare className="h-4 w-4 text-indigo-400" />
                         <span className="text-[10px] font-black uppercase">Client Live Sync</span>
                      </div>
                      <Badge className="bg-emerald-500 text-white border-none text-[8px] font-black uppercase">Active</Badge>
                   </div>
                </div>

                <Button className="w-full h-10 bg-indigo-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-2xl hover:bg-indigo-500 transition-colors relative z-10">
                   Открыть прием заказов
                </Button>
             </div>

             <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 flex items-start gap-3">
                <div className="h-12 w-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-lg">
                   <CheckCircle2 className="h-6 w-6" />
                </div>
                <div className="space-y-2 pt-1">
                   <p className="text-[11px] font-black uppercase text-emerald-900 leading-none">Zero Waste Target</p>
                   <p className="text-[10px] text-emerald-700/80 font-medium leading-relaxed">
                      Через MTO-канал вы сократили складские остатки на 12.4% за прошлый месяц. Система оптимизирует раскладку лекал для кастомных заказов.
                   </p>
                </div>
             </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
