'use client';

import { useEffect, useState } from 'react';
import { shouldShowRunwayStickyBar } from '@/lib/runway-sticky-visibility';

export interface UseRunwayStickyVisibilityOptions {
  /** Включить только в runway-режиме PDP. */
  enabled: boolean;
  /** ref контейнера switcher — когда уходит вверх из viewport, показываем bar. */
  switcherRef: React.RefObject<HTMLElement | null>;
  /** Якорь #details — когда виден, bar тоже уместен. */
  detailsAnchorId?: string;
}

/**
 * Показывает sticky runway bar после прокрутки мимо switcher (runway PDP).
 */
export function useRunwayStickyVisibility({
  enabled,
  switcherRef,
  detailsAnchorId = 'details',
}: UseRunwayStickyVisibilityOptions): boolean {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!enabled) {
      setVisible(false);
      return;
    }

    const switcher = switcherRef.current;
    const details = document.getElementById(detailsAnchorId);

    const update = () => {
      const switcherRect = switcher?.getBoundingClientRect();
      const detailsRect = details?.getBoundingClientRect();
      setVisible(
        shouldShowRunwayStickyBar({
          enabled: true,
          switcherBottom: switcherRect?.bottom ?? 9999,
          detailsTop: detailsRect?.top ?? 9999,
          viewportHeight: window.innerHeight,
        })
      );
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update, { passive: true });

    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [enabled, switcherRef, detailsAnchorId]);

  return visible;
}
