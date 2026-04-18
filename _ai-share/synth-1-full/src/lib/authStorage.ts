import type { UserProfile } from '@/lib/types';

const AUTH_STORAGE_KEY = 'syntha_auth_user';
const USERS_STORAGE_KEY = 'syntha_users';

export function getStoredAuthUser(): UserProfile | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as UserProfile;
  } catch {
    return null;
  }
}

function updateUsersDb(profile: UserProfile) {
  if (typeof window === 'undefined') return;
  const raw = localStorage.getItem(USERS_STORAGE_KEY);
  if (!raw) return;
  try {
    const parsed = JSON.parse(raw);
    const usersMap = new Map(parsed as any[]);
    const entry = usersMap.get(profile.email);
    if (entry && typeof entry === 'object') {
      const prev = entry as { profile?: Partial<UserProfile> };
      usersMap.set(profile.email, { ...prev, profile: { ...(prev.profile || {}), ...profile } });
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(Array.from(usersMap.entries())));
    }
  } catch {
    // ignore
  }
}

export function setStoredAuthUser(nextUser: UserProfile) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextUser));
  updateUsersDb(nextUser);
  window.dispatchEvent(new Event('syntha:authUserUpdated'));
}
