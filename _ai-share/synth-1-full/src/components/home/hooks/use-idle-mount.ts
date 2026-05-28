'use client';

import { useEffect, useState } from 'react';
import { scheduleIdleMount } from '@/lib/wait-for-idle';

type UseIdleMountOptions = {
  /** Задержка idle перед mount (мс). */
  idleTimeout?: number;
  /** Fallback если requestIdleCallback недоступен (мс). */
  idleFallbackMs?: number;
  enabled?: boolean;
};

/** Только idle — для above-fold hero без IntersectionObserver. */
export function useIdleMount({
  idleTimeout = 800,
  idleFallbackMs = 350,
  enabled = true,
}: UseIdleMountOptions = {}) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!enabled) {
      setReady(false);
      return;
    }
    if (ready) return;

    let cancelled = false;
    const cancelIdle = scheduleIdleMount(
      () => {
        if (!cancelled) setReady(true);
      },
      idleTimeout,
      idleFallbackMs
    );

    return () => {
      cancelled = true;
      cancelIdle?.();
    };
  }, [enabled, ready, idleTimeout, idleFallbackMs]);

  return enabled && ready;
}
