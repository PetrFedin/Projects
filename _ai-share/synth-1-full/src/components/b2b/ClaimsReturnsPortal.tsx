'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Search, 
  Plus, 
  ShieldAlert,
  Archive,
  ArrowRight,
  CreditCard,
  RefreshCcw,
  Camera,
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useB2BState } from '@/providers/b2b-state';
import { useUIState } from '@/providers/ui-state';
import { cn } from '@/lib/cn';

export function ClaimsReturnsPortal() {
  const { viewRole } = useUIState();
  const { orderClaims } = useB2BState();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="space-y-4 p-4 bg-white min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-rose-600 flex items-center justify-center">
              <ShieldAlert className="h-4 w-4 text-white" />
            </div>
            <Badge variant="outline" className="border-rose-100 text-rose-600 uppercase font-black tracking-widest text-[9px]">
              Assurance_Portal_v3.1
            </Badge>
          </div>
          <h2 className="text-sm md:text-sm font-black uppercase tracking-tighter text-slate-900 leading-none">
            Портал Претензий<br/>и Возвратов
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Поиск претензий..." 
              className="pl-10 h-12 rounded-2xl border-slate-100 bg-slate-50 focus-visible:ring-rose-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button 
            className="h-12 bg-slate-900 text-white rounded-2xl px-6 font-black uppercase text-[10px] tracking-widest gap-2"
            onClick={() => setIsFormOpen(true)}
          >
            <Plus className="h-4 w-4" /> Новая претензия
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
        {/* Status Filter Sidebar */}
        <div className="space-y-6">
           <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-xl p-4 space-y-6 bg-slate-900 text-white">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Движок процессов</p>
                <h4 className="text-base font-black uppercase tracking-tight">Обзор этапов</h4>
              </div>
              <div className="space-y-3">
                {[
                  { label: 'Ожидает проверки', count: 4, icon: Clock, color: 'amber' },
                  { label: 'На рассмотрении', count: 2, icon: AlertCircle, color: 'blue' },
                  { label: 'Решено (30д)', count: 28, icon: CheckCircle2, color: 'emerald' },
                  { label: 'Отклонено', count: 3, icon: Archive, color: 'slate' }
                ].map((stage, i) => (
                  <button key={i} className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all border border-white/5">
                    <div className="flex items-center gap-3">
                       <stage.icon className={cn(
                         "h-4 w-4",
                         stage.color === 'amber' ? "text-amber-400" :
                         stage.color === 'blue' ? "text-blue-400" :
                         stage.color === 'emerald' ? "text-emerald-400" : "text-slate-400"
                       )} />
                       <span className="text-[10px] font-bold uppercase tracking-tight text-white/80">{stage.label}</span>
                    </div>
                    <Badge className="bg-white/10 text-white border-none text-[8px] font-black">{stage.count}</Badge>
                  </button>
                ))}
              </div>
           </Card>

           <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-xl p-4 space-y-6 bg-white">
              <div className="space-y-1">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Скорость решения</p>
                <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">Уровень сервиса</h4>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-4">
                 <div className="flex items-end justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-black text-slate-900">4.2ч</p>
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Ср. время ответа</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-emerald-500 opacity-20" />
                 </div>
                 <div className="h-1 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-[85%]" />
                 </div>
              </div>
           </Card>
        </div>

        {/* Claims Table/List */}
        <div className="lg:col-span-3 space-y-6">
           <div className="bg-white rounded-xl border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden">
              <div className="p-4 border-b border-slate-50 flex items-center justify-between">
                 <h3 className="text-base font-black uppercase tracking-tight text-slate-900">Последние претензии</h3>
                 <Button variant="outline" className="text-[9px] font-black uppercase tracking-widest h-10 px-6 rounded-xl border-slate-100">Экспорт CSV</Button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                   <thead>
                     <tr className="bg-slate-50/50">
                       <th className="p-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Референс / ID</th>
                       <th className="p-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Тип проблемы</th>
                       <th className="p-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Статус</th>
                       <th className="p-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Ритейлер</th>
                       <th className="p-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Решение</th>
                       <th className="p-4"></th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-50">
                     {orderClaims.map((claim) => (
                       <tr key={claim.id} className="group hover:bg-slate-50/50 transition-all">
                         <td className="p-4">
                           <div className="space-y-1">
                             <p className="text-xs font-black text-slate-900 uppercase">{claim.orderId}</p>
                             <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">{claim.id}</p>
                           </div>
                         </td>
                         <td className="p-4">
                           <Badge variant="outline" className="text-[8px] font-black border-slate-200 text-slate-600 uppercase">
                             {claim.type.replace('_', ' ')}
                           </Badge>
                         </td>
                         <td className="p-4">
                           <div className="flex items-center gap-2">
                             <div className={cn(
                               "h-1.5 w-1.5 rounded-full animate-pulse",
                               claim.status === 'investigating' ? "bg-blue-500" : 
                               claim.status === 'approved' ? "bg-emerald-500" : "bg-slate-400"
                             )} />
                             <span className="text-[10px] font-black text-slate-900 uppercase tracking-tight">
                               {claim.status === 'investigating' ? 'Изучение' : 
                                claim.status === 'approved' ? 'Одобрено' : 
                                claim.status === 'pending' ? 'Ожидает' : claim.status}
                             </span>
                           </div>
                         </td>
                         <td className="p-4">
                           <span className="text-xs font-bold text-slate-600">ID Ритейлера: {claim.retailerId}</span>
                         </td>
                         <td className="p-4">
                           {claim.resolution ? (
                             <Badge className="bg-indigo-50 text-indigo-600 border-none text-[8px] font-black uppercase">
                               {claim.resolution === 'credit_note' ? 'Кредит-нота' : 
                                claim.resolution === 'replacement' ? 'Замена' : 
                                claim.resolution === 'refund' ? 'Возврат' : claim.resolution.replace('_', ' ')}
                             </Badge>
                           ) : (
                             <span className="text-[10px] font-black text-slate-300 uppercase italic">В процессе</span>
                           )}
                         </td>
                         <td className="p-4 text-right">
                            <Button variant="ghost" className="h-10 w-10 rounded-xl p-0 hover:bg-white border border-transparent hover:border-slate-100">
                               <ChevronRight className="h-4 w-4" />
                            </Button>
                         </td>
                       </tr>
                     ))}
                   </tbody>
                </table>
              </div>
           </div>

           {/* Resolution Tools (Admin/Brand view) */}
           {viewRole === 'brand' && (
             <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
               {[
                 { label: 'Выставить кредит-ноту', icon: CreditCard, desc: 'Корректировка баланса' },
                 { label: 'Одобрить замену', icon: RefreshCcw, desc: 'Бесплатная переотправка' },
                 { label: 'Архивировать запись', icon: Archive, desc: 'Завершить и закрыть' }
               ].map((tool, i) => (
                 <Card key={i} className="group border-none shadow-xl shadow-slate-200/50 rounded-xl bg-white cursor-pointer hover:border-indigo-200 border transition-all">
                    <CardContent className="p-4 flex items-center gap-3">
                       <div className="h-10 w-10 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-lg">
                          <tool.icon className="h-6 w-6" />
                       </div>
                       <div className="space-y-1">
                          <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">{tool.label}</h4>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{tool.desc}</p>
                       </div>
                    </CardContent>
                 </Card>
               ))}
             </div>
           )}
        </div>
      </div>

      {/* New Claim Modal */}
      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-white/40">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-2xl rounded-xl shadow-2xl border border-slate-100 overflow-hidden"
            >
              <div className="p-3 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Badge className="bg-rose-600 text-white border-none text-[8px] font-black uppercase tracking-widest px-2 py-0.5">Официальный_запрос</Badge>
                    <h2 className="text-base font-black uppercase tracking-tighter text-slate-900">Открыть претензию</h2>
                  </div>
                  <Button variant="ghost" onClick={() => setIsFormOpen(false)} className="h-12 w-12 rounded-2xl p-0 hover:bg-slate-50">
                    <Plus className="h-6 w-6 rotate-45" />
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                   <div className="space-y-2">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Номер заказа</p>
                     <Input placeholder="ORD-XXXX" className="h-10 rounded-2xl border-slate-100 bg-slate-50" />
                   </div>
                   <div className="space-y-2">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Тип претензии</p>
                     <select className="w-full h-10 rounded-2xl border border-slate-100 bg-slate-50 px-4 text-sm font-bold appearance-none">
                        <option>Повреждение при доставке</option>
                        <option>Недостача товара</option>
                        <option>Дефект качества</option>
                        <option>Некорректный SKU</option>
                     </select>
                   </div>
                </div>

                <div className="space-y-2">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Описание проблемы</p>
                  <textarea className="w-full h-32 rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-rose-500/20" placeholder="Пожалуйста, предоставьте подробную информацию о дефекте..." />
                </div>

                <div className="space-y-4">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Загрузка доказательств</p>
                   <div className="grid grid-cols-4 gap-3">
                      <button className="aspect-square rounded-2xl border-2 border-dashed border-slate-100 flex flex-col items-center justify-center gap-2 hover:border-rose-300 hover:bg-rose-50 transition-all text-slate-300 hover:text-rose-600 group">
                         <Camera className="h-6 w-6" />
                         <span className="text-[8px] font-black uppercase tracking-widest">Добавить фото</span>
                      </button>
                   </div>
                </div>

                <div className="flex items-center gap-3 pt-4">
                   <Button variant="ghost" onClick={() => setIsFormOpen(false)} className="h-10 flex-1 rounded-2xl font-black uppercase text-[10px] tracking-widest">Отмена</Button>
                   <Button className="h-10 flex-[2] bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-slate-200">Отправить претензию</Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
