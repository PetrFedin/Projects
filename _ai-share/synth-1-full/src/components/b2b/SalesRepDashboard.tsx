'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  TrendingUp, 
  Target, 
  MessageSquare, 
  Calendar, 
  ArrowUpRight,
  Filter,
  Search,
  MoreVertical,
  Activity,
  Award,
  Zap
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useUIState } from '@/providers/ui-state';
import { useB2BState } from '@/providers/b2b-state';
import { cn } from '@/lib/cn';

export function SalesRepDashboard() {
  const { b2bActivityLogs } = useB2BState();
  const [activeRep, setActiveRep] = useState<string | null>(null);

  const reps = [
    { id: 'rep-1', name: 'Алекс Волков', role: 'Senior Sales Manager', revenue: '4.2M ₽', target: '5M ₽', accounts: 12, growth: '+14%' },
    { id: 'rep-2', name: 'Елена Белова', role: 'Regional Lead', revenue: '2.8M ₽', target: '3M ₽', accounts: 8, growth: '+8%' },
    { id: 'rep-3', name: 'Марк Штайнер', role: 'International Rep', revenue: '1.5M ₽', target: '4M ₽', accounts: 5, growth: '-2%' }
  ];

  return (
    <div className="space-y-4 p-4 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-indigo-600 flex items-center justify-center">
              <Users className="h-4 w-4 text-white" />
            </div>
            <Badge variant="outline" className="border-indigo-100 text-indigo-600 uppercase font-black tracking-widest text-[9px]">
              SALES_CORE_v2.1
            </Badge>
          </div>
          <h2 className="text-sm md:text-sm font-black uppercase tracking-tighter text-slate-900 leading-none">
            Команда<br/>Продаж
          </h2>
          <p className="text-slate-400 font-medium text-xs max-w-md text-left">
            Отслеживайте показатели эффективности менеджеров, выполнение квот и управление аккаунтами ритейлеров во всех регионах.
          </p>
        </div>

        <div className="flex gap-3">
           <Button variant="outline" className="h-10 rounded-2xl border-slate-200 px-6 font-black uppercase text-[10px] tracking-widest gap-2 bg-white">
              <Calendar className="h-4 w-4" /> Период: Февраль 2026
           </Button>
           <Button className="h-10 bg-slate-900 text-white rounded-2xl px-8 font-black uppercase text-[10px] tracking-widest gap-2 shadow-xl shadow-slate-200">
              Сформировать отчет <TrendingUp className="h-4 w-4" />
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        {/* Rep List */}
        <div className="lg:col-span-4 space-y-6">
           <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input placeholder="Поиск менеджеров..." className="pl-12 h-10 rounded-2xl border-none shadow-sm bg-white" />
           </div>

           <div className="space-y-4">
              {reps.map((rep) => (
                <Card 
                  key={rep.id}
                  onClick={() => setActiveRep(rep.id)}
                  className={cn(
                    "group border-none shadow-xl shadow-slate-200/50 rounded-xl cursor-pointer transition-all overflow-hidden",
                    activeRep === rep.id ? "bg-slate-900 text-white" : "bg-white hover:bg-slate-50"
                  )}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-6">
                       <div className="flex items-center gap-3">
                          <div className={cn(
                            "h-12 w-12 rounded-2xl overflow-hidden border-2 transition-all",
                            activeRep === rep.id ? "border-indigo-500" : "border-slate-100"
                          )}>
                             <img src={`https://i.pravatar.cc/100?u=${rep.id}`} className="w-full h-full object-cover" />
                          </div>
                          <div>
                             <h4 className="font-black uppercase tracking-tight text-sm">{rep.name}</h4>
                             <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">{rep.role}</p>
                          </div>
                       </div>
                       <Badge className={cn(
                         "text-[8px] font-black px-2 py-0.5 border-none",
                         rep.growth.startsWith('+') ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                       )}>{rep.growth}</Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/10">
                       <div className="space-y-1">
                          <p className="text-[8px] font-black uppercase tracking-widest opacity-50">Выручка</p>
                          <p className="text-sm font-black">{rep.revenue}</p>
                       </div>
                       <div className="space-y-1">
                          <p className="text-[8px] font-black uppercase tracking-widest opacity-50">Квота</p>
                          <p className="text-sm font-black">{Math.round((parseInt(rep.revenue) / parseInt(rep.target)) * 100)}%</p>
                       </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
           </div>
        </div>

        {/* Rep Details / CRM Activity */}
        <div className="lg:col-span-8">
           {activeRep ? (
             <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                   {[
                     { label: 'Активные аккаунты', val: '12', icon: Users, color: 'text-indigo-600' },
                     { label: 'Конверсия', val: '24%', icon: Zap, color: 'text-amber-600' },
                     { label: 'Средний заказ', val: '350K ₽', icon: Award, color: 'text-emerald-600' }
                   ].map((s, i) => (
                     <Card key={i} className="border-none shadow-xl shadow-slate-200/50 rounded-xl bg-white p-4">
                        <div className="flex items-center justify-between mb-4">
                           <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center">
                              <s.icon className={cn("h-5 w-5", s.color)} />
                           </div>
                           <ArrowUpRight className="h-4 w-4 text-slate-200" />
                        </div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">{s.label}</p>
                        <h3 className="text-sm font-black text-slate-900">{s.val}</h3>
                     </Card>
                   ))}
                </div>

                <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-xl bg-white p-3 space-y-10">
                   <div className="flex items-center justify-between">
                      <div className="space-y-1">
                         <h3 className="text-sm font-black uppercase tracking-tight text-slate-900">Поток CRM взаимодействий</h3>
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Последние действия с закрепленными ритейлерами</p>
                      </div>
                      <Button variant="outline" className="h-10 rounded-xl border-slate-100 text-[9px] font-black uppercase tracking-widest">Фильтр по аккаунту</Button>
                   </div>

                   <div className="space-y-6">
                      {[
                        { type: 'negotiation', account: 'Premium Store Moscow', detail: 'Negotiated 5% bulk discount for FW26', time: '2h ago' },
                        { type: 'linesheet', account: 'Urban Elite', detail: 'Sent customized "Techwear Essential" linesheet', time: 'Yesterday' },
                        { type: 'meeting', account: 'Milan Concept', detail: 'Virtual showroom tour completed', time: '2 days ago' }
                      ].map((act, i) => (
                        <div key={i} className="flex items-start gap-3 p-4 rounded-3xl bg-slate-50 border border-transparent hover:border-slate-200 transition-all group">
                           <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center shadow-sm">
                              {act.type === 'negotiation' ? <MessageSquare className="h-5 w-5 text-indigo-600" /> :
                               act.type === 'linesheet' ? <Target className="h-5 w-5 text-amber-600" /> :
                               <Activity className="h-5 w-5 text-emerald-600" />}
                           </div>
                           <div className="flex-1 space-y-1">
                              <div className="flex items-center justify-between">
                                 <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-tight">{act.account}</h4>
                                 <span className="text-[9px] font-bold text-slate-400 uppercase">{act.time}</span>
                              </div>
                              <p className="text-xs font-medium text-slate-500 leading-relaxed">{act.detail}</p>
                           </div>
                           <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl opacity-0 group-hover:opacity-100">
                              <MoreVertical className="h-4 w-4" />
                           </Button>
                        </div>
                      ))}
                   </div>
                </Card>
             </div>
           ) : (
             <div className="h-full flex flex-col items-center justify-center text-center p-20 space-y-6 bg-white rounded-xl border border-dashed border-slate-200">
                <div className="h-20 w-20 rounded-full bg-slate-50 flex items-center justify-center">
                   <Target className="h-10 w-10 text-slate-200" />
                </div>
                <div className="space-y-2">
                   <h3 className="text-base font-black uppercase tracking-tight text-slate-400">Выберите менеджера</h3>
                   <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Мониторинг персональных квот и логов взаимодействий</p>
                </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
