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
        <DialogHeader className="bg-text-primary relative p-6 text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 shadow-lg shadow-emerald-900/20">
              <Calculator className="h-5 w-5 text-white" />
            </div>
            <div>
              <DialogTitle className="text-lg font-black uppercase tracking-tighter">
                Калькулятор себестоимости (Pre-costing)
              </DialogTitle>
              <DialogDescription className="text-text-muted mt-0.5 text-[10px] font-bold uppercase tracking-widest">
                Расчет целевой цены и маржинальности для {productName}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="grid gap-0 md:grid-cols-2">
          {/* Left Side: Inputs */}
          <div className="border-border-subtle bg-bg-surface2/30 space-y-6 border-r p-6">
            <div className="space-y-4">
              <h4 className="text-text-primary flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                <Scissors className="text-accent-primary h-3 w-3" /> Состав затрат (unit)
              </h4>
              <div className="space-y-3">
                {costs.map((cost, idx) => (
                  <div key={cost.id} className="flex items-center gap-3">
                    <div className="flex-1">
                      <Label className="text-text-muted ml-1 text-[9px] font-bold uppercase">
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
                          className="border-border-default h-9 rounded-lg bg-white pl-8 text-xs font-bold"
                        />
                        <span className="text-text-muted absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold">
                          ₽
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-border-subtle space-y-4 border-t pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-text-muted ml-1 text-[9px] font-bold uppercase">
                    Наценка (Multiplier)
                  </Label>
                  <div className="relative">
                    <Input
                      type="number"
                      value={markup}
                      onChange={(e) => setMarkup(Number(e.target.value))}
                      className="border-border-default h-9 rounded-lg bg-white pr-8 text-xs font-bold"
                    />
                    <span className="text-text-muted absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold">
                      %
                    </span>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-text-muted ml-1 text-[9px] font-bold uppercase">
                    Пошлины / ВЭД
                  </Label>
                  <div className="relative">
                    <Input
                      type="number"
                      value={duty}
                      onChange={(e) => setDuty(Number(e.target.value))}
                      className="border-border-default h-9 rounded-lg bg-white pr-8 text-xs font-bold"
                    />
                    <span className="text-text-muted absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold">
                      %
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Results */}
          <div className="bg-text-primary flex flex-col justify-center space-y-8 p-6 text-white">
            <div className="space-y-1 text-center">
              <p className="text-text-muted text-[10px] font-bold uppercase tracking-[0.2em]">
                Итоговая себестоимость
              </p>
              <h3 className="text-4xl font-black tabular-nums tracking-tighter">
                {totalCost.toLocaleString()}{' '}
                <span className="text-text-secondary text-xl font-medium">₽</span>
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1 rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-text-secondary text-[8px] font-bold uppercase tracking-widest">
                  Retail Price (RRP)
                </p>
                <p className="text-lg font-black tabular-nums text-emerald-400">
                  {Math.round(retailPrice).toLocaleString()} ₽
                </p>
              </div>
              <div className="space-y-1 rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-text-secondary text-[8px] font-bold uppercase tracking-widest">
                  Gross Margin (%)
                </p>
                <p className="text-accent-primary text-lg font-black tabular-nums">
                  {marginPercent.toFixed(1)}%
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest">
                <span className="text-text-muted">Profit per Unit</span>
                <span className="text-white">{Math.round(margin).toLocaleString()} ₽</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${marginPercent}%` }}
                  className="from-accent-primary h-full bg-gradient-to-r to-emerald-500"
                />
              </div>
              <div className="text-text-secondary flex items-center justify-between text-[8px] font-black uppercase italic">
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

        <DialogFooter className="bg-bg-surface2 border-border-subtle flex items-center justify-between border-t p-6">
          <div className="flex items-center gap-2">
            <Badge className="bg-accent-primary/15 text-accent-primary border-none text-[8px] font-black uppercase tracking-widest">
              AI Suggestion
            </Badge>
            <p className="text-text-secondary text-[9px] font-bold italic">
              "Попробуйте заменить Silk на Eco-Nylon для снижения цены на 15%"
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="ghost"
              className="text-text-muted h-10 text-[10px] font-black uppercase tracking-widest"
            >
              Сбросить
            </Button>
            <Button className="bg-text-primary h-10 rounded-xl px-8 text-[10px] font-black uppercase tracking-widest text-white">
              Применить к SKU
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
