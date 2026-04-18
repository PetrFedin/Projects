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
  Target,
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
    targetRetailPrice: 350,
  });

  const calculatedLC = useMemo(() => calculateLandedCost(formData), [formData]);
  const aiInsights = useMemo(() => generateCostOptimizationInsights(calculatedLC), [calculatedLC]);

  const handleInputChange = (field: keyof LandedCostBreakdown, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: parseFloat(value) || 0,
    }));
  };

  return (
    <div className="container mx-auto space-y-10 px-4 py-4">
      <SectionInfoCard
        title="Landed Cost Engine"
        description="Расчёт полной себестоимости: ткань, CMT, логистика, пошлины. Связи: Finance, Production, Warehouse, Duty Calculator."
        icon={Calculator}
        iconBg="bg-emerald-100"
        iconColor="text-emerald-600"
        badges={
          <>
            <Badge variant="outline" className="text-[9px]">
              Full Cost
            </Badge>
            <Button variant="outline" size="sm" className="ml-1 h-7 text-[9px]" asChild>
              <Link href="/brand/finance">Finance</Link>
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-[9px]" asChild>
              <Link href="/brand/production">Production</Link>
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-[9px]" asChild>
              <Link href="/brand/warehouse">Warehouse</Link>
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-[9px]" asChild>
              <Link href="/brand/logistics/duty-calculator">Duty Calc</Link>
            </Button>
          </>
        }
      />
      <header className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-600">
            <DollarSign className="h-3 w-3" />
            Financial Engine
          </div>
          <h1 className="font-headline text-sm font-black tracking-tighter">Landed Cost Engine</h1>
          <p className="font-medium text-muted-foreground">
            Расчет полной себестоимости изделия с учетом всех факторов.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="h-11 gap-2 rounded-xl px-6 text-[10px] font-black uppercase"
          >
            <Target className="h-4 w-4" /> Анализ конкурентов
          </Button>
          <Button className="h-11 gap-2 rounded-xl bg-slate-900 px-6 text-[10px] font-black uppercase text-white shadow-lg">
            <Zap className="h-4 w-4" /> Экспорт в P&L
          </Button>
        </div>
      </header>

      <div className="grid gap-3 lg:grid-cols-12">
        {/* Input Form */}
        <div className="space-y-4 lg:col-span-7">
          <Card className="overflow-hidden rounded-xl border-none shadow-xl shadow-slate-200/50">
            <CardHeader className="border-b border-slate-50 p-4">
              <CardTitle className="text-base font-black uppercase tracking-tight">
                Параметры расчета
              </CardTitle>
              <CardDescription>
                Введите данные для расчета себестоимости (USD/Unit).
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 p-4">
              <div className="grid grid-cols-2 gap-3">
                {/* Production Section */}
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Производство (CMT+M)
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <label className="mb-1 block text-[10px] font-bold uppercase text-slate-500">
                        Fabric (Ткань)
                      </label>
                      <Input
                        type="number"
                        value={formData.fabricCost}
                        onChange={(e) => handleInputChange('fabricCost', e.target.value)}
                        className="rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-[10px] font-bold uppercase text-slate-500">
                        CMT (Пошив)
                      </label>
                      <Input
                        type="number"
                        value={formData.cmtCost}
                        onChange={(e) => handleInputChange('cmtCost', e.target.value)}
                        className="rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-[10px] font-bold uppercase text-slate-500">
                        Trims (Фурнитура)
                      </label>
                      <Input
                        type="number"
                        value={formData.trimsCost}
                        onChange={(e) => handleInputChange('trimsCost', e.target.value)}
                        className="rounded-xl"
                      />
                    </div>
                  </div>
                </div>

                {/* Logistics Section */}
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Логистика и пошлины
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <label className="mb-1 block text-[10px] font-bold uppercase text-slate-500">
                        Freight (Доставка)
                      </label>
                      <Input
                        type="number"
                        value={formData.freightCost}
                        onChange={(e) => handleInputChange('freightCost', e.target.value)}
                        className="rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-[10px] font-bold uppercase text-slate-500">
                        Duty Rate (%)
                      </label>
                      <Input
                        type="number"
                        value={formData.dutyRate}
                        onChange={(e) => handleInputChange('dutyRate', e.target.value)}
                        className="rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-[10px] font-bold uppercase text-slate-500">
                        Marking (Маркировка)
                      </label>
                      <Input
                        type="number"
                        value={formData.markingCost}
                        onChange={(e) => handleInputChange('markingCost', e.target.value)}
                        className="rounded-xl"
                      />
                    </div>
                  </div>
                </div>

                {/* Overheads Section */}
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Операционные расходы
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <label className="mb-1 block text-[10px] font-bold uppercase text-slate-500">
                        Overhead Rate (%)
                      </label>
                      <Input
                        type="number"
                        value={formData.overheadRate}
                        onChange={(e) => handleInputChange('overheadRate', e.target.value)}
                        className="rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-[10px] font-bold uppercase text-slate-500">
                        Amortization (Амортизация)
                      </label>
                      <Input
                        type="number"
                        value={formData.amortizationCost}
                        onChange={(e) => handleInputChange('amortizationCost', e.target.value)}
                        className="rounded-xl"
                      />
                    </div>
                  </div>
                </div>

                {/* Price Section */}
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Целевая цена
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <label className="mb-1 block text-[10px] font-bold uppercase text-indigo-600">
                        Retail Price (Розница)
                      </label>
                      <Input
                        type="number"
                        value={formData.targetRetailPrice}
                        onChange={(e) => handleInputChange('targetRetailPrice', e.target.value)}
                        className="rounded-xl border-indigo-200"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results Dashboard */}
        <div className="space-y-6 lg:col-span-5">
          <Card className="relative overflow-hidden rounded-xl border-none bg-indigo-600 p-3 text-white shadow-2xl shadow-indigo-100">
            {/* Background Pattern */}
            <div className="absolute right-0 top-0 h-48 w-48 -translate-y-24 translate-x-24 rounded-full bg-white/5 blur-3xl" />
            <div className="absolute bottom-0 left-0 h-32 w-32 -translate-x-16 translate-y-16 rounded-full bg-indigo-400/20 blur-2xl" />

            <div className="relative space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-white/10">
                  <Calculator className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase tracking-tight">Total Landed Cost</h3>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">
                    Финальная себестоимость за единицу
                  </p>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-base font-black tracking-tighter">
                  ${calculatedLC.totalLandedCost.toFixed(2)}
                </p>
                <p className="text-[10px] font-black uppercase tracking-widest text-white/50">
                  USD PER UNIT (LANDED)
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 border-t border-white/10 pt-6">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/40">
                    Целевая Маржа
                  </p>
                  <p className="text-sm font-black text-emerald-400">
                    {calculatedLC.targetMargin.toFixed(1)}%
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/40">
                    Ценовая Эластичность
                  </p>
                  <p className="text-sm font-black text-indigo-200">Medium</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="rounded-xl border-none bg-white p-3 shadow-xl shadow-slate-200/50">
            <div className="mb-6 flex items-center gap-3">
              <BrainCircuit className="h-5 w-5 text-indigo-600" />
              <h3 className="text-sm font-black uppercase tracking-tight text-slate-900">
                AI Financial Insights
              </h3>
            </div>

            <div className="space-y-4">
              {aiInsights.map((insight, i) => (
                <div
                  key={i}
                  className="flex gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4"
                >
                  <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-indigo-500" />
                  <p className="text-xs font-medium leading-relaxed text-slate-600">{insight}</p>
                </div>
              ))}
              {aiInsights.length === 0 && (
                <div className="py-6 text-center text-[10px] font-bold uppercase text-slate-400">
                  Все показатели в норме
                </div>
              )}
            </div>

            <div className="mt-8 space-y-4 border-t border-slate-50 pt-8">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Структура себестоимости
              </h4>
              <div className="space-y-3">
                {[
                  {
                    label: 'Production (BOM+CMT)',
                    value: calculatedLC.fabricCost + calculatedLC.cmtCost + calculatedLC.trimsCost,
                    color: 'bg-indigo-500',
                  },
                  {
                    label: 'Logistics & Duties',
                    value:
                      calculatedLC.freightCost +
                      calculatedLC.calculatedDuty +
                      calculatedLC.markingCost,
                    color: 'bg-emerald-500',
                  },
                  {
                    label: 'Ops & Amortization',
                    value: calculatedLC.calculatedOverhead + calculatedLC.amortizationCost,
                    color: 'bg-amber-500',
                  },
                ].map((part, i) => (
                  <div key={i} className="space-y-1.5">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-tight">
                      <span className="text-slate-500">{part.label}</span>
                      <span className="text-slate-900">${part.value.toFixed(2)}</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={cn(
                          'h-full rounded-full transition-all duration-500',
                          part.color
                        )}
                        style={{ width: `${(part.value / calculatedLC.totalLandedCost) * 100}%` }}
                      />
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
