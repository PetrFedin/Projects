'use client';

import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useState, type ComponentType, type ReactNode } from 'react';
import { shouldEagerAuthBootstrap } from '@/lib/auth/auth-bootstrap-route';
import { scheduleIdleMount } from '@/lib/wait-for-idle';
import { AuthProviderStub } from '@/providers/auth-provider-stub';

type AuthProviderComponent = ComponentType<{ children: ReactNode }>;

/**
 * Откладывает загрузку тяжёлого auth-chunk на public shell до idle.
 * Кабинеты / login / dev path-login — eager import с `loading=true` stub.
 */
export function AuthProviderGate({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [Provider, setProvider] = useState<AuthProviderComponent | null>(null);
  const [stubLoading, setStubLoading] = useState(true);

  const loadProvider = useCallback(() => {
    void import('@/providers/auth-provider').then((module) => {
      setProvider(() => module.AuthProvider);
    });
  }, []);

  useEffect(() => {
    const search = typeof window !== 'undefined' ? window.location.search : '';
    const eager = shouldEagerAuthBootstrap(pathname, search);
    setStubLoading(eager);
    setProvider(null);

    if (eager) {
      loadProvider();
      return;
    }

    setStubLoading(false);
    return scheduleIdleMount(loadProvider, 3500, 2000);
  }, [pathname, loadProvider]);

  if (!Provider) {
    return <AuthProviderStub loading={stubLoading}>{children}</AuthProviderStub>;
  }

  return <Provider>{children}</Provider>;
}
