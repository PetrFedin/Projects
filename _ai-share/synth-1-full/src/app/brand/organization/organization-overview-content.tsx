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
  setBlockedActivities: React.Dispatch<React.SetStateAction<RecentActivity[]>>;
  openBlockFor: number | null;
  setOpenBlockFor: (n: number | null) => void;
  openCommentFor: number | null;
  setOpenCommentFor: (n: number | null) => void;
  commentText: string;
  setCommentText: (s: string) => void;
  toast: any;
  alerts: any;
  getBlockLabel: (key: string) => string;
  dismissCertificate: (id: string) => void;
  dismissProfile: (id: string) => void;
  dismissTask: (id: string) => void;
  filteredActivities: RecentActivity[];
  globalHistory: HistoryEntry[];
  activityKey: (a: RecentActivity) => string;
  isBlocked: (a: RecentActivity) => boolean;
  getCorrectionHref: (act: RecentActivity) => string;
  participantsCount?: number;
  onlineCount?: number;
  partialLoadWarning?: string | null;
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
    partialLoadWarning,
  } = props;

  return (
    <>
      <OrganizationHubHeader
        healthLoading={healthLoading}
        healthError={healthError}
        partialLoadWarning={partialLoadWarning}
        onRetryHealth={refetchHealth}
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
        dismissCertificate={dismissCertificate}
        dismissProfile={dismissProfile}
        dismissTask={dismissTask}
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
