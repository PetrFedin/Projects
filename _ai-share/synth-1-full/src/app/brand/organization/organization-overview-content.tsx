'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/auth-provider';
import { useUIState } from '@/providers/ui-state';
import { CeoReportSheet, REPORT_DATA } from '@/components/brand/ceo-report-sheet';
import { registryFeedLayout } from '@/lib/ui/registry-feed-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, HelpCircle, Plus, UserCircle } from 'lucide-react';
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
} from './page-data';
import type { RecentActivity } from './page-data';
import type { HistoryEntry } from '@/components/brand/SectionBlock';
import type { ActivityPeriod } from './_components/organization-overview-lib';
import type { RoleReport } from './_components/organization-overview-lib';
import { ROLE_REPORTS } from './_components/organization-overview-lib';
import { OrganizationHubHeader } from './_components/organization-hub-header';
import { OrganizationAttentionAlertsSection } from './_components/organization-attention-alerts-section';
import { OrganizationHealthActivityGrid } from './_components/organization-health-activity-grid';

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

      <OrganizationHealthActivityGrid
        globalHistory={globalHistory}
        healthError={healthError}
        healthLoading={healthLoading}
        lastCheck={lastCheck}
        overallHealth={overallHealth}
        healthMetrics={healthMetrics}
        refetchHealth={refetchHealth}
        openHealthDetailFor={openHealthDetailFor}
        setOpenHealthDetailFor={setOpenHealthDetailFor}
        activityParticipant={activityParticipant}
        setActivityParticipant={setActivityParticipant}
        filteredActivities={filteredActivities}
        isBlocked={isBlocked}
        activityKey={activityKey}
        getCorrectionHref={getCorrectionHref}
        setBlockedActivities={setBlockedActivities}
        openCommentFor={openCommentFor}
        setOpenCommentFor={setOpenCommentFor}
        commentText={commentText}
        setCommentText={setCommentText}
        openBlockFor={openBlockFor}
        setOpenBlockFor={setOpenBlockFor}
        toast={toast}
      />


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
