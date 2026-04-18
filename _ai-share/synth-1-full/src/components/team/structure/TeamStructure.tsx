'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight,
  ChevronDown,
  User,
  Briefcase,
  Shield,
  Info,
  Plus,
  Building2,
  Layers,
  ArrowRight,
  FileText,
  GripVertical,
  ArrowUpCircle,
  ArrowRightCircle,
  MoreHorizontal,
  Trash2,
  Settings2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Position {
  id: string;
  title: string;
  level: 'top' | 'middle' | 'linear';
  description: string;
  instructions: string;
  accessLevel: string;
}

interface Department {
  id: string;
  name: string;
  type: 'block' | 'department' | 'unit';
  layout: 'vertical' | 'horizontal';
  positions: Position[];
  subDepartments?: Department[];
}

const initialStructure: Department[] = [
  {
    id: 'd1',
    name: 'Управление (Global HQ)',
    type: 'block',
    layout: 'vertical',
    positions: [
      {
        id: 'p1',
        title: 'Генеральный директор',
        level: 'top',
        description: 'Стратегическое управление платформой и партнерствами.',
        instructions: '1. Утверждение годового бюджета. 2. Финализация ключевых сделок.',
        accessLevel: 'Owner / Root',
      },
    ],
    subDepartments: [
      {
        id: 'd2',
        name: 'Коммерческий департамент',
        type: 'department',
        layout: 'horizontal',
        positions: [
          {
            id: 'p2',
            title: 'Коммерческий директор',
            level: 'top',
            description: 'Управление продажами и развитием сети.',
            instructions: 'Мониторинг KPI отделов продаж.',
            accessLevel: 'Admin / Full Access',
          },
        ],
        subDepartments: [
          {
            id: 'd3',
            name: 'Отдел закупок (Buying)',
            type: 'unit',
            layout: 'vertical',
            positions: [
              {
                id: 'p3',
                title: 'Ведущий байер',
                level: 'middle',
                description: 'Формирование ассортиментных матриц.',
                instructions: 'Работа с Assortment Planning Grid.',
                accessLevel: 'Editor / Buying Tools',
              },
            ],
          },
          {
            id: 'd4',
            name: 'Отдел маркетинга',
            type: 'unit',
            layout: 'vertical',
            positions: [
              {
                id: 'p5',
                title: 'Head of Growth',
                level: 'middle',
                description: 'Масштабирование трафика.',
                instructions: 'Управление рекламными кампаниями.',
                accessLevel: 'Editor / Ads',
              },
            ],
          },
        ],
      },
    ],
  },
];

export function TeamStructure() {
  const [structure, setStructure] = useState<Department[]>(initialStructure);
  const [selectedPos, setSelectedPos] = useState<Position | null>(null);
  const [expandedDepts, setExpandedDepts] = useState<string[]>(['d1', 'd2', 'd3', 'd4']);

  const toggleDept = (id: string) => {
    setExpandedDepts((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const changeLayout = (deptId: string, layout: 'vertical' | 'horizontal') => {
    const update = (depts: Department[]): Department[] => {
      return depts.map((d) => {
        if (d.id === deptId) return { ...d, layout };
        if (d.subDepartments) return { ...d, subDepartments: update(d.subDepartments) };
        return d;
      });
    };
    setStructure(update(structure));
  };

  const renderPosition = (pos: Position, isHorizontal: boolean) => (
    <motion.div
      key={pos.id}
      layout
      className={cn(
        'group relative mb-2 flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition-all',
        pos.level === 'top'
<<<<<<< HEAD
          ? 'border-slate-800 bg-slate-900 text-white shadow-lg'
          : pos.level === 'middle'
            ? 'border-indigo-100 bg-white shadow-sm'
            : 'border-slate-100 bg-slate-50',
=======
          ? 'bg-text-primary border-text-primary/30 text-white shadow-lg'
          : pos.level === 'middle'
            ? 'border-accent-primary/20 bg-white shadow-sm'
            : 'bg-bg-surface2 border-border-subtle',
>>>>>>> recover/cabinet-wip-from-stash
        isHorizontal ? 'w-[220px]' : 'w-full'
      )}
      onClick={() => setSelectedPos(pos)}
    >
<<<<<<< HEAD
      <GripVertical className="h-3 w-3 cursor-grab text-slate-300 opacity-0 transition-opacity group-hover:opacity-100" />
      <div
        className={cn(
          'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
          pos.level === 'top' ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-600'
=======
      <GripVertical className="text-text-muted h-3 w-3 cursor-grab opacity-0 transition-opacity group-hover:opacity-100" />
      <div
        className={cn(
          'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
          pos.level === 'top'
            ? 'bg-accent-primary text-white'
            : 'bg-accent-primary/10 text-accent-primary'
>>>>>>> recover/cabinet-wip-from-stash
        )}
      >
        {pos.level === 'top' ? <Shield className="h-4 w-4" /> : <User className="h-4 w-4" />}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[10px] font-black uppercase tracking-tight">{pos.title}</p>
<<<<<<< HEAD
        <p className="truncate text-[8px] font-medium text-slate-400">{pos.accessLevel}</p>
=======
        <p className="text-text-muted truncate text-[8px] font-medium">{pos.accessLevel}</p>
>>>>>>> recover/cabinet-wip-from-stash
      </div>
    </motion.div>
  );

  const renderDepartment = (dept: Department, depth = 0) => {
    const isExpanded = expandedDepts.includes(dept.id);
    const isHorizontal = dept.layout === 'horizontal';

    return (
      <div key={dept.id} className="space-y-3">
        <div className="group flex items-center gap-2">
          <div
            className={cn(
              'flex flex-1 cursor-pointer items-center gap-3 rounded-xl p-2.5 transition-all',
              dept.type === 'block'
<<<<<<< HEAD
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                : dept.type === 'department'
                  ? 'border-2 border-indigo-100 bg-white text-indigo-900'
                  : 'border border-slate-200 bg-slate-100 text-slate-600'
=======
                ? 'bg-accent-primary shadow-accent-primary/15 text-white shadow-lg'
                : dept.type === 'department'
                  ? 'border-accent-primary/20 text-accent-primary border-2 bg-white'
                  : 'bg-bg-surface2 border-border-default text-text-secondary border'
>>>>>>> recover/cabinet-wip-from-stash
            )}
            onClick={() => toggleDept(dept.id)}
          >
            {isExpanded ? (
              <ChevronDown className="h-3 w-3" />
            ) : (
              <ChevronRight className="h-3 w-3" />
            )}
            <div className="flex items-center gap-2">
              {dept.type === 'block' ? (
                <Building2 className="h-3.5 w-3.5" />
              ) : (
                <Layers className="h-3.5 w-3.5" />
              )}
              <span className="text-[10px] font-black uppercase tracking-[0.15em]">
                {dept.name}
              </span>
            </div>

            <div className="ml-auto flex items-center gap-2">
              <Badge
                className={cn(
                  'border-none text-[7px] font-black uppercase',
                  dept.layout === 'horizontal'
                    ? 'bg-amber-400 text-black'
                    : 'bg-black/10 text-white'
                )}
              >
                {dept.layout}
              </Badge>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-accent-primary/10 h-9 w-9 rounded-xl"
              >
                <Settings2 className="text-text-muted h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 rounded-2xl border-none p-2 shadow-2xl"
            >
<<<<<<< HEAD
              <DropdownMenuLabel className="p-2 text-[9px] font-black uppercase tracking-widest text-slate-400">
=======
              <DropdownMenuLabel className="text-text-muted p-2 text-[9px] font-black uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
                Конструктор связей
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => changeLayout(dept.id, 'vertical')}
                className="cursor-pointer gap-3 rounded-xl p-2"
              >
<<<<<<< HEAD
                <ArrowUpCircle className="h-4 w-4 text-indigo-500" />
=======
                <ArrowUpCircle className="text-accent-primary h-4 w-4" />
>>>>>>> recover/cabinet-wip-from-stash
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase">Вертикаль (Иерархия)</span>
                  <span className="text-text-muted text-[8px]">Прямое подчинение сверху вниз</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => changeLayout(dept.id, 'horizontal')}
                className="cursor-pointer gap-3 rounded-xl p-2"
              >
                <ArrowRightCircle className="h-4 w-4 text-amber-500" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase">Горизонталь (Параллель)</span>
                  <span className="text-text-muted text-[8px]">Равнозначные блоки в ряд</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer gap-3 rounded-xl p-2 text-rose-600">
                <Trash2 className="h-4 w-4" />
                <span className="text-[10px] font-black uppercase">Удалить узел</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div
                className={cn(
                  'pb-4 pt-1',
                  isHorizontal
                    ? 'custom-scrollbar flex flex-row gap-3 overflow-x-auto pb-6'
<<<<<<< HEAD
                    : 'ml-4 flex flex-col space-y-4 border-l-2 border-slate-100 pl-6'
=======
                    : 'border-border-subtle ml-4 flex flex-col space-y-4 border-l-2 pl-6'
>>>>>>> recover/cabinet-wip-from-stash
                )}
              >
                {/* Positions in this level */}
                {dept.positions.length > 0 && (
                  <div className={cn('flex gap-2', isHorizontal ? 'flex-row' : 'flex-col')}>
                    {dept.positions.map((pos) => renderPosition(pos, isHorizontal))}
                  </div>
                )}

                {/* Sub-departments */}
                {dept.subDepartments?.map((sub) => renderDepartment(sub, depth + 1))}

                {/* Conditional message for Global HQ when no position is selected */}
                {dept.id === 'd1' && !selectedPos && (
<<<<<<< HEAD
                  <div className="w-full space-y-3 rounded-2xl border-2 border-dashed border-indigo-200 bg-indigo-50/50 p-4 text-center text-indigo-800 duration-700 animate-in fade-in">
                    <Layers className="mx-auto h-8 w-8 text-indigo-400" />
=======
                  <div className="border-accent-primary/30 bg-accent-primary/10 text-accent-primary w-full space-y-3 rounded-2xl border-2 border-dashed p-4 text-center duration-700 animate-in fade-in">
                    <Layers className="text-accent-primary mx-auto h-8 w-8" />
>>>>>>> recover/cabinet-wip-from-stash
                    <p className="text-xs font-black uppercase tracking-widest">
                      Настройте функционал
                    </p>
                    <p className="mx-auto max-w-sm text-[10px] font-medium leading-relaxed">
                      Нажмите на любую должность или добавьте новый узел, чтобы настроить роли,
                      доступы и инструкции.
                    </p>
                  </div>
                )}

                {/* Add Button */}
                <Button
                  variant="ghost"
                  className={cn(
<<<<<<< HEAD
                    'gap-2 rounded-xl border-dashed border-slate-200 text-[8px] font-black uppercase tracking-widest text-slate-400 transition-all hover:bg-indigo-50 hover:text-indigo-600',
=======
                    'border-border-default text-text-muted hover:text-accent-primary hover:bg-accent-primary/10 gap-2 rounded-xl border-dashed text-[8px] font-black uppercase tracking-widest transition-all',
>>>>>>> recover/cabinet-wip-from-stash
                    isHorizontal ? 'h-[100px] min-w-[120px] flex-col' : 'h-10 w-full'
                  )}
                >
                  <Plus className="h-3 w-3" />
                  <span>{isHorizontal ? 'Блок' : 'Узел'}</span>
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="space-y-4 duration-700 animate-in fade-in">
      <div className="flex items-end justify-between">
        <div className="flex flex-col gap-2">
<<<<<<< HEAD
          <h2 className="font-headline text-base font-black uppercase tracking-tighter text-slate-900">
            Конструктор Архитектуры
          </h2>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
=======
          <h2 className="text-text-primary font-headline text-base font-black uppercase tracking-tighter">
            Конструктор Архитектуры
          </h2>
          <p className="text-text-muted text-[10px] font-bold uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
            Управляйте связями, преобладанием и параллелями подразделений
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="h-10 rounded-xl px-6 text-[9px] font-black uppercase tracking-widest"
          >
            <FileText className="mr-2 h-3.5 w-3.5" /> Шаблоны
          </Button>
          <Button className="h-10 rounded-xl bg-black px-6 text-[9px] font-black uppercase tracking-widest text-white shadow-xl">
            <Plus className="mr-2 h-3.5 w-3.5" /> Новый блок
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-12">
        <div className="lg:col-span-8">
<<<<<<< HEAD
          <div className="min-h-[700px] rounded-xl border-2 border-slate-50 bg-white p-3 shadow-sm">
=======
          <div className="border-border-subtle min-h-[700px] rounded-xl border-2 bg-white p-3 shadow-sm">
>>>>>>> recover/cabinet-wip-from-stash
            <div className="space-y-4">{structure.map((dept) => renderDepartment(dept))}</div>
          </div>
        </div>

        <div className="lg:col-span-4">
          <div className="sticky top-24 space-y-6">
<<<<<<< HEAD
            <Card className="flex min-h-[500px] flex-col overflow-hidden rounded-xl border-none bg-slate-900 text-white shadow-2xl">
              {selectedPos ? (
                <div className="flex flex-1 flex-col">
                  <div className="border-b border-white/5 bg-gradient-to-br from-indigo-600/20 to-transparent p-4">
                    <div className="mb-6 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-500 shadow-2xl shadow-indigo-500/40">
=======
            <Card className="bg-text-primary flex min-h-[500px] flex-col overflow-hidden rounded-xl border-none text-white shadow-2xl">
              {selectedPos ? (
                <div className="flex flex-1 flex-col">
                  <div className="from-accent-primary/20 border-b border-white/5 bg-gradient-to-br to-transparent p-4">
                    <div className="mb-6 flex items-center gap-3">
                      <div className="bg-accent-primary shadow-accent-primary/20 flex h-10 w-10 items-center justify-center rounded-2xl shadow-2xl">
>>>>>>> recover/cabinet-wip-from-stash
                        <Briefcase className="h-7 w-7" />
                      </div>
                      <div>
                        <h3 className="text-sm font-black uppercase leading-none tracking-tight">
                          {selectedPos.title}
                        </h3>
                        <Badge className="mt-2 border-none bg-amber-400 text-[8px] font-black uppercase text-black">
                          {selectedPos.level} management
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <p className="text-[9px] font-black uppercase tracking-widest text-white/30">
                          Зона ответственности
                        </p>
                        <p className="text-xs font-medium leading-relaxed text-white/70">
                          {selectedPos.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 space-y-4 p-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="text-accent-primary flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          <span className="text-[10px] font-black uppercase tracking-widest">
                            Должностная инструкция
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 text-[8px] font-black uppercase text-white/40 hover:text-white"
                        >
                          Edit
                        </Button>
                      </div>
                      <div className="group relative overflow-hidden rounded-2xl border border-white/5 bg-white/5 p-3 text-[11px] italic leading-relaxed text-white/50">
<<<<<<< HEAD
                        <div className="absolute left-0 top-0 h-full w-1 bg-indigo-500 opacity-50" />
=======
                        <div className="bg-accent-primary absolute left-0 top-0 h-full w-1 opacity-50" />
>>>>>>> recover/cabinet-wip-from-stash
                        {selectedPos.instructions}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-emerald-400">
                        <Shield className="h-4 w-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest">
                          Матрица доступов
                        </span>
                      </div>
                      <div className="grid grid-cols-1 gap-2">
                        {[
                          { name: 'Управление SKU', status: 'full' },
                          { name: 'Финансовые отчеты', status: 'view' },
                          { name: 'Контракты', status: 'sign' },
                        ].map((right, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between rounded-xl border border-white/5 bg-white/5 px-4 py-3 transition-colors hover:bg-white/10"
                          >
                            <span className="text-[10px] font-bold uppercase text-white/60">
                              {right.name}
                            </span>
                            <Badge className="border-none bg-emerald-500/20 px-2 py-0.5 text-[7px] font-black uppercase text-emerald-400">
                              {right.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-white/5 bg-black/20 p-4">
<<<<<<< HEAD
                    <Button className="h-10 w-full rounded-2xl bg-white text-[10px] font-black uppercase tracking-widest text-black shadow-2xl transition-transform hover:bg-indigo-50 active:scale-95">
=======
                    <Button className="hover:bg-accent-primary/10 h-10 w-full rounded-2xl bg-white text-[10px] font-black uppercase tracking-widest text-black shadow-2xl transition-transform active:scale-95">
>>>>>>> recover/cabinet-wip-from-stash
                      Синхронизировать права
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-1 flex-col items-center justify-center space-y-4 p-4 text-center">
                  <div className="relative">
<<<<<<< HEAD
                    <div className="flex h-24 w-24 animate-pulse items-center justify-center rounded-xl border-2 border-indigo-500/20 bg-indigo-500/10">
                      <Layers className="h-10 w-10 text-indigo-500/40" />
                    </div>
                    <div className="absolute -bottom-2 -right-2 flex h-10 w-10 items-center justify-center rounded-2xl border-4 border-slate-900 bg-slate-800">
=======
                    <div className="bg-accent-primary/10 border-accent-primary/20 flex h-24 w-24 animate-pulse items-center justify-center rounded-xl border-2">
                      <Layers className="text-accent-primary/40 h-10 w-10" />
                    </div>
                    <div className="bg-text-primary/90 border-text-primary absolute -bottom-2 -right-2 flex h-10 w-10 items-center justify-center rounded-2xl border-4">
>>>>>>> recover/cabinet-wip-from-stash
                      <Plus className="h-4 w-4 text-white/40" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <p className="text-sm font-black uppercase tracking-[0.2em]">
                      Выберите должность
                    </p>
                    <p className="mx-auto max-w-[200px] text-[10px] font-medium leading-relaxed text-white/30">
                      Нажмите на любой узел в архитектуре слева, чтобы настроить его детали и
                      доступы.
                    </p>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
