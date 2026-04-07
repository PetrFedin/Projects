'use client';

import React, { useState } from 'react';
import { 
  Users, TrendingUp, ShoppingBag, Heart, Target, 
  MessageSquare, Star, ArrowUpRight, Filter, Search,
  Calendar, Zap, BarChart3, UserCheck, ShieldCheck,
  Smartphone, Store, Globe, MousePointer2, RefreshCw
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const MOCK_CUSTOMERS = [
  { id: 'c1', name: 'Александра В.', city: 'Москва', ltv: '142,000 ₽', segment: 'VIP', affinity: 'Techwear', lastPurchase: '2 дня назад', score: 98 },
  { id: 'c2', name: 'Дмитрий К.', city: 'СПб', ltv: '45,600 ₽', segment: 'Loyal', affinity: 'Outerwear', lastPurchase: '14 дней назад', score: 82 },
  { id: 'c3', name: 'Елена М.', city: 'Казань', ltv: '12,900 ₽', segment: 'New', affinity: 'Accessories', lastPurchase: '1 час назад', score: 75 }
];

export function Analytics360() {
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>('c1');
  const selectedCustomer = MOCK_CUSTOMERS.find(c => c.id === selectedCustomerId);

  return (
    <div className="space-y-10 animate-in fade-in duration-1000">
      <Card className="rounded-xl border-none shadow-2xl overflow-hidden bg-white">
        <CardHeader className="p-3 pb-4 bg-indigo-600 text-white">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <div className="flex items-center gap-2 mb-1">
                <Users className="h-6 w-6 text-indigo-200" />
                <span className="text-[10px] font-black text-indigo-200 uppercase tracking-widest">Customer Intelligence 360°</span>
              </div>
              <CardTitle className="text-base font-black uppercase tracking-tighter">CRM & Поведенческая Аналитика</CardTitle>
              <CardDescription className="text-indigo-50 font-medium italic">Сквозной профиль клиента: от AR-примерок до повторных покупок и лояльности.</CardDescription>
            </div>
            <div className="flex gap-3">
               <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 flex flex-col items-end">
                  <p className="text-[8px] font-black uppercase text-indigo-200">Active Omni-Profiles</p>
                  <p className="text-sm font-black text-white">12,482</p>
               </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-3 pt-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
             {/* Customer Segment List */}
             <div className="lg:col-span-4 space-y-6">
                <div className="flex items-center justify-between mb-4">
                   <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-400">Топ клиентов (Omni)</h4>
                   <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg"><Filter className="h-4 w-4 text-slate-400" /></Button>
                </div>
                <div className="space-y-3">
                   {MOCK_CUSTOMERS.map((customer) => (
                     <div 
                        key={customer.id}
                        onClick={() => setSelectedCustomerId(customer.id)}
                        className={cn(
                          "p-3 rounded-3xl border transition-all cursor-pointer group flex items-center gap-3",
                          selectedCustomerId === customer.id 
                            ? "bg-indigo-50 border-indigo-200 shadow-lg" 
                            : "bg-white border-slate-100 hover:bg-slate-50"
                        )}
                     >
                        <Avatar className="h-12 w-12 border-2 border-white shadow-md">
                           <AvatarFallback className="bg-slate-900 text-white font-black text-xs">{customer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                           <p className="text-sm font-black uppercase text-slate-900 leading-tight">{customer.name}</p>
                           <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{customer.city} • {customer.ltv}</p>
                        </div>
                        <Badge className={cn(
                          "text-[8px] font-black uppercase px-2 py-0.5 border-none",
                          customer.segment === 'VIP' ? "bg-amber-500 text-white" : "bg-indigo-600 text-white"
                        )}>
                           {customer.segment}
                        </Badge>
                     </div>
                   ))}
                </div>
                <Button asChild variant="outline" className="w-full h-12 rounded-2xl border-slate-200 text-slate-400 text-[10px] font-black uppercase hover:text-indigo-600">
                    <Link href="/brand/customers">Просмотреть всех клиентов</Link>
                </Button>
             </div>

             {/* 360 Profile View */}
             <div className="lg:col-span-8 space-y-4">
                <AnimatePresence mode="wait">
                   {selectedCustomer && (
                     <motion.div
                       key={selectedCustomer.id}
                       initial={{ opacity: 0, y: 20 }}
                       animate={{ opacity: 1, y: 0 }}
                       exit={{ opacity: 0, y: -20 }}
                       className="space-y-4"
                     >
                        {/* Profile Header Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                           {[
                             { label: 'Customer Score', value: selectedCustomer.score, icon: Target, color: 'text-indigo-600', href: '/brand/customer-intelligence' },
                             { label: 'Returns Rate', value: '4.2%', icon: RefreshCw, color: 'text-emerald-600', href: '/brand/inventory' },
                             { label: 'AR Engagement', value: 'High', icon: Smartphone, color: 'text-rose-600', href: '/brand/products' }
                           ].map((stat, i) => (
                             <Link key={i} href={stat.href} className="group/stat">
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-3 group-hover/stat:bg-white group-hover/stat:shadow-xl transition-all cursor-pointer relative overflow-hidden">
                                   <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover/stat:bg-slate-900 group-hover/stat:text-white transition-all">
                                      <stat.icon className={cn("h-6 w-6", stat.color, "group-hover/stat:text-white")} />
                                   </div>
                                   <div>
                                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                                      <p className="text-base font-black text-slate-900">{stat.value}</p>
                                   </div>
                                   <ArrowUpRight className="absolute top-4 right-4 h-3 w-3 text-slate-300 opacity-0 group-hover/stat:opacity-100 transition-all" />
                                </div>
                             </Link>
                           ))}
                        </div>

                        {/* Behavior Timeline & Affinity */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                           <div className="p-4 bg-white rounded-xl border border-slate-100 shadow-xl space-y-6">
                              <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-900 flex items-center gap-2">
                                 <MousePointer2 className="h-4 w-4 text-indigo-600" /> Последние действия
                              </h4>
                              <div className="space-y-4">
                                 {[
                                   { action: 'Примерка в AR (Mobile)', time: '2ч назад', status: 'Success' },
                                   { action: 'Просмотр лукбука SS26', time: '1д назад', status: 'Completed' },
                                   { action: 'Покупка в магазине (ЦУМ)', time: '2д назад', status: 'Completed' }
                                 ].map((item, i) => (
                                   <div key={i} className="flex justify-between items-center py-3 border-b border-slate-50 last:border-none">
                                      <div>
                                         <p className="text-[10px] font-black uppercase text-slate-900">{item.action}</p>
                                         <p className="text-[9px] text-slate-400 font-bold uppercase">{item.time}</p>
                                      </div>
                                      <Badge variant="outline" className="text-[8px] font-black uppercase border-slate-200 text-slate-400">{item.status}</Badge>
                                   </div>
                                 ))}
                              </div>
                           </div>

                           <div className="p-4 bg-slate-900 rounded-xl text-white space-y-6 relative overflow-hidden">
                              <div className="absolute top-0 right-0 p-4 opacity-10">
                                 <Heart className="h-24 w-24 fill-white" />
                              </div>
                              <div className="relative z-10 space-y-6">
                                 <h4 className="text-[11px] font-black uppercase tracking-widest text-indigo-400">Интересы (Affinity Score)</h4>
                                 <div className="space-y-4">
                                    {[
                                      { label: 'Techwear / Urban', val: 92 },
                                      { label: 'Sustainability', val: 78 },
                                      { label: 'Outerwear', val: 45 }
                                    ].map((aff, i) => (
                                      <div key={i} className="space-y-2">
                                         <div className="flex justify-between text-[9px] font-black uppercase">
                                            <span>{aff.label}</span>
                                            <span>{aff.val}%</span>
                                         </div>
                                         <Progress value={aff.val} className="h-1 bg-white/10" />
                                      </div>
                                    ))}
                                 </div>
                                 <p className="text-[10px] text-white/40 leading-relaxed italic">
                                    «Клиент склонен к покупке новой коллекции Parka v3. Рекомендуем отправить персональный пуш с доступом к предзаказу».
                                 </p>
                              </div>
                           </div>
                        </div>

                        {/* Loyalty Status */}
                        <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center justify-between">
                           <div className="flex items-center gap-3">
                              <div className="h-12 w-12 bg-white rounded-3xl flex items-center justify-center shadow-lg border border-emerald-100">
                                 <ShieldCheck className="h-8 w-8 text-emerald-600" />
                              </div>
                              <div>
                                 <p className="text-[10px] font-black uppercase text-emerald-900 tracking-widest">Статус Лояльности</p>
                                 <h4 className="text-sm font-black text-emerald-900 uppercase tracking-tighter">Verified Ambassador</h4>
                              </div>
                           </div>
                           <div className="text-right">
                              <p className="text-[10px] font-black uppercase text-emerald-700 tracking-widest">Баланс жетонов</p>
                              <p className="text-sm font-black text-emerald-900">4,200 <span className="text-sm">SYN</span></p>
                           </div>
                        </div>
                     </motion.div>
                   )}
                </AnimatePresence>
             </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
