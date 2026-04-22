
'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, CornerDownRight, AlertCircle, ArrowUp, ArrowDown, ShieldAlert } from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { ChatMessage, TaskStatus, TaskPriority } from '@/lib/types';
import { cn } from '@/lib/utils';
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

const statusConfig: Record<
  TaskStatus,
  { label: string; icon: React.ElementType; color: string }
> = {
  pending: { label: 'Ожидает', icon: Clock,      color: 'text-amber-600' },
  in_progress: { label: 'В работе', icon: Clock, color: 'text-blue-600' },
  done: { label: 'Выполнено', icon: CheckCircle, color: 'text-green-600' },
};

const priorityConfig: Record<TaskPriority, { label: string; icon: React.ElementType; color: string }> = {
    low: { label: 'Низкий', icon: ArrowDown, color: 'text-gray-500' },
    medium: { label: 'Средний', icon: ArrowUp, color: 'text-amber-600' },
    high: { label: 'Высокий', icon: AlertCircle, color: 'text-red-600' },
    critical: { label: 'Критический', icon: ShieldAlert, color: 'text-red-700' },
};

function TaskBoard({ tasks = [], onTaskStatusChange, onTaskClick }: { tasks?: ChatMessage[], onTaskStatusChange: (taskId: number, newStatus: TaskStatus) => void, onTaskClick: (task: ChatMessage) => void }) {
    const columns: Record<TaskStatus, ChatMessage[]> = {
        pending: tasks.filter(t => t.status === 'pending'),
        in_progress: tasks.filter(t => t.status === 'in_progress'),
        done: tasks.filter(t => t.status === 'done'),
    };

    const handleDragStart = (e: React.DragEvent, taskId: number) => {
        e.dataTransfer.setData("taskId", taskId.toString());
    };
    
    const handleDrop = (e: React.DragEvent, newStatus: TaskStatus) => {
        e.preventDefault();
        const taskId = parseInt(e.dataTransfer.getData("taskId"));
        onTaskStatusChange(taskId, newStatus);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {Object.entries(columns).map(([status, tasksInColumn]) => (
                <div 
                    key={status}
                    onDrop={(e) => handleDrop(e, status as TaskStatus)}
                    onDragOver={handleDragOver}
                    className="bg-muted/50 rounded-lg"
                >
                    <CardHeader>
                        <CardTitle className="text-base">{statusConfig[status as TaskStatus].label} ({tasksInColumn.length})</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 min-h-[200px]">
                        {tasksInColumn.map(task => (
                             <div 
                                key={task.id} 
                                draggable 
                                onDragStart={(e) => handleDragStart(e, task.id)}
                                className="p-3 border rounded-lg bg-background shadow-sm cursor-grab"
                                onClick={() => onTaskClick(task)}
                            >
                                <p className="font-semibold text-sm">{task.text}</p>
                                {task.subtasks && task.subtasks.length > 0 && (
                                    <div className="mt-2 pt-2 border-t space-y-1">
                                        {task.subtasks.map(sub => {
                                             const subStatus = statusConfig[sub.status] ?? statusConfig.pending;
                                             const SubIcon = subStatus.icon;
                                             return (
                                                 <div key={sub.id} className="flex items-center gap-2 text-xs text-muted-foreground">
                                                     <SubIcon className={cn("h-3.5 w-3.5", subStatus.color)} />
                                                     <span className={cn(sub.status === 'done' && 'line-through')}>{sub.text}</span>
                                                 </div>
                                             )
                                        })}
                                    </div>
                                )}
                                <div className="flex items-center justify-between mt-2">
                                     {task.deadline && (
                                        <p className="text-xs text-muted-foreground">
                                            {format(new Date(task.deadline), 'd MMM', { locale: ru })}
                                        </p>
                                    )}
                                     <div className="flex items-center -space-x-2 ml-auto">
                                        {(task.assignees || []).map((assignee) => (
                                            <Avatar key={assignee} className="h-5 w-5 border-2 border-background">
                                                <AvatarFallback className="text-[10px]">{assignee.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                         {tasksInColumn.length === 0 && <p className="text-xs text-muted-foreground text-center py-4">Нет задач</p>}
                    </CardContent>
                </div>
            ))}
        </div>
    );
}

export function ChatTaskListDialog({ isOpen, onOpenChange, tasks = [], onTaskStatusChange, onTaskClick }: ChatTaskListDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Задачи в этом чате</DialogTitle>
          <DialogDescription>Список всех задач, созданных в текущем обсуждении.</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="board" className="flex-1 min-h-0 flex flex-col">
          <TabsList>
            <TabsTrigger value="list">Список</TabsTrigger>
            <TabsTrigger value="board">Доска</TabsTrigger>
          </TabsList>
          
          <div className="flex-1 min-h-0 py-4">
             <ScrollArea className="h-full pr-4 -mr-6">
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
                            {(tasks && tasks.length > 0) ? (
                                tasks.map((task) => {
                                const st = task.status ? statusConfig[task.status] : statusConfig.pending;
                                const Icon = st.icon;
                                const pr = task.priority ? priorityConfig[task.priority] : undefined;
                                const PriorityIcon = pr?.icon ?? null;

                                return (
                                    <React.Fragment key={task.id}>
                                    <TableRow className="cursor-pointer hover:bg-muted" onClick={() => onTaskClick(task)}>
                                        <TableCell className="font-medium max-w-[250px] truncate">
                                        {task.text}
                                        </TableCell>

                                        <TableCell>
                                        <div className="flex items-center -space-x-2">
                                            {(task.assignees ?? []).slice(0, 3).map((assignee) => (
                                            <Avatar key={assignee} className="h-6 w-6 border-2 border-background">
                                                <AvatarFallback className="text-xs">
                                                {assignee.charAt(0)}
                                                </AvatarFallback>
                                            </Avatar>
                                            ))}
                                            {(task.assignees?.length ?? 0) > 3 && (
                                            <span className="text-xs pl-3 text-muted-foreground">
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
                                            {pr && PriorityIcon && (
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <div className={cn("flex items-center gap-1", pr.color)}>
                                                        <PriorityIcon className="h-4 w-4" />
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
                                            className={`flex w-fit items-center gap-1.5 border-current/30 ${st.color}`}
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
                                            <TableCell className="pl-8 text-muted-foreground flex items-center gap-2">
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
                                                className={`flex w-fit items-center gap-1.5 border-current/30 ${s.color}`}
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
                                <TableCell colSpan={5} className="text-center text-muted-foreground h-24">
                                    В этом чате еще нет задач.
                                </TableCell>
                                </TableRow>
                            )}
                            </TableBody>
                        </Table>
                    </TooltipProvider>
                </TabsContent>
                <TabsContent value="board" className="mt-0">
                    <TaskBoard tasks={tasks} onTaskStatusChange={onTaskStatusChange} onTaskClick={onTaskClick} />
                </TabsContent>
            </ScrollArea>
          </div>
        </Tabs>

        <DialogFooter className="pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Закрыть
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
