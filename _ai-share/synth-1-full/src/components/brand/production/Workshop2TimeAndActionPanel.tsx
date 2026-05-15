'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle2, Clock, PlayCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Workshop2TaMilestone, Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import { useArticleWorkspace } from '@/components/brand/production/article-workspace-context';
import { getWorkshop2Phase1Dossier, setWorkshop2Phase1Dossier } from '@/lib/production/workshop2-phase1-dossier-storage';
import { Workshop2SampleGanttChart, type GanttPhase } from './workshop2-sample-gantt-chart';

interface Workshop2TimeAndActionPanelProps {
  articleId: string;
  dossier?: Workshop2DossierPhase1 | null;
}

const DEFAULT_MILESTONES: Workshop2TaMilestone[] = [
  { id: 'm1', title: 'Размещение заказа (PO)', targetDate: '2026-06-01', actualDate: null, status: 'pending' },
  { id: 'm2', title: 'Поставка материалов', targetDate: '2026-06-15', actualDate: null, status: 'pending' },
  { id: 'm3', title: 'Лекала', targetDate: '2026-06-18', actualDate: null, status: 'pending' },
  { id: 'm4', title: 'Раскрой', targetDate: '2026-06-20', actualDate: null, status: 'pending' },
  { id: 'm5', title: 'Пошив образца', targetDate: '2026-07-10', actualDate: null, status: 'pending' },
  { id: 'm6', title: 'Финальный Review', targetDate: '2026-07-15', actualDate: null, status: 'pending' },
];

export function Workshop2TimeAndActionPanel({ articleId, dossier: initialDossier }: Workshop2TimeAndActionPanelProps) {
  const { ref, loading: wsLoading } = useArticleWorkspace();
  const [dossier, setDossier] = useState<Workshop2DossierPhase1 | null>(initialDossier || null);
  const [recalcLoading, setRecalcLoading] = useState(false);

  const reloadDossier = useCallback(() => {
    const loaded = getWorkshop2Phase1Dossier(ref.collectionId, ref.articleId);
    if (loaded) setDossier(loaded);
  }, [ref.articleId, ref.collectionId]);

  useEffect(() => {
    if (wsLoading) return;
    reloadDossier();
  }, [wsLoading, reloadDossier]);

  const persist = useCallback(
    (next: Workshop2DossierPhase1) => {
      setDossier(next);
      setWorkshop2Phase1Dossier(ref.collectionId, ref.articleId, next);
    },
    [ref.articleId, ref.collectionId]
  );

  const milestones = dossier?.taMilestones || DEFAULT_MILESTONES;

  const updateMilestone = (id: string, updates: Partial<Workshop2TaMilestone>) => {
    if (!dossier) return;
    const newMilestones = milestones.map((m) => (m.id === id ? { ...m, ...updates } : m));
    persist({
      ...dossier,
      taMilestones: newMilestones,
      updatedAt: new Date().toISOString(),
      updatedBy: 'time-and-action-panel',
    });
  };

  const handlePredictiveRecalculation = () => {
    if (!dossier) return;
    setRecalcLoading(true);
    setTimeout(() => {
      let delayOffset = 0;
      const recalculated = milestones.map(m => {
        if (m.status === 'delayed') {
          delayOffset += 5; 
        }
        
        if (delayOffset > 0 && m.status === 'pending') {
          const originalDate = new Date(m.targetDate);
          originalDate.setDate(originalDate.getDate() + delayOffset);
          return { ...m, targetDate: originalDate.toISOString().split('T')[0] };
        }
        return m;
      });
      
      persist({
        ...dossier,
        taMilestones: recalculated,
        updatedAt: new Date().toISOString(),
        updatedBy: 'time-and-action-ai-recalc',
      });
      setRecalcLoading(false);
    }, 800);
  };

  const getStatusIcon = (status: Workshop2TaMilestone['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'in_progress': return <PlayCircle className="w-5 h-5 text-blue-500" />;
      case 'delayed': return <AlertCircle className="w-5 h-5 text-red-500" />;
      default: return <Clock className="w-5 h-5 text-text-muted" />;
    }
  };

  const getStatusLabel = (status: Workshop2TaMilestone['status']) => {
    switch (status) {
      case 'completed': return 'Завершено';
      case 'in_progress': return 'В процессе';
      case 'delayed': return 'Критично (Задержка)';
      default: return 'Ожидает';
    }
  };

  const getStatusBadgeVariant = (status: Workshop2TaMilestone['status']) => {
    switch (status) {
      case 'completed': return 'default';
      case 'in_progress': return 'secondary';
      case 'delayed': return 'destructive';
      default: return 'outline';
    }
  };

  // Calculate Gantt phases
  const ganttPhases: GanttPhase[] = React.useMemo(() => {
    if (milestones.length < 2) return [];
    
    // Sort milestones by date to ensure proper timeline
    const sorted = [...milestones].sort((a, b) => {
      const dateA = new Date(a.actualDate || a.targetDate).getTime();
      const dateB = new Date(b.actualDate || b.targetDate).getTime();
      return dateA - dateB;
    });

    const firstDate = new Date(sorted[0].actualDate || sorted[0].targetDate).getTime();
    const lastDate = new Date(sorted[sorted.length - 1].actualDate || sorted[sorted.length - 1].targetDate).getTime();
    const totalDuration = lastDate - firstDate;

    if (totalDuration <= 0) return [];

    const colors = [
      'bg-blue-500',
      'bg-indigo-500',
      'bg-violet-500',
      'bg-purple-500',
      'bg-fuchsia-500',
      'bg-pink-500',
    ];

    return sorted.slice(0, -1).map((m, i) => {
      const nextM = sorted[i + 1];
      const start = new Date(m.actualDate || m.targetDate).getTime();
      const end = new Date(nextM.actualDate || nextM.targetDate).getTime();
      
      const startPercent = ((start - firstDate) / totalDuration) * 100;
      const widthPercent = ((end - start) / totalDuration) * 100;
      
      // Use actual status to determine color if completed or delayed
      let color = colors[i % colors.length];
      if (m.status === 'completed') color = 'bg-emerald-500';
      if (m.status === 'delayed') color = 'bg-red-500';

      return {
        id: m.id,
        name: m.title,
        startPercent,
        widthPercent,
        color,
      };
    });
  }, [milestones]);

  if (wsLoading) return <div className="text-text-secondary text-sm">Загрузка календаря...</div>;
  if (!dossier) return <div className="text-text-secondary text-sm">Досье не найдено. Сохраните ТЗ для начала планирования.</div>;

  return (
    <div className="border-border-default rounded-xl border bg-white p-4 shadow-sm w-full mt-4">
      <div className="flex flex-wrap items-start justify-between gap-2 mb-4">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <div className="bg-accent-primary/10 text-accent-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-accent-primary/15 shadow-sm">
            <Clock className="h-4 w-4 shrink-0" aria-hidden />
          </div>
          <div className="min-w-0 flex-1 space-y-1">
            <h2 className="text-text-primary text-base font-semibold">Управление критическим путем (T&A)</h2>
            <p className="text-text-secondary text-[11px] leading-snug">
              Time and Action Calendar. Контроль сроков ключевых вех (milestones) от размещения заказа до отгрузки.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handlePredictiveRecalculation} 
            disabled={recalcLoading || milestones.length === 0}
            className="h-8 gap-1.5 text-[11px] text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 border-indigo-200"
          >
            {recalcLoading ? <PlayCircle className="w-3.5 h-3.5 animate-spin" /> : <PlayCircle className="w-3.5 h-3.5" />}
            {recalcLoading ? 'Пересчет...' : 'AI-прогноз задержек'}
          </Button>
        </div>
      </div>

      <Workshop2SampleGanttChart phases={ganttPhases} />

      <div className="relative border-l-2 border-border-subtle ml-3 md:ml-4 space-y-6 pb-2">
        {milestones.map((milestone, index) => {
          const isDelayed = milestone.status === 'delayed';
          const isLast = index === milestones.length - 1;

          return (
            <div key={milestone.id} className="relative pl-6 md:pl-8">
              <div className="absolute -left-[11px] top-1 bg-white rounded-full">
                {getStatusIcon(milestone.status)}
              </div>
              
              {isDelayed && !isLast && (
                <div className="absolute -left-[2px] top-6 bottom-[-24px] w-[2px] bg-red-400 opacity-70" />
              )}

              <div className={cn('p-3 sm:p-4 border rounded-lg shadow-sm transition-colors bg-white', isDelayed ? 'border-red-200 bg-red-50/30' : 'border-border-subtle')}>
                <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className={cn('text-sm font-medium', isDelayed ? 'text-red-700' : 'text-text-primary')}>
                        {milestone.title}
                      </h4>
                      {isDelayed && (
                        <Badge variant="destructive" className="h-5 text-[10px] px-1.5 tracking-wider font-normal">
                          Критический путь
                        </Badge>
                      )}
                    </div>
                    <div className="text-xs text-text-secondary mt-1">
                      Цель: <span className="font-medium text-text-primary">{milestone.targetDate}</span>
                    </div>
                  </div>

                  <div className="flex items-end gap-3 flex-wrap bg-bg-surface p-3 rounded-lg border border-border-subtle w-full xl:w-auto">
                    <div className="flex flex-col gap-1.5 min-w-[140px]">
                      <label className="text-[11px] font-medium text-text-secondary tracking-wide">Факт. дата</label>
                      <Input
                        type="date"
                        value={milestone.actualDate || ''}
                        onChange={(e) => updateMilestone(milestone.id, { actualDate: e.target.value || null })}
                        className={cn('h-8 text-xs', isDelayed && 'border-red-300 focus-visible:ring-red-400')}
                      />
                    </div>

                    <div className="flex flex-col gap-1.5 min-w-[140px]">
                      <label className="text-[11px] font-medium text-text-secondary tracking-wide">Статус</label>
                      <Select
                        value={milestone.status}
                        onValueChange={(val) => updateMilestone(milestone.id, { status: val as Workshop2TaMilestone['status'] })}
                      >
                        <SelectTrigger className={cn('h-8 text-xs', isDelayed && 'border-red-300 focus:ring-red-400')}>
                          <SelectValue placeholder="Статус" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Ожидает</SelectItem>
                          <SelectItem value="in_progress">В процессе</SelectItem>
                          <SelectItem value="completed">Завершено</SelectItem>
                          <SelectItem value="delayed">Задерживается</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="min-w-[110px] flex justify-end pb-1">
                      <Badge variant={getStatusBadgeVariant(milestone.status)} className="shadow-sm font-normal">
                        {getStatusLabel(milestone.status)}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
