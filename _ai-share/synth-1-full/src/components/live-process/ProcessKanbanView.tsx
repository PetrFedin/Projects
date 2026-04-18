'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { CheckCircle2, CircleDot, Clock } from 'lucide-react';
import {
  useAllInstancesRuntimes,
  getCurrentStageForInstance,
} from '@/lib/live-process/use-all-instances-runtimes';
import { processLiveUrl } from '@/lib/routes';
import type {
  LiveProcessStageDef,
  LiveProcessStageRuntime,
  LiveProcessTeamMember,
} from '@/lib/live-process/types';

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
          'min-w-[180px] cursor-pointer p-3 transition-all hover:shadow-md',
          isSelected ? 'ring-accent-primary ring-2' : 'hover:border-accent-primary/30'
        )}
      >
        <CardContent className="space-y-1 p-0">
          <div className="truncate text-sm font-medium" title={contextLabel}>
            {contextLabel}
          </div>
          <div className="text-text-secondary flex items-center gap-1.5 text-xs">
            {runtime.status === 'done' && (
              <CheckCircle2 className="h-3.5 w-3 shrink-0 text-emerald-500" />
            )}
            {runtime.status === 'in_progress' && (
              <CircleDot className="text-accent-primary h-3.5 w-3 shrink-0" />
            )}
            {runtime.status === 'not_started' && (
              <Clock className="text-text-muted h-3.5 w-3 shrink-0" />
            )}
            <span className="truncate">{primary ?? '—'}</span>
          </div>
          {(runtime.plannedStartAt || runtime.plannedEndAt) && (
            <div className="text-text-muted truncate text-[10px]">
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
    const byStage = new Map<
      string,
      {
        contextId: string;
        contextLabel: string;
        instanceId: string;
        runtimes: Record<string, LiveProcessStageRuntime>;
      }[]
    >();
    stages.forEach((s) => byStage.set(s.id, []));

    allRuntimes.forEach((val, ctxId) => {
      if (filterContextIds?.length && !filterContextIds.includes(ctxId)) return;
      const currentStageId = getCurrentStageForInstance(stages, val.runtimes);
      const list = byStage.get(currentStageId);
      if (list)
        list.push({
          contextId: val.contextId,
          contextLabel: val.contextLabel,
          instanceId: val.instanceId,
          runtimes: val.runtimes,
        });
    });

    return stages.map((stage) => ({
      stage,
      cards: byStage.get(stage.id) ?? [],
    }));
  }, [stages, allRuntimes]);

  return (
    <div className="-mx-1 overflow-x-auto pb-4">
      <div className="flex min-w-max gap-4">
        {columns.map(({ stage, cards }) => (
          <div
            key={stage.id}
            className="bg-bg-surface2/80 w-[220px] flex-shrink-0 rounded-lg border p-2"
          >
            <div className="mb-2 flex items-center justify-between text-sm font-medium">
              <span className="truncate">{stage.title}</span>
              <span className="text-text-muted ml-1 shrink-0 text-xs">{cards.length}</span>
            </div>
            <div className="min-h-[60px] space-y-2">
              {cards.map((c) => (
                <KanbanCard
                  key={c.contextId}
                  contextId={c.contextId}
                  contextLabel={c.contextLabel}
                  runtime={
                    c.runtimes[stage.id] ?? ({ status: 'not_started' } as LiveProcessStageRuntime)
                  }
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
