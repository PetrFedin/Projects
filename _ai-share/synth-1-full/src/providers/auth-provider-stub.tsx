'use client';

import { useCallback, useMemo, useState, type ReactNode } from 'react';
import type { UserProfile } from '@/lib/types';
import { AuthContext, type AuthContextType } from '@/lib/auth/auth-context';
import { authRepository } from '@/lib/repositories';

const rejectWhileLoading = (): Promise<never> =>
  Promise.reject(new Error('Auth module is still loading'));

/**
 * Лёгкий placeholder, пока lazy-chunk `auth-provider` грузится.
 * `interactive` — public shell до idle: signIn через authRepository + forceLoad chunk.
 */
export function AuthProviderStub({
  children,
  loading = false,
  interactive = false,
  onForceLoad,
}: {
  children: ReactNode;
  loading?: boolean;
  /** Public shell: разрешить signIn до прихода полного AuthProvider. */
  interactive?: boolean;
  onForceLoad?: () => void;
}) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [profile, setProfile] = useState<AuthContextType['profile']>(null);

  const signIn = useCallback(
    async (email: string, password: string) => {
      if (!interactive) return rejectWhileLoading();
      onForceLoad?.();
      const userProfile = await authRepository.signIn(email, password);
      if (typeof window !== 'undefined') localStorage.setItem('syntha_last_email', email);
      setUser(userProfile);
      return userProfile;
    },
    [interactive, onForceLoad]
  );

  const signUp = useCallback(
    async (email: string, password: string, displayName: string) => {
      if (!interactive) return rejectWhileLoading();
      onForceLoad?.();
      const userProfile = await authRepository.signUp(email, password, displayName);
      setUser(userProfile);
      return userProfile;
    },
    [interactive, onForceLoad]
  );

  const signOut = useCallback(async () => {
    if (!interactive) return rejectWhileLoading();
    onForceLoad?.();
    await authRepository.signOut();
    setUser(null);
    setProfile(null);
    if (typeof window !== 'undefined') localStorage.removeItem('syntha_last_email');
  }, [interactive, onForceLoad]);

  const updateProfile = useCallback(
    async (patch: Partial<UserProfile>) => {
      if (!interactive) return rejectWhileLoading();
      onForceLoad?.();
      const updated = await authRepository.updateCurrentUser(patch);
      setUser(updated);
      return updated;
    },
    [interactive, onForceLoad]
  );

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      profile,
      loading,
      signIn,
      signUp,
      signOut,
      updateProfile,
    }),
    [user, profile, loading, signIn, signUp, signOut, updateProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
