/**
 * CDN для scrollVideoUrl / sectionVideoUrl из scroll-experience.json.
 * Относительные пути (/videos/...) дополняются videoCdnBaseUrl; абсолютные URL не меняются.
 * RUNWAY_VIDEO_CDN_SIGNED_QUERY — опциональный query для cache busting / signed URLs.
 */
import type { ScrollExperienceConfig } from '@/lib/types';

export interface VideoCdnOptions {
  baseUrl?: string;
  signedQuery?: string;
}

/** Опции CDN из config + env (signed query только на сервере или через API config). */
export function resolveVideoCdnOptions(
  config?: Pick<
    ScrollExperienceConfig,
    'videoCdnBaseUrl' | 'videoCdnSignedQuery' | 'brandVideoCdnBaseUrl'
  >,
  brandName?: string
): VideoCdnOptions {
  const brandKey = brandName?.trim();
  const brandBase =
    brandKey && config?.brandVideoCdnBaseUrl?.[brandKey]?.trim()
      ? config.brandVideoCdnBaseUrl[brandKey].trim()
      : undefined;
  const baseUrl = brandBase || config?.videoCdnBaseUrl?.trim() || undefined;
  const signedQuery =
    config?.videoCdnSignedQuery?.trim() ||
    (typeof process !== 'undefined'
      ? process.env.RUNWAY_VIDEO_CDN_SIGNED_QUERY?.trim() ||
        process.env.NEXT_PUBLIC_RUNWAY_VIDEO_CDN_SIGNED_QUERY?.trim()
      : undefined) ||
    undefined;

  return { baseUrl, signedQuery: signedQuery || undefined };
}

/** Префикс CDN base для относительного пути (legacy helper). */
export function applyVideoCdnBaseUrl(
  url: string | undefined,
  cdnBaseUrl?: string
): string | undefined {
  return resolveVideoCdnUrl(url, { baseUrl: cdnBaseUrl });
}

/** Добавить signed query (?v=… или &token=…) к абсолютному/относительному URL. */
export function appendVideoCdnSignedQuery(url: string, signedQuery?: string): string {
  if (!signedQuery?.trim()) return url;
  const raw = signedQuery.trim().replace(/^\?/, '');
  if (!raw) return url;
  return url.includes('?') ? `${url}&${raw}` : `${url}?${raw}`;
}

/**
 * При CDN base итоговый URL обязан быть absolute https (production safety).
 * Относительные пути без CDN base допустимы для local dev.
 */
export function assertHttpsVideoUrlWhenCdnConfigured(url: string, cdnConfigured: boolean): void {
  if (!cdnConfigured) return;
  if (!/^https:\/\//i.test(url)) {
    throw new Error(
      `CDN video URL must be absolute https when videoCdnBaseUrl is configured: ${url}`
    );
  }
}

/** Полный резолв: base prefix + signed query + https validation при CDN. */
export function resolveVideoCdnUrl(
  url: string | undefined,
  options?: VideoCdnOptions
): string | undefined {
  if (!url) return undefined;
  const trimmed = url.trim();
  if (!trimmed) return undefined;

  const mergedOptions: VideoCdnOptions = {
    baseUrl: options?.baseUrl,
    signedQuery: options?.signedQuery ?? resolveVideoCdnOptions().signedQuery,
  };

  const cdnConfigured = Boolean(mergedOptions.baseUrl?.trim());
  let resolved: string;

  if (/^https?:\/\//i.test(trimmed)) {
    resolved = trimmed;
  } else if (cdnConfigured) {
    const base = mergedOptions.baseUrl!.trim().replace(/\/+$/, '');
    const path = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
    resolved = `${base}${path}`;
  } else {
    resolved = trimmed;
  }

  resolved = appendVideoCdnSignedQuery(resolved, mergedOptions.signedQuery);
  assertHttpsVideoUrlWhenCdnConfigured(resolved, cdnConfigured);
  return resolved;
}

/** Применить CDN base + signed query к mp4/webm/poster в ScrollVideoSources. */
export function applyVideoCdnToSources(
  sources: { mp4?: string; webm?: string; poster?: string },
  options?: VideoCdnOptions
): { mp4?: string; webm?: string; poster?: string } {
  const cdnOpts = options ?? {};
  return {
    mp4: resolveVideoCdnUrl(sources.mp4, cdnOpts),
    webm: resolveVideoCdnUrl(sources.webm, cdnOpts),
    // poster — изображение, CDN prefix только если явно задан base
    poster: resolveVideoCdnUrl(sources.poster, { baseUrl: cdnOpts.baseUrl }),
  };
}
