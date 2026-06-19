'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { X } from 'lucide-react';
import {
  clearSynthDevAutoLoginSession,
  SYNTH_DEV_AUTO_LOGIN_SESSION_KEY,
} from '@/lib/auth/dev-auth-bootstrap';
import { isPlatformCoreGoldenPath } from '@/lib/platform-core-cabinet-route';

/**
 * Показывается после path-based dev auto-login (`AuthProvider`), пока вкладка открыта.
 */
export function DevSessionBanner() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (process.env.NODE_ENV === 'production') return;
    const corePath = isPlatformCoreGoldenPath(pathname);
    if (corePath) {
      setVisible(false);
      return;
    }
    try {
      if (sessionStorage.getItem(SYNTH_DEV_AUTO_LOGIN_SESSION_KEY) === '1') {
        setVisible(true);
      }
    } catch {
      /* ignore */
    }
  }, [pathname]);

  if (!visible) return null;

  return (
    <div
      role="status"
      className="fixed left-0 right-0 top-0 z-[100] flex items-center justify-center gap-3 border-b border-amber-700/40 bg-amber-500/95 px-3 py-1.5 text-center text-[11px] font-medium text-amber-950 shadow-sm"
    >
      <span>Демо-сессия (dev).</span>
      <button
        type="button"
        onClick={() => {
          clearSynthDevAutoLoginSession();
          setVisible(false);
        }}
        className="inline-flex shrink-0 items-center gap-0.5 rounded border border-amber-900/30 bg-amber-100/80 px-1.5 py-0.5 text-[10px] font-semibold hover:bg-amber-200/90"
        aria-label="Скрыть баннер"
      >
        <X className="size-3" aria-hidden />
      </button>
    </div>
  );
}
