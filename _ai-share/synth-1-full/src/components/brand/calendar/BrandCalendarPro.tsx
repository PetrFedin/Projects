'use client';

/**
 * BrandCalendarPro - Updated: 2026-01-08
 * Version: 2.0 "Operational Strategy OS"
 * Дизайн полностью синхронизирован с остальными Pro-разделами.
 * Особенности: Lifecycle Tracking, Strategic Milestones, Content Overlay, Ghost Planning.
 */
import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Bot,
  Sparkles,
  Zap,
  Flame,
  Target,
  Box,
  ShoppingBag,
  FileText,
  TrendingUp,
  Users,
  MapPin,
  Globe,
  ShieldCheck,
  Signal,
  Clock,
  Filter,
  Maximize2,
  Layers,
  Package,
  Newspaper,
  MessageSquareText,
  Megaphone,
  Truck,
  Factory,
  History,
  Palette,
  Share2,
  Scale,
  Banknote,
  Award,
  Eye,
  Check,
  X,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  parseISO,
} from 'date-fns';
import { ru } from 'date-fns/locale';
import { useAuth } from '@/providers/auth-provider';

const MOCK_EVENTS = [
  {
    date: new Date(2026, 0, 10),
    title: 'SS26 Content Launch',
    type: 'blog',
    category: 'Marketing',
    color: 'blue',
  },
  {
    date: new Date(2026, 0, 15),
    title: 'Production Deadline: Outerwear',
    type: 'factory',
    category: 'Supply Chain',
    color: 'amber',
  },
  {
    date: new Date(2026, 0, 20),
    title: 'Paris Fashion Week Show',
    type: 'event',
    category: 'PR',
    color: 'fuchsia',
  },
  {
    date: new Date(2026, 0, 25),
    title: 'B2B Pre-Order Closes',
    type: 'b2b',
    category: 'Sales',
    color: 'emerald',
  },
  {
    date: new Date(2026, 0, 12),
    title: 'Стратегия: открытие штаба в Москве',
    type: 'goal',
    category: 'Strategy',
    color: 'slate',
  },
];

export default function BrandCalendarPro() {
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 1));
  const [mounted, setMounted] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');

  // Multi-dimensional filters
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>([]);
  const [selectedTask, setSelectedTask] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const team = user?.team || [];
  const tasks = user?.tasks || [];

  // Extract unique values for filters
  const departments = useMemo(
    () => Array.from(new Set(team.map((m) => m.department).filter(Boolean))) as string[],
    [team]
  );
  const roles = useMemo(() => Array.from(new Set(team.map((m) => m.role))) as string[], [team]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const assignee = team.find((m) => m.id === task.assigneeId);
      if (!assignee) return false;

      const depMatch =
        selectedDepartments.length === 0 ||
        (task.department && selectedDepartments.includes(task.department));
      const roleMatch = selectedRoles.length === 0 || selectedRoles.includes(assignee.role);
      const assigneeMatch =
        selectedAssignees.length === 0 || selectedAssignees.includes(task.assigneeId);

      return depMatch && roleMatch && assigneeMatch;
    });
  }, [tasks, team, selectedDepartments, selectedRoles, selectedAssignees]);

  const days = useMemo(() => {
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);
    return eachDayOfInterval({ start, end });
  }, [currentDate]);

  if (!mounted) return null;

  return (
    <div className="container mx-auto flex h-[calc(100vh-2rem)] max-w-5xl flex-col space-y-4 px-4 py-4 pb-24 duration-700 animate-in fade-in">
      {/* --- TOP BAR: STRATEGIC CONTROLS --- */}
      <div className="flex shrink-0 flex-col items-start justify-between gap-3 border-b border-slate-100 pb-3 md:flex-row md:items-end">
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
            <CalendarIcon className="h-2.5 w-2.5" />
            <span>Intelligence</span>
            <ChevronRight className="h-2 w-2 opacity-50" />
            <span className="text-slate-300">Strategy OS Calendar</span>
          </div>
          <div className="flex items-center gap-2.5">
            <h1 className="font-headline text-base font-bold uppercase leading-none tracking-tighter text-slate-900">
              Operational Map 2.0
            </h1>
            <Badge
              variant="outline"
              className="h-4 gap-1 border-fuchsia-100 bg-fuchsia-50 px-1.5 text-[7px] font-bold uppercase tracking-widest text-fuchsia-600 shadow-sm transition-all"
            >
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-fuchsia-500" /> LIVE SYNC
            </Badge>
          </div>
        </div>

        <div className="flex w-full items-center gap-2 md:w-auto">
          <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-100 p-1 shadow-inner">
            <div className="flex rounded-lg border border-slate-200 bg-white p-0.5 shadow-sm">
              {['Timeline', 'Month', 'Quarter', 'Year'].map((v) => (
                <button
                  key={v}
                  className={cn(
                    'h-6 rounded-md px-3 text-[9px] font-bold uppercase tracking-widest transition-all',
                    v === 'Month'
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'text-slate-400 hover:bg-slate-50 hover:text-slate-900'
                  )}
                >
                  {v}
                </button>
              ))}
            </div>
            <Button className="h-7 gap-1.5 rounded-lg border border-slate-900 bg-slate-900 px-4 text-[9px] font-bold uppercase tracking-widest text-white shadow-lg transition-all hover:bg-indigo-600">
              <Plus className="h-3.5 w-3.5" /> Schedule Launch
            </Button>
          </div>
        </div>
      </div>

      <div className="grid flex-1 grid-cols-1 gap-3 overflow-hidden xl:grid-cols-12">
        {/* --- MAIN CALENDAR AREA --- */}
        <div className="flex min-h-0 flex-col xl:col-span-9">
          <Card className="flex flex-1 flex-col overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm transition-all hover:border-indigo-100/50">
            <CardHeader className="shrink-0 border-b border-slate-50 bg-slate-50/50 p-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h3 className="text-base font-bold uppercase italic leading-none tracking-tighter text-slate-900">
                    {format(currentDate, 'LLLL yyyy', { locale: ru })}
                  </h3>
                  <div className="flex gap-1.5">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setCurrentDate(subMonths(currentDate, 1))}
                      className="h-7 w-7 rounded-lg border border-slate-200 bg-white shadow-sm transition-all hover:bg-slate-50"
                    >
                      <ChevronLeft className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setCurrentDate(addMonths(currentDate, 1))}
                      className="h-7 w-7 rounded-lg border border-slate-200 bg-white shadow-sm transition-all hover:bg-slate-50"
                    >
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
                <div className="no-scrollbar flex gap-1 overflow-x-auto pb-1">
                  {['All', 'Marketing', 'Supply Chain', 'Strategy', 'PR', 'Sales'].map((f) => (
                    <button
                      key={f}
                      onClick={() => setActiveFilter(f)}
                      className={cn(
                        'h-6 shrink-0 rounded-md border px-3 text-[8px] font-bold uppercase tracking-widest transition-all',
                        activeFilter === f
                          ? 'border-slate-900 bg-slate-900 text-white shadow-sm'
                          : 'border-slate-200 bg-white text-slate-400 hover:border-slate-300'
                      )}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>
            </CardHeader>

            <div className="flex-1 overflow-auto">
              <div className="grid h-full grid-cols-7 gap-px bg-slate-100">
                {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((d) => (
                  <div
                    key={d}
                    className="border-b border-slate-100 bg-slate-50 py-1.5 text-center text-[8px] font-bold uppercase tracking-[0.2em] text-slate-400"
                  >
                    {d}
                  </div>
                ))}
                {days.map((day, i) => {
                  const dayEvents = MOCK_EVENTS.filter(
                    (e) =>
                      isSameDay(e.date, day) &&
                      (activeFilter === 'All' || e.category === activeFilter)
                  );
                  const dayTasks = filteredTasks.filter((t) => isSameDay(parseISO(t.date), day));
                  const workload = dayTasks.length;

                  return (
                    <div
                      key={i}
                      className={cn(
                        'group relative min-h-[100px] cursor-pointer border-b border-r border-slate-100 bg-white p-2 transition-all hover:bg-slate-50/50',
                        !isSameMonth(day, currentDate) &&
                          'pointer-events-none bg-slate-50/30 opacity-40'
                      )}
                    >
                      <div className="mb-1.5 flex items-start justify-between">
                        <span
                          className={cn(
                            'text-sm font-bold tabular-nums leading-none transition-colors',
                            isSameDay(day, new Date())
                              ? 'text-indigo-600'
                              : 'text-slate-900 group-hover:text-slate-400'
                          )}
                        >
                          {format(day, 'd')}
                        </span>
                        {workload > 0 && (
                          <div className="flex h-3.5 items-center gap-1 rounded bg-slate-900 px-1.5 text-[7px] font-bold uppercase tracking-widest text-white shadow-sm">
                            <Zap className="h-2 w-2 text-indigo-400" />
                            {workload}
                          </div>
                        )}
                      </div>

                      <div className="space-y-1 overflow-hidden">
                        {dayEvents.map((e, idx) => (
                          <div
                            key={idx}
                            className={cn(
                              'truncate rounded border-l-2 px-1.5 py-1 text-[7px] font-bold uppercase tracking-tight shadow-sm',
                              `bg-${e.color}-50 text-${e.color}-600 border-${e.color}-500/50`
                            )}
                          >
                            {e.title}
                          </div>
                        ))}

                        {dayTasks.map((t, idx) => {
                          const assignee = team.find((m) => m.id === t.assigneeId);
                          return (
                            <div
                              key={`task-${idx}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedTask(t);
                              }}
                              className={cn(
                                'truncate rounded border-l-2 border-slate-900 bg-slate-50 px-1.5 py-1 text-[7px] font-bold uppercase tracking-tight text-slate-900 shadow-sm transition-all hover:scale-[1.02] active:scale-95',
                                t.priority === 'high' && 'border-l-rose-500',
                                t.priority === 'medium' && 'border-l-amber-500'
                              )}
                            >
                              <div className="flex items-center justify-between gap-1.5">
                                <span className="truncate">{t.title}</span>
                                {assignee && (
                                  <img
                                    src={assignee.avatar}
                                    className="h-3 w-3 shrink-0 rounded-full border border-white object-cover shadow-sm"
                                  />
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {workload > 3 && (
                        <div className="absolute bottom-1 left-1 right-1 h-0.5 overflow-hidden rounded-full bg-slate-100">
                          <div className="h-full bg-rose-500" style={{ width: '100%' }} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>
        </div>

        {/* --- RIGHT SIDEBAR: INTELLIGENCE & SYNC --- */}
        <div className="no-scrollbar h-full space-y-4 overflow-y-auto pb-4 xl:col-span-3">
          {/* Team Filter & Load OS */}
          <Card className="space-y-4 overflow-hidden rounded-xl border border-slate-100 bg-white p-4 shadow-sm transition-all hover:border-indigo-100">
            <div className="flex items-center justify-between border-b border-slate-50 pb-2.5">
              <h3 className="text-[10px] font-bold uppercase italic tracking-widest text-slate-700">
                Filter Matrix OS
              </h3>
              <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            </div>

            {/* Assignee Filter */}
            <div className="space-y-2.5">
              <p className="text-[8px] font-bold uppercase leading-none tracking-widest text-slate-400">
                Assignees
              </p>
              <div className="flex flex-wrap gap-1.5">
                {team.map((member) => (
                  <button
                    key={member.id}
                    onClick={() => {
                      setSelectedAssignees((prev) =>
                        prev.includes(member.id)
                          ? prev.filter((id) => id !== member.id)
                          : [...prev, member.id]
                      );
                    }}
                    className={cn(
                      'relative h-8 w-8 overflow-hidden rounded-lg border-2 shadow-sm transition-all',
                      selectedAssignees.includes(member.id)
                        ? 'border-indigo-600 ring-2 ring-indigo-50'
                        : 'border-transparent opacity-40 grayscale hover:opacity-100'
                    )}
                  >
                    <img
                      src={member.avatar}
                      alt={member.firstName}
                      className="h-full w-full object-cover"
                    />
                    {selectedAssignees.includes(member.id) && (
                      <div className="absolute inset-0 flex items-center justify-center bg-indigo-600/20">
                        <Check className="h-3 w-3 stroke-[4] text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Department Filter */}
            <div className="space-y-2.5">
              <p className="text-[8px] font-bold uppercase leading-none tracking-widest text-slate-400">
                Departments
              </p>
              <div className="flex flex-wrap gap-1">
                {departments.map((dep) => (
                  <button
                    key={dep}
                    onClick={() => {
                      setSelectedDepartments((prev) =>
                        prev.includes(dep) ? prev.filter((d) => d !== dep) : [...prev, dep]
                      );
                    }}
                    className={cn(
                      'rounded-md border px-2 py-1 text-[7px] font-bold uppercase tracking-widest shadow-sm transition-all',
                      selectedDepartments.includes(dep)
                        ? 'border-slate-900 bg-slate-900 text-white'
                        : 'border-slate-100 bg-white text-slate-400 hover:border-slate-200'
                    )}
                  >
                    {dep}
                  </button>
                ))}
              </div>
            </div>

            <Button
              variant="ghost"
              className="h-7 w-full rounded-lg border border-slate-100 text-[8px] font-bold uppercase tracking-widest text-slate-400 transition-all hover:text-indigo-600"
              onClick={() => {
                setSelectedAssignees([]);
                setSelectedDepartments([]);
                setSelectedRoles([]);
              }}
            >
              Reset Matrix
            </Button>
          </Card>

          {/* AI Planner Assistant */}
          <Card className="group relative space-y-4 overflow-hidden rounded-xl border border-slate-800 bg-slate-900 p-4 text-white shadow-lg">
            <div className="relative z-10 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-indigo-500 bg-indigo-600 text-white shadow-lg transition-transform group-hover:scale-105">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-bold uppercase leading-none tracking-[0.2em] text-indigo-300">
                      Intelligence AI
                    </span>
                    <p className="text-[11px] font-bold uppercase tracking-tight">Strategy Sync</p>
                  </div>
                </div>
                <Sparkles className="h-4 w-4 animate-pulse text-indigo-400" />
              </div>
              <div className="space-y-3">
                <p className="text-[10px] font-bold uppercase italic leading-relaxed tracking-tight text-slate-300 opacity-80">
                  "Conflict detected: PFW (Jan 20) overlaps with B2B pre-orders. Recommend: Extend
                  pre-order window by 3 days for max ROI."
                </p>
                <Button className="h-8 w-full rounded-lg bg-white text-[9px] font-bold uppercase tracking-widest text-slate-900 shadow-xl transition-all hover:bg-indigo-50 hover:text-indigo-600">
                  Apply Optimization
                </Button>
              </div>
            </div>
            <Flame className="absolute -bottom-8 -right-8 h-24 w-24 text-indigo-600 opacity-5 transition-all duration-700 group-hover:scale-110" />
          </Card>

          {/* Content-to-Product Bridge */}
          <Card className="group space-y-4 rounded-xl border border-slate-100 bg-white p-4 shadow-sm transition-all hover:border-indigo-100">
            <h3 className="flex items-center gap-2 border-b border-slate-50 px-1 pb-2.5 text-[10px] font-bold uppercase italic tracking-widest text-slate-700">
              <Layers className="h-3.5 w-3.5 text-indigo-600" /> Lifecycle Bridge
            </h3>
            <div className="space-y-4 px-1">
              {[
                {
                  label: 'SS26 Outerwear',
                  status: 'Production',
                  progress: 65,
                  color: 'bg-amber-500',
                },
                {
                  label: 'SS26 Knitwear',
                  status: 'In Design',
                  progress: 30,
                  color: 'bg-indigo-500',
                },
                { label: 'Techwear Drops', status: 'Ready', progress: 95, color: 'bg-emerald-500' },
              ].map((item, i) => (
                <div key={i} className="group/item cursor-pointer space-y-1.5">
                  <div className="flex items-end justify-between">
                    <div className="min-w-0 space-y-0.5">
                      <p className="mb-1 truncate text-[10px] font-bold uppercase leading-none text-slate-900 transition-colors group-hover/item:text-indigo-600">
                        {item.label}
                      </p>
                      <p className="text-[8px] font-bold uppercase leading-none tracking-widest text-slate-400 opacity-60">
                        {item.status}
                      </p>
                    </div>
                    <span className="mb-0.5 text-[9px] font-bold tabular-nums leading-none text-slate-900">
                      {item.progress}%
                    </span>
                  </div>
                  <div className="h-1 w-full overflow-hidden rounded-full border border-slate-50 bg-slate-50 shadow-inner">
                    <div
                      className={cn('h-full transition-all duration-1000', item.color)}
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <Button
              variant="outline"
              className="flex h-8 w-full items-center justify-center gap-1.5 rounded-lg border border-slate-200 text-[9px] font-bold uppercase tracking-widest text-slate-400 shadow-sm transition-all hover:border-slate-900 hover:bg-slate-900 hover:text-white"
            >
              Master Timeline <ChevronRight className="h-3 w-3" />
            </Button>
          </Card>
        </div>
      </div>

      {/* Task Detail Dialog */}
      <Dialog open={!!selectedTask} onOpenChange={() => setSelectedTask(null)}>
        <DialogContent className="max-w-md overflow-hidden rounded-xl border-none bg-white p-3 shadow-2xl">
          <div className="absolute left-0 top-0 h-1.5 w-full bg-slate-100">
            <div
              className={cn(
                'h-full transition-all duration-500',
                selectedTask?.priority === 'high'
                  ? 'w-full bg-rose-500'
                  : selectedTask?.priority === 'medium'
                    ? 'w-2/3 bg-amber-500'
                    : 'w-1/3 bg-blue-500'
              )}
            />
          </div>

          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Badge
                  className={cn(
                    'rounded-md border-none px-2 py-0.5 text-[8px] font-black uppercase tracking-widest',
                    selectedTask?.priority === 'high'
                      ? 'bg-rose-50 text-rose-600'
                      : selectedTask?.priority === 'medium'
                        ? 'bg-amber-50 text-amber-600'
                        : 'bg-blue-50 text-blue-600'
                  )}
                >
                  {selectedTask?.priority} Priority
                </Badge>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">
                  Matrix Task ID: #{selectedTask?.id}
                </span>
              </div>
              <h2 className="text-base font-black uppercase leading-none tracking-tighter text-slate-900">
                {selectedTask?.title}
              </h2>
              <p className="text-xs font-bold uppercase italic tracking-widest text-slate-400">
                {selectedTask?.department}
              </p>
            </div>

            <div className="space-y-4 rounded-xl bg-slate-50 p-4">
              <p className="text-sm font-medium leading-relaxed text-slate-600">
                {selectedTask?.description}
              </p>
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                <Clock className="h-3 w-3" />
                {selectedTask &&
                  format(parseISO(selectedTask.date), 'dd MMMM yyyy', { locale: ru })}
              </div>
            </div>

            <div className="flex items-center gap-3 border-t border-slate-50 pt-6">
              <div className="h-10 w-10 shrink-0 overflow-hidden rounded-2xl border-2 border-white shadow-lg">
                <img
                  src={team.find((m) => m.id === selectedTask?.assigneeId)?.avatar}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <p className="mb-1 text-[8px] font-black uppercase tracking-widest text-slate-400">
                  Исполнитель
                </p>
                <p className="text-sm font-black uppercase text-slate-900">
                  {team.find((m) => m.id === selectedTask?.assigneeId)?.firstName}{' '}
                  {team.find((m) => m.id === selectedTask?.assigneeId)?.lastName}
                </p>
                <p className="text-[10px] font-bold uppercase tracking-tight text-indigo-500">
                  @{team.find((m) => m.id === selectedTask?.assigneeId)?.nickname}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-4">
              <Button
                onClick={() => setSelectedTask(null)}
                className="h-10 rounded-2xl bg-black text-xs font-black uppercase tracking-widest text-white shadow-xl transition-all hover:scale-[1.02] active:scale-95"
              >
                <Check className="mr-2 h-4 w-4" /> Принято
              </Button>
              <Button
                variant="ghost"
                onClick={() => setSelectedTask(null)}
                className="h-10 rounded-2xl border border-slate-100 text-xs font-black uppercase tracking-widest text-slate-400"
              >
                Закрыть
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
