'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  DollarSign, 
  ShieldCheck, 
  Clock, 
  ArrowUpRight, 
  ChevronRight, 
  Lock,
  Building2,
  FileCheck,
  Zap,
  TrendingUp,
  Landmark,
  Scale
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useUIState } from '@/providers/ui-state';
import { cn } from '@/lib/cn';

export function B2BFinancing() {
  const { activeCurrency } = useUIState();
  const [activePlan, setActivePlan] = useState<string | null>(null);

  const financingPlans = [
    { 
      id: 'net-30', 
      title: 'Протокол Net 30', 
      desc: 'Стандартные оптовые условия. Оплата в течение 30 дней после отгрузки.',
      interest: '0%',
      fee: '0 ₽',
      maxLimit: '5.0M ₽',
      icon: Clock,
      color: 'bg-blue-500'
    },
    { 
      id: 'bnpl-90', 
      title: 'Growth Flex 90', 
      desc: 'Расширенное окно в 90 дней. Идеально для сезонных закупок большого объема.',
      interest: '2.4%',
      fee: '120K ₽',
      maxLimit: '15.0M ₽',
      icon: TrendingUp,
      color: 'bg-indigo-600'
    },
    { 
      id: 'revenue-share', 
      title: 'Performance Pay', 
      desc: 'Оплата по мере продаж. Автоматическое списание на основе данных POS.',
      interest: '4.5%',
      fee: 'Динамическая',
      maxLimit: 'Без лимита',
      icon: Zap,
      color: 'bg-emerald-500'
    }
  ];

  return (
    <div className="space-y-4 p-3 bg-slate-50 min-h-screen text-left">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <Landmark className="h-5 w-5" />
            </div>
            <Badge variant="outline" className="border-indigo-100 text-indigo-600 uppercase font-black tracking-widest text-[9px]">
              FINANCE_BNPL_v1.0
            </Badge>
          </div>
          <h2 className="text-sm md:text-sm font-black uppercase tracking-tighter text-slate-900 leading-none">
            B2B Кредитование<br/>и Финансирование
          </h2>
          <p className="text-slate-400 font-medium text-xs max-w-md">
            Разблокируйте ликвидность для ваших оптовых операций. Подайте заявку на отсрочку платежа или финансирование на основе выручки мгновенно.
          </p>
        </div>

        <Card className="bg-slate-900 text-white p-4 rounded-xl border-none shadow-2xl flex items-center gap-3">
           <div className="space-y-1">
              <p className="text-[10px] font-black uppercase text-indigo-400 tracking-widest">Доступный лимит</p>
              <p className="text-base font-black">12.4M ₽</p>
           </div>
           <div className="h-12 w-[1px] bg-white/10" />
           <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-12 px-6 font-black uppercase text-[10px] tracking-widest">Увеличить лимит</Button>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {financingPlans.map((plan) => (
              <Card 
                key={plan.id}
                onClick={() => setActivePlan(plan.id)}
                className={cn(
                  "group border-none shadow-xl transition-all cursor-pointer rounded-xl p-4",
                  activePlan === plan.id ? "bg-slate-900 text-white" : "bg-white hover:bg-slate-50"
                )}
              >
                <div className="flex items-start justify-between mb-8">
                  <div className={cn("h-10 w-10 rounded-2xl flex items-center justify-center shadow-lg", plan.color)}>
                    <plan.icon className="h-6 w-6 text-white" />
                  </div>
                  <Badge variant="outline" className={cn(
                    "text-[10px] font-black uppercase tracking-widest px-3 py-1",
                    activePlan === plan.id ? "border-white/20 text-white" : "border-slate-100 text-slate-400"
                  )}>
                    {plan.interest} APR
                  </Badge>
                </div>
                <div className="space-y-4">
                  <h4 className="text-sm font-black uppercase tracking-tight leading-none">{plan.title}</h4>
                  <p className={cn("text-xs font-medium leading-relaxed", activePlan === plan.id ? "text-white/60" : "text-slate-400")}>{plan.desc}</p>
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-[8px] font-black uppercase opacity-50">Лимит до</p>
                      <p className="text-sm font-black">{plan.maxLimit}</p>
                    </div>
                    <ArrowUpRight className="h-5 w-5 opacity-20 group-hover:opacity-100 transition-all" />
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <Card className="border-none shadow-2xl bg-white rounded-xl p-3 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-base font-black uppercase tracking-tight text-slate-900">Текущие обязательства</h4>
              <Button variant="ghost" className="text-indigo-600 font-black uppercase text-[10px] tracking-widest gap-2">Смотреть книгу <ChevronRight className="h-4 w-4" /></Button>
            </div>
            <div className="space-y-4">
              {[
                { id: 'TX-8821', brand: 'Syntha Lab', amount: '1.2M ₽', due: 'Feb 28', status: 'Pending' },
                { id: 'TX-8714', brand: 'Milan Retail', amount: '450K ₽', due: 'Mar 15', status: 'Active' }
              ].map((tx, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                      <Building2 className="h-5 w-5 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase text-slate-400">Продавец</p>
                      <p className="text-sm font-black text-slate-900">{tx.brand}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-slate-400">К оплате</p>
                    <p className="text-sm font-black text-slate-900">{tx.amount}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-slate-400">Дата</p>
                    <p className="text-sm font-black text-slate-900">{tx.due}</p>
                  </div>
                  <Badge className="bg-emerald-50 text-emerald-600 border-none text-[8px] font-black uppercase px-3 py-1">{tx.status}</Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="border-none shadow-xl bg-indigo-900 text-white rounded-xl p-4 space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center">
                <ShieldCheck className="h-6 w-6 text-indigo-400" />
              </div>
              <h5 className="text-sm font-black uppercase tracking-widest">Рейтинг доверия</h5>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-end">
                <p className="text-sm font-black">A+</p>
                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Премиум уровень</p>
              </div>
              <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: '92%' }} className="h-full bg-indigo-400" />
              </div>
              <p className="text-[10px] font-medium text-indigo-200/60 leading-relaxed uppercase tracking-widest">
                На основе 14 месяцев 100% своевременных расчетов.
              </p>
            </div>
          </Card>

          <Card className="border-none shadow-xl bg-white rounded-xl p-4 space-y-6">
            <h5 className="text-sm font-black uppercase text-slate-900">Статус заявки</h5>
            <div className="space-y-6">
              {[
                { step: 'Верификация личности', status: 'completed' },
                { step: 'Синхронизация с банком', status: 'completed' },
                { step: 'Кредитный скоринг', status: 'active' },
                { step: 'Подписание контракта', status: 'pending' }
              ].map((s, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={cn(
                    "h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-black",
                    s.status === 'completed' ? "bg-emerald-500 text-white" : 
                    s.status === 'active' ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-400"
                  )}>
                    {s.status === 'completed' ? <FileCheck className="h-3 w-3" /> : i+1}
                  </div>
                  <span className={cn(
                    "text-[10px] font-black uppercase tracking-widest",
                    s.status === 'pending' ? "text-slate-300" : "text-slate-900"
                  )}>{s.step}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="border-none shadow-xl bg-slate-900 text-white rounded-xl p-4 space-y-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10"><Scale className="h-24 w-24" /></div>
            <div className="relative z-10 space-y-4">
              <h5 className="text-sm font-black uppercase tracking-widest text-indigo-400">Юридический комплаенс</h5>
              <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest leading-relaxed">
                Все финансирование осуществляется в соответствии с местным законодательством и протоколами ПОД/ФТ.
              </p>
              <Button variant="ghost" className="p-0 text-white hover:text-indigo-400 font-black uppercase text-[10px] tracking-widest border-none">Обзор структуры</Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
