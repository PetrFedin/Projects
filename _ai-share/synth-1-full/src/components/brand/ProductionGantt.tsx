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
      {
        id: 1,
        name: 'Design',
        start: 0,
        width: 20,
        status: 'completed',
        color: 'bg-accent-primary',
      },
      {
        id: 2,
        name: 'Sampling',
        start: 22,
        width: 25,
        status: 'in_progress',
        color: 'bg-amber-500',
      },
      {
        id: 3,
        name: 'Production',
        start: 50,
        width: 30,
        status: 'pending',
        color: 'bg-border-subtle',
      },
      {
        id: 4,
        name: 'Logistics',
        start: 82,
        width: 15,
        status: 'pending',
        color: 'bg-border-subtle',
      },
    ],
  },
  {
    id: 'DROP-UZ',
    name: 'Urban Zen Drop',
    status: 'Production',
    phases: [
      {
        id: 1,
        name: 'Sampling',
        start: 0,
        width: 15,
        status: 'completed',
        color: 'bg-accent-primary',
      },
      {
        id: 2,
        name: 'Production',
        start: 17,
        width: 45,
        status: 'in_progress',
        color: 'bg-emerald-500',
      },
      {
        id: 3,
        name: 'Logistics',
        start: 65,
        width: 20,
        status: 'pending',
        color: 'bg-border-subtle',
      },
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
        color: 'bg-accent-primary/30',
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
      <Card className="border-border-subtle overflow-hidden rounded-xl border bg-white shadow-sm">
        <CardHeader className="border-border-subtle bg-bg-surface2/30 flex flex-row items-center justify-between border-b p-4">
          <div className="space-y-0.5">
            <CardTitle className="text-text-primary flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider">
              <GanttChart className="text-accent-primary h-4 w-4" />
              График производства (Critical Path)
            </CardTitle>
            <p className="text-text-muted text-[10px] font-medium uppercase tracking-tight">
              Таймлайн разработки и отгрузок по коллекциям.
            </p>
          </div>
          <div className="flex gap-2">
            <div className="border-border-default flex rounded-lg border bg-white p-0.5 shadow-sm">
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
                      ? 'bg-text-primary text-white shadow-md'
                      : 'text-text-muted hover:bg-bg-surface2'
                  )}
                >
                  {v === 'week' ? 'WEEK' : v === 'month' ? 'MONTH' : 'YEAR'}
                </Button>
              ))}
            </div>
            <Button
              variant="outline"
              size="icon"
              className="text-text-muted border-border-default h-7 w-7 rounded-lg bg-white"
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
            <div className="border-border-subtle grid grid-cols-12 border-b">
              <div className="text-text-muted border-border-subtle bg-bg-surface2/80 col-span-3 border-r p-3 text-[9px] font-black uppercase tracking-widest">
                Проект / Коллекция
              </div>
              <div className="col-span-9 flex p-0">
                {timelineLabels.map((label, i) => (
                  <div
                    key={i}
                    className="text-text-muted border-border-subtle min-w-[24px] flex-1 border-r p-1.5 text-center text-[7px] font-black uppercase tracking-wider last:border-none"
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
                className="border-border-subtle hover:bg-bg-surface2/30 group grid grid-cols-12 border-b transition-colors"
              >
                <div className="border-border-subtle col-span-3 flex flex-col justify-center space-y-1 border-r p-4">
                  <div className="flex items-center gap-2">
                    <h4 className="text-text-primary group-hover:text-accent-primary text-[10px] font-black uppercase tracking-tight transition-colors">
                      {project.name}
                    </h4>
                    <Badge
                      className={cn(
                        'h-3.5 border-none px-1 text-[7px] font-black uppercase',
                        project.status === 'Production'
                          ? 'bg-emerald-50 text-emerald-600'
                          : 'bg-accent-primary/10 text-accent-primary'
                      )}
                    >
                      {project.status}
                    </Badge>
                  </div>
                  <p className="text-text-muted text-[8px] font-bold uppercase tracking-widest">
                    {project.id}
                  </p>
                </div>
                <div className="relative col-span-9 flex h-20 items-center p-4">
                  {/* Grid lines background */}
                  <div className="pointer-events-none absolute inset-0 flex">
                    {timelineLabels.map((_, i) => (
                      <div
                        key={i}
                        className="border-border-subtle/30 min-w-0 flex-1 border-r last:border-none"
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
                          'group/phase focus:ring-accent-primary absolute flex h-6 cursor-pointer items-center justify-center overflow-hidden rounded-lg border border-white/20 shadow-sm transition-all hover:h-8 hover:-translate-y-1 focus:outline-none focus:ring-2',
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
            <div className="bg-bg-surface2/80 border-border-subtle flex items-center justify-center gap-6 border-t p-3">
              <div className="flex items-center gap-2">
                <div className="bg-accent-primary h-2 w-2 rounded-full shadow-sm" />
                <span className="text-text-secondary text-[8px] font-bold uppercase tracking-widest">
                  Завершено
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-sm" />
                <span className="text-text-secondary text-[8px] font-bold uppercase tracking-widest">
                  В работе
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-amber-500 shadow-sm" />
                <span className="text-text-secondary text-[8px] font-bold uppercase tracking-widest">
                  Sampling
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-border-subtle h-2 w-2 rounded-full shadow-sm" />
                <span className="text-text-secondary text-[8px] font-bold uppercase tracking-widest">
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
              <DialogHeader className="bg-text-primary p-6 text-white">
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
                    <DialogDescription className="text-text-muted mt-0.5 text-[10px]">
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
                        ? 'bg-accent-primary/15 text-accent-primary'
                        : selectedPhase.phase.status === 'in_progress'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-bg-surface2 text-text-secondary'
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
                <p className="text-text-secondary text-[11px] leading-relaxed">
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
                <div className="border-border-subtle border-t pt-4">
                  <p className="text-text-muted mb-3 text-[9px] font-bold uppercase tracking-widest">
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
                    className="bg-accent-primary hover:bg-accent-primary mt-3 h-10 w-full gap-2 text-[10px] font-black uppercase text-white"
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
