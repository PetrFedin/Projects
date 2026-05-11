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
  CheckSquare,
  UserCircle,
} from 'lucide-react';
import Link from 'next/link';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/lib/routes';
import { SectionBlock } from '@/components/brand/SectionBlock';
import {
  SECTION_META,
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
import type { ActivityPeriod } from './_components/organization-overview-lib';
import type { RoleReport } from './_components/organization-overview-lib';
import { ROLE_REPORTS } from './_components/organization-overview-lib';
import { OrganizationHubHeader } from './_components/organization-hub-header';
import { OrganizationAttentionAlertsSection } from './_components/organization-attention-alerts-section';

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
      <OrganizationHubHeader
        healthLoading={healthLoading}
        orgProfile={orgProfile}
        participantsCount={participantsCount}
        onlineCount={onlineCount}
        activityPeriod={activityPeriod}
        setActivityPeriod={setActivityPeriod}
        customRange={customRange}
        setCustomRange={setCustomRange}
      />

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
          <div className={cn(registryFeedLayout.panelCardSoft, 'p-4')}>
            <p className="text-text-secondary mb-3 text-[10px]">
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
                  className="border-border-default hover:border-accent-primary/30 hover:bg-accent-primary/10 h-8 gap-1.5 px-3 text-[9px] font-bold uppercase"
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

      <OrganizationAttentionAlertsSection
        globalHistory={globalHistory}
        healthLoading={healthLoading}
        alerts={alerts}
        getBlockLabel={getBlockLabel}
      />


      {/* Индекс здоровья + Недавняя активность */}
      <div className="mb-2 grid min-w-0 grid-cols-1 items-stretch gap-4 lg:grid-cols-2">
        <SectionBlock
          title="Индекс здоровья"
          meta={SECTION_META.health}
          accentColor="indigo"
          className="flex min-w-0 flex-col overflow-hidden"
          history={globalHistory}
        >
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
                <div className="bg-bg-surface2 absolute right-4 top-4 h-12 w-12 rounded-full" />
                <div className="mt-8 flex flex-col gap-3">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <div key={i} className="bg-bg-surface2 h-14 rounded-lg" />
                  ))}
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between gap-4">
                  <p className="text-text-muted text-[10px] font-bold uppercase">
                    Проверка {lastCheck}
                  </p>
                  <div className="flex shrink-0 items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-text-muted hover:text-accent-primary h-8 w-8 rounded-lg"
                      onClick={() => refetchHealth()}
                      aria-label="Обновить индекс здоровья"
                      title="Обновить"
                      disabled={healthLoading}
                    >
                      <RefreshCw className={cn('h-4 w-4', healthLoading ? 'animate-spin' : '')} />
                    </Button>
                    <div className="relative flex h-12 w-12 items-center justify-center">
                      <svg className="absolute inset-0 h-12 w-12 -rotate-90" viewBox="0 0 48 48">
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
                      <span className="text-accent-primary relative text-lg font-black">
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
                            className="hover:bg-bg-surface2/80 flex w-full min-w-0 items-start gap-2 rounded-lg p-2 text-left transition-colors"
                          >
                            <div
                              className={cn(
                                'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white',
                                m?.color ?? 'bg-accent-primary'
                              )}
                            >
                              <Icon className="h-4 w-4" />
                            </div>
                            <div className="flex min-w-0 flex-1 flex-col gap-1">
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-text-primary hover:text-accent-primary truncate text-[10px] font-bold">
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
                                className="bg-bg-surface2 h-1.5"
                                indicatorClassName={m?.color ?? 'bg-accent-primary'}
                              />
                              {m?.status !== 'ok' && m?.details?.tips && (
                                <p
                                  className="text-text-secondary line-clamp-1 text-[8px]"
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
                                  m?.color ?? 'bg-accent-primary'
                                )}
                              >
                                <Icon className="h-4 w-4" />
                              </div>
                              <div>
                                <h4 className="text-text-primary text-[11px] font-bold">
                                  {m?.label ?? ''}
                                </h4>
                                <p className="text-text-secondary text-[9px]">
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
                                    <p className="text-text-muted mb-1 text-[9px] font-bold uppercase">
                                      Заполнено
                                    </p>
                                    <ul className="space-y-0.5">
                                      {checklist.map((item: string, j: number) => (
                                        <li
                                          key={j}
                                          className="text-text-secondary flex items-center gap-1.5 text-[10px]"
                                        >
                                          <span className="text-emerald-500">✓</span> {item}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                                {missing.length > 0 && (
                                  <div>
                                    <p className="text-text-muted mb-1 text-[9px] font-bold uppercase">
                                      Ещё не заполнено
                                    </p>
                                    <ul className="space-y-0.5">
                                      {missing.map((item: string, j: number) => (
                                        <li
                                          key={j}
                                          className="text-text-secondary flex items-center gap-1.5 text-[10px]"
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
                              className="text-accent-primary hover:text-accent-primary inline-flex items-center gap-1 text-[10px] font-semibold"
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
                              ? cn('ring-border-default bg-white shadow-sm ring-1', style.text)
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
                        'text-text-secondary flex shrink-0 items-center gap-2 rounded-lg border px-2 py-1.5 text-[9px] transition-colors',
                        blocked
                          ? 'border-rose-100 bg-rose-50/30'
                          : 'border-border-subtle hover:bg-bg-surface2/80'
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
                        <span className="text-text-primary block truncate font-semibold">
                          {act.user}
                        </span>
                        <span className="block truncate">{act.action}</span>
                      </div>
                      <span className="text-text-muted shrink-0 text-[8px] font-bold uppercase">
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
                              className="text-text-secondary hover:bg-bg-surface2 border-border-default inline-flex items-center gap-1 rounded border px-2 py-1 text-[9px] font-semibold"
                              aria-label="Разблокировать"
                            >
                              <LockOpen className="h-3 w-3" />
                              Разблокировать
                            </button>
                            <Link
                              href={`${getCorrectionHref(act)}?returnResolved=${encodeURIComponent(activityKey(act))}`}
                              className="text-accent-primary hover:bg-accent-primary/10 border-accent-primary/30 inline-flex items-center gap-1 rounded border px-2 py-1 text-[9px] font-semibold"
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
                                  className="text-text-muted hover:text-accent-primary hover:bg-accent-primary/10 rounded p-1.5"
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
                                <p className="text-text-primary mb-2 text-[10px] font-bold">
                                  Комментарий
                                </p>
                                <textarea
                                  value={openCommentFor === i ? commentText : ''}
                                  onChange={(e) => setCommentText(e.target.value)}
                                  placeholder="Введите комментарий..."
                                  className="border-border-default min-h-[60px] w-full resize-none rounded-lg border px-2 py-1.5 text-[10px]"
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
                                  className="text-text-muted rounded p-1.5 hover:bg-rose-50 hover:text-rose-600"
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
                                <p className="text-text-primary mb-2 text-[10px] font-bold">
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
                <p className="text-text-muted py-4 text-[9px]">
                  Нет активности за выбранный период
                </p>
              )}
            </div>
            <div className="border-border-default mt-auto flex shrink-0 justify-center border-t pt-3">
              <Button
                asChild
                variant="cta"
                size="ctaSm"
                className="button-glimmer button-professional w-1/2"
              >
                <Link
                  href={ROUTES.brand.team}
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
              <div className={cn(registryFeedLayout.panelCardSoft, 'p-4 md:p-5')}>
                <p className="text-text-muted mb-2 text-[9px] font-semibold uppercase tracking-wide">
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
                    const periodGrowth = growthDetail.find(
                      (d: { label: string; value: string; href: string }) => d.label === item.label
                    );
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
                            : 'border-border-default hover:border-border-default bg-white'
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
                            <p className="text-text-primary group-hover/link:text-accent-primary text-lg font-bold tabular-nums">
                              {item.value}
                            </p>
                            <p className="text-text-secondary text-[9px] font-semibold uppercase">
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
                                    className="text-text-muted hover:text-text-secondary hover:bg-bg-surface2 shrink-0 rounded p-0.5"
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
                                    <p className="text-text-secondary mb-2 text-[10px] leading-relaxed">
                                      {item.description}
                                    </p>
                                  )}
                                  {item.tips && item.tips.length > 0 && (
                                    <ul className="text-text-secondary list-inside list-disc space-y-0.5 text-[9px]">
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
                          <p className="text-text-muted mt-0.5 text-[8px]">
                            {PARTNER_ROLE_LABELS[item.roleInChain]}
                          </p>
                        )}
                        {item.subline && (
                          <p className="text-text-secondary mt-1 line-clamp-1 text-[9px]">
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
                                className="text-accent-primary text-[8px] hover:underline"
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
                              className="text-accent-primary mt-1 line-clamp-1 text-[9px] font-medium hover:underline"
                            >
                              {item.statusShort2} →
                            </Link>
                          ) : (
                            <p className="text-text-secondary mt-1 line-clamp-1 text-[9px]">
                              {item.statusShort2}
                            </p>
                          ))}
                        {item.statusShort &&
                          (item.statusHref ? (
                            <Link
                              href={item.statusHref}
                              className={cn(
                                'text-accent-primary line-clamp-1 text-[9px] font-medium hover:underline',
                                item.statusShort2 ? 'mt-0.5' : 'mt-1'
                              )}
                            >
                              {item.statusShort} →
                            </Link>
                          ) : (
                            <p
                              className={cn(
                                'text-text-secondary line-clamp-1 text-[9px]',
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
                                  className="text-text-secondary hover:text-accent-primary flex justify-between text-[9px]"
                                >
                                  <span className="truncate">{m.label}</span>
                                  <span className="ml-1 shrink-0 font-semibold tabular-nums">
                                    {m.value} →
                                  </span>
                                </Link>
                              ) : (
                                <div
                                  key={m.label}
                                  className="text-text-secondary flex justify-between text-[9px]"
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
                              className="bg-bg-surface2 h-1.5"
                              indicatorClassName="bg-amber-500"
                            />
                            <p className="text-text-muted mt-0.5 text-[8px]">
                              активно {item.progressValue}/{item.progressMax}
                            </p>
                          </div>
                        )}
                        <div className="border-border-subtle mt-auto flex items-center justify-between gap-2 border-t pt-3">
                          <Link
                            href={item.href}
                            className="text-accent-primary hover:text-accent-primary flex items-center gap-0.5 text-[9px] font-semibold"
                          >
                            Открыть раздел
                            <ArrowRight className="h-3 w-3" />
                          </Link>
                          <Link
                            href={item.addHref}
                            onClick={(e) => e.stopPropagation()}
                            className="text-text-secondary hover:text-accent-primary flex items-center gap-0.5 text-[9px] font-medium"
                          >
                            <Plus className="h-3 w-3" />
                            {item.addLabel}
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <p className="text-text-muted mb-2 mt-6 text-[9px] font-semibold uppercase tracking-wide">
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
                        className="border-border-default hover:border-border-default relative flex min-h-[280px] w-[200px] shrink-0 flex-col rounded-xl border bg-white p-3 transition-colors"
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
                            <p className="text-text-primary group-hover/link:text-accent-primary text-lg font-bold tabular-nums">
                              {count}
                            </p>
                            <p className="text-text-secondary text-[9px] font-semibold uppercase">
                              {p.label}
                            </p>
                          </Link>
                          {(p.description || (p.tips && p.tips.length > 0)) && (
                            <Popover modal={false}>
                              <PopoverTrigger asChild>
                                <button
                                  type="button"
                                  className="text-text-muted hover:text-text-secondary hover:bg-bg-surface2 shrink-0 rounded p-0.5"
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
                                  <p className="text-text-secondary mb-2 text-[10px] leading-relaxed">
                                    {p.description}
                                  </p>
                                )}
                                {p.tips && p.tips.length > 0 && (
                                  <ul className="text-text-secondary list-inside list-disc space-y-0.5 text-[9px]">
                                    {p.tips.map((t, i) => (
                                      <li key={i}>{t}</li>
                                    ))}
                                  </ul>
                                )}
                              </PopoverContent>
                            </Popover>
                          )}
                        </div>
                        <p className="text-text-secondary mt-1 line-clamp-1 text-[9px]">{p.sub}</p>
                        {p.detailMetrics && p.detailMetrics.length > 0 && (
                          <div className="mt-2 space-y-0.5">
                            {p.detailMetrics.slice(0, 3).map((m) =>
                              m.href ? (
                                <Link
                                  key={m.label}
                                  href={m.href}
                                  onClick={(e) => e.stopPropagation()}
                                  className="text-text-secondary hover:text-accent-primary flex justify-between text-[9px]"
                                >
                                  <span className="truncate">{m.label}</span>
                                  <span className="ml-1 shrink-0 font-semibold tabular-nums">
                                    {m.value} →
                                  </span>
                                </Link>
                              ) : (
                                <div
                                  key={m.label}
                                  className="text-text-secondary flex justify-between text-[9px]"
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
                        <div className="border-border-subtle mt-auto flex items-center justify-between gap-2 border-t pt-3">
                          <Link
                            href={p.href}
                            className="text-accent-primary hover:text-accent-primary flex items-center gap-0.5 text-[9px] font-semibold"
                          >
                            Открыть раздел
                            <ArrowRight className="h-3 w-3" />
                          </Link>
                          {p.addHref && p.addLabel && (
                            <Link
                              href={p.addHref}
                              onClick={(e) => e.stopPropagation()}
                              className="text-text-secondary hover:text-accent-primary flex items-center gap-0.5 text-[9px] font-medium"
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

                <p className="text-text-muted mb-2 mt-6 text-[9px] font-semibold uppercase tracking-wide">
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
                            : 'border-border-default hover:border-border-default hover:bg-bg-surface2/80 bg-white'
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
                            className="text-text-primary hover:text-accent-primary min-w-0 flex-1 text-[11px] font-bold uppercase leading-tight tracking-tight"
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
                                  className="text-text-muted hover:text-text-secondary hover:bg-bg-surface2 shrink-0 rounded p-0.5"
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
                                <p className="text-text-secondary text-[10px] leading-relaxed">
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
                                  className="text-text-secondary hover:text-accent-primary flex justify-between text-[9px]"
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
                        <div className="border-border-subtle mt-auto flex items-center justify-between gap-2 border-t pt-3">
                          <Link
                            href={b.href}
                            className="text-accent-primary hover:text-accent-primary flex items-center gap-0.5 text-[9px] font-semibold"
                          >
                            Открыть раздел
                            <ArrowRight className="h-3 w-3" />
                          </Link>
                          {b.addHref && b.addLabel && (
                            <Link
                              href={b.addHref}
                              onClick={(e) => e.stopPropagation()}
                              className="text-text-secondary hover:text-accent-primary flex items-center gap-0.5 text-[9px] font-medium"
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
          <div className={cn(registryFeedLayout.panelCardSoft, 'p-4 md:p-5')}>
            <p className="text-text-muted mb-2 text-[9px] font-semibold uppercase tracking-wide">
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
                        : 'border-border-default hover:border-border-default hover:bg-bg-surface2/80 bg-white'
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
                      <h3 className="text-text-primary min-w-0 flex-1 text-[11px] font-bold uppercase leading-tight tracking-tight">
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
                              className="text-text-muted hover:text-text-secondary hover:bg-bg-surface2 rounded p-0.5"
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
                            <p className="text-text-secondary text-[10px] leading-relaxed">
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
                                : 'text-text-primary'
                          )}
                        >
                          {card.title === 'Команда' ? participantsCount : card.stats.value}
                        </span>
                      </div>
                    </div>
                    <div className="border-border-subtle mt-auto flex items-center justify-between gap-2 border-t pt-3">
                      <button
                        type="button"
                        className="text-accent-primary hover:text-accent-primary flex items-center gap-0.5 text-left text-[9px] font-semibold"
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
                          className="text-text-secondary hover:text-accent-primary flex items-center gap-0.5 text-left text-[9px] font-medium"
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
