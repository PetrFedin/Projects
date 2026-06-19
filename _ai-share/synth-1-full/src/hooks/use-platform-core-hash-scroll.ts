'use client';

import { useEffect } from 'react';

/** Прокрутка к якорю после client navigation (столп order_production / development). */
export function usePlatformCoreHashScroll(targetIds: readonly string[]): void {
  useEffect(() => {
    const scrollToHash = () => {
      const raw = typeof window !== 'undefined' ? window.location.hash.replace(/^#/, '') : '';
      if (!raw || !targetIds.includes(raw)) return false;
      const el = document.getElementById(raw);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return true;
      }
      return false;
    };

    const tryScroll = () => {
      if (scrollToHash()) return;
      let attempts = 0;
      const retry = () => {
        attempts += 1;
        if (scrollToHash() || attempts >= 12) return;
        window.setTimeout(retry, 150);
      };
      window.setTimeout(retry, 50);
    };

    tryScroll();
    window.addEventListener('hashchange', tryScroll);
    return () => window.removeEventListener('hashchange', tryScroll);
  }, [targetIds]);
}
