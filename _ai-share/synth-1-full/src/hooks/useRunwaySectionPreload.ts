'use client';

import { useCallback, useEffect, useRef } from 'react';
import type { RunwaySectionViewModel } from '@/lib/product-scroll-switcher';

const preloadedVideos = new Set<string>();
const preloadedImages = new Set<string>();

/** Metadata preload через video element — link[as=video] не поддерживается браузерами. */
function preloadVideoUrl(url: string) {
  if (!url || preloadedVideos.has(url) || typeof document === 'undefined') return;
  preloadedVideos.add(url);
  const video = document.createElement('video');
  video.preload = 'metadata';
  video.muted = true;
  video.playsInline = true;
  video.setAttribute('playsinline', '');
  video.setAttribute('webkit-playsinline', '');
  video.src = url;
  // load() без append в DOM — metadata preload без layout/paint warnings
  video.load();
}

function preloadImageUrl(url: string) {
  if (!url || preloadedImages.has(url)) return;
  preloadedImages.add(url);
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = url;
  document.head.appendChild(link);
}

export interface UseRunwaySectionPreloadOptions {
  sections: RunwaySectionViewModel[];
  enabled?: boolean;
}

/**
 * Preload соседних секций при hover на thumb (OSS-паттерн luxury PDP).
 */
export function useRunwaySectionPreload({
  sections,
  enabled = true,
}: UseRunwaySectionPreloadOptions) {
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const preloadSection = useCallback(
    (index: number) => {
      if (!enabled) return;
      const section = sections[index];
      if (!section) return;

      const mp4 = section.videoSources?.mp4;
      const webm = section.videoSources?.webm;
      if (mp4) preloadVideoUrl(mp4);
      if (webm) preloadVideoUrl(webm);
      if (section.heroUrl) preloadImageUrl(section.heroUrl);
      if (section.thumbUrl) preloadImageUrl(section.thumbUrl);
    },
    [enabled, sections]
  );

  const onThumbHover = useCallback(
    (index: number) => {
      if (!enabled) return;
      if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = setTimeout(() => {
        preloadSection(index);
        preloadSection(Math.max(0, index - 1));
        preloadSection(Math.min(sections.length - 1, index + 1));
      }, 80);
    },
    [enabled, preloadSection, sections.length]
  );

  const onThumbHoverEnd = useCallback(() => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
  }, []);

  useEffect(
    () => () => {
      if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    },
    []
  );

  return { onThumbHover, onThumbHoverEnd, preloadSection };
}
