'use client';

import { useEffect } from 'react';
import { formatUnknownErrorForLog } from '@/lib/unknown-error-message';

const STORAGE_KEY = 'syntha-chunk-reload-ts';

/**
 * В dev после перезапуска `next dev` браузер может держать старые URL ассетов:
 * - `/_next/static/chunks/*` (JS)
 * - `/_next/static/css/*` (CSS)
 * Это даёт ChunkLoadError и «голую» страницу.
 * Пробуем один "hard refresh": чистим SW/Cache Storage и перезагружаем вкладку.
 */
export function ChunkLoadRecovery() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;

    const sleep = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms));

    const extractChunkUrl = (value: unknown): string | null => {
      const msg = formatUnknownErrorForLog(value);
      const timeout = msg.match(/\(timeout:\s*(https?:\/\/[^)]+)\)/i);
      if (timeout?.[1]) return timeout[1];
      const err = msg.match(/error:\s*(https?:\/\/[^\s)]+)/i);
      if (err?.[1]) return err[1];
      const bare = msg.match(/(https?:\/\/[^\s)]+\/_next\/static\/chunks\/[^\s)]+)/i);
      return bare?.[1] ?? null;
    };

    /** Next `import()` часто даёт TypeError без имени ChunkLoadError — ловим текстом. */
    const isChunkRelatedMessage = (msg: string): boolean => {
      const m = msg.toLowerCase();
      return (
        m.includes('chunkload') ||
        m.includes('loading chunk') ||
        m.includes('failed to fetch dynamically imported module') ||
        m.includes('error loading dynamically imported module') ||
        m.includes('importing a module script failed') ||
        m.includes('/_next/static/chunks/')
      );
    };

    const waitForChunkReady = async (chunkUrl: string | null) => {
      if (!chunkUrl) return;
      // Dev may briefly 404 an on-demand chunk while webpack compiles it.
      for (let i = 0; i < 15; i += 1) {
        try {
          const res = await fetch(chunkUrl, { cache: 'reload' });
          if (res.ok) return;
        } catch {
          // ignore and retry
        }
        await sleep(700);
      }
    };

    const tryReloadOnce = async (chunkUrl: string | null = null) => {
      const last = sessionStorage.getItem(STORAGE_KEY);
      const now = Date.now();
      if (last && now - Number(last) < 4000) return;
      sessionStorage.setItem(STORAGE_KEY, String(now));

      await waitForChunkReady(chunkUrl);

      try {
        if ('serviceWorker' in navigator) {
          const regs = await navigator.serviceWorker.getRegistrations();
          await Promise.all(regs.map((r) => r.unregister()));
        }
        if ('caches' in window) {
          const keys = await caches.keys();
          await Promise.all(keys.map((k) => caches.delete(k)));
        }
      } catch {
        // best-effort cleanup
      }

      window.location.reload();
    };

    const safeReload = (chunkUrl: string | null) => {
      void tryReloadOnce(chunkUrl).catch(() => {
        /* ignore: до reload не должно доходить */
      });
    };

    const onResourceError = (e: Event) => {
      const t = e.target as HTMLElement | null;
      if (!t) return;

      if (t.tagName === 'SCRIPT') {
        const s = t as HTMLScriptElement;
        if (s.src?.includes('/_next/static/chunks/')) safeReload(s.src);
        return;
      }

      if (t.tagName === 'LINK') {
        const l = t as HTMLLinkElement;
        if (l.rel === 'stylesheet' && l.href?.includes('/_next/static/css/')) {
          safeReload(l.href);
        }
      }
    };

    const onRejection = (e: PromiseRejectionEvent) => {
      const msg = formatUnknownErrorForLog(e.reason);
      if (!isChunkRelatedMessage(msg)) return;
      e.preventDefault();
      safeReload(extractChunkUrl(e.reason));
    };

    const onWindowError = (e: ErrorEvent) => {
      const fn = (e as ErrorEvent & { filename?: string }).filename ?? '';
      const msg = `${formatUnknownErrorForLog(e.error) || (e.message ?? '')} ${fn}`.trim();
      if (!isChunkRelatedMessage(msg)) return;
      if (fn.includes('/_next/static/chunks/')) {
        safeReload(fn);
        return;
      }
      safeReload(extractChunkUrl(msg));
    };

    window.addEventListener('error', onResourceError, true);
    window.addEventListener('error', onWindowError);
    window.addEventListener('unhandledrejection', onRejection);
    const clearKey = window.setTimeout(() => sessionStorage.removeItem(STORAGE_KEY), 8000);
    return () => {
      window.removeEventListener('error', onResourceError, true);
      window.removeEventListener('error', onWindowError);
      window.removeEventListener('unhandledrejection', onRejection);
      window.clearTimeout(clearKey);
    };
  }, []);

  return null;
}
