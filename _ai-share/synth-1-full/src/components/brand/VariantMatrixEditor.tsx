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

const VARIANT_SWATCH_BG_BY_COLOR: Record<string, string> = {
  'Midnight Black': 'bg-text-primary',
  'Slate Grey': 'bg-text-muted',
};

function getStockBadgeClass(stock: number): string {
  return stock < 50
    ? 'bg-rose-50 text-rose-600 border-rose-100'
    : 'bg-emerald-50 text-emerald-600 border-emerald-100';
}

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
        <header className="border-border-subtle flex flex-col items-start justify-between gap-3 border-b pb-4 md:flex-row md:items-center">
          <div className="space-y-0.5">
            <div className="text-text-muted flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.15em]">
              <Grid className="text-accent-primary h-3.5 w-3.5" />
              Fashion OS — Product Management
            </div>
            <h1 className="text-text-primary text-sm font-bold uppercase leading-tight tracking-tight">
              Variant Matrix Editor
            </h1>
          </div>
        </header>
        <Card className="border-border-default bg-bg-surface2/30 flex flex-col items-center justify-center gap-6 rounded-[2rem] border-2 border-dashed p-20 text-center">
          <div className="border-border-subtle flex h-20 w-20 items-center justify-center rounded-3xl border bg-white shadow-lg">
            <Grid className="text-text-muted h-10 w-10" />
          </div>
          <div className="space-y-2">
            <h3 className="text-text-primary text-xl font-black uppercase tracking-tighter">
              Матрица вариантов пуста
            </h3>
            <p className="text-text-muted mx-auto max-w-xs text-[10px] font-bold uppercase tracking-widest">
              Для этой коллекции еще не созданы цвето-размерные варианты артикулов.
            </p>
          </div>
          <Button className="hover:bg-accent-primary h-12 rounded-xl bg-black px-8 text-[10px] font-black uppercase tracking-widest text-white shadow-xl transition-all">
            Сгенерировать матрицу
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-24 duration-700 animate-in fade-in">
      <header className="border-border-subtle flex flex-col items-start justify-between gap-3 border-b pb-4 md:flex-row md:items-center">
        <div className="space-y-0.5">
          <div className="text-text-muted flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.15em]">
            <Grid className="text-accent-primary h-3.5 w-3.5" />
            Fashion OS — Product Management
          </div>
          <h1 className="text-text-primary text-sm font-bold uppercase leading-tight tracking-tight">
            Variant Matrix Editor
          </h1>
          <p className="text-text-secondary text-[11px] font-medium">
            Управление размерными сетками, цветами и SKU в едином интерфейсе.
          </p>
        </div>
        <div className="bg-bg-surface2 border-border-default flex items-center gap-2 rounded-xl border p-1 shadow-inner">
          <Button
            variant="outline"
            className="text-text-secondary hover:bg-bg-surface2 h-7 gap-1.5 rounded-lg border-none bg-white px-3 text-[9px] font-bold uppercase shadow-sm transition-all"
          >
            <RefreshCw className="text-text-muted h-3.5 w-3.5" /> Sync SKU
          </Button>
          <Button className="bg-text-primary hover:bg-text-primary/90 h-7 gap-1.5 rounded-lg px-4 text-[9px] font-bold uppercase text-white shadow-md transition-all">
            <Save className="text-accent-primary h-3.5 w-3.5" /> Save Matrix
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-4">
        {/* Product Summary */}
        <Card className="border-border-subtle hover:border-accent-primary/20 group self-start overflow-hidden rounded-xl border bg-white shadow-sm transition-all lg:col-span-1">
          <div className="bg-bg-surface2 relative aspect-[4/5] overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute left-3 top-3">
              <Badge className="bg-text-primary/80 h-5 rounded-md border border-white/10 px-2 text-[8px] font-bold uppercase tracking-wider text-white shadow-lg backdrop-blur-md">
                Master SKU: CTP-26
              </Badge>
            </div>
          </div>
          <div className="space-y-4 p-4">
            <div className="space-y-1">
              <h2 className="text-text-primary text-sm font-bold uppercase leading-tight tracking-tight">
                Cyber Tech Parka
              </h2>
              <p className="text-text-muted text-[10px] font-bold uppercase tracking-wider">
                FW26 Collection • Outerwear
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-bg-surface2 border-border-subtle rounded-lg border p-2.5 shadow-inner">
                <p className="text-text-muted mb-1 text-[8px] font-bold uppercase tracking-widest">
                  Colors
                </p>
                <p className="text-text-primary text-sm font-bold uppercase">3 Options</p>
              </div>
              <div className="bg-bg-surface2 border-border-subtle rounded-lg border p-2.5 shadow-inner">
                <p className="text-text-muted mb-1 text-[8px] font-bold uppercase tracking-widest">
                  Sizes
                </p>
                <p className="text-text-primary text-sm font-bold uppercase">5 Options</p>
              </div>
            </div>
            <div className="bg-accent-primary/10 border-accent-primary/20 rounded-xl border p-3 shadow-sm">
              <div className="mb-1.5 flex items-center gap-2">
                <Info className="text-accent-primary h-3.5 w-3.5" />
                <span className="text-accent-primary text-[9px] font-bold uppercase leading-none tracking-widest">
                  AI Price Guard
                </span>
              </div>
              <p className="text-accent-primary text-[10px] font-bold uppercase leading-relaxed tracking-tight opacity-80">
                «Обнаружено отклонение в маржинальности для размера L (Black). Оптовая цена выше
                средней на 4%.»
              </p>
            </div>
          </div>
        </Card>

        {/* Matrix Table */}
        {/* Matrix Table */}
        <div className="space-y-4 lg:col-span-3">
          <Card className="border-border-subtle hover:border-accent-primary/20 overflow-hidden rounded-xl border bg-white shadow-sm transition-all">
            <div className="bg-bg-surface2/30 border-border-subtle flex flex-col items-start justify-between gap-3 border-b p-4 md:flex-row md:items-center">
              <div className="flex w-full items-center gap-3 md:w-auto">
                <div className="relative flex-1 md:flex-none">
                  <Search className="text-text-muted absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2" />
                  <Input
                    placeholder="Фильтр по матрице..."
                    className="border-border-default focus:ring-accent-primary/20 h-8 w-full rounded-lg bg-white pl-8 text-[11px] font-bold uppercase tracking-tight shadow-sm transition-all focus:ring-2 md:w-64"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-border-default text-text-secondary hover:bg-bg-surface2 h-7 rounded-lg bg-white px-3 text-[9px] font-bold uppercase tracking-wider shadow-sm transition-all"
                >
                  Markup
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-border-default text-text-secondary hover:bg-bg-surface2 h-7 rounded-lg bg-white px-3 text-[9px] font-bold uppercase tracking-wider shadow-sm transition-all"
                >
                  Stocks
                </Button>
              </div>
            </div>
            <div className="overflow-x-auto p-0">
              <Table>
                <TableHeader className="bg-bg-surface2/80">
                  <TableRow className="h-9 border-none">
                    <TableHead className="text-text-muted h-9 pl-5 text-[10px] font-bold uppercase tracking-widest">
                      Вариант (Color/Size)
                    </TableHead>
                    <TableHead className="text-text-muted h-9 text-[10px] font-bold uppercase tracking-widest">
                      SKU Артикул
                    </TableHead>
                    <TableHead className="text-text-muted h-9 text-[10px] font-bold uppercase tracking-widest">
                      Опт (Wholesale)
                    </TableHead>
                    <TableHead className="text-text-muted h-9 text-[10px] font-bold uppercase tracking-widest">
                      Розница (RRP)
                    </TableHead>
                    <TableHead className="text-text-muted h-9 text-right text-[10px] font-bold uppercase tracking-widest">
                      Свободный сток
                    </TableHead>
                    <TableHead className="h-9 pr-5"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {variants.map((v) => (
                    <TableRow
                      key={v.id}
                      className="hover:bg-accent-primary/10 border-border-subtle group h-10 transition-colors"
                    >
                      <TableCell className="py-0 pl-5">
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              'ring-border-default h-4 w-4 rounded-full border border-white shadow-sm ring-1',
                              VARIANT_SWATCH_BG_BY_COLOR[v.color] ?? 'bg-text-muted'
                            )}
                          />
                          <div>
                            <p className="text-text-primary group-hover:text-accent-primary text-[11px] font-bold uppercase leading-none transition-colors">
                              {v.color}
                            </p>
                            <Badge
                              variant="outline"
                              className="border-border-subtle bg-bg-surface2 text-text-muted mt-1 h-4 px-1.5 text-[8px] font-bold uppercase leading-none"
                            >
                              Size: {v.size}
                            </Badge>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-0">
                        <code className="text-text-muted bg-bg-surface2 border-border-subtle rounded border px-1.5 py-0.5 text-[10px] font-bold uppercase">
                          {v.sku}
                        </code>
                      </TableCell>
                      <TableCell className="py-0">
                        <div className="relative w-24">
                          <Input
                            defaultValue={v.wholesale}
                            className={cn(
                              'border-border-default focus:ring-accent-primary/20 h-8 rounded-lg bg-white pl-6 text-[11px] font-bold shadow-sm transition-all focus:ring-2',
                              v.wholesale > 7200 && 'border-amber-200 bg-amber-50/30'
                            )}
                          />
                          <DollarSign className="text-text-muted absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2" />
                        </div>
                      </TableCell>
                      <TableCell className="py-0">
                        <div className="relative w-24">
                          <Input
                            defaultValue={v.rrp}
                            className="border-border-default focus:ring-accent-primary/20 h-8 rounded-lg bg-white pl-6 text-[11px] font-bold shadow-sm transition-all focus:ring-2"
                          />
                          <DollarSign className="text-text-muted absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2" />
                        </div>
                      </TableCell>
                      <TableCell className="py-0 text-right">
                        <span
                          className={cn(
                            'rounded-md border px-2 py-0.5 text-[11px] font-bold tabular-nums shadow-sm',
                            getStockBadgeClass(v.stock)
                          )}
                        >
                          {v.stock} ед.
                        </span>
                      </TableCell>
                      <TableCell className="py-0 pr-5 text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-text-muted h-7 w-7 opacity-0 transition-all hover:bg-rose-50 hover:text-rose-600 group-hover:opacity-100"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <CardFooter className="bg-bg-surface2/30 border-border-subtle flex items-center justify-between border-t p-4">
              <p className="text-text-muted text-[10px] font-bold uppercase tracking-widest">
                Всего вариантов: {variants.length}
              </p>
              <Button
                variant="ghost"
                className="text-accent-primary hover:bg-accent-primary/10 h-8 gap-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all"
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
