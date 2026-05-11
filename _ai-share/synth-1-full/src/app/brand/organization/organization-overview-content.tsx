'use client';

import React, { useState } from 'react';
import type { RecentActivity } from './page-data';
import type { HistoryEntry } from '@/components/brand/SectionBlock';
import type { ActivityPeriod } from './_components/organization-overview-lib';
import { OrganizationHubHeader } from './_components/organization-hub-header';
import { OrganizationAttentionAlertsSection } from './_components/organization-attention-alerts-section';
import { OrganizationHealthActivityGrid } from './_components/organization-health-activity-grid';
import { OrganizationPartnerEcosystemSection } from './_components/organization-partner-ecosystem-section';
import { OrganizationRoleReportsSection } from './_components/organization-role-reports-section';
import { OrganizationModulesSection } from './_components/organization-modules-section';

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
  const [openHealthDetailFor, setOpenHealthDetailFor] = useState<number | null>(null);
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

      <OrganizationRoleReportsSection />

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

      <OrganizationPartnerEcosystemSection modulesPeriodKey={modulesPeriodKey} globalHistory={globalHistory} />

      <OrganizationModulesSection
        modulesPeriodKey={modulesPeriodKey}
        globalHistory={globalHistory}
        participantsCount={participantsCount}
      />
    </>
  );
}
