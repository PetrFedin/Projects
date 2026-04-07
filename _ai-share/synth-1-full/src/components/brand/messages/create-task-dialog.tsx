
'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Calendar as CalendarIcon, PlusCircle, Trash2, Paperclip } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Combobox, type ComboboxOption } from '@/components/ui/combobox';
import type { ChatMessage, TaskPriority, TaskSubtask } from '@/lib/types';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

interface CreateTaskDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  participants: ComboboxOption[];
  onCreate: (taskData: Omit<ChatMessage, 'id' | 'user' | 'time' | 'type'>) => void;
}

const priorityOptions: { value: TaskPriority; label: string }[] = [
    {value: 'low', label: 'Низкий'},
    {value: 'medium', label: 'Средний'},
    {value: 'high', label: 'Высокий'},
];

export function CreateTaskDialog({ isOpen, onOpenChange, participants, onCreate }: CreateTaskDialogProps) {
    const [text, setText] = useState('');
    const [assignees, setAssignees] = useState<string[]>([]);
    const [deadline, setDeadline] = useState<Date | undefined>();
    const [priority, setPriority] = useState<TaskPriority>('medium');
    const [subtasks, setSubtasks] = useState<{ text: string, assignee: string }[]>([]);

    useEffect(() => {
        if (isOpen) {
            setText('');
            setAssignees([]);
            setDeadline(undefined);
            setPriority('medium');
            setSubtasks([]);
        }
    }, [isOpen]);

    const handleCreate = () => {
        onCreate({
            text,
            assignees,
            deadline,
            priority,
            status: 'pending',
            subtasks: subtasks.map((st, i) => ({...st, id: `sub-${Date.now()}-${i}`, status: 'pending'}))
        });
    };

    const addSubtask = () => {
        setSubtasks(prev => [...prev, { text: '', assignee: '' }]);
    };
    const removeSubtask = (index: number) => {
        setSubtasks(prev => prev.filter((_, i) => i !== index));
    }
    const updateSubtask = (index: number, field: 'text' | 'assignee', value: string) => {
        setSubtasks(prev => {
            const newSubtasks = [...prev];
            newSubtasks[index][field] = value;
            return newSubtasks;
        });
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Новая задача</DialogTitle>
                    <DialogDescription>
                        Создайте новую задачу для участников этого чата.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-4 max-h-[60vh] overflow-y-auto pr-4">
                    <div className="space-y-2">
                        <Label htmlFor="task-text">Описание задачи</Label>
                        <Textarea id="task-text" value={text} onChange={(e) => setText(e.target.value)} placeholder="Например, 'Подготовить отчет по продажам за Q3'" />
                    </div>
                    <div className="space-y-2">
                        <Label>Подзадачи</Label>
                        <div className="space-y-2">
                            {subtasks.map((sub, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <Input value={sub.text} onChange={(e) => updateSubtask(index, 'text', e.target.value)} placeholder={`Подзадача ${index + 1}`} className="h-8"/>
                                    <Select value={sub.assignee} onValueChange={(v) => updateSubtask(index, 'assignee', v)}>
                                        <SelectTrigger className="w-[180px] h-8 text-xs"><SelectValue placeholder="Исполнитель..." /></SelectTrigger>
                                        <SelectContent>{participants.map(p => <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>)}</SelectContent>
                                    </Select>
                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => removeSubtask(index)}><Trash2 className="h-4 w-4 text-destructive"/></Button>
                                </div>
                            ))}
                        </div>
                        <Button variant="outline" size="sm" onClick={addSubtask} className="mt-2"><PlusCircle className="mr-2 h-4 w-4"/> Добавить подзадачу</Button>
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
                                    <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !deadline && "text-muted-foreground")}>
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {deadline ? format(deadline, "PPP", { locale: ru }) : <span>Выберите дату</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={deadline} onSelect={setDeadline} initialFocus/></PopoverContent>
                            </Popover>
                        </div>
                        <div className="space-y-2">
                            <Label>Приоритет</Label>
                            <Select value={priority} onValueChange={(v) => setPriority(v as TaskPriority)}>
                                <SelectTrigger><SelectValue/></SelectTrigger>
                                <SelectContent>
                                    {priorityOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                     <div className="space-y-2">
                        <Label>Вложения</Label>
                        <Button variant="outline" type="button"><Paperclip className="mr-2 h-4 w-4" />Прикрепить файл</Button>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Отмена</Button>
                    <Button onClick={handleCreate} disabled={!text.trim()}>Создать задачу</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
