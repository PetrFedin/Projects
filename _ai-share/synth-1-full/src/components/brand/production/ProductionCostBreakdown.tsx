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
  { id: 'p1', label: 'Упаковка (полибэг, коробка)', value: 45, unit: '₽/ед', category: 'packaging' },
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

  const totalCost = useMemo(
    () => costs.reduce((s, c) => s + c.value, 0),
    [costs]
  );

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
    setCosts((prev) =>
      prev.map((c) => (c.id === id ? { ...c, value } : c))
    );
    setEditingId(null);
  };

  return (
    <Card className="border border-slate-100 shadow-sm rounded-2xl overflow-hidden">
      <div className="h-1 w-full bg-gradient-to-r from-amber-500/80 to-indigo-500/80" />
      <CardHeader className="p-5 border-b border-slate-100 bg-gradient-to-br from-slate-50/80 to-white">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-sm font-black uppercase tracking-tight text-slate-900 flex items-center gap-2">
              <div className="h-10 w-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                <Calculator className="w-5 h-5" />
              </div>
              Детальный расчёт себестоимости
            </CardTitle>
            <CardDescription className="text-[11px] text-slate-500 mt-2">
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
      <CardContent className="p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
              <Scissors className="w-3 h-3" /> Статьи затрат (₽/ед)
            </h4>
            <div className="space-y-1.5 max-h-[280px] overflow-y-auto pr-1">
              {Object.entries(CATEGORY_LABELS).map(([cat, label]) => {
                const items = costs.filter((c) => c.category === cat);
                if (items.length === 0) return null;
                const sum = items.reduce((s, i) => s + i.value, 0);
                return (
                  <div key={cat} className="space-y-1">
                    <p className="text-[8px] font-black uppercase text-slate-400 tracking-widest">{label}</p>
                    {items.map((c) => (
                      <div
                        key={c.id}
                        className="flex items-center justify-between gap-2 py-1 px-2 rounded-lg hover:bg-slate-50 transition-colors"
                      >
                        <span className="text-[10px] font-bold text-slate-700 truncate">{c.label}</span>
                        {editingId === c.id ? (
                          <Input
                            type="number"
                            value={c.value}
                            onChange={(e) => updateCost(c.id, Number(e.target.value) || 0)}
                            onBlur={() => setEditingId(null)}
                            className="h-7 w-20 text-[10px] text-right"
                            autoFocus
                          />
                        ) : (
                          <button
                            onClick={() => setEditingId(c.id)}
                            className="text-[10px] font-black text-slate-900 tabular-nums hover:text-indigo-600"
                          >
                            {c.value} ₽
                          </button>
                        )}
                      </div>
                    ))}
                    <div className="flex justify-between text-[9px] font-bold text-slate-500 pl-2 border-t border-slate-100 pt-1">
                      <span>Итого {label}</span>
                      <span>{sum} ₽</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-5 bg-gradient-to-br from-indigo-50 to-indigo-100/50 rounded-2xl border border-indigo-100 shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600">Себестоимость (ед)</span>
                <span className="text-xl font-black text-indigo-700 tabular-nums">{totalCost.toLocaleString('ru')} ₽</span>
              </div>
              <div className="flex justify-between items-center text-[10px] text-slate-600 font-medium pt-2 border-t border-indigo-100">
                <span>На партию ({qty} ед.)</span>
                <span className="font-black tabular-nums">{(totalCost * qty).toLocaleString('ru')} ₽</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-slate-500">Наценка</Label>
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

            <div className="p-5 bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-2xl border border-emerald-100 shadow-sm space-y-1">
              <p className="text-[10px] font-black uppercase tracking-wider text-emerald-600">Розничная цена</p>
              <p className="text-2xl font-black text-emerald-700 tabular-nums">{retailPrice.toLocaleString('ru')} ₽</p>
              <p className="text-[10px] text-slate-600 font-medium pt-2 border-t border-emerald-100">
                Маржа: {margin.toLocaleString('ru')} ₽ ({marginPct}%)
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {Array.from(byCategory.entries()).map(([label, sum]) => (
                <div key={label} className="p-3 bg-slate-50 rounded-xl border border-slate-100 hover:border-indigo-100 transition-colors">
                  <p className="text-[9px] font-bold text-slate-500 uppercase truncate">{label}</p>
                  <p className="text-base font-black text-slate-900 tabular-nums mt-0.5">{sum} ₽</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
