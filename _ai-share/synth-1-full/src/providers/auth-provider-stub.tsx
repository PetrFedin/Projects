'use client';

import { useMemo, type ReactNode } from 'react';
import { AuthContext, type AuthContextType } from '@/lib/auth/auth-context';

const rejectWhileLoading = (): Promise<never> =>
  Promise.reject(new Error('Auth module is still loading'));

/**
 * Лёгкий placeholder, пока lazy-chunk `auth-provider` грузится.
 * На кабинетах `loading=true` — RouteGuard ждёт bootstrap.
 */
export function AuthProviderStub({
  children,
  loading = false,
}: {
  children: ReactNode;
  loading?: boolean;
}) {
  const value = useMemo<AuthContextType>(
    () => ({
      user: null,
      profile: null,
      loading,
      signIn: rejectWhileLoading,
      signUp: rejectWhileLoading,
      signOut: rejectWhileLoading,
      updateProfile: rejectWhileLoading,
    }),
    [loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
