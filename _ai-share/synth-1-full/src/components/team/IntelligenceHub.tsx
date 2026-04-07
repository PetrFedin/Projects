import { useState, useMemo, useEffect } from 'react';
import {
  Users, UserPlus, Shield, ShieldCheck, History, Activity,
  Calendar as CalendarIcon, Settings, Archive, RotateCcw,
  MoreHorizontal, Search, Plus, X, Check, Mail, Phone,
  BarChart2, Clock, CheckCircle2, AlertCircle, Lock,
  Instagram, Send, MessageCircle, ExternalLink, Edit3, Camera, Save, Globe, User,
  Sparkles, Timer, MessageSquare, Heart, Eye, Target, Zap, TrendingUp, TrendingDown, ArrowRight, FileText, ChevronDown, Loader2, Layers,
  Newspaper, Bot, Flame, Maximize2, Briefcase, Building2, Factory, Store, Warehouse, Truck, Share2, DollarSign, Trash2, Mic, Palette, Laptop, Phone as PhoneIcon, FileText as FileTextIcon
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from 'framer-motion';
import { TeamMember, TeamMemberStatus } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

const getCategoryIcon = (category?: string) => {
  switch(category) {
    case 'view': return <Eye className="h-3 w-3 text-slate-400" />;
    case 'edit': return <Edit3 className="h-3 w-3 text-amber-500" />;
    case 'task': return <CheckCircle2 className="h-3 w-3 text-emerald-500" />;
    case 'system': return <Settings className="h-3 w-3 text-indigo-500" />;
    default: return <Activity className="h-3 w-3 text-slate-400" />;
  }
};

const ActivityLog = ({ member, canComment }: { member: TeamMember, canComment?: boolean }) => {
  const [commentingId, setCommentingId] = useState<string | null>(null);
  const [newComment, setNewComment] = useState("");
  const { toast } = useToast();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md py-2 z-20 border-b border-slate-50">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-xl bg-indigo-50 flex items-center justify-center">
            <History className="h-4 w-4 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-900 leading-none">Хронология Intel OS</h3>
            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">Реальное время синхронизации</p>
          </div>
        </div>
        <Button variant="outline" size="sm" className="h-8 rounded-xl border-slate-100 text-[9px] font-black uppercase tracking-widest gap-2 bg-white/50 shadow-sm">
          <FileText className="h-3 w-3" />
          Экспорт отчета
        </Button>
      </div>

      <div className="space-y-4">
        {member.history && member.history.length > 0 ? (
          member.history.map((log) => (
            <motion.div 
              key={log.id} 
              initial={{ opacity: 0, x: -10 }} 
              animate={{ opacity: 1, x: 0 }}
              className="group/log relative pl-8 pb-6 last:pb-0"
            >
              <div className="absolute left-[11px] top-4 bottom-0 w-[1px] bg-slate-100 group-last/log:hidden" />
              <div className="absolute left-0 top-1.5 h-[23px] w-[23px] rounded-full bg-white border border-slate-100 shadow-sm flex items-center justify-center z-10">
                {getCategoryIcon(log.category)}
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm group-hover/log:shadow-md transition-all group-hover/log:border-indigo-100">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-black text-slate-900 uppercase tracking-tight">
                        {log.action}: <span className="text-indigo-600">{log.target}</span>
                      </span>
                      {log.duration && (
                        <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-slate-50 text-[8px] font-black text-slate-400 uppercase tracking-widest">
                          <Timer className="h-2 w-2" /> {log.duration} м
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
                        <Clock className="h-2.5 w-2.5" />
                        {new Date(log.date).toLocaleString('ru-RU', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' })}
                      </span>
                      {log.idleTime && (
                        <span className="text-[9px] text-rose-400 font-black uppercase tracking-widest flex items-center gap-1.5">
                          <AlertCircle className="h-2.5 w-2.5" />
                          Бездействие: {log.idleTime}м
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 opacity-0 group-hover/log:opacity-100 transition-opacity">
                    {[
                      { icon: <Check className="h-3 w-3" />, label: 'ОК', color: 'emerald' },
                      { icon: <AlertCircle className="h-3 w-3" />, label: 'FIX', color: 'rose' },
                      { icon: <Heart className="h-3 w-3" />, label: 'WOW', color: 'pink' },
                      { icon: <MessageSquare className="h-3 w-3" />, label: 'QA', color: 'indigo' }
                    ].map((react, idx) => (
                      <Tooltip key={idx}>
                        <TooltipTrigger asChild>
                          <button 
                            className={cn(
                              "h-7 px-2 rounded-lg flex items-center gap-1.5 transition-all hover:scale-110 active:scale-95 border border-transparent hover:border-slate-100",
                              react.color === 'emerald' ? "bg-emerald-50 text-emerald-600" :
                              react.color === 'rose' ? "bg-rose-50 text-rose-600" :
                              react.color === 'pink' ? "bg-pink-50 text-pink-600" :
                              "bg-indigo-50 text-indigo-600"
                            )}
                            onClick={() => react.label === 'QA' ? setCommentingId(log.id) : toast({ title: "Реакция добавлена", description: `Действие отмечено как ${react.label}` })}
                          >
                            {react.icon}
                            <span className="text-[7px] font-black uppercase">{react.label}</span>
                          </button>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="bg-black text-white text-[8px] font-black uppercase">Быстрый фидбек</TooltipContent>
                      </Tooltip>
                    ))}
                  </div>
                </div>

                {((log.comments && log.comments.length > 0) || commentingId === log.id) && (
                  <div className="mt-4 pt-4 border-t border-slate-50 space-y-3">
                    {log.comments?.map(comment => (
                      <div key={comment.id} className="bg-slate-50/50 rounded-xl p-3 flex gap-3 items-start border border-slate-100/50">
                        <div className="h-6 w-6 rounded-lg bg-indigo-100 flex items-center justify-center text-[10px] font-black text-indigo-600">
                          {comment.user[0]}
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black text-slate-900 uppercase tracking-tight">{comment.user}</span>
                            <span className="text-[8px] font-bold text-slate-400 uppercase">{new Date(comment.date).toLocaleString('ru-RU')}</span>
                          </div>
                          <p className="text-[11px] text-slate-600 leading-relaxed">{comment.text}</p>
                        </div>
                      </div>
                    ))}
                    
                    {commentingId === log.id && (
                      <div className="flex gap-2 items-end mt-2 animate-in slide-in-from-top-2 duration-300">
                        <div className="flex-1 space-y-1.5">
                          <label className="text-[8px] font-black uppercase text-slate-400 ml-1">Ваш комментарий / запрос обоснования</label>
                          <textarea 
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Напишите вопрос или отзыв..."
                            className="w-full rounded-xl bg-white border border-indigo-100 p-3 text-[11px] min-h-[60px] focus:ring-2 ring-indigo-500/10 transition-all outline-none shadow-sm"
                          />
                        </div>
                        <div className="flex flex-col gap-2 pb-0.5">
                          <Button 
                            size="icon" 
                            className="h-8 w-8 rounded-lg bg-black text-white"
                            onClick={() => {
                              setCommentingId(null);
                              setNewComment("");
                            }}
                          >
                            <Send className="h-3.5 w-3.5" />
                          </Button>
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="h-8 w-8 rounded-lg text-slate-400"
                            onClick={() => setCommentingId(null)}
                          >
                            <X className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          ))
        ) : (
          <div className="py-12 text-center bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
            <Activity className="h-8 w-8 text-slate-200 mx-auto mb-3" />
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Нет зафиксированной активности</p>
          </div>
        )}
      </div>
    </div>
  );
};

const MemberStats = ({ member }: { member: TeamMember }) => (
  <div className="space-y-10 animate-in fade-in duration-700">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
      {[
        { label: 'Эффективность', value: '94%', icon: <Zap className="h-5 w-5 text-amber-500" />, sub: '+12% к прошлой неделе' },
        { label: 'Загрузка матрицы', value: `${member.workload || 45}%`, icon: <Layers className="h-5 w-5 text-indigo-500" />, sub: member.workload && member.workload > 80 ? 'Перегружен' : 'Оптимально' },
        { label: 'Точность данных', value: '99.2%', icon: <ShieldCheck className="h-5 w-5 text-emerald-500" />, sub: 'Без ошибок за 48ч' },
        { label: 'Время в Intel OS', value: '6.4ч', icon: <Timer className="h-5 w-5 text-slate-500" />, sub: 'Среднее за день' }
      ].map((stat, i) => (
        <div key={i} className="p-4 rounded-xl bg-white border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 group">
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:scale-110 transition-transform">{stat.icon}</div>
            <div className="h-2 w-2 rounded-full bg-emerald-500" />
          </div>
          <p className="text-base font-black tracking-tighter text-slate-900">{stat.value}</p>
          <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mt-1">{stat.label}</p>
          <p className="text-[9px] font-bold text-slate-300 mt-2">{stat.sub}</p>
        </div>
      ))}
    </div>

    {member.kpiMetrics && (
      <div className="bg-indigo-600 rounded-xl p-3 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 p-20 opacity-10 rotate-12">
          <Target className="h-64 w-64" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-10">
            <div className="h-8 w-8 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <h3 className="text-xs font-black uppercase tracking-widest text-white/60">Ключевые показатели роли (KPI Matrix)</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {Object.entries(member.kpiMetrics).map(([key, metric]) => (
              <div key={key} className="space-y-4">
                <div className="flex items-end gap-3">
                  <span className="text-sm font-black tracking-tighter leading-none">{metric.value}</span>
                  <div className={cn(
                    "flex items-center gap-1 px-2 py-0.5 rounded-lg text-[9px] font-black uppercase mb-1",
                    metric.trend === 'up' ? "bg-emerald-400/20 text-emerald-300" : 
                    metric.trend === 'down' ? "bg-rose-400/20 text-rose-300" : "bg-white/10 text-white/50"
                  )}>
                    {metric.trend === 'up' ? <TrendingUp className="h-3 w-3" /> : 
                     metric.trend === 'down' ? <TrendingDown className="h-3 w-3" /> : <Activity className="h-3 w-3" />}
                    {metric.trend === 'up' ? '+4%' : metric.trend === 'down' ? '-2%' : '0%'}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-white/80">{metric.label}</p>
                  <div className="h-1.5 w-full bg-white/10 rounded-full mt-3 overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, (metric.value / (metric.value > 100 ? metric.value : 100)) * 100)}%` }}
                      className="h-full bg-white rounded-full"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )}

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
      <div className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-900">Распределение ресурсов</h3>
          <TrendingUp className="h-4 w-4 text-slate-300" />
        </div>
        <div className="space-y-6">
          {Object.entries(member.stats?.timeSpentBySection || { 'Управление': 120, 'Каталог': 80, 'Заказы': 45 }).map(([section, time]) => (
            <div key={section} className="space-y-2.5">
              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-tight">
                <span className="text-slate-600">{section}</span>
                <div className="flex items-center gap-2">
                  <span className="text-indigo-600">{time} мин</span>
                  <span className="text-slate-300">({Math.round((time / 480) * 100)}%)</span>
                </div>
              </div>
              <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden shadow-inner">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, (time / 480) * 100)}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-indigo-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.3)]" 
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-slate-900 rounded-xl p-4 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 p-3 opacity-10">
          <Activity className="h-40 w-40" />
        </div>
        <div className="relative z-10 space-y-6">
          <h3 className="text-xs font-black uppercase tracking-widest text-white/40">Аналитика простоя</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-[1.5rem] bg-rose-500/20 border border-rose-500/30 flex items-center justify-center">
                <Timer className="h-8 w-8 text-rose-400" />
              </div>
              <div>
                <p className="text-base font-black tracking-tighter">42 мин</p>
                <p className="text-[10px] font-black uppercase text-white/30 tracking-widest mt-1">Среднее бездействие в сессии</p>
              </div>
            </div>
            
            <div className="p-3 bg-white/5 rounded-2xl border border-white/5 space-y-3">
              <p className="text-[9px] font-bold text-white/60 uppercase tracking-widest leading-relaxed">
                Сотрудник проявляет пиковую активность в первой половине дня. В период с 14:00 до 16:00 замечено снижение операционной скорости на <span className="text-rose-400">15%</span>.
              </p>
              <div className="flex gap-2">
                <Badge className="bg-amber-500/20 text-amber-400 border-none text-[7px] font-black uppercase">Нужен контроль</Badge>
                <Badge className="bg-indigo-500/20 text-indigo-400 border-none text-[7px] font-black uppercase">Высокий потенциал</Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export const IntelligenceHub = ({ member, onClose }: { member: TeamMember, onClose: () => void }) => {
  const [activeView, setActiveView] = useState<'timeline' | 'analytics' | 'tasks'>('timeline');

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[95vw] md:max-w-6xl p-0 rounded-[3.5rem] overflow-hidden border-none shadow-[0_0_100px_rgba(0,0,0,0.2)] bg-[#f8f9fa] h-[90vh]">
        <DialogTitle className="sr-only">Аналитика активности: {member.firstName} {member.lastName}</DialogTitle>
        <DialogDescription className="sr-only">Детальная история действий, аналитика эффективности и управление задачами сотрудника.</DialogDescription>
        <div className="flex h-full">
          {/* Left Sidebar Profile */}
          <div className="w-[320px] bg-slate-900 text-white flex flex-col shrink-0 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.8)] z-20" />
            
            <ScrollArea className="flex-1 custom-scrollbar-white">
              <div className="p-4 flex flex-col items-center text-center space-y-4">
                <div className="relative group">
                  <Avatar className="h-32 w-24 rounded-xl border-4 border-white/10 shadow-2xl object-cover transition-transform duration-700 group-hover:rotate-3 group-hover:scale-105">
                    <AvatarImage src={member.avatar} className="object-cover" />
                    <AvatarFallback className="text-base font-black">{member.firstName[0]}</AvatarFallback>
                  </Avatar>
                  <div className={cn(
                    "absolute -bottom-2 -right-2 h-8 w-8 rounded-2xl border-4 border-slate-900 flex items-center justify-center shadow-xl transition-all",
                    member.isOnline ? "bg-green-500 animate-pulse" : "bg-rose-500"
                  )}>
                    <div className="h-2 w-2 rounded-full bg-white opacity-50" />
                  </div>
                </div>

                <div className="space-y-2">
                  <h2 className="text-base font-black tracking-tighter uppercase leading-none">{member.firstName} {member.lastName}</h2>
                  <p className="text-indigo-400 font-black uppercase tracking-[0.2em] text-[10px]">{member.role}</p>
                  <div className="flex flex-wrap justify-center gap-2 mt-3">
                    {member.department && (
                      <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[8px] font-black uppercase tracking-widest text-white/40">
                        {member.department}
                      </div>
                    )}
                    {member.joinedAt && (
                      <div className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[8px] font-black uppercase tracking-widest text-indigo-400">
                        Старт: {new Date(member.joinedAt).toLocaleDateString('ru-RU')}
                      </div>
                    )}
                  </div>
                </div>

                <div className="w-full space-y-4">
                  <div className="p-3 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 text-left space-y-3">
                    <p className="text-[8px] font-black uppercase text-indigo-400 tracking-[0.2em]">Цепочка согласований</p>
                    <div className="space-y-2">
                      {(member.approvalWorkflow || [
                        { action: 'Создание SKU', status: 'auto' },
                        { action: 'Публикация', status: 'manual', approverRole: 'Admin' }
                      ]).map((flow: any, idx: number) => (
                        <div key={idx} className="flex items-center justify-between">
                          <span className="text-[9px] font-bold text-white/70">{flow.action}</span>
                          <Badge className={cn(
                            "text-[6px] font-black uppercase px-1.5 py-0 border-none",
                            flow.status === 'auto' ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"
                          )}>
                            {flow.status === 'auto' ? 'Авто' : `+${flow.approverRole || 'Admin'}`}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 rounded-3xl bg-white/5 border border-white/10 text-left space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-black uppercase text-white/40 tracking-widest">Текущий статус</span>
                      <div className="flex items-center gap-1.5">
                        <div className={cn("h-1.5 w-1.5 rounded-full", member.isOnline ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse" : "bg-rose-500")} />
                        <span className={cn("text-[9px] font-black uppercase", member.isOnline ? "text-green-500" : "text-rose-500")}>
                          {member.isOnline ? 'В сети' : 'Оффлайн'}
                        </span>
                      </div>
                    </div>
                    {member.liveAction && member.isOnline && (
                      <div className="pt-3 border-t border-white/5">
                        <p className="text-[8px] font-black uppercase text-indigo-400 tracking-widest mb-1">Live Context 2.0</p>
                        <p className="text-[11px] font-bold text-white/90 leading-tight">{member.liveAction}</p>
                      </div>
                    )}
                    <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                      <span className="text-[9px] font-black uppercase text-white/40 tracking-widest">Нагрузка (Matrix Load)</span>
                      <span className={cn(
                        "text-[10px] font-black",
                        (member.workload || 0) > 80 ? "text-rose-400" : (member.workload || 0) > 50 ? "text-amber-400" : "text-emerald-400"
                      )}>{member.workload || 0}%</span>
                    </div>
                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${member.workload || 0}%` }}
                        className={cn(
                          "h-full rounded-full",
                          (member.workload || 0) > 80 ? "bg-rose-500" : (member.workload || 0) > 50 ? "bg-amber-500" : "bg-emerald-500"
                        )}
                      />
                    </div>
                  </div>

                  {[
                    { label: 'Хронология', value: 'timeline', icon: <History className="h-4 w-4" />, count: member.history?.length },
                    { label: 'Аналитика', value: 'analytics', icon: <BarChart2 className="h-4 w-4" /> },
                    { label: 'Задачи', value: 'tasks', icon: <CheckCircle2 className="h-4 w-4" />, count: 2 }
                  ].map((item) => (
                    <button
                      key={item.value}
                      onClick={() => setActiveView(item.value as any)}
                      className={cn(
                        "w-full flex items-center justify-between p-4 rounded-2xl transition-all font-black uppercase text-[10px] tracking-widest border",
                        activeView === item.value 
                          ? "bg-white text-slate-900 border-white shadow-xl translate-x-2" 
                          : "bg-white/5 text-white/40 border-transparent hover:bg-white/10 hover:text-white"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        {item.icon}
                        <span>{item.label}</span>
                      </div>
                      {item.count !== undefined && (
                        <span className={cn(
                          "h-5 min-w-[20px] rounded-lg flex items-center justify-center px-1.5 text-[8px]",
                          activeView === item.value ? "bg-indigo-600 text-white" : "bg-white/10 text-white/40"
                        )}>{item.count}</span>
                      )}
                    </button>
                  ))}
                </div>

                <div className="w-full pt-8 border-t border-white/5 space-y-4">
                  <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest">
                    <span className="text-white/20">ID Синхронизации Матрицы</span>
                    <span className="font-mono text-indigo-400">#00{member.id.split('-').pop()}</span>
                  </div>
                  <Button className="w-full h-12 bg-white text-black hover:bg-slate-100 rounded-2xl font-black uppercase tracking-widest text-[9px] button-glimmer shadow-xl">
                    Управление доступом
                  </Button>
                </div>
              </div>
            </ScrollArea>
          </div>

          <div className="flex-1 flex flex-col min-w-0 h-full">
            <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-10 shrink-0">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-slate-50 flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <h1 className="text-base font-black tracking-tighter uppercase text-slate-900 leading-none">
                    {activeView === 'timeline' ? 'Хронология активности' :
                     activeView === 'analytics' ? 'Метрики эффективности' : 'Центр управления задачами'}
                  </h1>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1.5">Аналитика Intel OS _ Синхронизация активна</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-slate-100"><X className="h-5 w-5" /></Button>
            </header>

            <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#f8f9fa] p-3">
              <div className="max-w-4xl mx-auto pb-24">
                {activeView === 'timeline' && <ActivityLog member={member} canComment={true} />}
                {activeView === 'analytics' && <MemberStats member={member} />}
                {activeView === 'tasks' && (
                  <div className="space-y-10 animate-in fade-in duration-700">
                    <div className="bg-indigo-600 rounded-xl p-4 text-white relative overflow-hidden shadow-2xl">
                      <div className="absolute top-0 right-0 p-3 opacity-10">
                        <Share2 className="h-40 w-40" />
                      </div>
                      <div className="relative z-10 space-y-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-sm font-black uppercase tracking-widest text-white/60 leading-none">Биржа задач департамента</h3>
                            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/40 mt-2">Internal Marketplace OS</p>
                          </div>
                          <Badge className="bg-white/20 text-white border-none text-[8px] font-black uppercase px-2 py-1">3 доступно</Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {[
                            { title: 'Аудит остатков склада', dept: 'Логистика', points: 150 },
                            { title: 'Проверка ТТН #112', dept: 'Документооборот', points: 50 }
                          ].map((task, i) => (
                            <div key={i} className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex items-center justify-between group hover:bg-white/20 transition-all cursor-pointer">
                              <div className="space-y-1">
                                <p className="text-[11px] font-black uppercase leading-tight">{task.title}</p>
                                <div className="flex items-center gap-2">
                                  <span className="text-[8px] font-bold text-white/40 uppercase">{task.dept}</span>
                                  <div className="h-1 w-1 rounded-full bg-indigo-400" />
                                  <span className="text-[8px] font-black text-indigo-300">+{task.points} XP</span>
                                </div>
                              </div>
                              <Button className="h-8 w-8 rounded-xl bg-white text-indigo-600 hover:scale-110 active:scale-95 transition-all p-0">
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="flex justify-between items-center px-4">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Персональный список задач</h3>
                        <Button className="h-9 bg-black text-white rounded-xl text-[9px] font-black uppercase tracking-widest px-6 shadow-xl transition-all hover:scale-105">Создать задачу</Button>
                      </div>
                      <div className="grid grid-cols-1 gap-3">
                        {[
                          { title: 'Звонок с байером Tsvetnoy', type: 'call', date: 'Завтра, 14:00', priority: 'high' },
                          { title: 'Корректировка Line-list SS26', type: 'data', date: 'Сегодня, 18:30', priority: 'medium' }
                        ].map((task, i) => (
                          <div key={i} className="p-4 rounded-xl bg-white border border-slate-100 flex items-center justify-between group/task hover:shadow-2xl transition-all duration-500 cursor-pointer">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-3xl bg-slate-50 shadow-sm flex items-center justify-center border border-slate-50 group-hover/task:rotate-6 group-hover/task:scale-110 transition-all duration-500">
                                {task.type === 'call' ? <PhoneIcon className="h-6 w-6 text-indigo-500" /> : <FileTextIcon className="h-6 w-6 text-amber-500" />}
                              </div>
                              <div className="space-y-1.5">
                                <p className="text-base font-black text-slate-900 tracking-tight leading-none uppercase">{task.title}</p>
                                <div className="flex items-center gap-3">
                                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1.5"><Clock className="h-3 w-3" /> {task.date}</span>
                                  <Badge className={cn(
                                    "text-[7px] font-black uppercase px-2 py-0.5 border-none",
                                    task.priority === 'high' ? "bg-rose-50 text-rose-500" : "bg-amber-50 text-amber-500"
                                  )}>Приоритет: {task.priority === 'high' ? 'Высокий' : 'Средний'}</Badge>
                                </div>
                              </div>
                            </div>
                            <Button variant="ghost" size="icon" className="h-12 w-12 rounded-2xl bg-slate-50 hover:bg-emerald-50 hover:text-emerald-600 transition-all shadow-inner"><Check className="h-5 w-5" /></Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
