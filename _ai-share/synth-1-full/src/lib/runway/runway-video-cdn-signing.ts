import { createHmac } from 'node:crypto';
import { appendVideoCdnSignedQuery } from '@/lib/runway/runway-video-cdn';

export const RUNWAY_CDN_SIGN_TTL_SEC = 3600;

/** Извлечь pathname для подписи из absolute или relative URL. */
export function extractVideoCdnSigningPath(url: string): string {
  if (/^https?:\/\//i.test(url)) {
    try {
      return new URL(url).pathname;
    } catch {
      return url.split('?')[0] ?? url;
    }
  }
  return url.split('?')[0] ?? url;
}

/** HMAC-SHA256 token для CDN path — только server/scripts. */
export function buildRunwayCdnSigningQuery(
  urlPath: string,
  secret: string,
  nowSec: number = Math.floor(Date.now() / 1000)
): string {
  const path = urlPath.startsWith('/') ? urlPath : `/${urlPath}`;
  const exp = nowSec + RUNWAY_CDN_SIGN_TTL_SEC;
  const sig = createHmac('sha256', secret).update(`${path}:${exp}`).digest('hex');
  return `runway_sig=${sig}&runway_exp=${exp}`;
}

/** Server-side: дописать HMAC query к уже резолвнутому CDN URL. */
export function signRunwayVideoCdnUrl(resolvedUrl: string, secret?: string): string {
  const key = secret?.trim() || process.env.RUNWAY_VIDEO_CDN_SIGNING_SECRET?.trim();
  if (!key) return resolvedUrl;
  const query = buildRunwayCdnSigningQuery(extractVideoCdnSigningPath(resolvedUrl), key);
  return appendVideoCdnSignedQuery(resolvedUrl, query);
}
