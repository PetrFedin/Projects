'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { shouldShowFloatingRolePanel } from '@/lib/cabinet-core-mode';

const RolePanel = dynamic(() => import('./role-panel'), { ssr: false });

/** Демо-панель ролей — после idle, не блокирует cold compile. Скрыта в Platform Core. */
export function RolePanelGate() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(() => setMounted(true), { timeout: 2500 });
      return () => window.cancelIdleCallback(id);
    }
    const timer = globalThis.setTimeout(() => setMounted(true), 1200);
    return () => globalThis.clearTimeout(timer);
  }, []);

  if (!shouldShowFloatingRolePanel()) return null;
  if (!mounted) return null;
  return <RolePanel />;
}
