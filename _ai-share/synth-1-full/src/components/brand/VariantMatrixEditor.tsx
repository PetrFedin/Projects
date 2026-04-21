'use client';

import React, { useState } from 'react';
import {
  Layers,
  Palette,
  Ruler,
  DollarSign,
  Save,
  RefreshCw,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Info,
  Maximize2,
  Grid,
  List,
  Search,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

const MOCK_VARIANTS = [
  {
    id: 'v1',
    color: 'Midnight Black',
    size: 'S',
    sku: 'CP-BLK-S',
    stock: 120,
    wholesale: 7200,
    rrp: 18000,
  },
  {
    id: 'v2',
    color: 'Midnight Black',
    size: 'M',
    sku: 'CP-BLK-M',
    stock: 85,
    wholesale: 7200,
    rrp: 18000,
  },
  {
    id: 'v3',
    color: 'Midnight Black',
    size: 'L',
    sku: 'CP-BLK-L',
    stock: 42,
    wholesale: 7500,
    rrp: 18500,
  }, // Premium size
  {
    id: 'v4',
    color: 'Slate Grey',
    size: 'S',
    sku: 'CP-GRY-S',
    stock: 64,
    wholesale: 7200,
    rrp: 18000,
  },
  {
    id: 'v5',
    color: 'Slate Grey',
    size: 'M',
    sku: 'CP-GRY-M',
    stock: 110,
    wholesale: 7200,
    rrp: 18000,
  },
];

export function VariantMatrixEditor({ collectionId }: { collectionId?: string | null }) {
  const matrix = React.useMemo(() => {
    if (collectionId === 'SS26' || collectionId === 'BASIC') return MOCK_VARIANTS;
    if (collectionId === 'DROP-UZ') return MOCK_VARIANTS.slice(0, 2);
    return [];
  }, [collectionId]);

  const [variants, setVariants] = useState(matrix);

  React.useEffect(() => {
    setVariants(matrix);
  }, [matrix]);

  if (!collectionId || variants.length === 0) {
    return (
      <div className="space-y-4 pb-24 duration-700 animate-in fade-in">
        <header className="flex flex-col items-start justify-between gap-3 border-b border-slate-100 pb-4 md:flex-row md:items-center">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
              <Grid className="h-3.5 w-3.5 text-indigo-500" />
              Fashion OS — Product Management
            </div>
            <h1 className="text-sm font-bold uppercase leading-tight tracking-tight text-slate-900">
              Variant Matrix Editor
            </h1>
          </div>
        </header>
        <Card className="flex flex-col items-center justify-center gap-6 rounded-[2rem] border-2 border-dashed border-slate-200 bg-slate-50/30 p-20 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl border border-slate-100 bg-white shadow-lg">
            <Grid className="h-10 w-10 text-slate-300" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-black uppercase tracking-tighter text-slate-900">
              Матрица вариантов пуста
            </h3>
            <p className="mx-auto max-w-xs text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Для этой коллекции еще не созданы цвето-размерные варианты артикулов.
            </p>
          </div>
          <Button className="h-12 rounded-xl bg-black px-8 text-[10px] font-black uppercase tracking-widest text-white shadow-xl transition-all hover:bg-indigo-600">
            Сгенерировать матрицу
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-24 duration-700 animate-in fade-in">
      <header className="flex flex-col items-start justify-between gap-3 border-b border-slate-100 pb-4 md:flex-row md:items-center">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
            <Grid className="h-3.5 w-3.5 text-indigo-500" />
            Fashion OS — Product Management
          </div>
          <h1 className="text-sm font-bold uppercase leading-tight tracking-tight text-slate-900">
            Variant Matrix Editor
          </h1>
          <p className="text-[11px] font-medium text-slate-500">
            Управление размерными сетками, цветами и SKU в едином интерфейсе.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-100 p-1 shadow-inner">
          <Button
            variant="outline"
            className="h-7 gap-1.5 rounded-lg border-none bg-white px-3 text-[9px] font-bold uppercase text-slate-600 shadow-sm transition-all hover:bg-slate-50"
          >
            <RefreshCw className="h-3.5 w-3.5 text-slate-400" /> Sync SKU
          </Button>
          <Button className="h-7 gap-1.5 rounded-lg bg-slate-900 px-4 text-[9px] font-bold uppercase text-white shadow-md transition-all hover:bg-slate-800">
            <Save className="h-3.5 w-3.5 text-indigo-400" /> Сохранить матрицу
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-4">
        {/* Product Summary */}
        <Card className="group self-start overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm transition-all hover:border-indigo-100 lg:col-span-1">
          <div className="relative aspect-[4/5] overflow-hidden bg-slate-100">
            <img
              src="https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute left-3 top-3">
              <Badge className="h-5 rounded-md border border-white/10 bg-slate-900/80 px-2 text-[8px] font-bold uppercase tracking-wider text-white shadow-lg backdrop-blur-md">
                Master SKU: CTP-26
              </Badge>
            </div>
          </div>
          <div className="space-y-4 p-4">
            <div className="space-y-1">
              <h2 className="text-sm font-bold uppercase leading-tight tracking-tight text-slate-900">
                Cyber Tech Parka
              </h2>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                FW26 Collection • Outerwear
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-lg border border-slate-100 bg-slate-50 p-2.5 shadow-inner">
                <p className="mb-1 text-[8px] font-bold uppercase tracking-widest text-slate-400">
                  Colors
                </p>
                <p className="text-sm font-bold uppercase text-slate-900">3 Options</p>
              </div>
              <div className="rounded-lg border border-slate-100 bg-slate-50 p-2.5 shadow-inner">
                <p className="mb-1 text-[8px] font-bold uppercase tracking-widest text-slate-400">
                  Sizes
                </p>
                <p className="text-sm font-bold uppercase text-slate-900">5 Options</p>
              </div>
            </div>
            <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-3 shadow-sm">
              <div className="mb-1.5 flex items-center gap-2">
                <Info className="h-3.5 w-3.5 text-indigo-600" />
                <span className="text-[9px] font-bold uppercase leading-none tracking-widest text-indigo-900">
                  AI Price Guard
                </span>
              </div>
              <p className="text-[10px] font-bold uppercase leading-relaxed tracking-tight text-indigo-700 opacity-80">
                «Обнаружено отклонение в маржинальности для размера L (Black). Оптовая цена выше
                средней на 4%.»
              </p>
            </div>
          </div>
        </Card>

        {/* Matrix Table */}
        {/* Matrix Table */}
        <div className="space-y-4 lg:col-span-3">
          <Card className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm transition-all hover:border-indigo-100">
            <div className="flex flex-col items-start justify-between gap-3 border-b border-slate-100 bg-slate-50/30 p-4 md:flex-row md:items-center">
              <div className="flex w-full items-center gap-3 md:w-auto">
                <div className="relative flex-1 md:flex-none">
                  <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                  <Input
                    placeholder="Фильтр по матрице..."
                    className="h-8 w-full rounded-lg border-slate-200 bg-white pl-8 text-[11px] font-bold uppercase tracking-tight shadow-sm transition-all focus:ring-2 focus:ring-indigo-100 md:w-64"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 rounded-lg border-slate-200 bg-white px-3 text-[9px] font-bold uppercase tracking-wider text-slate-600 shadow-sm transition-all hover:bg-slate-50"
                >
                  Markup
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 rounded-lg border-slate-200 bg-white px-3 text-[9px] font-bold uppercase tracking-wider text-slate-600 shadow-sm transition-all hover:bg-slate-50"
                >
                  Stocks
                </Button>
              </div>
            </div>
            <div className="overflow-x-auto p-0">
              <Table>
                <TableHeader className="bg-slate-50/50">
                  <TableRow className="h-9 border-none">
                    <TableHead className="h-9 pl-5 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      Вариант (Color/Size)
                    </TableHead>
                    <TableHead className="h-9 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      SKU Артикул
                    </TableHead>
                    <TableHead className="h-9 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      Опт (Wholesale)
                    </TableHead>
                    <TableHead className="h-9 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      Розница (RRP)
                    </TableHead>
                    <TableHead className="h-9 text-right text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      Свободный сток
                    </TableHead>
                    <TableHead className="h-9 pr-5"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {variants.map((v) => (
                    <TableRow
                      key={v.id}
                      className="group h-10 border-slate-50 transition-colors hover:bg-indigo-50/30"
                    >
                      <TableCell className="py-0 pl-5">
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              'h-4 w-4 rounded-full border border-white shadow-sm ring-1 ring-slate-200',
                              v.color === 'Midnight Black' ? 'bg-slate-950' : 'bg-slate-400'
                            )}
                          />
                          <div>
                            <p className="text-[11px] font-bold uppercase leading-none text-slate-900 transition-colors group-hover:text-indigo-600">
                              {v.color}
                            </p>
                            <Badge
                              variant="outline"
                              className="mt-1 h-4 border-slate-100 bg-slate-50 px-1.5 text-[8px] font-bold uppercase leading-none text-slate-400"
                            >
                              Size: {v.size}
                            </Badge>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-0">
                        <code className="rounded border border-slate-100 bg-slate-50 px-1.5 py-0.5 text-[10px] font-bold uppercase text-slate-400">
                          {v.sku}
                        </code>
                      </TableCell>
                      <TableCell className="py-0">
                        <div className="relative w-24">
                          <Input
                            defaultValue={v.wholesale}
                            className={cn(
                              'h-8 rounded-lg border-slate-200 bg-white pl-6 text-[11px] font-bold shadow-sm transition-all focus:ring-2 focus:ring-indigo-100',
                              v.wholesale > 7200 && 'border-amber-200 bg-amber-50/30'
                            )}
                          />
                          <DollarSign className="absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2 text-slate-400" />
                        </div>
                      </TableCell>
                      <TableCell className="py-0">
                        <div className="relative w-24">
                          <Input
                            defaultValue={v.rrp}
                            className="h-8 rounded-lg border-slate-200 bg-white pl-6 text-[11px] font-bold shadow-sm transition-all focus:ring-2 focus:ring-indigo-100"
                          />
                          <DollarSign className="absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2 text-slate-400" />
                        </div>
                      </TableCell>
                      <TableCell className="py-0 text-right">
                        <span
                          className={cn(
                            'rounded-md border px-2 py-0.5 text-[11px] font-bold tabular-nums shadow-sm',
                            v.stock < 50
                              ? 'border-rose-100 bg-rose-50 text-rose-600'
                              : 'border-emerald-100 bg-emerald-50 text-emerald-600'
                          )}
                        >
                          {v.stock} ед.
                        </span>
                      </TableCell>
                      <TableCell className="py-0 pr-5 text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-slate-300 opacity-0 transition-all hover:bg-rose-50 hover:text-rose-600 group-hover:opacity-100"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <CardFooter className="flex items-center justify-between border-t border-slate-100 bg-slate-50/30 p-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Всего вариантов: {variants.length}
              </p>
              <Button
                variant="ghost"
                className="h-8 gap-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider text-indigo-600 transition-all hover:bg-indigo-50"
              >
                <Plus className="h-3.5 w-3.5" /> Добавить вариант
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
