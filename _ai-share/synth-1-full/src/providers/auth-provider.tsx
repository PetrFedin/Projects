'use client';

import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { usePathname } from 'next/navigation';
import type { UserProfile } from '@/lib/types';
import type { FastApiSessionProfile } from '@/lib/fastapi-session-profile';
import { authRepository } from '@/lib/repositories';
import { USE_FASTAPI } from '@/lib/syntha-api-mode';
import { shouldEagerAuthBootstrap } from '@/lib/auth/auth-bootstrap-route';
import { scheduleIdleMount } from '@/lib/wait-for-idle';
import {
  EMAIL_TO_SYNTH_ROLE,
  isSynthDevAutoLoginEnabled,
  markSynthDevAutoLoginSession,
  clearSynthDevAutoLoginSession,
  resolvePathBasedDevSignInEmail,
  SYNTH_MOCK_KNOWN_PASSWORD,
} from '@/lib/auth/dev-auth-bootstrap';
import { getUnknownErrorName } from '@/lib/unknown-error-message';

interface AuthContextType {
  user: UserProfile | null;
  profile: FastApiSessionProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<UserProfile>;
  signUp: (email: string, password: string, displayName: string) => Promise<UserProfile>;
  signOut: () => Promise<void>;
  updateProfile: (patch: Partial<UserProfile>) => Promise<UserProfile>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [profile, setProfile] = useState<FastApiSessionProfile | null>(null);
  /** Пока идёт восстановление сессии / dev auto-login — RouteGuard не кидает на «/». */
  const [loading, setLoading] = useState(true);
  const bootstrapStartedRef = useRef(false);

  const setSyntheticProfile = useCallback((email: string) => {
    const role = EMAIL_TO_SYNTH_ROLE[email.toLowerCase()];
    if (role) {
      setProfile({ user: { role, roles: [role] }, alerts: [], navigation: [] });
    }
  }, []);

  const fetchFastApiProfile = useCallback(async (fallbackEmail?: string) => {
    const email = fallbackEmail ?? (typeof window !== 'undefined' ? localStorage.getItem('syntha_last_email') : null);
    if (!USE_FASTAPI) {
      if (email) setSyntheticProfile(email);
      return;
    }

    const PROFILE_TIMEOUT_MS = 4000;

    try {
      const controller = new AbortController();
      const timeoutId = typeof window !== 'undefined' ? setTimeout(() => controller.abort(), PROFILE_TIMEOUT_MS) : undefined;

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1'}/profile/me`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('syntha_access_token')}` },
        signal: controller.signal,
      });
      if (timeoutId) clearTimeout(timeoutId);

      if (response.ok) {
        const data = (await response.json()) as { data?: unknown };
        if (data?.data) {
          setProfile(data.data as FastApiSessionProfile);
          return;
        }
      }
    } catch (err: unknown) {
      if (getUnknownErrorName(err) !== 'AbortError') console.warn('Failed to fetch FastAPI profile:', err);
    }
    if (email) setSyntheticProfile(email);
  }, [setSyntheticProfile]);

  useEffect(() => {
    let mounted = true;
    let safetyTimer: ReturnType<typeof setTimeout> | undefined;
    let idleCancel: (() => void) | undefined;
    let unsubscribe: (() => void) | undefined;

    const endBootstrap = () => {
      if (safetyTimer) clearTimeout(safetyTimer);
      if (mounted) setLoading(false);
    };

    const runBootstrap = () => {
      if (bootstrapStartedRef.current) return;
      bootstrapStartedRef.current = true;

      safetyTimer =
        typeof window !== 'undefined'
          ? window.setTimeout(() => {
              if (mounted) setLoading(false);
            }, 12000)
          : undefined;

      (async () => {
        try {
          const user = await authRepository.getCurrentUser();
          if (!mounted) return;
          setUser(user);
          const token = typeof window !== 'undefined' ? localStorage.getItem('syntha_access_token') : null;

          if (user && token) {
            const email = (user as { email?: string })?.email ?? localStorage.getItem('syntha_last_email');
            await fetchFastApiProfile(email ?? undefined);
          } else if (typeof window !== 'undefined') {
            const path = window.location.pathname;
            const search = window.location.search || '';
            const email = isSynthDevAutoLoginEnabled() ? resolvePathBasedDevSignInEmail(path, search) : null;
            if (email) {
              try {
                const u = await authRepository.signIn(email, SYNTH_MOCK_KNOWN_PASSWORD);
                if (mounted) {
                  setUser(u);
                  markSynthDevAutoLoginSession();
                  await fetchFastApiProfile(email);
                }
              } catch {
                /* dev auto-login */
              }
            } else if (user) {
              const email2 = (user as { email?: string })?.email ?? localStorage.getItem('syntha_last_email');
              await fetchFastApiProfile(email2 ?? undefined);
            }
          }
        } catch {
          /* ignore */
        } finally {
          endBootstrap();
        }
      })();

      unsubscribe = authRepository.onAuthStateChanged((user) => {
        if (!mounted) return;
        setUser(user);
        if (user) {
          const email = (user as { email?: string })?.email ?? localStorage.getItem('syntha_last_email');
          void fetchFastApiProfile(email ?? undefined);
        } else {
          setProfile(null);
        }
      });
    };

    const search = typeof window !== 'undefined' ? window.location.search : '';
    const eager = shouldEagerAuthBootstrap(pathname, search);

    if (eager) {
      runBootstrap();
    } else {
      setLoading(false);
      idleCancel = scheduleIdleMount(runBootstrap, 3500, 2000);
    }

    return () => {
      mounted = false;
      if (safetyTimer) clearTimeout(safetyTimer);
      idleCancel?.();
      unsubscribe?.();
    };
  }, [fetchFastApiProfile, pathname]);

  const signIn = useCallback(async (email: string, password: string) => {
    const userProfile = await authRepository.signIn(email, password);
    setUser(userProfile);
    if (typeof window !== 'undefined') localStorage.setItem('syntha_last_email', email);
    setSyntheticProfile(email);
    /** Дождаться Hub-профиля, иначе RouteGuard после `router.push` ещё один тик видит старый `profile`. */
    await fetchFastApiProfile(email);
    return userProfile;
  }, [fetchFastApiProfile, setSyntheticProfile]);

  const signUp = useCallback(async (email: string, password: string, displayName: string) => {
    const userProfile = await authRepository.signUp(email, password, displayName);
    setUser(userProfile);
    await fetchFastApiProfile();
    return userProfile;
  }, [fetchFastApiProfile]);

  const signOut = useCallback(async () => {
    await authRepository.signOut();
    setUser(null);
    setProfile(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('syntha_last_email');
      clearSynthDevAutoLoginSession();
    }
  }, []);

  const updateProfile = useCallback(async (patch: Partial<UserProfile>) => {
    const updated = await authRepository.updateCurrentUser(patch);
    setUser(updated);
    return updated;
  }, []);

  return (
    <AuthContext.Provider value={{ user, profile, loading, signIn, signUp, signOut, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

