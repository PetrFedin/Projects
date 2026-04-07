'use client';

import React, { useState, useMemo } from 'react';
import { 
  Handshake, DollarSign, Scale, Zap, Globe, 
  ShieldCheck, FileText, CheckCircle2, RefreshCcw, 
  ChevronRight, ArrowRight, Info, Percent, Clock,
  Users, Building2, Landmark, Briefcase, Calculator,
  TrendingUp, AlertTriangle, ShieldAlert,   BadgePercent,
  Search, Filter, LayoutGrid, Truck
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const MOCK_PARTNERS_TERMS = [
  { id: 'p1', name: 'ЦУМ (Moscow)', type: 'Department Store', tier: 'VIP', volume: '12.4M ₽', discount: 45, payment: 'Factoring 60d', logistics: 'Ex-Works', status: 'Active' },
  { id: 'p2', name: 'PODIUM', type: 'Boutique', tier: 'Retail', volume: '4.2M ₽', discount: 40, payment: 'Prepayment 100%', logistics: 'DDP', status: 'Active' },
  { id: 'p3', name: 'Lamoda', type: 'Marketplace', tier: 'Market', volume: '8.1M ₽', discount: 50, payment: 'Consignment', logistics: 'Fulfillment', status: 'Review' }
];

export function CommercialTermsMatrix() {
  const [selectedPartnerId, setSelectedPartnerId] = useState<string | null>(null);
  const selectedPartner = useMemo(() => MOCK_PARTNERS_TERMS.find(p => p.id === selectedPartnerId), [selectedPartnerId]);

  // Pricing Engine State
  const [basePrice, setBasePrice] = useState(18000);
  
  const calculatedPrices = useMemo(() => {
    return {
      vip: basePrice * (1 - 0.45),
      retail: basePrice * (1 - 0.40),
      market: basePrice * (1 - 0.50)
    };
  }, [basePrice]);

  return (
    <div className="space-y-4 animate-in fade-in duration-700">
      <Card className="rounded-xl border-none shadow-2xl overflow-hidden bg-white">
        <CardHeader className="p-3 pb-4 bg-emerald-600 text-white">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <div className="flex items-center gap-2 mb-1">
                <Handshake className="h-6 w-6 text-white" />
                <span className="text-[10px] font-black text-emerald-200 uppercase tracking-widest">B2B Commercial Engine</span>
              </div>
              <CardTitle className="text-base font-black uppercase tracking-tighter">Commercial Terms Matrix</CardTitle>
              <CardDescription className="text-emerald-50 font-medium italic">Динамическое управление ценообразованием и условиями для разных групп партнеров.</CardDescription>
            </div>
            <div className="flex gap-2">
               <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 flex flex-col items-end">
                  <p className="text-[8px] font-black uppercase text-emerald-200">Базовая розничная цена (RRP)</p>
                  <div className="flex items-center gap-2">
                     <Input 
                        type="number" 
                        value={basePrice} 
                        onChange={(e) => setBasePrice(Number(e.target.value))}
                        className="w-24 h-8 bg-transparent border-none text-right font-black text-base p-0 focus-visible:ring-0 text-white"
                     />
                     <span className="font-black text-base text-white">₽</span>
                  </div>
               </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-3 pt-10 space-y-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
             <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex flex-col justify-between group hover:border-indigo-200 transition-all">
                <div>
                   <div className="flex items-center gap-3 mb-4">
                      <BadgePercent className="h-6 w-6 text-indigo-600" />
                      <span className="text-[11px] font-black uppercase text-slate-900 tracking-widest">Pricing Tiers (Wholesale)</span>
                   </div>
                   <p className="text-[10px] text-slate-500 leading-relaxed font-medium mb-6 uppercase">Оптовые цены, рассчитанные на основе выбранной розничной цены.</p>
                   <div className="space-y-3">
                      {[
                        { label: 'VIP (Tier 1)', discount: '45%', price: calculatedPrices.vip },
                        { label: 'Retail (Tier 2)', discount: '40%', price: calculatedPrices.retail },
                        { label: 'Market (Tier 3)', discount: '50%', price: calculatedPrices.market }
                      ].map((t, i) => (
                        <div key={i} className="flex justify-between items-center p-4 bg-white rounded-2xl border border-slate-100 shadow-sm group-hover:shadow-md transition-all">
                           <div>
                              <span className="text-[10px] font-black uppercase text-slate-400 block">{t.label}</span>
                              <span className="text-[8px] font-bold text-indigo-600 uppercase">Discount: {t.discount}</span>
                           </div>
                           <span className="text-sm font-black text-slate-900 tabular-nums">{t.price.toLocaleString('ru-RU')} ₽</span>
                        </div>
                      ))}
                   </div>
                </div>
                <Button variant="ghost" className="w-full mt-6 text-[9px] font-black uppercase text-indigo-600">Настроить тиры <ChevronRight className="h-3 w-3 ml-1" /></Button>
             </div>

             <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex flex-col justify-between group hover:border-emerald-200 transition-all">
                <div>
                   <div className="flex items-center gap-3 mb-4">
                      <Landmark className="h-6 w-6 text-emerald-600" />
                      <span className="text-[11px] font-black uppercase text-slate-900 tracking-widest">Режимы оплаты и факторинг</span>
                   </div>
                   <p className="text-[10px] text-slate-500 leading-relaxed font-medium mb-6 uppercase">Финансовые шлюзы и условия отсрочки платежей.</p>
                   <div className="space-y-4">
                      <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                         <div className="h-10 w-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-200 shrink-0">
                            <Zap className="h-5 w-5" />
                         </div>
                         <div>
                            <p className="text-[10px] font-black uppercase text-emerald-900 leading-tight">Syntha Factoring</p>
                            <p className="text-[8px] text-emerald-700 font-bold uppercase mt-0.5">Лимит: 120M ₽ • Ставка: 1.2%</p>
                         </div>
                      </div>
                      <div className="flex items-center gap-3 p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                         <div className="h-10 w-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200 shrink-0">
                            <CheckCircle2 className="h-5 w-5" />
                         </div>
                         <div>
                            <p className="text-[10px] font-black uppercase text-indigo-900 leading-tight">Escrow Contracts</p>
                            <p className="text-[8px] text-indigo-700 font-bold uppercase mt-0.5">Безопасные сделки для новых партнеров</p>
                         </div>
                      </div>
                   </div>
                </div>
                <Button className="w-full mt-6 h-12 bg-slate-900 text-white rounded-xl font-black uppercase text-[9px] shadow-xl">Шлюзы оплаты</Button>
             </div>

             <div className="p-4 bg-slate-900 rounded-xl text-white flex flex-col justify-between overflow-hidden relative group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                   <Globe className="h-32 w-32" />
                </div>
                <div className="relative z-10">
                   <div className="flex items-center gap-3 mb-6">
                      <div className="h-10 w-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/50">
                         <Truck className="h-5 w-5" />
                      </div>
                      <span className="text-[11px] font-black uppercase tracking-widest">Logistics Terms</span>
                   </div>
                   <div className="space-y-6">
                      <div className="space-y-2">
                         <p className="text-[9px] font-black uppercase text-white/40">Incoterms 2026 Engine</p>
                         <p className="text-xs font-medium text-white/80 leading-relaxed italic">«Авто-расчет страховки и пошлин при выборе условий поставки для каждого склада».</p>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                         <Badge className="bg-indigo-600/50 border border-indigo-400/30 text-white text-[8px] font-black uppercase py-2 flex items-center justify-center gap-2">
                            <CheckCircle2 className="h-3 w-3 text-indigo-300" /> EXW Ready
                         </Badge>
                         <Badge className="bg-white/10 border border-white/5 text-white/60 text-[8px] font-black uppercase py-2 flex items-center justify-center gap-2">
                            <Clock className="h-3 w-3" /> DDP Active
                         </Badge>
                      </div>
                   </div>
                </div>
                <Button className="relative z-10 w-full mt-10 h-12 bg-white text-slate-900 hover:bg-slate-100 rounded-xl font-black uppercase text-[9px] shadow-2xl">Калькулятор доставки</Button>
             </div>
          </div>

          <div className="space-y-6">
             <div className="flex items-center justify-between">
                <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-400">Реестр партнерских условий</h4>
                <div className="flex gap-2">
                   <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                      <Input placeholder="Поиск партнера..." className="h-10 w-64 pl-9 rounded-xl border-slate-100 text-[10px] font-bold uppercase" />
                   </div>
                   <Button variant="outline" className="h-10 rounded-xl border-slate-100"><Filter className="h-4 w-4 text-slate-400" /></Button>
                </div>
             </div>

             <div className="border border-slate-100 rounded-xl overflow-hidden shadow-sm">
                <Table>
                   <TableHeader className="bg-slate-50">
                      <TableRow className="border-none">
                         <TableHead className="px-8 py-5 text-[10px] font-black uppercase text-slate-500 tracking-widest">Партнер / Тип</TableHead>
                         <TableHead className="py-5 text-[10px] font-black uppercase text-slate-500 tracking-widest">Tier / Скидка</TableHead>
                         <TableHead className="py-5 text-[10px] font-black uppercase text-slate-500 tracking-widest">Условия оплаты</TableHead>
                         <TableHead className="py-5 text-[10px] font-black uppercase text-slate-500 tracking-widest">Объем (YTD)</TableHead>
                         <TableHead className="py-5 text-[10px] font-black uppercase text-slate-500 tracking-widest">Статус</TableHead>
                         <TableHead className="px-8 py-5 text-right text-[10px] font-black uppercase text-slate-500 tracking-widest">Действия</TableHead>
                      </TableRow>
                   </TableHeader>
                   <TableBody>
                      {MOCK_PARTNERS_TERMS.map((p) => (
                        <TableRow 
                          key={p.id} 
                          onClick={() => setSelectedPartnerId(p.id)}
                          className={cn("group hover:bg-slate-50/50 transition-colors cursor-pointer", selectedPartnerId === p.id && "bg-emerald-50/30")}
                        >
                           <TableCell className="px-8 py-6">
                              <div className="flex items-center gap-3">
                                 <div className="h-12 w-12 bg-white border border-slate-100 rounded-2xl flex items-center justify-center font-black text-sm text-emerald-600 shadow-sm group-hover:scale-105 transition-transform">{p.name[0]}</div>
                                 <div>
                                    <p className="text-sm font-black uppercase text-slate-900 tracking-tight">{p.name}</p>
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{p.type}</p>
                                 </div>
                              </div>
                           </TableCell>
                           <TableCell>
                              <div className="flex flex-col gap-1">
                                 <Badge className={cn(
                                    "w-fit text-[8px] font-black uppercase px-2 h-5 border-none",
                                    p.tier === 'VIP' ? "bg-amber-100 text-amber-700" : "bg-indigo-100 text-indigo-700"
                                 )}>
                                    {p.tier}
                                 </Badge>
                                 <span className="text-xs font-black text-slate-900">-{p.discount}%</span>
                              </div>
                           </TableCell>
                           <TableCell className="text-[10px] font-black text-slate-900 uppercase italic tracking-tighter">{p.payment}</TableCell>
                           <TableCell className="text-[10px] font-black text-slate-900 tabular-nums">{p.volume}</TableCell>
                           <TableCell>
                              <Badge className={cn(
                                 "text-[8px] font-black uppercase px-2 h-5 border-none shadow-sm",
                                 p.status === 'Active' ? "bg-emerald-500 text-white" : "bg-amber-500 text-white"
                              )}>
                                 {p.status}
                              </Badge>
                           </TableCell>
                           <TableCell className="px-8 py-6 text-right">
                              <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl group-hover:bg-white group-hover:shadow-md transition-all"><FileText className="h-4 w-4 text-slate-400" /></Button>
                           </TableCell>
                        </TableRow>
                      ))}
                   </TableBody>
                </Table>
             </div>
          </div>
        </CardContent>
      </Card>

      <AnimatePresence>
        {selectedPartnerId && selectedPartner && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-3"
          >
             <Card className="rounded-xl border-none shadow-xl bg-slate-900 text-white p-3 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                   <TrendingUp className="h-32 w-32" />
                </div>
                <div className="relative z-10 space-y-6">
                   <div>
                      <Badge className="bg-indigo-600 text-white border-none uppercase text-[8px] font-black mb-2">Partner Health Check</Badge>
                      <h4 className="text-base font-black uppercase tracking-tighter">Анализ эффективности {selectedPartner.name}</h4>
                   </div>
                   <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                         <div className="flex justify-between text-[10px] font-black uppercase text-indigo-300">
                            <span>Sell-Through</span>
                            <span>84%</span>
                         </div>
                         <Progress value={84} className="h-1 bg-white/10" />
                      </div>
                      <div className="space-y-2">
                         <div className="flex justify-between text-[10px] font-black uppercase text-indigo-300">
                            <span>Лояльность</span>
                            <span>High</span>
                         </div>
                         <Progress value={92} className="h-1 bg-white/10" />
                      </div>
                   </div>
                   <p className="text-sm text-white/60 font-medium leading-relaxed italic">
                      «Партнер показывает отличную динамику продаж. AI рекомендует повысить скидку до 48% при условии увеличения объема предзаказа на 15% в следующем сезоне».
                   </p>
                   <Button className="bg-white text-slate-900 hover:bg-slate-100 rounded-2xl h-10 px-8 font-black uppercase text-[10px] tracking-widest shadow-2xl">Сгенерировать оффер</Button>
                </div>
             </Card>

             <Card className="rounded-xl border-slate-100 shadow-xl bg-white p-3 flex flex-col justify-between">
                <div className="space-y-6">
                   <div className="flex items-center gap-3">
                      <div className="h-12 w-12 bg-rose-50 rounded-2xl flex items-center justify-center">
                         <ShieldAlert className="h-6 w-6 text-rose-500" />
                      </div>
                      <h4 className="text-base font-black uppercase tracking-tight">Проверка рисков</h4>
                   </div>
                   <div className="space-y-4">
                      <div className="p-4 bg-rose-50 rounded-2xl border border-rose-100 space-y-2">
                         <p className="text-[10px] font-black uppercase text-rose-900 leading-tight">Просрочка платежей</p>
                         <p className="text-[9px] text-rose-700 font-bold uppercase">0 дней • Риск отсутствует</p>
                      </div>
                      <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 space-y-2">
                         <p className="text-[10px] font-black uppercase text-emerald-900 leading-tight">Юридическая проверка</p>
                         <p className="text-[9px] text-emerald-700 font-bold uppercase">Пройдена (Feb 2026)</p>
                      </div>
                   </div>
                </div>
                <div className="pt-8 border-t border-slate-50 flex justify-between items-center">
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Данные синхронизированы с CRM</p>
                   <Button variant="ghost" className="text-[9px] font-black uppercase text-slate-400 hover:text-slate-900">Просмотреть договор</Button>
                </div>
             </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
