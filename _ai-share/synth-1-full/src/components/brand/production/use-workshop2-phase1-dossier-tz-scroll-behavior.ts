'use client';

import { useEffect, useState } from 'react';

/** Плавный скролл к якорям ТЗ; при prefers-reduced-motion — instant. */
export function useWorkshop2Phase1DossierTzScrollBehavior() {
  const [tzScrollBehavior, setTzScrollBehavior] = useState<ScrollBehavior>('smooth');
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setTzScrollBehavior(mq.matches ? 'auto' : 'smooth');
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);
  return tzScrollBehavior;
}
