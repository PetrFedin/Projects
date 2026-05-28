'use client';

import { useCallback, useEffect, useRef } from 'react';
import {
  getRunwayStoredSection,
  setRunwayStoredSection,
} from '@/hooks/useRunwaySectionPersistence';

export interface UseScrollExperienceUrlSyncOptions {
  /** Активен runway-режим на PDP. */
  enabled: boolean;
  activeSection: number;
  sectionCount: number;
  /** Slug товара — для sessionStorage последней секции. */
  productSlug?: string;
  /** Перейти к секции (из deep link). */
  jumpToSection: (index: number, options?: { skipNotify?: boolean }) => void;
  /** Debounce записи section в URL, мс. */
  debounceMs?: number;
}

/**
 * Синхронизация ?view=runway&section=N ↔ активная секция switcher.
 * replaceState — без засорения history при скролле.
 * sessionStorage — возврат к последнему варианту в сессии.
 */
export function useScrollExperienceUrlSync({
  enabled,
  activeSection,
  sectionCount,
  productSlug,
  jumpToSection,
  debounceMs = 280,
}: UseScrollExperienceUrlSyncOptions): void {
  const initialApplied = useRef(false);
  const writeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!enabled || typeof window === 'undefined' || initialApplied.current) return;

    const params = new URLSearchParams(window.location.search);
    if (params.get('view') !== 'runway') {
      initialApplied.current = true;
      return;
    }

    if (sectionCount < 1) return;

    const raw = params.get('section');
    if (raw != null) {
      const parsed = Number.parseInt(raw, 10);
      if (Number.isFinite(parsed)) {
        const safe = Math.min(Math.max(parsed, 0), sectionCount - 1);
        jumpToSection(safe, { skipNotify: false });
      }
      initialApplied.current = true;
      return;
    }

    if (productSlug) {
      const stored = getRunwayStoredSection(productSlug);
      if (stored != null) {
        const safe = Math.min(Math.max(stored, 0), sectionCount - 1);
        jumpToSection(safe, { skipNotify: false });
      }
    }

    initialApplied.current = true;
  }, [enabled, sectionCount, jumpToSection, productSlug]);

  const syncSectionToUrl = useCallback(
    (section: number) => {
      if (!enabled || typeof window === 'undefined') return;

      const url = new URL(window.location.href);
      if (url.searchParams.get('view') !== 'runway') {
        url.searchParams.set('view', 'runway');
      }
      url.searchParams.set('section', String(section));
      window.history.replaceState(null, '', url.toString());

      if (productSlug) setRunwayStoredSection(productSlug, section);
    },
    [enabled, productSlug]
  );

  useEffect(() => {
    if (!enabled || !initialApplied.current) return;

    if (writeTimer.current) clearTimeout(writeTimer.current);
    writeTimer.current = setTimeout(() => {
      syncSectionToUrl(activeSection);
    }, debounceMs);

    return () => {
      if (writeTimer.current) clearTimeout(writeTimer.current);
    };
  }, [enabled, activeSection, debounceMs, syncSectionToUrl]);

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    const onPopState = () => {
      const params = new URLSearchParams(window.location.search);
      if (params.get('view') !== 'runway') return;
      const raw = params.get('section');
      if (raw == null) return;
      const parsed = Number.parseInt(raw, 10);
      if (!Number.isFinite(parsed)) return;
      const safe = Math.min(Math.max(parsed, 0), Math.max(0, sectionCount - 1));
      jumpToSection(safe, { skipNotify: false });
    };

    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [enabled, sectionCount, jumpToSection]);
}

/** Ссылка для шаринга runway с deep link на секцию. */
export function buildRunwayShareUrl(
  productSlug: string,
  sectionIndex: number,
  origin?: string
): string {
  const base = origin ?? (typeof window !== 'undefined' ? window.location.origin : '');
  const url = new URL(`/products/${productSlug}`, base);
  url.searchParams.set('view', 'runway');
  url.searchParams.set('section', String(sectionIndex));
  return url.toString();
}
