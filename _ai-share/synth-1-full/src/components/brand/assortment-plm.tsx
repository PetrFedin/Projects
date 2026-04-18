'use client';

import React, { useState, useMemo } from 'react';
import {
  Layers,
  Box,
  Scissors,
  FileText,
  CheckCircle2,
  Clock,
  Zap,
  Layout,
  Settings,
  Sparkles,
  Database,
  Archive,
  RotateCcw,
  Ruler,
  PenTool,
  Globe,
  ChevronRight,
  History,
  Plus,
  Search,
  Filter,
  Move,
  Trash2,
  Camera,
  Calculator,
  ArrowLeft,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  ShieldCheck,
  Link as LinkIcon,
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
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CATEGORY_HANDBOOK } from '@/lib/data/category-handbook';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export function AssortmentPlm({
  collectionId,
  skus = [],
  onAddSku,
  onSkuClick,
  onPlmViewSwitch,
  onBomHistory,
}: {
  collectionId?: string | null;
  skus?: any[];
  onAddSku?: () => void;
  onSkuClick?: (skuId: string) => void;
  onPlmViewSwitch?: (view: 'variants' | 'techpack') => void;
  onBomHistory?: (skuId: string) => void;
}) {
  const [activeTab, setActiveTab] = useState<'matrix' | 'rd' | 'archive'>('matrix');
  const [selectedModelId, setSelectedModelId] = useState<string | null>(null);

  // Filters State
  const [filters, setFilters] = useState({
    search: '',
    audience: 'all',
    cat1: 'all',
    cat2: 'all',
    cat3: 'all',
  });

  // Filter models based on collectionId and user filters
  const models = useMemo(() => {
    let list = skus;
    if (collectionId) {
      list = list.filter((s) => s.collection === collectionId);
    }

    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter((s) => s.name.toLowerCase().includes(q) || s.id.toLowerCase().includes(q));
    }

    if (filters.audience !== 'all') {
      list = list.filter((s) => s.audienceId === filters.audience);
    }

    if (filters.cat1 !== 'all') {
      list = list.filter((s) => s.catLevel1Id === filters.cat1);
    }

    if (filters.cat2 !== 'all') {
      list = list.filter((s) => s.catLevel2Id === filters.cat2);
    }

    if (filters.cat3 !== 'all') {
      list = list.filter((s) => s.catLevel3Id === filters.cat3);
    }

    return list;
  }, [collectionId, skus, filters]);

  // BOM State for selected model
  const [bomItems, setBomItems] = useState([
    { id: 1, name: 'Main Fabric: Tech Nylon', qty: 2.5, unit: 'm', cost: 1200 },
    { id: 2, name: 'Zipper: YKK AquaGuard', qty: 1, unit: 'pc', cost: 450 },
    { id: 3, name: 'Labor: Syntha Factory', qty: 1, unit: 'pc', cost: 2500 },
  ]);

  const selectedModel = useMemo(
    () => models.find((m) => m.id === selectedModelId),
    [selectedModelId, models]
  );

  const landedCost = useMemo(() => {
    return bomItems.reduce((acc, item) => acc + item.qty * item.cost, 0);
  }, [bomItems]);

  const retailPrice = 18000;
  const margin = (((retailPrice - landedCost) / retailPrice) * 100).toFixed(1);

  if (selectedModelId && selectedModel) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-4"
      >
        <header className="flex items-center justify-between rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <Button
              onClick={() => setSelectedModelId(null)}
              variant="ghost"
              className="h-10 w-10 rounded-2xl bg-slate-50"
            >
              <ArrowLeft className="h-6 w-6 text-slate-400" />
            </Button>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-600">
                Model Tech-Pack / BOM
              </p>
              <h2 className="text-base font-bold uppercase tracking-tighter text-slate-900">
                {selectedModel.name}
              </h2>
            </div>
          </div>
          <div className="flex gap-3">
            <Badge className="h-10 border-none bg-emerald-50 px-4 text-[10px] font-bold uppercase text-emerald-600">
              Landed Cost Validated
            </Badge>
            <Button className="h-12 rounded-xl bg-black px-8 text-[10px] font-bold uppercase tracking-widest text-white shadow-xl">
              Зафиксировать BOM
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-3 lg:grid-cols-12">
          {/* BOM Editor */}
          <div className="space-y-6 lg:col-span-8">
            <Card className="overflow-hidden rounded-xl border-none bg-white shadow-2xl">
              <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 p-3">
                <div>
                  <CardTitle className="text-base font-bold uppercase tracking-tight">
                    Калькулятор себестоимости (BOM)
                  </CardTitle>
                  <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Спецификация материалов и работ
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  className="h-10 rounded-xl border-slate-200 text-[10px] font-bold uppercase"
                >
                  Добавить позицию +
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader className="bg-slate-50">
                    <TableRow className="border-none">
                      <TableHead className="px-10 py-5 text-[10px] font-bold uppercase text-slate-500">
                        Компонент
                      </TableHead>
                      <TableHead className="py-5 text-center text-[10px] font-bold uppercase text-slate-500">
                        Кол-во
                      </TableHead>
                      <TableHead className="py-5 text-center text-[10px] font-bold uppercase text-slate-500">
                        Ед. изм.
                      </TableHead>
                      <TableHead className="py-5 text-right text-[10px] font-bold uppercase text-slate-500">
                        Цена/ед.
                      </TableHead>
                      <TableHead className="px-10 py-5 text-right text-[10px] font-bold uppercase text-slate-500">
                        Итого
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bomItems.map((item) => (
                      <TableRow
                        key={item.id}
                        className="border-b border-slate-50 transition-colors hover:bg-slate-50/50"
                      >
                        <TableCell className="px-10 py-6 text-xs font-bold uppercase text-slate-900">
                          {item.name}
                        </TableCell>
                        <TableCell className="text-center">
                          <Input
                            type="number"
                            defaultValue={item.qty}
                            className="mx-auto h-10 w-20 rounded-xl border-slate-100 text-center font-bold"
                          />
                        </TableCell>
                        <TableCell className="text-center text-[10px] font-bold uppercase text-slate-400">
                          {item.unit}
                        </TableCell>
                        <TableCell className="text-right font-bold tabular-nums">
                          {item.cost.toLocaleString('ru-RU')} ₽
                        </TableCell>
                        <TableCell className="px-10 text-right font-bold tabular-nums text-indigo-600">
                          {(item.qty * item.cost).toLocaleString('ru-RU')} ₽
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter className="flex items-center justify-between bg-slate-900 p-3 text-white">
                <div className="flex items-center gap-3">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">
                      Себестоимость (Landed)
                    </p>
                    <p className="text-base font-bold tabular-nums">
                      {landedCost.toLocaleString('ru-RU')}{' '}
                      <span className="text-sm text-white/40">₽</span>
                    </p>
                  </div>
                  <div className="h-10 w-[1px] bg-white/10" />
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">
                      Маржинальность
                    </p>
                    <p className="text-base font-bold tabular-nums text-emerald-400">{margin}%</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">
                    Розница (RRP)
                  </p>
                  <p className="text-sm font-bold tabular-nums">
                    {retailPrice.toLocaleString('ru-RU')} ₽
                  </p>
                </div>
              </CardFooter>
            </Card>
          </div>

          {/* Model Insights Sidebar */}
          <div className="space-y-4 lg:col-span-4">
            <Card className="relative space-y-6 overflow-hidden rounded-xl border-none bg-indigo-600 p-4 text-white shadow-2xl">
              <div className="absolute right-0 top-0 p-4 opacity-10">
                <Calculator className="h-32 w-32" />
              </div>
              <div className="relative z-10 space-y-4">
                <Badge className="border-none bg-white/20 text-[8px] font-bold uppercase text-white">
                  AI Profit Guard
                </Badge>
                <h4 className="text-base font-bold uppercase leading-tight">Анализ доходности</h4>
                <p className="text-xs font-medium leading-relaxed text-indigo-100">
                  «Текущая себестоимость оптимальна. Если вы увеличите объем ткани на 10%, вы
                  получите скидку -5% от поставщика, что поднимет маржу до 72.4%»
                </p>
                <div className="flex gap-3 pt-4">
                  <Button className="h-10 rounded-xl bg-white px-6 text-[9px] font-bold uppercase text-indigo-600 shadow-xl">
                    Оптимизировать
                  </Button>
                </div>
              </div>
            </Card>

            <div className="space-y-6 rounded-xl border border-slate-100 bg-white p-4 shadow-xl">
              <h4 className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-slate-900">
                <Settings className="h-4 w-4 text-slate-400" /> Технические детали
              </h4>
              <div className="space-y-4">
                {[
                  { label: 'Вес изделия', val: '840г' },
                  { label: 'Сложность пошива', val: 'Высокая (Level 4)' },
                  { label: 'Версия тех-пакета', val: 'v2.1 (Locked)' },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between border-b border-slate-50 py-3"
                  >
                    <span className="text-[10px] font-bold uppercase text-slate-400">
                      {item.label}
                    </span>
                    <span className="text-[10px] font-bold uppercase text-slate-900">
                      {item.val}
                    </span>
                  </div>
                ))}
              </div>
              <Button
                variant="outline"
                className="h-12 w-full rounded-xl border-slate-200 text-[9px] font-bold uppercase text-slate-400 hover:text-indigo-600"
              >
                Экспорт тех-пакета (PDF)
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <Card className="overflow-hidden rounded-xl border-none bg-white shadow-2xl">
      <CardHeader className="bg-slate-900 p-3 pb-4 text-white">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="mb-1 flex items-center gap-2">
              <Layers className="h-6 w-6 text-indigo-400" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400">
                Master Production Record
              </span>
            </div>
            <CardTitle className="text-base font-bold uppercase tracking-tighter">
              Assortment Matrix & PLM R&D
            </CardTitle>
            <CardDescription className="font-bold uppercase tracking-tight text-slate-400">
              Единый реестр моделей, тех-пакетов, лекал и результатов примерки образцов.
            </CardDescription>
          </div>
          <div className="flex rounded-2xl border border-white/10 bg-white/5 p-1.5 backdrop-blur-md">
            {['matrix', 'rd', 'archive'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={cn(
                  'rounded-xl px-6 py-2.5 text-[10px] font-bold uppercase transition-all',
                  activeTab === tab
                    ? 'bg-white text-slate-900 shadow-xl'
                    : 'text-white/40 hover:text-white'
                )}
              >
                {tab === 'matrix' ? 'Матрица' : tab === 'rd' ? 'R&D Этапы' : 'Цифровой Архив'}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-3 pt-10">
        {activeTab === 'matrix' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex gap-3">
                  <div className="flex flex-col gap-1 rounded-2xl border border-slate-100 bg-slate-50 p-4">
                    <span className="text-[9px] font-bold uppercase text-slate-400">
                      Всего в списке
                    </span>
                    <span className="text-base font-bold text-slate-900">{models.length} SKU</span>
                  </div>
                  <div className="flex flex-col gap-1 rounded-2xl border border-slate-100 bg-slate-50 p-4">
                    <span className="text-[9px] font-bold uppercase text-slate-400">Коллекция</span>
                    <span className="text-base font-bold uppercase italic text-indigo-600">
                      {collectionId || 'Все'}
                    </span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="h-12 rounded-xl border-slate-200 text-[10px] font-bold uppercase"
                  >
                    Экспорт в 1С/ERP
                  </Button>
                  <Button
                    onClick={onAddSku}
                    className="h-12 rounded-xl bg-indigo-600 px-8 text-[10px] font-bold uppercase text-white"
                  >
                    Новая модель +
                  </Button>
                </div>
              </div>

              {/* Filters Row */}
              <div className="grid grid-cols-5 gap-2 rounded-2xl border border-slate-100 bg-slate-50/50 p-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                  <Input
                    placeholder="Поиск ID/Имя..."
                    className="h-9 rounded-xl border-slate-200 bg-white pl-9 text-[10px] font-bold uppercase"
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  />
                </div>
                <Select
                  value={filters.audience}
                  onValueChange={(v) => setFilters({ ...filters, audience: v })}
                >
                  <SelectTrigger className="h-9 rounded-xl border-slate-200 bg-white text-[9px] font-bold uppercase">
                    <SelectValue placeholder="Аудитория" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все (Аудитория)</SelectItem>
                    {CATEGORY_HANDBOOK.map((a) => (
                      <SelectItem key={a.id} value={a.id}>
                        {a.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={filters.cat1}
                  onValueChange={(v) =>
                    setFilters({ ...filters, cat1: v, cat2: 'all', cat3: 'all' })
                  }
                >
                  <SelectTrigger className="h-9 rounded-xl border-slate-200 bg-white text-[9px] font-bold uppercase">
                    <SelectValue placeholder="Кат. 1" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Уровень 1 (Все)</SelectItem>
                    {filters.audience !== 'all' &&
                      CATEGORY_HANDBOOK.find((a) => a.id === filters.audience)?.categories.map(
                        (c) => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.name}
                          </SelectItem>
                        )
                      )}
                  </SelectContent>
                </Select>
                <Select
                  value={filters.cat2}
                  onValueChange={(v) => setFilters({ ...filters, cat2: v, cat3: 'all' })}
                >
                  <SelectTrigger className="h-9 rounded-xl border-slate-200 bg-white text-[9px] font-bold uppercase">
                    <SelectValue placeholder="Кат. 2" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Уровень 2 (Все)</SelectItem>
                    {filters.cat1 !== 'all' &&
                      filters.audience !== 'all' &&
                      CATEGORY_HANDBOOK.find((a) => a.id === filters.audience)
                        ?.categories.find((c) => c.id === filters.cat1)
                        ?.children?.map((sub) => (
                          <SelectItem key={sub.id} value={sub.id}>
                            {sub.name}
                          </SelectItem>
                        ))}
                  </SelectContent>
                </Select>
                <Select
                  value={filters.cat3}
                  onValueChange={(v) => setFilters({ ...filters, cat3: v })}
                >
                  <SelectTrigger className="h-9 rounded-xl border-slate-200 bg-white text-[9px] font-bold uppercase">
                    <SelectValue placeholder="Кат. 3" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Уровень 3 (Все)</SelectItem>
                    {filters.cat2 !== 'all' &&
                      filters.audience !== 'all' &&
                      CATEGORY_HANDBOOK.find((a) => a.id === filters.audience)
                        ?.categories.find((c) => c.id === filters.cat1)
                        ?.children?.find((s) => s.id === filters.cat2)
                        ?.children?.map((leaf) => (
                          <SelectItem key={leaf.id} value={leaf.id}>
                            {leaf.name}
                          </SelectItem>
                        ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-slate-100 shadow-sm">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow className="border-none">
                    <TableHead className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                      Артикул / Модель
                    </TableHead>
                    <TableHead className="py-5 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                      В сэмпле / PO / ТП
                    </TableHead>
                    <TableHead className="py-5 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                      Статус / Р&Д
                    </TableHead>
                    <TableHead className="py-5 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                      Характеристики
                    </TableHead>
                    <TableHead className="py-5 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                      Ответственный
                    </TableHead>
                    <TableHead className="py-5 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                      Спеки / Лекала
                    </TableHead>
                    <TableHead className="px-8 py-5 text-right text-[10px] font-bold uppercase tracking-widest text-slate-500">
                      VariantMatrix ↔ TechPack / Cross-links
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {models.map((m) => (
                    <TableRow
                      key={m.id}
                      onClick={() => setSelectedModelId(m.id)}
                      className="group cursor-pointer transition-colors hover:bg-slate-50/50"
                    >
                      <TableCell className="px-8 py-6">
                        <p className="mb-1 text-[11px] font-black uppercase leading-none tracking-tight text-slate-900">
                          {m.name}
                        </p>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className="h-3.5 border-slate-200 bg-white px-1 text-[7px] font-black uppercase"
                          >
                            {m.id}
                          </Badge>
                          <span className="text-[8px] font-bold uppercase tracking-widest text-slate-400">
                            {m.audienceId} • {m.catLevel2Id}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {m.inSample && (
                            <span className="rounded bg-indigo-100 px-1.5 py-0.5 text-[7px] font-black uppercase text-indigo-600">
                              Сэмпл
                            </span>
                          )}
                          {m.inPO && (
                            <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[7px] font-black uppercase text-emerald-600">
                              PO
                            </span>
                          )}
                          {m.hasTechPack && (
                            <span className="rounded bg-slate-200 px-1.5 py-0.5 text-[7px] font-black uppercase text-slate-600">
                              ТП
                            </span>
                          )}
                          {!m.inSample && !m.inPO && !m.hasTechPack && (
                            <span className="text-[7px] text-slate-400">—</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={cn(
                            'border-none px-2 py-0.5 text-[8px] font-black uppercase shadow-sm',
                            m.status === 'Production'
                              ? 'bg-emerald-500 text-white'
                              : m.status === 'Development'
                                ? 'bg-amber-500 text-white'
                                : 'bg-indigo-600 text-white'
                          )}
                        >
                          {m.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="text-[10px] font-bold uppercase italic tracking-tight text-slate-600">
                            {(m.attributes as any)?.color || 'Base'}
                          </p>
                          <p className="text-[10px] font-black leading-none text-slate-900">
                            {m.price}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-[8px] font-black uppercase text-slate-500">
                            {m.responsible
                              ?.split(' ')
                              .map((n: string) => n[0])
                              .join('') || '??'}
                          </div>
                          <span className="text-[9px] font-bold uppercase text-slate-600">
                            {m.responsible || '—'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <FileText
                            className={cn(
                              'h-3.5 w-3.5',
                              m.master ? 'text-indigo-600' : 'text-slate-300'
                            )}
                          />
                          <span className="text-[9px] font-bold uppercase tracking-tight text-slate-500">
                            {m.master ? 'Spec Locked' : 'Draft'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="px-8 py-6 text-right">
                        <div className="flex flex-wrap items-center justify-end gap-1">
                          {onPlmViewSwitch && (
                            <>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 rounded-lg hover:bg-indigo-50 hover:text-indigo-600"
                                title="VariantMatrix"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onPlmViewSwitch('variants');
                                }}
                              >
                                <Layers className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 rounded-lg hover:bg-indigo-50 hover:text-indigo-600"
                                title="Tech Pack"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onPlmViewSwitch('techpack');
                                }}
                              >
                                <FileText className="h-3.5 w-3.5" />
                              </Button>
                            </>
                          )}
                          {onBomHistory && m.bomVersions?.length && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 rounded-lg hover:bg-amber-50 hover:text-amber-600"
                              title="История BOM"
                              onClick={(e) => {
                                e.stopPropagation();
                                onBomHistory(m.id);
                              }}
                            >
                              <History className="h-3.5 w-3.5" />
                            </Button>
                          )}
                          {onSkuClick && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 rounded-lg hover:bg-indigo-50 hover:text-indigo-600"
                              title="Cross-links"
                              onClick={(e) => {
                                e.stopPropagation();
                                onSkuClick(m.id);
                              }}
                            >
                              <LinkIcon className="h-3.5 w-3.5" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-xl border border-transparent transition-all group-hover:border-slate-100 group-hover:bg-white group-hover:shadow-md"
                          >
                            <ChevronRight className="h-4 w-4 text-slate-400" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {models.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="h-32 text-center">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">
                          Артикулы не найдены по текущему фильтру
                        </p>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </motion.div>
        )}

        {activeTab === 'rd' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-10"
          >
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
              {[
                {
                  stage: 'Разработка лекал',
                  progress: 85,
                  icon: Scissors,
                  desc: '3D-симуляция в CLO3D и DXF экспорт.',
                },
                {
                  stage: 'Пошив образца #1',
                  progress: 40,
                  icon: Box,
                  desc: 'Тестирование посадки на манекене.',
                },
                {
                  stage: 'Финальная сертификация',
                  progress: 0,
                  icon: ShieldCheck,
                  desc: 'Проверка ГОСТ и качества швов.',
                },
              ].map((s, i) => (
                <div
                  key={i}
                  className="space-y-6 rounded-xl border border-slate-100 bg-slate-50 p-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-100 bg-white shadow-sm">
                      <s.icon className="h-7 w-7 text-indigo-600" />
                    </div>
                    <Badge className="border border-slate-200 bg-white text-[8px] font-bold uppercase text-slate-400">
                      Шаг {i + 1}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-base font-bold uppercase tracking-tighter text-slate-900">
                      {s.stage}
                    </h4>
                    <p className="text-[10px] font-medium leading-relaxed text-slate-500">
                      {s.desc}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-[9px] font-bold uppercase">
                      <span>Готовность</span>
                      <span>{s.progress}%</span>
                    </div>
                    <Progress value={s.progress} className="h-1.5 bg-slate-200" />
                  </div>
                  <Button className="h-12 w-full rounded-xl border border-indigo-100 bg-white text-[10px] font-bold uppercase text-indigo-600 transition-all hover:bg-indigo-600 hover:text-white">
                    Открыть тех-пакет
                  </Button>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'archive' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative space-y-10 overflow-hidden rounded-xl bg-slate-900 p-4 text-white"
          >
            <div className="absolute right-0 top-0 p-4 opacity-10">
              <Archive className="h-64 w-64 rotate-12" />
            </div>
            <div className="relative z-10 mx-auto max-w-2xl space-y-4 text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-indigo-600 shadow-2xl">
                <Database className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-sm font-bold uppercase tracking-tighter">Цифровой Сейф Syntha</h3>
              <p className="text-sm font-medium leading-relaxed text-white/60">
                Безопасное хранилище всех версий ваших коллекций, истории производства и
                интеллектуальной собственности за последние 10 лет.
              </p>
            </div>

            <div className="relative z-10 grid grid-cols-4 gap-3">
              {[
                { label: 'SS 2024 Collection', items: 42, icon: Box },
                { label: 'FW 2023 Collection', items: 38, icon: Archive },
                { label: 'Brand Assets (Logos/Fonts)', items: 12, icon: Layout },
                { label: 'Archived Patterns', items: 124, icon: Scissors },
              ].map((arch, i) => (
                <div
                  key={i}
                  className="group cursor-pointer rounded-2xl border border-white/10 bg-white/5 p-4 transition-all hover:bg-white/10"
                >
                  <arch.icon className="mb-4 h-6 w-6 text-indigo-400" />
                  <p className="mb-1 text-xs font-bold uppercase">{arch.label}</p>
                  <p className="text-[9px] font-bold uppercase text-white/40">
                    {arch.items} Объектов
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
