import { useState, useMemo, useEffect } from 'react';
import {
  Users,
  UserPlus,
  Shield,
  ShieldCheck,
  History,
  Activity,
  Calendar as CalendarIcon,
  Settings,
  Archive,
  RotateCcw,
  MoreHorizontal,
  Search,
  Plus,
  X,
  Check,
  Mail,
  Phone,
  BarChart2,
  Clock,
  CheckCircle2,
  AlertCircle,
  Lock,
  Instagram,
  Send,
  MessageCircle,
  ExternalLink,
  Edit3,
  Camera,
  Save,
  Globe,
  User,
  Sparkles,
  Timer,
  MessageSquare,
  Heart,
  Eye,
  Target,
  Zap,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  FileText,
  ChevronDown,
  Loader2,
  Layers,
  Newspaper,
  Bot,
  Flame,
  Maximize2,
  Briefcase,
  Building2,
  Factory,
  Store,
  Warehouse,
  Truck,
  Share2,
  DollarSign,
  Trash2,
  Mic,
  Palette,
  Laptop,
  Phone as PhoneIcon,
  FileText as FileTextIcon,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
<<<<<<< HEAD
=======
import { getMetricSoftToneClass } from '@/lib/ui/semantic-data-tones';
>>>>>>> recover/cabinet-wip-from-stash
import { AnimatePresence, motion } from 'framer-motion';
import { TeamMember, TeamMemberStatus } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

const getCategoryIcon = (category?: string) => {
  switch (category) {
    case 'view':
<<<<<<< HEAD
      return <Eye className="h-3 w-3 text-slate-400" />;
=======
      return <Eye className="text-text-muted h-3 w-3" />;
>>>>>>> recover/cabinet-wip-from-stash
    case 'edit':
      return <Edit3 className="h-3 w-3 text-amber-500" />;
    case 'task':
      return <CheckCircle2 className="h-3 w-3 text-emerald-500" />;
    case 'system':
<<<<<<< HEAD
      return <Settings className="h-3 w-3 text-indigo-500" />;
    default:
      return <Activity className="h-3 w-3 text-slate-400" />;
=======
      return <Settings className="text-accent-primary h-3 w-3" />;
    default:
      return <Activity className="text-text-muted h-3 w-3" />;
>>>>>>> recover/cabinet-wip-from-stash
  }
};

const ActivityLog = ({ member, canComment }: { member: TeamMember; canComment?: boolean }) => {
  const [commentingId, setCommentingId] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');
  const { toast } = useToast();

  return (
    <div className="space-y-6">
<<<<<<< HEAD
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-50 bg-white/80 py-2 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-50">
            <History className="h-4 w-4 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-[11px] font-black uppercase leading-none tracking-widest text-slate-900">
              Хронология Intel OS
            </h3>
            <p className="mt-1 text-[8px] font-bold uppercase tracking-widest text-slate-400">
=======
      <div className="border-border-subtle sticky top-0 z-20 flex items-center justify-between border-b bg-white/80 py-2 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="bg-accent-primary/10 flex h-8 w-8 items-center justify-center rounded-xl">
            <History className="text-accent-primary h-4 w-4" />
          </div>
          <div>
            <h3 className="text-text-primary text-[11px] font-black uppercase leading-none tracking-widest">
              Хронология Intel OS
            </h3>
            <p className="text-text-muted mt-1 text-[8px] font-bold uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
              Реальное время синхронизации
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
<<<<<<< HEAD
          className="h-8 gap-2 rounded-xl border-slate-100 bg-white/50 text-[9px] font-black uppercase tracking-widest shadow-sm"
=======
          className="border-border-subtle h-8 gap-2 rounded-xl bg-white/50 text-[9px] font-black uppercase tracking-widest shadow-sm"
>>>>>>> recover/cabinet-wip-from-stash
        >
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
              className="group/log relative pb-6 pl-8 last:pb-0"
            >
<<<<<<< HEAD
              <div className="absolute bottom-0 left-[11px] top-4 w-[1px] bg-slate-100 group-last/log:hidden" />
              <div className="absolute left-0 top-1.5 z-10 flex h-[23px] w-[23px] items-center justify-center rounded-full border border-slate-100 bg-white shadow-sm">
                {getCategoryIcon(log.category)}
              </div>

              <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-all group-hover/log:border-indigo-100 group-hover/log:shadow-md">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-black uppercase tracking-tight text-slate-900">
                        {log.action}: <span className="text-indigo-600">{log.target}</span>
                      </span>
                      {log.duration && (
                        <div className="flex items-center gap-1 rounded-md bg-slate-50 px-1.5 py-0.5 text-[8px] font-black uppercase tracking-widest text-slate-400">
=======
              <div className="bg-bg-surface2 absolute bottom-0 left-[11px] top-4 w-[1px] group-last/log:hidden" />
              <div className="border-border-subtle absolute left-0 top-1.5 z-10 flex h-[23px] w-[23px] items-center justify-center rounded-full border bg-white shadow-sm">
                {getCategoryIcon(log.category)}
              </div>

              <div className="border-border-subtle group-hover/log:border-accent-primary/20 rounded-2xl border bg-white p-4 shadow-sm transition-all group-hover/log:shadow-md">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-text-primary text-[11px] font-black uppercase tracking-tight">
                        {log.action}: <span className="text-accent-primary">{log.target}</span>
                      </span>
                      {log.duration && (
                        <div className="bg-bg-surface2 text-text-muted flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[8px] font-black uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
                          <Timer className="h-2 w-2" /> {log.duration} м
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
<<<<<<< HEAD
                      <span className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-slate-400">
=======
                      <span className="text-text-muted flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
                        <Clock className="h-2.5 w-2.5" />
                        {new Date(log.date).toLocaleString('ru-RU', {
                          hour: '2-digit',
                          minute: '2-digit',
                          day: '2-digit',
                          month: 'short',
                        })}
                      </span>
                      {log.idleTime && (
                        <span className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-rose-400">
                          <AlertCircle className="h-2.5 w-2.5" />
                          Бездействие: {log.idleTime}м
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover/log:opacity-100">
                    {[
                      { icon: <Check className="h-3 w-3" />, label: 'ОК', color: 'emerald' },
                      { icon: <AlertCircle className="h-3 w-3" />, label: 'FIX', color: 'rose' },
                      { icon: <Heart className="h-3 w-3" />, label: 'WOW', color: 'pink' },
                      { icon: <MessageSquare className="h-3 w-3" />, label: 'QA', color: 'indigo' },
                    ].map((react, idx) => (
                      <Tooltip key={idx}>
                        <TooltipTrigger asChild>
                          <button
                            className={cn(
<<<<<<< HEAD
                              'flex h-7 items-center gap-1.5 rounded-lg border border-transparent px-2 transition-all hover:scale-110 hover:border-slate-100 active:scale-95',
                              react.color === 'emerald'
                                ? 'bg-emerald-50 text-emerald-600'
                                : react.color === 'rose'
                                  ? 'bg-rose-50 text-rose-600'
                                  : react.color === 'pink'
                                    ? 'bg-pink-50 text-pink-600'
                                    : 'bg-indigo-50 text-indigo-600'
=======
                              'hover:border-border-subtle flex h-7 items-center gap-1.5 rounded-lg border border-transparent px-2 transition-all hover:scale-110 active:scale-95',
                              getMetricSoftToneClass(react.color)
>>>>>>> recover/cabinet-wip-from-stash
                            )}
                            onClick={() =>
                              react.label === 'QA'
                                ? setCommentingId(log.id)
                                : toast({
                                    title: 'Реакция добавлена',
                                    description: `Действие отмечено как ${react.label}`,
                                  })
                            }
                          >
                            {react.icon}
                            <span className="text-[7px] font-black uppercase">{react.label}</span>
                          </button>
                        </TooltipTrigger>
                        <TooltipContent
                          side="top"
                          className="bg-black text-[8px] font-black uppercase text-white"
                        >
                          Быстрый фидбек
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </div>
                </div>

                {((log.comments && log.comments.length > 0) || commentingId === log.id) && (
<<<<<<< HEAD
                  <div className="mt-4 space-y-3 border-t border-slate-50 pt-4">
                    {log.comments?.map((comment) => (
                      <div
                        key={comment.id}
                        className="flex items-start gap-3 rounded-xl border border-slate-100/50 bg-slate-50/50 p-3"
                      >
                        <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-100 text-[10px] font-black text-indigo-600">
=======
                  <div className="border-border-subtle mt-4 space-y-3 border-t pt-4">
                    {log.comments?.map((comment) => (
                      <div
                        key={comment.id}
                        className="bg-bg-surface2/80 border-border-subtle/50 flex items-start gap-3 rounded-xl border p-3"
                      >
                        <div className="bg-accent-primary/15 text-accent-primary flex h-6 w-6 items-center justify-center rounded-lg text-[10px] font-black">
>>>>>>> recover/cabinet-wip-from-stash
                          {comment.user[0]}
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
<<<<<<< HEAD
                            <span className="text-[10px] font-black uppercase tracking-tight text-slate-900">
                              {comment.user}
                            </span>
                            <span className="text-[8px] font-bold uppercase text-slate-400">
                              {new Date(comment.date).toLocaleString('ru-RU')}
                            </span>
                          </div>
                          <p className="text-[11px] leading-relaxed text-slate-600">
=======
                            <span className="text-text-primary text-[10px] font-black uppercase tracking-tight">
                              {comment.user}
                            </span>
                            <span className="text-text-muted text-[8px] font-bold uppercase">
                              {new Date(comment.date).toLocaleString('ru-RU')}
                            </span>
                          </div>
                          <p className="text-text-secondary text-[11px] leading-relaxed">
>>>>>>> recover/cabinet-wip-from-stash
                            {comment.text}
                          </p>
                        </div>
                      </div>
                    ))}

                    {commentingId === log.id && (
                      <div className="mt-2 flex items-end gap-2 duration-300 animate-in slide-in-from-top-2">
                        <div className="flex-1 space-y-1.5">
<<<<<<< HEAD
                          <label className="ml-1 text-[8px] font-black uppercase text-slate-400">
=======
                          <label className="text-text-muted ml-1 text-[8px] font-black uppercase">
>>>>>>> recover/cabinet-wip-from-stash
                            Ваш комментарий / запрос обоснования
                          </label>
                          <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Напишите вопрос или отзыв..."
<<<<<<< HEAD
                            className="min-h-[60px] w-full rounded-xl border border-indigo-100 bg-white p-3 text-[11px] shadow-sm outline-none ring-indigo-500/10 transition-all focus:ring-2"
=======
                            className="border-accent-primary/20 ring-accent-primary/10 min-h-[60px] w-full rounded-xl border bg-white p-3 text-[11px] shadow-sm outline-none transition-all focus:ring-2"
>>>>>>> recover/cabinet-wip-from-stash
                          />
                        </div>
                        <div className="flex flex-col gap-2 pb-0.5">
                          <Button
                            size="icon"
                            className="h-8 w-8 rounded-lg bg-black text-white"
                            onClick={() => {
                              setCommentingId(null);
                              setNewComment('');
                            }}
                          >
                            <Send className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
<<<<<<< HEAD
                            className="h-8 w-8 rounded-lg text-slate-400"
=======
                            className="text-text-muted h-8 w-8 rounded-lg"
>>>>>>> recover/cabinet-wip-from-stash
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
<<<<<<< HEAD
          <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 py-12 text-center">
            <Activity className="mx-auto mb-3 h-8 w-8 text-slate-200" />
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
=======
          <div className="bg-bg-surface2/80 border-border-default rounded-xl border border-dashed py-12 text-center">
            <Activity className="text-text-muted mx-auto mb-3 h-8 w-8" />
            <p className="text-text-muted text-[10px] font-black uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
              Нет зафиксированной активности
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const MemberStats = ({ member }: { member: TeamMember }) => (
  <div className="space-y-10 duration-700 animate-in fade-in">
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
      {[
        {
          label: 'Эффективность',
          value: '94%',
          icon: <Zap className="h-5 w-5 text-amber-500" />,
          sub: '+12% к прошлой неделе',
        },
        {
          label: 'Загрузка матрицы',
          value: `${member.workload || 45}%`,
<<<<<<< HEAD
          icon: <Layers className="h-5 w-5 text-indigo-500" />,
=======
          icon: <Layers className="text-accent-primary h-5 w-5" />,
>>>>>>> recover/cabinet-wip-from-stash
          sub: member.workload && member.workload > 80 ? 'Перегружен' : 'Оптимально',
        },
        {
          label: 'Точность данных',
          value: '99.2%',
          icon: <ShieldCheck className="h-5 w-5 text-emerald-500" />,
          sub: 'Без ошибок за 48ч',
        },
        {
          label: 'Время в Intel OS',
          value: '6.4ч',
<<<<<<< HEAD
          icon: <Timer className="h-5 w-5 text-slate-500" />,
=======
          icon: <Timer className="text-text-secondary h-5 w-5" />,
>>>>>>> recover/cabinet-wip-from-stash
          sub: 'Среднее за день',
        },
      ].map((stat, i) => (
        <div
          key={i}
<<<<<<< HEAD
          className="group rounded-xl border border-slate-100 bg-white p-4 shadow-sm transition-all duration-500 hover:shadow-xl"
        >
          <div className="mb-4 flex items-center justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 transition-transform group-hover:scale-110">
=======
          className="border-border-subtle group rounded-xl border bg-white p-4 shadow-sm transition-all duration-500 hover:shadow-xl"
        >
          <div className="mb-4 flex items-center justify-between">
            <div className="bg-bg-surface2 flex h-12 w-12 items-center justify-center rounded-2xl transition-transform group-hover:scale-110">
>>>>>>> recover/cabinet-wip-from-stash
              {stat.icon}
            </div>
            <div className="h-2 w-2 rounded-full bg-emerald-500" />
          </div>
<<<<<<< HEAD
          <p className="text-base font-black tracking-tighter text-slate-900">{stat.value}</p>
          <p className="mt-1 text-[10px] font-black uppercase tracking-widest text-slate-400">
            {stat.label}
          </p>
          <p className="mt-2 text-[9px] font-bold text-slate-300">{stat.sub}</p>
=======
          <p className="text-text-primary text-base font-black tracking-tighter">{stat.value}</p>
          <p className="text-text-muted mt-1 text-[10px] font-black uppercase tracking-widest">
            {stat.label}
          </p>
          <p className="text-text-muted mt-2 text-[9px] font-bold">{stat.sub}</p>
>>>>>>> recover/cabinet-wip-from-stash
        </div>
      ))}
    </div>

    {member.kpiMetrics && (
<<<<<<< HEAD
      <div className="relative overflow-hidden rounded-xl bg-indigo-600 p-3 text-white shadow-2xl">
=======
      <div className="bg-accent-primary relative overflow-hidden rounded-xl p-3 text-white shadow-2xl">
>>>>>>> recover/cabinet-wip-from-stash
        <div className="absolute right-0 top-0 rotate-12 p-20 opacity-10">
          <Target className="h-64 w-64" />
        </div>
        <div className="relative z-10">
          <div className="mb-10 flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/20 backdrop-blur-md">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <h3 className="text-xs font-black uppercase tracking-widest text-white/60">
              Ключевые показатели роли (KPI Matrix)
            </h3>
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            {Object.entries(member.kpiMetrics).map(([key, metric]) => (
              <div key={key} className="space-y-4">
                <div className="flex items-end gap-3">
                  <span className="text-sm font-black leading-none tracking-tighter">
                    {metric.value}
                  </span>
                  <div
                    className={cn(
                      'mb-1 flex items-center gap-1 rounded-lg px-2 py-0.5 text-[9px] font-black uppercase',
                      metric.trend === 'up'
                        ? 'bg-emerald-400/20 text-emerald-300'
                        : metric.trend === 'down'
                          ? 'bg-rose-400/20 text-rose-300'
                          : 'bg-white/10 text-white/50'
                    )}
                  >
                    {metric.trend === 'up' ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : metric.trend === 'down' ? (
                      <TrendingDown className="h-3 w-3" />
                    ) : (
                      <Activity className="h-3 w-3" />
                    )}
                    {metric.trend === 'up' ? '+4%' : metric.trend === 'down' ? '-2%' : '0%'}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-white/80">
                    {metric.label}
                  </p>
                  <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${Math.min(100, (metric.value / (metric.value > 100 ? metric.value : 100)) * 100)}%`,
                      }}
                      className="h-full rounded-full bg-white"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )}

    <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
<<<<<<< HEAD
      <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
        <div className="mb-8 flex items-center justify-between">
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-900">
            Распределение ресурсов
          </h3>
          <TrendingUp className="h-4 w-4 text-slate-300" />
=======
      <div className="border-border-subtle rounded-xl border bg-white p-4 shadow-sm">
        <div className="mb-8 flex items-center justify-between">
          <h3 className="text-text-primary text-xs font-black uppercase tracking-widest">
            Распределение ресурсов
          </h3>
          <TrendingUp className="text-text-muted h-4 w-4" />
>>>>>>> recover/cabinet-wip-from-stash
        </div>
        <div className="space-y-6">
          {Object.entries(
            member.stats?.timeSpentBySection || { Управление: 120, Каталог: 80, Заказы: 45 }
          ).map(([section, time]) => (
            <div key={section} className="space-y-2.5">
              <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-tight">
<<<<<<< HEAD
                <span className="text-slate-600">{section}</span>
=======
                <span className="text-text-secondary">{section}</span>
>>>>>>> recover/cabinet-wip-from-stash
                <div className="flex items-center gap-2">
                  <span className="text-accent-primary">{time} мин</span>
                  <span className="text-text-muted">({Math.round((time / 480) * 100)}%)</span>
                </div>
              </div>
<<<<<<< HEAD
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-50 shadow-inner">
=======
              <div className="bg-bg-surface2 h-2 w-full overflow-hidden rounded-full shadow-inner">
>>>>>>> recover/cabinet-wip-from-stash
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, (time / 480) * 100)}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
<<<<<<< HEAD
                  className="h-full rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.3)]"
=======
                  className="bg-accent-primary h-full rounded-full shadow-[0_0_10px_rgba(99,102,241,0.3)]"
>>>>>>> recover/cabinet-wip-from-stash
                />
              </div>
            </div>
          ))}
        </div>
      </div>

<<<<<<< HEAD
      <div className="relative overflow-hidden rounded-xl bg-slate-900 p-4 text-white shadow-2xl">
=======
      <div className="bg-text-primary relative overflow-hidden rounded-xl p-4 text-white shadow-2xl">
>>>>>>> recover/cabinet-wip-from-stash
        <div className="absolute right-0 top-0 p-3 opacity-10">
          <Activity className="h-40 w-40" />
        </div>
        <div className="relative z-10 space-y-6">
          <h3 className="text-xs font-black uppercase tracking-widest text-white/40">
            Аналитика простоя
          </h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-[1.5rem] border border-rose-500/30 bg-rose-500/20">
                <Timer className="h-8 w-8 text-rose-400" />
              </div>
              <div>
                <p className="text-base font-black tracking-tighter">42 мин</p>
                <p className="mt-1 text-[10px] font-black uppercase tracking-widest text-white/30">
                  Среднее бездействие в сессии
                </p>
              </div>
            </div>

            <div className="space-y-3 rounded-2xl border border-white/5 bg-white/5 p-3">
              <p className="text-[9px] font-bold uppercase leading-relaxed tracking-widest text-white/60">
                Сотрудник проявляет пиковую активность в первой половине дня. В период с 14:00 до
                16:00 замечено снижение операционной скорости на{' '}
                <span className="text-rose-400">15%</span>.
              </p>
              <div className="flex gap-2">
                <Badge className="border-none bg-amber-500/20 text-[7px] font-black uppercase text-amber-400">
                  Нужен контроль
                </Badge>
<<<<<<< HEAD
                <Badge className="border-none bg-indigo-500/20 text-[7px] font-black uppercase text-indigo-400">
=======
                <Badge className="bg-accent-primary/20 text-accent-primary border-none text-[7px] font-black uppercase">
>>>>>>> recover/cabinet-wip-from-stash
                  Высокий потенциал
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export const IntelligenceHub = ({
  member,
  onClose,
}: {
  member: TeamMember;
  onClose: () => void;
}) => {
  const [activeView, setActiveView] = useState<'timeline' | 'analytics' | 'tasks'>('timeline');

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="h-[90vh] max-w-[95vw] overflow-hidden rounded-[3.5rem] border-none bg-[#f8f9fa] p-0 shadow-[0_0_100px_rgba(0,0,0,0.2)] md:max-w-6xl">
        <DialogTitle className="sr-only">
          Аналитика активности: {member.firstName} {member.lastName}
        </DialogTitle>
        <DialogDescription className="sr-only">
          Детальная история действий, аналитика эффективности и управление задачами сотрудника.
        </DialogDescription>
        <div className="flex h-full">
          {/* Left Sidebar Profile */}
<<<<<<< HEAD
          <div className="relative flex w-[320px] shrink-0 flex-col overflow-hidden bg-slate-900 text-white">
            <div className="absolute left-0 top-0 z-20 h-1 w-full bg-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.8)]" />
=======
          <div className="bg-text-primary relative flex w-[320px] shrink-0 flex-col overflow-hidden text-white">
            <div className="bg-accent-primary absolute left-0 top-0 z-20 h-1 w-full shadow-[0_0_20px_rgba(99,102,241,0.8)]" />
>>>>>>> recover/cabinet-wip-from-stash

            <ScrollArea className="custom-scrollbar-white flex-1">
              <div className="flex flex-col items-center space-y-4 p-4 text-center">
                <div className="group relative">
                  <Avatar className="h-32 w-24 rounded-xl border-4 border-white/10 object-cover shadow-2xl transition-transform duration-700 group-hover:rotate-3 group-hover:scale-105">
                    <AvatarImage src={member.avatar} className="object-cover" />
                    <AvatarFallback className="text-base font-black">
                      {member.firstName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={cn(
<<<<<<< HEAD
                      'absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-2xl border-4 border-slate-900 shadow-xl transition-all',
=======
                      'border-text-primary absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-2xl border-4 shadow-xl transition-all',
>>>>>>> recover/cabinet-wip-from-stash
                      member.isOnline ? 'animate-pulse bg-green-500' : 'bg-rose-500'
                    )}
                  >
                    <div className="h-2 w-2 rounded-full bg-white opacity-50" />
                  </div>
                </div>

                <div className="space-y-2">
                  <h2 className="text-base font-black uppercase leading-none tracking-tighter">
                    {member.firstName} {member.lastName}
                  </h2>
<<<<<<< HEAD
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">
=======
                  <p className="text-accent-primary text-[10px] font-black uppercase tracking-[0.2em]">
>>>>>>> recover/cabinet-wip-from-stash
                    {member.role}
                  </p>
                  <div className="mt-3 flex flex-wrap justify-center gap-2">
                    {member.department && (
                      <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[8px] font-black uppercase tracking-widest text-white/40">
                        {member.department}
                      </div>
                    )}
                    {member.joinedAt && (
<<<<<<< HEAD
                      <div className="rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 text-[8px] font-black uppercase tracking-widest text-indigo-400">
=======
                      <div className="bg-accent-primary/10 border-accent-primary/20 text-accent-primary rounded-full border px-3 py-1 text-[8px] font-black uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
                        Старт: {new Date(member.joinedAt).toLocaleDateString('ru-RU')}
                      </div>
                    )}
                  </div>
                </div>

                <div className="w-full space-y-4">
<<<<<<< HEAD
                  <div className="space-y-3 rounded-3xl border border-indigo-500/20 bg-indigo-500/10 p-3 text-left">
                    <p className="text-[8px] font-black uppercase tracking-[0.2em] text-indigo-400">
=======
                  <div className="bg-accent-primary/10 border-accent-primary/20 space-y-3 rounded-3xl border p-3 text-left">
                    <p className="text-accent-primary text-[8px] font-black uppercase tracking-[0.2em]">
>>>>>>> recover/cabinet-wip-from-stash
                      Цепочка согласований
                    </p>
                    <div className="space-y-2">
                      {(
                        member.approvalWorkflow || [
                          { action: 'Создание SKU', status: 'auto' },
                          { action: 'Публикация', status: 'manual', approverRole: 'Admin' },
                        ]
                      ).map((flow: any, idx: number) => (
                        <div key={idx} className="flex items-center justify-between">
                          <span className="text-[9px] font-bold text-white/70">{flow.action}</span>
                          <Badge
                            className={cn(
                              'border-none px-1.5 py-0 text-[6px] font-black uppercase',
                              flow.status === 'auto'
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : 'bg-amber-500/20 text-amber-400'
                            )}
                          >
                            {flow.status === 'auto' ? 'Авто' : `+${flow.approverRole || 'Admin'}`}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3 rounded-3xl border border-white/10 bg-white/5 p-3 text-left">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-black uppercase tracking-widest text-white/40">
                        Текущий статус
                      </span>
                      <div className="flex items-center gap-1.5">
                        <div
                          className={cn(
                            'h-1.5 w-1.5 rounded-full',
                            member.isOnline
                              ? 'animate-pulse bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]'
                              : 'bg-rose-500'
                          )}
                        />
                        <span
                          className={cn(
                            'text-[9px] font-black uppercase',
                            member.isOnline ? 'text-green-500' : 'text-rose-500'
                          )}
                        >
                          {member.isOnline ? 'В сети' : 'Оффлайн'}
                        </span>
                      </div>
                    </div>
                    {member.liveAction && member.isOnline && (
                      <div className="border-t border-white/5 pt-3">
<<<<<<< HEAD
                        <p className="mb-1 text-[8px] font-black uppercase tracking-widest text-indigo-400">
=======
                        <p className="text-accent-primary mb-1 text-[8px] font-black uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
                          Live Context 2.0
                        </p>
                        <p className="text-[11px] font-bold leading-tight text-white/90">
                          {member.liveAction}
                        </p>
                      </div>
                    )}
                    <div className="flex items-center justify-between border-t border-white/5 pt-3">
                      <span className="text-[9px] font-black uppercase tracking-widest text-white/40">
                        Нагрузка (Matrix Load)
                      </span>
                      <span
                        className={cn(
                          'text-[10px] font-black',
                          (member.workload || 0) > 80
                            ? 'text-rose-400'
                            : (member.workload || 0) > 50
                              ? 'text-amber-400'
                              : 'text-emerald-400'
                        )}
                      >
                        {member.workload || 0}%
                      </span>
                    </div>
                    <div className="h-1 w-full overflow-hidden rounded-full bg-white/5">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${member.workload || 0}%` }}
                        className={cn(
                          'h-full rounded-full',
                          (member.workload || 0) > 80
                            ? 'bg-rose-500'
                            : (member.workload || 0) > 50
                              ? 'bg-amber-500'
                              : 'bg-emerald-500'
                        )}
                      />
                    </div>
                  </div>

                  {[
                    {
                      label: 'Хронология',
                      value: 'timeline',
                      icon: <History className="h-4 w-4" />,
                      count: member.history?.length,
                    },
                    {
                      label: 'Аналитика',
                      value: 'analytics',
                      icon: <BarChart2 className="h-4 w-4" />,
                    },
                    {
                      label: 'Задачи',
                      value: 'tasks',
                      icon: <CheckCircle2 className="h-4 w-4" />,
                      count: 2,
                    },
                  ].map((item) => (
                    <button
                      key={item.value}
                      onClick={() => setActiveView(item.value as any)}
                      className={cn(
                        'flex w-full items-center justify-between rounded-2xl border p-4 text-[10px] font-black uppercase tracking-widest transition-all',
                        activeView === item.value
<<<<<<< HEAD
                          ? 'translate-x-2 border-white bg-white text-slate-900 shadow-xl'
=======
                          ? 'text-text-primary translate-x-2 border-white bg-white shadow-xl'
>>>>>>> recover/cabinet-wip-from-stash
                          : 'border-transparent bg-white/5 text-white/40 hover:bg-white/10 hover:text-white'
                      )}
                    >
                      <div className="flex items-center gap-3">
                        {item.icon}
                        <span>{item.label}</span>
                      </div>
                      {item.count !== undefined && (
                        <span
                          className={cn(
                            'flex h-5 min-w-[20px] items-center justify-center rounded-lg px-1.5 text-[8px]',
                            activeView === item.value
<<<<<<< HEAD
                              ? 'bg-indigo-600 text-white'
=======
                              ? 'bg-accent-primary text-white'
>>>>>>> recover/cabinet-wip-from-stash
                              : 'bg-white/10 text-white/40'
                          )}
                        >
                          {item.count}
                        </span>
                      )}
                    </button>
                  ))}
                </div>

                <div className="w-full space-y-4 border-t border-white/5 pt-8">
                  <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest">
                    <span className="text-white/20">ID Синхронизации Матрицы</span>
<<<<<<< HEAD
                    <span className="font-mono text-indigo-400">
                      #00{member.id.split('-').pop()}
                    </span>
                  </div>
                  <Button className="button-glimmer h-12 w-full rounded-2xl bg-white text-[9px] font-black uppercase tracking-widest text-black shadow-xl hover:bg-slate-100">
=======
                    <span className="text-accent-primary font-mono">
                      #00{member.id.split('-').pop()}
                    </span>
                  </div>
                  <Button className="hover:bg-bg-surface2 button-glimmer h-12 w-full rounded-2xl bg-white text-[9px] font-black uppercase tracking-widest text-black shadow-xl">
>>>>>>> recover/cabinet-wip-from-stash
                    Управление доступом
                  </Button>
                </div>
              </div>
            </ScrollArea>
          </div>

          <div className="flex h-full min-w-0 flex-1 flex-col">
<<<<<<< HEAD
            <header className="flex h-20 shrink-0 items-center justify-between border-b border-slate-100 bg-white px-10">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-50">
                  <Sparkles className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <h1 className="text-base font-black uppercase leading-none tracking-tighter text-slate-900">
=======
            <header className="border-border-subtle flex h-20 shrink-0 items-center justify-between border-b bg-white px-10">
              <div className="flex items-center gap-3">
                <div className="bg-bg-surface2 flex h-10 w-10 items-center justify-center rounded-2xl">
                  <Sparkles className="text-accent-primary h-5 w-5" />
                </div>
                <div>
                  <h1 className="text-text-primary text-base font-black uppercase leading-none tracking-tighter">
>>>>>>> recover/cabinet-wip-from-stash
                    {activeView === 'timeline'
                      ? 'Хронология активности'
                      : activeView === 'analytics'
                        ? 'Метрики эффективности'
                        : 'Центр управления задачами'}
                  </h1>
<<<<<<< HEAD
                  <p className="mt-1.5 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">
=======
                  <p className="text-text-muted mt-1.5 text-[9px] font-black uppercase tracking-[0.2em]">
>>>>>>> recover/cabinet-wip-from-stash
                    Аналитика Intel OS _ Синхронизация активна
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
<<<<<<< HEAD
                className="rounded-full hover:bg-slate-100"
=======
                className="hover:bg-bg-surface2 rounded-full"
>>>>>>> recover/cabinet-wip-from-stash
              >
                <X className="h-5 w-5" />
              </Button>
            </header>

            <div className="custom-scrollbar flex-1 overflow-y-auto bg-[#f8f9fa] p-3">
              <div className="mx-auto max-w-4xl pb-24">
                {activeView === 'timeline' && <ActivityLog member={member} canComment={true} />}
                {activeView === 'analytics' && <MemberStats member={member} />}
                {activeView === 'tasks' && (
                  <div className="space-y-10 duration-700 animate-in fade-in">
<<<<<<< HEAD
                    <div className="relative overflow-hidden rounded-xl bg-indigo-600 p-4 text-white shadow-2xl">
=======
                    <div className="bg-accent-primary relative overflow-hidden rounded-xl p-4 text-white shadow-2xl">
>>>>>>> recover/cabinet-wip-from-stash
                      <div className="absolute right-0 top-0 p-3 opacity-10">
                        <Share2 className="h-40 w-40" />
                      </div>
                      <div className="relative z-10 space-y-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-sm font-black uppercase leading-none tracking-widest text-white/60">
                              Биржа задач департамента
                            </h3>
                            <p className="mt-2 text-[9px] font-bold uppercase tracking-[0.2em] text-white/40">
                              Internal Marketplace OS
                            </p>
                          </div>
                          <Badge className="border-none bg-white/20 px-2 py-1 text-[8px] font-black uppercase text-white">
                            3 доступно
                          </Badge>
                        </div>
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                          {[
                            { title: 'Аудит остатков склада', dept: 'Логистика', points: 150 },
                            { title: 'Проверка ТТН #112', dept: 'Документооборот', points: 50 },
                          ].map((task, i) => (
                            <div
                              key={i}
                              className="group flex cursor-pointer items-center justify-between rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-md transition-all hover:bg-white/20"
                            >
                              <div className="space-y-1">
                                <p className="text-[11px] font-black uppercase leading-tight">
                                  {task.title}
                                </p>
                                <div className="flex items-center gap-2">
                                  <span className="text-[8px] font-bold uppercase text-white/40">
                                    {task.dept}
                                  </span>
<<<<<<< HEAD
                                  <div className="h-1 w-1 rounded-full bg-indigo-400" />
                                  <span className="text-[8px] font-black text-indigo-300">
=======
                                  <div className="bg-accent-primary/40 h-1 w-1 rounded-full" />
                                  <span className="text-accent-primary text-[8px] font-black">
>>>>>>> recover/cabinet-wip-from-stash
                                    +{task.points} XP
                                  </span>
                                </div>
                              </div>
<<<<<<< HEAD
                              <Button className="h-8 w-8 rounded-xl bg-white p-0 text-indigo-600 transition-all hover:scale-110 active:scale-95">
=======
                              <Button className="text-accent-primary h-8 w-8 rounded-xl bg-white p-0 transition-all hover:scale-110 active:scale-95">
>>>>>>> recover/cabinet-wip-from-stash
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="flex items-center justify-between px-4">
<<<<<<< HEAD
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">
=======
                        <h3 className="text-text-muted text-[10px] font-black uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
                          Персональный список задач
                        </h3>
                        <Button className="h-9 rounded-xl bg-black px-6 text-[9px] font-black uppercase tracking-widest text-white shadow-xl transition-all hover:scale-105">
                          Создать задачу
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 gap-3">
                        {[
                          {
                            title: 'Звонок с байером Tsvetnoy',
                            type: 'call',
                            date: 'Завтра, 14:00',
                            priority: 'high',
                          },
                          {
                            title: 'Корректировка Line-list SS26',
                            type: 'data',
                            date: 'Сегодня, 18:30',
                            priority: 'medium',
                          },
                        ].map((task, i) => (
                          <div
                            key={i}
<<<<<<< HEAD
                            className="group/task flex cursor-pointer items-center justify-between rounded-xl border border-slate-100 bg-white p-4 transition-all duration-500 hover:shadow-2xl"
                          >
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-3xl border border-slate-50 bg-slate-50 shadow-sm transition-all duration-500 group-hover/task:rotate-6 group-hover/task:scale-110">
                                {task.type === 'call' ? (
                                  <PhoneIcon className="h-6 w-6 text-indigo-500" />
=======
                            className="border-border-subtle group/task flex cursor-pointer items-center justify-between rounded-xl border bg-white p-4 transition-all duration-500 hover:shadow-2xl"
                          >
                            <div className="flex items-center gap-3">
                              <div className="bg-bg-surface2 border-border-subtle flex h-10 w-10 items-center justify-center rounded-3xl border shadow-sm transition-all duration-500 group-hover/task:rotate-6 group-hover/task:scale-110">
                                {task.type === 'call' ? (
                                  <PhoneIcon className="text-accent-primary h-6 w-6" />
>>>>>>> recover/cabinet-wip-from-stash
                                ) : (
                                  <FileTextIcon className="h-6 w-6 text-amber-500" />
                                )}
                              </div>
                              <div className="space-y-1.5">
<<<<<<< HEAD
                                <p className="text-base font-black uppercase leading-none tracking-tight text-slate-900">
                                  {task.title}
                                </p>
                                <div className="flex items-center gap-3">
                                  <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-400">
=======
                                <p className="text-text-primary text-base font-black uppercase leading-none tracking-tight">
                                  {task.title}
                                </p>
                                <div className="flex items-center gap-3">
                                  <span className="text-text-muted flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
                                    <Clock className="h-3 w-3" /> {task.date}
                                  </span>
                                  <Badge
                                    className={cn(
                                      'border-none px-2 py-0.5 text-[7px] font-black uppercase',
                                      task.priority === 'high'
                                        ? 'bg-rose-50 text-rose-500'
                                        : 'bg-amber-50 text-amber-500'
                                    )}
                                  >
                                    Приоритет: {task.priority === 'high' ? 'Высокий' : 'Средний'}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
<<<<<<< HEAD
                              className="h-12 w-12 rounded-2xl bg-slate-50 shadow-inner transition-all hover:bg-emerald-50 hover:text-emerald-600"
=======
                              className="bg-bg-surface2 h-12 w-12 rounded-2xl shadow-inner transition-all hover:bg-emerald-50 hover:text-emerald-600"
>>>>>>> recover/cabinet-wip-from-stash
                            >
                              <Check className="h-5 w-5" />
                            </Button>
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
