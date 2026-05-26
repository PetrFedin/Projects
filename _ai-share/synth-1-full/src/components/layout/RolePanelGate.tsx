'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const RolePanel = dynamic(() => import('./role-panel'), { ssr: false });

/** Демо-панель ролей — после idle, не блокирует cold compile. */
export function RolePanelGate() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(() => setMounted(true), { timeout: 2500 });
      return () => window.cancelIdleCallback(id);
    }
    const timer = window.setTimeout(() => setMounted(true), 1200);
    return () => window.clearTimeout(timer);
  }, []);

  if (!mounted) return null;
  return <RolePanel />;
}
