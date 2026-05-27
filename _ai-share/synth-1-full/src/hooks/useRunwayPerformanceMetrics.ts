'use client';

import { useCallback, useEffect, useRef } from 'react';
import { trackScrollExperienceEvent } from '@/lib/scroll-experience-analytics';

export interface RunwayPerformanceSample {
  kind: 'section_change' | 'video_load';
  productSlug: string;
  sectionIndex?: number;
  durationMs: number;
  at: string;
}

interface UseRunwayPerformanceMetricsOptions {
  productSlug: string;
  activeSection: number;
  videoReady: boolean;
  enabled?: boolean;
}

const DEV_LOG_PREFIX = '[runway-perf]';

/**
 * Dev-observability: latency смены секции и загрузки видео.
 * Пишет в console + dataLayer (если есть) — без внешних SDK.
 */
export function useRunwayPerformanceMetrics({
  productSlug,
  activeSection,
  videoReady,
  enabled = process.env.NODE_ENV === 'development',
}: UseRunwayPerformanceMetricsOptions) {
  const sectionChangeStartedRef = useRef<number | null>(null);
  const prevSectionRef = useRef(activeSection);
  const videoLoadStartedRef = useRef<number | null>(null);
  const videoReadyRef = useRef(videoReady);

  const emit = useCallback(
    (sample: Omit<RunwayPerformanceSample, 'at'>) => {
      if (!enabled) return;
      const payload: RunwayPerformanceSample = {
        ...sample,
        at: new Date().toISOString(),
      };
      if (typeof window !== 'undefined') {
        window.dataLayer?.push({
          event: 'runway_performance',
          ...payload,
        });
      }
      console.debug(DEV_LOG_PREFIX, payload);
    },
    [enabled]
  );

  const markSectionChangeStart = useCallback(() => {
    sectionChangeStartedRef.current = performance.now();
  }, []);

  useEffect(() => {
    if (prevSectionRef.current === activeSection) return;
    const started = sectionChangeStartedRef.current;
    if (started != null) {
      emit({
        kind: 'section_change',
        productSlug,
        sectionIndex: activeSection,
        durationMs: Math.round(performance.now() - started),
      });
      sectionChangeStartedRef.current = null;
    }
    prevSectionRef.current = activeSection;
  }, [activeSection, emit, productSlug]);

  useEffect(() => {
    if (videoReady && !videoReadyRef.current && videoLoadStartedRef.current != null) {
      emit({
        kind: 'video_load',
        productSlug,
        sectionIndex: activeSection,
        durationMs: Math.round(performance.now() - videoLoadStartedRef.current),
      });
      videoLoadStartedRef.current = null;
    }
    if (!videoReady && videoReadyRef.current) {
      videoLoadStartedRef.current = performance.now();
    }
    videoReadyRef.current = videoReady;
  }, [videoReady, activeSection, emit, productSlug]);

  useEffect(() => {
    if (!videoReady && videoLoadStartedRef.current == null) {
      videoLoadStartedRef.current = performance.now();
    }
  }, [activeSection, videoReady]);

  return { markSectionChangeStart };
}
