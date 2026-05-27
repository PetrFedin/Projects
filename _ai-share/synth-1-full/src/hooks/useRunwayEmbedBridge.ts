'use client';

import { useEffect, useRef } from 'react';
import {
  buildRunwayEmbedReadyMessages,
  buildRunwayEmbedResizeMessages,
  type RunwayEmbedPostMessage,
} from '@/lib/runway/runway-embed-messages';

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

const RESIZE_DEBOUNCE_MS = 120;

function postToParent(message: RunwayEmbedPostMessage): void {
  if (typeof window === 'undefined' || window.parent === window) return;
  window.parent.postMessage(message, '*');
}

function postAll(messages: RunwayEmbedPostMessage[]): void {
  for (const message of messages) {
    postToParent(message);
  }
}

/**
 * iframe contract: ready signal + optional auto-resize для partner embeds.
 * Debounced resize при смене секции / layout shift.
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
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!ready || readySentRef.current) return;
    readySentRef.current = true;
    postAll(buildRunwayEmbedReadyMessages(slug));
  }, [ready, slug]);

  useEffect(() => {
    if (!resizeEnabled || !ready) return;

    const measure = () => {
      const el = measureRef?.current ?? document.documentElement;
      const height = Math.ceil(el.getBoundingClientRect().height);
      if (height <= 0 || height === lastHeightRef.current) return;
      lastHeightRef.current = height;
      postAll(buildRunwayEmbedResizeMessages(height, slug, activeSection));
    };

    const scheduleMeasure = () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        debounceRef.current = null;
        measure();
      }, RESIZE_DEBOUNCE_MS);
    };

    scheduleMeasure();
    const ro =
      typeof ResizeObserver !== 'undefined' ? new ResizeObserver(() => scheduleMeasure()) : null;
    const target = measureRef?.current ?? document.body;
    ro?.observe(target);
    window.addEventListener('resize', scheduleMeasure);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      ro?.disconnect();
      window.removeEventListener('resize', scheduleMeasure);
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

/** Начальная секция из ?section=N (0-based, clamped). */
export function parseRunwayEmbedSectionIndex(
  raw: string | null | undefined,
  sectionCount: number
): number | undefined {
  if (raw == null || raw.trim() === '') return undefined;
  const parsed = Number.parseInt(raw, 10);
  if (!Number.isFinite(parsed) || sectionCount <= 0) return undefined;
  return Math.min(sectionCount - 1, Math.max(0, parsed));
}

/** ?compact=1 (default embed) vs compact=0 (full chrome). */
export function resolveRunwayEmbedCompact(raw: string | null | undefined): boolean {
  if (raw === '0' || raw === 'false') return false;
  return true;
}
