'use client';

import { useCallback, useEffect, useState } from 'react';

const VISIBLE_POLL_MS = 20_000;
const HIDDEN_POLL_MS = 60_000;

/** Тик для refetch реестра B2B: SSE push + poll fallback (новый заказ без ручного refresh). */
export function usePlatformCoreB2bRegistryPoll(enabled: boolean): {
  tick: number;
  refresh: () => void;
  sseConnected: boolean;
} {
  const [tick, setTick] = useState(0);
  const [sseConnected, setSseConnected] = useState(false);
  const refresh = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    if (!enabled || typeof EventSource === 'undefined') {
      setSseConnected(false);
      return;
    }
    const es = new EventSource('/api/platform-core/b2b/registry-stream');
    es.onopen = () => setSseConnected(true);
    es.onmessage = (ev) => {
      try {
        const data = JSON.parse(ev.data) as { type?: string };
        if (data.type === 'registry_update') refresh();
      } catch {
        /* ignore */
      }
    };
    es.onerror = () => {
      setSseConnected(false);
      es.close();
    };
    return () => {
      setSseConnected(false);
      es.close();
    };
  }, [enabled, refresh]);

  useEffect(() => {
    if (!enabled) return;
    const onFocus = () => refresh();
    const onVisible = () => {
      if (document.visibilityState === 'visible') refresh();
    };
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [enabled, refresh]);

  useEffect(() => {
    if (!enabled) return;
    let timer: number | undefined;
    const schedule = () => {
      if (timer !== undefined) window.clearInterval(timer);
      const ms =
        document.visibilityState === 'visible' ? VISIBLE_POLL_MS : HIDDEN_POLL_MS;
      timer = window.setInterval(() => setTick((t) => t + 1), ms);
    };
    schedule();
    document.addEventListener('visibilitychange', schedule);
    return () => {
      document.removeEventListener('visibilitychange', schedule);
      if (timer !== undefined) window.clearInterval(timer);
    };
  }, [enabled]);

  return { tick, refresh, sseConnected };
}
