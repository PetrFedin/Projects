'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Calendar,
  Filter,
  GanttChart,
  CheckCircle2,
  ChevronRight,
  FileText,
  Package,
  Truck,
  ClipboardCheck,
  ArrowRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const MONTHS = ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];
const WEEKS = Array.from({ length: 24 }, (_, i) => {
  const m = MONTHS[Math.floor(i / 4)];
  const w = (i % 4) + 1;
  return `${m} W${w}`;
});
const QUARTERS = ['Q1 Mar–May', 'Q2 Jun–Aug'];

const GANTT_DATA = [
  {
    id: 'SS26',
    name: 'Spring-Summer 26',
    status: 'Development',
    phases: [
      { id: 1, name: 'Design', start: 0, width: 20, status: 'completed', color: 'bg-indigo-500' },
      {
        id: 2,
        name: 'Sampling',
        start: 22,
        width: 25,
        status: 'in_progress',
        color: 'bg-amber-500',
      },
      { id: 3, name: 'Production', start: 50, width: 30, status: 'pending', color: 'bg-slate-200' },
      { id: 4, name: 'Logistics', start: 82, width: 15, status: 'pending', color: 'bg-slate-200' },
    ],
  },
  {
    id: 'DROP-UZ',
    name: 'Urban Zen Drop',
    status: 'Production',
    phases: [
      { id: 1, name: 'Sampling', start: 0, width: 15, status: 'completed', color: 'bg-indigo-500' },
      {
        id: 2,
        name: 'Production',
        start: 17,
        width: 45,
        status: 'in_progress',
        color: 'bg-emerald-500',
      },
      { id: 3, name: 'Logistics', start: 65, width: 20, status: 'pending', color: 'bg-slate-200' },
    ],
  },
  {
    id: 'BASIC',
    name: 'Basic Collection',
    status: 'Continuous',
    phases: [
      {
        id: 1,
        name: 'Replenishment',
        start: 0,
        width: 100,
        status: 'active',
        color: 'bg-indigo-600/30',
      },
    ],
  },
];

export function ProductionGantt({
  selectedCollectionIds = [],
  onPeriodChange,
  onNavigate,
}: {
  selectedCollectionIds?: string[];
  onPeriodChange?: (p: string) => void;
  onNavigate?: (tab: string) => void;
} = {}) {
  const [activeView, setActiveView] = useState<'week' | 'month' | 'year'>('month');
  const [selectedPhase, setSelectedPhase] = useState<{
    project: (typeof GANTT_DATA)[0];
    phase: (typeof GANTT_DATA)[0]['phases'][0];
  } | null>(null);
  const filteredGanttData =
    selectedCollectionIds.length > 0
      ? GANTT_DATA.filter((g) => selectedCollectionIds.includes(g.id))
      : GANTT_DATA;

  const timelineLabels = activeView === 'week' ? WEEKS : activeView === 'month' ? MONTHS : QUARTERS;

  const getPhaseNavTab = (phaseName: string) => {
    const n = phaseName.toLowerCase();
    if (n.includes('design') || n.includes('дизайн')) return 'plm';
    if (n.includes('sampling') || n.includes('сэмпл')) return 'samples';
    if (n.includes('production') || n.includes('пошив') || n.includes('цех')) return 'orders';
    if (n.includes('logistics') || n.includes('логистик') || n.includes('отгрузк'))
      return 'logistics';
    if (n.includes('replenish')) return 'orders';
    return 'plm';
  };

  return (
    <>
      <Card className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 bg-slate-50/30 p-4">
          <div className="space-y-0.5">
            <CardTitle className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-slate-900">
              <GanttChart className="h-4 w-4 text-indigo-600" />
              График производства (Critical Path)
            </CardTitle>
            <p className="text-[10px] font-medium uppercase tracking-tight text-slate-400">
              Таймлайн разработки и отгрузок по коллекциям.
            </p>
          </div>
          <div className="flex gap-2">
            <div className="flex rounded-lg border border-slate-200 bg-white p-0.5 shadow-sm">
              {(['week', 'month', 'year'] as const).map((v) => (
                <Button
                  key={v}
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setActiveView(v);
                    onPeriodChange?.(v);
                  }}
                  className={cn(
                    'h-6 rounded-md px-3 text-[8px] font-black uppercase transition-all',
                    activeView === v
                      ? 'bg-slate-900 text-white shadow-md'
                      : 'text-slate-400 hover:bg-slate-50'
                  )}
                >
                  {v === 'week' ? 'WEEK' : v === 'month' ? 'MONTH' : 'YEAR'}
                </Button>
              ))}
            </div>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 rounded-lg border-slate-200 bg-white text-slate-400"
            >
              <Filter className="h-3.5 w-3.5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="overflow-x-auto p-0">
          <div
            className={cn(
              activeView === 'week'
                ? 'min-w-[1100px]'
                : activeView === 'year'
                  ? 'min-w-[600px]'
                  : 'min-w-[800px]'
            )}
          >
            {/* Timeline Header */}
            <div className="grid grid-cols-12 border-b border-slate-100">
              <div className="col-span-3 border-r border-slate-100 bg-slate-50/50 p-3 text-[9px] font-black uppercase tracking-widest text-slate-400">
                Проект / Коллекция
              </div>
              <div className="col-span-9 flex p-0">
                {timelineLabels.map((label, i) => (
                  <div
                    key={i}
                    className="min-w-[24px] flex-1 border-r border-slate-100 p-1.5 text-center text-[7px] font-black uppercase tracking-wider text-slate-400 last:border-none"
                    title={label}
                  >
                    {label}
                  </div>
                ))}
              </div>
            </div>

            {/* Timeline Rows — по выбранным коллекциям */}
            {filteredGanttData.map((project) => (
              <div
                key={project.id}
                className="group grid grid-cols-12 border-b border-slate-100 transition-colors hover:bg-slate-50/30"
              >
                <div className="col-span-3 flex flex-col justify-center space-y-1 border-r border-slate-100 p-4">
                  <div className="flex items-center gap-2">
                    <h4 className="text-[10px] font-black uppercase tracking-tight text-slate-900 transition-colors group-hover:text-indigo-600">
                      {project.name}
                    </h4>
                    <Badge
                      className={cn(
                        'h-3.5 border-none px-1 text-[7px] font-black uppercase',
                        project.status === 'Production'
                          ? 'bg-emerald-50 text-emerald-600'
                          : 'bg-indigo-50 text-indigo-600'
                      )}
                    >
                      {project.status}
                    </Badge>
                  </div>
                  <p className="text-[8px] font-bold uppercase tracking-widest text-slate-400">
                    {project.id}
                  </p>
                </div>
                <div className="relative col-span-9 flex h-20 items-center p-4">
                  {/* Grid lines background */}
                  <div className="pointer-events-none absolute inset-0 flex">
                    {timelineLabels.map((_, i) => (
                      <div
                        key={i}
                        className="min-w-0 flex-1 border-r border-slate-100/30 last:border-none"
                      />
                    ))}
                  </div>

                  {/* Phases */}
                  <div className="relative flex h-8 w-full">
                    {project.phases.map((phase) => (
                      <motion.div
                        key={phase.id}
                        initial={{ opacity: 0, scaleX: 0 }}
                        animate={{ opacity: 1, scaleX: 1 }}
                        onClick={() => setSelectedPhase({ project, phase })}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => e.key === 'Enter' && setSelectedPhase({ project, phase })}
                        className={cn(
                          'group/phase absolute flex h-6 cursor-pointer items-center justify-center overflow-hidden rounded-lg border border-white/20 shadow-sm transition-all hover:h-8 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-indigo-400',
                          phase.color
                        )}
                        style={{
                          left: `${phase.start}%`,
                          width: `${phase.width}%`,
                          zIndex: 10,
                        }}
                      >
                        <span className="truncate px-1 text-[7px] font-black uppercase tracking-widest text-white">
                          {phase.name}
                        </span>
                        {phase.status === 'completed' && (
                          <CheckCircle2 className="absolute right-1 top-1 h-2 w-2 text-white/50" />
                        )}
                        {phase.status === 'in_progress' && (
                          <div className="absolute inset-0 overflow-hidden bg-white/10">
                            <motion.div
                              animate={{ x: ['-100%', '100%'] }}
                              transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                              className="h-full w-20 skew-x-12 bg-white/20"
                            />
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            {/* Milestones Legend */}
            <div className="flex items-center justify-center gap-6 border-t border-slate-100 bg-slate-50/50 p-3">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-indigo-500 shadow-sm" />
                <span className="text-[8px] font-bold uppercase tracking-widest text-slate-500">
                  Завершено
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-sm" />
                <span className="text-[8px] font-bold uppercase tracking-widest text-slate-500">
                  В работе
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-amber-500 shadow-sm" />
                <span className="text-[8px] font-bold uppercase tracking-widest text-slate-500">
                  Sampling
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-slate-200 shadow-sm" />
                <span className="text-[8px] font-bold uppercase tracking-widest text-slate-500">
                  План
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Диалог этапа: детали, правки, навигация */}
      <Dialog open={!!selectedPhase} onOpenChange={(o) => !o && setSelectedPhase(null)}>
        <DialogContent className="overflow-hidden rounded-2xl border-none p-0 shadow-xl sm:max-w-[560px]">
          {selectedPhase && (
            <>
              <DialogHeader className="bg-slate-900 p-6 text-white">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      'flex h-10 w-10 items-center justify-center rounded-xl',
                      selectedPhase.phase.color
                    )}
                  >
                    {selectedPhase.phase.name.includes('Design') ||
                    selectedPhase.phase.name.includes('Replenish') ? (
                      <FileText className="h-5 w-5 text-white" />
                    ) : selectedPhase.phase.name.includes('Sampling') ? (
                      <Package className="h-5 w-5 text-white" />
                    ) : selectedPhase.phase.name.includes('Production') ? (
                      <ClipboardCheck className="h-5 w-5 text-white" />
                    ) : (
                      <Truck className="h-5 w-5 text-white" />
                    )}
                  </div>
                  <div>
                    <DialogTitle className="text-lg font-black uppercase tracking-tight text-white">
                      {selectedPhase.phase.name}
                    </DialogTitle>
                    <DialogDescription className="mt-0.5 text-[10px] text-slate-300">
                      {selectedPhase.project.name} · {selectedPhase.project.id}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>
              <div className="space-y-4 p-6">
                <div className="flex items-center gap-2">
                  <Badge
                    className={cn(
                      'text-[9px] font-black uppercase',
                      selectedPhase.phase.status === 'completed'
                        ? 'bg-indigo-100 text-indigo-700'
                        : selectedPhase.phase.status === 'in_progress'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-slate-100 text-slate-600'
                    )}
                  >
                    {selectedPhase.phase.status === 'completed'
                      ? 'Завершено'
                      : selectedPhase.phase.status === 'in_progress'
                        ? 'В работе'
                        : selectedPhase.phase.status === 'active'
                          ? 'Активно'
                          : 'План'}
                  </Badge>
                </div>
                <p className="text-[11px] leading-relaxed text-slate-600">
                  {selectedPhase.phase.name === 'Design' &&
                    'Лекала, техпакеты, BOM — проверьте спецификации и внесите правки.'}
                  {selectedPhase.phase.name === 'Sampling' &&
                    'Образцы Proto 1, Proto 2, PP — статус сэмплов и комментарии по посадке.'}
                  {selectedPhase.phase.name === 'Production' &&
                    'Заказы (PO), цех, мониторинг партий — осмотр и корректировки.'}
                  {selectedPhase.phase.name === 'Logistics' &&
                    'Отгрузки, CMR, маркировка — проверка документов и статуса.'}
                  {selectedPhase.phase.name === 'Replenishment' &&
                    'Пополнение стока — заказы и планирование.'}
                </p>
                <div className="border-t border-slate-100 pt-4">
                  <p className="mb-3 text-[9px] font-bold uppercase tracking-widest text-slate-400">
                    Перейти к разделу для проверки и правок
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {(
                      ['plm', 'samples', 'orders', 'materials', 'execution', 'logistics'] as const
                    ).map((tab) => (
                      <Button
                        key={tab}
                        variant="outline"
                        size="sm"
                        className="h-9 gap-1.5 text-[9px] font-bold uppercase"
                        onClick={() => {
                          onNavigate?.(tab);
                          setSelectedPhase(null);
                        }}
                      >
                        {tab === 'plm' && (
                          <>
                            <FileText className="h-3.5 w-3.5" /> Артикулы / PLM
                          </>
                        )}
                        {tab === 'samples' && (
                          <>
                            <Package className="h-3.5 w-3.5" /> Сэмплы
                          </>
                        )}
                        {tab === 'orders' && (
                          <>
                            <ClipboardCheck className="h-3.5 w-3.5" /> Заказы (PO)
                          </>
                        )}
                        {tab === 'materials' && (
                          <>
                            <Package className="h-3.5 w-3.5" /> Материалы
                          </>
                        )}
                        {tab === 'execution' && (
                          <>
                            <ClipboardCheck className="h-3.5 w-3.5" /> Цех
                          </>
                        )}
                        {tab === 'logistics' && (
                          <>
                            <Truck className="h-3.5 w-3.5" /> Логистика
                          </>
                        )}
                        <ArrowRight className="h-3 w-3" />
                      </Button>
                    ))}
                  </div>
                  <Button
                    className="mt-3 h-10 w-full gap-2 bg-indigo-600 text-[10px] font-black uppercase text-white hover:bg-indigo-700"
                    onClick={() => {
                      onNavigate?.(getPhaseNavTab(selectedPhase.phase.name));
                      setSelectedPhase(null);
                    }}
                  >
                    Открыть{' '}
                    {getPhaseNavTab(selectedPhase.phase.name) === 'plm'
                      ? 'Артикулы'
                      : getPhaseNavTab(selectedPhase.phase.name) === 'samples'
                        ? 'Сэмплы'
                        : getPhaseNavTab(selectedPhase.phase.name) === 'orders'
                          ? 'Заказы'
                          : 'Логистику'}
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
