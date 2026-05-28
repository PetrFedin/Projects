import { useState, useEffect } from 'react';
import { useUserContext } from './useUserContext';
import { useB2BState } from '@/providers/b2b-state';
import { SYNTH_DASHBOARD_DEMO_MOCKS } from '@/lib/syntha-api-mode';
import {
  DASHBOARD_DEMO_LIVE_COLLABORATORS,
  DASHBOARD_DEMO_PENDING_APPROVALS,
  DASHBOARD_DEMO_TEAM_BUDGET,
} from '@/lib/dashboard/dashboard-demo-fixtures';

export interface LiveCollaborator {
  userId: string;
  name: string;
  avatar: string;
  initials: string;
  status: 'active' | 'idle';
  lastAction: string;
  addedItems: number;
}

export interface PendingApproval {
  id: string;
  title: string;
  requester: string;
  timestamp: string;
  itemCount: number;
}

export interface TeamBudget {
  allocated: number;
  total: number;
  remaining: number;
}

export interface RecentActivity {
  userAvatar: string;
  userInitials: string;
  userName: string;
  action: string;
  time: string;
}

export function useCollaborativeOrder() {
  const [isLoading, setIsLoading] = useState(true);

  const { currentOrg } = useUserContext();
  const { b2bActivityLogs } = useB2BState();

  const [liveCollaborators, setLiveCollaborators] = useState<LiveCollaborator[]>([]);
  const [pendingApprovals, setPendingApprovals] = useState<PendingApproval[]>([]);
  const [teamBudget, setTeamBudget] = useState<TeamBudget>(() =>
    SYNTH_DASHBOARD_DEMO_MOCKS
      ? { ...DASHBOARD_DEMO_TEAM_BUDGET }
      : { allocated: 0, total: 0, remaining: 0 }
  );
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);

      try {
        if (!SYNTH_DASHBOARD_DEMO_MOCKS) {
          setLiveCollaborators([]);
          setPendingApprovals([]);
          setTeamBudget({ allocated: 0, total: 0, remaining: 0 });
        } else {
          setLiveCollaborators(DASHBOARD_DEMO_LIVE_COLLABORATORS.map((c) => ({ ...c })));
          setPendingApprovals(DASHBOARD_DEMO_PENDING_APPROVALS.map((p) => ({ ...p })));
        }

        // Convert activity logs to recent activity
        const activities: RecentActivity[] = b2bActivityLogs.slice(0, 5).map((log) => {
          const name = log.actor?.name || 'User';
          return {
            userAvatar: `/avatars/${name.toLowerCase().replace(/\s+/g, '-')}.jpg`,
            userInitials:
              name
                .split(' ')
                .map((n: string) => n[0])
                .join('') || 'U',
            userName: name,
            action: log.details || '',
            time: getRelativeTime(log.timestamp),
          };
        });

        setRecentActivity(activities);

        await new Promise((resolve) => setTimeout(resolve, 300));
      } catch (error) {
        console.error('Failed to load collaborative data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [currentOrg, b2bActivityLogs]);

  return {
    liveCollaborators,
    pendingApprovals,
    teamBudget,
    recentActivity,
    isLoading,
  };
}

function getRelativeTime(timestamp: string): string {
  const now = new Date();
  const then = new Date(timestamp);
  const diffMs = now.getTime() - then.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));

  if (diffMins < 1) return 'только что';
  if (diffMins < 60) return `${diffMins} мин назад`;

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} ч назад`;

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} д назад`;
}
