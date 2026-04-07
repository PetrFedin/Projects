'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  CreditCard, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight,
  UserPlus,
  Search,
  Settings2,
  DollarSign
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useUIState } from '@/providers/ui-state';
import { useB2BState } from '@/providers/b2b-state';
import { cn } from '@/lib/cn';

export function FinancialTermsManager() {
  const { retailerProfiles, updateRetailerProfile } = useB2BState();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  
  const selectedProfile = selectedId ? retailerProfiles[selectedId] : null;

  return (
    <div className="space-y-4 p-4 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-slate-900 flex items-center justify-center">
              <ShieldCheck className="h-4 w-4 text-white" />
            </div>
            <Badge variant="outline" className="border-slate-200 text-slate-900 uppercase font-black tracking-widest text-[9px]">
              FINANCE_CORE_v1.0
            </Badge>
          </div>
          <h2 className="text-sm md:text-sm font-black uppercase tracking-tighter text-slate-900 leading-none">
            Финансовые Условия<br/>и Кредитные Линии
          </h2>
          <p className="text-slate-400 font-medium text-xs max-w-md text-left">
            Управление лимитами оптового кредитования, условиями оплаты (Net 30/60/90) и бюджетами OTB для всех партнеров-ритейлеров.
          </p>
        </div>

        <Button className="h-10 bg-slate-900 text-white rounded-2xl px-8 font-black uppercase text-[10px] tracking-widest gap-2 shadow-xl shadow-slate-200">
          <UserPlus className="h-4 w-4" /> Выдать новую кредитную линию
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        {/* Retailer List */}
        <div className="lg:col-span-5 space-y-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input placeholder="Поиск партнеров..." className="pl-12 h-10 rounded-[1.25rem] border-none shadow-sm bg-white" />
          </div>

          <div className="space-y-4">
            {Object.values(retailerProfiles).map((profile) => (
              <Card 
                key={profile.id}
                onClick={() => setSelectedId(profile.id)}
                className={cn(
                  "group border-none shadow-xl shadow-slate-200/50 rounded-xl cursor-pointer transition-all overflow-hidden",
                  selectedId === profile.id ? "bg-slate-900 text-white" : "bg-white hover:bg-slate-50"
                )}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "h-12 w-12 rounded-2xl flex items-center justify-center transition-colors",
                        selectedId === profile.id ? "bg-white/10" : "bg-slate-50"
                      )}>
                        <CreditCard className={cn(
                          "h-6 w-6",
                          selectedId === profile.id ? "text-white" : "text-slate-400"
                        )} />
                      </div>
                      <div>
                        <h4 className="font-black uppercase tracking-tight text-sm">{profile.name}</h4>
                        <p className={cn(
                          "text-[9px] font-black uppercase tracking-widest",
                          selectedId === profile.id ? "text-slate-400" : "text-slate-400"
                        )}>{profile.tier === 'Premium' ? 'Премиум' : profile.tier} партнер</p>
                      </div>
                    </div>
                    <Badge className={cn(
                      "text-[8px] font-black px-2 py-0.5 border-none",
                      selectedId === profile.id ? "bg-emerald-500 text-white" : "bg-emerald-50 text-emerald-600"
                    )}>АКТИВЕН</Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/10">
                    <div className="space-y-1">
                      <p className="text-[8px] font-black uppercase tracking-widest opacity-50">Доступный кредит</p>
                      <p className="text-sm font-black tracking-tight">{profile.availableCredit.toLocaleString('ru-RU')} ₽</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[8px] font-black uppercase tracking-widest opacity-50">Условия оплаты</p>
                      <p className="text-sm font-black tracking-tight">{profile.netTerms}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Profile Editor */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            {selectedProfile ? (
              <motion.div
                key={selectedProfile.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-xl bg-white p-3">
                  <div className="flex items-center justify-between mb-10">
                    <div className="space-y-1">
                      <h3 className="text-sm font-black uppercase tracking-tight text-slate-900">Управление кредитным узлом</h3>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ID Ритейлера: {selectedProfile.id}</p>
                    </div>
                    <div className="flex gap-2">
                       <Button variant="outline" size="icon" className="h-12 w-12 rounded-xl border-slate-100">
                          <Settings2 className="h-5 w-5 text-slate-400" />
                       </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-6">
                       <div className="space-y-3">
                         <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Общий кредитный лимит</label>
                         <div className="relative">
                           <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-slate-400 text-sm">₽</span>
                           <Input 
                             type="number" 
                             defaultValue={selectedProfile.creditLimit}
                             onBlur={(e) => updateRetailerProfile(selectedProfile.id, { creditLimit: parseInt(e.target.value) || 0 })}
                             className="pl-12 h-10 rounded-2xl bg-slate-50 border-none font-black text-sm" 
                           />
                         </div>
                       </div>

                       <div className="space-y-3">
                         <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Срок оплаты (Net Terms)</label>
                         <div className="grid grid-cols-2 gap-2">
                           {['Due on Receipt', 'Net 30', 'Net 60', 'Net 90'].map((term) => (
                             <Button
                               key={term}
                               variant={selectedProfile.netTerms === term ? 'default' : 'outline'}
                               onClick={() => updateRetailerProfile(selectedProfile.id, { netTerms: term as any })}
                               className={cn(
                                 "h-12 rounded-xl text-[9px] font-black uppercase tracking-widest",
                                 selectedProfile.netTerms === term ? "bg-slate-900" : "border-slate-100"
                               )}
                             >
                               {term === 'Due on Receipt' ? 'При получении' : term}
                             </Button>
                           ))}
                         </div>
                       </div>
                    </div>

                    <div className="space-y-4 bg-slate-50 p-4 rounded-xl">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-black uppercase tracking-widest text-slate-900">Использование OTB</h4>
                          <TrendingUp className="h-4 w-4 text-emerald-500" />
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-[10px] font-black uppercase">
                            <span>Бюджет {selectedProfile.otbBudget.season} потрачен</span>
                            <span className="text-indigo-600">{Math.round((selectedProfile.otbBudget.spent / selectedProfile.otbBudget.total) * 100)}%</span>
                          </div>
                          <div className="w-full h-2 bg-white rounded-full overflow-hidden shadow-inner">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${(selectedProfile.otbBudget.spent / selectedProfile.otbBudget.total) * 100}%` }}
                              className="h-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" 
                            />
                          </div>
                          <p className="text-[10px] font-bold text-slate-400 text-right uppercase">
                            {selectedProfile.otbBudget.spent.toLocaleString('ru-RU')} / {selectedProfile.otbBudget.total.toLocaleString('ru-RU')} ₽
                          </p>
                        </div>
                      </div>

                      <div className="pt-4 space-y-4">
                        <div className="flex items-start gap-3 p-4 rounded-2xl bg-white border border-slate-100">
                          <AlertCircle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                          <p className="text-[9px] font-medium text-slate-600 leading-relaxed">
                            Увеличение кредитного лимита свыше 5 млн ₽ требует дополнительного одобрения финансового отдела.
                          </p>
                        </div>
                        <Button className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest gap-2 shadow-xl shadow-emerald-100">
                          <CheckCircle2 className="h-4 w-4" /> Сохранить условия
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Credit Score Activity */}
                <Card className="border-none shadow-xl shadow-slate-200/50 rounded-xl bg-white p-4">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">Журнал финансовой дисциплины</h3>
                    <Badge variant="outline" className="text-[8px] font-black border-slate-100">РЕЙТИНГ: 98/100</Badge>
                  </div>
                  <div className="space-y-4">
                    {[
                      { action: 'Кредитная линия увеличена на 1 млн ₽', actor: 'Админ', date: '2 дня назад' },
                      { action: 'Инвойс #8812 оплачен вовремя', actor: 'Система', date: '1 неделю назад' },
                      { action: 'Новый предзаказ #8821 подтвержден', actor: 'Premium Store', date: 'Сегодня' }
                    ].map((log, i) => (
                      <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-slate-50 hover:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="h-2 w-2 rounded-full bg-emerald-500" />
                          <span className="text-[10px] font-black text-slate-900 uppercase">{log.action}</span>
                        </div>
                        <div className="flex items-center gap-3">
                           <span className="text-[10px] font-bold text-slate-400 uppercase">{log.actor}</span>
                           <span className="text-[10px] font-bold text-slate-400 uppercase">{log.date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-20 space-y-6 bg-white rounded-xl border border-dashed border-slate-200">
                <div className="h-20 w-20 rounded-full bg-slate-50 flex items-center justify-center">
                   <CreditCard className="h-10 w-10 text-slate-200" />
                </div>
                <div className="space-y-2">
                   <h3 className="text-base font-black uppercase tracking-tight text-slate-400">Выберите партнера</h3>
                   <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Выберите ритейлера из списка для управления финансовыми условиями</p>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
