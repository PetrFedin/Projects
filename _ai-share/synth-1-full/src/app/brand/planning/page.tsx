'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { 
  Target, 
  BrainCircuit, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  BarChart3, 
  Plus, 
  Zap,
  ChevronRight,
  Calculator
} from 'lucide-react';
import { PlannedSKU, SKUDemandForecast } from '@/lib/types/analytics';
import { simulateCollectionDemand } from '@/ai/flows/sku-planner';
import { cn } from "@/lib/utils";
import { SectionInfoCard } from "@/components/brand/production/ProductionSectionEnhancements";

/**
 * Smart Range Planner UI
 * Инструмент планирования ассортиментной матрицы с AI-симуляцией спроса.
 */

export default function SmartPlanningPage() {
  const [isSimulating, setIsSimulating] = useState(false);
  const [plannedItems, setPlannedItems] = useState<PlannedSKU[]>([
    { id: '1', name: 'Oversized Wool Coat', category: 'Outerwear', type: 'trend', plannedQty: 200, estimatedCost: 85, targetRetailPrice: 350, estimatedMargin: 75, aiRiskScore: 0.2 },
    { id: '2', name: 'Essential White Shirt', category: 'Tops', type: 'core', plannedQty: 1000, estimatedCost: 15, targetRetailPrice: 65, estimatedMargin: 76, aiRiskScore: 0.1 },
    { id: '3', name: 'Vegan Leather Pants', category: 'Bottoms', type: 'novelty', plannedQty: 150, estimatedCost: 45, targetRetailPrice: 180, estimatedMargin: 75, aiRiskScore: 0.4 },
  ]);
  const [forecasts, setForecasts] = useState<SKUDemandForecast[] | null>(null);

  const runSimulation = async () => {
    setIsSimulating(true);
    try {
      const results = await simulateCollectionDemand({
        brandId: 'brand-123',
        plannedItems
      });
      setForecasts(results);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-4 space-y-4 max-w-5xl pb-24 animate-in fade-in duration-700">
      <SectionInfoCard
        title="Smart Range Matrix"
        description="Планирование ассортимента с AI-симуляцией спроса. Связи: Products (PIM), Production, Analytics, Finance — Landed Cost и P&L."
        icon={Target}
        iconBg="bg-indigo-100"
        iconColor="text-indigo-600"
        badges={<><Badge variant="outline" className="text-[9px]">AI Planner</Badge><Button variant="outline" size="sm" className="text-[9px] h-7 ml-1" asChild><Link href="/brand/products"><Calculator className="h-3 w-3 mr-1" /> Products</Link></Button><Button variant="outline" size="sm" className="text-[9px] h-7" asChild><Link href="/brand/production">Production</Link></Button><Button variant="outline" size="sm" className="text-[9px] h-7" asChild><Link href="/brand/analytics"><BarChart3 className="h-3 w-3 mr-1" /> Analytics</Link></Button><Button variant="outline" size="sm" className="text-[9px] h-7" asChild><Link href="/brand/finance">Finance</Link></Button></>}
      />
      <header className="flex flex-col md:flex-row justify-between md:items-end gap-3 border-b border-slate-100 pb-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
            <Target className="w-3 h-3 text-indigo-500" />
            <span className="hover:text-indigo-600 transition-colors cursor-pointer">Range Planner</span>
          </div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-base font-bold font-headline tracking-tighter uppercase text-slate-900 leading-none">Smart Range Matrix 2.0</h1>
            <Badge variant="outline" className="bg-indigo-50 text-indigo-600 border-indigo-100 font-bold text-[7px] px-1.5 h-4 gap-1 tracking-widest shadow-sm transition-all">
               <BrainCircuit className="w-2.5 h-2.5" /> AI ENABLED
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-inner">
           <Button variant="ghost" className="gap-1.5 rounded-lg h-7 px-3 font-bold uppercase text-[9px] tracking-widest bg-white text-slate-600 hover:bg-slate-50 shadow-sm transition-all border border-slate-200">
              <Plus className="w-3 h-3 text-slate-400" /> Add SKU
           </Button>
           <Button 
              onClick={runSimulation} 
              disabled={isSimulating}
              className="gap-1.5 rounded-lg h-7 px-4 font-bold uppercase text-[9px] tracking-widest bg-slate-900 text-white shadow-md hover:bg-indigo-600 transition-all"
           >
              {isSimulating ? <Zap className="w-3 h-3 animate-spin" /> : <Zap className="w-3 h-3 text-indigo-400" />}
              {isSimulating ? 'Simulating...' : 'Run Analysis'}
           </Button>
        </div>
      </header>

      {/* KPI Dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
         {[
           { label: 'TARGET BUDGET', value: '$145,000', icon: Calculator, color: 'text-slate-900', bg: 'bg-slate-50/50', border: 'border-slate-100' },
           { label: 'TARGET MARGIN', value: '74.5%', icon: BarChart3, color: 'text-emerald-600', bg: 'bg-emerald-50/50', border: 'border-emerald-100/50' },
           { label: 'SELL-THROUGH', value: forecasts ? '78%' : '--', icon: TrendingUp, color: 'text-indigo-600', bg: 'bg-indigo-50/50', border: 'border-indigo-100/50' },
           { label: 'RISK LEVEL', value: forecasts ? 'Low' : '--', icon: AlertTriangle, color: forecasts ? 'text-emerald-600' : 'text-slate-300', bg: 'bg-slate-50/50', border: 'border-slate-100' }
         ].map((kpi, i) => (
           <Card key={i} className={cn("border shadow-sm bg-white p-3 flex items-center gap-3.5 rounded-xl transition-all hover:border-indigo-100 hover:shadow-md group", kpi.border)}>
              <div className={cn("p-1.5 rounded-lg shrink-0 border shadow-inner transition-transform group-hover:scale-105", kpi.bg, kpi.color, kpi.border)}><kpi.icon className="w-4 h-4" /></div>
              <div className="space-y-0.5">
                 <p className="text-[9px] font-bold uppercase text-slate-400 tracking-[0.15em] leading-none">{kpi.label}</p>
                 <p className={cn("text-sm font-bold tracking-tight uppercase leading-none mt-1", kpi.color)}>{kpi.value}</p>
              </div>
           </Card>
         ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-3">
         <div className="lg:col-span-2 space-y-4">
            <Card className="border border-slate-100 shadow-sm rounded-xl overflow-hidden hover:border-indigo-100/50 transition-all">
               <CardHeader className="p-3.5 border-b border-slate-50 bg-slate-50/30 flex flex-row items-center justify-between">
                  <div className="space-y-0.5">
                    <CardTitle className="text-[11px] font-bold uppercase tracking-widest text-slate-700">Ассортиментная матрица</CardTitle>
                    <CardDescription className="text-[9px] text-slate-400 font-bold uppercase tracking-tight">Планируемые артикулы и объемы пошива.</CardDescription>
                  </div>
                  <Button variant="outline" className="h-7 px-3 rounded-lg bg-white border-slate-200 text-[9px] font-bold uppercase text-slate-600 hover:bg-slate-50 shadow-sm transition-all tracking-widest">Экспорт</Button>
               </CardHeader>
               <CardContent className="p-0">
                  <Table>
                     <TableHeader className="bg-slate-50/50">
                        <TableRow className="border-none h-9">
                           <TableHead className="pl-4 text-[9px] font-bold uppercase tracking-[0.2em] h-9 text-slate-400">Наименование</TableHead>
                           <TableHead className="text-[9px] font-bold uppercase tracking-[0.2em] h-9 text-slate-400">Тип</TableHead>
                           <TableHead className="text-[9px] font-bold uppercase tracking-[0.2em] h-9 text-slate-400 text-center">План</TableHead>
                           <TableHead className="text-[9px] font-bold uppercase tracking-[0.2em] text-center h-9 text-slate-400">Cost/Retail</TableHead>
                           <TableHead className="text-[9px] font-bold uppercase tracking-[0.2em] h-9 text-slate-400 text-center">Маржа</TableHead>
                           <TableHead className="pr-4 text-right text-[9px] font-bold uppercase tracking-[0.2em] h-9 text-slate-400">AI Прогноз</TableHead>
                        </TableRow>
                     </TableHeader>
                     <TableBody>
                        {plannedItems.map(item => {
                           const forecast = forecasts?.find(f => f.productId === item.id);
                           return (
                              <TableRow key={item.id} className="border-slate-50 hover:bg-indigo-50/20 transition-colors group h-11">
                                 <TableCell className="pl-4 py-2">
                                    <p className="font-bold text-[11px] text-slate-900 group-hover:text-indigo-600 transition-colors leading-tight uppercase tracking-tight">{item.name}</p>
                                    <p className="text-[8px] text-slate-400 uppercase font-bold tracking-widest mt-0.5">{item.category}</p>
                                 </TableCell>
                                 <TableCell className="py-2">
                                    <Badge variant="outline" className={cn(
                                       "text-[7px] font-bold uppercase px-1.5 h-3.5 border shadow-sm transition-all tracking-widest",
                                       item.type === 'core' ? "bg-slate-50 text-slate-500 border-slate-200" : 
                                       item.type === 'trend' ? "bg-indigo-50 text-indigo-600 border-indigo-100" : "bg-amber-50 text-amber-600 border-amber-100"
                                    )}>{item.type}</Badge>
                                 </TableCell>
                                 <TableCell className="font-mono text-[11px] font-bold py-2 text-center text-slate-700">{item.plannedQty}</TableCell>
                                 <TableCell className="text-center py-2">
                                    <div className="text-[10px] font-bold flex items-center justify-center gap-1">
                                       <span className="text-slate-400">${item.estimatedCost}</span>
                                       <span className="text-slate-200">/</span>
                                       <span className="text-slate-900">${item.targetRetailPrice}</span>
                                    </div>
                                 </TableCell>
                                 <TableCell className="font-bold text-emerald-600 text-[11px] py-2 text-center uppercase tracking-tighter">{item.estimatedMargin}%</TableCell>
                                 <TableCell className="pr-4 text-right py-2">
                                    {forecast ? (
                                       <div className="space-y-0.5">
                                          <p className="text-[11px] font-bold text-indigo-600 leading-none uppercase tracking-tighter">{Math.round(forecast.predictedDemand)} ед.</p>
                                          <div className="flex items-center justify-end gap-1 mt-1">
                                             <div className={cn("w-1 h-1 rounded-full shadow-sm", 
                                                forecast.confidence > 0.8 ? "bg-emerald-500" : "bg-amber-500"
                                             )} />
                                             <span className="text-[7px] font-bold text-slate-400 uppercase tracking-widest opacity-70">Conf. {Math.round(forecast.confidence * 100)}%</span>
                                          </div>
                                       </div>
                                    ) : (
                                       <span className="text-[9px] text-slate-300 font-bold uppercase tracking-widest opacity-50">Pending...</span>
                                    )}
                                 </TableCell>
                              </TableRow>
                           );
                        })}
                     </TableBody>
                  </Table>
               </CardContent>
            </Card>
         </div>

         <div className="space-y-4">
            <Card className="border border-indigo-500 shadow-xl shadow-indigo-100/30 rounded-xl bg-slate-900 text-white p-4 relative overflow-hidden group hover:bg-slate-800 transition-colors">
               <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full -translate-y-8 translate-x-8 blur-2xl group-hover:scale-110 transition-transform duration-700" ></div>
               <div className="relative z-10 space-y-4">
                  <div className="flex items-center gap-2.5">
                     <div className="h-8 w-8 rounded-lg bg-white/10 flex items-center justify-center border border-white/20 shadow-inner group-hover:bg-indigo-500 transition-colors">
                        <BrainCircuit className="w-4 h-4 text-indigo-400 group-hover:text-white" />
                     </div>
                     <div className="space-y-0.5">
                        <h3 className="text-[11px] font-bold uppercase tracking-widest leading-none">AI Strategic Insights</h3>
                        <p className="text-[8px] text-indigo-300 font-bold uppercase tracking-[0.2em] opacity-70 leading-none mt-1">Predictive Analysis</p>
                     </div>
                  </div>
                  
                  <div className="space-y-2.5">
                     {forecasts ? (
                        <>
                           <div className="space-y-1.5 p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors shadow-inner">
                              <div className="flex items-center gap-1.5 text-emerald-400">
                                 <CheckCircle2 className="w-3 h-3" />
                                 <p className="text-[8px] font-bold uppercase tracking-widest">Optimized Matrix</p>
                              </div>
                              <p className="text-[10px] text-white/80 leading-relaxed font-bold uppercase tracking-tight">
                                 Ваша коллекция сбалансирована. "Essential Shirt" имеет потенциал.
                              </p>
                           </div>
                           <div className="space-y-1.5 p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors shadow-inner">
                              <div className="flex items-center gap-1.5 text-amber-400">
                                 <AlertTriangle className="w-3 h-3" />
                                 <p className="text-[8px] font-bold uppercase tracking-widest">Risk Warning</p>
                              </div>
                              <p className="text-[10px] text-white/80 leading-relaxed font-bold uppercase tracking-tight">
                                 "Leather Pants" показывают риск оверстока. Тренд падает.
                              </p>
                           </div>
                        </>
                     ) : (
                        <div className="py-4 text-center space-y-3 bg-white/5 rounded-2xl border border-dashed border-white/10">
                           <Zap className="w-8 h-8 mx-auto text-indigo-500/30 animate-pulse" />
                           <p className="text-[8px] text-white/40 font-bold uppercase tracking-[0.2em] leading-tight px-4">Запустите симуляцию для инсайтов</p>
                        </div>
                     )}
                  </div>
                  <Button className="w-full h-8 bg-white text-slate-900 hover:bg-indigo-50 border-none rounded-lg font-bold uppercase text-[9px] shadow-xl shadow-indigo-900/40 tracking-widest transition-all">Открыть отчет</Button>
               </div>
            </Card>

            <Card className="border border-slate-100 shadow-sm rounded-xl p-4 space-y-4 hover:border-emerald-100 transition-all group">
               <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                     <div className="p-1.5 bg-emerald-50 rounded-lg text-emerald-600 shadow-inner border border-emerald-100 group-hover:scale-105 transition-transform"><TrendingUp className="w-3.5 h-3.5" /></div>
                     <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-900 leading-none">Market Trends</h3>
                  </div>
                  <Badge variant="outline" className="bg-slate-50 text-slate-400 border-slate-100 text-[7px] font-bold uppercase tracking-widest px-1.5 h-3.5 shadow-sm">LIVE</Badge>
               </div>
               <div className="space-y-1.5">
                  {[
                     { label: 'Metallic Textures', trend: '+22%', direction: 'up', color: 'text-emerald-600', bg: 'bg-emerald-50/50', border: 'border-emerald-100/50' },
                     { label: 'Ethical Linen', trend: '+15%', direction: 'up', color: 'text-emerald-600', bg: 'bg-emerald-50/50', border: 'border-emerald-100/50' },
                     { label: 'Oversized silhouettes', trend: 'Stable', direction: 'stable', color: 'text-slate-400', bg: 'bg-slate-50/50', border: 'border-slate-100/50' }
                  ].map((trend, i) => (
                     <div key={i} className="flex items-center justify-between p-2.5 bg-slate-50/30 rounded-xl group/item hover:bg-white border border-transparent hover:border-emerald-100 transition-all cursor-default shadow-inner">
                        <span className="text-[9px] font-bold uppercase text-slate-600 group-hover/item:text-slate-900 transition-colors tracking-tight">{trend.label}</span>
                        <div className="flex items-center gap-1.5">
                           <Badge variant="outline" className={cn("text-[8px] font-bold border shadow-sm px-1.5 h-4 tracking-widest", trend.color, trend.bg, trend.border)}>
                              {trend.trend}
                           </Badge>
                           {trend.direction === 'up' && <ChevronRight className="w-3 h-3 text-emerald-500 -rotate-90 group-hover/item:translate-y-[-1px] transition-transform" />}
                        </div>
                     </div>
                  ))}
               </div>
               <Button variant="ghost" className="w-full h-7 text-[9px] font-bold uppercase text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all tracking-widest">Trend Intelligence</Button>
            </Card>
         </div>
      </div>
    </div>
  );
}
