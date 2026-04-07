'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Truck, 
  Ship, 
  Globe, 
  Package, 
  Clock, 
  Plus, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  TrendingUp, 
  Zap,
  DollarSign,
  MapPin,
  Layers,
  Search,
  Users,
  Box,
  Share2,
  Calendar,
  Building2,
  Lock,
  History,
  Info,
  ExternalLink
} from 'lucide-react';
import { CONSOLIDATION_POOL, findConsolidationMatches, calculateConsolidationSavings } from '@/lib/logic/consolidation-utils';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { SectionInfoCard } from '@/components/brand/production/ProductionSectionEnhancements';

/**
 * Smart Logistics Consolidation UI
 * Группировка грузов разных брендов для снижения расходов на логистику.
 */

export default function LogisticsConsolidationPage() {
  const [activeTab, setActiveTab] = useState<'pool' | 'my-requests' | 'history'>('pool');
  const [selectedMatches, setSelectedMatches] = useState<string[]>([]);

  // Simulation of current brand request
  const myRequest = { id: 'REQ-NEW', brandId: 'My Brand', origin: 'Shanghai, CN', destination: 'Moscow, RU', volume: 4.5, weight: 850, readyDate: '2026-03-21', status: 'pending' as const };
  
  const matches = useMemo(() => findConsolidationMatches(myRequest), [myRequest]);
  const savings = useMemo(() => calculateConsolidationSavings([...matches.filter(m => selectedMatches.includes(m.id)), myRequest]), [selectedMatches, matches, myRequest]);

  const toggleMatch = (id: string) => {
    setSelectedMatches(prev => prev.includes(id) ? prev.filter(mid => mid !== id) : [...prev, id]);
  };

  return (
    <div className="container mx-auto px-4 py-4 space-y-10">
      <SectionInfoCard
        title="Консолидация грузов"
        description="Объединение партий разных брендов для снижения логистических расходов. Связь с Production (отгрузки) и Duty Calculator. Pool грузов, заявки, история."
        icon={Ship}
        iconBg="bg-blue-100"
        iconColor="text-blue-600"
        badges={<><Badge variant="outline" className="text-[9px]">Production → отгрузки</Badge><Badge variant="outline" className="text-[9px]">Duty Calculator</Badge><Button variant="outline" size="sm" className="text-[9px] h-7 ml-1" asChild><Link href="/brand/warehouse">Warehouse</Link></Button><Button variant="outline" size="sm" className="text-[9px] h-7" asChild><Link href="/brand/logistics/duty-calculator">Duty Calc</Link></Button><Button variant="outline" size="sm" className="text-[9px] h-7" asChild><Link href="/brand/logistics/shadow-inventory">Shadow Inventory</Link></Button></>}
      />
      <header className="flex flex-col md:flex-row justify-between md:items-end gap-3">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-600">
            <Ship className="w-3 h-3" />
            Smart Consolidation Hub
          </div>
          <h1 className="text-sm font-black font-headline tracking-tighter uppercase">Logistics Consolidation</h1>
          <p className="text-muted-foreground font-medium">Объединяйте грузы с другими брендами и экономьте до 35% на логистике.</p>
        </div>
        <div className="flex gap-2">
           <Button variant="outline" className="gap-2 rounded-xl h-11 px-6 font-black uppercase text-[10px]">
              <History className="w-4 h-4" /> Архив грузов
           </Button>
           <Button className="gap-2 rounded-xl h-11 px-6 font-black uppercase text-[10px] bg-slate-900 text-white shadow-lg shadow-slate-200">
              <Plus className="w-4 h-4" /> Новый запрос на перевозку
           </Button>
        </div>
      </header>

      {/* KPI Stats */}
      <div className="grid md:grid-cols-4 gap-3">
         {[
           { label: 'Доступно в пуле', value: CONSOLIDATION_POOL.length, icon: Box, color: 'text-slate-900' },
           { label: 'Подходящие пары', value: matches.length, icon: Users, color: 'text-indigo-600' },
           { label: 'Потенциальная экономия', value: `$${savings.estimatedSavings.toLocaleString()}`, icon: TrendingUp, color: 'text-emerald-600' },
           { label: 'Ваш объем (CBM)', value: myRequest.volume, icon: Layers, color: 'text-slate-400' }
         ].map((stat, i) => (
           <Card key={i} className="border-none shadow-sm bg-white rounded-3xl p-4">
              <div className="flex items-center gap-3 mb-2">
                 <div className="p-2 bg-slate-50 rounded-xl"><stat.icon className="w-4 h-4 text-slate-400" /></div>
                 <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{stat.label}</span>
              </div>
              <p className={`text-sm font-black ${stat.color}`}>{stat.value}</p>
           </Card>
         ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-3">
         <div className="lg:col-span-2 space-y-6">
            <Card className="border-none shadow-xl shadow-slate-200/50 rounded-xl overflow-hidden">
               <CardHeader className="p-4 border-b border-slate-50 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-black uppercase tracking-tight">Consolidation Pool</CardTitle>
                    <CardDescription>Запросы от других брендов по вашим маршрутам.</CardDescription>
                  </div>
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" />
                    <Input placeholder="Фильтр по городу / дате" className="pl-9 h-10 rounded-xl border-slate-100 text-xs w-64" />
                  </div>
               </CardHeader>
               <CardContent className="p-0">
                  <Table>
                     <TableHeader className="bg-slate-50/50">
                        <TableRow>
                           <TableHead className="pl-8 text-[10px] font-black uppercase">Выбрать</TableHead>
                           <TableHead className="text-[10px] font-black uppercase">Маршрут (Откуда - Куда)</TableHead>
                           <TableHead className="text-[10px] font-black uppercase">Параметры (CBM/KG)</TableHead>
                           <TableHead className="text-[10px] font-black uppercase">Дата готовности</TableHead>
                           <TableHead className="pr-8 text-right text-[10px] font-black uppercase">Действие</TableHead>
                        </TableRow>
                     </TableHeader>
                     <TableBody>
                        {matches.length === 0 ? (
                           <TableRow>
                              <TableCell colSpan={5} className="py-10 text-center">
                                 <div className="space-y-4">
                                    <Ship className="w-12 h-12 text-slate-100 mx-auto" />
                                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest italic">Пока нет подходящих пар для консолидации</p>
                                 </div>
                              </TableCell>
                           </TableRow>
                        ) : (
                           matches.map(req => (
                              <TableRow key={req.id} className={cn("hover:bg-slate-50/50 transition-colors", selectedMatches.includes(req.id) && "bg-indigo-50/30")}>
                                 <TableCell className="pl-8 py-6">
                                    <input 
                                       type="checkbox" 
                                       checked={selectedMatches.includes(req.id)}
                                       onChange={() => toggleMatch(req.id)}
                                       className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600 cursor-pointer" 
                                    />
                                 </TableCell>
                                 <TableCell>
                                    <div className="flex items-center gap-2">
                                       <div className="flex flex-col">
                                          <span className="text-xs font-black text-slate-900">{req.origin}</span>
                                          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Destination: {req.destination}</span>
                                       </div>
                                       <ArrowRight className="w-3 h-3 text-slate-300" />
                                       <span className="text-xs font-black text-slate-900">{req.destination}</span>
                                    </div>
                                 </TableCell>
                                 <TableCell>
                                    <div className="flex flex-wrap gap-2">
                                       <Badge variant="outline" className="text-[8px] font-black uppercase bg-slate-50 border-slate-100">{req.volume} CBM</Badge>
                                       <Badge variant="outline" className="text-[8px] font-black uppercase bg-slate-50 border-slate-100">{req.weight} KG</Badge>
                                    </div>
                                 </TableCell>
                                 <TableCell>
                                    <div className="flex items-center gap-1.5">
                                       <Calendar className="w-3 h-3 text-slate-400" />
                                       <span className="text-xs font-mono font-medium text-slate-600">{new Date(req.readyDate).toLocaleDateString()}</span>
                                    </div>
                                 </TableCell>
                                 <TableCell className="pr-8 text-right">
                                    <Button variant="ghost" size="icon" className="text-slate-300 hover:text-indigo-600 h-8 w-8">
                                       <Info className="w-4 h-4" />
                                    </Button>
                                 </TableCell>
                              </TableRow>
                           ))
                        )}
                     </TableBody>
                  </Table>
               </CardContent>
            </Card>
         </div>

         <div className="space-y-6">
            <Card className="border-none shadow-2xl shadow-emerald-100 rounded-xl bg-emerald-600 text-white p-3 overflow-hidden relative">
               <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-24 translate-x-24 blur-3xl" />
               <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-400/20 rounded-full translate-y-16 -translate-x-16 blur-2xl" />

               <div className="relative space-y-4">
                  <div className="flex items-center gap-3">
                     <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
                        <Zap className="w-6 h-6 text-white" />
                     </div>
                     <div>
                        <h3 className="text-sm font-black uppercase tracking-tight">Consolidation Savings</h3>
                        <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">ЭКОНОМИЯ ПРИ ОБЪЕДИНЕНИИ ГРУЗОВ</p>
                     </div>
                  </div>

                  <div className="space-y-1">
                     <p className="text-base font-black tracking-tighter">${savings.estimatedSavings.toFixed(0)}</p>
                     <p className="text-[10px] font-black uppercase text-white/50 tracking-widest">ESTIMATED LOGISTICS SAVINGS (USD)</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-6 border-t border-white/10">
                     <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase text-white/40 tracking-widest">Total Volume</p>
                        <p className="text-sm font-black text-white">{savings.totalCBM.toFixed(1)} CBM</p>
                     </div>
                     <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase text-white/40 tracking-widest">Selected Brands</p>
                        <p className="text-sm font-black text-emerald-200">{selectedMatches.length + 1}</p>
                     </div>
                  </div>

                  <Button 
                    disabled={selectedMatches.length === 0}
                    className="w-full h-10 bg-white text-emerald-600 hover:bg-emerald-50 border-none rounded-2xl font-black uppercase text-[10px] shadow-lg shadow-emerald-700/20 disabled:opacity-50"
                  >
                     Отправить запрос на объединение
                  </Button>
               </div>
            </Card>

            <Card className="border-none shadow-xl shadow-slate-200/50 rounded-xl p-4">
               <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 rounded-2xl bg-slate-50 flex items-center justify-center">
                     <AlertTriangle className="w-5 h-5 text-amber-500" />
                  </div>
                  <h3 className="text-sm font-black uppercase tracking-tight text-slate-900">Why Consolidate?</h3>
               </div>
               
               <div className="space-y-4">
                  {[
                     { title: 'Lower Freight Cost', desc: 'LCL (Less than Container Load) rates are higher than shared containers.' },
                     { title: 'Faster Clearance', desc: 'Consolidated shipments often get prioritized by logistics agents.' },
                     { title: 'ESG Benefits', desc: 'Reduced carbon footprint by optimizing shipping space.' }
                  ].map((benefit, i) => (
                     <div key={i} className="space-y-1">
                        <p className="text-[11px] font-black uppercase text-slate-900 tracking-tight">{benefit.title}</p>
                        <p className="text-[10px] text-slate-400 font-medium leading-relaxed">{benefit.desc}</p>
                     </div>
                  ))}
               </div>
               
               <div className="mt-8 pt-8 border-t border-slate-50">
                  <Button variant="ghost" className="w-full text-indigo-600 hover:bg-indigo-50 rounded-xl font-black uppercase text-[9px] h-10 gap-2">
                     Learn More About Hub <ExternalLink className="w-3.5 h-3.5" />
                  </Button>
               </div>
            </Card>
         </div>
      </div>
    </div>
  );
}
