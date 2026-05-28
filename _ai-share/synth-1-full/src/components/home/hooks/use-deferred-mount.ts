'use client';

import { useEffect, useRef, useState } from 'react';
import { scheduleIdleMount } from '@/lib/wait-for-idle';

type UseDeferredMountOptions = {
  /** Когда false — IO/idle не стартуют (например, ждём products.json). */
  enabled?: boolean;
  rootMargin?: string;
  idleTimeout?: number;
  idleFallbackMs?: number;
};

/**
 * Отложенный mount: IntersectionObserver + idle fallback.
 * Паттерн для below-fold / role-specific chunks на главной.
 */
export function useDeferredMount({
  enabled = true,
  rootMargin = '400px 0px',
  idleTimeout = 3500,
  idleFallbackMs = 1500,
}: UseDeferredMountOptions = {}) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!enabled) {
      setReady(false);
      return;
    }
    if (ready) return;

    let cancelled = false;
    const mount = () => {
      if (!cancelled) setReady(true);
    };

    const cancelIdle = scheduleIdleMount(mount, idleTimeout, idleFallbackMs);

    const el = sentinelRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      return () => {
        cancelled = true;
        cancelIdle?.();
      };
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          mount();
          observer.disconnect();
        }
      },
      { rootMargin, threshold: 0 }
    );

    observer.observe(el);

    return () => {
      cancelled = true;
      observer.disconnect();
      cancelIdle?.();
    };
  }, [enabled, ready, rootMargin, idleTimeout, idleFallbackMs]);

  return { sentinelRef, ready: enabled && ready };
}
