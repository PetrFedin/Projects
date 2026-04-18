'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Calculator,
  Scissors,
  Package,
  Truck,
  Box,
  User,
  Percent,
  DollarSign,
  Zap,
  Ruler,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface CostLine {
  id: string;
  label: string;
  value: number;
  unit?: string;
  category: 'material' | 'haberdashery' | 'labor' | 'logistics' | 'packaging' | 'other';
}

const DEFAULT_COSTS: CostLine[] = [
  { id: 'm1', label: 'Ткань основная', value: 420, unit: '₽/ед', category: 'material' },
  { id: 'm2', label: 'Подкладочная', value: 85, unit: '₽/ед', category: 'material' },
  { id: 'h1', label: 'Молнии', value: 45, unit: '₽/ед', category: 'haberdashery' },
  { id: 'h2', label: 'Пуговицы, кнопки', value: 25, unit: '₽/ед', category: 'haberdashery' },
  { id: 'h3', label: 'Нитки, лейблы', value: 18, unit: '₽/ед', category: 'haberdashery' },
  { id: 'l1', label: 'Пошив (швеи)', value: 380, unit: '₽/ед', category: 'labor' },
  { id: 'l2', label: 'Раскрой', value: 65, unit: '₽/ед', category: 'labor' },
  { id: 'l3', label: 'ОТК / контроль', value: 35, unit: '₽/ед', category: 'labor' },
  { id: 't1', label: 'Логистика до фабрики', value: 55, unit: '₽/ед', category: 'logistics' },
  { id: 't2', label: 'Доставка до склада', value: 120, unit: '₽/ед', category: 'logistics' },
  { id: 't3', label: 'Курьер (если D2C)', value: 0, unit: '₽/ед', category: 'logistics' },
  {
    id: 'p1',
    label: 'Упаковка (полибэг, коробка)',
    value: 45,
    unit: '₽/ед',
    category: 'packaging',
  },
  { id: 'p2', label: 'Вешалка, этикетки', value: 22, unit: '₽/ед', category: 'packaging' },
  { id: 'o1', label: 'Маркировка ЧЗ', value: 15, unit: '₽/ед', category: 'other' },
  { id: 'o2', label: 'Непредвиденные (5%)', value: 0, unit: '₽/ед', category: 'other' },
];

const CATEGORY_LABELS: Record<CostLine['category'], string> = {
  material: 'Материалы',
  haberdashery: 'Фурнитура',
  labor: 'Пошив / труд',
  logistics: 'Логистика',
  packaging: 'Упаковка',
  other: 'Прочее',
};

interface ProductionCostBreakdownProps {
  collectionId?: string;
  poId?: string;
  skuName?: string;
  qty?: number;
  onSave?: (total: number, lines: CostLine[]) => void;
}

export function ProductionCostBreakdown({
  collectionId,
  poId,
  skuName = 'Модель',
  qty = 1,
  onSave,
}: ProductionCostBreakdownProps) {
  const [costs, setCosts] = useState<CostLine[]>(DEFAULT_COSTS);
  const [markup, setMarkup] = useState(180); // %
  const [editingId, setEditingId] = useState<string | null>(null);

  const totalCost = useMemo(() => costs.reduce((s, c) => s + c.value, 0), [costs]);

  const byCategory = useMemo(() => {
    const map = new Map<string, number>();
    costs.forEach((c) => {
      const key = CATEGORY_LABELS[c.category];
      map.set(key, (map.get(key) || 0) + c.value);
    });
    return map;
  }, [costs]);

  const retailPrice = totalCost * (1 + markup / 100);
  const margin = retailPrice - totalCost;
  const marginPct = totalCost > 0 ? ((margin / retailPrice) * 100).toFixed(1) : '0';

  const updateCost = (id: string, value: number) => {
    setCosts((prev) => prev.map((c) => (c.id === id ? { ...c, value } : c)));
    setEditingId(null);
  };

  return (
<<<<<<< HEAD
    <Card className="overflow-hidden rounded-2xl border border-slate-100 shadow-sm">
      <div className="h-1 w-full bg-gradient-to-r from-amber-500/80 to-indigo-500/80" />
      <CardHeader className="border-b border-slate-100 bg-gradient-to-br from-slate-50/80 to-white p-5">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-sm font-black uppercase tracking-tight text-slate-900">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
=======
    <Card className="border-border-subtle overflow-hidden rounded-2xl border shadow-sm">
      <div className="to-accent-primary/80 h-1 w-full bg-gradient-to-r from-amber-500/80" />
      <CardHeader className="border-border-subtle from-bg-surface2/80 to-bg-surface border-b bg-gradient-to-br p-5">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-text-primary flex items-center gap-2 text-sm font-black uppercase tracking-tight">
              <div className="bg-accent-primary/15 text-accent-primary flex h-10 w-10 items-center justify-center rounded-xl">
>>>>>>> recover/cabinet-wip-from-stash
                <Calculator className="h-5 w-5" />
              </div>
              Детальный расчёт себестоимости
            </CardTitle>
<<<<<<< HEAD
            <CardDescription className="mt-2 text-[11px] text-slate-500">
=======
            <CardDescription className="text-text-secondary mt-2 text-[11px]">
>>>>>>> recover/cabinet-wip-from-stash
              {skuName} • {qty} ед. — материалы, фурнитура, пошив, логистика, упаковка
            </CardDescription>
          </div>
          {onSave && (
            <Button
              size="sm"
              className="h-8 rounded-lg text-[9px] font-bold uppercase"
              onClick={() => onSave(totalCost, costs)}
            >
              Сохранить
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4 p-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-3">
<<<<<<< HEAD
            <h4 className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-slate-500">
=======
            <h4 className="text-text-secondary flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
              <Scissors className="h-3 w-3" /> Статьи затрат (₽/ед)
            </h4>
            <div className="max-h-[280px] space-y-1.5 overflow-y-auto pr-1">
              {Object.entries(CATEGORY_LABELS).map(([cat, label]) => {
                const items = costs.filter((c) => c.category === cat);
                if (items.length === 0) return null;
                const sum = items.reduce((s, i) => s + i.value, 0);
                return (
                  <div key={cat} className="space-y-1">
<<<<<<< HEAD
                    <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">
=======
                    <p className="text-text-muted text-[8px] font-black uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
                      {label}
                    </p>
                    {items.map((c) => (
                      <div
                        key={c.id}
<<<<<<< HEAD
                        className="flex items-center justify-between gap-2 rounded-lg px-2 py-1 transition-colors hover:bg-slate-50"
                      >
                        <span className="truncate text-[10px] font-bold text-slate-700">
=======
                        className="hover:bg-bg-surface2 flex items-center justify-between gap-2 rounded-lg px-2 py-1 transition-colors"
                      >
                        <span className="text-text-primary truncate text-[10px] font-bold">
>>>>>>> recover/cabinet-wip-from-stash
                          {c.label}
                        </span>
                        {editingId === c.id ? (
                          <Input
                            type="number"
                            value={c.value}
                            onChange={(e) => updateCost(c.id, Number(e.target.value) || 0)}
                            onBlur={() => setEditingId(null)}
                            className="h-7 w-20 text-right text-[10px]"
                            autoFocus
                          />
                        ) : (
                          <button
                            onClick={() => setEditingId(c.id)}
<<<<<<< HEAD
                            className="text-[10px] font-black tabular-nums text-slate-900 hover:text-indigo-600"
=======
                            className="text-text-primary hover:text-accent-primary text-[10px] font-black tabular-nums"
>>>>>>> recover/cabinet-wip-from-stash
                          >
                            {c.value} ₽
                          </button>
                        )}
                      </div>
                    ))}
<<<<<<< HEAD
                    <div className="flex justify-between border-t border-slate-100 pl-2 pt-1 text-[9px] font-bold text-slate-500">
=======
                    <div className="text-text-secondary border-border-subtle flex justify-between border-t pl-2 pt-1 text-[9px] font-bold">
>>>>>>> recover/cabinet-wip-from-stash
                      <span>Итого {label}</span>
                      <span>{sum} ₽</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-4">
<<<<<<< HEAD
            <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-indigo-100/50 p-5 shadow-sm">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600">
                  Себестоимость (ед)
                </span>
                <span className="text-xl font-black tabular-nums text-indigo-700">
                  {totalCost.toLocaleString('ru')} ₽
                </span>
              </div>
              <div className="flex items-center justify-between border-t border-indigo-100 pt-2 text-[10px] font-medium text-slate-600">
=======
            <div className="from-accent-primary/10 to-accent-primary/15 border-accent-primary/20 rounded-2xl border bg-gradient-to-br p-5 shadow-sm">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-accent-primary text-[10px] font-black uppercase tracking-wider">
                  Себестоимость (ед)
                </span>
                <span className="text-accent-primary text-xl font-black tabular-nums">
                  {totalCost.toLocaleString('ru')} ₽
                </span>
              </div>
              <div className="text-text-secondary border-accent-primary/20 flex items-center justify-between border-t pt-2 text-[10px] font-medium">
>>>>>>> recover/cabinet-wip-from-stash
                <span>На партию ({qty} ед.)</span>
                <span className="font-black tabular-nums">
                  {(totalCost * qty).toLocaleString('ru')} ₽
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-text-secondary text-[10px] font-black uppercase">
                Наценка
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={markup}
                  onChange={(e) => setMarkup(Number(e.target.value) || 0)}
                  className="h-10 w-24 text-right font-black"
                />
                <span className="text-[10px] font-bold">%</span>
              </div>
            </div>

            <div className="space-y-1 rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-emerald-100/50 p-5 shadow-sm">
              <p className="text-[10px] font-black uppercase tracking-wider text-emerald-600">
                Розничная цена
              </p>
              <p className="text-2xl font-black tabular-nums text-emerald-700">
                {retailPrice.toLocaleString('ru')} ₽
              </p>
<<<<<<< HEAD
              <p className="border-t border-emerald-100 pt-2 text-[10px] font-medium text-slate-600">
=======
              <p className="text-text-secondary border-t border-emerald-100 pt-2 text-[10px] font-medium">
>>>>>>> recover/cabinet-wip-from-stash
                Маржа: {margin.toLocaleString('ru')} ₽ ({marginPct}%)
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {Array.from(byCategory.entries()).map(([label, sum]) => (
                <div
                  key={label}
<<<<<<< HEAD
                  className="rounded-xl border border-slate-100 bg-slate-50 p-3 transition-colors hover:border-indigo-100"
                >
                  <p className="truncate text-[9px] font-bold uppercase text-slate-500">{label}</p>
                  <p className="mt-0.5 text-base font-black tabular-nums text-slate-900">{sum} ₽</p>
=======
                  className="bg-bg-surface2 border-border-subtle hover:border-accent-primary/20 rounded-xl border p-3 transition-colors"
                >
                  <p className="text-text-secondary truncate text-[9px] font-bold uppercase">
                    {label}
                  </p>
                  <p className="text-text-primary mt-0.5 text-base font-black tabular-nums">
                    {sum} ₽
                  </p>
>>>>>>> recover/cabinet-wip-from-stash
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
