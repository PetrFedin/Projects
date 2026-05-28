'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  advanceAutoTour,
  resetAutoTour,
  sectionMidpoint,
  startAutoTour,
  type AutoTourState,
} from '@/lib/scroll-switcher-math';
import { RUNWAY_AUTO_TOUR_DURATION_MS } from '@/lib/scroll-switcher-constants';

export interface UseRunwayAutoTourOptions {
  sectionCount: number;
  enabled: boolean;
  onJumpToSection: (index: number) => void;
  durationMs?: number;
}

export interface UseRunwayAutoTourResult {
  isRunning: boolean;
  isComplete: boolean;
  startTour: () => void;
  stopTour: () => void;
}

/**
 * Investor auto-tour: равномерный проход по секциям за ~8 секунд.
 */
export function useRunwayAutoTour({
  sectionCount,
  enabled,
  onJumpToSection,
  durationMs = RUNWAY_AUTO_TOUR_DURATION_MS,
}: UseRunwayAutoTourOptions): UseRunwayAutoTourResult {
  const [state, setState] = useState<AutoTourState>(resetAutoTour());
  const lastSectionRef = useRef(-1);
  const rafRef = useRef(0);
  const lastTickRef = useRef(0);

  const stopTour = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = 0;
    lastSectionRef.current = -1;
    setState(resetAutoTour());
  }, []);

  const startTour = useCallback(() => {
    if (!enabled || sectionCount < 1) return;
    lastSectionRef.current = -1;
    lastTickRef.current = performance.now();
    setState(startAutoTour());
    onJumpToSection(0);
  }, [enabled, sectionCount, onJumpToSection]);

  useEffect(() => {
    if (state.phase !== 'running' || !enabled) return;

    const tick = (now: number) => {
      const delta = now - lastTickRef.current;
      lastTickRef.current = now;

      let sectionToJump: number | null = null;
      setState((prev) => {
        const next = advanceAutoTour(prev, delta, sectionCount, durationMs);
        if (next.targetSection !== lastSectionRef.current) {
          lastSectionRef.current = next.targetSection;
          sectionToJump = next.targetSection;
        }
        return next;
      });

      // Нельзя вызывать onJumpToSection внутри setState updater — это триггерит PDP color sync
      // (UIStateProvider) во время commit другого компонента.
      if (sectionToJump !== null) {
        onJumpToSection(sectionToJump);
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [state.phase, enabled, sectionCount, durationMs, onJumpToSection]);

  return {
    isRunning: state.phase === 'running',
    isComplete: state.phase === 'complete',
    startTour,
    stopTour,
  };
}

/** Целевой прогресс для плавной анимации auto-tour (midpoint секции). */
export function autoTourTargetProgress(sectionIndex: number, sectionCount: number): number {
  return sectionMidpoint(sectionIndex, sectionCount);
}
