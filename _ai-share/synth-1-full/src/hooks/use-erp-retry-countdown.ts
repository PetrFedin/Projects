'use client';

import { useEffect, useState } from 'react';
import { formatErpAutoRetryCountdownRu } from '@/lib/production/workshop2-erp-retry-hint';

/** Живой countdown до erpNextRetryAt (1 с при <2 мин, иначе 15 с). */
export function useErpRetryCountdown(erpNextRetryAt?: string): string | null {
  const [nowMs, setNowMs] = useState(() => Date.now());

  useEffect(() => {
    if (!erpNextRetryAt?.trim()) return;
    const at = Date.parse(erpNextRetryAt);
    if (!Number.isFinite(at)) return;
    const delta = at - Date.now();
    if (delta <= 0) {
      setNowMs(Date.now());
      return;
    }
    const intervalMs = delta < 120_000 ? 1000 : 15_000;
    const id = setInterval(() => setNowMs(Date.now()), intervalMs);
    return () => clearInterval(id);
  }, [erpNextRetryAt]);

  return formatErpAutoRetryCountdownRu(erpNextRetryAt, nowMs);
}
