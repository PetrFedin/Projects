'use client';

import { useEffect } from 'react';

const STORAGE_KEY = 'syntha-chunk-reload-ts';

/**
 * В dev после перезапуска `next dev` браузер иногда запрашивает старые chunk URL → ChunkLoadError.
 * Одна автоперезагрузка обычно подтягивает актуальные чанки.
 */
export function ChunkLoadRecovery() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;

    const tryReloadOnce = () => {
      const last = sessionStorage.getItem(STORAGE_KEY);
      const now = Date.now();
      if (last && now - Number(last) < 4000) return;
      sessionStorage.setItem(STORAGE_KEY, String(now));
      window.location.reload();
    };

    const onScriptError = (e: Event) => {
      const t = e.target as HTMLScriptElement | null;
      if (t?.tagName !== 'SCRIPT' || !t.src?.includes('/_next/static/chunks/')) return;
      tryReloadOnce();
    };

    const onRejection = (e: PromiseRejectionEvent) => {
      const r = e.reason as { name?: string; message?: string } | undefined;
      const msg = String(r?.message ?? e.reason ?? '');
      if (r?.name === 'ChunkLoadError' || msg.includes('Loading chunk')) tryReloadOnce();
    };

    window.addEventListener('error', onScriptError, true);
    window.addEventListener('unhandledrejection', onRejection);
    const clearKey = window.setTimeout(() => sessionStorage.removeItem(STORAGE_KEY), 8000);
    return () => {
      window.removeEventListener('error', onScriptError, true);
      window.removeEventListener('unhandledrejection', onRejection);
      window.clearTimeout(clearKey);
    };
  }, []);

  return null;
}
