'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { UserProfile } from '@/lib/types';
import { authRepository } from '@/lib/repositories';
import { USE_FASTAPI } from '@/lib/syntha-api-mode';

interface AuthContextType {
  user: UserProfile | null;
  profile: any | null; // FastAPI profile data
  loading: boolean;
  signIn: (email: string, password: string) => Promise<UserProfile>;
  signUp: (email: string, password: string, displayName: string) => Promise<UserProfile>;
  signOut: () => Promise<void>;
  updateProfile: (patch: Partial<UserProfile>) => Promise<UserProfile>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  /** Пока идёт восстановление сессии / dev auto-login — RouteGuard не кидает на «/». */
  const [loading, setLoading] = useState(true);

  const emailToRole: Record<string, string> = {
    'admin@syntha.ai': 'admin',
    'brand@syntha.ai': 'brand',
    'shop@syntha.ai': 'shop',
    'dist@syntha.ai': 'distributor',
    'factory@syntha.ai': 'manufacturer',
    'supplier@syntha.ai': 'supplier',
    'elena.petrova@example.com': 'client',
  };

  const setSyntheticProfile = useCallback((email: string) => {
    const role = emailToRole[email.toLowerCase()];
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
        const data = await response.json();
        if (data?.data) {
          setProfile(data.data);
          return;
        }
      }
    } catch (err: any) {
      if (err?.name !== 'AbortError') console.warn('Failed to fetch FastAPI profile:', err);
    }
    if (email) setSyntheticProfile(email);
  }, [setSyntheticProfile]);

  useEffect(() => {
    let mounted = true;
    const safetyMs = 12000;
    const safetyTimer =
      typeof window !== 'undefined'
        ? window.setTimeout(() => {
            if (mounted) setLoading(false);
          }, safetyMs)
        : undefined;

    const endBootstrap = () => {
      if (safetyTimer) clearTimeout(safetyTimer);
      if (mounted) setLoading(false);
    };

    (async () => {
      try {
        let user = await authRepository.getCurrentUser();
        if (!mounted) return;
        setUser(user);
        const token = typeof window !== 'undefined' ? localStorage.getItem('syntha_access_token') : null;

        if (user && token) {
          const email = (user as { email?: string })?.email ?? localStorage.getItem('syntha_last_email');
          await fetchFastApiProfile(email ?? undefined);
        } else if (typeof window !== 'undefined') {
          const path = window.location.pathname;
          const search = window.location.search || '';
          const isSupplier = search.includes('role=supplier');
          const email =
            path.startsWith('/admin') ? 'admin@syntha.ai'
            : path.startsWith('/brand') ? 'brand@syntha.ai'
            : path.startsWith('/distributor') ? 'dist@syntha.ai'
            : path.startsWith('/factory') ? (isSupplier ? 'supplier@syntha.ai' : 'factory@syntha.ai')
            : path.startsWith('/client') ? 'elena.petrova@example.com'
            : path.startsWith('/shop') ? 'shop@syntha.ai'
            : null;
          if (email) {
            try {
              const u = await authRepository.signIn(email, 'password123');
              if (mounted) {
                setUser(u);
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

    const unsubscribe = authRepository.onAuthStateChanged((user) => {
      if (!mounted) return;
      setUser(user);
      if (user) {
        const email = (user as { email?: string })?.email ?? localStorage.getItem('syntha_last_email');
        void fetchFastApiProfile(email ?? undefined);
      } else {
        setProfile(null);
      }
    });

    return () => {
      mounted = false;
      if (safetyTimer) clearTimeout(safetyTimer);
      unsubscribe();
    };
  }, [fetchFastApiProfile]);

  const signIn = useCallback(async (email: string, password: string) => {
    const userProfile = await authRepository.signIn(email, password);
    setUser(userProfile);
    if (typeof window !== 'undefined') localStorage.setItem('syntha_last_email', email);
    setSyntheticProfile(email);
    fetchFastApiProfile(email);
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
    if (typeof window !== 'undefined') localStorage.removeItem('syntha_last_email');
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

