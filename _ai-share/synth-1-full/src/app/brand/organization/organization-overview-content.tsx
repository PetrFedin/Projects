'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/auth-provider';
import { useUIState } from '@/providers/ui-state';
import { CeoReportSheet, REPORT_DATA } from '@/components/brand/ceo-report-sheet';
import { registryFeedLayout } from '@/lib/ui/registry-feed-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Users,
  Building2,
  CreditCard,
  CircleDot,
  LayoutDashboard,
  FileText,
  ArrowRight,
  Calendar as CalendarIcon,
  ExternalLink,
  HelpCircle,
  RefreshCw,
  Plus,
  MessageSquare,
  Lock,
  LockOpen,
  Pencil,
  ShieldCheck,
  Zap,
  Settings,
  Award,
  CheckSquare,
  CheckCircle,
  UserCircle,
} from 'lucide-react';
import Link from 'next/link';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Progress } from '@/components/ui/progress';
import type { DateRange } from 'react-day-picker';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/lib/routes';
import { SectionBlock } from '@/components/brand/SectionBlock';
import {
  SECTION_META,
  ALERT_BLOCK_META,
  NAVIGATION_CARDS,
  PARTNER_COUNTS,
  PARTNER_GROWTH_BY_PERIOD,
  PARTNER_BUSINESS_PROCESSES,
  PARTNER_ECOSYSTEM_BLOCKS,
  PARTNER_ROLE_LABELS,
  ACTIVITY_PARTICIPANTS,
} from './page-data';
import type { RecentActivity } from './page-data';
import type { HistoryEntry } from '@/components/brand/SectionBlock';

type ActivityPeriod = '7d' | '30d' | { from: Date; to: Date };

export type OrganizationOverviewContentProps = {
  modulesPeriodKey: '7d' | '30d';
  orgProfile: any;
  orgDashboard: any;
  healthMetrics: any[];
  overallHealth: number;
  lastCheck: string;
  healthLoading: boolean;
  healthError: Error | null;
  refetchHealth: () => void;
  activityPeriod: ActivityPeriod;
  setActivityPeriod: (p: ActivityPeriod) => void;
  customRange: { from?: Date; to?: Date };
  setCustomRange: (r: { from?: Date; to?: Date }) => void;
  activityParticipant: string;
  setActivityParticipant: (p: string) => void;
  blockedActivities: RecentActivity[];
  setBlockedActivities: React.Dispatch<React.SetStateAction<RecentActivity[]>>;
  openBlockFor: number | null;
  setOpenBlockFor: (n: number | null) => void;
  openCommentFor: number | null;
  setOpenCommentFor: (n: number | null) => void;
  commentText: string;
  setCommentText: (s: string) => void;
  alertHelpKey: string | null;
  setAlertHelpKey: (k: string | null) => void;
  toast: any;
  alerts: any;
  getActiveDuration: any;
  getHistory: any;
  getBlockLabel: any;
  dismissCertificate: any;
  dismissProfile: any;
  dismissTask: any;
  attentionHistory: any[];
  filteredActivities: RecentActivity[];
  globalHistory: HistoryEntry[];
  formatHistoryTime: (ts: number) => string;
  activityKey: (a: RecentActivity) => string;
  isBlocked: (a: RecentActivity) => boolean;
  getCorrectionHref: (act: RecentActivity) => string;
  resolvedKey: string | null;
  participantsCount?: number;
  onlineCount?: number;
  [key: string]: unknown;
};

function formatActivityPeriod(period: ActivityPeriod): string {
  const today = new Date();
  const dd = (d: Date) =>
    d.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
  if (typeof period === 'object') {
    return `Период ${dd(period.from)}–${dd(period.to)}`;
  }
  const start = new Date(today);
  start.setDate(start.getDate() - (period === '7d' ? 6 : 29));
  return period === '7d' ? `Неделя ${dd(start)}–${dd(today)}` : `Месяц ${dd(start)}–${dd(today)}`;
}

type RoleReport = 'CEO' | 'CFO' | 'COO' | 'CTO' | 'CMO' | 'CIO' | 'CHRO' | 'CSO' | 'CDO';
const ROLE_REPORTS: { id: RoleReport; label: string; desc: string }[] = [
  { id: 'CEO', label: 'CEO', desc: 'Генеральный директор' },
  { id: 'CFO', label: 'CFO', desc: 'Финансовый директор' },
  { id: 'COO', label: 'COO', desc: 'Операционный директор' },
  { id: 'CTO', label: 'CTO', desc: 'Технический директор' },
  { id: 'CMO', label: 'CMO', desc: 'Директор по маркетингу' },
  { id: 'CIO', label: 'CIO', desc: 'IT-директор' },
  { id: 'CHRO', label: 'CHRO', desc: 'HR-директор' },
  { id: 'CSO', label: 'CSO', desc: 'Директор по стратегии' },
  { id: 'CDO', label: 'CDO', desc: 'Digital-директор' },
];

export function OrganizationOverviewContent(props: OrganizationOverviewContentProps) {
  const router = useRouter();
  const { profile } = useAuth();
  const { businessMode } = useUIState();
  const [activeReportRole, setActiveReportRole] = useState<RoleReport | null>(null);
  const [openHealthDetailFor, setOpenHealthDetailFor] = useState<number | null>(null);
  const canSeeRoleReports = !!profile;
  const {
    modulesPeriodKey,
    orgProfile,
    activityPeriod,
    setActivityPeriod,
    customRange,
    setCustomRange,
    activityParticipant,
    setActivityParticipant,
    blockedActivities,
    openBlockFor,
    setOpenBlockFor,
    openCommentFor,
    setOpenCommentFor,
    setBlockedActivities,
    commentText,
    setCommentText,
    filteredActivities,
    globalHistory,
    isBlocked,
    activityKey,
    getCorrectionHref,
    toast,
    formatHistoryTime,
    healthMetrics,
    overallHealth,
    lastCheck,
    healthLoading,
    healthError,
    refetchHealth,
    alerts,
    getBlockLabel,
    dismissCertificate,
    dismissProfile,
    dismissTask,
    participantsCount = 24,
    onlineCount = 8,
  } = props;

  return (
    <>
      {/* Organization Hub header */}
<<<<<<< HEAD
      <div className="rounded-2xl border border-slate-100 bg-gradient-to-br from-slate-50/50 to-white p-5 shadow-sm">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
=======
      <div className="border-border-subtle from-bg-surface2/50 rounded-2xl border bg-gradient-to-br to-white p-5 shadow-sm">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-accent-primary/15 text-accent-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
>>>>>>> recover/cabinet-wip-from-stash
                <LayoutDashboard className="h-5 w-5" />
              </div>
              <Badge variant="outline" className="text-[9px]">
                Organization Hub
              </Badge>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              {healthLoading ? (
                <>
<<<<<<< HEAD
                  <div className="h-6 w-32 animate-pulse rounded bg-slate-100" aria-hidden />
                  <span className="hidden text-slate-300 sm:inline">•</span>
                  <div className="h-6 w-16 animate-pulse rounded bg-slate-100" aria-hidden />
                  <span className="hidden text-slate-300 sm:inline">•</span>
                  <div className="h-6 w-24 animate-pulse rounded bg-slate-100" aria-hidden />
                  <span className="hidden text-slate-300 sm:inline">•</span>
                  <div className="h-6 w-20 animate-pulse rounded bg-slate-100" aria-hidden />
=======
                  <div className="bg-bg-surface2 h-6 w-32 animate-pulse rounded" aria-hidden />
                  <span className="text-text-muted hidden sm:inline">•</span>
                  <div className="bg-bg-surface2 h-6 w-16 animate-pulse rounded" aria-hidden />
                  <span className="text-text-muted hidden sm:inline">•</span>
                  <div className="bg-bg-surface2 h-6 w-24 animate-pulse rounded" aria-hidden />
                  <span className="text-text-muted hidden sm:inline">•</span>
                  <div className="bg-bg-surface2 h-6 w-20 animate-pulse rounded" aria-hidden />
>>>>>>> recover/cabinet-wip-from-stash
                </>
              ) : (
                <>
                  <Popover>
                    <PopoverTrigger asChild>
                      <button
<<<<<<< HEAD
                        className="-mx-1.5 flex items-center gap-1.5 rounded-lg px-1.5 py-0.5 text-[10px] font-black text-slate-500 transition-colors hover:bg-indigo-50 hover:text-indigo-600"
=======
                        className="text-text-secondary hover:text-accent-primary hover:bg-accent-primary/10 -mx-1.5 flex items-center gap-1.5 rounded-lg px-1.5 py-0.5 text-[10px] font-black transition-colors"
>>>>>>> recover/cabinet-wip-from-stash
                        aria-label="Профиль организации"
                      >
                        <Building2 className="h-3 w-3" />
                        {orgProfile?.brand?.name ?? 'Syntha HQ'}
                      </button>
                    </PopoverTrigger>
                    <PopoverContent
                      align="end"
<<<<<<< HEAD
                      className="w-72 rounded-xl border-slate-200 p-4 shadow-xl"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100">
                            <Building2 className="h-4 w-4 text-indigo-600" />
                          </div>
                          <div>
                            <h4 className="text-[10px] font-black uppercase text-slate-900">
                              {orgProfile?.brand?.name ?? 'Syntha HQ'}
                            </h4>
                            <p className="text-[8px] text-slate-500">Организация</p>
                          </div>
                        </div>
                        <div className="space-y-1.5 text-[9px] text-slate-600">
                          <p>
                            <span className="font-bold text-slate-500">Юр. лицо:</span>{' '}
                            {orgProfile?.legal?.legal_name ?? 'ООО «Синта Фэшн»'}
                          </p>
                          <p>
                            <span className="font-bold text-slate-500">ИНН:</span>{' '}
=======
                      className="border-border-default w-72 rounded-xl p-4 shadow-xl"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <div className="bg-accent-primary/15 flex h-8 w-8 items-center justify-center rounded-lg">
                            <Building2 className="text-accent-primary h-4 w-4" />
                          </div>
                          <div>
                            <h4 className="text-text-primary text-[10px] font-black uppercase">
                              {orgProfile?.brand?.name ?? 'Syntha HQ'}
                            </h4>
                            <p className="text-text-secondary text-[8px]">Организация</p>
                          </div>
                        </div>
                        <div className="text-text-secondary space-y-1.5 text-[9px]">
                          <p>
                            <span className="text-text-secondary font-bold">Юр. лицо:</span>{' '}
                            {orgProfile?.legal?.legal_name ?? 'ООО «Синта Фэшн»'}
                          </p>
                          <p>
                            <span className="text-text-secondary font-bold">ИНН:</span>{' '}
>>>>>>> recover/cabinet-wip-from-stash
                            {orgProfile?.legal?.inn ?? '7701234567'}
                          </p>
                        </div>
                        <Button
                          asChild
                          size="sm"
                          variant="outline"
                          className="h-7 w-full text-[9px] font-black uppercase"
                        >
<<<<<<< HEAD
                          <Link href="/brand" className="flex items-center justify-center gap-1.5">
=======
                          <Link
                            href={ROUTES.brand.home}
                            className="flex items-center justify-center gap-1.5"
                          >
>>>>>>> recover/cabinet-wip-from-stash
                            Профиль бренда <ExternalLink className="h-3 w-3" />
                          </Link>
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
<<<<<<< HEAD
                  <span className="hidden text-slate-300 sm:inline">•</span>
=======
                  <span className="text-text-muted hidden sm:inline">•</span>
>>>>>>> recover/cabinet-wip-from-stash
                  <Popover>
                    <PopoverTrigger asChild>
                      <button
                        className="-mx-1.5 rounded-lg px-1.5 py-0.5 transition-colors hover:bg-emerald-50"
                        aria-label="Подписка Elite"
                      >
                        <Badge
                          variant="outline"
                          className="cursor-pointer border-emerald-200 text-[9px] font-bold text-emerald-600 hover:border-emerald-400"
                        >
                          Elite
                        </Badge>
                      </button>
                    </PopoverTrigger>
                    <PopoverContent
                      align="end"
<<<<<<< HEAD
                      className="w-72 rounded-xl border-slate-200 p-4 shadow-xl"
                    >
                      <div className="space-y-3">
                        <h4 className="text-[10px] font-black uppercase text-slate-900">
                          Elite Plan
                        </h4>
                        <p className="text-[8px] text-slate-500">Подписка</p>
=======
                      className="border-border-default w-72 rounded-xl p-4 shadow-xl"
                    >
                      <div className="space-y-3">
                        <h4 className="text-text-primary text-[10px] font-black uppercase">
                          Elite Plan
                        </h4>
                        <p className="text-text-secondary text-[8px]">Подписка</p>
>>>>>>> recover/cabinet-wip-from-stash
                        <Button
                          asChild
                          size="sm"
                          variant="outline"
                          className="h-7 w-full text-[9px] font-black uppercase"
                        >
                          <Link
<<<<<<< HEAD
                            href="/brand/subscription"
=======
                            href={ROUTES.brand.subscription}
>>>>>>> recover/cabinet-wip-from-stash
                            className="flex items-center justify-center gap-1.5"
                          >
                            Подписка и биллинг <ExternalLink className="h-3 w-3" />
                          </Link>
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
<<<<<<< HEAD
                  <span className="hidden text-slate-300 sm:inline">•</span>
                  <Popover>
                    <PopoverTrigger asChild>
                      <button
                        className="-mx-1.5 flex items-center gap-1.5 rounded-lg px-1.5 py-0.5 text-[10px] font-black text-slate-500 hover:bg-indigo-50 hover:text-indigo-600"
=======
                  <span className="text-text-muted hidden sm:inline">•</span>
                  <Popover>
                    <PopoverTrigger asChild>
                      <button
                        className="text-text-secondary hover:text-accent-primary hover:bg-accent-primary/10 -mx-1.5 flex items-center gap-1.5 rounded-lg px-1.5 py-0.5 text-[10px] font-black"
>>>>>>> recover/cabinet-wip-from-stash
                        aria-label={`Команда: ${participantsCount} участников`}
                      >
                        <Users className="h-3 w-3" /> {participantsCount} участников
                      </button>
                    </PopoverTrigger>
                    <PopoverContent
                      align="end"
<<<<<<< HEAD
                      className="w-72 rounded-xl border-slate-200 p-4 shadow-xl"
                    >
                      <h4 className="text-[10px] font-black uppercase text-slate-900">Команда</h4>
                      <p className="text-[8px] text-slate-500">{participantsCount} участников</p>
=======
                      className="border-border-default w-72 rounded-xl p-4 shadow-xl"
                    >
                      <h4 className="text-text-primary text-[10px] font-black uppercase">
                        Команда
                      </h4>
                      <p className="text-text-secondary text-[8px]">
                        {participantsCount} участников
                      </p>
>>>>>>> recover/cabinet-wip-from-stash
                      <Button
                        asChild
                        size="sm"
                        variant="outline"
                        className="mt-2 h-7 w-full text-[9px] font-black uppercase"
                      >
                        <Link
<<<<<<< HEAD
                          href="/brand/team"
=======
                          href={ROUTES.brand.team}
>>>>>>> recover/cabinet-wip-from-stash
                          className="flex items-center justify-center gap-1.5"
                        >
                          Команда и активность <ExternalLink className="h-3 w-3" />
                        </Link>
                      </Button>
                    </PopoverContent>
                  </Popover>
<<<<<<< HEAD
                  <span className="hidden text-slate-300 sm:inline">•</span>
=======
                  <span className="text-text-muted hidden sm:inline">•</span>
>>>>>>> recover/cabinet-wip-from-stash
                  <Popover>
                    <PopoverTrigger asChild>
                      <button
                        className="-mx-1.5 flex items-center gap-1.5 rounded-lg px-1.5 py-0.5 text-[10px] font-black text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
                        aria-label={`Сейчас онлайн: ${onlineCount} из ${participantsCount}`}
                      >
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />{' '}
                        {onlineCount} онлайн
                      </button>
                    </PopoverTrigger>
                    <PopoverContent
                      align="end"
<<<<<<< HEAD
                      className="w-72 rounded-xl border-slate-200 p-4 shadow-xl"
                    >
                      <h4 className="text-[10px] font-black uppercase text-slate-900">
                        Сейчас онлайн
                      </h4>
                      <p className="text-[8px] text-slate-500">
=======
                      className="border-border-default w-72 rounded-xl p-4 shadow-xl"
                    >
                      <h4 className="text-text-primary text-[10px] font-black uppercase">
                        Сейчас онлайн
                      </h4>
                      <p className="text-text-secondary text-[8px]">
>>>>>>> recover/cabinet-wip-from-stash
                        {onlineCount} из {participantsCount} в системе
                      </p>
                    </PopoverContent>
                  </Popover>
                </>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
<<<<<<< HEAD
                <div className="h-3.5 w-1 shrink-0 rounded-full bg-indigo-500" />
                <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Организация
                </h2>
              </div>
              <h3 className="text-sm font-black uppercase text-slate-900">Центр управления</h3>
              <div className="flex items-center gap-2 text-[8px] font-bold uppercase tracking-widest text-slate-400">
                <Link
                  href="/brand?group=strategy&tab=overview"
                  className="transition-colors hover:text-indigo-600"
                >
                  Обзор
                </Link>
                <span className="text-slate-300">›</span>
                <span className="text-indigo-600">Центр управления</span>
              </div>
            </div>
            <div className="flex shrink-0 flex-wrap items-center gap-2">
              <span className="text-[9px] font-bold uppercase text-slate-400">
                Период:
                {typeof activityPeriod === 'object' && (
                  <span className="ml-1 font-normal normal-case text-slate-500">
=======
                <div className="bg-accent-primary h-3.5 w-1 shrink-0 rounded-full" />
                <h2 className="text-text-muted text-[10px] font-black uppercase tracking-widest">
                  Организация
                </h2>
              </div>
              <h3 className="text-text-primary text-sm font-black uppercase">Центр управления</h3>
              <div className="text-text-muted flex items-center gap-2 text-[8px] font-bold uppercase tracking-widest">
                <Link
                  href={ROUTES.brand.strategyOverview}
                  className="hover:text-accent-primary transition-colors"
                >
                  Обзор
                </Link>
                <span className="text-text-muted">›</span>
                <span className="text-accent-primary">Центр управления</span>
              </div>
            </div>
            <div className="flex shrink-0 flex-wrap items-center gap-2">
              <span className="text-text-muted text-[9px] font-bold uppercase">
                Период:
                {typeof activityPeriod === 'object' && (
                  <span className="text-text-secondary ml-1 font-normal normal-case">
>>>>>>> recover/cabinet-wip-from-stash
                    {formatActivityPeriod(activityPeriod)}
                  </span>
                )}
              </span>
<<<<<<< HEAD
              <div className="flex h-[26px] items-center gap-1 rounded-[4px] border border-slate-200 bg-slate-50 p-0.5 shadow-sm">
=======
              <div className="bg-bg-surface2 border-border-default flex h-[26px] items-center gap-1 rounded-[4px] border p-0.5 shadow-sm">
>>>>>>> recover/cabinet-wip-from-stash
                {(['7d', '30d'] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setActivityPeriod(p)}
                    aria-label={p === '7d' ? 'Период: 7 дней' : 'Период: 30 дней'}
                    aria-pressed={activityPeriod === p}
                    className={cn(
                      'flex h-[20px] min-h-[20px] items-center rounded-[2px] px-2.5 text-[9px] font-black uppercase tracking-widest transition-all',
                      activityPeriod === p
<<<<<<< HEAD
                        ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                        : 'text-slate-400 hover:bg-white/50 hover:text-slate-600'
=======
                        ? 'text-text-primary ring-border-default bg-white shadow-sm ring-1'
                        : 'text-text-muted hover:text-text-secondary hover:bg-white/50'
>>>>>>> recover/cabinet-wip-from-stash
                    )}
                  >
                    {p === '7d' ? '7 дней' : '30 дней'}
                  </button>
                ))}
                <Popover>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      aria-label="Выбрать период по календарю"
                      aria-expanded={typeof activityPeriod === 'object'}
                      className={cn(
                        'flex h-[20px] min-h-[20px] items-center gap-1 rounded-[2px] px-2.5 text-[9px] font-black uppercase tracking-widest transition-all',
                        typeof activityPeriod === 'object'
<<<<<<< HEAD
                          ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                          : 'text-slate-400 hover:bg-white/50 hover:text-slate-600'
=======
                          ? 'text-text-primary ring-border-default bg-white shadow-sm ring-1'
                          : 'text-text-muted hover:text-text-secondary hover:bg-white/50'
>>>>>>> recover/cabinet-wip-from-stash
                      )}
                    >
                      <CalendarIcon className="h-3 w-3" /> Календарь
                    </button>
                  </PopoverTrigger>
                  <PopoverContent
                    align="end"
<<<<<<< HEAD
                    className="w-auto rounded-xl border-slate-200 p-0 shadow-xl"
=======
                    className="border-border-default w-auto rounded-xl p-0 shadow-xl"
>>>>>>> recover/cabinet-wip-from-stash
                  >
                    <CalendarComponent
                      mode="range"
                      selected={
                        (typeof activityPeriod === 'object'
                          ? { from: activityPeriod.from, to: activityPeriod.to }
                          : customRange.from
                            ? { from: customRange.from, to: customRange.to ?? customRange.from }
                            : undefined) as DateRange | undefined
                      }
                      onSelect={(range) => {
                        if (range?.from) {
                          setCustomRange(range);
                          const to = range.to ?? range.from;
                          setActivityPeriod({ from: range.from, to });
                        }
                      }}
                      defaultMonth={
                        typeof activityPeriod === 'object' ? activityPeriod.from : new Date()
                      }
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Результаты бренда по ролям — вид владельца / C-Suite (только для владельцев и пользователей с ролью в профиле) */}
      {canSeeRoleReports && (
        <SectionBlock
          title="Результаты бренда по ролям"
          meta={{
            description: 'Краткое описание результатов бренда с позиции CEO, CFO, COO и др.',
            purpose:
              'Для владельцев и пользователей, зарегистрированных под соответствующей ролью.',
            functionality: ['Отчёт CEO', 'Отчёт CFO', 'Отчёт COO', 'и др.'],
            importance: 7,
          }}
          accentColor="indigo"
          className="min-w-0"
        >
<<<<<<< HEAD
          <Card className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="mb-3 text-[10px] text-slate-500">
=======
          <div className={cn(registryFeedLayout.panelCardSoft, 'p-4')}>
            <p className="text-text-secondary mb-3 text-[10px]">
>>>>>>> recover/cabinet-wip-from-stash
              Выберите роль для просмотра сводки результатов бренда с её позиции:
            </p>
            <div className="flex flex-wrap gap-2">
              {ROLE_REPORTS.filter((r) => {
                const rd = (REPORT_DATA as Record<string, { scope?: string }>)[r.id];
                return !rd || rd.scope === 'shared' || rd.scope === businessMode;
              }).map((role) => (
                <Button
                  key={role.id}
                  variant="outline"
                  size="sm"
<<<<<<< HEAD
                  className="h-8 gap-1.5 border-slate-200 px-3 text-[9px] font-bold uppercase hover:border-indigo-200 hover:bg-indigo-50/50"
=======
                  className="border-border-default hover:border-accent-primary/30 hover:bg-accent-primary/10 h-8 gap-1.5 px-3 text-[9px] font-bold uppercase"
>>>>>>> recover/cabinet-wip-from-stash
                  onClick={() => setActiveReportRole(role.id)}
                >
                  <UserCircle className="h-3 w-3" /> {role.label}
                </Button>
              ))}
            </div>
          </div>
          <CeoReportSheet
            open={!!activeReportRole}
            onOpenChange={(open) => !open && setActiveReportRole(null)}
            role={activeReportRole || 'CEO'}
          />
        </SectionBlock>
      )}

      {/* Требует внимания */}
      <SectionBlock
        title="Требует внимания"
        meta={SECTION_META.alerts}
        accentColor="rose"
        className="min-w-0 overflow-hidden"
        history={globalHistory}
      >
<<<<<<< HEAD
        <Card className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
=======
        <div className={cn(registryFeedLayout.panelCardSoft, 'p-4 md:p-5')}>
>>>>>>> recover/cabinet-wip-from-stash
          <div className="flex h-[200px] flex-nowrap gap-3 overflow-x-auto pb-1 pt-1">
            {healthLoading ? (
              <>
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
<<<<<<< HEAD
                    className="h-[200px] w-[240px] min-w-[240px] shrink-0 animate-pulse rounded-xl border border-slate-100 bg-slate-50"
=======
                    className="border-border-subtle bg-bg-surface2 h-[200px] w-[240px] min-w-[240px] shrink-0 animate-pulse rounded-xl border"
>>>>>>> recover/cabinet-wip-from-stash
                    aria-hidden
                  />
                ))}
              </>
            ) : !alerts?.certificates?.length &&
              !alerts?.profile?.length &&
              !alerts?.tasks?.length &&
              !alerts?.integrationIssues?.length ? (
              <div className="flex h-[200px] w-[240px] min-w-[240px] shrink-0 flex-col items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50/50 p-3 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                  <CheckCircle className="h-6 w-6 text-emerald-600" />
                </div>
                <p className="text-[10px] font-black uppercase text-emerald-800">Всё в порядке</p>
                <p className="text-[9px] text-emerald-700">Нет срочных действий</p>
              </div>
            ) : (
              <>
                {/* Истекающие сертификаты */}
                {alerts?.certificates?.length > 0 &&
                  (() => {
                    const meta = ALERT_BLOCK_META.certificates;
                    return (
                      <div className="h-[200px] w-[240px] min-w-[240px] shrink-0">
                        <Popover>
                          <PopoverTrigger asChild>
                            <div
                              role="button"
                              tabIndex={0}
                              className="flex h-full cursor-pointer flex-col rounded-xl border border-amber-200 bg-amber-50/50 p-3 outline-none transition-colors hover:bg-amber-50/80 focus-visible:ring-2 focus-visible:ring-amber-300"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                  e.preventDefault();
                                  (e.currentTarget as HTMLElement).click();
                                }
                              }}
                            >
                              <div className="mb-2 flex shrink-0 items-center justify-between gap-2">
                                <div className="flex min-w-0 items-center gap-2">
                                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-100">
                                    <Award className="h-4 w-4 text-amber-600" />
                                  </div>
                                  <h4 className="truncate text-[9px] font-black uppercase text-amber-800">
                                    {getBlockLabel?.('certificates') ?? meta.title}
                                  </h4>
                                </div>
                                <div onClick={(e) => e.stopPropagation()} className="shrink-0">
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <button
                                        type="button"
<<<<<<< HEAD
                                        className="rounded p-0.5 text-slate-400 hover:bg-amber-100 hover:text-amber-600"
=======
                                        className="text-text-muted rounded p-0.5 hover:bg-amber-100 hover:text-amber-600"
>>>>>>> recover/cabinet-wip-from-stash
                                        aria-label="Описание блока"
                                      >
                                        <HelpCircle className="h-3.5 w-3.5" />
                                      </button>
                                    </PopoverTrigger>
                                    <PopoverContent
                                      align="end"
                                      className="w-72 rounded-xl p-3 text-left"
                                    >
<<<<<<< HEAD
                                      <p className="text-[10px] leading-relaxed text-slate-600">
=======
                                      <p className="text-text-secondary text-[10px] leading-relaxed">
>>>>>>> recover/cabinet-wip-from-stash
                                        {meta.description}
                                      </p>
                                    </PopoverContent>
                                  </Popover>
                                </div>
                              </div>
                              <ul className="mb-2 min-h-0 flex-1 space-y-1.5 overflow-auto">
                                {alerts.certificates.map(
                                  (c: { id: string; name: string; daysLeft: number }) => (
                                    <li
                                      key={c.id}
<<<<<<< HEAD
                                      className="flex items-center justify-between gap-2 text-[10px] text-slate-700"
=======
                                      className="text-text-primary flex items-center justify-between gap-2 text-[10px]"
>>>>>>> recover/cabinet-wip-from-stash
                                    >
                                      <span className="truncate">{c.name}</span>
                                      <span className="shrink-0 font-bold text-amber-600">
                                        {c.daysLeft} дн.
                                      </span>
                                      <Link
                                        href={meta.detailHref}
                                        className="shrink-0 text-[8px] font-semibold text-amber-700 hover:underline"
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        Устранить
                                      </Link>
                                    </li>
                                  )
                                )}
                              </ul>
                              <div className="mt-auto flex justify-start gap-2">
                                <Link
                                  href={meta.detailHref}
                                  className="inline-flex items-center gap-0.5 text-[9px] font-semibold text-amber-700 hover:underline"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  Детально <ArrowRight className="h-3 w-3" />
                                </Link>
                              </div>
                            </div>
                          </PopoverTrigger>
                          <PopoverContent
                            align="start"
                            className="max-h-[80vh] w-[320px] overflow-y-auto rounded-xl p-4"
                          >
                            <h4 className="mb-2 text-[10px] font-black uppercase text-amber-800">
                              {meta.title}
                            </h4>
<<<<<<< HEAD
                            <p className="mb-3 text-[10px] leading-relaxed text-slate-600">
=======
                            <p className="text-text-secondary mb-3 text-[10px] leading-relaxed">
>>>>>>> recover/cabinet-wip-from-stash
                              {meta.description}
                            </p>
                            <ul className="mb-3 space-y-1.5">
                              {alerts.certificates.map(
                                (c: { id: string; name: string; daysLeft: number }) => (
                                  <li
                                    key={c.id}
<<<<<<< HEAD
                                    className="flex items-center justify-between gap-2 text-[10px] text-slate-700"
=======
                                    className="text-text-primary flex items-center justify-between gap-2 text-[10px]"
>>>>>>> recover/cabinet-wip-from-stash
                                  >
                                    <span className="truncate">{c.name}</span>
                                    <span className="shrink-0 font-bold text-amber-600">
                                      {c.daysLeft} дн.
                                    </span>
                                    <Link
                                      href={meta.detailHref}
                                      className="shrink-0 text-[8px] font-semibold text-amber-700 hover:underline"
                                    >
                                      Устранить
                                    </Link>
                                  </li>
                                )
                              )}
                            </ul>
                            <div className="flex justify-start">
                              <Button
                                asChild
                                variant="outline"
                                size="sm"
                                className="text-[9px] font-bold"
                              >
                                <Link
                                  href={meta.detailHref}
                                  className="inline-flex items-center gap-0.5"
                                >
                                  Детально <ArrowRight className="h-3 w-3" />
                                </Link>
                              </Button>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                    );
                  })()}
                {/* Незаполненные данные */}
                {alerts?.profile?.length > 0 &&
                  (() => {
                    const meta = ALERT_BLOCK_META.profile;
                    return (
                      <div className="h-[200px] w-[240px] min-w-[240px] shrink-0">
                        <Popover>
                          <PopoverTrigger asChild>
                            <div
                              role="button"
                              tabIndex={0}
                              className="flex h-full cursor-pointer flex-col rounded-xl border border-rose-200 bg-rose-50/50 p-3 outline-none transition-colors hover:bg-rose-50/80 focus-visible:ring-2 focus-visible:ring-rose-300"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                  e.preventDefault();
                                  (e.currentTarget as HTMLElement).click();
                                }
                              }}
                            >
                              <div className="mb-2 flex shrink-0 items-center justify-between gap-2">
                                <div className="flex min-w-0 items-center gap-2">
                                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-rose-100">
                                    <Building2 className="h-4 w-4 text-rose-600" />
                                  </div>
                                  <h4 className="truncate text-[9px] font-black uppercase text-rose-800">
                                    {getBlockLabel?.('profile') ?? meta.title}
                                  </h4>
                                </div>
                                <div onClick={(e) => e.stopPropagation()}>
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <button
                                        type="button"
<<<<<<< HEAD
                                        className="rounded p-0.5 text-slate-400 hover:bg-rose-100 hover:text-rose-600"
=======
                                        className="text-text-muted rounded p-0.5 hover:bg-rose-100 hover:text-rose-600"
>>>>>>> recover/cabinet-wip-from-stash
                                        aria-label="Описание блока"
                                      >
                                        <HelpCircle className="h-3.5 w-3.5" />
                                      </button>
                                    </PopoverTrigger>
                                    <PopoverContent
                                      align="end"
                                      className="w-72 rounded-xl p-3 text-left"
                                    >
<<<<<<< HEAD
                                      <p className="text-[10px] leading-relaxed text-slate-600">
=======
                                      <p className="text-text-secondary text-[10px] leading-relaxed">
>>>>>>> recover/cabinet-wip-from-stash
                                        {meta.description}
                                      </p>
                                    </PopoverContent>
                                  </Popover>
                                </div>
                              </div>
                              <ul className="mb-2 min-h-0 flex-1 space-y-1.5 overflow-auto">
                                {alerts.profile.map(
                                  (p: { id: string; name: string; detail: string }) => (
                                    <li
                                      key={p.id}
<<<<<<< HEAD
                                      className="flex items-center justify-between gap-2 text-[10px] text-slate-700"
=======
                                      className="text-text-primary flex items-center justify-between gap-2 text-[10px]"
>>>>>>> recover/cabinet-wip-from-stash
                                    >
                                      <span className="truncate" title={p.detail}>
                                        {p.name} — {p.detail}
                                      </span>
                                      <Link
                                        href={meta.detailHref}
                                        className="shrink-0 text-[8px] font-semibold text-rose-700 hover:underline"
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        Устранить
                                      </Link>
                                    </li>
                                  )
                                )}
                              </ul>
                              <div className="mt-auto flex justify-start gap-2">
                                <Link
                                  href={meta.detailHref}
                                  className="inline-flex items-center gap-0.5 text-[9px] font-semibold text-rose-700 hover:underline"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  Детально <ArrowRight className="h-3 w-3" />
                                </Link>
                              </div>
                            </div>
                          </PopoverTrigger>
                          <PopoverContent
                            align="start"
                            className="max-h-[80vh] w-[320px] overflow-y-auto rounded-xl p-4"
                          >
                            <h4 className="mb-2 text-[10px] font-black uppercase text-rose-800">
                              {meta.title}
                            </h4>
<<<<<<< HEAD
                            <p className="mb-3 text-[10px] leading-relaxed text-slate-600">
=======
                            <p className="text-text-secondary mb-3 text-[10px] leading-relaxed">
>>>>>>> recover/cabinet-wip-from-stash
                              {meta.description}
                            </p>
                            <ul className="mb-3 space-y-1.5">
                              {alerts.profile.map(
                                (p: { id: string; name: string; detail: string }) => (
                                  <li
                                    key={p.id}
<<<<<<< HEAD
                                    className="flex items-center justify-between gap-2 text-[10px] text-slate-700"
=======
                                    className="text-text-primary flex items-center justify-between gap-2 text-[10px]"
>>>>>>> recover/cabinet-wip-from-stash
                                  >
                                    <span className="truncate" title={p.detail}>
                                      {p.name} — {p.detail}
                                    </span>
                                    <Link
                                      href={meta.detailHref}
                                      className="shrink-0 text-[8px] font-semibold text-rose-700 hover:underline"
                                    >
                                      Устранить
                                    </Link>
                                  </li>
                                )
                              )}
                            </ul>
                            <div className="flex justify-start">
                              <Button
                                asChild
                                variant="outline"
                                size="sm"
                                className="text-[9px] font-bold"
                              >
                                <Link
                                  href={meta.detailHref}
                                  className="inline-flex items-center gap-0.5"
                                >
                                  Детально <ArrowRight className="h-3 w-3" />
                                </Link>
                              </Button>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                    );
                  })()}
                {/* Системы в норме / сбои */}
                <div className="h-[200px] w-[240px] min-w-[240px] shrink-0">
                  {(() => {
                    const meta = ALERT_BLOCK_META.systems;
                    const ok = !alerts?.integrationIssues?.length;
                    return (
                      <Popover>
                        <PopoverTrigger asChild>
                          <div
                            role="button"
                            tabIndex={0}
                            className={cn(
                              'flex h-full cursor-pointer flex-col rounded-xl border p-3 outline-none transition-colors focus-visible:ring-2',
                              ok
                                ? 'border-emerald-200 bg-emerald-50/50 hover:bg-emerald-50/80 focus-visible:ring-emerald-300'
                                : 'border-amber-200 bg-amber-50/50 hover:bg-amber-50/80 focus-visible:ring-amber-300'
                            )}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                (e.currentTarget as HTMLElement).click();
                              }
                            }}
                          >
                            <div className="mb-2 flex shrink-0 items-center justify-between gap-2">
                              <div className="flex min-w-0 items-center gap-2">
                                <div
                                  className={cn(
                                    'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg',
                                    ok ? 'bg-emerald-100' : 'bg-amber-100'
                                  )}
                                >
                                  <Zap
                                    className={cn(
                                      'h-4 w-4',
                                      ok ? 'text-emerald-600' : 'text-amber-600'
                                    )}
                                  />
                                </div>
<<<<<<< HEAD
                                <h4 className="truncate text-[9px] font-black uppercase text-slate-800">
=======
                                <h4 className="text-text-primary truncate text-[9px] font-black uppercase">
>>>>>>> recover/cabinet-wip-from-stash
                                  {getBlockLabel?.('systems') ?? meta.title}
                                </h4>
                              </div>
                              <div onClick={(e) => e.stopPropagation()}>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <button
                                      type="button"
<<<<<<< HEAD
                                      className="rounded p-0.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
=======
                                      className="text-text-muted hover:text-text-secondary hover:bg-bg-surface2 rounded p-0.5"
>>>>>>> recover/cabinet-wip-from-stash
                                      aria-label="Описание блока"
                                    >
                                      <HelpCircle className="h-3.5 w-3.5" />
                                    </button>
                                  </PopoverTrigger>
                                  <PopoverContent
                                    align="end"
                                    className="w-72 rounded-xl p-3 text-left"
                                  >
<<<<<<< HEAD
                                    <p className="text-[10px] leading-relaxed text-slate-600">
=======
                                    <p className="text-text-secondary text-[10px] leading-relaxed">
>>>>>>> recover/cabinet-wip-from-stash
                                      {meta.description}
                                    </p>
                                  </PopoverContent>
                                </Popover>
                              </div>
                            </div>
                            <div className="mb-2 min-h-0 flex-1">
                              {ok ? (
                                <p className="text-[10px] font-medium text-emerald-700">В норме</p>
                              ) : (
<<<<<<< HEAD
                                <ul className="space-y-1 text-[10px] text-slate-700">
=======
                                <ul className="text-text-primary space-y-1 text-[10px]">
>>>>>>> recover/cabinet-wip-from-stash
                                  {alerts.integrationIssues.map((issue: string, i: number) => (
                                    <li key={i}>{issue}</li>
                                  ))}
                                </ul>
                              )}
                            </div>
                            <div className="mt-auto flex justify-start gap-2">
                              <Link
                                href={meta.detailHref}
<<<<<<< HEAD
                                className="inline-flex items-center gap-0.5 text-[9px] font-semibold text-indigo-600 hover:underline"
=======
                                className="text-accent-primary inline-flex items-center gap-0.5 text-[9px] font-semibold hover:underline"
>>>>>>> recover/cabinet-wip-from-stash
                                onClick={(e) => e.stopPropagation()}
                              >
                                Детально <ArrowRight className="h-3 w-3" />
                              </Link>
                            </div>
                          </div>
                        </PopoverTrigger>
                        <PopoverContent
                          align="start"
                          className="max-h-[80vh] w-[320px] overflow-y-auto rounded-xl p-4"
                        >
<<<<<<< HEAD
                          <h4 className="mb-2 text-[10px] font-black uppercase text-slate-800">
                            {meta.title}
                          </h4>
                          <p className="mb-3 text-[10px] leading-relaxed text-slate-600">
=======
                          <h4 className="text-text-primary mb-2 text-[10px] font-black uppercase">
                            {meta.title}
                          </h4>
                          <p className="text-text-secondary mb-3 text-[10px] leading-relaxed">
>>>>>>> recover/cabinet-wip-from-stash
                            {meta.description}
                          </p>
                          {ok ? (
                            <p className="mb-3 text-[10px] font-medium text-emerald-700">В норме</p>
                          ) : (
<<<<<<< HEAD
                            <ul className="mb-3 space-y-1 text-[10px] text-slate-700">
=======
                            <ul className="text-text-primary mb-3 space-y-1 text-[10px]">
>>>>>>> recover/cabinet-wip-from-stash
                              {alerts.integrationIssues.map((issue: string, i: number) => (
                                <li key={i}>{issue}</li>
                              ))}
                            </ul>
                          )}
                          <div className="flex justify-start">
                            <Button
                              asChild
                              variant="outline"
                              size="sm"
                              className="text-[9px] font-bold"
                            >
                              <Link
                                href={meta.detailHref}
                                className="inline-flex items-center gap-0.5"
                              >
                                Детально <ArrowRight className="h-3 w-3" />
                              </Link>
                            </Button>
                          </div>
                        </PopoverContent>
                      </Popover>
                    );
                  })()}
                </div>
                {/* Задачи без исполнителя */}
                {alerts?.tasks?.length > 0 &&
                  (() => {
                    const meta = ALERT_BLOCK_META.tasks;
                    return (
                      <div className="h-[200px] w-[240px] min-w-[240px] shrink-0">
                        <Popover>
                          <PopoverTrigger asChild>
                            <div
                              role="button"
                              tabIndex={0}
<<<<<<< HEAD
                              className="flex h-full cursor-pointer flex-col rounded-xl border border-violet-200 bg-violet-50/50 p-3 outline-none transition-colors hover:bg-violet-50/80 focus-visible:ring-2 focus-visible:ring-violet-300"
=======
                              className="border-accent-primary/25 bg-accent-primary/10 hover:bg-accent-primary/10 focus-visible:ring-accent-primary/40 flex h-full cursor-pointer flex-col rounded-xl border p-3 outline-none transition-colors focus-visible:ring-2"
>>>>>>> recover/cabinet-wip-from-stash
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                  e.preventDefault();
                                  (e.currentTarget as HTMLElement).click();
                                }
                              }}
                            >
                              <div className="mb-2 flex shrink-0 items-center justify-between gap-2">
                                <div className="flex min-w-0 items-center gap-2">
<<<<<<< HEAD
                                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-100">
                                    <CheckSquare className="h-4 w-4 text-violet-600" />
                                  </div>
                                  <h4 className="truncate text-[9px] font-black uppercase text-violet-800">
=======
                                  <div className="bg-accent-primary/15 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg">
                                    <CheckSquare className="text-accent-primary h-4 w-4" />
                                  </div>
                                  <h4 className="text-accent-primary truncate text-[9px] font-black uppercase">
>>>>>>> recover/cabinet-wip-from-stash
                                    {getBlockLabel?.('tasks') ?? meta.title}
                                  </h4>
                                </div>
                                <div onClick={(e) => e.stopPropagation()}>
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <button
                                        type="button"
<<<<<<< HEAD
                                        className="rounded p-0.5 text-slate-400 hover:bg-violet-100 hover:text-violet-600"
=======
                                        className="text-text-muted hover:text-accent-primary hover:bg-accent-primary/15 rounded p-0.5"
>>>>>>> recover/cabinet-wip-from-stash
                                        aria-label="Описание блока"
                                      >
                                        <HelpCircle className="h-3.5 w-3.5" />
                                      </button>
                                    </PopoverTrigger>
                                    <PopoverContent
                                      align="end"
                                      className="w-72 rounded-xl p-3 text-left"
                                    >
<<<<<<< HEAD
                                      <p className="text-[10px] leading-relaxed text-slate-600">
=======
                                      <p className="text-text-secondary text-[10px] leading-relaxed">
>>>>>>> recover/cabinet-wip-from-stash
                                        {meta.description}
                                      </p>
                                    </PopoverContent>
                                  </Popover>
                                </div>
                              </div>
                              <ul className="mb-2 min-h-0 flex-1 space-y-1.5 overflow-auto">
                                {alerts.tasks.map(
                                  (t: { id: string; title: string; priority: string }) => (
                                    <li
                                      key={t.id}
<<<<<<< HEAD
                                      className="flex items-center justify-between gap-2 text-[10px] text-slate-700"
=======
                                      className="text-text-primary flex items-center justify-between gap-2 text-[10px]"
>>>>>>> recover/cabinet-wip-from-stash
                                    >
                                      <span className="truncate" title={t.priority}>
                                        {t.title}
                                      </span>
                                      <Link
                                        href={meta.detailHref}
<<<<<<< HEAD
                                        className="shrink-0 text-[8px] font-semibold text-violet-700 hover:underline"
=======
                                        className="text-accent-primary shrink-0 text-[8px] font-semibold hover:underline"
>>>>>>> recover/cabinet-wip-from-stash
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        Устранить
                                      </Link>
                                    </li>
                                  )
                                )}
                              </ul>
                              <div className="mt-auto flex justify-start gap-2">
                                <Link
                                  href={meta.detailHref}
<<<<<<< HEAD
                                  className="inline-flex items-center gap-0.5 text-[9px] font-semibold text-violet-700 hover:underline"
=======
                                  className="text-accent-primary inline-flex items-center gap-0.5 text-[9px] font-semibold hover:underline"
>>>>>>> recover/cabinet-wip-from-stash
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  Детально <ArrowRight className="h-3 w-3" />
                                </Link>
                              </div>
                            </div>
                          </PopoverTrigger>
                          <PopoverContent
                            align="start"
                            className="max-h-[80vh] w-[320px] overflow-y-auto rounded-xl p-4"
                          >
<<<<<<< HEAD
                            <h4 className="mb-2 text-[10px] font-black uppercase text-violet-800">
                              {meta.title}
                            </h4>
                            <p className="mb-3 text-[10px] leading-relaxed text-slate-600">
=======
                            <h4 className="text-accent-primary mb-2 text-[10px] font-black uppercase">
                              {meta.title}
                            </h4>
                            <p className="text-text-secondary mb-3 text-[10px] leading-relaxed">
>>>>>>> recover/cabinet-wip-from-stash
                              {meta.description}
                            </p>
                            <ul className="mb-3 space-y-1.5">
                              {alerts.tasks.map(
                                (t: { id: string; title: string; priority: string }) => (
                                  <li
                                    key={t.id}
<<<<<<< HEAD
                                    className="flex items-center justify-between gap-2 text-[10px] text-slate-700"
=======
                                    className="text-text-primary flex items-center justify-between gap-2 text-[10px]"
>>>>>>> recover/cabinet-wip-from-stash
                                  >
                                    <span className="truncate" title={t.priority}>
                                      {t.title}
                                    </span>
                                    <Link
                                      href={meta.detailHref}
<<<<<<< HEAD
                                      className="shrink-0 text-[8px] font-semibold text-violet-700 hover:underline"
=======
                                      className="text-accent-primary shrink-0 text-[8px] font-semibold hover:underline"
>>>>>>> recover/cabinet-wip-from-stash
                                    >
                                      Устранить
                                    </Link>
                                  </li>
                                )
                              )}
                            </ul>
                            <div className="flex justify-start">
                              <Button
                                asChild
                                variant="outline"
                                size="sm"
                                className="text-[9px] font-bold"
                              >
                                <Link
                                  href={meta.detailHref}
                                  className="inline-flex items-center gap-0.5"
                                >
                                  Детально <ArrowRight className="h-3 w-3" />
                                </Link>
                              </Button>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                    );
                  })()}
              </>
            )}
          </div>
        </div>
      </SectionBlock>

      {/* Индекс здоровья + Недавняя активность */}
      <div className="mb-2 grid min-w-0 grid-cols-1 items-stretch gap-4 lg:grid-cols-2">
        <SectionBlock
          title="Индекс здоровья"
          meta={SECTION_META.health}
          accentColor="indigo"
          className="flex min-w-0 flex-col overflow-hidden"
          history={globalHistory}
        >
<<<<<<< HEAD
          <Card className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
            {healthError ? (
              <div className="flex flex-col items-center justify-center gap-3 px-4 py-6 text-center">
                <p className="text-[10px] font-bold text-slate-600">Не удалось загрузить данные</p>
                <p className="text-[9px] text-slate-500">{healthError.message}</p>
=======
          <div
            className={cn(
              registryFeedLayout.panelCardSoft,
              'relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden p-4 md:p-5'
            )}
          >
            {healthError ? (
              <div className="flex flex-col items-center justify-center gap-3 px-4 py-6 text-center">
                <p className="text-text-secondary text-[10px] font-bold">
                  Не удалось загрузить данные
                </p>
                <p className="text-text-secondary text-[9px]">{healthError.message}</p>
>>>>>>> recover/cabinet-wip-from-stash
                <Button
                  variant="outline"
                  size="sm"
                  className="text-[9px] font-bold uppercase"
                  onClick={() => refetchHealth()}
                  aria-label="Повторить загрузку данных"
                >
                  Повторить
                </Button>
              </div>
            ) : healthLoading ? (
              <div className="flex animate-pulse flex-col gap-4">
<<<<<<< HEAD
                <div className="absolute right-4 top-4 h-12 w-12 rounded-full bg-slate-100" />
=======
                <div className="bg-bg-surface2 absolute right-4 top-4 h-12 w-12 rounded-full" />
>>>>>>> recover/cabinet-wip-from-stash
                <div className="mt-8 flex flex-col gap-3">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <div key={i} className="bg-bg-surface2 h-14 rounded-lg" />
                  ))}
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between gap-4">
<<<<<<< HEAD
                  <p className="text-[10px] font-bold uppercase text-slate-400">
=======
                  <p className="text-text-muted text-[10px] font-bold uppercase">
>>>>>>> recover/cabinet-wip-from-stash
                    Проверка {lastCheck}
                  </p>
                  <div className="flex shrink-0 items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
<<<<<<< HEAD
                      className="h-8 w-8 rounded-lg text-slate-400 hover:text-indigo-600"
=======
                      className="text-text-muted hover:text-accent-primary h-8 w-8 rounded-lg"
>>>>>>> recover/cabinet-wip-from-stash
                      onClick={() => refetchHealth()}
                      aria-label="Обновить индекс здоровья"
                      title="Обновить"
                      disabled={healthLoading}
                    >
                      <RefreshCw className={cn('h-4 w-4', healthLoading ? 'animate-spin' : '')} />
                    </Button>
                    <div className="relative flex h-12 w-12 items-center justify-center">
                      <svg className="absolute inset-0 h-12 w-12 -rotate-90" viewBox="0 0 48 48">
<<<<<<< HEAD
                        <circle
                          cx="24"
                          cy="24"
                          r="20"
                          fill="none"
                          strokeWidth="4"
                          className="stroke-slate-200"
                        />
=======
>>>>>>> recover/cabinet-wip-from-stash
                        <circle
                          cx="24"
                          cy="24"
                          r="20"
                          fill="none"
                          strokeWidth="4"
                          className="stroke-border-subtle"
                        />
                        <circle
                          cx="24"
                          cy="24"
                          r="20"
                          fill="none"
                          strokeWidth="4"
                          className="stroke-accent-primary"
                          strokeDasharray={2 * Math.PI * 20}
                          strokeDashoffset={2 * Math.PI * 20 * (1 - (overallHealth ?? 0) / 100)}
                          strokeLinecap="round"
                        />
                      </svg>
<<<<<<< HEAD
                      <span className="relative text-lg font-black text-indigo-600">
=======
                      <span className="text-accent-primary relative text-lg font-black">
>>>>>>> recover/cabinet-wip-from-stash
                        {overallHealth}%
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-5 flex flex-col gap-y-3">
                  {healthMetrics?.map((m: any, i: number) => {
                    const healthIcons: Record<
                      string,
                      React.ComponentType<{ className?: string }>
                    > = {
                      'Полнота профиля': Building2,
                      Безопасность: ShieldCheck,
                      'Активность команды': Users,
                      Интеграции: Zap,
                      'ЭДО и маркировка': ShieldCheck,
                      Подписка: CreditCard,
                      Документы: FileText,
                      Настройки: Settings,
                    };
                    const Icon = healthIcons[m?.label ?? ''] ?? LayoutDashboard;
                    const details = m?.details;
                    const checklist = details?.checklist ?? [];
                    const missing = details?.missing ?? [];
                    const tips = details?.tips;
                    return (
                      <Popover
                        key={i}
                        open={openHealthDetailFor === i}
                        onOpenChange={(open) => setOpenHealthDetailFor(open ? i : null)}
                      >
                        <PopoverTrigger asChild>
                          <button
                            type="button"
                            onClick={() =>
                              setOpenHealthDetailFor(openHealthDetailFor === i ? null : i)
                            }
<<<<<<< HEAD
                            className="flex w-full min-w-0 items-start gap-2 rounded-lg p-2 text-left transition-colors hover:bg-slate-50/80"
=======
                            className="hover:bg-bg-surface2/80 flex w-full min-w-0 items-start gap-2 rounded-lg p-2 text-left transition-colors"
>>>>>>> recover/cabinet-wip-from-stash
                          >
                            <div
                              className={cn(
                                'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white',
<<<<<<< HEAD
                                m?.color ?? 'bg-indigo-500'
=======
                                m?.color ?? 'bg-accent-primary'
>>>>>>> recover/cabinet-wip-from-stash
                              )}
                            >
                              <Icon className="h-4 w-4" />
                            </div>
                            <div className="flex min-w-0 flex-1 flex-col gap-1">
                              <div className="flex items-center justify-between gap-2">
<<<<<<< HEAD
                                <span className="truncate text-[10px] font-bold text-slate-700 hover:text-indigo-600">
=======
                                <span className="text-text-primary hover:text-accent-primary truncate text-[10px] font-bold">
>>>>>>> recover/cabinet-wip-from-stash
                                  {m?.label ?? ''}
                                </span>
                                <span
                                  className={cn(
                                    'shrink-0 text-[10px] font-black tabular-nums',
                                    m?.status === 'ok'
                                      ? 'text-emerald-600'
                                      : m?.status === 'warning'
                                        ? 'text-amber-600'
                                        : 'text-rose-600'
                                  )}
                                >
                                  {m?.score != null ? `${m.score}%` : '—'}
                                </span>
                              </div>
                              <Progress
                                value={m?.score ?? 0}
<<<<<<< HEAD
                                className="h-1.5 bg-slate-100"
                                indicatorClassName={m?.color ?? 'bg-indigo-500'}
                              />
                              {m?.status !== 'ok' && m?.details?.tips && (
                                <p
                                  className="line-clamp-1 text-[8px] text-slate-500"
=======
                                className="bg-bg-surface2 h-1.5"
                                indicatorClassName={m?.color ?? 'bg-accent-primary'}
                              />
                              {m?.status !== 'ok' && m?.details?.tips && (
                                <p
                                  className="text-text-secondary line-clamp-1 text-[8px]"
>>>>>>> recover/cabinet-wip-from-stash
                                  title={m.details.tips}
                                >
                                  {m.details.tips}
                                </p>
                              )}
                            </div>
                          </button>
                        </PopoverTrigger>
                        <PopoverContent
                          side="bottom"
                          align="start"
                          sideOffset={8}
                          className="z-[200] w-80 rounded-xl p-4"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <div
                                className={cn(
                                  'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white',
<<<<<<< HEAD
                                  m?.color ?? 'bg-indigo-500'
=======
                                  m?.color ?? 'bg-accent-primary'
>>>>>>> recover/cabinet-wip-from-stash
                                )}
                              >
                                <Icon className="h-4 w-4" />
                              </div>
                              <div>
<<<<<<< HEAD
                                <h4 className="text-[11px] font-bold text-slate-900">
                                  {m?.label ?? ''}
                                </h4>
                                <p className="text-[9px] text-slate-500">
=======
                                <h4 className="text-text-primary text-[11px] font-bold">
                                  {m?.label ?? ''}
                                </h4>
                                <p className="text-text-secondary text-[9px]">
>>>>>>> recover/cabinet-wip-from-stash
                                  {m?.score != null ? `${m.score}%` : '—'} • Проверка{' '}
                                  {details?.lastCheck ?? ''}
                                </p>
                              </div>
                            </div>
                            {m?.desc && <p className="text-text-secondary text-[10px]">{m.desc}</p>}
                            {(checklist.length > 0 || missing.length > 0) && (
                              <div className="space-y-2">
                                {checklist.length > 0 && (
                                  <div>
<<<<<<< HEAD
                                    <p className="mb-1 text-[9px] font-bold uppercase text-slate-400">
=======
                                    <p className="text-text-muted mb-1 text-[9px] font-bold uppercase">
>>>>>>> recover/cabinet-wip-from-stash
                                      Заполнено
                                    </p>
                                    <ul className="space-y-0.5">
                                      {checklist.map((item: string, j: number) => (
                                        <li
                                          key={j}
<<<<<<< HEAD
                                          className="flex items-center gap-1.5 text-[10px] text-slate-600"
=======
                                          className="text-text-secondary flex items-center gap-1.5 text-[10px]"
>>>>>>> recover/cabinet-wip-from-stash
                                        >
                                          <span className="text-emerald-500">✓</span> {item}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                                {missing.length > 0 && (
                                  <div>
<<<<<<< HEAD
                                    <p className="mb-1 text-[9px] font-bold uppercase text-slate-400">
=======
                                    <p className="text-text-muted mb-1 text-[9px] font-bold uppercase">
>>>>>>> recover/cabinet-wip-from-stash
                                      Ещё не заполнено
                                    </p>
                                    <ul className="space-y-0.5">
                                      {missing.map((item: string, j: number) => (
                                        <li
                                          key={j}
<<<<<<< HEAD
                                          className="flex items-center gap-1.5 text-[10px] text-slate-600"
=======
                                          className="text-text-secondary flex items-center gap-1.5 text-[10px]"
>>>>>>> recover/cabinet-wip-from-stash
                                        >
                                          <span className="text-amber-500">○</span> {item}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            )}
                            {tips && (
                              <p className="rounded-lg bg-amber-50 px-2 py-1.5 text-[9px] text-amber-600">
                                {tips}
                              </p>
                            )}
                            <Link
                              href={m?.href ?? '#'}
<<<<<<< HEAD
                              className="inline-flex items-center gap-1 text-[10px] font-semibold text-indigo-600 hover:text-indigo-700"
=======
                              className="text-accent-primary hover:text-accent-primary inline-flex items-center gap-1 text-[10px] font-semibold"
>>>>>>> recover/cabinet-wip-from-stash
                              onClick={() => setOpenHealthDetailFor(null)}
                            >
                              Открыть раздел
                              <ArrowRight className="h-3 w-3" />
                            </Link>
                          </div>
                        </PopoverContent>
                      </Popover>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </SectionBlock>

        <SectionBlock
          title="Недавняя активность"
          meta={SECTION_META.activity}
          accentColor="slate"
          className="flex min-w-0 flex-col overflow-hidden"
          history={globalHistory}
        >
<<<<<<< HEAD
          <Card className="flex min-h-0 min-h-[320px] min-w-0 flex-1 flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
            {/* Высота подобрана так, чтобы после отступа (mt-4) первая строка активности была на уровне «Полнота профиля» */}
            <div className="flex min-h-[3.25rem] shrink-0 flex-col justify-end">
              <p className="mb-2 text-[10px] font-bold uppercase text-slate-400">
                Период • {formatActivityPeriod(activityPeriod)}
              </p>
              <div className="mb-0 flex w-fit items-center gap-1 rounded-[4px] border border-slate-200 bg-slate-50 p-0.5">
                {ACTIVITY_PARTICIPANTS.map((p) => {
                  const Icon = p.Icon ?? Users;
                  const participantStyle: Record<string, { bg: string; text: string }> = {
                    all: { bg: 'bg-slate-100', text: 'text-slate-500' },
                    anna: { bg: 'bg-indigo-100', text: 'text-indigo-600' },
=======
          <div
            className={cn(
              registryFeedLayout.panelCardSoft,
              'flex min-h-[320px] min-w-0 flex-1 flex-col p-4 md:p-5'
            )}
          >
            {/* Высота подобрана так, чтобы после отступа (mt-4) первая строка активности была на уровне «Полнота профиля» */}
            <div className="flex min-h-[3.25rem] shrink-0 flex-col justify-end">
              {/* Период задаётся только в Organization Hub выше (S3 — один контрол) */}
              <div className="bg-bg-surface2 border-border-default mb-0 flex w-fit items-center gap-1 rounded-[4px] border p-0.5">
                {ACTIVITY_PARTICIPANTS.map((p) => {
                  const Icon = p.Icon ?? Users;
                  const participantStyle: Record<string, { bg: string; text: string }> = {
                    all: { bg: 'bg-bg-surface2', text: 'text-text-secondary' },
                    anna: { bg: 'bg-accent-primary/15', text: 'text-accent-primary' },
>>>>>>> recover/cabinet-wip-from-stash
                    igor: { bg: 'bg-emerald-100', text: 'text-emerald-600' },
                    maria: { bg: 'bg-amber-100', text: 'text-amber-600' },
                    petr: { bg: 'bg-rose-100', text: 'text-rose-600' },
                    system: { bg: 'bg-blue-100', text: 'text-blue-600' },
                  };
                  const style = participantStyle[p.id] ?? participantStyle.all;
                  return (
                    <Tooltip key={p.id}>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          onClick={() => setActivityParticipant(p.id)}
                          aria-label={p.label}
                          aria-pressed={activityParticipant === p.id}
                          className={cn(
                            'flex h-7 w-7 items-center justify-center rounded-[4px] transition-all',
                            activityParticipant === p.id
<<<<<<< HEAD
                              ? cn('bg-white shadow-sm ring-1 ring-slate-200', style.text)
=======
                              ? cn('ring-border-default bg-white shadow-sm ring-1', style.text)
>>>>>>> recover/cabinet-wip-from-stash
                              : cn(style.bg, style.text, 'hover:opacity-90')
                          )}
                        >
                          <Icon className="h-3.5 w-3.5" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" className="text-[10px] font-bold uppercase">
                        {p.label}
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </div>
            </div>
            {/* Свободное место между иконками-фильтрами и первым действием; первая строка на уровне «Полнота профиля» */}
            <div className="mt-4 h-[378px] shrink-0 space-y-1.5 overflow-y-auto overflow-x-hidden pr-1">
              {filteredActivities?.length ? (
                filteredActivities.map((act, i) => {
                  const participant = ACTIVITY_PARTICIPANTS.find((p) => p.id === act.participantId);
                  const ActIcon = participant?.Icon ?? act.icon;
                  const participantStyle: Record<string, { bg: string; text: string }> = {
                    all: { bg: 'bg-bg-surface2', text: 'text-text-secondary' },
                    anna: { bg: 'bg-accent-primary/15', text: 'text-accent-primary' },
                    igor: { bg: 'bg-emerald-100', text: 'text-emerald-600' },
                    maria: { bg: 'bg-amber-100', text: 'text-amber-600' },
                    petr: { bg: 'bg-rose-100', text: 'text-rose-600' },
                    system: { bg: 'bg-blue-100', text: 'text-blue-600' },
                  };
                  const style = participantStyle[act.participantId] ?? participantStyle.all;
                  const blocked = isBlocked(act);
                  return (
                    <div
                      key={`${act.user}-${act.dateStr}-${i}`}
                      className={cn(
<<<<<<< HEAD
                        'flex shrink-0 items-center gap-2 rounded-lg border px-2 py-1.5 text-[9px] text-slate-600 transition-colors',
                        blocked
                          ? 'border-rose-100 bg-rose-50/30'
                          : 'border-slate-100 hover:bg-slate-50/50'
=======
                        'text-text-secondary flex shrink-0 items-center gap-2 rounded-lg border px-2 py-1.5 text-[9px] transition-colors',
                        blocked
                          ? 'border-rose-100 bg-rose-50/30'
                          : 'border-border-subtle hover:bg-bg-surface2/80'
>>>>>>> recover/cabinet-wip-from-stash
                      )}
                    >
                      <div
                        className={cn(
                          'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg',
                          style.bg,
                          style.text
                        )}
                      >
                        <ActIcon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
<<<<<<< HEAD
                        <span className="block truncate font-semibold text-slate-900">
=======
                        <span className="text-text-primary block truncate font-semibold">
>>>>>>> recover/cabinet-wip-from-stash
                          {act.user}
                        </span>
                        <span className="block truncate">{act.action}</span>
                      </div>
<<<<<<< HEAD
                      <span className="shrink-0 text-[8px] font-bold uppercase text-slate-400">
=======
                      <span className="text-text-muted shrink-0 text-[8px] font-bold uppercase">
>>>>>>> recover/cabinet-wip-from-stash
                        {act.time}
                      </span>
                      <div className="flex shrink-0 flex-wrap items-center justify-end gap-0.5">
                        {blocked ? (
                          <>
                            <button
                              type="button"
                              onClick={() =>
                                setBlockedActivities((prev) =>
                                  prev.filter((b) => activityKey(b) !== activityKey(act))
                                )
                              }
<<<<<<< HEAD
                              className="inline-flex items-center gap-1 rounded border border-slate-200 px-2 py-1 text-[9px] font-semibold text-slate-600 hover:bg-slate-100"
=======
                              className="text-text-secondary hover:bg-bg-surface2 border-border-default inline-flex items-center gap-1 rounded border px-2 py-1 text-[9px] font-semibold"
>>>>>>> recover/cabinet-wip-from-stash
                              aria-label="Разблокировать"
                            >
                              <LockOpen className="h-3 w-3" />
                              Разблокировать
                            </button>
                            <Link
                              href={`${getCorrectionHref(act)}?returnResolved=${encodeURIComponent(activityKey(act))}`}
<<<<<<< HEAD
                              className="inline-flex items-center gap-1 rounded border border-indigo-200 px-2 py-1 text-[9px] font-semibold text-indigo-600 hover:bg-indigo-50"
=======
                              className="text-accent-primary hover:bg-accent-primary/10 border-accent-primary/30 inline-flex items-center gap-1 rounded border px-2 py-1 text-[9px] font-semibold"
>>>>>>> recover/cabinet-wip-from-stash
                            >
                              <Pencil className="h-3 w-3" />
                              Изменить
                            </Link>
                          </>
                        ) : (
                          <>
                            <Popover
                              open={openCommentFor === i}
                              onOpenChange={(open) => !open && setOpenCommentFor(null)}
                            >
                              <PopoverTrigger asChild>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setOpenCommentFor(openCommentFor === i ? null : i);
                                  }}
<<<<<<< HEAD
                                  className="rounded p-1.5 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600"
=======
                                  className="text-text-muted hover:text-accent-primary hover:bg-accent-primary/10 rounded p-1.5"
>>>>>>> recover/cabinet-wip-from-stash
                                  aria-label="Написать комментарий"
                                >
                                  <MessageSquare className="h-3.5 w-3.5" />
                                </button>
                              </PopoverTrigger>
                              <PopoverContent
                                align="end"
                                className="z-[200] w-64 rounded-xl p-3"
                                onClick={(e) => e.stopPropagation()}
                              >
<<<<<<< HEAD
                                <p className="mb-2 text-[10px] font-bold text-slate-700">
=======
                                <p className="text-text-primary mb-2 text-[10px] font-bold">
>>>>>>> recover/cabinet-wip-from-stash
                                  Комментарий
                                </p>
                                <textarea
                                  value={openCommentFor === i ? commentText : ''}
                                  onChange={(e) => setCommentText(e.target.value)}
                                  placeholder="Введите комментарий..."
<<<<<<< HEAD
                                  className="min-h-[60px] w-full resize-none rounded-lg border border-slate-200 px-2 py-1.5 text-[10px]"
=======
                                  className="border-border-default min-h-[60px] w-full resize-none rounded-lg border px-2 py-1.5 text-[10px]"
>>>>>>> recover/cabinet-wip-from-stash
                                  rows={3}
                                />
                                <Button
                                  size="sm"
                                  className="mt-2 h-7 text-[9px]"
                                  onClick={() => setOpenCommentFor(null)}
                                >
                                  Отправить
                                </Button>
                              </PopoverContent>
                            </Popover>
                            <Popover
                              open={openBlockFor === i}
                              onOpenChange={(open) => !open && setOpenBlockFor(null)}
                            >
                              <PopoverTrigger asChild>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setOpenBlockFor(openBlockFor === i ? null : i);
                                  }}
<<<<<<< HEAD
                                  className="rounded p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
=======
                                  className="text-text-muted rounded p-1.5 hover:bg-rose-50 hover:text-rose-600"
>>>>>>> recover/cabinet-wip-from-stash
                                  aria-label="Заблокировать действие"
                                >
                                  <Lock className="h-3.5 w-3.5" />
                                </button>
                              </PopoverTrigger>
                              <PopoverContent
                                align="end"
                                className="z-[200] w-56 rounded-xl p-3"
                                onClick={(e) => e.stopPropagation()}
                              >
<<<<<<< HEAD
                                <p className="mb-2 text-[10px] font-bold text-slate-700">
=======
                                <p className="text-text-primary mb-2 text-[10px] font-bold">
>>>>>>> recover/cabinet-wip-from-stash
                                  Заблокировать действие?
                                </p>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  className="h-7 text-[9px]"
                                  onClick={() => {
                                    setBlockedActivities((prev) => [...prev, act]);
                                    setOpenBlockFor(null);
                                    toast?.({
                                      title: 'Действие заблокировано',
                                      description:
                                        'Вы можете разблокировать его или перейти в раздел и внести изменения.',
                                    });
                                  }}
                                >
                                  Заблокировать
                                </Button>
                              </PopoverContent>
                            </Popover>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
<<<<<<< HEAD
                <p className="py-4 text-[9px] text-slate-400">Нет активности за выбранный период</p>
              )}
            </div>
            <div className="mt-auto flex shrink-0 justify-center border-t border-slate-200 pt-3">
=======
                <p className="text-text-muted py-4 text-[9px]">
                  Нет активности за выбранный период
                </p>
              )}
            </div>
            <div className="border-border-default mt-auto flex shrink-0 justify-center border-t pt-3">
>>>>>>> recover/cabinet-wip-from-stash
              <Button
                asChild
                variant="cta"
                size="ctaSm"
                className="button-glimmer button-professional w-1/2"
              >
                <Link
<<<<<<< HEAD
                  href="/brand/team"
=======
                  href={ROUTES.brand.team}
>>>>>>> recover/cabinet-wip-from-stash
                  className="inline-flex items-center justify-center gap-1.5"
                >
                  Все действия
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          </div>
        </SectionBlock>
      </div>

      {/* Партнёрская экосистема */}
      <SectionBlock
        title="Партнёрская экосистема"
        meta={SECTION_META.partners}
        accentColor="blue"
        history={globalHistory}
      >
        {(() => {
          const growthPeriodKey: '7d' | '30d' = modulesPeriodKey;
          const growthData = PARTNER_GROWTH_BY_PERIOD[growthPeriodKey];
          const growthDetail = growthData.items;
          return (
            <TooltipProvider delayDuration={200}>
<<<<<<< HEAD
              <Card className="rounded-xl border border-slate-200 bg-white p-4 md:p-5">
                <p className="mb-2 text-[9px] font-semibold uppercase tracking-wide text-slate-400">
=======
              <div className={cn(registryFeedLayout.panelCardSoft, 'p-4 md:p-5')}>
                <p className="text-text-muted mb-2 text-[9px] font-semibold uppercase tracking-wide">
>>>>>>> recover/cabinet-wip-from-stash
                  Партнёры по типам • за {growthPeriodKey === '7d' ? '7 дн.' : '30 дн.'}
                </p>
                <div className="flex flex-nowrap gap-3 overflow-x-auto pb-1">
                  {PARTNER_COUNTS.map((item) => {
                    const Icon = item.icon;
                    const hasProgress =
                      item.progressValue != null &&
                      item.progressMax != null &&
                      item.progressMax > 0;
                    const progressPct = hasProgress
                      ? Math.round((item.progressValue! / item.progressMax!) * 100)
                      : 0;
<<<<<<< HEAD
                    const periodGrowth = growthDetail.find((d) => d.label === item.label);
=======
                    const periodGrowth = growthDetail.find(
                      (d: { label: string; value: string; href: string }) => d.label === item.label
                    );
>>>>>>> recover/cabinet-wip-from-stash
                    const trendStr = periodGrowth?.value ?? item.trend ?? '';
                    const trendNum = trendStr ? parseInt(trendStr.replace(/\D/g, ''), 10) : 0;
                    const currentNum = item.value.includes('/')
                      ? parseInt(item.value.split('/')[0], 10)
                      : parseInt(item.value, 10);
                    const previousNum = Number.isNaN(currentNum)
                      ? 0
                      : Math.max(0, currentNum - (trendStr.startsWith('-') ? -trendNum : trendNum));
                    const changePct =
                      trendNum && previousNum > 0
                        ? Math.round((trendNum / previousNum) * 100)
                        : null;
                    const trendUp = trendStr ? !trendStr.startsWith('-') : false;
                    return (
                      <div
                        key={item.id}
                        className={cn(
                          'relative flex min-h-[280px] w-[200px] shrink-0 flex-col rounded-xl border p-3 transition-colors',
                          (item.alertCount ?? 0) > 0
                            ? 'border-rose-200 bg-rose-50/50'
<<<<<<< HEAD
                            : 'border-slate-200 bg-white hover:border-slate-300'
=======
                            : 'border-border-default hover:border-border-default bg-white'
>>>>>>> recover/cabinet-wip-from-stash
                        )}
                      >
                        {changePct != null && (
                          <p
                            className={cn(
                              'absolute right-2 top-2 text-[9px] font-bold tabular-nums',
                              trendUp ? 'text-emerald-600' : 'text-rose-600'
                            )}
                          >
                            {trendUp ? '+' : ''}
                            {changePct}%
                          </p>
                        )}
                        <div className="flex items-start justify-between gap-2">
                          <div
                            className={cn(
                              'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white',
                              item.color
                            )}
                          >
                            <Icon className="h-4 w-4" />
                          </div>
                        </div>
                        <div className="mt-2 flex items-start gap-1">
                          <Link
                            href={item.href}
                            className="group/link block min-w-0 flex-1"
                            title={item.description}
                          >
<<<<<<< HEAD
                            <p className="text-lg font-bold tabular-nums text-slate-900 group-hover/link:text-indigo-600">
                              {item.value}
                            </p>
                            <p className="text-[9px] font-semibold uppercase text-slate-600">
=======
                            <p className="text-text-primary group-hover/link:text-accent-primary text-lg font-bold tabular-nums">
                              {item.value}
                            </p>
                            <p className="text-text-secondary text-[9px] font-semibold uppercase">
>>>>>>> recover/cabinet-wip-from-stash
                              {item.label}
                            </p>
                          </Link>
                          <div className="flex shrink-0 items-center gap-1">
                            {(item.alertCount ?? 0) > 0 && (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className="flex h-5 min-w-5 cursor-help items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white">
                                    {item.alertCount! > 99 ? '99+' : item.alertCount}
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent side="top" className="max-w-[220px] text-xs">
                                  {item.statusShort ||
                                    item.statusShort2 ||
                                    `Требуют внимания: ${item.alertCount}`}
                                </TooltipContent>
                              </Tooltip>
                            )}
                            {(item.description || (item.tips && item.tips.length > 0)) && (
                              <Popover modal={false}>
                                <PopoverTrigger asChild>
                                  <button
                                    type="button"
<<<<<<< HEAD
                                    className="shrink-0 rounded p-0.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
=======
                                    className="text-text-muted hover:text-text-secondary hover:bg-bg-surface2 shrink-0 rounded p-0.5"
>>>>>>> recover/cabinet-wip-from-stash
                                    aria-label="Подсказка"
                                  >
                                    <HelpCircle className="h-3.5 w-3.5" />
                                  </button>
                                </PopoverTrigger>
                                <PopoverContent
                                  align="end"
                                  side="bottom"
                                  className="z-[200] w-64 rounded-xl p-3 text-left"
                                  onOpenAutoFocus={(e) => e.preventDefault()}
                                >
                                  {item.description && (
<<<<<<< HEAD
                                    <p className="mb-2 text-[10px] leading-relaxed text-slate-600">
=======
                                    <p className="text-text-secondary mb-2 text-[10px] leading-relaxed">
>>>>>>> recover/cabinet-wip-from-stash
                                      {item.description}
                                    </p>
                                  )}
                                  {item.tips && item.tips.length > 0 && (
<<<<<<< HEAD
                                    <ul className="list-inside list-disc space-y-0.5 text-[9px] text-slate-500">
=======
                                    <ul className="text-text-secondary list-inside list-disc space-y-0.5 text-[9px]">
>>>>>>> recover/cabinet-wip-from-stash
                                      {item.tips.map((t, i) => (
                                        <li key={i}>{t}</li>
                                      ))}
                                    </ul>
                                  )}
                                </PopoverContent>
                              </Popover>
                            )}
                          </div>
                        </div>
                        {item.roleInChain && (
<<<<<<< HEAD
                          <p className="mt-0.5 text-[8px] text-slate-400">
=======
                          <p className="text-text-muted mt-0.5 text-[8px]">
>>>>>>> recover/cabinet-wip-from-stash
                            {PARTNER_ROLE_LABELS[item.roleInChain]}
                          </p>
                        )}
                        {item.subline && (
<<<<<<< HEAD
                          <p className="mt-1 line-clamp-1 text-[9px] text-slate-500">
=======
                          <p className="text-text-secondary mt-1 line-clamp-1 text-[9px]">
>>>>>>> recover/cabinet-wip-from-stash
                            {item.subline}
                          </p>
                        )}
                        {item.businessProcesses && item.businessProcesses.length > 0 && (
                          <div className="mt-1 flex flex-wrap gap-x-2 gap-y-0.5">
                            {item.businessProcesses.map((bp) => (
                              <Link
                                key={bp.href}
                                href={bp.href}
                                onClick={(e) => e.stopPropagation()}
<<<<<<< HEAD
                                className="text-[8px] text-indigo-600 hover:underline"
=======
                                className="text-accent-primary text-[8px] hover:underline"
>>>>>>> recover/cabinet-wip-from-stash
                              >
                                {bp.label}
                              </Link>
                            ))}
                          </div>
                        )}
                        {item.statusShort2 &&
                          (item.statusHref2 ? (
                            <Link
                              href={item.statusHref2}
<<<<<<< HEAD
                              className="mt-1 line-clamp-1 text-[9px] font-medium text-indigo-600 hover:underline"
=======
                              className="text-accent-primary mt-1 line-clamp-1 text-[9px] font-medium hover:underline"
>>>>>>> recover/cabinet-wip-from-stash
                            >
                              {item.statusShort2} →
                            </Link>
                          ) : (
<<<<<<< HEAD
                            <p className="mt-1 line-clamp-1 text-[9px] text-slate-500">
=======
                            <p className="text-text-secondary mt-1 line-clamp-1 text-[9px]">
>>>>>>> recover/cabinet-wip-from-stash
                              {item.statusShort2}
                            </p>
                          ))}
                        {item.statusShort &&
                          (item.statusHref ? (
                            <Link
                              href={item.statusHref}
                              className={cn(
<<<<<<< HEAD
                                'line-clamp-1 text-[9px] font-medium text-indigo-600 hover:underline',
=======
                                'text-accent-primary line-clamp-1 text-[9px] font-medium hover:underline',
>>>>>>> recover/cabinet-wip-from-stash
                                item.statusShort2 ? 'mt-0.5' : 'mt-1'
                              )}
                            >
                              {item.statusShort} →
                            </Link>
                          ) : (
                            <p
                              className={cn(
<<<<<<< HEAD
                                'line-clamp-1 text-[9px] text-slate-500',
=======
                                'text-text-secondary line-clamp-1 text-[9px]',
>>>>>>> recover/cabinet-wip-from-stash
                                item.statusShort2 ? 'mt-0.5' : 'mt-1'
                              )}
                            >
                              {item.statusShort}
                            </p>
                          ))}
                        {item.detailMetrics && item.detailMetrics.length > 0 && (
                          <div className="mt-2 space-y-0.5">
                            {item.detailMetrics.slice(0, 3).map((m) =>
                              m.href ? (
                                <Link
                                  key={m.label}
                                  href={m.href}
                                  onClick={(e) => e.stopPropagation()}
<<<<<<< HEAD
                                  className="flex justify-between text-[9px] text-slate-600 hover:text-indigo-600"
=======
                                  className="text-text-secondary hover:text-accent-primary flex justify-between text-[9px]"
>>>>>>> recover/cabinet-wip-from-stash
                                >
                                  <span className="truncate">{m.label}</span>
                                  <span className="ml-1 shrink-0 font-semibold tabular-nums">
                                    {m.value} →
                                  </span>
                                </Link>
                              ) : (
                                <div
                                  key={m.label}
<<<<<<< HEAD
                                  className="flex justify-between text-[9px] text-slate-600"
=======
                                  className="text-text-secondary flex justify-between text-[9px]"
>>>>>>> recover/cabinet-wip-from-stash
                                >
                                  <span className="truncate">{m.label}</span>
                                  <span className="ml-1 shrink-0 font-semibold tabular-nums">
                                    {m.value}
                                  </span>
                                </div>
                              )
                            )}
                          </div>
                        )}
                        {hasProgress && (
                          <div className="mt-2">
                            <Progress
                              value={progressPct}
<<<<<<< HEAD
                              className="h-1.5 bg-slate-100"
                              indicatorClassName="bg-amber-500"
                            />
                            <p className="mt-0.5 text-[8px] text-slate-400">
=======
                              className="bg-bg-surface2 h-1.5"
                              indicatorClassName="bg-amber-500"
                            />
                            <p className="text-text-muted mt-0.5 text-[8px]">
>>>>>>> recover/cabinet-wip-from-stash
                              активно {item.progressValue}/{item.progressMax}
                            </p>
                          </div>
                        )}
<<<<<<< HEAD
                        <div className="mt-auto flex items-center justify-between gap-2 border-t border-slate-100 pt-3">
                          <Link
                            href={item.href}
                            className="flex items-center gap-0.5 text-[9px] font-semibold text-indigo-600 hover:text-indigo-700"
=======
                        <div className="border-border-subtle mt-auto flex items-center justify-between gap-2 border-t pt-3">
                          <Link
                            href={item.href}
                            className="text-accent-primary hover:text-accent-primary flex items-center gap-0.5 text-[9px] font-semibold"
>>>>>>> recover/cabinet-wip-from-stash
                          >
                            Открыть раздел
                            <ArrowRight className="h-3 w-3" />
                          </Link>
                          <Link
                            href={item.addHref}
                            onClick={(e) => e.stopPropagation()}
<<<<<<< HEAD
                            className="flex items-center gap-0.5 text-[9px] font-medium text-slate-500 hover:text-indigo-600"
=======
                            className="text-text-secondary hover:text-accent-primary flex items-center gap-0.5 text-[9px] font-medium"
>>>>>>> recover/cabinet-wip-from-stash
                          >
                            <Plus className="h-3 w-3" />
                            {item.addLabel}
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>

<<<<<<< HEAD
                <p className="mb-2 mt-6 text-[9px] font-semibold uppercase tracking-wide text-slate-400">
=======
                <p className="text-text-muted mb-2 mt-6 text-[9px] font-semibold uppercase tracking-wide">
>>>>>>> recover/cabinet-wip-from-stash
                  Связь с процессами • за {growthPeriodKey === '7d' ? '7 дн.' : '30 дн.'}
                </p>
                <div className="flex flex-nowrap gap-3 overflow-x-auto pb-1">
                  {PARTNER_BUSINESS_PROCESSES.map((p) => {
                    const Icon = p.icon;
                    const count = growthPeriodKey === '7d' ? p.count7d : p.count30d;
                    const changePct = growthPeriodKey === '7d' ? p.changePct7d : p.changePct30d;
                    return (
                      <div
                        key={p.id}
<<<<<<< HEAD
                        className="relative flex min-h-[280px] w-[200px] shrink-0 flex-col rounded-xl border border-slate-200 bg-white p-3 transition-colors hover:border-slate-300"
=======
                        className="border-border-default hover:border-border-default relative flex min-h-[280px] w-[200px] shrink-0 flex-col rounded-xl border bg-white p-3 transition-colors"
>>>>>>> recover/cabinet-wip-from-stash
                      >
                        {changePct != null && (
                          <p
                            className={cn(
                              'absolute right-2 top-2 text-[9px] font-bold tabular-nums',
                              changePct >= 0 ? 'text-emerald-600' : 'text-rose-600'
                            )}
                          >
                            {changePct >= 0 ? '+' : ''}
                            {changePct}%
                          </p>
                        )}
                        <div className="flex items-start justify-between gap-2">
                          <div
                            className={cn(
                              'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white',
                              p.color
                            )}
                          >
                            <Icon className="h-4 w-4" />
                          </div>
                        </div>
                        <div className="mt-2 flex items-start gap-1">
                          <Link
                            href={p.href}
                            className="group/link block min-w-0 flex-1"
                            title={p.description}
                          >
<<<<<<< HEAD
                            <p className="text-lg font-bold tabular-nums text-slate-900 group-hover/link:text-indigo-600">
                              {count}
                            </p>
                            <p className="text-[9px] font-semibold uppercase text-slate-600">
=======
                            <p className="text-text-primary group-hover/link:text-accent-primary text-lg font-bold tabular-nums">
                              {count}
                            </p>
                            <p className="text-text-secondary text-[9px] font-semibold uppercase">
>>>>>>> recover/cabinet-wip-from-stash
                              {p.label}
                            </p>
                          </Link>
                          {(p.description || (p.tips && p.tips.length > 0)) && (
                            <Popover modal={false}>
                              <PopoverTrigger asChild>
                                <button
                                  type="button"
<<<<<<< HEAD
                                  className="shrink-0 rounded p-0.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
=======
                                  className="text-text-muted hover:text-text-secondary hover:bg-bg-surface2 shrink-0 rounded p-0.5"
>>>>>>> recover/cabinet-wip-from-stash
                                  aria-label="Подсказка"
                                >
                                  <HelpCircle className="h-3.5 w-3.5" />
                                </button>
                              </PopoverTrigger>
                              <PopoverContent
                                align="end"
                                side="bottom"
                                className="z-[200] w-64 rounded-xl p-3 text-left"
                              >
                                {p.description && (
<<<<<<< HEAD
                                  <p className="mb-2 text-[10px] leading-relaxed text-slate-600">
=======
                                  <p className="text-text-secondary mb-2 text-[10px] leading-relaxed">
>>>>>>> recover/cabinet-wip-from-stash
                                    {p.description}
                                  </p>
                                )}
                                {p.tips && p.tips.length > 0 && (
<<<<<<< HEAD
                                  <ul className="list-inside list-disc space-y-0.5 text-[9px] text-slate-500">
=======
                                  <ul className="text-text-secondary list-inside list-disc space-y-0.5 text-[9px]">
>>>>>>> recover/cabinet-wip-from-stash
                                    {p.tips.map((t, i) => (
                                      <li key={i}>{t}</li>
                                    ))}
                                  </ul>
                                )}
                              </PopoverContent>
                            </Popover>
                          )}
                        </div>
<<<<<<< HEAD
                        <p className="mt-1 line-clamp-1 text-[9px] text-slate-500">{p.sub}</p>
=======
                        <p className="text-text-secondary mt-1 line-clamp-1 text-[9px]">{p.sub}</p>
>>>>>>> recover/cabinet-wip-from-stash
                        {p.detailMetrics && p.detailMetrics.length > 0 && (
                          <div className="mt-2 space-y-0.5">
                            {p.detailMetrics.slice(0, 3).map((m) =>
                              m.href ? (
                                <Link
                                  key={m.label}
                                  href={m.href}
                                  onClick={(e) => e.stopPropagation()}
<<<<<<< HEAD
                                  className="flex justify-between text-[9px] text-slate-600 hover:text-indigo-600"
=======
                                  className="text-text-secondary hover:text-accent-primary flex justify-between text-[9px]"
>>>>>>> recover/cabinet-wip-from-stash
                                >
                                  <span className="truncate">{m.label}</span>
                                  <span className="ml-1 shrink-0 font-semibold tabular-nums">
                                    {m.value} →
                                  </span>
                                </Link>
                              ) : (
                                <div
                                  key={m.label}
<<<<<<< HEAD
                                  className="flex justify-between text-[9px] text-slate-600"
=======
                                  className="text-text-secondary flex justify-between text-[9px]"
>>>>>>> recover/cabinet-wip-from-stash
                                >
                                  <span className="truncate">{m.label}</span>
                                  <span className="ml-1 shrink-0 font-semibold tabular-nums">
                                    {m.value}
                                  </span>
                                </div>
                              )
                            )}
                          </div>
                        )}
<<<<<<< HEAD
                        <div className="mt-auto flex items-center justify-between gap-2 border-t border-slate-100 pt-3">
                          <Link
                            href={p.href}
                            className="flex items-center gap-0.5 text-[9px] font-semibold text-indigo-600 hover:text-indigo-700"
=======
                        <div className="border-border-subtle mt-auto flex items-center justify-between gap-2 border-t pt-3">
                          <Link
                            href={p.href}
                            className="text-accent-primary hover:text-accent-primary flex items-center gap-0.5 text-[9px] font-semibold"
>>>>>>> recover/cabinet-wip-from-stash
                          >
                            Открыть раздел
                            <ArrowRight className="h-3 w-3" />
                          </Link>
                          {p.addHref && p.addLabel && (
                            <Link
                              href={p.addHref}
                              onClick={(e) => e.stopPropagation()}
<<<<<<< HEAD
                              className="flex items-center gap-0.5 text-[9px] font-medium text-slate-500 hover:text-indigo-600"
=======
                              className="text-text-secondary hover:text-accent-primary flex items-center gap-0.5 text-[9px] font-medium"
>>>>>>> recover/cabinet-wip-from-stash
                            >
                              <Plus className="h-3 w-3" />
                              {p.addLabel}
                            </Link>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

<<<<<<< HEAD
                <p className="mb-2 mt-6 text-[9px] font-semibold uppercase tracking-wide text-slate-400">
=======
                <p className="text-text-muted mb-2 mt-6 text-[9px] font-semibold uppercase tracking-wide">
>>>>>>> recover/cabinet-wip-from-stash
                  Процессы и области • за {growthPeriodKey === '7d' ? '7 дн.' : '30 дн.'}
                </p>
                <div className="flex flex-nowrap gap-3 overflow-x-auto pb-1">
                  {PARTNER_ECOSYSTEM_BLOCKS.map((b) => {
                    const BlockIcon = b.icon;
                    const blockMetrics =
                      growthPeriodKey === '7d'
                        ? (b.metrics7d ?? b.metrics)
                        : (b.metrics30d ?? b.metrics);
                    const blockAlertCount =
                      growthPeriodKey === '7d'
                        ? (b.alertCount7d ?? b.alertCount ?? 0)
                        : (b.alertCount30d ?? b.alertCount ?? 0);
                    const changePct = growthPeriodKey === '7d' ? b.changePct7d : b.changePct30d;
                    return (
                      <div
                        key={b.id}
                        role="article"
                        aria-label={b.titleLines ? b.titleLines.join(' ') : b.title}
                        className={cn(
                          'relative flex min-h-[280px] w-[200px] shrink-0 flex-col rounded-xl border p-3 text-left transition-colors',
                          blockAlertCount > 0
                            ? 'border-rose-200 bg-rose-50/30 hover:bg-rose-50/50'
<<<<<<< HEAD
                            : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
=======
                            : 'border-border-default hover:border-border-default hover:bg-bg-surface2/80 bg-white'
>>>>>>> recover/cabinet-wip-from-stash
                        )}
                      >
                        {changePct != null && (
                          <p
                            className={cn(
                              'absolute right-2 top-2 text-[9px] font-bold tabular-nums',
                              changePct >= 0 ? 'text-emerald-600' : 'text-rose-600'
                            )}
                          >
                            {changePct >= 0 ? '+' : ''}
                            {changePct}%
                          </p>
                        )}
                        <div className="flex items-start justify-between gap-2">
                          <div
                            className={cn(
                              'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white',
                              b.color
                            )}
                          >
                            <BlockIcon className="h-4 w-4" />
                          </div>
                        </div>
                        <div className="mb-1.5 mt-2 flex items-start justify-between gap-2">
                          <Link
                            href={b.href}
<<<<<<< HEAD
                            className="min-w-0 flex-1 text-[11px] font-bold uppercase leading-tight tracking-tight text-slate-900 hover:text-indigo-600"
=======
                            className="text-text-primary hover:text-accent-primary min-w-0 flex-1 text-[11px] font-bold uppercase leading-tight tracking-tight"
>>>>>>> recover/cabinet-wip-from-stash
                          >
                            {b.titleLines ? (
                              <>
                                <span>{b.titleLines[0]}</span>
                                <span className="block">{b.titleLines[1]}</span>
                              </>
                            ) : (
                              b.title
                            )}
                          </Link>
                          <div className="flex shrink-0 items-center gap-1">
                            {blockAlertCount > 0 && (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className="flex h-5 min-w-5 cursor-help items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white">
                                    {blockAlertCount > 99 ? '99+' : blockAlertCount}
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent side="top" className="max-w-[220px] text-xs">
                                  {b.alertTooltip ?? `Требуют внимания: ${blockAlertCount}`}
                                </TooltipContent>
                              </Tooltip>
                            )}
                            <Popover modal={false}>
                              <PopoverTrigger asChild>
                                <button
                                  type="button"
<<<<<<< HEAD
                                  className="shrink-0 rounded p-0.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
=======
                                  className="text-text-muted hover:text-text-secondary hover:bg-bg-surface2 shrink-0 rounded p-0.5"
>>>>>>> recover/cabinet-wip-from-stash
                                  aria-label="Описание"
                                >
                                  <HelpCircle className="h-3.5 w-3.5" />
                                </button>
                              </PopoverTrigger>
                              <PopoverContent
                                align="end"
                                side="bottom"
                                className="z-[200] w-64 rounded-xl p-3 text-left"
                              >
<<<<<<< HEAD
                                <p className="text-[10px] leading-relaxed text-slate-600">
=======
                                <p className="text-text-secondary text-[10px] leading-relaxed">
>>>>>>> recover/cabinet-wip-from-stash
                                  {b.description}
                                </p>
                              </PopoverContent>
                            </Popover>
                          </div>
                        </div>
                        <ul className="mt-1 space-y-0.5">
                          {blockMetrics.slice(0, 3).map((m) => (
                            <li key={m.label}>
                              {m.href ? (
                                <Link
                                  href={m.href}
<<<<<<< HEAD
                                  className="flex justify-between text-[9px] text-slate-600 hover:text-indigo-600"
=======
                                  className="text-text-secondary hover:text-accent-primary flex justify-between text-[9px]"
>>>>>>> recover/cabinet-wip-from-stash
                                >
                                  <span className="truncate">{m.label}</span>
                                  <span className="ml-1 shrink-0 font-semibold tabular-nums">
                                    {m.value} →
                                  </span>
                                </Link>
                              ) : (
                                <div className="text-text-secondary flex justify-between text-[9px]">
                                  <span className="truncate">{m.label}</span>
                                  <span className="ml-1 shrink-0 font-semibold tabular-nums">
                                    {m.value}
                                  </span>
                                </div>
                              )}
                            </li>
                          ))}
                        </ul>
<<<<<<< HEAD
                        <div className="mt-auto flex items-center justify-between gap-2 border-t border-slate-100 pt-3">
                          <Link
                            href={b.href}
                            className="flex items-center gap-0.5 text-[9px] font-semibold text-indigo-600 hover:text-indigo-700"
=======
                        <div className="border-border-subtle mt-auto flex items-center justify-between gap-2 border-t pt-3">
                          <Link
                            href={b.href}
                            className="text-accent-primary hover:text-accent-primary flex items-center gap-0.5 text-[9px] font-semibold"
>>>>>>> recover/cabinet-wip-from-stash
                          >
                            Открыть раздел
                            <ArrowRight className="h-3 w-3" />
                          </Link>
                          {b.addHref && b.addLabel && (
                            <Link
                              href={b.addHref}
                              onClick={(e) => e.stopPropagation()}
<<<<<<< HEAD
                              className="flex items-center gap-0.5 text-[9px] font-medium text-slate-500 hover:text-indigo-600"
=======
                              className="text-text-secondary hover:text-accent-primary flex items-center gap-0.5 text-[9px] font-medium"
>>>>>>> recover/cabinet-wip-from-stash
                            >
                              <Plus className="h-3 w-3" />
                              {b.addLabel}
                            </Link>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </TooltipProvider>
          );
        })()}
      </SectionBlock>

      {/* Разделы организации */}
      <div id="sections-modules" className="scroll-mt-4">
        <SectionBlock
          title="Разделы организации"
          meta={SECTION_META.modules}
          accentColor="emerald"
          history={globalHistory}
        >
<<<<<<< HEAD
          <Card className="rounded-xl border border-slate-200 bg-white p-4 md:p-5">
            <p className="mb-2 text-[9px] font-semibold uppercase tracking-wide text-slate-400">
=======
          <div className={cn(registryFeedLayout.panelCardSoft, 'p-4 md:p-5')}>
            <p className="text-text-muted mb-2 text-[9px] font-semibold uppercase tracking-wide">
>>>>>>> recover/cabinet-wip-from-stash
              {modulesPeriodKey === '7d' ? 'За 7 дн.' : 'За 30 дн.'}
            </p>
            <div className="flex flex-nowrap gap-3 overflow-x-auto pb-1">
              {NAVIGATION_CARDS.map((card) => {
                const changePct =
                  modulesPeriodKey === '7d'
                    ? (card as any).changePct7d
                    : (card as any).changePct30d;
                const addHref = (card as any).addHref;
                const addLabel = (card as any).addLabel;
                const CardIcon = card.icon;
                return (
                  <div
                    key={card.href}
                    role="link"
                    tabIndex={0}
                    onClick={() => router.push(card.href)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        router.push(card.href);
                      }
                    }}
                    aria-label={`Перейти в раздел: ${card.title}`}
                    className={cn(
                      'relative flex min-h-[280px] w-[200px] shrink-0 cursor-pointer flex-col rounded-xl border p-3 text-left transition-colors',
                      card.stats.status === 'warning'
                        ? 'border-rose-200 bg-rose-50/30 hover:bg-rose-50/50'
<<<<<<< HEAD
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
=======
                        : 'border-border-default hover:border-border-default hover:bg-bg-surface2/80 bg-white'
>>>>>>> recover/cabinet-wip-from-stash
                    )}
                  >
                    {changePct != null && (
                      <p
                        className={cn(
                          'absolute right-2 top-2 text-[9px] font-bold tabular-nums',
                          changePct >= 0 ? 'text-emerald-600' : 'text-rose-600'
                        )}
                      >
                        {changePct >= 0 ? '+' : ''}
                        {changePct}%
                      </p>
                    )}
                    <div className="flex items-start justify-between gap-2">
                      <div
                        className={cn(
                          'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white',
                          card.bg.replace('-50', '-500')
                        )}
                      >
                        <CardIcon className="h-4 w-4" />
                      </div>
                    </div>
                    <div className="mt-2 flex items-start justify-between gap-2">
<<<<<<< HEAD
                      <h3 className="min-w-0 flex-1 text-[11px] font-bold uppercase leading-tight tracking-tight text-slate-900">
=======
                      <h3 className="text-text-primary min-w-0 flex-1 text-[11px] font-bold uppercase leading-tight tracking-tight">
>>>>>>> recover/cabinet-wip-from-stash
                        {card.title}
                      </h3>
                      <div
                        className="flex shrink-0 items-center gap-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {card.stats.status === 'warning' && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="flex h-5 min-w-5 cursor-help items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white">
                                {/^\d+$/.test(String(card.stats.value)) ? card.stats.value : '!'}
                              </span>
                            </TooltipTrigger>
                            <TooltipContent side="top" className="max-w-[220px] text-xs">
                              Требует внимания: {card.stats.label} {card.stats.value}. Откройте
                              раздел для устранения.
                            </TooltipContent>
                          </Tooltip>
                        )}
                        <Popover modal={false}>
                          <PopoverTrigger asChild>
                            <button
                              type="button"
<<<<<<< HEAD
                              className="rounded p-0.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
=======
                              className="text-text-muted hover:text-text-secondary hover:bg-bg-surface2 rounded p-0.5"
>>>>>>> recover/cabinet-wip-from-stash
                              aria-label="Описание раздела"
                            >
                              <HelpCircle className="h-3.5 w-3.5" />
                            </button>
                          </PopoverTrigger>
                          <PopoverContent
                            align="end"
                            side="bottom"
                            className="z-[200] w-64 rounded-xl p-3 text-left"
                          >
<<<<<<< HEAD
                            <p className="text-[10px] leading-relaxed text-slate-600">
=======
                            <p className="text-text-secondary text-[10px] leading-relaxed">
>>>>>>> recover/cabinet-wip-from-stash
                              {card.description}
                            </p>
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                    <div className="mt-2 space-y-0.5">
                      <div className="text-text-secondary flex justify-between text-[9px]">
                        <span className="truncate">{card.stats.label}</span>
                        <span
                          className={cn(
                            'ml-1 shrink-0 font-semibold tabular-nums',
                            card.stats.status === 'success'
                              ? 'text-emerald-600'
                              : card.stats.status === 'warning'
                                ? 'text-amber-600'
<<<<<<< HEAD
                                : 'text-slate-900'
=======
                                : 'text-text-primary'
>>>>>>> recover/cabinet-wip-from-stash
                          )}
                        >
                          {card.title === 'Команда' ? participantsCount : card.stats.value}
                        </span>
                      </div>
                    </div>
<<<<<<< HEAD
                    <div className="mt-auto flex items-center justify-between gap-2 border-t border-slate-100 pt-3">
                      <button
                        type="button"
                        className="flex items-center gap-0.5 text-left text-[9px] font-semibold text-indigo-600 hover:text-indigo-700"
=======
                    <div className="border-border-subtle mt-auto flex items-center justify-between gap-2 border-t pt-3">
                      <button
                        type="button"
                        className="text-accent-primary hover:text-accent-primary flex items-center gap-0.5 text-left text-[9px] font-semibold"
>>>>>>> recover/cabinet-wip-from-stash
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(card.href);
                        }}
                      >
                        Открыть раздел
                        <ArrowRight className="h-3 w-3 shrink-0" />
                      </button>
                      {addHref && addLabel ? (
                        <button
                          type="button"
<<<<<<< HEAD
                          className="flex items-center gap-0.5 text-left text-[9px] font-medium text-slate-500 hover:text-indigo-600"
=======
                          className="text-text-secondary hover:text-accent-primary flex items-center gap-0.5 text-left text-[9px] font-medium"
>>>>>>> recover/cabinet-wip-from-stash
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(addHref);
                          }}
                        >
                          <Plus className="h-3 w-3 shrink-0" />
                          {addLabel}
                        </button>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </SectionBlock>
      </div>
    </>
  );
}
