'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  CheckCircle2,
  CircleDot,
  Lock,
  User,
  Calendar,
  MessageSquare,
  StickyNote,
  ListTodo,
  Users,
  ChevronDown,
  ChevronUp,
  Star,
} from 'lucide-react';
import { StageChatPanel } from './StageChatPanel';
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
import { ROUTES } from '@/lib/routes';
import type {
  LiveProcessStageDef,
  LiveProcessStageRuntime,
  LiveProcessTeamMember,
  LiveProcessComment,
  LiveProcessTask,
  StageStatus,
} from '@/lib/live-process/types';

interface LiveProcessStageCardProps {
  stage: LiveProcessStageDef;
  runtime: LiveProcessStageRuntime;
  team: LiveProcessTeamMember[];
  isBlocked: boolean;
  onUpdateRuntime: (stageId: string, patch: Partial<LiveProcessStageRuntime>) => void;
  index: number;
}

export function LiveProcessStageCard({
  stage,
  runtime,
  team,
  isBlocked,
  onUpdateRuntime,
  index,
}: LiveProcessStageCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
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

  const toggleBlockMember = (memberId: string) => {
    const next = runtime.blockedMemberIds.includes(memberId)
      ? runtime.blockedMemberIds.filter((id) => id !== memberId)
      : [...runtime.blockedMemberIds, memberId];
    onUpdateRuntime(stage.id, { blockedMemberIds: next });
  };

  const addComment = (
    body: string,
    mentions?: { userId: string; userName: string; match: string }[]
  ) => {
    if (!body.trim()) return;
    const c: LiveProcessComment = {
      id: `c-${Date.now()}`,
      stageId: stage.id,
      authorId: 'current',
      authorName: 'Вы',
      body: body.trim(),
      createdAt: new Date().toISOString(),
      ...(mentions?.length && {
        mentions: mentions.map((m) => ({ userId: m.userId, userName: m.userName, match: m.match })),
      }),
    };
    onUpdateRuntime(stage.id, { comments: [...runtime.comments, c] });
  };

  const addTask = () => {
    if (!newTaskTitle.trim()) return;
    const t: LiveProcessTask = {
      id: `t-${Date.now()}`,
      stageId: stage.id,
      title: newTaskTitle.trim(),
      done: false,
      createdAt: new Date().toISOString(),
    };
    onUpdateRuntime(stage.id, { tasks: [...runtime.tasks, t] });
    setNewTaskTitle('');
  };

  const toggleTask = (taskId: string) => {
    onUpdateRuntime(stage.id, {
      tasks: runtime.tasks.map((t) => (t.id === taskId ? { ...t, done: !t.done } : t)),
    });
  };

  const removeTask = (taskId: string) => {
    onUpdateRuntime(stage.id, { tasks: runtime.tasks.filter((t) => t.id !== taskId) });
  };

  const updateNote = (content: string) => {
    onUpdateRuntime(stage.id, {
      note: { stageId: stage.id, content, updatedAt: new Date().toISOString() },
    });
  };

  const toggleParticipant = (memberId: string) => {
    const next = runtime.participantIds.includes(memberId)
      ? runtime.participantIds.filter((id) => id !== memberId)
      : [...runtime.participantIds, memberId];
    onUpdateRuntime(stage.id, { participantIds: next });
  };

  const setStatus = (status: StageStatus) => {
    onUpdateRuntime(stage.id, { status });
  };

  return (
    <TooltipProvider delayDuration={300}>
      <Card className={cn(isBlocked && 'border-dashed opacity-60')}>
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-text-muted text-[10px] font-bold">Этап {index + 1}</span>
                <Badge variant="secondary" className="text-[9px]">
                  {stage.area}
                </Badge>
                {stage.mandatory && (
                  <Badge variant="outline" className="text-[9px]">
                    Обязательный
                  </Badge>
                )}
              </div>
              <h3 className="mt-1 text-sm font-bold">{stage.title}</h3>
              <p className="text-text-secondary mt-0.5 text-xs">{stage.description}</p>
            </div>
            <div className="flex items-center gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setStatus('not_started')}
                  >
                    <CircleDot
                      className={cn(
                        'h-4 w-4',
                        runtime.status === 'not_started' && 'text-amber-500'
                      )}
                    />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Не начат</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setStatus('in_progress')}
                  >
                    <CircleDot
                      className={cn('h-4 w-4', runtime.status === 'in_progress' && 'text-blue-500')}
                    />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>В работе</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setStatus('done')}
                  >
                    <CheckCircle2
                      className={cn('h-4 w-4', runtime.status === 'done' && 'text-emerald-600')}
                    />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Завершён</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8"
                    onClick={() => setExpanded(!expanded)}
                  >
                    {expanded ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {expanded ? 'Свернуть' : 'Развернуть: комментарии, заметки, задачи'}
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
          {stage.href && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href={stage.href}
                  className="mt-1 inline-block text-[10px] text-primary underline"
                >
                  Перейти в раздел →
                </Link>
              </TooltipTrigger>
              <TooltipContent>Открыть связанный раздел</TooltipContent>
            </Tooltip>
          )}
        </CardHeader>

        <CardContent className="space-y-3 pt-0">
          {/* Ответственные — выпадающий список (много выбор + главный) */}
          <div className="flex flex-wrap items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="inline-flex">
                  <User className="text-text-muted h-3.5 w-3.5" />
                </span>
              </TooltipTrigger>
              <TooltipContent>Ответственные — несколько человек, один главный</TooltipContent>
            </Tooltip>
            <span className="text-text-secondary text-[10px]">Ответственные:</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 text-xs font-normal">
                  {assignees.length === 0
                    ? '— не назначен'
                    : assignees.length === 1
                      ? assignees[0].name
                      : `${assignees.length} чел. (${primaryAssignee?.name ?? ''} — главный)`}
                  <ChevronDown className="ml-1 h-3 w-3" />
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
                    {m.name} {m.role && <span className="text-text-muted">({m.role})</span>}
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

          {/* Планируемые даты и календарь */}
          <div className="flex flex-wrap items-center gap-3">
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="inline-flex">
                  <Calendar className="text-text-muted h-3.5 w-3.5" />
                </span>
              </TooltipTrigger>
              <TooltipContent>Планируемые даты начала и окончания этапа</TooltipContent>
            </Tooltip>
            <input
              type="date"
              value={runtime.plannedStartAt?.slice(0, 10) ?? ''}
              onChange={(e) =>
                onUpdateRuntime(stage.id, {
                  plannedStartAt: e.target.value ? `${e.target.value}T00:00:00` : null,
                })
              }
              className="border-border-default rounded border px-2 py-1 text-[11px]"
            />
            <span className="text-text-muted">—</span>
            <input
              type="date"
              value={runtime.plannedEndAt?.slice(0, 10) ?? ''}
              onChange={(e) =>
                onUpdateRuntime(stage.id, {
                  plannedEndAt: e.target.value ? `${e.target.value}T23:59:59` : null,
                })
              }
              className="border-border-default rounded border px-2 py-1 text-[11px]"
            />
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href={ROUTES.brand.calendar}>
                  <Button variant="outline" size="sm" className="h-7 text-[10px]">
                    Синхр. с календарём
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                Переход в календарь. Даты этапа создают события; изменение дат синхронизируется.
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Доступ: блокировка участников */}
          <div className="border-border-subtle bg-bg-surface2/80 rounded-lg border p-2">
            <p className="text-text-secondary mb-1.5 flex items-center gap-1 text-[10px] font-bold">
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="inline-flex">
                    <Lock className="h-3 w-3" />
                  </span>
                </TooltipTrigger>
                <TooltipContent>Заблокировать доступ участников к этому этапу</TooltipContent>
              </Tooltip>
              Доступ к этапу — заблокировать участников
            </p>
            <div className="flex flex-wrap gap-2">
              {team.map((m) => (
                <label key={m.id} className="flex cursor-pointer items-center gap-1.5 text-[10px]">
                  <input
                    type="checkbox"
                    checked={runtime.blockedMemberIds.includes(m.id)}
                    onChange={() => toggleBlockMember(m.id)}
                    className="rounded"
                  />
                  <span
                    className={
                      runtime.blockedMemberIds.includes(m.id)
                        ? 'text-red-600'
                        : 'text-text-secondary'
                    }
                  >
                    {m.name}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Участники обсуждения */}
          <div className="border-border-subtle bg-bg-surface2/80 rounded-lg border p-2">
            <p className="text-text-secondary mb-1.5 flex items-center gap-1 text-[10px] font-bold">
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="inline-flex">
                    <Users className="h-3 w-3" />
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  Участники обсуждения этапа. Синхронизация с чатами — в разработке
                </TooltipContent>
              </Tooltip>
              Участники обсуждения
            </p>
            <div className="flex flex-wrap gap-2">
              {team.map((m) => (
                <label key={m.id} className="flex cursor-pointer items-center gap-1.5 text-[10px]">
                  <input
                    type="checkbox"
                    checked={runtime.participantIds.includes(m.id)}
                    onChange={() => toggleParticipant(m.id)}
                    className="rounded"
                  />
                  <span>{m.name}</span>
                </label>
              ))}
            </div>
          </div>

          {expanded && (
            <>
              {/* Чат этапа (комментарии + @упоминания) */}
              <div className="border-border-subtle border-t pt-3">
                <StageChatPanel
                  stageId={stage.id}
                  comments={runtime.comments}
                  team={team}
                  onAddComment={addComment}
                />
              </div>

              {/* Заметки */}
              <div className="border-border-subtle border-t pt-3">
                <p className="text-text-secondary mb-1.5 flex items-center gap-1 text-[10px] font-bold">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="inline-flex">
                        <StickyNote className="h-3 w-3" />
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>Заметки по этапу</TooltipContent>
                  </Tooltip>
                  Заметки
                </p>
                <textarea
                  placeholder="Заметки по этапу..."
                  value={runtime.note?.content ?? ''}
                  onChange={(e) => updateNote(e.target.value)}
                  className="border-border-default min-h-[60px] w-full rounded border px-2 py-1.5 text-xs"
                />
              </div>

              {/* Задачи */}
              <div className="border-border-subtle border-t pt-3">
                <p className="text-text-secondary mb-1.5 flex items-center gap-1 text-[10px] font-bold">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="inline-flex">
                        <ListTodo className="h-3 w-3" />
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>Задачи по этапу</TooltipContent>
                  </Tooltip>
                  Задачи ({runtime.tasks.length})
                </p>
                <ul className="mb-2 space-y-1">
                  {runtime.tasks.map((t) => (
                    <li key={t.id} className="flex items-center gap-2 text-[11px]">
                      <input
                        type="checkbox"
                        checked={t.done}
                        onChange={() => toggleTask(t.id)}
                        className="rounded"
                      />
                      <span className={t.done ? 'text-text-secondary line-through' : ''}>
                        {t.title}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-5 px-1 text-[9px]"
                        onClick={() => removeTask(t.id)}
                      >
                        ×
                      </Button>
                    </li>
                  ))}
                </ul>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Добавить задачу..."
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addTask()}
                    className="border-border-default flex-1 rounded border px-2 py-1.5 text-xs"
                  />
                  <Button size="sm" className="h-8 text-[10px]" onClick={addTask}>
                    Добавить
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
