'use client';

import React, { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useRouter, useSearchParams } from 'next/navigation';
import { getRecentActivities } from './page-data';
import type { RecentActivity } from './page-data';
import type { HistoryEntry } from '@/components/brand/SectionBlock';
import { useOrganizationHealth } from '@/hooks/use-organization-health';
import { useToast } from '@/hooks/use-toast';
import { useAttentionAlerts } from './use-attention-alerts';
const OrganizationOverviewContent = dynamic(
  () =>
    import('./organization-overview-content').then((m) => ({
      default: m.OrganizationOverviewContent,
    })),
  {
    ssr: false,
    loading: () => (
      <div
        className="min-h-[320px] animate-pulse rounded-xl border border-slate-100 bg-slate-50/80"
        aria-hidden
      />
    ),
  }
);
import { PARTICIPANTS_COUNT, ONLINE_COUNT } from './organization-demo-data';

type ActivityPeriod = '7d' | '30d' | { from: Date; to: Date };

function toDateStr(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function filterActivitiesByPeriod(
  activities: RecentActivity[],
  period: ActivityPeriod
): RecentActivity[] {
  let startStr: string;
  let endStr: string;
  if (typeof period === 'object') {
    startStr = toDateStr(period.from);
    endStr = toDateStr(period.to);
  } else {
    const today = new Date();
    const start = new Date(today);
    start.setDate(start.getDate() - (period === '7d' ? 6 : 29));
    startStr = toDateStr(start);
    endStr = toDateStr(today);
  }
  return activities.filter((a) => a.dateStr >= startStr && a.dateStr <= endStr);
}

const BRAND_PROFILE_ORG = '/brand?group=strategy&tab=overview';

export function OrganizationOverviewEmbed() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activityPeriod, setActivityPeriod] = useState<ActivityPeriod>('7d');
  const [customRange, setCustomRange] = useState<{ from?: Date; to?: Date }>({});
  const [activityParticipant, setActivityParticipant] = useState<string>('all');
  const [openBlockFor, setOpenBlockFor] = useState<number | null>(null);
  const [openCommentFor, setOpenCommentFor] = useState<number | null>(null);
  const [commentText, setCommentText] = useState('');
  const [blockedActivities, setBlockedActivities] = useState<RecentActivity[]>([]);
  const [alertHelpKey, setAlertHelpKey] = useState<string | null>(null);

  const activityKey = (a: RecentActivity) => `${a.user}|${a.action}|${a.time}|${a.dateStr}`;
  const isBlocked = (a: RecentActivity) =>
    blockedActivities.some((b) => activityKey(b) === activityKey(a));
  const getCorrectionHref = (act: RecentActivity) => {
    const map: Record<RecentActivity['type'], string> = {
      profile: '/brand',
      team: '/brand/team',
      integration: '/brand/integrations',
      security: '/brand/security',
      billing: '/brand/subscription',
    };
    return map[act.type];
  };

  const { toast } = useToast();
  const {
    alerts,
    getActiveDuration,
    getHistory,
    getBlockLabel,
    dismissCertificate,
    dismissProfile,
    dismissTask,
  } = useAttentionAlerts();

  const attentionHistory = (['certificates', 'profile', 'systems', 'tasks'] as const)
    .flatMap((id) => getHistory(id).map((e) => ({ ...e, blockLabel: getBlockLabel(id) })))
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 30);

  const recentActivities = useMemo(() => getRecentActivities(new Date()), []);
  const filteredActivities = filterActivitiesByPeriod(recentActivities, activityPeriod).filter(
    (a) => activityParticipant === 'all' || a.participantId === activityParticipant
  );

  const globalHistory = useMemo(() => {
    const activityEntries: HistoryEntry[] = filteredActivities.map((act, i) => ({
      id: `activity-${act.user}-${act.dateStr}-${i}-${act.action.slice(0, 20)}`,
      action: 'activity' as const,
      label: act.action,
      author: act.user,
      timestamp: new Date(act.dateStr).getTime() + (filteredActivities.length - i) * 60000,
      blockLabel:
        act.type === 'profile'
          ? 'Профиль'
          : act.type === 'team'
            ? 'Команда'
            : act.type === 'integration'
              ? 'Интеграции'
              : act.type === 'security'
                ? 'Безопасность'
                : 'Биллинг',
    }));
    return [...attentionHistory, ...activityEntries]
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 50) as HistoryEntry[];
  }, [attentionHistory, filteredActivities]);

  const formatHistoryTime = (ts: number) => {
    const diff = Date.now() - ts;
    if (diff < 60000) return 'только что';
    if (diff < 3600000) return `${Math.floor(diff / 60000)} мин`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} ч`;
    return `${Math.floor(diff / 86400000)} д`;
  };

  const resolvedKey = searchParams.get('resolved');
  useEffect(() => {
    if (resolvedKey) {
      setBlockedActivities((prev) => prev.filter((b) => activityKey(b) !== resolvedKey));
      router.replace(BRAND_PROFILE_ORG, { scroll: false });
    }
  }, [resolvedKey, router]);

  const {
    metrics: healthMetrics,
    overallHealth,
    lastCheck,
    isLoading: healthLoading,
    error: healthError,
    refetch: refetchHealth,
    profile: orgProfile,
    dashboard: orgDashboard,
  } = useOrganizationHealth();

  const modulesPeriodKey = typeof activityPeriod === 'object' ? '30d' : activityPeriod;

  return (
    <OrganizationOverviewContent
      modulesPeriodKey={modulesPeriodKey}
      orgProfile={orgProfile}
      orgDashboard={orgDashboard}
      healthMetrics={healthMetrics}
      overallHealth={overallHealth}
      lastCheck={lastCheck}
      healthLoading={healthLoading}
      healthError={healthError}
      refetchHealth={refetchHealth}
      activityPeriod={activityPeriod}
      setActivityPeriod={setActivityPeriod}
      customRange={customRange}
      setCustomRange={setCustomRange}
      activityParticipant={activityParticipant}
      setActivityParticipant={setActivityParticipant}
      blockedActivities={blockedActivities}
      setBlockedActivities={setBlockedActivities}
      openBlockFor={openBlockFor}
      setOpenBlockFor={setOpenBlockFor}
      openCommentFor={openCommentFor}
      setOpenCommentFor={setOpenCommentFor}
      commentText={commentText}
      setCommentText={setCommentText}
      alertHelpKey={alertHelpKey}
      setAlertHelpKey={setAlertHelpKey}
      toast={toast}
      alerts={alerts}
      getActiveDuration={getActiveDuration}
      getHistory={getHistory}
      getBlockLabel={getBlockLabel}
      dismissCertificate={dismissCertificate}
      dismissProfile={dismissProfile}
      dismissTask={dismissTask}
      attentionHistory={attentionHistory}
      filteredActivities={filteredActivities}
      globalHistory={globalHistory}
      formatHistoryTime={formatHistoryTime}
      activityKey={activityKey}
      isBlocked={isBlocked}
      getCorrectionHref={getCorrectionHref}
      resolvedKey={resolvedKey}
      participantsCount={PARTICIPANTS_COUNT}
      onlineCount={ONLINE_COUNT}
    />
  );
}
