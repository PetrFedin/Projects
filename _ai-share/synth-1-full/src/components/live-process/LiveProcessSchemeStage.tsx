'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  CheckCircle2,
  CircleDot,
  ChevronDown,
  ChevronRight,
  User,
  Calendar,
  Star,
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from '@/components/ui/dropdown-menu';
import { ProcessLinksBadge } from './ProcessLinksBadge';
import type {
  LiveProcessStageDef,
  LiveProcessStageRuntime,
  LiveProcessTeamMember,
  StageStatus,
} from '@/lib/live-process/types';

/** Показать количество связанных сущностей (артикулов, заказов и т.д.) */
function EntityCounts({
  runtime,
  stage,
}: {
  runtime: LiveProcessStageRuntime;
  stage: LiveProcessStageDef;
}) {
  const counts = runtime.entityCounts;
  const links = stage.entityLinks;
  if (!counts || !links?.length) return null;
  const items = links
    .map((l) => {
      const n = counts[l.entityType] ?? 0;
      const label =
        l.labelKey ??
        (l.entityType === 'articles'
          ? 'артикулов'
          : l.entityType === 'orders'
            ? 'заказов'
            : l.entityType === 'po'
              ? 'PO'
              : l.entityType);
      return { label, n };
    })
    .filter((x) => x.n !== undefined);
  if (items.length === 0) return null;
  return (
<<<<<<< HEAD
    <span className="mt-0.5 block text-[10px] text-slate-500">
=======
    <span className="text-text-secondary mt-0.5 block text-[10px]">
>>>>>>> recover/cabinet-wip-from-stash
      {items.map((i) => `${i.label}: ${i.n}`).join(', ')}
    </span>
  );
}

interface LiveProcessSchemeStageProps {
  stage: LiveProcessStageDef;
  runtime: LiveProcessStageRuntime;
  team: LiveProcessTeamMember[];
  isBlocked: boolean;
  onUpdateRuntime: (stageId: string, patch: Partial<LiveProcessStageRuntime>) => void;
  index: number;
  isHovered?: boolean;
  processLinks?: {
    sourceProcessId: string;
    sourceStageId: string;
    targetProcessId: string;
    targetStageId?: string;
  }[];
}

export function LiveProcessSchemeStage({
  stage,
  runtime,
  team,
  isBlocked,
  onUpdateRuntime,
  index,
  isHovered = false,
  processLinks,
}: LiveProcessSchemeStageProps) {
  const assigneeIds = runtime.assigneeIds ?? [];
  const primaryAssigneeId = runtime.primaryAssigneeId;
  const assignees = team.filter((m) => assigneeIds.includes(m.id));
  const primaryAssignee = primaryAssigneeId
    ? team.find((m) => m.id === primaryAssigneeId)
    : assignees[0];

  const toggleAssignee = (memberId: string) => {
    const next = assigneeIds.includes(memberId)
      ? assigneeIds.filter((id) => id !== memberId)
      : [...assigneeIds, memberId];
    const newPrimary = next.includes(primaryAssigneeId ?? '')
      ? primaryAssigneeId
      : (next[0] ?? null);
    onUpdateRuntime(stage.id, { assigneeIds: next, primaryAssigneeId: newPrimary });
  };

  const setPrimary = (memberId: string) => {
    onUpdateRuntime(stage.id, { primaryAssigneeId: memberId });
  };

  const setStatus = (status: StageStatus) => {
    onUpdateRuntime(stage.id, { status });
  };

  const displayText =
    assignees.length === 0
      ? '— не назначен'
      : assignees.length === 1
        ? assignees[0].name
        : `${assignees.length} чел. (${primaryAssignee?.name ?? ''} — главный)`;

  return (
    <TooltipProvider delayDuration={300}>
      <div className="h-full min-h-[200px] w-full">
        <Card
          className={cn(
            'flex h-full min-h-[200px] w-full flex-col transition-all',
            isBlocked && 'border-dashed opacity-60',
<<<<<<< HEAD
            isHovered && 'shadow-md ring-2 ring-indigo-400'
=======
            isHovered && 'ring-accent-primary shadow-md ring-2'
>>>>>>> recover/cabinet-wip-from-stash
          )}
        >
          <CardHeader className="px-3 pb-2 pt-3">
            <div className="flex items-start justify-between gap-1">
              <span className="text-text-muted text-[10px] font-bold">Этап {index + 1}</span>
              <div className="flex items-center gap-0.5">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={() => setStatus('not_started')}
                      className={cn(
                        'rounded p-0.5',
                        runtime.status === 'not_started'
                          ? 'bg-amber-100 text-amber-600'
<<<<<<< HEAD
                          : 'text-slate-300 hover:text-amber-500'
=======
                          : 'text-text-muted hover:text-amber-500'
>>>>>>> recover/cabinet-wip-from-stash
                      )}
                    >
                      <CircleDot className="h-3.5 w-3.5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>Не начат</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={() => setStatus('in_progress')}
                      className={cn(
                        'rounded p-0.5',
                        runtime.status === 'in_progress'
                          ? 'bg-blue-100 text-blue-600'
<<<<<<< HEAD
                          : 'text-slate-300 hover:text-blue-500'
=======
                          : 'text-text-muted hover:text-blue-500'
>>>>>>> recover/cabinet-wip-from-stash
                      )}
                    >
                      <CircleDot className="h-3.5 w-3.5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>В работе</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={() => setStatus('done')}
                      className={cn(
                        'rounded p-0.5',
                        runtime.status === 'done'
                          ? 'bg-emerald-100 text-emerald-600'
<<<<<<< HEAD
                          : 'text-slate-300 hover:text-emerald-500'
=======
                          : 'text-text-muted hover:text-emerald-500'
>>>>>>> recover/cabinet-wip-from-stash
                      )}
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>Завершён</TooltipContent>
                </Tooltip>
              </div>
            </div>
            <h3 className="mt-0.5 text-xs font-bold leading-tight">{stage.title}</h3>
            <EntityCounts runtime={runtime} stage={stage} />
            <ProcessLinksBadge processLinks={processLinks} sourceStageId={stage.id} />
          </CardHeader>
          <CardContent className="flex-1 space-y-2 px-3 pb-3 pt-0">
            {/* Ответственные — выпадающий список (много выбор + главный) */}
            <div className="space-y-0.5">
              <div className="text-text-secondary flex items-center gap-1 text-[10px]">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="inline-flex">
                      <User className="h-3 w-3 shrink-0" />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>Ответственные — несколько человек, один главный</TooltipContent>
                </Tooltip>
                <span>Ответственные</span>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-full justify-between text-[11px] font-normal"
                  >
                    <span className="truncate">{displayText}</span>
                    <ChevronDown className="h-3 w-3 shrink-0" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  <DropdownMenuLabel>Выбрать ответственных</DropdownMenuLabel>
                  {team.map((m) => (
                    <DropdownMenuCheckboxItem
                      key={m.id}
                      checked={assigneeIds.includes(m.id)}
                      onCheckedChange={() => toggleAssignee(m.id)}
                    >
                      {m.name}
<<<<<<< HEAD
                      {m.role && <span className="ml-1 text-slate-400">({m.role})</span>}
=======
                      {m.role && <span className="text-text-muted ml-1">({m.role})</span>}
>>>>>>> recover/cabinet-wip-from-stash
                    </DropdownMenuCheckboxItem>
                  ))}
                  {assigneeIds.length > 1 && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuLabel className="flex items-center gap-1">
                        <Star className="h-3 w-3" /> Главный
                      </DropdownMenuLabel>
                      <DropdownMenuRadioGroup
                        value={primaryAssigneeId ?? ''}
                        onValueChange={setPrimary}
                      >
                        {assignees.map((m) => (
                          <DropdownMenuRadioItem key={m.id} value={m.id}>
                            {m.name}
                          </DropdownMenuRadioItem>
                        ))}
                      </DropdownMenuRadioGroup>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Даты */}
            <div className="space-y-0.5">
              <div className="text-text-secondary flex items-center gap-1 text-[10px]">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="inline-flex">
                      <Calendar className="h-3 w-3 shrink-0" />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>Планируемые даты начала и окончания этапа</TooltipContent>
                </Tooltip>
                <span>Даты</span>
              </div>
              <div className="flex items-center gap-1">
                <input
                  type="date"
                  value={runtime.plannedStartAt?.slice(0, 10) ?? ''}
                  onChange={(e) =>
                    onUpdateRuntime(stage.id, {
                      plannedStartAt: e.target.value ? `${e.target.value}T00:00:00` : null,
                    })
                  }
<<<<<<< HEAD
                  className="min-w-0 flex-1 rounded border border-slate-200 px-1.5 py-0.5 text-[10px]"
=======
                  className="border-border-default min-w-0 flex-1 rounded border px-1.5 py-0.5 text-[10px]"
>>>>>>> recover/cabinet-wip-from-stash
                />
                <span className="text-text-muted">–</span>
                <input
                  type="date"
                  value={runtime.plannedEndAt?.slice(0, 10) ?? ''}
                  onChange={(e) =>
                    onUpdateRuntime(stage.id, {
                      plannedEndAt: e.target.value ? `${e.target.value}T23:59:59` : null,
                    })
                  }
<<<<<<< HEAD
                  className="min-w-0 flex-1 rounded border border-slate-200 px-1.5 py-0.5 text-[10px]"
=======
                  className="border-border-default min-w-0 flex-1 rounded border px-1.5 py-0.5 text-[10px]"
>>>>>>> recover/cabinet-wip-from-stash
                />
              </div>
            </div>

            {stage.href && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href={stage.href}
<<<<<<< HEAD
                    className="mt-1 inline-flex items-center gap-0.5 text-[10px] font-medium text-indigo-600 hover:text-indigo-700"
=======
                    className="text-accent-primary hover:text-accent-primary mt-1 inline-flex items-center gap-0.5 text-[10px] font-medium"
>>>>>>> recover/cabinet-wip-from-stash
                  >
                    Перейти в раздел
                    <ChevronRight className="h-3 w-3" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent>Открыть связанный раздел</TooltipContent>
              </Tooltip>
            )}
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
}
