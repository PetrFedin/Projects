'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
<<<<<<< HEAD
import { CheckCircle, Clock, CornerDownRight, AlertCircle, ArrowUp, ArrowDown } from 'lucide-react';
=======
import {
  CheckCircle,
  Clock,
  CornerDownRight,
  AlertCircle,
  ArrowUp,
  ArrowDown,
  Flame,
} from 'lucide-react';
>>>>>>> recover/cabinet-wip-from-stash
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import type { ChatMessage, TaskStatus, TaskPriority } from '@/lib/types';
import { cn } from '@/lib/utils';
import { cabinetSurface } from '@/lib/ui/cabinet-surface';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ChatTaskListDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  tasks: ChatMessage[];
  onTaskStatusChange: (taskId: number, newStatus: TaskStatus) => void;
  onTaskClick: (task: ChatMessage) => void;
}

const statusConfig: Record<TaskStatus, { label: string; icon: React.ElementType; color: string }> =
  {
    pending: { label: 'Ожидает', icon: Clock, color: 'text-amber-600' },
    in_progress: { label: 'В работе', icon: Clock, color: 'text-blue-600' },
    done: { label: 'Выполнено', icon: CheckCircle, color: 'text-green-600' },
  };

const priorityConfig: Record<
  TaskPriority,
  { label: string; icon: React.ElementType; color: string }
> = {
  low: { label: 'Низкий', icon: ArrowDown, color: 'text-gray-500' },
  medium: { label: 'Средний', icon: ArrowUp, color: 'text-amber-600' },
  high: { label: 'Высокий', icon: AlertCircle, color: 'text-red-600' },
<<<<<<< HEAD
=======
  critical: { label: 'Критический', icon: Flame, color: 'text-red-800' },
>>>>>>> recover/cabinet-wip-from-stash
};

function TaskBoard({
  tasks = [],
  onTaskStatusChange,
  onTaskClick,
}: {
  tasks?: ChatMessage[];
  onTaskStatusChange: (taskId: number, newStatus: TaskStatus) => void;
  onTaskClick: (task: ChatMessage) => void;
}) {
  const columns: Record<TaskStatus, ChatMessage[]> = {
    pending: tasks.filter((t) => t.status === 'pending'),
    in_progress: tasks.filter((t) => t.status === 'in_progress'),
    done: tasks.filter((t) => t.status === 'done'),
  };

  const handleDragStart = (e: React.DragEvent, taskId: number) => {
    e.dataTransfer.setData('taskId', taskId.toString());
  };

  const handleDrop = (e: React.DragEvent, newStatus: TaskStatus) => {
    e.preventDefault();
    const taskId = parseInt(e.dataTransfer.getData('taskId'));
    onTaskStatusChange(taskId, newStatus);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
      {Object.entries(columns).map(([status, tasksInColumn]) => (
        <div
          key={status}
          onDrop={(e) => handleDrop(e, status as TaskStatus)}
          onDragOver={handleDragOver}
          className="rounded-lg bg-muted/50"
        >
          <CardHeader>
            <CardTitle className="text-base">
              {statusConfig[status as TaskStatus].label} ({tasksInColumn.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="min-h-[200px] space-y-2">
            {tasksInColumn.map((task) => (
              <div
                key={task.id}
                draggable
                onDragStart={(e) => handleDragStart(e, task.id)}
                className="cursor-grab rounded-lg border bg-background p-3 shadow-sm"
                onClick={() => onTaskClick(task)}
              >
                <p className="text-sm font-semibold">{task.text}</p>
                {task.subtasks && task.subtasks.length > 0 && (
                  <div className="mt-2 space-y-1 border-t pt-2">
                    {task.subtasks.map((sub) => {
                      const subStatus = statusConfig[sub.status] ?? statusConfig.pending;
                      const SubIcon = subStatus.icon;
                      return (
                        <div
                          key={sub.id}
                          className="flex items-center gap-2 text-xs text-muted-foreground"
                        >
                          <SubIcon className={cn('h-3.5 w-3.5', subStatus.color)} />
                          <span className={cn(sub.status === 'done' && 'line-through')}>
                            {sub.text}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
                <div className="mt-2 flex items-center justify-between">
                  {task.deadline && (
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(task.deadline), 'd MMM', { locale: ru })}
                    </p>
                  )}
                  <div className="ml-auto flex items-center -space-x-2">
                    {(task.assignees || []).map((assignee) => (
                      <Avatar key={assignee} className="h-5 w-5 border-2 border-background">
                        <AvatarFallback className="text-[10px]">
                          {assignee.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                </div>
              </div>
            ))}
            {tasksInColumn.length === 0 && (
              <p className="py-4 text-center text-xs text-muted-foreground">Нет задач</p>
            )}
          </CardContent>
        </div>
      ))}
    </div>
  );
}

export function ChatTaskListDialog({
  isOpen,
  onOpenChange,
  tasks = [],
  onTaskStatusChange,
  onTaskClick,
}: ChatTaskListDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-[80vh] max-w-4xl flex-col">
        <DialogHeader>
          <DialogTitle>Задачи в этом чате</DialogTitle>
          <DialogDescription>Список всех задач, созданных в текущем обсуждении.</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="board" className="flex min-h-0 flex-1 flex-col">
<<<<<<< HEAD
          <TabsList>
            <TabsTrigger value="list">Список</TabsTrigger>
            <TabsTrigger value="board">Доска</TabsTrigger>
=======
          {/* cabinetSurface v1 */}
          <TabsList className={cn(cabinetSurface.tabsList, 'h-auto min-w-0')}>
            <TabsTrigger
              value="list"
              className={cn(
                cabinetSurface.tabsTrigger,
                'text-xs font-semibold normal-case tracking-normal'
              )}
            >
              Список
            </TabsTrigger>
            <TabsTrigger
              value="board"
              className={cn(
                cabinetSurface.tabsTrigger,
                'text-xs font-semibold normal-case tracking-normal'
              )}
            >
              Доска
            </TabsTrigger>
>>>>>>> recover/cabinet-wip-from-stash
          </TabsList>

          <div className="min-h-0 flex-1 py-4">
            <ScrollArea className="-mr-6 h-full pr-4">
              <TabsContent value="list" className="mt-0">
                <TooltipProvider>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Задача</TableHead>
                        <TableHead>Исполнители</TableHead>
                        <TableHead>Срок</TableHead>
                        <TableHead>Приоритет</TableHead>
                        <TableHead>Статус</TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {tasks && tasks.length > 0 ? (
                        tasks.map((task) => {
                          const st = task.status ? statusConfig[task.status] : statusConfig.pending;
                          const Icon = st.icon;
                          const pr = task.priority ? priorityConfig[task.priority] : undefined;
<<<<<<< HEAD
                          const PriorityIcon = pr?.icon;
=======
                          const PriorityIconCmp = pr?.icon;
>>>>>>> recover/cabinet-wip-from-stash

                          return (
                            <React.Fragment key={task.id}>
                              <TableRow
                                className="cursor-pointer hover:bg-muted"
                                onClick={() => onTaskClick(task)}
                              >
                                <TableCell className="max-w-[250px] truncate font-medium">
                                  {task.text}
                                </TableCell>

                                <TableCell>
                                  <div className="flex items-center -space-x-2">
                                    {(task.assignees ?? []).slice(0, 3).map((assignee) => (
                                      <Avatar
                                        key={assignee}
                                        className="h-6 w-6 border-2 border-background"
                                      >
                                        <AvatarFallback className="text-xs">
                                          {assignee.charAt(0)}
                                        </AvatarFallback>
                                      </Avatar>
                                    ))}
                                    {(task.assignees?.length ?? 0) > 3 && (
                                      <span className="pl-3 text-xs text-muted-foreground">
                                        +{(task.assignees?.length ?? 0) - 3}
                                      </span>
                                    )}
                                  </div>
                                </TableCell>

                                <TableCell>
                                  {task.deadline
                                    ? format(
                                        task.deadline instanceof Date
                                          ? task.deadline
                                          : new Date(task.deadline),
                                        'd MMM yyyy',
                                        { locale: ru }
                                      )
                                    : 'Бессрочно'}
                                </TableCell>

                                <TableCell>
<<<<<<< HEAD
                                  {pr && (
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <div className={cn('flex items-center gap-1', pr.color)}>
                                          <PriorityIcon className="h-4 w-4" />
=======
                                  {pr && PriorityIconCmp && (
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <div className={cn('flex items-center gap-1', pr.color)}>
                                          <PriorityIconCmp className="h-4 w-4" />
>>>>>>> recover/cabinet-wip-from-stash
                                        </div>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>{pr.label} приоритет</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  )}
                                </TableCell>

                                <TableCell>
                                  {st && (
                                    <Badge
                                      variant="outline"
                                      className={`border-current/30 flex w-fit items-center gap-1.5 ${st.color}`}
                                    >
                                      {Icon && <Icon className="h-3 w-3" />}
                                      {st.label}
                                    </Badge>
                                  )}
                                </TableCell>
                              </TableRow>

                              {(task.subtasks ?? []).map((subtask) => {
                                const s = statusConfig[subtask.status] ?? statusConfig.pending;
                                const SubIcon = s.icon;

                                return (
                                  <TableRow key={subtask.id} className="bg-muted/50">
                                    <TableCell className="flex items-center gap-2 pl-8 text-muted-foreground">
                                      <CornerDownRight className="h-4 w-4" />
                                      {subtask.text}
                                    </TableCell>

                                    <TableCell>
                                      <div className="flex items-center gap-2">
                                        <Avatar className="h-6 w-6">
                                          <AvatarFallback className="text-xs">
                                            {subtask.assignee?.charAt(0) ?? '?'}
                                          </AvatarFallback>
                                        </Avatar>
                                        <span className="text-xs">{subtask.assignee}</span>
                                      </div>
                                    </TableCell>

                                    <TableCell colSpan={2} />

                                    <TableCell>
                                      <Badge
                                        variant="outline"
                                        className={`border-current/30 flex w-fit items-center gap-1.5 ${s.color}`}
                                      >
                                        {SubIcon && <SubIcon className="h-3 w-3" />}
                                        {s.label}
                                      </Badge>
                                    </TableCell>
                                  </TableRow>
                                );
                              })}
                            </React.Fragment>
                          );
                        })
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                            В этом чате еще нет задач.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TooltipProvider>
              </TabsContent>
              <TabsContent value="board" className="mt-0">
                <TaskBoard
                  tasks={tasks}
                  onTaskStatusChange={onTaskStatusChange}
                  onTaskClick={onTaskClick}
                />
              </TabsContent>
            </ScrollArea>
          </div>
        </Tabs>

        <DialogFooter className="border-t pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Закрыть
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
