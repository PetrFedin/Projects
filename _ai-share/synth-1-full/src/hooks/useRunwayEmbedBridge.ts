'use client';

import { useEffect, useRef } from 'react';

export type RunwayEmbedPostMessage =
  | { type: 'data-runway-embed-ready'; slug: string }
  | { type: 'runway-embed-resize'; height: number; slug: string; sectionIndex?: number };

interface UseRunwayEmbedBridgeOptions {
  slug: string;
  /** Experience loaded (product + stage ready). */
  ready: boolean;
  /** ?resize=1 — postMessage height on section/layout change. */
  resizeEnabled?: boolean;
  activeSection?: number;
  /** Root element to measure for resize messages. */
  measureRef?: React.RefObject<HTMLElement | null>;
}

function postToParent(message: RunwayEmbedPostMessage): void {
  if (typeof window === 'undefined' || window.parent === window) return;
  window.parent.postMessage(message, '*');
}

/**
 * iframe contract: ready signal + optional auto-resize для partner embeds.
 */
export function useRunwayEmbedBridge({
  slug,
  ready,
  resizeEnabled = false,
  activeSection = 0,
  measureRef,
}: UseRunwayEmbedBridgeOptions): void {
  const readySentRef = useRef(false);
  const lastHeightRef = useRef(0);

  useEffect(() => {
    if (!ready || readySentRef.current) return;
    readySentRef.current = true;
    postToParent({ type: 'data-runway-embed-ready', slug });
  }, [ready, slug]);

  useEffect(() => {
    if (!resizeEnabled || !ready) return;

    const measure = () => {
      const el = measureRef?.current ?? document.documentElement;
      const height = Math.ceil(el.getBoundingClientRect().height);
      if (height <= 0 || height === lastHeightRef.current) return;
      lastHeightRef.current = height;
      postToParent({
        type: 'runway-embed-resize',
        height,
        slug,
        sectionIndex: activeSection,
      });
    };

    measure();
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(() => measure()) : null;
    const target = measureRef?.current ?? document.body;
    ro?.observe(target);
    window.addEventListener('resize', measure);

    return () => {
      ro?.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [resizeEnabled, ready, slug, activeSection, measureRef]);
}

/** Парсинг aspect из query (?aspect=16:9 | 4:5). */
export function parseRunwayEmbedAspectRatio(raw: string | null | undefined): string {
  const value = raw?.trim();
  if (!value) return '4 / 5';
  const normalized = value.replace(':', '/').replace(/\s+/g, '');
  if (/^\d+\/\d+$/.test(normalized)) {
    const [w, h] = normalized.split('/').map(Number);
    if (w > 0 && h > 0) return `${w} / ${h}`;
  }
  if (value === '16:9' || value === '16/9') return '16 / 9';
  return '4 / 5';
}
