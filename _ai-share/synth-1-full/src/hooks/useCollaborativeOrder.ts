import { useState, useEffect } from 'react';
import { useUserContext } from './useUserContext';
import { useB2BState } from '@/providers/b2b-state';

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
  
  const { user, currentOrg } = useUserContext();
  const { b2bActivityLogs, b2bCart } = useB2BState();
  
  const [liveCollaborators, setLiveCollaborators] = useState<LiveCollaborator[]>([]);
  const [pendingApprovals, setPendingApprovals] = useState<PendingApproval[]>([]);
  const [teamBudget, setTeamBudget] = useState<TeamBudget>({
    allocated: 420000,
    total: 650000,
    remaining: 230000
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      
      try {
        // Mock collaborators
        setLiveCollaborators([
          {
            userId: 'user-1',
            name: 'Maria Ivanova',
            avatar: '/avatars/maria.jpg',
            initials: 'MI',
            status: 'active',
            lastAction: 'добавила 5 SKU (2 мин назад)',
            addedItems: 5
          },
          {
            userId: 'user-2',
            name: 'Ivan Kozlov',
            avatar: '/avatars/ivan.jpg',
            initials: 'IK',
            status: 'idle',
            lastAction: 'изменил quantities (15 мин назад)',
            addedItems: 0
          }
        ]);
        
        // Mock pending approvals
        setPendingApprovals([
          {
            id: 'approval-1',
            title: 'Nordic Wool FW26 Order',
            requester: 'Elena Volkova',
            timestamp: '10 мин назад',
            itemCount: 12
          },
          {
            id: 'approval-2',
            title: 'Syntha Lab SS26 Samples',
            requester: 'Alexey Petrov',
            timestamp: '1 ч назад',
            itemCount: 5
          }
        ]);
        
        // Convert activity logs to recent activity
        const activities: RecentActivity[] = b2bActivityLogs.slice(0, 5).map((log) => {
          const displayName = log.userName ?? log.actor.name ?? 'User';
          return {
            userAvatar: `/avatars/${displayName.toLowerCase().replace(' ', '-')}.jpg`,
            userInitials:
              displayName
                .split(' ')
                .map((n: string) => n[0])
                .join('') || 'U',
            userName: displayName,
            action: log.description ?? log.details ?? '',
            time: getRelativeTime(log.timestamp),
          };
        });
        
        setRecentActivity(activities);
        
        await new Promise(resolve => setTimeout(resolve, 300));
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
    isLoading
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
