/**
 * Цепочка fallback для runway-видео: CDN → retry → статичное фото + цвет секции.
 * Используется в product-scroll-switcher и unit-тестах error path.
 */
import { resolveVideoCdnUrl, type VideoCdnOptions } from '@/lib/runway/runway-video-cdn';

export interface RunwayVideoSources {
  mp4?: string;
  webm?: string;
  poster?: string;
}

export interface RunwayMediaFallbackInput {
  videoSources: RunwayVideoSources;
  stageImageUrl?: string;
  sectionColor: string;
  videoFailed: boolean;
  prefersReducedMotion: boolean;
  ambientVideoEnabled: boolean;
  shouldLoadMedia: boolean;
}

export interface RunwayMediaFallbackResult {
  /** Можно монтировать `<video>` (источник валиден и пользователь не отключил видео). */
  canUseVideo: boolean;
  /** Статичное изображение на сцене (poster / hero). */
  stageImageUrl?: string;
  /** Фон сцены при отсутствии изображения. */
  stageBackground: string;
  /** Показать overlay «видео недоступно» + retry. */
  showVideoErrorOverlay: boolean;
}

/** Безопасный резолв CDN — invalid https не ломает PDP. */
export function safeResolveVideoCdnUrl(
  url: string | undefined,
  options?: VideoCdnOptions
): string | undefined {
  if (!url?.trim()) return undefined;
  try {
    return resolveVideoCdnUrl(url, options);
  } catch {
    return undefined;
  }
}

/** Есть ли воспроизводимый URL после CDN-резолва. */
export function hasPlayableVideoSource(sources: RunwayVideoSources): boolean {
  return Boolean(sources.mp4?.trim() || sources.webm?.trim());
}

/**
 * Единая точка принятия решения: видео или статичный fallback.
 * Порядок: ambient off / reduced motion → фото; CDN invalid → фото; error → фото + overlay.
 */
export function resolveRunwayMediaFallback(
  input: RunwayMediaFallbackInput
): RunwayMediaFallbackResult {
  const {
    videoSources,
    stageImageUrl,
    sectionColor,
    videoFailed,
    prefersReducedMotion,
    ambientVideoEnabled,
    shouldLoadMedia,
  } = input;

  const hasSource = hasPlayableVideoSource(videoSources);
  const canUseVideo =
    shouldLoadMedia && ambientVideoEnabled && !prefersReducedMotion && hasSource && !videoFailed;

  return {
    canUseVideo,
    stageImageUrl,
    stageBackground: sectionColor,
    showVideoErrorOverlay: videoFailed && hasSource && shouldLoadMedia,
  };
}
