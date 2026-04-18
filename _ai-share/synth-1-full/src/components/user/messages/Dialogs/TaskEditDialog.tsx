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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Check, Eye, EyeOff, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { ChatMessage, TaskPriority, DeadlineExtension, TaskStatus } from '@/lib/types';
import { Switch } from '@/components/ui/switch';
import { Person } from '../types';
import { priorityConfig } from '../constants';
import { safeDate } from '../utils';

interface TaskEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: ChatMessage | null;
  currentUser: string;
  participants: Person[];
  onSave: (task: ChatMessage) => void;
}

export const TaskEditDialog: React.FC<TaskEditDialogProps> = ({
  open,
  onOpenChange,
  task,
  currentUser,
  participants,
  onSave,
}) => {
  const { toast } = useToast();
  const [text, setText] = React.useState('');
  const [priority, setPriority] = React.useState<TaskPriority>('medium');
  const [deadline, setDeadline] = React.useState<string>('');
  const [assignees, setAssignees] = React.useState<string[]>([]);
  const [widgetTags, setWidgetTags] = React.useState<string[]>([]);
  const [isPrivate, setIsPrivate] = React.useState(false);
  const [syncToCalendar, setSyncToCalendar] = React.useState(false);

  React.useEffect(() => {
    if (!open || !task) return;
    setText(String(task.text ?? ''));
    setPriority((task.priority as TaskPriority) ?? 'medium');
    setAssignees((task.assignees ?? []) || []);
    setWidgetTags(task.widgetTags || []);
    setIsPrivate(task.isPrivate || false);
    setSyncToCalendar(task.reminderData?.isSyncedWithCalendar ?? false);
    const d = task.deadline ? safeDate(task.deadline) : null;
    setDeadline(
      d
        ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
        : ''
    );
  }, [open, task]);

  if (!task) return null;
  const isAuthor = task.user === currentUser;
  const canEdit = true;

  function toggleAssignee(name: string) {
    if (!canEdit) return;
    setAssignees((prev) =>
      prev.includes(name) ? prev.filter((x) => x !== name) : [...prev, name]
    );
  }

  function save() {
    if (!task) return;
    if (!canEdit) {
      toast({
        title: 'Недостаточно прав',
        description: 'У вас нет прав для редактирования этой задачи.',
      });
      return;
    }

    const prevDeadline = task.deadline ? safeDate(task.deadline) : null;
    const nextDeadline = deadline ? new Date(`${deadline}T00:00:00`) : null;

    if (prevDeadline && nextDeadline && nextDeadline.getTime() < prevDeadline.getTime()) {
      toast({ title: 'Нельзя сократить срок', description: 'По правилам: только продление.' });
      return;
    }

    let extensions: DeadlineExtension[] = Array.isArray(task.deadlineExtensions)
      ? [...task.deadlineExtensions]
      : [];

    if (prevDeadline && nextDeadline && nextDeadline.getTime() > prevDeadline.getTime()) {
      extensions = [
        ...extensions,
        {
          at: Date.now(),
          by: currentUser,
          from: prevDeadline.toISOString().slice(0, 10),
          to: nextDeadline.toISOString().slice(0, 10),
        },
      ];
    }
    if (!prevDeadline && nextDeadline) {
      extensions = [
        ...extensions,
        {
          at: Date.now(),
          by: currentUser,
          from: null,
          to: nextDeadline.toISOString().slice(0, 10),
        },
      ];
    }

    const next: ChatMessage = {
      ...task,
      id: task.id ?? 0,
      type: 'task',
      text: text.trim() || '(без описания)',
      priority,
      status: (task.status ?? 'pending') as TaskStatus,
      assignees,
      isPrivate,
      deadline: nextDeadline ? nextDeadline : undefined,
      deadlineExtensions: extensions,
      widgetTags,
      reminderData: {
        ...(task.reminderData || {}),
        title: text.trim().slice(0, 50) || 'Задача',
        description: text.trim() || '',
        date: nextDeadline ? nextDeadline.toISOString().slice(0, 10) : '',
        time: '09:00',
        assignedTo: assignees,
        isSyncedWithCalendar: syncToCalendar,
        reminderType: 'exact_time' as const,
      } as any,
    };

    onSave(next);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
<<<<<<< HEAD
      <DialogContent className="max-w-2xl rounded-none border border-zinc-200 bg-white p-3 shadow-2xl">
        <DialogHeader className="mb-8 space-y-3 border-b border-zinc-100 pb-6">
          <DialogTitle className="text-base font-black uppercase tracking-tighter text-zinc-900">
            {task.id && typeof task.id === 'string' && task.id.startsWith('e_')
              ? 'NEW TASK'
              : 'EDIT TASK'}
          </DialogTitle>
          <DialogDescription className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
=======
      <DialogContent className="border-border-default max-w-2xl rounded-none border bg-white p-3 shadow-2xl">
        <DialogHeader className="border-border-subtle mb-8 space-y-3 border-b pb-6">
          <DialogTitle className="text-text-primary text-base font-black uppercase tracking-tighter">
            {String(task.id).startsWith('e_') ? 'NEW TASK' : 'EDIT TASK'}
          </DialogTitle>
          <DialogDescription className="text-text-muted text-[10px] font-black uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
            {isAuthor ? 'OPERATIONAL PARAMETERS SETUP' : 'TASK VIEW MODE'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-10">
          <div className="space-y-3">
<<<<<<< HEAD
            <Label className="text-[10px] font-black uppercase tracking-[0.2rem] text-zinc-400">
=======
            <Label className="text-text-muted text-[10px] font-black uppercase tracking-[0.2rem]">
>>>>>>> recover/cabinet-wip-from-stash
              DESCRIPTION
            </Label>
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
<<<<<<< HEAD
              className="min-h-[120px] rounded-none border-zinc-100 bg-[#FBFBFC] p-4 text-xs font-bold transition-all focus:border-black focus:ring-black"
=======
              className="border-border-subtle min-h-[120px] rounded-none bg-[#FBFBFC] p-4 text-xs font-bold transition-all focus:border-black focus:ring-black"
>>>>>>> recover/cabinet-wip-from-stash
              placeholder="ENTER TASK REQUIREMENTS..."
            />
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="space-y-4">
<<<<<<< HEAD
              <Label className="text-[10px] font-black uppercase tracking-[0.2rem] text-zinc-400">
=======
              <Label className="text-text-muted text-[10px] font-black uppercase tracking-[0.2rem]">
>>>>>>> recover/cabinet-wip-from-stash
                PRIORITY
              </Label>
              <div className="flex gap-2">
                {(['low', 'medium', 'high'] as TaskPriority[]).map((p) => (
                  <button
                    key={p}
                    className={cn(
                      'h-10 flex-1 border text-[9px] font-black uppercase tracking-widest transition-all',
                      priority === p
                        ? 'border-black bg-black text-white'
<<<<<<< HEAD
                        : 'border-zinc-200 bg-white text-zinc-400 hover:border-zinc-400'
=======
                        : 'border-border-default text-text-muted hover:border-border-default bg-white'
>>>>>>> recover/cabinet-wip-from-stash
                    )}
                    onClick={() => canEdit && setPriority(p)}
                    disabled={!canEdit}
                  >
                    {priorityConfig[p].label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
<<<<<<< HEAD
              <Label className="text-[10px] font-black uppercase tracking-[0.2rem] text-zinc-400">
=======
              <Label className="text-text-muted text-[10px] font-black uppercase tracking-[0.2rem]">
>>>>>>> recover/cabinet-wip-from-stash
                DEADLINE
              </Label>
              <Input
                type="date"
                value={deadline}
                onChange={(e) => canEdit && setDeadline(e.target.value)}
<<<<<<< HEAD
                className="h-10 rounded-none border-zinc-100 bg-[#FBFBFC] px-4 text-[10px] font-black uppercase tabular-nums"
=======
                className="border-border-subtle h-10 rounded-none bg-[#FBFBFC] px-4 text-[10px] font-black uppercase tabular-nums"
>>>>>>> recover/cabinet-wip-from-stash
                disabled={!canEdit}
              />
            </div>
          </div>

          <div className="space-y-4">
<<<<<<< HEAD
            <Label className="text-[10px] font-black uppercase tracking-[0.2rem] text-zinc-400">
=======
            <Label className="text-text-muted text-[10px] font-black uppercase tracking-[0.2rem]">
>>>>>>> recover/cabinet-wip-from-stash
              ANALYTICS & TOOLS (WIDGETS)
            </Label>
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'production_timeline', label: 'PRODUCTION' },
                { id: 'logistics_tracker', label: 'LOGISTICS' },
                { id: 'financial_health', label: 'FINANCE' },
                { id: 'inventory_health', label: 'STOCK' },
                { id: 'qc_summary', label: 'QUALITY' },
                { id: 'contract_status', label: 'CONTRACTS' },
                { id: 'risk_bar', label: 'RISK OS' },
              ].map((w) => (
                <button
                  key={w.id}
                  className={cn(
                    'rounded-none border px-4 py-2 text-[8px] font-black uppercase tracking-widest transition-all',
                    widgetTags.includes(w.id)
<<<<<<< HEAD
                      ? 'border-zinc-900 bg-zinc-900 text-white'
                      : 'border-zinc-200 bg-white text-zinc-400 hover:border-zinc-400'
=======
                      ? 'bg-text-primary border-text-primary text-white'
                      : 'text-text-muted border-border-default hover:border-border-default bg-white'
>>>>>>> recover/cabinet-wip-from-stash
                  )}
                  onClick={() =>
                    canEdit &&
                    setWidgetTags((prev) =>
                      prev.includes(w.id) ? prev.filter((x) => x !== w.id) : [...prev, w.id]
                    )
                  }
                >
                  {w.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
<<<<<<< HEAD
            <Label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2rem] text-zinc-400">
              <Calendar className="h-3.5 w-3.5" />
              КАЛЕНДАРЬ
            </Label>
            <div className="flex items-center justify-between rounded-lg border border-indigo-100 bg-indigo-50/50 p-4">
              <div className="space-y-0.5">
                <p className="text-[9px] font-black uppercase tracking-tight text-zinc-900">
                  Синхронизировать с календарём
                </p>
                <p className="text-[8px] font-bold text-zinc-500">
=======
            <Label className="text-text-muted flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2rem]">
              <Calendar className="h-3.5 w-3.5" />
              КАЛЕНДАРЬ
            </Label>
            <div className="bg-accent-primary/10 border-accent-primary/20 flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <p className="text-text-primary text-[9px] font-black uppercase tracking-tight">
                  Синхронизировать с календарём
                </p>
                <p className="text-text-secondary text-[8px] font-bold">
>>>>>>> recover/cabinet-wip-from-stash
                  Задача появится в календаре (слой Tasks) с дедлайном
                </p>
              </div>
              <Switch
                checked={syncToCalendar}
                onCheckedChange={setSyncToCalendar}
                disabled={!canEdit}
              />
            </div>
          </div>

          <div className="space-y-4">
<<<<<<< HEAD
            <Label className="flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2rem] text-zinc-400">
=======
            <Label className="text-text-muted flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2rem]">
>>>>>>> recover/cabinet-wip-from-stash
              PRIVACY & VISIBILITY
              <div className="flex items-center gap-2">
                {isPrivate ? (
                  <EyeOff className="h-3 w-3 text-rose-500" />
                ) : (
                  <Eye className="h-3 w-3 text-emerald-500" />
                )}
                <span
                  className={cn(
                    'text-[8px] font-black uppercase',
                    isPrivate ? 'text-rose-500' : 'text-emerald-500'
                  )}
                >
                  {isPrivate ? 'PRIVATE' : 'PUBLIC'}
                </span>
              </div>
            </Label>
<<<<<<< HEAD
            <div className="flex items-center justify-between border border-zinc-100 bg-zinc-50 p-4">
              <div className="space-y-0.5">
                <p className="text-[9px] font-black uppercase italic tracking-tight text-zinc-900">
                  Режим личных задач
                </p>
                <p className="text-[8px] font-bold uppercase text-zinc-400">
=======
            <div className="bg-bg-surface2 border-border-subtle flex items-center justify-between border p-4">
              <div className="space-y-0.5">
                <p className="text-text-primary text-[9px] font-black uppercase italic tracking-tight">
                  Режим личных задач
                </p>
                <p className="text-text-muted text-[8px] font-bold uppercase">
>>>>>>> recover/cabinet-wip-from-stash
                  If enabled, this task will be visible only to you.
                </p>
              </div>
              <Switch checked={isPrivate} onCheckedChange={setIsPrivate} disabled={!canEdit} />
            </div>
          </div>

          <div className="space-y-4">
<<<<<<< HEAD
            <Label className="text-[10px] font-black uppercase tracking-[0.2rem] text-zinc-400">
=======
            <Label className="text-text-muted text-[10px] font-black uppercase tracking-[0.2rem]">
>>>>>>> recover/cabinet-wip-from-stash
              ASSIGNED TEAM
            </Label>
            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
              {participants.map((p) => {
                const active = assignees.includes(p.name);
                return (
                  <button
                    key={p.id}
                    className={cn(
                      'flex h-12 items-center gap-3 border px-4 text-left transition-all',
                      active
<<<<<<< HEAD
                        ? 'border-zinc-900 bg-zinc-50 text-zinc-900'
                        : 'border-zinc-100 bg-white text-zinc-400 hover:border-zinc-300'
=======
                        ? 'bg-bg-surface2 border-text-primary text-text-primary'
                        : 'border-border-subtle text-text-muted hover:border-border-default bg-white'
>>>>>>> recover/cabinet-wip-from-stash
                    )}
                    onClick={() => canEdit && toggleAssignee(p.name)}
                    disabled={!canEdit}
                  >
<<<<<<< HEAD
                    <div className="flex h-6 w-6 items-center justify-center bg-zinc-100 text-[8px] font-black uppercase">
=======
                    <div className="bg-bg-surface2 flex h-6 w-6 items-center justify-center text-[8px] font-black uppercase">
>>>>>>> recover/cabinet-wip-from-stash
                      {p.name[0]}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-tighter">
                      {p.name}
                    </span>
                    {active && <Check className="ml-auto h-3 w-3 text-black" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

<<<<<<< HEAD
        <DialogFooter className="mt-12 gap-3 border-t border-zinc-100 pt-8">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="h-12 rounded-none px-10 text-[10px] font-black uppercase tracking-widest text-slate-400"
=======
        <DialogFooter className="border-border-subtle mt-12 gap-3 border-t pt-8">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="text-text-muted h-12 rounded-none px-10 text-[10px] font-black uppercase tracking-widest"
>>>>>>> recover/cabinet-wip-from-stash
          >
            CANCEL
          </Button>
          <Button
            onClick={save}
<<<<<<< HEAD
            className="h-12 rounded-none bg-zinc-900 px-14 text-[10px] font-black uppercase tracking-[0.2rem] text-white shadow-2xl hover:bg-black"
=======
            className="bg-text-primary h-12 rounded-none px-14 text-[10px] font-black uppercase tracking-[0.2rem] text-white shadow-2xl hover:bg-black"
>>>>>>> recover/cabinet-wip-from-stash
          >
            SAVE OPERATIONAL DATA
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
