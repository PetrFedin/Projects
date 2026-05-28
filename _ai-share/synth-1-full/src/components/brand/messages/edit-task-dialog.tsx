'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Calendar as CalendarIcon, PlusCircle, Trash2, Paperclip } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Combobox, type ComboboxOption } from '@/components/ui/combobox';
import type { ChatMessage, TaskPriority, TaskStatus, TaskSubtask } from '@/lib/types';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

interface EditTaskDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  task: ChatMessage;
  participants: ComboboxOption[];
  onSave: (task: ChatMessage) => void;
  onDelete: (taskId: number) => void;
}

const priorityOptions: { value: TaskPriority; label: string }[] = [
  { value: 'low', label: 'Низкий' },
  { value: 'medium', label: 'Средний' },
  { value: 'high', label: 'Высокий' },
];

const statusOptions: { value: TaskStatus; label: string }[] = [
  { value: 'pending', label: 'Ожидает' },
  { value: 'in_progress', label: 'В работе' },
  { value: 'done', label: 'Выполнено' },
];

export function EditTaskDialog({
  isOpen,
  onOpenChange,
  task,
  participants,
  onSave,
  onDelete,
}: EditTaskDialogProps) {
  const [text, setText] = useState(task.text);
  const [assignees, setAssignees] = useState(task.assignees || []);
  const [deadline, setDeadline] = useState<Date | undefined>(
    task.deadline ? new Date(task.deadline) : undefined
  );
  const [priority, setPriority] = useState<TaskPriority>(task.priority || 'medium');
  const [status, setStatus] = useState<TaskStatus>(task.status || 'pending');
  const [subtasks, setSubtasks] = useState<TaskSubtask[]>(task.subtasks || []);

  useEffect(() => {
    if (task) {
      setText(task.text);
      setAssignees(task.assignees || []);
      setDeadline(task.deadline ? new Date(task.deadline) : undefined);
      setPriority(task.priority || 'medium');
      setStatus(task.status || 'pending');
      setSubtasks(task.subtasks || []);
    }
  }, [task]);

  const handleSave = () => {
    const history = [...(task.history || [])];
    const now = new Date().toISOString();
    const user = 'Вы'; // Placeholder for the current user

    // Text change
    if (text !== task.text) {
      history.push({ user, action: 'изменил(а) описание задачи', date: now });
    }
    // Status change
    if (status !== task.status) {
      history.push({
        user,
        action: 'изменил(а) статус',
        date: now,
        from: statusOptions.find((s) => s.value === task.status)?.label,
        to: statusOptions.find((s) => s.value === status)?.label,
      });
    }
    // Priority change
    if (priority !== task.priority) {
      history.push({
        user,
        action: 'изменил(а) приоритет',
        date: now,
        from: priorityOptions.find((p) => p.value === task.priority)?.label,
        to: priorityOptions.find((p) => p.value === priority)?.label,
      });
    }
    // Deadline change
    const oldDeadline = task.deadline
      ? new Date(task.deadline).toISOString().split('T')[0]
      : undefined;
    const newDeadline = deadline ? deadline.toISOString().split('T')[0] : undefined;
    if (oldDeadline !== newDeadline) {
      history.push({
        user,
        action: 'изменил(а) срок',
        date: now,
        from: oldDeadline ? format(new Date(oldDeadline), 'PPP', { locale: ru }) : 'нет',
        to: newDeadline ? format(new Date(newDeadline), 'PPP', { locale: ru }) : 'нет',
      });
    }

    // Assignees change
    const oldAssignees = new Set(task.assignees || []);
    const newAssignees = new Set(assignees);
    const addedAssignees = assignees.filter((a) => !oldAssignees.has(a));
    const removedAssignees = (task.assignees || []).filter((a) => !newAssignees.has(a));
    if (addedAssignees.length > 0) {
      history.push({
        user,
        action: `добавил(а) исполнителей: ${addedAssignees.join(', ')}`,
        date: now,
      });
    }
    if (removedAssignees.length > 0) {
      history.push({
        user,
        action: `удалил(а) исполнителей: ${removedAssignees.join(', ')}`,
        date: now,
      });
    }

    // Subtasks change
    const oldSubtasks = new Map((task.subtasks || []).map((st) => [st.id, st]));
    const newSubtasks = new Map(subtasks.map((st) => [st.id, st]));

    newSubtasks.forEach((newSub, id) => {
      const oldSub = oldSubtasks.get(id);
      if (!oldSub) {
        history.push({ user, action: `добавил(а) подзадачу: "${newSub.text}"`, date: now });
      } else {
        if (oldSub.text !== newSub.text)
          history.push({
            user,
            action: `изменил(а) текст подзадачи c "${oldSub.text}" на "${newSub.text}"`,
            date: now,
          });
        if (oldSub.assignee !== newSub.assignee)
          history.push({
            user,
            action: `изменил(а) исполнителя подзадачи "${newSub.text}"`,
            date: now,
            from: oldSub.assignee || 'нет',
            to: newSub.assignee || 'нет',
          });
        if (oldSub.status !== newSub.status)
          history.push({
            user,
            action: `изменил(а) статус подзадачи "${newSub.text}"`,
            date: now,
            from: statusOptions.find((s) => s.value === oldSub.status)?.label,
            to: statusOptions.find((s) => s.value === newSub.status)?.label,
          });
      }
    });
    oldSubtasks.forEach((oldSub, id) => {
      if (!newSubtasks.has(id)) {
        history.push({ user, action: `удалил(а) подзадачу: "${oldSub.text}"`, date: now });
      }
    });

    onSave({
      ...task,
      text,
      assignees,
      deadline,
      priority,
      status,
      subtasks,
      history,
    });
  };

  const addSubtask = () => {
    setSubtasks((prev) => [
      ...prev,
      { id: `new-sub-${Date.now()}`, text: '', assignee: '', status: 'pending' },
    ]);
  };
  const removeSubtask = (index: number) => {
    setSubtasks((prev) => prev.filter((_, i) => i !== index));
  };
  const updateSubtask = (index: number, field: 'text' | 'assignee' | 'status', value: string) => {
    setSubtasks((prev) => {
      const newSubtasks = [...prev];
      (newSubtasks[index] as any)[field] = value;
      return newSubtasks;
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Редактировать задачу</DialogTitle>
        </DialogHeader>

        <div className="max-h-[60vh] space-y-4 overflow-y-auto py-4 pr-4">
          <div className="space-y-2">
            <Label htmlFor="task-text">Описание задачи</Label>
            <Textarea
              id="task-text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Например, 'Подготовить отчет по продажам за Q3'"
            />
          </div>

          <div className="space-y-2">
            <Label>Подзадачи</Label>
            <div className="space-y-2">
              {subtasks.map((sub, index) => (
                <div key={sub.id} className="flex items-center gap-2">
                  <Select
                    value={sub.status}
                    onValueChange={(v) => updateSubtask(index, 'status', v)}
                  >
                    <SelectTrigger className="h-8 w-[150px] text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((s) => (
                        <SelectItem key={s.value} value={s.value}>
                          {s.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    value={sub.text}
                    onChange={(e) => updateSubtask(index, 'text', e.target.value)}
                    placeholder={`Подзадача ${index + 1}`}
                    className="h-8"
                  />
                  <Select
                    value={sub.assignee}
                    onValueChange={(v) => updateSubtask(index, 'assignee', v)}
                  >
                    <SelectTrigger className="h-8 w-[180px] text-xs">
                      <SelectValue placeholder="Исполнитель..." />
                    </SelectTrigger>
                    <SelectContent>
                      {participants.map((p) => (
                        <SelectItem key={p.value} value={p.value}>
                          {p.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => removeSubtask(index)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
            <Button variant="outline" size="sm" onClick={addSubtask} className="mt-2">
              <PlusCircle className="mr-2 h-4 w-4" /> Добавить подзадачу
            </Button>
          </div>

          <div className="space-y-2">
            <Label>Исполнители</Label>
            <Combobox
              options={participants}
              multiple
              value={assignees}
              onChange={(v) => setAssignees(v as string[])}
              placeholder="Выберите исполнителей..."
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Срок</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !deadline && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {deadline ? (
                      format(deadline, 'PPP', { locale: ru })
                    ) : (
                      <span>Выберите дату</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={deadline} onSelect={setDeadline} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label>Приоритет</Label>
              <Select value={priority} onValueChange={(v) => setPriority(v as TaskPriority)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {priorityOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Статус</Label>
            <Select value={status} onValueChange={(v) => setStatus(v as TaskStatus)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Вложения</Label>
            <Button variant="outline" type="button">
              <Paperclip className="mr-2 h-4 w-4" />
              Прикрепить файл
            </Button>
          </div>
        </div>

        <DialogFooter className="justify-between border-t pt-4">
          <Button variant="destructive" onClick={() => onDelete(task.id)}>
            Удалить
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Отмена
            </Button>
            <Button onClick={handleSave}>Сохранить</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
