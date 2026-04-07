import React from 'react';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Check, Eye, EyeOff, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { ChatMessage, TaskPriority, DeadlineExtension } from '@/lib/types';
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
  onSave
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
    setSyncToCalendar((task.reminderData?.isSyncedWithCalendar) ?? false);
    const d = task.deadline ? safeDate(task.deadline) : null;
    setDeadline(d ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}` : '');
  }, [open, task]);

  if (!task) return null;
  const isAuthor = task.user === currentUser;
  const canEdit = true; 

  function toggleAssignee(name: string) {
    if (!canEdit) return;
    setAssignees((prev) => (prev.includes(name) ? prev.filter((x) => x !== name) : [...prev, name]));
  }

  function save() {
    if (!canEdit) {
      toast({ title: 'Недостаточно прав', description: 'У вас нет прав для редактирования этой задачи.' });
      return;
    }

    const prevDeadline = task.deadline ? safeDate(task.deadline) : null;
    const nextDeadline = deadline ? new Date(`${deadline}T00:00:00`) : null;

    if (prevDeadline && nextDeadline && nextDeadline.getTime() < prevDeadline.getTime()) {
      toast({ title: 'Нельзя сократить срок', description: 'По правилам: только продление.' });
      return;
    }

    let extensions: DeadlineExtension[] = (task.deadlineExtensions ?? []) as any;
    if (!Array.isArray(extensions)) extensions = [];

    if (prevDeadline && nextDeadline && nextDeadline.getTime() > prevDeadline.getTime()) {
      extensions = [...extensions, { at: Date.now(), by: currentUser, from: prevDeadline.toISOString().slice(0, 10), to: nextDeadline.toISOString().slice(0, 10) }];
    }
    if (!prevDeadline && nextDeadline) {
      extensions = [...extensions, { at: Date.now(), by: currentUser, from: null, to: nextDeadline.toISOString().slice(0, 10) }];
    }

    const next: ChatMessage = {
      ...task,
      type: 'task',
      text: text.trim() || '(без описания)',
      priority,
      status: (task.status ?? 'pending') as any,
      assignees,
      isPrivate,
      deadline: nextDeadline ? nextDeadline : undefined,
      deadlineExtensions: extensions as any,
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
      <DialogContent className="max-w-2xl bg-white rounded-none border border-zinc-200 shadow-2xl p-3">
        <DialogHeader className="space-y-3 mb-8 border-b border-zinc-100 pb-6">
          <DialogTitle className="text-base font-black tracking-tighter text-zinc-900 uppercase">
            {task.id && typeof task.id === 'string' && task.id.startsWith('e_') ? 'NEW TASK' : 'EDIT TASK'}
          </DialogTitle>
          <DialogDescription className="text-zinc-400 font-black text-[10px] uppercase tracking-widest">
            {isAuthor ? 'OPERATIONAL PARAMETERS SETUP' : 'TASK VIEW MODE'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-10">
          <div className="space-y-3">
            <Label className="text-[10px] font-black uppercase tracking-[0.2rem] text-zinc-400">DESCRIPTION</Label>
            <Textarea 
              value={text} 
              onChange={(e) => setText(e.target.value)} 
              className="bg-[#FBFBFC] border-zinc-100 rounded-none min-h-[120px] font-bold text-xs p-4 focus:ring-black focus:border-black transition-all" 
              placeholder="ENTER TASK REQUIREMENTS..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-4">
              <Label className="text-[10px] font-black uppercase tracking-[0.2rem] text-zinc-400">PRIORITY</Label>
              <div className="flex gap-2">
                {(['low', 'medium', 'high'] as TaskPriority[]).map((p) => (
                  <button
                    key={p}
                    className={cn(
                      "flex-1 h-10 text-[9px] font-black uppercase tracking-widest transition-all border",
                      priority === p ? "bg-black text-white border-black" : "bg-white border-zinc-200 text-zinc-400 hover:border-zinc-400"
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
              <Label className="text-[10px] font-black uppercase tracking-[0.2rem] text-zinc-400">DEADLINE</Label>
              <Input
                type="date"
                value={deadline}
                onChange={(e) => canEdit && setDeadline(e.target.value)}
                className="bg-[#FBFBFC] border-zinc-100 rounded-none h-10 font-black text-[10px] px-4 tabular-nums uppercase"
                disabled={!canEdit}
              />
            </div>
          </div>

          <div className="space-y-4">
            <Label className="text-[10px] font-black uppercase tracking-[0.2rem] text-zinc-400">ANALYTICS & TOOLS (WIDGETS)</Label>
            <div className="flex gap-2 flex-wrap">
              {[
                { id: 'production_timeline', label: 'PRODUCTION' },
                { id: 'logistics_tracker', label: 'LOGISTICS' },
                { id: 'financial_health', label: 'FINANCE' },
                { id: 'inventory_health', label: 'STOCK' },
                { id: 'qc_summary', label: 'QUALITY' },
                { id: 'contract_status', label: 'CONTRACTS' },
                { id: 'risk_bar', label: 'RISK OS' },
              ].map(w => (
                <button
                  key={w.id}
                  className={cn(
                    "px-4 py-2 border rounded-none text-[8px] font-black uppercase tracking-widest transition-all",
                    widgetTags.includes(w.id) ? "bg-zinc-900 text-white border-zinc-900" : "bg-white text-zinc-400 border-zinc-200 hover:border-zinc-400"
                  )}
                  onClick={() => canEdit && setWidgetTags(prev => prev.includes(w.id) ? prev.filter(x => x !== w.id) : [...prev, w.id])}
                >
                  {w.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <Label className="text-[10px] font-black uppercase tracking-[0.2rem] text-zinc-400 flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5" />
              КАЛЕНДАРЬ
            </Label>
            <div className="flex items-center justify-between p-4 bg-indigo-50/50 border border-indigo-100 rounded-lg">
              <div className="space-y-0.5">
                <p className="text-[9px] font-black uppercase tracking-tight text-zinc-900">Синхронизировать с календарём</p>
                <p className="text-[8px] text-zinc-500 font-bold">Задача появится в календаре (слой Tasks) с дедлайном</p>
              </div>
              <Switch checked={syncToCalendar} onCheckedChange={setSyncToCalendar} disabled={!canEdit} />
            </div>
          </div>

          <div className="space-y-4">
            <Label className="text-[10px] font-black uppercase tracking-[0.2rem] text-zinc-400 flex items-center justify-between">
              PRIVACY & VISIBILITY
              <div className="flex items-center gap-2">
                {isPrivate ? <EyeOff className="h-3 w-3 text-rose-500" /> : <Eye className="h-3 w-3 text-emerald-500" />}
                <span className={cn("text-[8px] font-black uppercase", isPrivate ? "text-rose-500" : "text-emerald-500")}>
                  {isPrivate ? 'PRIVATE' : 'PUBLIC'}
                </span>
              </div>
            </Label>
            <div className="flex items-center justify-between p-4 bg-zinc-50 border border-zinc-100">
              <div className="space-y-0.5">
                <p className="text-[9px] font-black uppercase tracking-tight text-zinc-900 italic">Режим личных задач</p>
                <p className="text-[8px] text-zinc-400 font-bold uppercase">If enabled, this task will be visible only to you.</p>
              </div>
              <Switch checked={isPrivate} onCheckedChange={setIsPrivate} disabled={!canEdit} />
            </div>
          </div>

          <div className="space-y-4">
            <Label className="text-[10px] font-black uppercase tracking-[0.2rem] text-zinc-400">ASSIGNED TEAM</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {participants.map((p) => {
                const active = assignees.includes(p.name);
                return (
                  <button
                    key={p.id}
                    className={cn(
                      "flex items-center gap-3 h-12 px-4 border transition-all text-left",
                      active ? "bg-zinc-50 border-zinc-900 text-zinc-900" : "bg-white border-zinc-100 text-zinc-400 hover:border-zinc-300"
                    )}
                    onClick={() => canEdit && toggleAssignee(p.name)}
                    disabled={!canEdit}
                  >
                    <div className="h-6 w-6 bg-zinc-100 text-[8px] font-black flex items-center justify-center uppercase">{p.name[0]}</div>
                    <span className="text-[10px] font-black uppercase tracking-tighter">{p.name}</span>
                    {active && <Check className="h-3 w-3 ml-auto text-black" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <DialogFooter className="mt-12 pt-8 border-t border-zinc-100 gap-3">
          <Button variant="ghost" onClick={() => onOpenChange(false)} className="rounded-none h-12 px-10 font-black text-[10px] uppercase text-slate-400 tracking-widest">CANCEL</Button>
          <Button onClick={save} className="bg-zinc-900 text-white hover:bg-black rounded-none h-12 px-14 font-black text-[10px] uppercase tracking-[0.2rem] shadow-2xl">SAVE OPERATIONAL DATA</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
