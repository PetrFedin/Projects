'use client';

import { useEffect, useRef } from 'react';
import {
  buildRunwayLcpHeroPayload,
  resolveRunwayLcpSampleRate,
  shouldSampleRunwayLcp,
} from '@/lib/runway/runway-lcp';
import { trackScrollExperienceEvent } from '@/lib/scroll-experience-analytics';

interface UseRunwayLcpHeroOptions {
  productSlug: string;
  /** Активная секция — LCP только для section 0. */
  activeSection: number;
  /** Hero video metadata/loaded или poster paint без видео. */
  heroMediaReady: boolean;
  enabled?: boolean;
}

/**
 * Отправляет runway_lcp_hero один раз за сессию SKU при готовности hero media.
 */
export function useRunwayLcpHero({
  productSlug,
  activeSection,
  heroMediaReady,
  enabled = true,
}: UseRunwayLcpHeroOptions): void {
  const sentRef = useRef(false);

  useEffect(() => {
    if (!enabled || sentRef.current || activeSection !== 0 || !heroMediaReady) return;

    const sampleRate = resolveRunwayLcpSampleRate();
    if (!shouldSampleRunwayLcp(productSlug, sampleRate)) {
      sentRef.current = true;
      return;
    }

    const payload = buildRunwayLcpHeroPayload(productSlug);
    trackScrollExperienceEvent('runway_lcp_hero', {
      productSlug,
      msSinceNavigation: payload.msSinceNavigation,
      connectionType: payload.connectionType,
      sectionIndex: 0,
    });
    sentRef.current = true;
  }, [enabled, productSlug, activeSection, heroMediaReady]);
}
