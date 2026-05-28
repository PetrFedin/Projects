'use client';

import { useEffect, useState } from 'react';
import { W2_PASSPORT_SUBPAGE_ANCHORS } from '@/lib/production/workshop2-passport-check';
import type { Workshop2TzSignoffSectionKey } from '@/lib/production/workshop2-dossier-phase1.types';

const PASSPORT_SUBNAV_ANCHOR_IDS: readonly string[] = [
  W2_PASSPORT_SUBPAGE_ANCHORS.hub,
  W2_PASSPORT_SUBPAGE_ANCHORS.identity,
  W2_PASSPORT_SUBPAGE_ANCHORS.brief,
  W2_PASSPORT_SUBPAGE_ANCHORS.start,
];

/** Подсветка поднавигации паспорта по скроллу (IntersectionObserver) + сброс при смене секции ТЗ. */
export function useWorkshop2Phase1DossierPassportSubnavScrollSpy(input: {
  activeSection: Workshop2TzSignoffSectionKey;
  dossierHydrateKey: number;
}) {
  const { activeSection, dossierHydrateKey } = input;

  const [, setActivePassportSubNavId] = useState<string | null>(null);

  useEffect(() => {
    if (activeSection !== 'general') {
      setActivePassportSubNavId(null);
      return;
    }
    setActivePassportSubNavId((prev) => prev ?? W2_PASSPORT_SUBPAGE_ANCHORS.hub);
  }, [activeSection]);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') return;
    if (activeSection !== 'general') return;

    const elements = PASSPORT_SUBNAV_ANCHOR_IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => Boolean(el)
    );
    if (!elements.length) return;

    const ratios = new Map<Element, number>();
    const pickBest = () => {
      let bestEl: HTMLElement | null = null;
      let best = 0;
      for (const el of elements) {
        const r = ratios.get(el) ?? 0;
        if (r > best) {
          best = r;
          bestEl = el;
        }
      }
      if (bestEl?.id) setActivePassportSubNavId(bestEl.id);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          ratios.set(e.target, e.isIntersecting ? e.intersectionRatio : 0);
        }
        pickBest();
      },
      {
        root: null,
        rootMargin: '-10% 0px -40% 0px',
        threshold: [0, 0.05, 0.15, 0.35, 0.55, 0.75, 1],
      }
    );

    for (const el of elements) {
      ratios.set(el, 0);
      observer.observe(el);
    }
    pickBest();

    return () => observer.disconnect();
  }, [activeSection, dossierHydrateKey]);

  return { setActivePassportSubNavId };
}
