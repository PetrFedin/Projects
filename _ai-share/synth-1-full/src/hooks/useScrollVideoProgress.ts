'use client';

import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';
import {
  RUNWAY_BASE_VIRTUAL_DURATION_SEC,
  RUNWAY_SCROLL_LERP,
  RUNWAY_SCROLL_SNAP_IDLE_MS,
  RUNWAY_SCROLL_SPRING,
  RUNWAY_SCROLL_VELOCITY_DAMPING,
  RUNWAY_SCROLL_VELOCITY_MAX,
  RUNWAY_VIDEO_SEEK_DEBOUNCE_MS,
} from '@/lib/scroll-switcher-constants';
import {
  applyVelocityDelta,
  lerpToward,
  resolveSnapTargetProgress,
  sectionMidpoint,
} from '@/lib/scroll-switcher-math';
import { useVideoFrameSync } from '@/hooks/useVideoFrameSync';
import type { ScrollExperienceInteractionType } from '@/lib/scroll-experience-analytics';
import { triggerRunwaySectionHaptic } from '@/lib/runway/runway-haptic';

const BASE_VIRTUAL_DURATION_SEC = RUNWAY_BASE_VIRTUAL_DURATION_SEC;
const LERP = RUNWAY_SCROLL_LERP;

export interface UseScrollVideoProgressOptions {
  enabled: boolean;
  /** Колесо мыши — только когда switcher в viewport (IntersectionObserver снаружи). */
  wheelEnabled?: boolean;
  sectionCount: number;
  containerRef: RefObject<HTMLElement | null>;
  videoRef: RefObject<HTMLVideoElement | null>;
  hasVideo: boolean;
  prefersReducedMotion?: boolean;
  /** Spring-lerp + easeOutCubic вместо линейного (luxury scrub). */
  useSpringLerp?: boolean;
  /** Snap к середине секции после остановки колеса. */
  enableSnapOnIdle?: boolean;
  /** Внешний индекс секции (синхронизация с PDP color picker). */
  controlledSectionIndex?: number;
  /** Множитель чувствительности колеса 0.5–2 (user prefs). */
  scrollSensitivityMultiplier?: number;
  onSectionChange?: (index: number, interactionType?: ScrollExperienceInteractionType) => void;
}

export interface UseScrollVideoProgressResult {
  /** Нормализованный прогресс 0–1 (сглаженный). */
  progress: number;
  activeSection: number;
  jumpToSection: (
    index: number,
    options?: { skipNotify?: boolean; interactionType?: ScrollExperienceInteractionType }
  ) => void;
  /** Плавный переход к прогрессу (auto-tour). */
  animateToProgress: (target: number) => void;
  handleTouchStart: (clientY: number) => void;
  handleTouchMove: (clientY: number) => void;
  handleTouchEnd: () => void;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function resolveWheelSensitivity(
  video: HTMLVideoElement | null,
  hasVideo: boolean,
  prefersReducedMotion: boolean
): number {
  if (prefersReducedMotion) return 0.0025;
  const duration =
    hasVideo && video && Number.isFinite(video.duration) && video.duration > 0
      ? video.duration
      : BASE_VIRTUAL_DURATION_SEC;
  return 1 / (duration * 900);
}

/**
 * Scroll / touch / keyboard-driven прогресс runway-видео или цветовых секций.
 */
export function useScrollVideoProgress({
  enabled,
  wheelEnabled = true,
  sectionCount,
  containerRef,
  videoRef,
  hasVideo,
  prefersReducedMotion = false,
  useSpringLerp = false,
  enableSnapOnIdle = true,
  controlledSectionIndex,
  scrollSensitivityMultiplier = 1,
  onSectionChange,
}: UseScrollVideoProgressOptions): UseScrollVideoProgressResult {
  const targetProgress = useRef(0);
  const scrollProgress = useRef(0);
  const wheelVelocity = useRef(0);
  const touchStartY = useRef<number | null>(null);
  const touchActiveRef = useRef(false);
  const isTabVisible = useRef(true);
  const lastReportedSection = useRef(-1);
  const activeSectionRef = useRef(0);
  const seekTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const snapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingSeekRef = useRef<number | null>(null);
  const [progress, setProgress] = useState(0);
  const [activeSection, setActiveSection] = useState(0);

  const { scheduleSeekToProgress, cancelPendingSeek } = useVideoFrameSync({
    videoRef,
    enabled: hasVideo,
    prefersReducedMotion,
  });

  const scheduleSnap = useCallback(() => {
    if (!enableSnapOnIdle || prefersReducedMotion || sectionCount < 1) return;
    if (snapTimerRef.current) clearTimeout(snapTimerRef.current);
    snapTimerRef.current = setTimeout(() => {
      const snapTarget = resolveSnapTargetProgress(targetProgress.current, sectionCount);
      targetProgress.current = snapTarget;
    }, RUNWAY_SCROLL_SNAP_IDLE_MS);
  }, [enableSnapOnIdle, prefersReducedMotion, sectionCount]);

  const applyVideoSeek = useCallback(
    (progressValue: number, immediate = false) => {
      if (!hasVideo) return;
      scheduleSeekToProgress(progressValue, immediate);
      if (!immediate) {
        pendingSeekRef.current = progressValue;
        if (seekTimerRef.current) clearTimeout(seekTimerRef.current);
        seekTimerRef.current = setTimeout(() => {
          scheduleSeekToProgress(progressValue, true);
          pendingSeekRef.current = null;
        }, RUNWAY_VIDEO_SEEK_DEBOUNCE_MS);
      } else {
        pendingSeekRef.current = null;
      }
    },
    [hasVideo, scheduleSeekToProgress]
  );

  const jumpToSection = useCallback(
    (
      index: number,
      options?: { skipNotify?: boolean; interactionType?: ScrollExperienceInteractionType }
    ) => {
      const safeIndex = clamp(index, 0, Math.max(0, sectionCount - 1));
      const midpoint = sectionMidpoint(safeIndex, sectionCount);
      targetProgress.current = midpoint;
      scrollProgress.current = midpoint;
      activeSectionRef.current = safeIndex;
      setProgress(midpoint);
      setActiveSection(safeIndex);

      applyVideoSeek(midpoint, true);

      if (!options?.skipNotify && lastReportedSection.current !== safeIndex) {
        lastReportedSection.current = safeIndex;
        onSectionChange?.(safeIndex, options?.interactionType);
      } else if (options?.skipNotify) {
        lastReportedSection.current = safeIndex;
      }
    },
    [sectionCount, applyVideoSeek, onSectionChange]
  );

  const animateToProgress = useCallback((target: number) => {
    targetProgress.current = clamp(target, 0, 1);
  }, []);

  const lastControlledSectionRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (controlledSectionIndex == null || sectionCount < 1) return;
    if (lastControlledSectionRef.current === controlledSectionIndex) return;

    const prevControlled = lastControlledSectionRef.current;
    lastControlledSectionRef.current = controlledSectionIndex;

    // Deep link / stored section могут выставить activeSection до sync цвета PDP (controlled=0).
    if (
      prevControlled === undefined &&
      controlledSectionIndex === 0 &&
      activeSectionRef.current !== 0
    ) {
      return;
    }

    if (controlledSectionIndex === activeSectionRef.current) return;
    jumpToSection(controlledSectionIndex, { skipNotify: true });
  }, [controlledSectionIndex, sectionCount, jumpToSection]);

  useEffect(() => {
    const onVisibility = () => {
      isTabVisible.current = document.visibilityState === 'visible';
    };
    onVisibility();
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  useEffect(() => {
    if (!enabled || sectionCount < 1) return;

    let raf = 0;
    const tick = () => {
      if (isTabVisible.current) {
        if (prefersReducedMotion) {
          scrollProgress.current = targetProgress.current;
        } else if (useSpringLerp && RUNWAY_SCROLL_SPRING > 0) {
          const delta = targetProgress.current - scrollProgress.current;
          scrollProgress.current += delta * RUNWAY_SCROLL_SPRING + delta * LERP * 0.5;
          scrollProgress.current = lerpToward(
            scrollProgress.current,
            targetProgress.current,
            LERP,
            true
          );
        } else {
          scrollProgress.current = lerpToward(
            scrollProgress.current,
            targetProgress.current,
            LERP,
            true
          );
        }

        if (!prefersReducedMotion && Math.abs(wheelVelocity.current) > 0.0001) {
          targetProgress.current = clamp(targetProgress.current + wheelVelocity.current, 0, 1);
          wheelVelocity.current *= RUNWAY_SCROLL_VELOCITY_DAMPING;
        }

        const p = clamp(scrollProgress.current, 0, 1);
        setProgress(p);

        const section = clamp(Math.floor(p * sectionCount), 0, sectionCount - 1);
        activeSectionRef.current = section;
        setActiveSection(section);

        if (lastReportedSection.current !== section) {
          lastReportedSection.current = section;
          const interactionType: ScrollExperienceInteractionType = touchActiveRef.current
            ? 'touch'
            : 'wheel';
          if (touchActiveRef.current) {
            triggerRunwaySectionHaptic();
          }
          onSectionChange?.(section, interactionType);
        }

        applyVideoSeek(p);
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      if (seekTimerRef.current) clearTimeout(seekTimerRef.current);
      if (snapTimerRef.current) clearTimeout(snapTimerRef.current);
      cancelPendingSeek();
    };
  }, [
    enabled,
    sectionCount,
    hasVideo,
    videoRef,
    prefersReducedMotion,
    useSpringLerp,
    onSectionChange,
    applyVideoSeek,
    cancelPendingSeek,
  ]);

  useEffect(() => {
    const el = containerRef.current;
    if (!enabled || !el || !wheelEnabled) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const sensitivity =
        resolveWheelSensitivity(videoRef.current, hasVideo, prefersReducedMotion) *
        scrollSensitivityMultiplier;
      const rawDelta = e.deltaY * sensitivity;
      const scaledDelta = applyVelocityDelta(rawDelta, e.deltaY, RUNWAY_SCROLL_VELOCITY_MAX);
      targetProgress.current = clamp(targetProgress.current + scaledDelta, 0, 1);
      if (!prefersReducedMotion) {
        wheelVelocity.current = clamp(
          wheelVelocity.current + scaledDelta * 0.35,
          -RUNWAY_SCROLL_VELOCITY_MAX,
          RUNWAY_SCROLL_VELOCITY_MAX
        );
      }
      scheduleSnap();
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [
    enabled,
    wheelEnabled,
    containerRef,
    videoRef,
    hasVideo,
    prefersReducedMotion,
    scrollSensitivityMultiplier,
    scheduleSnap,
  ]);

  const handleTouchStart = useCallback((clientY: number) => {
    touchStartY.current = clientY;
    touchActiveRef.current = true;
  }, []);

  const handleTouchMove = useCallback(
    (clientY: number) => {
      if (touchStartY.current === null) return;
      const delta = touchStartY.current - clientY;
      touchStartY.current = clientY;
      const sensitivity =
        resolveWheelSensitivity(videoRef.current, hasVideo, prefersReducedMotion) *
        scrollSensitivityMultiplier;
      const scaledDelta = applyVelocityDelta(
        delta * sensitivity * 2.5,
        delta,
        RUNWAY_SCROLL_VELOCITY_MAX
      );
      targetProgress.current = clamp(targetProgress.current + scaledDelta, 0, 1);
      scheduleSnap();
    },
    [videoRef, hasVideo, prefersReducedMotion, scrollSensitivityMultiplier, scheduleSnap]
  );

  const handleTouchEnd = useCallback(() => {
    touchStartY.current = null;
    touchActiveRef.current = false;
    scheduleSnap();
  }, [scheduleSnap]);

  return {
    progress,
    activeSection,
    jumpToSection,
    animateToProgress,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  };
}
