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
    Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, 
    Bot, Sparkles, Zap, Flame, Target, Box, ShoppingBag, 
    FileText, TrendingUp, Users, MapPin, Globe, ShieldCheck,
    Signal, Clock, Filter, Maximize2, Layers, Package, 
    Newspaper, MessageSquareText, Megaphone, Truck, Factory,
    History, Palette, Share2, Scale, Banknote, Award, Eye, Check, X
} from 'lucide-react';
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog";
import { cn } from '@/lib/utils';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useAuth } from '@/providers/auth-provider';

const MOCK_EVENTS = [
    { date: new Date(2026, 0, 10), title: 'SS26 Content Launch', type: 'blog', category: 'Marketing', color: 'blue' },
    { date: new Date(2026, 0, 15), title: 'Production Deadline: Outerwear', type: 'factory', category: 'Supply Chain', color: 'amber' },
    { date: new Date(2026, 0, 20), title: 'Paris Fashion Week Show', type: 'event', category: 'PR', color: 'fuchsia' },
    { date: new Date(2026, 0, 25), title: 'B2B Pre-Order Closes', type: 'b2b', category: 'Sales', color: 'emerald' },
    { date: new Date(2026, 0, 12), title: 'Strategic Goal: Milan HQ Opening', type: 'goal', category: 'Strategy', color: 'slate' },
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
    const departments = useMemo(() => Array.from(new Set(team.map(m => m.department).filter(Boolean))) as string[], [team]);
    const roles = useMemo(() => Array.from(new Set(team.map(m => m.role))) as string[], [team]);

    const filteredTasks = useMemo(() => {
        return tasks.filter(task => {
            const assignee = team.find(m => m.id === task.assigneeId);
            if (!assignee) return false;

            const depMatch = selectedDepartments.length === 0 || (task.department && selectedDepartments.includes(task.department));
            const roleMatch = selectedRoles.length === 0 || selectedRoles.includes(assignee.role);
            const assigneeMatch = selectedAssignees.length === 0 || selectedAssignees.includes(task.assigneeId);

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
        <div className="container mx-auto px-4 py-4 space-y-4 max-w-5xl pb-24 animate-in fade-in duration-700 h-[calc(100vh-2rem)] flex flex-col">
            
            {/* --- TOP BAR: STRATEGIC CONTROLS --- */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-3 border-b border-slate-100 pb-3 shrink-0">
                <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
                        <CalendarIcon className="h-2.5 w-2.5" />
                        <span>Intelligence</span>
                        <ChevronRight className="h-2 w-2 opacity-50" />
                        <span className="text-slate-300">Strategy OS Calendar</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                        <h1 className="text-base font-bold font-headline tracking-tighter uppercase text-slate-900 leading-none">Operational Map 2.0</h1>
                        <Badge variant="outline" className="bg-fuchsia-50 text-fuchsia-600 border-fuchsia-100 font-bold text-[7px] px-1.5 h-4 gap-1 tracking-widest shadow-sm transition-all uppercase">
                           <span className="h-1.5 w-1.5 rounded-full bg-fuchsia-500 animate-pulse" /> LIVE SYNC
                        </Badge>
                    </div>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto">
                    <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-inner">
                        <div className="flex bg-white border border-slate-200 p-0.5 rounded-lg shadow-sm">
                            {['Timeline', 'Month', 'Quarter', 'Year'].map(v => (
                                <button key={v} className={cn(
                                    "px-3 h-6 rounded-md text-[9px] font-bold uppercase tracking-widest transition-all",
                                    v === 'Month' ? "bg-slate-900 text-white shadow-sm" : "text-slate-400 hover:text-slate-900 hover:bg-slate-50"
                                )}>
                                    {v}
                                </button>
                            ))}
                        </div>
                        <Button className="h-7 px-4 rounded-lg bg-slate-900 text-white text-[9px] font-bold uppercase gap-1.5 hover:bg-indigo-600 transition-all shadow-lg border border-slate-900 tracking-widest">
                            <Plus className="h-3.5 w-3.5" /> Schedule Launch
                        </Button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-3 flex-1 overflow-hidden">
                
                {/* --- MAIN CALENDAR AREA --- */}
                <div className="xl:col-span-9 flex flex-col min-h-0">
                    <Card className="border border-slate-100 bg-white rounded-xl shadow-sm flex flex-col flex-1 overflow-hidden hover:border-indigo-100/50 transition-all">
                        <CardHeader className="p-3.5 border-b border-slate-50 bg-slate-50/50 shrink-0">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <h3 className="text-base font-bold uppercase italic tracking-tighter text-slate-900 leading-none">
                                        {format(currentDate, 'LLLL yyyy', { locale: ru })}
                                    </h3>
                                    <div className="flex gap-1.5">
                                        <Button variant="ghost" size="icon" onClick={() => setCurrentDate(subMonths(currentDate, 1))} className="h-7 w-7 rounded-lg border border-slate-200 bg-white shadow-sm transition-all hover:bg-slate-50">
                                            <ChevronLeft className="h-3.5 w-3.5" />
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => setCurrentDate(addMonths(currentDate, 1))} className="h-7 w-7 rounded-lg border border-slate-200 bg-white shadow-sm transition-all hover:bg-slate-50">
                                            <ChevronRight className="h-3.5 w-3.5" />
                                        </Button>
                                    </div>
                                </div>
                                <div className="flex gap-1 overflow-x-auto no-scrollbar pb-1">
                                    {['All', 'Marketing', 'Supply Chain', 'Strategy', 'PR', 'Sales'].map(f => (
                                        <button 
                                            key={f} 
                                            onClick={() => setActiveFilter(f)}
                                            className={cn(
                                                "h-6 px-3 rounded-md text-[8px] font-bold uppercase tracking-widest transition-all border shrink-0",
                                                activeFilter === f ? "bg-slate-900 text-white border-slate-900 shadow-sm" : "bg-white text-slate-400 border-slate-200 hover:border-slate-300"
                                            )}
                                        >
                                            {f}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </CardHeader>

                        <div className="flex-1 overflow-auto">
                            <div className="grid grid-cols-7 gap-px bg-slate-100 h-full">
                                {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map(d => (
                                    <div key={d} className="bg-slate-50 py-1.5 text-center text-[8px] font-bold uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100">
                                        {d}
                                    </div>
                                ))}
                                {days.map((day, i) => {
                                    const dayEvents = MOCK_EVENTS.filter(e => isSameDay(e.date, day) && (activeFilter === 'All' || e.category === activeFilter));
                                    const dayTasks = filteredTasks.filter(t => isSameDay(parseISO(t.date), day));
                                    const workload = dayTasks.length;

                                    return (
                                        <div key={i} className={cn(
                                            "min-h-[100px] bg-white p-2 group transition-all hover:bg-slate-50/50 cursor-pointer relative border-r border-b border-slate-100",
                                            !isSameMonth(day, currentDate) && "bg-slate-50/30 opacity-40 pointer-events-none"
                                        )}>
                                            <div className="flex justify-between items-start mb-1.5">
                                                <span className={cn(
                                                    "text-sm font-bold tabular-nums transition-colors leading-none",
                                                    isSameDay(day, new Date()) ? "text-indigo-600" : "text-slate-900 group-hover:text-slate-400"
                                                )}>
                                                    {format(day, 'd')}
                                                </span>
                                                {workload > 0 && (
                                                    <div className="flex items-center gap-1 px-1.5 h-3.5 rounded bg-slate-900 text-white text-[7px] font-bold uppercase tracking-widest shadow-sm">
                                                        <Zap className="h-2 w-2 text-indigo-400" />
                                                        {workload}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="space-y-1 overflow-hidden">
                                                {dayEvents.map((e, idx) => (
                                                    <div key={idx} className={cn(
                                                        "px-1.5 py-1 rounded text-[7px] font-bold uppercase tracking-tight truncate border-l-2 shadow-sm",
                                                        `bg-${e.color}-50 text-${e.color}-600 border-${e.color}-500/50`
                                                    )}>
                                                        {e.title}
                                                    </div>
                                                ))}
                                                
                                                {dayTasks.map((t, idx) => {
                                                    const assignee = team.find(m => m.id === t.assigneeId);
                                                    return (
                                                        <div 
                                                            key={`task-${idx}`} 
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setSelectedTask(t);
                                                            }}
                                                            className={cn(
                                                                "px-1.5 py-1 rounded text-[7px] font-bold uppercase tracking-tight truncate border-l-2 bg-slate-50 text-slate-900 border-slate-900 shadow-sm hover:scale-[1.02] active:scale-95 transition-all",
                                                                t.priority === 'high' && "border-l-rose-500",
                                                                t.priority === 'medium' && "border-l-amber-500"
                                                            )}
                                                        >
                                                            <div className="flex items-center justify-between gap-1.5">
                                                                <span className="truncate">{t.title}</span>
                                                                {assignee && (
                                                                    <img src={assignee.avatar} className="h-3 w-3 rounded-full object-cover shrink-0 border border-white shadow-sm" />
                                                                )}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>

                                            {workload > 3 && (
                                                <div className="absolute bottom-1 left-1 right-1 h-0.5 bg-slate-100 rounded-full overflow-hidden">
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
                <div className="xl:col-span-3 space-y-4 overflow-y-auto no-scrollbar h-full pb-4">
                    
                    {/* Team Filter & Load OS */}
                    <Card className="border border-slate-100 shadow-sm bg-white rounded-xl overflow-hidden hover:border-indigo-100 transition-all p-4 space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-50 pb-2.5">
                            <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-700 italic">Filter Matrix OS</h3>
                            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                        </div>

                        {/* Assignee Filter */}
                        <div className="space-y-2.5">
                            <p className="text-[8px] font-bold uppercase text-slate-400 tracking-widest leading-none">Assignees</p>
                            <div className="flex flex-wrap gap-1.5">
                                {team.map(member => (
                                    <button 
                                        key={member.id}
                                        onClick={() => {
                                            setSelectedAssignees(prev => 
                                                prev.includes(member.id) ? prev.filter(id => id !== member.id) : [...prev, member.id]
                                            );
                                        }}
                                        className={cn(
                                            "relative h-8 w-8 rounded-lg transition-all border-2 overflow-hidden shadow-sm",
                                            selectedAssignees.includes(member.id) ? "border-indigo-600 ring-2 ring-indigo-50" : "border-transparent opacity-40 grayscale hover:opacity-100"
                                        )}
                                    >
                                        <img src={member.avatar} alt={member.firstName} className="h-full w-full object-cover" />
                                        {selectedAssignees.includes(member.id) && (
                                            <div className="absolute inset-0 bg-indigo-600/20 flex items-center justify-center">
                                                <Check className="h-3 w-3 text-white stroke-[4]" />
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Department Filter */}
                        <div className="space-y-2.5">
                            <p className="text-[8px] font-bold uppercase text-slate-400 tracking-widest leading-none">Departments</p>
                            <div className="flex flex-wrap gap-1">
                                {departments.map(dep => (
                                    <button 
                                        key={dep}
                                        onClick={() => {
                                            setSelectedDepartments(prev => 
                                                prev.includes(dep) ? prev.filter(d => d !== dep) : [...prev, dep]
                                            );
                                        }}
                                        className={cn(
                                            "px-2 py-1 rounded-md text-[7px] font-bold uppercase tracking-widest transition-all shadow-sm border",
                                            selectedDepartments.includes(dep) ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-400 border-slate-100 hover:border-slate-200"
                                        )}
                                    >
                                        {dep}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <Button 
                            variant="ghost" 
                            className="w-full h-7 border border-slate-100 rounded-lg text-[8px] font-bold uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-all"
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
                    <Card className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-white space-y-4 relative overflow-hidden group shadow-lg">
                        <div className="relative z-10 space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2.5">
                                    <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg border border-indigo-500 group-hover:scale-105 transition-transform">
                                        <Bot className="h-4 w-4" />
                                    </div>
                                    <div className="space-y-0.5">
                                        <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-indigo-300 leading-none">Intelligence AI</span>
                                        <p className="text-[11px] font-bold uppercase tracking-tight">Strategy Sync</p>
                                    </div>
                                </div>
                                <Sparkles className="h-4 w-4 text-indigo-400 animate-pulse" />
                            </div>
                            <div className="space-y-3">
                                <p className="text-[10px] text-slate-300 font-bold uppercase leading-relaxed tracking-tight italic opacity-80">
                                    "Conflict detected: PFW (Jan 20) overlaps with B2B pre-orders. Recommend: Extend pre-order window by 3 days for max ROI."
                                </p>
                                <Button className="w-full h-8 bg-white text-slate-900 rounded-lg font-bold uppercase text-[9px] tracking-widest hover:bg-indigo-50 hover:text-indigo-600 transition-all shadow-xl">
                                    Apply Optimization
                                </Button>
                            </div>
                        </div>
                        <Flame className="absolute -right-8 -bottom-8 h-24 w-24 text-indigo-600 opacity-5 group-hover:scale-110 transition-all duration-700" />
                    </Card>

                    {/* Content-to-Product Bridge */}
                    <Card className="border border-slate-100 shadow-sm bg-white rounded-xl p-4 space-y-4 hover:border-indigo-100 transition-all group">
                        <h3 className="text-[10px] font-bold uppercase italic tracking-widest text-slate-700 border-b border-slate-50 pb-2.5 px-1 flex items-center gap-2">
                           <Layers className="h-3.5 w-3.5 text-indigo-600" /> Lifecycle Bridge
                        </h3>
                        <div className="space-y-4 px-1">
                            {[
                                { label: 'SS26 Outerwear', status: 'Production', progress: 65, color: 'bg-amber-500' },
                                { label: 'SS26 Knitwear', status: 'In Design', progress: 30, color: 'bg-indigo-500' },
                                { label: 'Techwear Drops', status: 'Ready', progress: 95, color: 'bg-emerald-500' },
                            ].map((item, i) => (
                                <div key={i} className="space-y-1.5 group/item cursor-pointer">
                                    <div className="flex justify-between items-end">
                                        <div className="space-y-0.5 min-w-0">
                                            <p className="text-[10px] font-bold uppercase text-slate-900 group-hover/item:text-indigo-600 transition-colors truncate leading-none mb-1">{item.label}</p>
                                            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest opacity-60 leading-none">{item.status}</p>
                                        </div>
                                        <span className="text-[9px] font-bold text-slate-900 tabular-nums leading-none mb-0.5">{item.progress}%</span>
                                    </div>
                                    <div className="h-1 w-full bg-slate-50 rounded-full overflow-hidden shadow-inner border border-slate-50">
                                        <div className={cn("h-full transition-all duration-1000", item.color)} style={{ width: `${item.progress}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Button variant="outline" className="w-full h-8 border border-slate-200 text-slate-400 text-[9px] font-bold uppercase rounded-lg hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all shadow-sm flex items-center justify-center gap-1.5 tracking-widest">
                            Master Timeline <ChevronRight className="h-3 w-3" />
                        </Button>
                    </Card>
                </div>
            </div>

            {/* Task Detail Dialog */}
            <Dialog open={!!selectedTask} onOpenChange={() => setSelectedTask(null)}>
                <DialogContent className="max-w-md rounded-xl p-3 border-none shadow-2xl bg-white overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-100">
                        <div className={cn(
                            "h-full transition-all duration-500",
                            selectedTask?.priority === 'high' ? "bg-rose-500 w-full" :
                            selectedTask?.priority === 'medium' ? "bg-amber-500 w-2/3" : "bg-blue-500 w-1/3"
                        )} />
                    </div>

                    <div className="space-y-4 pt-4">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Badge className={cn(
                                    "text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md border-none",
                                    selectedTask?.priority === 'high' ? "bg-rose-50 text-rose-600" :
                                    selectedTask?.priority === 'medium' ? "bg-amber-50 text-amber-600" : "bg-blue-50 text-blue-600"
                                )}>
                                    {selectedTask?.priority} Priority
                                </Badge>
                                <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Matrix Task ID: #{selectedTask?.id}</span>
                            </div>
                            <h2 className="text-base font-black tracking-tighter uppercase text-slate-900 leading-none">
                                {selectedTask?.title}
                            </h2>
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest italic">{selectedTask?.department}</p>
                        </div>

                        <div className="p-4 bg-slate-50 rounded-xl space-y-4">
                            <p className="text-sm text-slate-600 leading-relaxed font-medium">
                                {selectedTask?.description}
                            </p>
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                <Clock className="h-3 w-3" />
                                {selectedTask && format(parseISO(selectedTask.date), 'dd MMMM yyyy', { locale: ru })}
                            </div>
                        </div>

                        <div className="flex items-center gap-3 border-t border-slate-50 pt-6">
                            <div className="h-10 w-10 rounded-2xl overflow-hidden shadow-lg border-2 border-white shrink-0">
                                <img 
                                    src={team.find(m => m.id === selectedTask?.assigneeId)?.avatar} 
                                    className="h-full w-full object-cover" 
                                />
                            </div>
                            <div>
                                <p className="text-[8px] font-black uppercase text-slate-400 tracking-widest mb-1">Исполнитель</p>
                                <p className="text-sm font-black text-slate-900 uppercase">
                                    {team.find(m => m.id === selectedTask?.assigneeId)?.firstName} {team.find(m => m.id === selectedTask?.assigneeId)?.lastName}
                                </p>
                                <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-tight">@{team.find(m => m.id === selectedTask?.assigneeId)?.nickname}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 pt-4">
                            <Button 
                                onClick={() => setSelectedTask(null)}
                                className="h-10 bg-black text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl transition-all hover:scale-[1.02] active:scale-95"
                            >
                                <Check className="mr-2 h-4 w-4" /> Принято
                            </Button>
                            <Button 
                                variant="ghost"
                                onClick={() => setSelectedTask(null)}
                                className="h-10 border border-slate-100 rounded-2xl font-black uppercase tracking-widest text-xs text-slate-400"
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

