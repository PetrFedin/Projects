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
import {
  CheckCircle,
  Clock,
  CornerDownRight,
  AlertCircle,
  ArrowUp,
  ArrowDown,
  GitCommit,
  Paperclip,
  Send,
  Flame,
} from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import type { ChatMessage, TaskStatus, TaskPriority } from '@/lib/types';
import { cn } from '@/lib/utils';
import { cabinetSurface } from '@/lib/ui/cabinet-surface';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';

interface TaskDetailsDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  task: ChatMessage;
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
  critical: { label: 'Критический', icon: Flame, color: 'text-red-800' },
};

export function TaskDetailsDialog({ isOpen, onOpenChange, task }: TaskDetailsDialogProps) {
  const [newComment, setNewComment] = React.useState('');
  const [comments, setComments] = React.useState(task.comments || []);

  React.useEffect(() => {
    if (isOpen) {
      setComments(task.comments || []);
    }
  }, [isOpen, task.comments]);

  const handleAddComment = () => {
    if (newComment.trim()) {
      const newCommentObj = {
        user: 'Вы', // Placeholder for current user
        text: newComment.trim(),
        date: new Date().toISOString(),
      };
      setComments((prev) => [...prev, newCommentObj]);
      setNewComment('');
    }
  };

  const handleSaveChanges = () => {
    // In a real app, you would persist the new comments to the task object
    // For now, it's just local state management within the dialog
    task.comments = comments;
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-[70vh] max-w-2xl flex-col">
        <DialogHeader>
          <DialogTitle>Детали задачи</DialogTitle>
          <DialogDescription>{task.text}</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="discussion" className="flex min-h-0 flex-1 flex-col">
          {/* cabinetSurface v1 */}
          <TabsList className={cn(cabinetSurface.tabsList, 'w-full')}>
            <TabsTrigger
              value="discussion"
              className={cn(
                cabinetSurface.tabsTrigger,
                'h-9 flex-1 text-sm font-medium normal-case tracking-normal'
              )}
            >
              Обсуждение ({comments.length || 0})
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className={cn(
                cabinetSurface.tabsTrigger,
                'h-9 flex-1 text-sm font-medium normal-case tracking-normal'
              )}
            >
              История ({task.history?.length || 0})
            </TabsTrigger>
          </TabsList>
          <div className="min-h-0 flex-1 py-4">
            <ScrollArea className="-mr-6 h-full pr-4">
              <TabsContent value="discussion" className="mt-0 space-y-4">
                <div className="space-y-3">
                  {comments.map((comment, index) => (
                    <div key={index} className="rounded-md border p-2 text-sm">
                      <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
                        <span className="font-semibold">{comment.user}</span>
                        <span>
                          {format(new Date(comment.date), 'dd.MM.yy HH:mm', { locale: ru })}
                        </span>
                      </div>
                      <p>{comment.text}</p>
                    </div>
                  ))}
                  {(comments?.length || 0) === 0 && (
                    <p className="py-4 text-center text-sm text-muted-foreground">
                      Комментариев еще нет.
                    </p>
                  )}
                </div>
                <div className="flex gap-2 pt-4">
                  <Input
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Ваш комментарий..."
                  />
                  <Button variant="ghost" size="icon">
                    <Paperclip className="h-5 w-5" />
                  </Button>
                  <Button onClick={handleAddComment}>Отправить</Button>
                </div>
              </TabsContent>
              <TabsContent value="history" className="mt-0 space-y-3">
                {(task.history || []).map((h, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm">
                    <GitCommit className="mt-1 h-4 w-4 text-muted-foreground" />
                    <div>
                      <p>
                        <span className="font-semibold">{h.user}</span> {h.action}
                      </p>
                      {h.from && h.to && (
                        <p className="text-xs text-muted-foreground">
                          с "{h.from}" на "{h.to}"
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(h.date), "dd MMM yyyy 'в' HH:mm", { locale: ru })}
                      </p>
                    </div>
                  </div>
                ))}
                {(task.history?.length || 0) === 0 && (
                  <p className="py-4 text-center text-sm text-muted-foreground">
                    История изменений пуста.
                  </p>
                )}
              </TabsContent>
            </ScrollArea>
          </div>
        </Tabs>

        <DialogFooter className="border-t pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Закрыть
          </Button>
          <Button onClick={handleSaveChanges}>Сохранить изменения</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
