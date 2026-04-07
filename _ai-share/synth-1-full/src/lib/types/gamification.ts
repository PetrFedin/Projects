export type AchievementType = 'sales' | 'service' | 'training' | 'social';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  type: AchievementType;
  points: number;
  unlockedAt?: string;
}

export interface StaffLeaderboardEntry {
  id: string;
  name: string;
  avatar: string;
  position: string;
  points: number;
  salesVolume: number;
  conversionRate: number;
  rank: number;
  trend: 'up' | 'down' | 'stable';
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  rewardPoints: number;
  endsAt: string;
  category: 'personal' | 'team';
}

export interface StaffMemberGamification {
  staffId: string;
  totalPoints: number;
  level: number;
  nextLevelProgress: number;
  achievements: Achievement[];
  activeChallenges: Challenge[];
  history: {
    id: string;
    action: string;
    points: number;
    date: string;
  }[];
}
