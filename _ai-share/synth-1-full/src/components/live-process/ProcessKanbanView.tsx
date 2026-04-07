'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { CheckCircle2, CircleDot, Clock } from 'lucide-react';
import { useAllInstancesRuntimes, getCurrentStageForInstance } from '@/lib/live-process/use-all-instances-runtimes';
import { processLiveUrl } from '@/lib/routes';
import type { LiveProcessStageDef, LiveProcessStageRuntime, LiveProcessTeamMember } from '@/lib/live-process/types';

interface ProcessKanbanViewProps {
  processId: string;
  stages: LiveProcessStageDef[];
  team: LiveProcessTeamMember[];
  contextId?: string;
  refreshToken?: unknown;
  /** Фильтр по контекстам: показывать только эти инстансы */
  filterContextIds?: string[];
}

function KanbanCard({
  contextId,
  contextLabel,
  runtime,
  stage,
  team,
  processId,
  isSelected,
}: {
  contextId: string;
  contextLabel: string;
  runtime: LiveProcessStageRuntime;
  stage: LiveProcessStageDef;
  team: LiveProcessTeamMember[];
  processId: string;
  isSelected: boolean;
}) {
  const primary = runtime.primaryAssigneeId
    ? team.find((t) => t.id === runtime.primaryAssigneeId)?.name
    : null;
  return (
    <Link href={processLiveUrl(processId, contextId)}>
      <Card
        className={cn(
          'p-3 cursor-pointer transition-all hover:shadow-md min-w-[180px]',
          isSelected ? 'ring-2 ring-indigo-500' : 'hover:border-indigo-300'
        )}
      >
        <CardContent className="p-0 space-y-1">
          <div className="font-medium text-sm truncate" title={contextLabel}>
            {contextLabel}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            {runtime.status === 'done' && <CheckCircle2 className="h-3.5 w-3 text-emerald-500 shrink-0" />}
            {runtime.status === 'in_progress' && <CircleDot className="h-3.5 w-3 text-indigo-500 shrink-0" />}
            {runtime.status === 'not_started' && <Clock className="h-3.5 w-3 text-slate-400 shrink-0" />}
            <span className="truncate">{primary ?? '—'}</span>
          </div>
          {(runtime.plannedStartAt || runtime.plannedEndAt) && (
            <div className="text-[10px] text-slate-400 truncate">
              {runtime.plannedStartAt && new Date(runtime.plannedStartAt).toLocaleDateString('ru')}
              {runtime.plannedStartAt && runtime.plannedEndAt && ' — '}
              {runtime.plannedEndAt && new Date(runtime.plannedEndAt).toLocaleDateString('ru')}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}

export function ProcessKanbanView({
  processId,
  stages,
  team,
  contextId,
  refreshToken,
  filterContextIds,
}: ProcessKanbanViewProps) {
  const allRuntimes = useAllInstancesRuntimes(processId, refreshToken);

  const columns = useMemo(() => {
    const byStage = new Map<string, { contextId: string; contextLabel: string; instanceId: string; runtimes: Record<string, LiveProcessStageRuntime> }[]>();
    stages.forEach((s) => byStage.set(s.id, []));

    allRuntimes.forEach((val, ctxId) => {
      if (filterContextIds?.length && !filterContextIds.includes(ctxId)) return;
      const currentStageId = getCurrentStageForInstance(stages, val.runtimes);
      const list = byStage.get(currentStageId);
      if (list) list.push({ contextId: val.contextId, contextLabel: val.contextLabel, instanceId: val.instanceId, runtimes: val.runtimes });
    });

    return stages.map((stage) => ({
      stage,
      cards: byStage.get(stage.id) ?? [],
    }));
  }, [stages, allRuntimes]);

  return (
    <div className="overflow-x-auto pb-4 -mx-1">
      <div className="flex gap-4 min-w-max">
        {columns.map(({ stage, cards }) => (
          <div
            key={stage.id}
            className="flex-shrink-0 w-[220px] rounded-lg border bg-slate-50/50 p-2"
          >
            <div className="font-medium text-sm mb-2 flex items-center justify-between">
              <span className="truncate">{stage.title}</span>
              <span className="text-slate-400 text-xs shrink-0 ml-1">{cards.length}</span>
            </div>
            <div className="space-y-2 min-h-[60px]">
              {cards.map((c) => (
                <KanbanCard
                  key={c.contextId}
                  contextId={c.contextId}
                  contextLabel={c.contextLabel}
                  runtime={c.runtimes[stage.id] ?? { status: 'not_started' } as LiveProcessStageRuntime}
                  stage={stage}
                  team={team}
                  processId={processId}
                  isSelected={c.contextId === contextId}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
