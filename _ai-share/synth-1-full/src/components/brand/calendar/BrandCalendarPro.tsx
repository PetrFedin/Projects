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
<<<<<<< HEAD
=======
import { RegistryPageShell } from '@/components/design-system';
import { cabinetSurface } from '@/lib/ui/cabinet-surface';
>>>>>>> recover/cabinet-wip-from-stash
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
    title: 'Strategic Goal: Milan HQ Opening',
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
<<<<<<< HEAD
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
=======
    <RegistryPageShell className="flex h-[calc(100vh-2rem)] max-w-5xl flex-col space-y-4 pb-16 duration-700 animate-in fade-in">
      {/* --- TOP BAR: STRATEGIC CONTROLS --- */}
      <div className="border-border-subtle flex shrink-0 flex-col items-start justify-between gap-3 border-b pb-3 md:flex-row md:items-end">
        <div className="space-y-0.5">
          <div className="text-text-muted flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.2em]">
            <CalendarIcon className="h-2.5 w-2.5" />
            <span>Intelligence</span>
            <ChevronRight className="h-2 w-2 opacity-50" />
            <span className="text-text-muted">Strategy OS Calendar</span>
          </div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-text-primary font-headline text-base font-bold uppercase leading-none tracking-tighter">
>>>>>>> recover/cabinet-wip-from-stash
              Operational Map 2.0
            </h1>
            <Badge
              variant="outline"
<<<<<<< HEAD
              className="h-4 gap-1 border-fuchsia-100 bg-fuchsia-50 px-1.5 text-[7px] font-bold uppercase tracking-widest text-fuchsia-600 shadow-sm transition-all"
            >
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-fuchsia-500" /> LIVE SYNC
=======
              className="bg-accent-primary/10 text-accent-primary border-accent-primary/20 h-4 gap-1 px-1.5 text-[7px] font-bold uppercase tracking-widest shadow-sm transition-all"
            >
              <span className="bg-accent-primary/100 h-1.5 w-1.5 animate-pulse rounded-full" /> LIVE
              SYNC
>>>>>>> recover/cabinet-wip-from-stash
            </Badge>
          </div>
        </div>

<<<<<<< HEAD
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
=======
        <div className="flex w-full flex-wrap items-center gap-2 md:w-auto">
          {/* cabinetSurface v1 — сегмент вида календаря отдельно от CTA */}
          <div
            className={cn(
              cabinetSurface.groupTabList,
              'h-auto min-h-9 flex-wrap items-center gap-0.5'
            )}
          >
            {['Timeline', 'Month', 'Quarter', 'Year'].map((v) => (
              <button
                key={v}
                type="button"
                className={cn(
                  cabinetSurface.groupTabButton,
                  'h-6 px-3 py-0 text-[9px]',
                  v === 'Month'
                    ? 'bg-text-primary text-white shadow-sm'
                    : 'text-text-muted hover:bg-bg-surface2 hover:text-text-primary'
                )}
              >
                {v}
              </button>
            ))}
          </div>
          <Button className="bg-text-primary hover:bg-accent-primary border-text-primary h-7 gap-1.5 rounded-lg border px-4 text-[9px] font-bold uppercase tracking-widest text-white shadow-lg transition-all">
            <Plus className="h-3.5 w-3.5" /> Schedule Launch
          </Button>
>>>>>>> recover/cabinet-wip-from-stash
        </div>
      </div>

      <div className="grid flex-1 grid-cols-1 gap-3 overflow-hidden xl:grid-cols-12">
        {/* --- MAIN CALENDAR AREA --- */}
        <div className="flex min-h-0 flex-col xl:col-span-9">
<<<<<<< HEAD
          <Card className="flex flex-1 flex-col overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm transition-all hover:border-indigo-100/50">
            <CardHeader className="shrink-0 border-b border-slate-50 bg-slate-50/50 p-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h3 className="text-base font-bold uppercase italic leading-none tracking-tighter text-slate-900">
=======
          <Card className="border-border-subtle hover:border-accent-primary/20 flex flex-1 flex-col overflow-hidden rounded-xl border bg-white shadow-sm transition-all">
            <CardHeader className="border-border-subtle bg-bg-surface2/80 shrink-0 border-b p-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h3 className="text-text-primary text-base font-bold uppercase italic leading-none tracking-tighter">
>>>>>>> recover/cabinet-wip-from-stash
                    {format(currentDate, 'LLLL yyyy', { locale: ru })}
                  </h3>
                  <div className="flex gap-1.5">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setCurrentDate(subMonths(currentDate, 1))}
<<<<<<< HEAD
                      className="h-7 w-7 rounded-lg border border-slate-200 bg-white shadow-sm transition-all hover:bg-slate-50"
=======
                      className="border-border-default hover:bg-bg-surface2 h-7 w-7 rounded-lg border bg-white shadow-sm transition-all"
>>>>>>> recover/cabinet-wip-from-stash
                    >
                      <ChevronLeft className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setCurrentDate(addMonths(currentDate, 1))}
<<<<<<< HEAD
                      className="h-7 w-7 rounded-lg border border-slate-200 bg-white shadow-sm transition-all hover:bg-slate-50"
=======
                      className="border-border-default hover:bg-bg-surface2 h-7 w-7 rounded-lg border bg-white shadow-sm transition-all"
>>>>>>> recover/cabinet-wip-from-stash
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
<<<<<<< HEAD
                          ? 'border-slate-900 bg-slate-900 text-white shadow-sm'
                          : 'border-slate-200 bg-white text-slate-400 hover:border-slate-300'
=======
                          ? 'bg-text-primary border-text-primary text-white shadow-sm'
                          : 'text-text-muted border-border-default hover:border-border-default bg-white'
>>>>>>> recover/cabinet-wip-from-stash
                      )}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>
            </CardHeader>

            <div className="flex-1 overflow-auto">
<<<<<<< HEAD
              <div className="grid h-full grid-cols-7 gap-px bg-slate-100">
                {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((d) => (
                  <div
                    key={d}
                    className="border-b border-slate-100 bg-slate-50 py-1.5 text-center text-[8px] font-bold uppercase tracking-[0.2em] text-slate-400"
=======
              <div className="bg-bg-surface2 grid h-full grid-cols-7 gap-px">
                {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((d) => (
                  <div
                    key={d}
                    className="bg-bg-surface2 text-text-muted border-border-subtle border-b py-1.5 text-center text-[8px] font-bold uppercase tracking-[0.2em]"
>>>>>>> recover/cabinet-wip-from-stash
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
<<<<<<< HEAD
                        'group relative min-h-[100px] cursor-pointer border-b border-r border-slate-100 bg-white p-2 transition-all hover:bg-slate-50/50',
                        !isSameMonth(day, currentDate) &&
                          'pointer-events-none bg-slate-50/30 opacity-40'
=======
                        'hover:bg-bg-surface2/80 border-border-subtle group relative min-h-[100px] cursor-pointer border-b border-r bg-white p-2 transition-all',
                        !isSameMonth(day, currentDate) &&
                          'bg-bg-surface2/30 pointer-events-none opacity-40'
>>>>>>> recover/cabinet-wip-from-stash
                      )}
                    >
                      <div className="mb-1.5 flex items-start justify-between">
                        <span
                          className={cn(
                            'text-sm font-bold tabular-nums leading-none transition-colors',
                            isSameDay(day, new Date())
<<<<<<< HEAD
                              ? 'text-indigo-600'
                              : 'text-slate-900 group-hover:text-slate-400'
=======
                              ? 'text-accent-primary'
                              : 'text-text-primary group-hover:text-text-muted'
>>>>>>> recover/cabinet-wip-from-stash
                          )}
                        >
                          {format(day, 'd')}
                        </span>
                        {workload > 0 && (
<<<<<<< HEAD
                          <div className="flex h-3.5 items-center gap-1 rounded bg-slate-900 px-1.5 text-[7px] font-bold uppercase tracking-widest text-white shadow-sm">
                            <Zap className="h-2 w-2 text-indigo-400" />
=======
                          <div className="bg-text-primary flex h-3.5 items-center gap-1 rounded px-1.5 text-[7px] font-bold uppercase tracking-widest text-white shadow-sm">
                            <Zap className="text-accent-primary h-2 w-2" />
>>>>>>> recover/cabinet-wip-from-stash
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
<<<<<<< HEAD
                                'truncate rounded border-l-2 border-slate-900 bg-slate-50 px-1.5 py-1 text-[7px] font-bold uppercase tracking-tight text-slate-900 shadow-sm transition-all hover:scale-[1.02] active:scale-95',
=======
                                'bg-bg-surface2 text-text-primary border-text-primary truncate rounded border-l-2 px-1.5 py-1 text-[7px] font-bold uppercase tracking-tight shadow-sm transition-all hover:scale-[1.02] active:scale-95',
>>>>>>> recover/cabinet-wip-from-stash
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
<<<<<<< HEAD
                        <div className="absolute bottom-1 left-1 right-1 h-0.5 overflow-hidden rounded-full bg-slate-100">
=======
                        <div className="bg-bg-surface2 absolute bottom-1 left-1 right-1 h-0.5 overflow-hidden rounded-full">
>>>>>>> recover/cabinet-wip-from-stash
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
<<<<<<< HEAD
          <Card className="space-y-4 overflow-hidden rounded-xl border border-slate-100 bg-white p-4 shadow-sm transition-all hover:border-indigo-100">
            <div className="flex items-center justify-between border-b border-slate-50 pb-2.5">
              <h3 className="text-[10px] font-bold uppercase italic tracking-widest text-slate-700">
=======
          <Card className="border-border-subtle hover:border-accent-primary/20 space-y-4 overflow-hidden rounded-xl border bg-white p-4 shadow-sm transition-all">
            <div className="border-border-subtle flex items-center justify-between border-b pb-2.5">
              <h3 className="text-text-primary text-[10px] font-bold uppercase italic tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
                Filter Matrix OS
              </h3>
              <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            </div>

            {/* Assignee Filter */}
            <div className="space-y-2.5">
<<<<<<< HEAD
              <p className="text-[8px] font-bold uppercase leading-none tracking-widest text-slate-400">
=======
              <p className="text-text-muted text-[8px] font-bold uppercase leading-none tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
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
<<<<<<< HEAD
                        ? 'border-indigo-600 ring-2 ring-indigo-50'
=======
                        ? 'border-accent-primary ring-accent-primary/10 ring-2'
>>>>>>> recover/cabinet-wip-from-stash
                        : 'border-transparent opacity-40 grayscale hover:opacity-100'
                    )}
                  >
                    <img
                      src={member.avatar}
                      alt={member.firstName}
                      className="h-full w-full object-cover"
                    />
                    {selectedAssignees.includes(member.id) && (
<<<<<<< HEAD
                      <div className="absolute inset-0 flex items-center justify-center bg-indigo-600/20">
=======
                      <div className="bg-accent-primary/20 absolute inset-0 flex items-center justify-center">
>>>>>>> recover/cabinet-wip-from-stash
                        <Check className="h-3 w-3 stroke-[4] text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Department Filter */}
            <div className="space-y-2.5">
<<<<<<< HEAD
              <p className="text-[8px] font-bold uppercase leading-none tracking-widest text-slate-400">
=======
              <p className="text-text-muted text-[8px] font-bold uppercase leading-none tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
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
<<<<<<< HEAD
                        ? 'border-slate-900 bg-slate-900 text-white'
                        : 'border-slate-100 bg-white text-slate-400 hover:border-slate-200'
=======
                        ? 'bg-text-primary border-text-primary text-white'
                        : 'text-text-muted border-border-subtle hover:border-border-default bg-white'
>>>>>>> recover/cabinet-wip-from-stash
                    )}
                  >
                    {dep}
                  </button>
                ))}
              </div>
            </div>

            <Button
              variant="ghost"
<<<<<<< HEAD
              className="h-7 w-full rounded-lg border border-slate-100 text-[8px] font-bold uppercase tracking-widest text-slate-400 transition-all hover:text-indigo-600"
=======
              className="border-border-subtle text-text-muted hover:text-accent-primary h-7 w-full rounded-lg border text-[8px] font-bold uppercase tracking-widest transition-all"
>>>>>>> recover/cabinet-wip-from-stash
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
<<<<<<< HEAD
          <Card className="group relative space-y-4 overflow-hidden rounded-xl border border-slate-800 bg-slate-900 p-4 text-white shadow-lg">
            <div className="relative z-10 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-indigo-500 bg-indigo-600 text-white shadow-lg transition-transform group-hover:scale-105">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-bold uppercase leading-none tracking-[0.2em] text-indigo-300">
=======
          <Card className="bg-text-primary border-text-primary/30 group relative space-y-4 overflow-hidden rounded-xl border p-4 text-white shadow-lg">
            <div className="relative z-10 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="bg-accent-primary border-accent-primary flex h-8 w-8 items-center justify-center rounded-lg border text-white shadow-lg transition-transform group-hover:scale-105">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-accent-primary text-[9px] font-bold uppercase leading-none tracking-[0.2em]">
>>>>>>> recover/cabinet-wip-from-stash
                      Intelligence AI
                    </span>
                    <p className="text-[11px] font-bold uppercase tracking-tight">Strategy Sync</p>
                  </div>
                </div>
<<<<<<< HEAD
                <Sparkles className="h-4 w-4 animate-pulse text-indigo-400" />
              </div>
              <div className="space-y-3">
                <p className="text-[10px] font-bold uppercase italic leading-relaxed tracking-tight text-slate-300 opacity-80">
                  "Conflict detected: PFW (Jan 20) overlaps with B2B pre-orders. Recommend: Extend
                  pre-order window by 3 days for max ROI."
                </p>
                <Button className="h-8 w-full rounded-lg bg-white text-[9px] font-bold uppercase tracking-widest text-slate-900 shadow-xl transition-all hover:bg-indigo-50 hover:text-indigo-600">
=======
                <Sparkles className="text-accent-primary h-4 w-4 animate-pulse" />
              </div>
              <div className="space-y-3">
                <p className="text-text-muted text-[10px] font-bold uppercase italic leading-relaxed tracking-tight opacity-80">
                  "Conflict detected: PFW (Jan 20) overlaps with B2B pre-orders. Recommend: Extend
                  pre-order window by 3 days for max ROI."
                </p>
                <Button className="text-text-primary hover:bg-accent-primary/10 hover:text-accent-primary h-8 w-full rounded-lg bg-white text-[9px] font-bold uppercase tracking-widest shadow-xl transition-all">
>>>>>>> recover/cabinet-wip-from-stash
                  Apply Optimization
                </Button>
              </div>
            </div>
<<<<<<< HEAD
            <Flame className="absolute -bottom-8 -right-8 h-24 w-24 text-indigo-600 opacity-5 transition-all duration-700 group-hover:scale-110" />
          </Card>

          {/* Content-to-Product Bridge */}
          <Card className="group space-y-4 rounded-xl border border-slate-100 bg-white p-4 shadow-sm transition-all hover:border-indigo-100">
            <h3 className="flex items-center gap-2 border-b border-slate-50 px-1 pb-2.5 text-[10px] font-bold uppercase italic tracking-widest text-slate-700">
              <Layers className="h-3.5 w-3.5 text-indigo-600" /> Lifecycle Bridge
=======
            <Flame className="text-accent-primary absolute -bottom-8 -right-8 h-24 w-24 opacity-5 transition-all duration-700 group-hover:scale-110" />
          </Card>

          {/* Content-to-Product Bridge */}
          <Card className="border-border-subtle hover:border-accent-primary/20 group space-y-4 rounded-xl border bg-white p-4 shadow-sm transition-all">
            <h3 className="text-text-primary border-border-subtle flex items-center gap-2 border-b px-1 pb-2.5 text-[10px] font-bold uppercase italic tracking-widest">
              <Layers className="text-accent-primary h-3.5 w-3.5" /> Lifecycle Bridge
>>>>>>> recover/cabinet-wip-from-stash
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
<<<<<<< HEAD
                  color: 'bg-indigo-500',
=======
                  color: 'bg-accent-primary',
>>>>>>> recover/cabinet-wip-from-stash
                },
                { label: 'Techwear Drops', status: 'Ready', progress: 95, color: 'bg-emerald-500' },
              ].map((item, i) => (
                <div key={i} className="group/item cursor-pointer space-y-1.5">
                  <div className="flex items-end justify-between">
                    <div className="min-w-0 space-y-0.5">
<<<<<<< HEAD
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
=======
                      <p className="text-text-primary group-hover/item:text-accent-primary mb-1 truncate text-[10px] font-bold uppercase leading-none transition-colors">
                        {item.label}
                      </p>
                      <p className="text-text-muted text-[8px] font-bold uppercase leading-none tracking-widest opacity-60">
                        {item.status}
                      </p>
                    </div>
                    <span className="text-text-primary mb-0.5 text-[9px] font-bold tabular-nums leading-none">
                      {item.progress}%
                    </span>
                  </div>
                  <div className="bg-bg-surface2 border-border-subtle h-1 w-full overflow-hidden rounded-full border shadow-inner">
>>>>>>> recover/cabinet-wip-from-stash
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
<<<<<<< HEAD
              className="flex h-8 w-full items-center justify-center gap-1.5 rounded-lg border border-slate-200 text-[9px] font-bold uppercase tracking-widest text-slate-400 shadow-sm transition-all hover:border-slate-900 hover:bg-slate-900 hover:text-white"
=======
              className="border-border-default text-text-muted hover:bg-text-primary/90 hover:border-text-primary flex h-8 w-full items-center justify-center gap-1.5 rounded-lg border text-[9px] font-bold uppercase tracking-widest shadow-sm transition-all hover:text-white"
>>>>>>> recover/cabinet-wip-from-stash
            >
              Master Timeline <ChevronRight className="h-3 w-3" />
            </Button>
          </Card>
        </div>
      </div>

      {/* Task Detail Dialog */}
      <Dialog open={!!selectedTask} onOpenChange={() => setSelectedTask(null)}>
        <DialogContent className="max-w-md overflow-hidden rounded-xl border-none bg-white p-3 shadow-2xl">
<<<<<<< HEAD
          <div className="absolute left-0 top-0 h-1.5 w-full bg-slate-100">
=======
          <div className="bg-bg-surface2 absolute left-0 top-0 h-1.5 w-full">
>>>>>>> recover/cabinet-wip-from-stash
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
<<<<<<< HEAD
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">
                  Matrix Task ID: #{selectedTask?.id}
                </span>
              </div>
              <h2 className="text-base font-black uppercase leading-none tracking-tighter text-slate-900">
                {selectedTask?.title}
              </h2>
              <p className="text-xs font-bold uppercase italic tracking-widest text-slate-400">
=======
                <span className="text-text-muted text-[10px] font-black uppercase tracking-[0.2em]">
                  Matrix Task ID: #{selectedTask?.id}
                </span>
              </div>
              <h2 className="text-text-primary text-base font-black uppercase leading-none tracking-tighter">
                {selectedTask?.title}
              </h2>
              <p className="text-text-muted text-xs font-bold uppercase italic tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
                {selectedTask?.department}
              </p>
            </div>

<<<<<<< HEAD
            <div className="space-y-4 rounded-xl bg-slate-50 p-4">
              <p className="text-sm font-medium leading-relaxed text-slate-600">
                {selectedTask?.description}
              </p>
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
=======
            <div className="bg-bg-surface2 space-y-4 rounded-xl p-4">
              <p className="text-text-secondary text-sm font-medium leading-relaxed">
                {selectedTask?.description}
              </p>
              <div className="text-text-muted flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
                <Clock className="h-3 w-3" />
                {selectedTask &&
                  format(parseISO(selectedTask.date), 'dd MMMM yyyy', { locale: ru })}
              </div>
            </div>

<<<<<<< HEAD
            <div className="flex items-center gap-3 border-t border-slate-50 pt-6">
=======
            <div className="border-border-subtle flex items-center gap-3 border-t pt-6">
>>>>>>> recover/cabinet-wip-from-stash
              <div className="h-10 w-10 shrink-0 overflow-hidden rounded-2xl border-2 border-white shadow-lg">
                <img
                  src={team.find((m) => m.id === selectedTask?.assigneeId)?.avatar}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
<<<<<<< HEAD
                <p className="mb-1 text-[8px] font-black uppercase tracking-widest text-slate-400">
                  Исполнитель
                </p>
                <p className="text-sm font-black uppercase text-slate-900">
                  {team.find((m) => m.id === selectedTask?.assigneeId)?.firstName}{' '}
                  {team.find((m) => m.id === selectedTask?.assigneeId)?.lastName}
                </p>
                <p className="text-[10px] font-bold uppercase tracking-tight text-indigo-500">
=======
                <p className="text-text-muted mb-1 text-[8px] font-black uppercase tracking-widest">
                  Исполнитель
                </p>
                <p className="text-text-primary text-sm font-black uppercase">
                  {team.find((m) => m.id === selectedTask?.assigneeId)?.firstName}{' '}
                  {team.find((m) => m.id === selectedTask?.assigneeId)?.lastName}
                </p>
                <p className="text-accent-primary text-[10px] font-bold uppercase tracking-tight">
>>>>>>> recover/cabinet-wip-from-stash
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
<<<<<<< HEAD
                className="h-10 rounded-2xl border border-slate-100 text-xs font-black uppercase tracking-widest text-slate-400"
=======
                className="border-border-subtle text-text-muted h-10 rounded-2xl border text-xs font-black uppercase tracking-widest"
>>>>>>> recover/cabinet-wip-from-stash
              >
                Закрыть
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
<<<<<<< HEAD
    </div>
=======
    </RegistryPageShell>
>>>>>>> recover/cabinet-wip-from-stash
  );
}
