'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/auth-provider';
import { useUIState } from '@/providers/ui-state';
import { CeoReportSheet, REPORT_DATA } from '@/components/brand/ceo-report-sheet';
import { Card } from '@/components/ui/card';
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
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
  modulesPeriodKey: string;
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
  const dd = (d: Date) => d.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
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
      <div className="rounded-2xl border border-slate-100 shadow-sm p-5 bg-gradient-to-br from-slate-50/50 to-white">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0 bg-indigo-100 text-indigo-600">
                <LayoutDashboard className="h-5 w-5" />
              </div>
              <Badge variant="outline" className="text-[9px]">Organization Hub</Badge>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              {healthLoading ? (
                <>
                  <div className="h-6 w-32 rounded bg-slate-100 animate-pulse" aria-hidden />
                  <span className="text-slate-300 hidden sm:inline">•</span>
                  <div className="h-6 w-16 rounded bg-slate-100 animate-pulse" aria-hidden />
                  <span className="text-slate-300 hidden sm:inline">•</span>
                  <div className="h-6 w-24 rounded bg-slate-100 animate-pulse" aria-hidden />
                  <span className="text-slate-300 hidden sm:inline">•</span>
                  <div className="h-6 w-20 rounded bg-slate-100 animate-pulse" aria-hidden />
                </>
              ) : (
              <>
              <Popover>
                <PopoverTrigger asChild>
                  <button className="flex items-center gap-1.5 text-[10px] font-black text-slate-500 hover:text-indigo-600 transition-colors rounded-lg px-1.5 py-0.5 -mx-1.5 hover:bg-indigo-50" aria-label="Профиль организации">
                    <Building2 className="h-3 w-3" />
                    {orgProfile?.brand?.name ?? 'Syntha HQ'}
                  </button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-72 p-4 rounded-xl border-slate-200 shadow-xl">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                        <Building2 className="h-4 w-4 text-indigo-600" />
                      </div>
                      <div>
                        <h4 className="text-[10px] font-black uppercase text-slate-900">{orgProfile?.brand?.name ?? 'Syntha HQ'}</h4>
                        <p className="text-[8px] text-slate-500">Организация</p>
                      </div>
                    </div>
                    <div className="space-y-1.5 text-[9px] text-slate-600">
                      <p><span className="font-bold text-slate-500">Юр. лицо:</span> {orgProfile?.legal?.legal_name ?? 'ООО «Синта Фэшн»'}</p>
                      <p><span className="font-bold text-slate-500">ИНН:</span> {orgProfile?.legal?.inn ?? '7701234567'}</p>
                    </div>
                    <Button asChild size="sm" variant="outline" className="w-full h-7 text-[9px] font-black uppercase">
                      <Link href="/brand" className="flex items-center justify-center gap-1.5">Профиль бренда <ExternalLink className="h-3 w-3" /></Link>
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
              <span className="text-slate-300 hidden sm:inline">•</span>
              <Popover>
                <PopoverTrigger asChild>
                  <button className="rounded-lg px-1.5 py-0.5 -mx-1.5 hover:bg-emerald-50 transition-colors" aria-label="Подписка Elite">
                    <Badge variant="outline" className="text-[9px] font-bold border-emerald-200 text-emerald-600 cursor-pointer hover:border-emerald-400">Elite</Badge>
                  </button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-72 p-4 rounded-xl border-slate-200 shadow-xl">
                  <div className="space-y-3">
                    <h4 className="text-[10px] font-black uppercase text-slate-900">Elite Plan</h4>
                    <p className="text-[8px] text-slate-500">Подписка</p>
                    <Button asChild size="sm" variant="outline" className="w-full h-7 text-[9px] font-black uppercase">
                      <Link href="/brand/subscription" className="flex items-center justify-center gap-1.5">Подписка и биллинг <ExternalLink className="h-3 w-3" /></Link>
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
              <span className="text-slate-300 hidden sm:inline">•</span>
              <Popover>
                <PopoverTrigger asChild>
                  <button className="flex items-center gap-1.5 text-[10px] font-black text-slate-500 hover:text-indigo-600 rounded-lg px-1.5 py-0.5 -mx-1.5 hover:bg-indigo-50" aria-label={`Команда: ${participantsCount} участников`}>
                    <Users className="h-3 w-3" /> {participantsCount} участников
                  </button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-72 p-4 rounded-xl border-slate-200 shadow-xl">
                  <h4 className="text-[10px] font-black uppercase text-slate-900">Команда</h4>
                  <p className="text-[8px] text-slate-500">{participantsCount} участников</p>
                  <Button asChild size="sm" variant="outline" className="w-full h-7 text-[9px] font-black uppercase mt-2">
                    <Link href="/brand/team" className="flex items-center justify-center gap-1.5">Команда и активность <ExternalLink className="h-3 w-3" /></Link>
                  </Button>
                </PopoverContent>
              </Popover>
              <span className="text-slate-300 hidden sm:inline">•</span>
              <Popover>
                <PopoverTrigger asChild>
                  <button className="flex items-center gap-1.5 text-[10px] font-black text-emerald-600 hover:text-emerald-700 rounded-lg px-1.5 py-0.5 -mx-1.5 hover:bg-emerald-50" aria-label={`Сейчас онлайн: ${onlineCount} из ${participantsCount}`}>
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> {onlineCount} онлайн
                  </button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-72 p-4 rounded-xl border-slate-200 shadow-xl">
                  <h4 className="text-[10px] font-black uppercase text-slate-900">Сейчас онлайн</h4>
                  <p className="text-[8px] text-slate-500">{onlineCount} из {participantsCount} в системе</p>
                </PopoverContent>
              </Popover>
              </>
              )}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <div className="h-3.5 w-1 bg-indigo-500 rounded-full shrink-0" />
                <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Организация</h2>
              </div>
              <h3 className="text-sm font-black uppercase text-slate-900">Центр управления</h3>
              <div className="flex items-center gap-2 text-[8px] font-bold uppercase tracking-widest text-slate-400">
                <Link href="/brand?group=strategy&tab=overview" className="hover:text-indigo-600 transition-colors">Обзор</Link>
                <span className="text-slate-300">›</span>
                <span className="text-indigo-600">Центр управления</span>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap shrink-0">
              <span className="text-[9px] font-bold uppercase text-slate-400">
                Период:{typeof activityPeriod === 'object' && (
                  <span className="ml-1 font-normal text-slate-500 normal-case">{formatActivityPeriod(activityPeriod)}</span>
                )}
              </span>
              <div className="flex items-center gap-1 bg-slate-50 p-0.5 rounded-[4px] border border-slate-200 shadow-sm h-[26px]">
                {(['7d', '30d'] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setActivityPeriod(p)}
                    aria-label={p === '7d' ? 'Период: 7 дней' : 'Период: 30 дней'}
                    aria-pressed={activityPeriod === p}
                    className={cn(
                      'h-[20px] min-h-[20px] px-2.5 rounded-[2px] text-[9px] font-black uppercase tracking-widest transition-all flex items-center',
                      activityPeriod === p ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200' : 'text-slate-400 hover:text-slate-600 hover:bg-white/50'
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
                        'h-[20px] min-h-[20px] px-2.5 rounded-[2px] text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-1',
                        typeof activityPeriod === 'object' ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200' : 'text-slate-400 hover:text-slate-600 hover:bg-white/50'
                      )}
                    >
                      <CalendarIcon className="h-3 w-3" /> Календарь
                    </button>
                  </PopoverTrigger>
                  <PopoverContent align="end" className="w-auto p-0 rounded-xl border-slate-200 shadow-xl">
                    <CalendarComponent
                      mode="range"
                      selected={typeof activityPeriod === 'object' ? activityPeriod : customRange}
                      onSelect={(range) => {
                        if (range?.from) {
                          setCustomRange(range);
                          const to = range.to ?? range.from;
                          setActivityPeriod({ from: range.from, to });
                        }
                      }}
                      defaultMonth={typeof activityPeriod === 'object' ? activityPeriod.from : new Date()}
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
        <SectionBlock title="Результаты бренда по ролям" meta={{ description: 'Краткое описание результатов бренда с позиции CEO, CFO, COO и др.', purpose: 'Для владельцев и пользователей, зарегистрированных под соответствующей ролью.', functionality: ['Отчёт CEO', 'Отчёт CFO', 'Отчёт COO', 'и др.'], importance: 7 }} accentColor="indigo" className="min-w-0">
          <Card className="rounded-xl border border-slate-200 shadow-sm bg-white p-4">
            <p className="text-[10px] text-slate-500 mb-3">Выберите роль для просмотра сводки результатов бренда с её позиции:</p>
            <div className="flex flex-wrap gap-2">
              {ROLE_REPORTS.filter((r) => {
                const rd = (REPORT_DATA as Record<string, { scope?: string }>)[r.id];
                return !rd || rd.scope === 'shared' || rd.scope === businessMode;
              }).map((role) => (
                <Button
                  key={role.id}
                  variant="outline"
                  size="sm"
                  className="h-8 px-3 text-[9px] font-bold uppercase gap-1.5 border-slate-200 hover:border-indigo-200 hover:bg-indigo-50/50"
                  onClick={() => setActiveReportRole(role.id)}
                >
                  <UserCircle className="h-3 w-3" /> {role.label}
                </Button>
              ))}
            </div>
          </Card>
          <CeoReportSheet
            open={!!activeReportRole}
            onOpenChange={(open) => !open && setActiveReportRole(null)}
            role={activeReportRole || 'CEO'}
          />
        </SectionBlock>
      )}

      {/* Требует внимания */}
      <SectionBlock title="Требует внимания" meta={SECTION_META.alerts} accentColor="rose" className="min-w-0 overflow-hidden" history={globalHistory}>
        <Card className="rounded-xl border border-slate-200 shadow-sm bg-white p-4 md:p-5">
          <div className="flex flex-nowrap gap-3 overflow-x-auto pt-1 pb-1 h-[200px]">
            {healthLoading ? (
              <>
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="shrink-0 w-[240px] min-w-[240px] h-[200px] rounded-xl border border-slate-100 bg-slate-50 animate-pulse" aria-hidden />
                ))}
              </>
            ) : !alerts?.certificates?.length && !alerts?.profile?.length && !alerts?.tasks?.length && !alerts?.integrationIssues?.length ? (
              <div className="shrink-0 w-[240px] min-w-[240px] h-[200px] rounded-xl border border-emerald-200 bg-emerald-50/50 p-3 flex flex-col items-center justify-center gap-2 text-center">
                <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-emerald-600" />
                </div>
                <p className="text-[10px] font-black uppercase text-emerald-800">Всё в порядке</p>
                <p className="text-[9px] text-emerald-700">Нет срочных действий</p>
              </div>
            ) : (
            <>
            {/* Истекающие сертификаты */}
            {alerts?.certificates?.length > 0 && (() => {
              const meta = ALERT_BLOCK_META.certificates;
              return (
                <div className="shrink-0 w-[240px] min-w-[240px] h-[200px]">
                  <Popover>
                    <PopoverTrigger asChild>
                      <div
                        role="button"
                        tabIndex={0}
                        className="rounded-xl border border-amber-200 bg-amber-50/50 p-3 h-full flex flex-col cursor-pointer hover:bg-amber-50/80 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); (e.currentTarget as HTMLElement).click(); } }}
                      >
                        <div className="flex items-center justify-between gap-2 mb-2 shrink-0">
                          <div className="flex items-center gap-2 min-w-0">
                            <div className="h-9 w-9 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                              <Award className="h-4 w-4 text-amber-600" />
                            </div>
                            <h4 className="text-[9px] font-black uppercase text-amber-800 truncate">{getBlockLabel?.('certificates') ?? meta.title}</h4>
                          </div>
                          <div onClick={(e) => e.stopPropagation()} className="shrink-0">
                            <Popover>
                              <PopoverTrigger asChild>
                                <button type="button" className="p-0.5 rounded text-slate-400 hover:text-amber-600 hover:bg-amber-100" aria-label="Описание блока">
                                  <HelpCircle className="h-3.5 w-3.5" />
                                </button>
                              </PopoverTrigger>
                              <PopoverContent align="end" className="w-72 p-3 rounded-xl text-left">
                                <p className="text-[10px] text-slate-600 leading-relaxed">{meta.description}</p>
                              </PopoverContent>
                            </Popover>
                          </div>
                        </div>
                        <ul className="space-y-1.5 flex-1 min-h-0 overflow-auto mb-2">
                          {alerts.certificates.map((c: { id: string; name: string; daysLeft: number }) => (
                            <li key={c.id} className="flex items-center justify-between gap-2 text-[10px] text-slate-700">
                              <span className="truncate">{c.name}</span>
                              <span className="text-amber-600 font-bold shrink-0">{c.daysLeft} дн.</span>
                              <Link href={meta.detailHref} className="text-[8px] font-semibold text-amber-700 hover:underline shrink-0" onClick={(e) => e.stopPropagation()}>Устранить</Link>
                            </li>
                          ))}
                        </ul>
                        <div className="mt-auto flex justify-start gap-2">
                          <Link href={meta.detailHref} className="text-[9px] font-semibold text-amber-700 hover:underline inline-flex items-center gap-0.5" onClick={(e) => e.stopPropagation()}>Детально <ArrowRight className="h-3 w-3" /></Link>
                        </div>
                      </div>
                    </PopoverTrigger>
                    <PopoverContent align="start" className="w-[320px] max-h-[80vh] overflow-y-auto p-4 rounded-xl">
                      <h4 className="text-[10px] font-black uppercase text-amber-800 mb-2">{meta.title}</h4>
                      <p className="text-[10px] text-slate-600 leading-relaxed mb-3">{meta.description}</p>
                      <ul className="space-y-1.5 mb-3">
                        {alerts.certificates.map((c: { id: string; name: string; daysLeft: number }) => (
                          <li key={c.id} className="flex items-center justify-between gap-2 text-[10px] text-slate-700">
                            <span className="truncate">{c.name}</span>
                            <span className="text-amber-600 font-bold shrink-0">{c.daysLeft} дн.</span>
                            <Link href={meta.detailHref} className="text-[8px] font-semibold text-amber-700 hover:underline shrink-0">Устранить</Link>
                          </li>
                        ))}
                      </ul>
                      <div className="flex justify-start">
                        <Button asChild variant="outline" size="sm" className="text-[9px] font-bold">
                          <Link href={meta.detailHref} className="inline-flex items-center gap-0.5">Детально <ArrowRight className="h-3 w-3" /></Link>
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              );
            })()}
            {/* Незаполненные данные */}
            {alerts?.profile?.length > 0 && (() => {
              const meta = ALERT_BLOCK_META.profile;
              return (
                <div className="shrink-0 w-[240px] min-w-[240px] h-[200px]">
                  <Popover>
                    <PopoverTrigger asChild>
                      <div
                        role="button"
                        tabIndex={0}
                        className="rounded-xl border border-rose-200 bg-rose-50/50 p-3 h-full flex flex-col cursor-pointer hover:bg-rose-50/80 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-rose-300"
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); (e.currentTarget as HTMLElement).click(); } }}
                      >
                        <div className="flex items-center justify-between gap-2 mb-2 shrink-0">
                          <div className="flex items-center gap-2 min-w-0">
                            <div className="h-9 w-9 rounded-lg bg-rose-100 flex items-center justify-center shrink-0">
                              <Building2 className="h-4 w-4 text-rose-600" />
                            </div>
                            <h4 className="text-[9px] font-black uppercase text-rose-800 truncate">{getBlockLabel?.('profile') ?? meta.title}</h4>
                          </div>
                          <div onClick={(e) => e.stopPropagation()}>
                            <Popover>
                              <PopoverTrigger asChild>
                                <button type="button" className="p-0.5 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-100" aria-label="Описание блока">
                                  <HelpCircle className="h-3.5 w-3.5" />
                                </button>
                              </PopoverTrigger>
                              <PopoverContent align="end" className="w-72 p-3 rounded-xl text-left">
                                <p className="text-[10px] text-slate-600 leading-relaxed">{meta.description}</p>
                              </PopoverContent>
                            </Popover>
                          </div>
                        </div>
                        <ul className="space-y-1.5 flex-1 min-h-0 overflow-auto mb-2">
                          {alerts.profile.map((p: { id: string; name: string; detail: string }) => (
                            <li key={p.id} className="flex items-center justify-between gap-2 text-[10px] text-slate-700">
                              <span className="truncate" title={p.detail}>{p.name} — {p.detail}</span>
                              <Link href={meta.detailHref} className="text-[8px] font-semibold text-rose-700 hover:underline shrink-0" onClick={(e) => e.stopPropagation()}>Устранить</Link>
                            </li>
                          ))}
                        </ul>
                        <div className="mt-auto flex justify-start gap-2">
                          <Link href={meta.detailHref} className="text-[9px] font-semibold text-rose-700 hover:underline inline-flex items-center gap-0.5" onClick={(e) => e.stopPropagation()}>Детально <ArrowRight className="h-3 w-3" /></Link>
                        </div>
                      </div>
                    </PopoverTrigger>
                    <PopoverContent align="start" className="w-[320px] max-h-[80vh] overflow-y-auto p-4 rounded-xl">
                      <h4 className="text-[10px] font-black uppercase text-rose-800 mb-2">{meta.title}</h4>
                      <p className="text-[10px] text-slate-600 leading-relaxed mb-3">{meta.description}</p>
                      <ul className="space-y-1.5 mb-3">
                        {alerts.profile.map((p: { id: string; name: string; detail: string }) => (
                          <li key={p.id} className="flex items-center justify-between gap-2 text-[10px] text-slate-700">
                            <span className="truncate" title={p.detail}>{p.name} — {p.detail}</span>
                            <Link href={meta.detailHref} className="text-[8px] font-semibold text-rose-700 hover:underline shrink-0">Устранить</Link>
                          </li>
                        ))}
                      </ul>
                      <div className="flex justify-start">
                        <Button asChild variant="outline" size="sm" className="text-[9px] font-bold">
                          <Link href={meta.detailHref} className="inline-flex items-center gap-0.5">Детально <ArrowRight className="h-3 w-3" /></Link>
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              );
            })()}
            {/* Системы в норме / сбои */}
            <div className="shrink-0 w-[240px] min-w-[240px] h-[200px]">
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
                          'rounded-xl border p-3 h-full flex flex-col cursor-pointer transition-colors outline-none focus-visible:ring-2',
                          ok ? 'border-emerald-200 bg-emerald-50/50 hover:bg-emerald-50/80 focus-visible:ring-emerald-300' : 'border-amber-200 bg-amber-50/50 hover:bg-amber-50/80 focus-visible:ring-amber-300'
                        )}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); (e.currentTarget as HTMLElement).click(); } }}
                      >
                        <div className="flex items-center justify-between gap-2 mb-2 shrink-0">
                          <div className="flex items-center gap-2 min-w-0">
                            <div className={cn('h-9 w-9 rounded-lg flex items-center justify-center shrink-0', ok ? 'bg-emerald-100' : 'bg-amber-100')}>
                              <Zap className={cn('h-4 w-4', ok ? 'text-emerald-600' : 'text-amber-600')} />
                            </div>
                            <h4 className="text-[9px] font-black uppercase text-slate-800 truncate">{getBlockLabel?.('systems') ?? meta.title}</h4>
                          </div>
                          <div onClick={(e) => e.stopPropagation()}>
                            <Popover>
                              <PopoverTrigger asChild>
                                <button type="button" className="p-0.5 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100" aria-label="Описание блока">
                                  <HelpCircle className="h-3.5 w-3.5" />
                                </button>
                              </PopoverTrigger>
                              <PopoverContent align="end" className="w-72 p-3 rounded-xl text-left">
                                <p className="text-[10px] text-slate-600 leading-relaxed">{meta.description}</p>
                              </PopoverContent>
                            </Popover>
                          </div>
                        </div>
                        <div className="flex-1 min-h-0 mb-2">
                          {ok ? (
                            <p className="text-[10px] text-emerald-700 font-medium">В норме</p>
                          ) : (
                            <ul className="space-y-1 text-[10px] text-slate-700">
                              {alerts.integrationIssues.map((issue: string, i: number) => (
                                <li key={i}>{issue}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                        <div className="mt-auto flex justify-start gap-2">
                          <Link href={meta.detailHref} className="text-[9px] font-semibold text-indigo-600 hover:underline inline-flex items-center gap-0.5" onClick={(e) => e.stopPropagation()}>Детально <ArrowRight className="h-3 w-3" /></Link>
                        </div>
                      </div>
                    </PopoverTrigger>
                    <PopoverContent align="start" className="w-[320px] max-h-[80vh] overflow-y-auto p-4 rounded-xl">
                      <h4 className="text-[10px] font-black uppercase text-slate-800 mb-2">{meta.title}</h4>
                      <p className="text-[10px] text-slate-600 leading-relaxed mb-3">{meta.description}</p>
                      {ok ? (
                        <p className="text-[10px] text-emerald-700 font-medium mb-3">В норме</p>
                      ) : (
                        <ul className="space-y-1 text-[10px] text-slate-700 mb-3">
                          {alerts.integrationIssues.map((issue: string, i: number) => (
                            <li key={i}>{issue}</li>
                          ))}
                        </ul>
                      )}
                      <div className="flex justify-start">
                        <Button asChild variant="outline" size="sm" className="text-[9px] font-bold">
                          <Link href={meta.detailHref} className="inline-flex items-center gap-0.5">Детально <ArrowRight className="h-3 w-3" /></Link>
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                );
              })()}
            </div>
            {/* Задачи без исполнителя */}
            {alerts?.tasks?.length > 0 && (() => {
              const meta = ALERT_BLOCK_META.tasks;
              return (
                <div className="shrink-0 w-[240px] min-w-[240px] h-[200px]">
                  <Popover>
                    <PopoverTrigger asChild>
                      <div
                        role="button"
                        tabIndex={0}
                        className="rounded-xl border border-violet-200 bg-violet-50/50 p-3 h-full flex flex-col cursor-pointer hover:bg-violet-50/80 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-violet-300"
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); (e.currentTarget as HTMLElement).click(); } }}
                      >
                        <div className="flex items-center justify-between gap-2 mb-2 shrink-0">
                          <div className="flex items-center gap-2 min-w-0">
                            <div className="h-9 w-9 rounded-lg bg-violet-100 flex items-center justify-center shrink-0">
                              <CheckSquare className="h-4 w-4 text-violet-600" />
                            </div>
                            <h4 className="text-[9px] font-black uppercase text-violet-800 truncate">{getBlockLabel?.('tasks') ?? meta.title}</h4>
                          </div>
                          <div onClick={(e) => e.stopPropagation()}>
                            <Popover>
                              <PopoverTrigger asChild>
                                <button type="button" className="p-0.5 rounded text-slate-400 hover:text-violet-600 hover:bg-violet-100" aria-label="Описание блока">
                                  <HelpCircle className="h-3.5 w-3.5" />
                                </button>
                              </PopoverTrigger>
                              <PopoverContent align="end" className="w-72 p-3 rounded-xl text-left">
                                <p className="text-[10px] text-slate-600 leading-relaxed">{meta.description}</p>
                              </PopoverContent>
                            </Popover>
                          </div>
                        </div>
                        <ul className="space-y-1.5 flex-1 min-h-0 overflow-auto mb-2">
                          {alerts.tasks.map((t: { id: string; title: string; priority: string }) => (
                            <li key={t.id} className="flex items-center justify-between gap-2 text-[10px] text-slate-700">
                              <span className="truncate" title={t.priority}>{t.title}</span>
                              <Link href={meta.detailHref} className="text-[8px] font-semibold text-violet-700 hover:underline shrink-0" onClick={(e) => e.stopPropagation()}>Устранить</Link>
                            </li>
                          ))}
                        </ul>
                        <div className="mt-auto flex justify-start gap-2">
                          <Link href={meta.detailHref} className="text-[9px] font-semibold text-violet-700 hover:underline inline-flex items-center gap-0.5" onClick={(e) => e.stopPropagation()}>Детально <ArrowRight className="h-3 w-3" /></Link>
                        </div>
                      </div>
                    </PopoverTrigger>
                    <PopoverContent align="start" className="w-[320px] max-h-[80vh] overflow-y-auto p-4 rounded-xl">
                      <h4 className="text-[10px] font-black uppercase text-violet-800 mb-2">{meta.title}</h4>
                      <p className="text-[10px] text-slate-600 leading-relaxed mb-3">{meta.description}</p>
                      <ul className="space-y-1.5 mb-3">
                        {alerts.tasks.map((t: { id: string; title: string; priority: string }) => (
                          <li key={t.id} className="flex items-center justify-between gap-2 text-[10px] text-slate-700">
                            <span className="truncate" title={t.priority}>{t.title}</span>
                            <Link href={meta.detailHref} className="text-[8px] font-semibold text-violet-700 hover:underline shrink-0">Устранить</Link>
                          </li>
                        ))}
                      </ul>
                      <div className="flex justify-start">
                        <Button asChild variant="outline" size="sm" className="text-[9px] font-bold">
                          <Link href={meta.detailHref} className="inline-flex items-center gap-0.5">Детально <ArrowRight className="h-3 w-3" /></Link>
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
        </Card>
      </SectionBlock>

      {/* Индекс здоровья + Недавняя активность */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-2 min-w-0 items-stretch">
        <SectionBlock title="Индекс здоровья" meta={SECTION_META.health} accentColor="indigo" className="min-w-0 overflow-hidden flex flex-col" history={globalHistory}>
          <Card className="rounded-xl border border-slate-200 shadow-sm bg-white p-4 md:p-5 flex-1 min-h-0 min-w-0 overflow-hidden relative flex flex-col">
            {healthError ? (
              <div className="flex flex-col items-center justify-center gap-3 py-6 px-4 text-center">
                <p className="text-[10px] font-bold text-slate-600">Не удалось загрузить данные</p>
                <p className="text-[9px] text-slate-500">{healthError.message}</p>
                <Button variant="outline" size="sm" className="text-[9px] font-bold uppercase" onClick={() => refetchHealth()} aria-label="Повторить загрузку данных">
                  Повторить
                </Button>
              </div>
            ) : healthLoading ? (
              <div className="flex flex-col gap-4 animate-pulse">
                <div className="h-12 w-12 rounded-full bg-slate-100 absolute top-4 right-4" />
                <div className="flex flex-col gap-3 mt-8">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <div key={i} className="h-14 rounded-lg bg-slate-50" />
                  ))}
                </div>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-start gap-4">
                  <p className="text-[10px] font-bold uppercase text-slate-400">Проверка {lastCheck}</p>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-slate-400 hover:text-indigo-600" onClick={() => refetchHealth()} aria-label="Обновить индекс здоровья" title="Обновить" disabled={healthLoading}>
                      <RefreshCw className={cn('h-4 w-4', healthLoading ? 'animate-spin' : '')} />
                    </Button>
                    <div className="relative h-12 w-12 flex items-center justify-center">
                      <svg className="absolute inset-0 h-12 w-12 -rotate-90" viewBox="0 0 48 48">
                        <circle cx="24" cy="24" r="20" fill="none" strokeWidth="4" className="stroke-slate-200" />
                        <circle
                          cx="24"
                          cy="24"
                          r="20"
                          fill="none"
                          strokeWidth="4"
                          className="stroke-indigo-600"
                          strokeDasharray={2 * Math.PI * 20}
                          strokeDashoffset={2 * Math.PI * 20 * (1 - (overallHealth ?? 0) / 100)}
                          strokeLinecap="round"
                        />
                      </svg>
                      <span className="relative text-lg font-black text-indigo-600">{overallHealth}%</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-y-3 mt-5">
                  {healthMetrics?.map((m: any, i: number) => {
                    const healthIcons: Record<string, React.ComponentType<{ className?: string }>> = {
                      'Полнота профиля': Building2,
                      'Безопасность': ShieldCheck,
                      'Активность команды': Users,
                      'Интеграции': Zap,
                      'ЭДО и маркировка': ShieldCheck,
                      'Подписка': CreditCard,
                      'Документы': FileText,
                      'Настройки': Settings,
                    };
                    const Icon = healthIcons[m?.label ?? ''] ?? LayoutDashboard;
                    const details = m?.details;
                    const checklist = details?.checklist ?? [];
                    const missing = details?.missing ?? [];
                    const tips = details?.tips;
                    return (
                      <Popover key={i} open={openHealthDetailFor === i} onOpenChange={(open) => setOpenHealthDetailFor(open ? i : null)}>
                        <PopoverTrigger asChild>
                          <button
                            type="button"
                            onClick={() => setOpenHealthDetailFor(openHealthDetailFor === i ? null : i)}
                            className="flex items-start gap-2 p-2 rounded-lg hover:bg-slate-50/80 transition-colors min-w-0 w-full text-left"
                          >
                            <div className={cn('h-9 w-9 rounded-lg flex items-center justify-center shrink-0 text-white', m?.color ?? 'bg-indigo-500')}>
                              <Icon className="h-4 w-4" />
                            </div>
                            <div className="flex-1 min-w-0 flex flex-col gap-1">
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-[10px] font-bold text-slate-700 hover:text-indigo-600 truncate">
                                  {m?.label ?? ''}
                                </span>
                                <span className={cn('text-[10px] font-black tabular-nums shrink-0', m?.status === 'ok' ? 'text-emerald-600' : m?.status === 'warning' ? 'text-amber-600' : 'text-rose-600')}>
                                  {m?.score != null ? `${m.score}%` : '—'}
                                </span>
                              </div>
                              <Progress value={m?.score ?? 0} className="h-1.5 bg-slate-100" indicatorClassName={m?.color ?? 'bg-indigo-500'} />
                              {m?.status !== 'ok' && (m?.details?.tips) && (
                                <p className="text-[8px] text-slate-500 line-clamp-1" title={m.details.tips}>{m.details.tips}</p>
                              )}
                            </div>
                          </button>
                        </PopoverTrigger>
                        <PopoverContent side="bottom" align="start" sideOffset={8} className="w-80 p-4 rounded-xl z-[200]" onClick={(e) => e.stopPropagation()}>
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <div className={cn('h-9 w-9 rounded-lg flex items-center justify-center shrink-0 text-white', m?.color ?? 'bg-indigo-500')}>
                                <Icon className="h-4 w-4" />
                              </div>
                              <div>
                                <h4 className="text-[11px] font-bold text-slate-900">{m?.label ?? ''}</h4>
                                <p className="text-[9px] text-slate-500">{m?.score != null ? `${m.score}%` : '—'} • Проверка {details?.lastCheck ?? ''}</p>
                              </div>
                            </div>
                            {m?.desc && <p className="text-[10px] text-slate-600">{m.desc}</p>}
                            {(checklist.length > 0 || missing.length > 0) && (
                              <div className="space-y-2">
                                {checklist.length > 0 && (
                                  <div>
                                    <p className="text-[9px] font-bold uppercase text-slate-400 mb-1">Заполнено</p>
                                    <ul className="space-y-0.5">
                                      {checklist.map((item: string, j: number) => (
                                        <li key={j} className="text-[10px] text-slate-600 flex items-center gap-1.5">
                                          <span className="text-emerald-500">✓</span> {item}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                                {missing.length > 0 && (
                                  <div>
                                    <p className="text-[9px] font-bold uppercase text-slate-400 mb-1">Ещё не заполнено</p>
                                    <ul className="space-y-0.5">
                                      {missing.map((item: string, j: number) => (
                                        <li key={j} className="text-[10px] text-slate-600 flex items-center gap-1.5">
                                          <span className="text-amber-500">○</span> {item}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            )}
                            {tips && <p className="text-[9px] text-amber-600 bg-amber-50 rounded-lg px-2 py-1.5">{tips}</p>}
                            <Link href={m?.href ?? '#'} className="inline-flex items-center gap-1 text-[10px] font-semibold text-indigo-600 hover:text-indigo-700" onClick={() => setOpenHealthDetailFor(null)}>
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
          </Card>
        </SectionBlock>

        <SectionBlock title="Недавняя активность" meta={SECTION_META.activity} accentColor="slate" className="min-w-0 overflow-hidden flex flex-col" history={globalHistory}>
          <Card className="rounded-xl border border-slate-200 shadow-sm bg-white p-4 md:p-5 flex-1 min-h-0 flex flex-col min-w-0 min-h-[320px]">
            {/* Высота подобрана так, чтобы после отступа (mt-4) первая строка активности была на уровне «Полнота профиля» */}
            <div className="min-h-[3.25rem] flex flex-col justify-end shrink-0">
              <p className="text-[10px] font-bold uppercase text-slate-400 mb-2">Период • {formatActivityPeriod(activityPeriod)}</p>
              <div className="flex items-center gap-1 bg-slate-50 p-0.5 rounded-[4px] border border-slate-200 w-fit mb-0">
                {ACTIVITY_PARTICIPANTS.map((p) => {
                const Icon = p.Icon ?? Users;
                const participantStyle: Record<string, { bg: string; text: string }> = {
                  all: { bg: 'bg-slate-100', text: 'text-slate-500' },
                  anna: { bg: 'bg-indigo-100', text: 'text-indigo-600' },
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
                          'h-7 w-7 rounded-[4px] flex items-center justify-center transition-all',
                          activityParticipant === p.id ? cn('bg-white shadow-sm ring-1 ring-slate-200', style.text) : cn(style.bg, style.text, 'hover:opacity-90')
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
            <div className="shrink-0 mt-4 h-[378px] overflow-y-auto overflow-x-hidden space-y-1.5 pr-1">
              {filteredActivities?.length ? (
                filteredActivities.map((act, i) => {
                  const participant = ACTIVITY_PARTICIPANTS.find((p) => p.id === act.participantId);
                  const ActIcon = participant?.Icon ?? act.icon;
                  const participantStyle: Record<string, { bg: string; text: string }> = {
                    all: { bg: 'bg-slate-100', text: 'text-slate-500' },
                    anna: { bg: 'bg-indigo-100', text: 'text-indigo-600' },
                    igor: { bg: 'bg-emerald-100', text: 'text-emerald-600' },
                    maria: { bg: 'bg-amber-100', text: 'text-amber-600' },
                    petr: { bg: 'bg-rose-100', text: 'text-rose-600' },
                    system: { bg: 'bg-blue-100', text: 'text-blue-600' },
                  };
                  const style = participantStyle[act.participantId] ?? participantStyle.all;
                  const blocked = isBlocked(act);
                  return (
                    <div key={`${act.user}-${act.dateStr}-${i}`} className={cn('flex items-center gap-2 py-1.5 px-2 rounded-lg border transition-colors shrink-0 text-[9px] text-slate-600', blocked ? 'border-rose-100 bg-rose-50/30' : 'border-slate-100 hover:bg-slate-50/50')}>
                      <div className={cn('h-9 w-9 rounded-lg flex items-center justify-center shrink-0', style.bg, style.text)}>
                        <ActIcon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="font-semibold text-slate-900 truncate block">{act.user}</span>
                        <span className="truncate block">{act.action}</span>
                      </div>
                      <span className="text-slate-400 shrink-0 text-[8px] font-bold uppercase">{act.time}</span>
                      <div className="flex items-center gap-0.5 shrink-0 flex-wrap justify-end">
                        {blocked ? (
                          <>
                            <button
                              type="button"
                              onClick={() => setBlockedActivities((prev) => prev.filter((b) => activityKey(b) !== activityKey(act)))}
                              className="inline-flex items-center gap-1 px-2 py-1 rounded text-[9px] font-semibold text-slate-600 hover:bg-slate-100 border border-slate-200"
                              aria-label="Разблокировать"
                            >
                              <LockOpen className="h-3 w-3" />
                              Разблокировать
                            </button>
                            <Link
                              href={`${getCorrectionHref(act)}?returnResolved=${encodeURIComponent(activityKey(act))}`}
                              className="inline-flex items-center gap-1 px-2 py-1 rounded text-[9px] font-semibold text-indigo-600 hover:bg-indigo-50 border border-indigo-200"
                            >
                              <Pencil className="h-3 w-3" />
                              Изменить
                            </Link>
                          </>
                        ) : (
                          <>
                            <Popover open={openCommentFor === i} onOpenChange={(open) => !open && setOpenCommentFor(null)}>
                              <PopoverTrigger asChild>
                                <button
                                  type="button"
                                  onClick={(e) => { e.preventDefault(); setOpenCommentFor(openCommentFor === i ? null : i); }}
                                  className="p-1.5 rounded text-slate-400 hover:text-indigo-600 hover:bg-indigo-50"
                                  aria-label="Написать комментарий"
                                >
                                  <MessageSquare className="h-3.5 w-3.5" />
                                </button>
                              </PopoverTrigger>
                              <PopoverContent align="end" className="w-64 p-3 rounded-xl z-[200]" onClick={(e) => e.stopPropagation()}>
                                <p className="text-[10px] font-bold text-slate-700 mb-2">Комментарий</p>
                                <textarea
                                  value={openCommentFor === i ? commentText : ''}
                                  onChange={(e) => setCommentText(e.target.value)}
                                  placeholder="Введите комментарий..."
                                  className="w-full min-h-[60px] rounded-lg border border-slate-200 px-2 py-1.5 text-[10px] resize-none"
                                  rows={3}
                                />
                                <Button size="sm" className="mt-2 h-7 text-[9px]" onClick={() => setOpenCommentFor(null)}>Отправить</Button>
                              </PopoverContent>
                            </Popover>
                            <Popover open={openBlockFor === i} onOpenChange={(open) => !open && setOpenBlockFor(null)}>
                              <PopoverTrigger asChild>
                                <button
                                  type="button"
                                  onClick={(e) => { e.preventDefault(); setOpenBlockFor(openBlockFor === i ? null : i); }}
                                  className="p-1.5 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                                  aria-label="Заблокировать действие"
                                >
                                  <Lock className="h-3.5 w-3.5" />
                                </button>
                              </PopoverTrigger>
                              <PopoverContent align="end" className="w-56 p-3 rounded-xl z-[200]" onClick={(e) => e.stopPropagation()}>
                                <p className="text-[10px] font-bold text-slate-700 mb-2">Заблокировать действие?</p>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  className="h-7 text-[9px]"
                                  onClick={() => {
                                    setBlockedActivities((prev) => [...prev, act]);
                                    setOpenBlockFor(null);
                                    toast?.({ title: 'Действие заблокировано', description: 'Вы можете разблокировать его или перейти в раздел и внести изменения.' });
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
                <p className="text-[9px] text-slate-400 py-4">Нет активности за выбранный период</p>
              )}
            </div>
            <div className="shrink-0 mt-auto pt-3 border-t border-slate-200 flex justify-center">
              <Button asChild variant="cta" size="ctaSm" className="w-1/2 button-glimmer button-professional">
                <Link href="/brand/team" className="inline-flex items-center justify-center gap-1.5">
                  Все действия
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          </Card>
        </SectionBlock>
      </div>

      {/* Партнёрская экосистема */}
      <SectionBlock title="Партнёрская экосистема" meta={SECTION_META.partners} accentColor="blue" history={globalHistory}>
        {(() => {
          const growthPeriodKey = modulesPeriodKey;
          const growthData = PARTNER_GROWTH_BY_PERIOD[growthPeriodKey];
          const growthDetail = growthData.items;
          return (
            <TooltipProvider delayDuration={200}>
              <Card className="rounded-xl border border-slate-200 bg-white p-4 md:p-5">
                <p className="text-[9px] font-semibold uppercase tracking-wide text-slate-400 mb-2">Партнёры по типам • за {growthPeriodKey === '7d' ? '7 дн.' : '30 дн.'}</p>
                <div className="flex flex-nowrap gap-3 overflow-x-auto pb-1">
                  {PARTNER_COUNTS.map((item) => {
                    const Icon = item.icon;
                    const hasProgress = item.progressValue != null && item.progressMax != null && item.progressMax > 0;
                    const progressPct = hasProgress ? Math.round((item.progressValue! / item.progressMax!) * 100) : 0;
                    const periodGrowth = growthDetail.find((d) => d.label === item.label);
                    const trendStr = periodGrowth?.value ?? item.trend ?? '';
                    const trendNum = trendStr ? parseInt(trendStr.replace(/\D/g, ''), 10) : 0;
                    const currentNum = item.value.includes('/') ? parseInt(item.value.split('/')[0], 10) : parseInt(item.value, 10);
                    const previousNum = Number.isNaN(currentNum) ? 0 : Math.max(0, currentNum - (trendStr.startsWith('-') ? -trendNum : trendNum));
                    const changePct = trendNum && previousNum > 0 ? Math.round((trendNum / previousNum) * 100) : null;
                    const trendUp = trendStr ? !trendStr.startsWith('-') : false;
                    return (
                      <div
                        key={item.id}
                        className={cn(
                          'shrink-0 w-[200px] min-h-[280px] rounded-xl border p-3 flex flex-col transition-colors relative',
                          (item.alertCount ?? 0) > 0 ? 'border-rose-200 bg-rose-50/50' : 'border-slate-200 bg-white hover:border-slate-300'
                        )}
                      >
                        {changePct != null && (
                          <p className={cn('absolute top-2 right-2 text-[9px] font-bold tabular-nums', trendUp ? 'text-emerald-600' : 'text-rose-600')}>
                            {trendUp ? '+' : ''}{changePct}%
                          </p>
                        )}
                        <div className="flex items-start justify-between gap-2">
                          <div className={cn('h-9 w-9 rounded-lg flex items-center justify-center shrink-0 text-white', item.color)}>
                            <Icon className="h-4 w-4" />
                          </div>
                        </div>
                        <div className="mt-2 flex items-start gap-1">
                          <Link href={item.href} className="block group/link flex-1 min-w-0" title={item.description}>
                            <p className="text-lg font-bold tabular-nums text-slate-900 group-hover/link:text-indigo-600">{item.value}</p>
                            <p className="text-[9px] font-semibold uppercase text-slate-600">{item.label}</p>
                          </Link>
                          <div className="flex items-center gap-1 shrink-0">
                            {(item.alertCount ?? 0) > 0 && (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white cursor-help">
                                    {item.alertCount! > 99 ? '99+' : item.alertCount}
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent side="top" className="max-w-[220px] text-xs">
                                  {item.statusShort || item.statusShort2 || `Требуют внимания: ${item.alertCount}`}
                                </TooltipContent>
                              </Tooltip>
                            )}
                            {(item.description || (item.tips && item.tips.length > 0)) && (
                              <Popover modal={false}>
                                <PopoverTrigger asChild>
                                  <button type="button" className="p-0.5 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100 shrink-0" aria-label="Подсказка">
                                    <HelpCircle className="h-3.5 w-3.5" />
                                  </button>
                                </PopoverTrigger>
                                <PopoverContent align="end" side="bottom" className="w-64 p-3 rounded-xl text-left z-[200]" onOpenAutoFocus={(e) => e.preventDefault()}>
                                  {item.description && <p className="text-[10px] text-slate-600 leading-relaxed mb-2">{item.description}</p>}
                                  {item.tips && item.tips.length > 0 && (
                                    <ul className="text-[9px] text-slate-500 space-y-0.5 list-disc list-inside">
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
                          <p className="text-[8px] text-slate-400 mt-0.5">{PARTNER_ROLE_LABELS[item.roleInChain]}</p>
                        )}
                        {item.subline && (
                          <p className="text-[9px] text-slate-500 mt-1 line-clamp-1">{item.subline}</p>
                        )}
                        {item.businessProcesses && item.businessProcesses.length > 0 && (
                          <div className="mt-1 flex flex-wrap gap-x-2 gap-y-0.5">
                            {item.businessProcesses.map((bp) => (
                              <Link key={bp.href} href={bp.href} onClick={(e) => e.stopPropagation()} className="text-[8px] text-indigo-600 hover:underline">
                                {bp.label}
                              </Link>
                            ))}
                          </div>
                        )}
                        {item.statusShort2 && (
                          item.statusHref2 ? (
                            <Link href={item.statusHref2} className="mt-1 text-[9px] font-medium text-indigo-600 hover:underline line-clamp-1">
                              {item.statusShort2} →
                            </Link>
                          ) : (
                            <p className="mt-1 text-[9px] text-slate-500 line-clamp-1">{item.statusShort2}</p>
                          )
                        )}
                        {item.statusShort && (
                          item.statusHref ? (
                            <Link href={item.statusHref} className={cn('text-[9px] font-medium text-indigo-600 hover:underline line-clamp-1', item.statusShort2 ? 'mt-0.5' : 'mt-1')}>
                              {item.statusShort} →
                            </Link>
                          ) : (
                            <p className={cn('text-[9px] text-slate-500 line-clamp-1', item.statusShort2 ? 'mt-0.5' : 'mt-1')}>{item.statusShort}</p>
                          )
                        )}
                        {item.detailMetrics && item.detailMetrics.length > 0 && (
                          <div className="mt-2 space-y-0.5">
                            {item.detailMetrics.slice(0, 3).map((m) =>
                              m.href ? (
                                <Link key={m.label} href={m.href} onClick={(e) => e.stopPropagation()} className="flex justify-between text-[9px] text-slate-600 hover:text-indigo-600">
                                  <span className="truncate">{m.label}</span>
                                  <span className="font-semibold tabular-nums shrink-0 ml-1">{m.value} →</span>
                                </Link>
                              ) : (
                                <div key={m.label} className="flex justify-between text-[9px] text-slate-600">
                                  <span className="truncate">{m.label}</span>
                                  <span className="font-semibold tabular-nums shrink-0 ml-1">{m.value}</span>
                                </div>
                              )
                            )}
                          </div>
                        )}
                        {hasProgress && (
                          <div className="mt-2">
                            <Progress value={progressPct} className="h-1.5 bg-slate-100" indicatorClassName="bg-amber-500" />
                            <p className="text-[8px] text-slate-400 mt-0.5">активно {item.progressValue}/{item.progressMax}</p>
                          </div>
                        )}
                        <div className="mt-auto pt-3 flex items-center justify-between gap-2 border-t border-slate-100">
                          <Link href={item.href} className="text-[9px] font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-0.5">
                            Открыть раздел
                            <ArrowRight className="h-3 w-3" />
                          </Link>
                          <Link href={item.addHref} onClick={(e) => e.stopPropagation()} className="text-[9px] font-medium text-slate-500 hover:text-indigo-600 flex items-center gap-0.5">
                            <Plus className="h-3 w-3" />
                            {item.addLabel}
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <p className="text-[9px] font-semibold uppercase tracking-wide text-slate-400 mt-6 mb-2">Связь с процессами • за {growthPeriodKey === '7d' ? '7 дн.' : '30 дн.'}</p>
                <div className="flex flex-nowrap gap-3 overflow-x-auto pb-1">
                  {PARTNER_BUSINESS_PROCESSES.map((p) => {
                    const Icon = p.icon;
                    const count = growthPeriodKey === '7d' ? p.count7d : p.count30d;
                    const changePct = growthPeriodKey === '7d' ? p.changePct7d : p.changePct30d;
                    return (
                      <div key={p.id} className="shrink-0 w-[200px] min-h-[280px] rounded-xl border border-slate-200 bg-white p-3 flex flex-col transition-colors hover:border-slate-300 relative">
                        {changePct != null && (
                          <p className={cn('absolute top-2 right-2 text-[9px] font-bold tabular-nums', changePct >= 0 ? 'text-emerald-600' : 'text-rose-600')}>
                            {changePct >= 0 ? '+' : ''}{changePct}%
                          </p>
                        )}
                        <div className="flex items-start justify-between gap-2">
                          <div className={cn('h-9 w-9 rounded-lg flex items-center justify-center shrink-0 text-white', p.color)}>
                            <Icon className="h-4 w-4" />
                          </div>
                        </div>
                        <div className="mt-2 flex items-start gap-1">
                          <Link href={p.href} className="block group/link flex-1 min-w-0" title={p.description}>
                            <p className="text-lg font-bold tabular-nums text-slate-900 group-hover/link:text-indigo-600">{count}</p>
                            <p className="text-[9px] font-semibold uppercase text-slate-600">{p.label}</p>
                          </Link>
                          {(p.description || (p.tips && p.tips.length > 0)) && (
                            <Popover modal={false}>
                              <PopoverTrigger asChild>
                                <button type="button" className="p-0.5 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100 shrink-0" aria-label="Подсказка">
                                  <HelpCircle className="h-3.5 w-3.5" />
                                </button>
                              </PopoverTrigger>
                              <PopoverContent align="end" side="bottom" className="w-64 p-3 rounded-xl text-left z-[200]">
                                {p.description && <p className="text-[10px] text-slate-600 leading-relaxed mb-2">{p.description}</p>}
                                {p.tips && p.tips.length > 0 && (
                                  <ul className="text-[9px] text-slate-500 space-y-0.5 list-disc list-inside">
                                    {p.tips.map((t, i) => (
                                      <li key={i}>{t}</li>
                                    ))}
                                  </ul>
                                )}
                              </PopoverContent>
                            </Popover>
                          )}
                        </div>
                        <p className="text-[9px] text-slate-500 mt-1 line-clamp-1">{p.sub}</p>
                        {p.detailMetrics && p.detailMetrics.length > 0 && (
                          <div className="mt-2 space-y-0.5">
                            {p.detailMetrics.slice(0, 3).map((m) =>
                              m.href ? (
                                <Link key={m.label} href={m.href} onClick={(e) => e.stopPropagation()} className="flex justify-between text-[9px] text-slate-600 hover:text-indigo-600">
                                  <span className="truncate">{m.label}</span>
                                  <span className="font-semibold tabular-nums shrink-0 ml-1">{m.value} →</span>
                                </Link>
                              ) : (
                                <div key={m.label} className="flex justify-between text-[9px] text-slate-600">
                                  <span className="truncate">{m.label}</span>
                                  <span className="font-semibold tabular-nums shrink-0 ml-1">{m.value}</span>
                                </div>
                              )
                            )}
                          </div>
                        )}
                        <div className="mt-auto pt-3 flex items-center justify-between gap-2 border-t border-slate-100">
                          <Link href={p.href} className="text-[9px] font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-0.5">
                            Открыть раздел
                            <ArrowRight className="h-3 w-3" />
                          </Link>
                          {p.addHref && p.addLabel && (
                            <Link href={p.addHref} onClick={(e) => e.stopPropagation()} className="text-[9px] font-medium text-slate-500 hover:text-indigo-600 flex items-center gap-0.5">
                              <Plus className="h-3 w-3" />
                              {p.addLabel}
                            </Link>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <p className="text-[9px] font-semibold uppercase tracking-wide text-slate-400 mt-6 mb-2">Процессы и области • за {growthPeriodKey === '7d' ? '7 дн.' : '30 дн.'}</p>
                <div className="flex flex-nowrap gap-3 overflow-x-auto pb-1">
                  {PARTNER_ECOSYSTEM_BLOCKS.map((b) => {
                    const BlockIcon = b.icon;
                    const blockMetrics = growthPeriodKey === '7d' ? (b.metrics7d ?? b.metrics) : (b.metrics30d ?? b.metrics);
                    const blockAlertCount = growthPeriodKey === '7d' ? (b.alertCount7d ?? b.alertCount ?? 0) : (b.alertCount30d ?? b.alertCount ?? 0);
                    const changePct = growthPeriodKey === '7d' ? b.changePct7d : b.changePct30d;
                    return (
                      <div
                        key={b.id}
                        role="article"
                        aria-label={b.titleLines ? b.titleLines.join(' ') : b.title}
                        className={cn(
                          'shrink-0 w-[200px] min-h-[280px] rounded-xl border p-3 flex flex-col text-left transition-colors relative',
                          blockAlertCount > 0 ? 'border-rose-200 bg-rose-50/30 hover:bg-rose-50/50' : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                        )}
                      >
                        {changePct != null && (
                          <p className={cn('absolute top-2 right-2 text-[9px] font-bold tabular-nums', changePct >= 0 ? 'text-emerald-600' : 'text-rose-600')}>
                            {changePct >= 0 ? '+' : ''}{changePct}%
                          </p>
                        )}
                        <div className="flex items-start justify-between gap-2">
                          <div className={cn('h-9 w-9 rounded-lg flex items-center justify-center shrink-0 text-white', b.color)}>
                            <BlockIcon className="h-4 w-4" />
                          </div>
                        </div>
                        <div className="mt-2 flex items-start justify-between gap-2 mb-1.5">
                          <Link href={b.href} className="text-[11px] font-bold uppercase tracking-tight text-slate-900 hover:text-indigo-600 flex-1 min-w-0 leading-tight">
                            {b.titleLines ? (
                              <>
                                <span>{b.titleLines[0]}</span>
                                <span className="block">{b.titleLines[1]}</span>
                              </>
                            ) : (
                              b.title
                            )}
                          </Link>
                          <div className="flex items-center gap-1 shrink-0">
                            {blockAlertCount > 0 && (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white cursor-help">
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
                                <button type="button" className="p-0.5 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100 shrink-0" aria-label="Описание">
                                  <HelpCircle className="h-3.5 w-3.5" />
                                </button>
                              </PopoverTrigger>
                              <PopoverContent align="end" side="bottom" className="w-64 p-3 rounded-xl text-left z-[200]">
                                <p className="text-[10px] text-slate-600 leading-relaxed">{b.description}</p>
                              </PopoverContent>
                            </Popover>
                          </div>
                        </div>
                        <ul className="space-y-0.5 mt-1">
                          {blockMetrics.slice(0, 3).map((m) => (
                            <li key={m.label}>
                              {m.href ? (
                                <Link href={m.href} className="flex justify-between text-[9px] text-slate-600 hover:text-indigo-600">
                                  <span className="truncate">{m.label}</span>
                                  <span className="font-semibold tabular-nums shrink-0 ml-1">{m.value} →</span>
                                </Link>
                              ) : (
                                <div className="flex justify-between text-[9px] text-slate-600">
                                  <span className="truncate">{m.label}</span>
                                  <span className="font-semibold tabular-nums shrink-0 ml-1">{m.value}</span>
                                </div>
                              )}
                            </li>
                          ))}
                        </ul>
                        <div className="mt-auto pt-3 flex items-center justify-between gap-2 border-t border-slate-100">
                          <Link href={b.href} className="text-[9px] font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-0.5">
                            Открыть раздел
                            <ArrowRight className="h-3 w-3" />
                          </Link>
                          {b.addHref && b.addLabel && (
                            <Link href={b.addHref} onClick={(e) => e.stopPropagation()} className="text-[9px] font-medium text-slate-500 hover:text-indigo-600 flex items-center gap-0.5">
                              <Plus className="h-3 w-3" />
                              {b.addLabel}
                            </Link>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </TooltipProvider>
          );
        })()}
      </SectionBlock>

      {/* Разделы организации */}
      <div id="sections-modules" className="scroll-mt-4">
        <SectionBlock title="Разделы организации" meta={SECTION_META.modules} accentColor="emerald" history={globalHistory}>
          <Card className="rounded-xl border border-slate-200 bg-white p-4 md:p-5">
            <p className="text-[9px] font-semibold uppercase tracking-wide text-slate-400 mb-2">
              {modulesPeriodKey === '7d' ? 'За 7 дн.' : 'За 30 дн.'}
            </p>
            <div className="flex flex-nowrap gap-3 overflow-x-auto pb-1">
              {NAVIGATION_CARDS.map((card) => {
                const changePct = modulesPeriodKey === '7d' ? (card as any).changePct7d : (card as any).changePct30d;
                const addHref = (card as any).addHref;
                const addLabel = (card as any).addLabel;
                const CardIcon = card.icon;
                return (
                  <div
                    key={card.href}
                    role="link"
                    tabIndex={0}
                    onClick={() => router.push(card.href)}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); router.push(card.href); } }}
                    aria-label={`Перейти в раздел: ${card.title}`}
                    className={cn(
                      'shrink-0 w-[200px] min-h-[280px] rounded-xl border p-3 flex flex-col text-left transition-colors relative cursor-pointer',
                      card.stats.status === 'warning' ? 'border-rose-200 bg-rose-50/30 hover:bg-rose-50/50' : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                    )}
                  >
                    {changePct != null && (
                      <p className={cn('absolute top-2 right-2 text-[9px] font-bold tabular-nums', changePct >= 0 ? 'text-emerald-600' : 'text-rose-600')}>
                        {changePct >= 0 ? '+' : ''}{changePct}%
                      </p>
                    )}
                    <div className="flex items-start justify-between gap-2">
                      <div className={cn('h-9 w-9 rounded-lg flex items-center justify-center shrink-0 text-white', card.bg.replace('-50', '-500'))}>
                        <CardIcon className="h-4 w-4" />
                      </div>
                    </div>
                    <div className="mt-2 flex items-start justify-between gap-2">
                      <h3 className="text-[11px] font-bold uppercase tracking-tight text-slate-900 flex-1 min-w-0 leading-tight">
                        {card.title}
                      </h3>
                      <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                        {card.stats.status === 'warning' && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white cursor-help">
                                {/^\d+$/.test(String(card.stats.value)) ? card.stats.value : '!'}
                              </span>
                            </TooltipTrigger>
                            <TooltipContent side="top" className="max-w-[220px] text-xs">
                              Требует внимания: {card.stats.label} {card.stats.value}. Откройте раздел для устранения.
                            </TooltipContent>
                          </Tooltip>
                        )}
                        <Popover modal={false}>
                          <PopoverTrigger asChild>
                            <button type="button" className="p-0.5 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100" aria-label="Описание раздела">
                              <HelpCircle className="h-3.5 w-3.5" />
                            </button>
                          </PopoverTrigger>
                          <PopoverContent align="end" side="bottom" className="w-64 p-3 rounded-xl text-left z-[200]">
                            <p className="text-[10px] text-slate-600 leading-relaxed">{card.description}</p>
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                    <div className="mt-2 space-y-0.5">
                      <div className="flex justify-between text-[9px] text-slate-600">
                        <span className="truncate">{card.stats.label}</span>
                        <span className={cn('font-semibold tabular-nums shrink-0 ml-1', card.stats.status === 'success' ? 'text-emerald-600' : card.stats.status === 'warning' ? 'text-amber-600' : 'text-slate-900')}>
                          {card.title === 'Команда' ? participantsCount : card.stats.value}
                        </span>
                      </div>
                    </div>
                    <div className="mt-auto pt-3 flex items-center justify-between gap-2 border-t border-slate-100">
                      <button
                        type="button"
                        className="text-[9px] font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-0.5 text-left"
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
                          className="text-[9px] font-medium text-slate-500 hover:text-indigo-600 flex items-center gap-0.5 text-left"
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
          </Card>
        </SectionBlock>
      </div>
    </>
  );
}
