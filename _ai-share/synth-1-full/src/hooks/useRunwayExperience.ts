'use client';

import { useCallback, useEffect, useMemo, useState, type RefObject } from 'react';
import type { ColorInfo, Product, ProductScrollSwitcherSection } from '@/lib/types';
import { useProductRunwayState } from '@/hooks/useProductRunwayState';
import { useScrollVideoProgress } from '@/hooks/useScrollVideoProgress';
import { useScrollExperienceUrlSync } from '@/hooks/useScrollExperienceUrlSync';
import { useRunwayAutoTour } from '@/hooks/useRunwayAutoTour';
import { useRunwayUserPreferences } from '@/hooks/useRunwayUserPreferences';
import {
  getRunwayFavoriteSection,
  useRunwaySectionFavorites,
} from '@/hooks/useRunwaySectionFavorites';
import { useScrollExperienceConfig } from '@/hooks/useScrollExperienceConfig';
import { getRunwayStoredSection } from '@/hooks/useRunwaySectionPersistence';
import type { ScrollExperienceInteractionType } from '@/lib/scroll-experience-analytics';

export interface UseRunwayExperienceOptions {
  product: Product;
  activeColor?: ColorInfo | null;
  onColorChange?: (colorName: string) => void;
  controlledSectionIndex?: number;
  onSectionChange?: (index: number, section: ProductScrollSwitcherSection) => void;
  /** Wheel/touch scroll progress. */
  containerRef: RefObject<HTMLElement | null>;
  videoRef: RefObject<HTMLVideoElement | null>;
  enabled?: boolean;
  wheelEnabled?: boolean;
  canUseVideo?: boolean;
  videoReady?: boolean;
  systemPrefersReducedMotion?: boolean;
  usesPerSectionVideo?: boolean;
  syncUrl?: boolean;
  compact?: boolean;
  isDemoMode?: boolean;
  /** @deprecated — используйте isDemoMode. */
  showAutoTour?: boolean;
  /** Восстановить favorite секцию при первом mount. */
  restoreFavoriteSection?: boolean;
}

/**
 * Единый hook runway — VM, scroll progress, URL sync, auto-tour, user prefs.
 * Сокращает props/state в ProductScrollSwitcher.
 */
export function useRunwayExperience({
  product,
  activeColor,
  onColorChange,
  controlledSectionIndex,
  onSectionChange,
  containerRef,
  videoRef,
  enabled = true,
  wheelEnabled = false,
  canUseVideo = false,
  videoReady = false,
  systemPrefersReducedMotion = false,
  usesPerSectionVideo = false,
  syncUrl = false,
  compact = false,
  isDemoMode = false,
  showAutoTour: showAutoTourProp = false,
  restoreFavoriteSection = true,
}: UseRunwayExperienceOptions) {
  const scrollConfig = useScrollExperienceConfig();
  const showAutoTour =
    isDemoMode ||
    showAutoTourProp ||
    Boolean(scrollConfig.features?.autoTour ?? scrollConfig.enableAutoTour);
  const { prefs: userPrefs } = useRunwayUserPreferences();
  const favorites = useRunwaySectionFavorites(product.slug);

  const prefersReducedMotion = userPrefs.reducedMotionOverride ?? systemPrefersReducedMotion;

  const runwayState = useProductRunwayState({
    product,
    activeColor,
    onColorChange,
  });

  const [initialSectionRestored, setInitialSectionRestored] = useState(false);

  const handleProgressSectionChange = useCallback(
    (index: number, interactionType?: ScrollExperienceInteractionType) => {
      const section = runwayState.sections[index];
      if (section) onSectionChange?.(index, section);
    },
    [onSectionChange, runwayState.sections]
  );

  const scrollProgress = useScrollVideoProgress({
    enabled: enabled && runwayState.enabled,
    wheelEnabled,
    sectionCount: runwayState.sections.length,
    containerRef,
    videoRef,
    hasVideo:
      canUseVideo &&
      videoReady &&
      !prefersReducedMotion &&
      !usesPerSectionVideo &&
      userPrefs.ambientVideoEnabled,
    prefersReducedMotion,
    useSpringLerp: scrollConfig.enableScrollSpring ?? false,
    enableSnapOnIdle: true,
    controlledSectionIndex,
    scrollSensitivityMultiplier: userPrefs.scrollSensitivity,
    onSectionChange: handleProgressSectionChange,
  });

  const handleAutoTourJump = useCallback(
    (index: number) => {
      scrollProgress.jumpToSection(index, { interactionType: 'keyboard' });
    },
    [scrollProgress]
  );

  const autoTour = useRunwayAutoTour({
    sectionCount: runwayState.sections.length,
    enabled: showAutoTour && enabled && !compact,
    onJumpToSection: handleAutoTourJump,
  });

  useScrollExperienceUrlSync({
    enabled: syncUrl && enabled,
    activeSection: scrollProgress.activeSection,
    sectionCount: runwayState.sections.length,
    productSlug: product.slug,
    jumpToSection: scrollProgress.jumpToSection,
  });

  /** Восстановление секции: URL ?section=N > favorite > sessionStorage. */
  useEffect(() => {
    if (!enabled || !restoreFavoriteSection || initialSectionRestored) return;

    const params =
      typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    const urlSection = params?.get('section');
    if (syncUrl && params?.get('view') === 'runway' && urlSection != null) {
      // Deep link ?section=N обрабатывает useScrollExperienceUrlSync (с notify для sync цвета).
      if (runwayState.sections.length > 0) {
        setInitialSectionRestored(true);
      }
      return;
    }

    const favorite = getRunwayFavoriteSection(product.slug);
    if (favorite != null && runwayState.sections.length > 0) {
      const safe = Math.min(Math.max(favorite, 0), runwayState.sections.length - 1);
      scrollProgress.jumpToSection(safe, { skipNotify: true });
      setInitialSectionRestored(true);
      return;
    }

    const stored = getRunwayStoredSection(product.slug);
    if (stored != null && runwayState.sections.length > 0) {
      const safe = Math.min(Math.max(stored, 0), runwayState.sections.length - 1);
      scrollProgress.jumpToSection(safe, { skipNotify: true });
    }
    setInitialSectionRestored(true);
  }, [
    enabled,
    restoreFavoriteSection,
    initialSectionRestored,
    syncUrl,
    product.slug,
    runwayState.sections.length,
    scrollProgress,
  ]);

  const sectionLabels = useMemo(
    () => runwayState.sections.map((s) => s.label),
    [runwayState.sections]
  );

  return {
    scrollConfig,
    userPrefs,
    favorites,
    prefersReducedMotion,
    runwayState,
    viewModel: runwayState.viewModel,
    sections: runwayState.sections,
    sectionLabels,
    progress: scrollProgress.progress,
    activeSection: scrollProgress.activeSection,
    jumpToSection: scrollProgress.jumpToSection,
    handleTouchStart: scrollProgress.handleTouchStart,
    handleTouchMove: scrollProgress.handleTouchMove,
    handleTouchEnd: scrollProgress.handleTouchEnd,
    autoTour,
    selectSection: useCallback(
      (index: number, interactionType: ScrollExperienceInteractionType) => {
        scrollProgress.jumpToSection(index, { interactionType });
      },
      [scrollProgress]
    ),
  };
}
