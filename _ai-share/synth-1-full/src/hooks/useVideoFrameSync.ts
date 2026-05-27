'use client';

import { useCallback, useEffect, useRef, type RefObject } from 'react';
import { RUNWAY_VIDEO_SEEK_THRESHOLD_SEC } from '@/lib/scroll-switcher-constants';

type VideoFrameRequestCallback = (
  now: DOMHighResTimeStamp,
  metadata: VideoFrameCallbackMetadata
) => void;

type VideoWithRvfc = HTMLVideoElement & {
  requestVideoFrameCallback?: (callback: VideoFrameRequestCallback) => number;
  cancelVideoFrameCallback?: (handle: number) => void;
};

export interface UseVideoFrameSyncOptions {
  videoRef: RefObject<HTMLVideoElement | null>;
  /** Активен scrub одного ролика (не per-section crossfade). */
  enabled: boolean;
  prefersReducedMotion?: boolean;
}

export interface UseVideoFrameSyncResult {
  /** Запланировать seek к нормализованному прогрессу 0–1 (с rVFC или fallback). */
  scheduleSeekToProgress: (progress: number, immediate?: boolean) => void;
  cancelPendingSeek: () => void;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function supportsRvfc(video: HTMLVideoElement | null): video is VideoWithRvfc {
  return Boolean(video && 'requestVideoFrameCallback' in video);
}

/**
 * Синхронизация seek видео с кадровым compositor (requestVideoFrameCallback).
 * Паттерн из WICG/video-rvfc и scroll-video OSS: точнее, чем только setTimeout + rAF.
 */
export function useVideoFrameSync({
  videoRef,
  enabled,
  prefersReducedMotion = false,
}: UseVideoFrameSyncOptions): UseVideoFrameSyncResult {
  const pendingProgressRef = useRef<number | null>(null);
  const rvfcHandleRef = useRef<number | null>(null);
  const fallbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const applySeek = useCallback(
    (progress: number) => {
      const video = videoRef.current;
      if (!video || !Number.isFinite(video.duration) || video.duration <= 0) return;

      const nextTime = clamp(progress, 0, 1) * video.duration;
      if (Math.abs(video.currentTime - nextTime) <= RUNWAY_VIDEO_SEEK_THRESHOLD_SEC) {
        pendingProgressRef.current = null;
        return;
      }
      video.currentTime = nextTime;
      pendingProgressRef.current = null;
    },
    [videoRef]
  );

  const cancelPendingSeek = useCallback(() => {
    pendingProgressRef.current = null;
    const video = videoRef.current as VideoWithRvfc | null;
    if (video?.cancelVideoFrameCallback && rvfcHandleRef.current != null) {
      video.cancelVideoFrameCallback(rvfcHandleRef.current);
    }
    rvfcHandleRef.current = null;
    if (fallbackTimerRef.current) {
      clearTimeout(fallbackTimerRef.current);
      fallbackTimerRef.current = null;
    }
  }, [videoRef]);

  const flushSeekLoop = useCallback(() => {
    const video = videoRef.current as VideoWithRvfc | null;
    const target = pendingProgressRef.current;
    if (!enabled || target == null || !video) return;

    if (supportsRvfc(video) && !prefersReducedMotion) {
      rvfcHandleRef.current = video.requestVideoFrameCallback!(() => {
        rvfcHandleRef.current = null;
        if (pendingProgressRef.current != null) {
          applySeek(pendingProgressRef.current);
          if (pendingProgressRef.current != null) flushSeekLoop();
        }
      });
      return;
    }

    if (fallbackTimerRef.current) clearTimeout(fallbackTimerRef.current);
    fallbackTimerRef.current = setTimeout(
      () => {
        fallbackTimerRef.current = null;
        if (pendingProgressRef.current != null) applySeek(pendingProgressRef.current);
      },
      prefersReducedMotion ? 0 : 32
    );
  }, [applySeek, enabled, prefersReducedMotion, videoRef]);

  const scheduleSeekToProgress = useCallback(
    (progress: number, immediate = false) => {
      if (!enabled) return;
      pendingProgressRef.current = clamp(progress, 0, 1);

      if (immediate) {
        cancelPendingSeek();
        applySeek(progress);
        return;
      }

      flushSeekLoop();
    },
    [applySeek, cancelPendingSeek, enabled, flushSeekLoop]
  );

  useEffect(() => () => cancelPendingSeek(), [cancelPendingSeek]);

  return { scheduleSeekToProgress, cancelPendingSeek };
}
