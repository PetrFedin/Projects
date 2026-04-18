'use client';

import React, { useState, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Calculator,
  TrendingUp,
  DollarSign,
  Percent,
  Scale,
  Scissors,
  Truck,
  ShieldCheck,
  Zap,
  ChevronRight,
  Info,
  AlertTriangle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface CostingCalculatorProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  productName?: string;
  basePrice?: number;
}

export function CostingCalculator({
  isOpen,
  onOpenChange,
  productName = 'Urban Jacket SS26',
  basePrice = 1250,
}: CostingCalculatorProps) {
  const [markup, setMarkup] = useState(250); // %
  const [logistics, setLogistics] = useState(150); // RUB
  const [duty, setDuty] = useState(0); // %

  const [costs, setCosts] = useState([
    { id: 1, label: 'Ткань (Основная)', value: 850, type: 'material' },
    { id: 2, label: 'Фурнитура', value: 120, type: 'material' },
    { id: 3, label: 'Пошив (CMT)', value: 650, type: 'work' },
    { id: 4, label: 'Логистика', value: 150, type: 'other' },
    { id: 5, label: 'Маркировка ЧЗ', value: 15, type: 'other' },
  ]);

  const totalCost = useMemo(() => {
    return costs.reduce((acc, curr) => acc + curr.value, 0);
  }, [costs]);

  const retailPrice = useMemo(() => {
    return totalCost * (1 + markup / 100);
  }, [totalCost, markup]);

  const margin = retailPrice - totalCost;
  const marginPercent = (margin / retailPrice) * 100;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden rounded-2xl border-none bg-white p-0 shadow-2xl sm:max-w-[700px]">
        <DialogHeader className="relative bg-slate-900 p-6 text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 shadow-lg shadow-emerald-900/20">
              <Calculator className="h-5 w-5 text-white" />
            </div>
            <div>
              <DialogTitle className="text-lg font-black uppercase tracking-tighter">
                Калькулятор себестоимости (Pre-costing)
              </DialogTitle>
              <DialogDescription className="mt-0.5 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Расчет целевой цены и маржинальности для {productName}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="grid gap-0 md:grid-cols-2">
          {/* Left Side: Inputs */}
          <div className="space-y-6 border-r border-slate-100 bg-slate-50/30 p-6">
            <div className="space-y-4">
              <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-900">
                <Scissors className="h-3 w-3 text-indigo-500" /> Состав затрат (unit)
              </h4>
              <div className="space-y-3">
                {costs.map((cost, idx) => (
                  <div key={cost.id} className="flex items-center gap-3">
                    <div className="flex-1">
                      <Label className="ml-1 text-[9px] font-bold uppercase text-slate-400">
                        {cost.label}
                      </Label>
                      <div className="relative mt-1">
                        <Input
                          type="number"
                          value={cost.value}
                          onChange={(e) => {
                            const newCosts = [...costs];
                            newCosts[idx].value = Number(e.target.value);
                            setCosts(newCosts);
                          }}
                          className="h-9 rounded-lg border-slate-200 bg-white pl-8 text-xs font-bold"
                        />
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">
                          ₽
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4 border-t border-slate-100 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="ml-1 text-[9px] font-bold uppercase text-slate-400">
                    Наценка (Multiplier)
                  </Label>
                  <div className="relative">
                    <Input
                      type="number"
                      value={markup}
                      onChange={(e) => setMarkup(Number(e.target.value))}
                      className="h-9 rounded-lg border-slate-200 bg-white pr-8 text-xs font-bold"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">
                      %
                    </span>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="ml-1 text-[9px] font-bold uppercase text-slate-400">
                    Пошлины / ВЭД
                  </Label>
                  <div className="relative">
                    <Input
                      type="number"
                      value={duty}
                      onChange={(e) => setDuty(Number(e.target.value))}
                      className="h-9 rounded-lg border-slate-200 bg-white pr-8 text-xs font-bold"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">
                      %
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Results */}
          <div className="flex flex-col justify-center space-y-8 bg-slate-900 p-6 text-white">
            <div className="space-y-1 text-center">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                Итоговая себестоимость
              </p>
              <h3 className="text-4xl font-black tabular-nums tracking-tighter">
                {totalCost.toLocaleString()}{' '}
                <span className="text-xl font-medium text-slate-500">₽</span>
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1 rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-[8px] font-bold uppercase tracking-widest text-slate-500">
                  Retail Price (RRP)
                </p>
                <p className="text-lg font-black tabular-nums text-emerald-400">
                  {Math.round(retailPrice).toLocaleString()} ₽
                </p>
              </div>
              <div className="space-y-1 rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-[8px] font-bold uppercase tracking-widest text-slate-500">
                  Gross Margin (%)
                </p>
                <p className="text-lg font-black tabular-nums text-indigo-400">
                  {marginPercent.toFixed(1)}%
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest">
                <span className="text-slate-400">Profit per Unit</span>
                <span className="text-white">{Math.round(margin).toLocaleString()} ₽</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${marginPercent}%` }}
                  className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500"
                />
              </div>
              <div className="flex items-center justify-between text-[8px] font-black uppercase italic text-slate-500">
                <span>BEP: 120 units</span>
                <span className="text-emerald-500">Target ROI: 3.5x</span>
              </div>
            </div>

            <div className="flex gap-3 rounded-xl border border-amber-500/20 bg-amber-500/10 p-3">
              <AlertTriangle className="h-4 w-4 shrink-0 text-amber-500" />
              <p className="text-[9px] font-medium leading-relaxed text-amber-200/80">
                Себестоимость превышает целевой лимит на 12%. Рекомендуется пересмотреть поставщика
                ткани или оптимизировать раскладку.
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="flex items-center justify-between border-t border-slate-100 bg-slate-50 p-6">
          <div className="flex items-center gap-2">
            <Badge className="border-none bg-indigo-100 text-[8px] font-black uppercase tracking-widest text-indigo-700">
              AI Suggestion
            </Badge>
            <p className="text-[9px] font-bold italic text-slate-500">
              "Попробуйте заменить Silk на Eco-Nylon для снижения цены на 15%"
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="ghost"
              className="h-10 text-[10px] font-black uppercase tracking-widest text-slate-400"
            >
              Сбросить
            </Button>
            <Button className="h-10 rounded-xl bg-slate-900 px-8 text-[10px] font-black uppercase tracking-widest text-white">
              Применить к SKU
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
