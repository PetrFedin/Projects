'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  DollarSign, 
  TrendingUp, 
  ArrowRight, 
  Calculator, 
  Ship, 
  FileCheck, 
  ShieldCheck, 
  Zap, 
  BrainCircuit,
  Info,
  ChevronDown,
  PieChart as PieChartIcon,
  ChevronRight,
  Target
} from 'lucide-react';
import { LandedCostBreakdown } from '@/lib/types/finance';
import { calculateLandedCost, generateCostOptimizationInsights } from '@/lib/logic/finance-utils';
import { cn } from '@/lib/utils';
import { SectionInfoCard } from '@/components/brand/production/ProductionSectionEnhancements';

/**
 * Landed Cost Engine UI
 * Умный калькулятор себестоимости с учетом логистики и пошлин.
 */

export default function LandedCostPage() {
  const [formData, setFormData] = useState<Partial<LandedCostBreakdown>>({
    fabricCost: 45,
    cmtCost: 15,
    trimsCost: 5,
    packagingCost: 2,
    freightCost: 12,
    dutyRate: 15,
    insuranceCost: 1.5,
    markingCost: 0.8,
    overheadRate: 18,
    amortizationCost: 5,
    targetRetailPrice: 350
  });

  const calculatedLC = useMemo(() => calculateLandedCost(formData), [formData]);
  const aiInsights = useMemo(() => generateCostOptimizationInsights(calculatedLC), [calculatedLC]);

  const handleInputChange = (field: keyof LandedCostBreakdown, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: parseFloat(value) || 0
    }));
  };

  return (
    <div className="container mx-auto px-4 py-4 space-y-10">
      <SectionInfoCard
        title="Landed Cost Engine"
        description="Расчёт полной себестоимости: ткань, CMT, логистика, пошлины. Связи: Finance, Production, Warehouse, Duty Calculator."
        icon={Calculator}
        iconBg="bg-emerald-100"
        iconColor="text-emerald-600"
        badges={<><Badge variant="outline" className="text-[9px]">Full Cost</Badge><Button variant="outline" size="sm" className="text-[9px] h-7 ml-1" asChild><Link href="/brand/finance">Finance</Link></Button><Button variant="outline" size="sm" className="text-[9px] h-7" asChild><Link href="/brand/production">Production</Link></Button><Button variant="outline" size="sm" className="text-[9px] h-7" asChild><Link href="/brand/warehouse">Warehouse</Link></Button><Button variant="outline" size="sm" className="text-[9px] h-7" asChild><Link href="/brand/logistics/duty-calculator">Duty Calc</Link></Button></>}
      />
      <header className="flex flex-col md:flex-row justify-between md:items-end gap-3">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-600">
            <DollarSign className="w-3 h-3" />
            Financial Engine
          </div>
          <h1 className="text-sm font-black font-headline tracking-tighter">Landed Cost Engine</h1>
          <p className="text-muted-foreground font-medium">Расчет полной себестоимости изделия с учетом всех факторов.</p>
        </div>
        <div className="flex gap-2">
           <Button variant="outline" className="gap-2 rounded-xl h-11 px-6 font-black uppercase text-[10px]">
              <Target className="w-4 h-4" /> Анализ конкурентов
           </Button>
           <Button className="gap-2 rounded-xl h-11 px-6 font-black uppercase text-[10px] bg-slate-900 text-white shadow-lg">
              <Zap className="w-4 h-4" /> Экспорт в P&L
           </Button>
        </div>
      </header>

      <div className="grid lg:grid-cols-12 gap-3">
         {/* Input Form */}
         <div className="lg:col-span-7 space-y-4">
            <Card className="border-none shadow-xl shadow-slate-200/50 rounded-xl overflow-hidden">
               <CardHeader className="p-4 border-b border-slate-50">
                  <CardTitle className="text-base font-black uppercase tracking-tight">Параметры расчета</CardTitle>
                  <CardDescription>Введите данные для расчета себестоимости (USD/Unit).</CardDescription>
               </CardHeader>
               <CardContent className="p-4 space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                     {/* Production Section */}
                     <div className="space-y-4">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Производство (CMT+M)</h4>
                        <div className="space-y-3">
                           <div>
                              <label className="text-[10px] font-bold uppercase text-slate-500 mb-1 block">Fabric (Ткань)</label>
                              <Input type="number" value={formData.fabricCost} onChange={e => handleInputChange('fabricCost', e.target.value)} className="rounded-xl" />
                           </div>
                           <div>
                              <label className="text-[10px] font-bold uppercase text-slate-500 mb-1 block">CMT (Пошив)</label>
                              <Input type="number" value={formData.cmtCost} onChange={e => handleInputChange('cmtCost', e.target.value)} className="rounded-xl" />
                           </div>
                           <div>
                              <label className="text-[10px] font-bold uppercase text-slate-500 mb-1 block">Trims (Фурнитура)</label>
                              <Input type="number" value={formData.trimsCost} onChange={e => handleInputChange('trimsCost', e.target.value)} className="rounded-xl" />
                           </div>
                        </div>
                     </div>

                     {/* Logistics Section */}
                     <div className="space-y-4">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Логистика и пошлины</h4>
                        <div className="space-y-3">
                           <div>
                              <label className="text-[10px] font-bold uppercase text-slate-500 mb-1 block">Freight (Доставка)</label>
                              <Input type="number" value={formData.freightCost} onChange={e => handleInputChange('freightCost', e.target.value)} className="rounded-xl" />
                           </div>
                           <div>
                              <label className="text-[10px] font-bold uppercase text-slate-500 mb-1 block">Duty Rate (%)</label>
                              <Input type="number" value={formData.dutyRate} onChange={e => handleInputChange('dutyRate', e.target.value)} className="rounded-xl" />
                           </div>
                           <div>
                              <label className="text-[10px] font-bold uppercase text-slate-500 mb-1 block">Marking (Маркировка)</label>
                              <Input type="number" value={formData.markingCost} onChange={e => handleInputChange('markingCost', e.target.value)} className="rounded-xl" />
                           </div>
                        </div>
                     </div>

                     {/* Overheads Section */}
                     <div className="space-y-4">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Операционные расходы</h4>
                        <div className="space-y-3">
                           <div>
                              <label className="text-[10px] font-bold uppercase text-slate-500 mb-1 block">Overhead Rate (%)</label>
                              <Input type="number" value={formData.overheadRate} onChange={e => handleInputChange('overheadRate', e.target.value)} className="rounded-xl" />
                           </div>
                           <div>
                              <label className="text-[10px] font-bold uppercase text-slate-500 mb-1 block">Amortization (Амортизация)</label>
                              <Input type="number" value={formData.amortizationCost} onChange={e => handleInputChange('amortizationCost', e.target.value)} className="rounded-xl" />
                           </div>
                        </div>
                     </div>

                     {/* Price Section */}
                     <div className="space-y-4">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Целевая цена</h4>
                        <div className="space-y-3">
                           <div>
                              <label className="text-[10px] font-bold uppercase text-indigo-600 mb-1 block">Retail Price (Розница)</label>
                              <Input type="number" value={formData.targetRetailPrice} onChange={e => handleInputChange('targetRetailPrice', e.target.value)} className="rounded-xl border-indigo-200" />
                           </div>
                        </div>
                     </div>
                  </div>
               </CardContent>
            </Card>
         </div>

         {/* Results Dashboard */}
         <div className="lg:col-span-5 space-y-6">
            <Card className="border-none shadow-2xl shadow-indigo-100 rounded-xl bg-indigo-600 text-white p-3 overflow-hidden relative">
               {/* Background Pattern */}
               <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-24 translate-x-24 blur-3xl" />
               <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-400/20 rounded-full translate-y-16 -translate-x-16 blur-2xl" />

               <div className="relative space-y-4">
                  <div className="flex items-center gap-3">
                     <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
                        <Calculator className="w-6 h-6 text-white" />
                     </div>
                     <div>
                        <h3 className="text-sm font-black uppercase tracking-tight">Total Landed Cost</h3>
                        <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Финальная себестоимость за единицу</p>
                     </div>
                  </div>

                  <div className="space-y-1">
                     <p className="text-base font-black tracking-tighter">${calculatedLC.totalLandedCost.toFixed(2)}</p>
                     <p className="text-[10px] font-black uppercase text-white/50 tracking-widest">USD PER UNIT (LANDED)</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-6 border-t border-white/10">
                     <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase text-white/40 tracking-widest">Целевая Маржа</p>
                        <p className="text-sm font-black text-emerald-400">{calculatedLC.targetMargin.toFixed(1)}%</p>
                     </div>
                     <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase text-white/40 tracking-widest">Ценовая Эластичность</p>
                        <p className="text-sm font-black text-indigo-200">Medium</p>
                     </div>
                  </div>
               </div>
            </Card>

            <Card className="border-none shadow-xl shadow-slate-200/50 rounded-xl p-3 bg-white">
               <div className="flex items-center gap-3 mb-6">
                  <BrainCircuit className="w-5 h-5 text-indigo-600" />
                  <h3 className="text-sm font-black uppercase tracking-tight text-slate-900">AI Financial Insights</h3>
               </div>
               
               <div className="space-y-4">
                  {aiInsights.map((insight, i) => (
                     <div key={i} className="flex gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <div className="h-2 w-2 rounded-full bg-indigo-500 mt-1 shrink-0" />
                        <p className="text-xs text-slate-600 leading-relaxed font-medium">{insight}</p>
                     </div>
                  ))}
                  {aiInsights.length === 0 && (
                     <div className="text-center py-6 text-slate-400 font-bold text-[10px] uppercase">
                        Все показатели в норме
                     </div>
                  )}
               </div>

               <div className="mt-8 pt-8 border-t border-slate-50 space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Структура себестоимости</h4>
                  <div className="space-y-3">
                     {[
                        { label: 'Production (BOM+CMT)', value: calculatedLC.fabricCost + calculatedLC.cmtCost + calculatedLC.trimsCost, color: 'bg-indigo-500' },
                        { label: 'Logistics & Duties', value: calculatedLC.freightCost + calculatedLC.calculatedDuty + calculatedLC.markingCost, color: 'bg-emerald-500' },
                        { label: 'Ops & Amortization', value: calculatedLC.calculatedOverhead + calculatedLC.amortizationCost, color: 'bg-amber-500' }
                     ].map((part, i) => (
                        <div key={i} className="space-y-1.5">
                           <div className="flex justify-between text-[10px] font-black uppercase tracking-tight">
                              <span className="text-slate-500">{part.label}</span>
                              <span className="text-slate-900">${part.value.toFixed(2)}</span>
                           </div>
                           <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                              <div className={cn("h-full rounded-full transition-all duration-500", part.color)} style={{ width: `${(part.value / calculatedLC.totalLandedCost) * 100}%` }} />
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            </Card>
         </div>
      </div>
    </div>
  );
}
