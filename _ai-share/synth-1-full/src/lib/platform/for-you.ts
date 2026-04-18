import type { Product } from '@/lib/types';
import { getPlatformApiBaseUrl, getPlatformTransport, type PlatformTransport } from './config';
import type { ForYouFeedItem, ForYouPreferencesV1 } from './types';
import { FOR_YOU_PREFS_VERSION } from './types';

const PREFS_KEY = 'synth.forYou.prefs.v1';

const DEFAULT_PREFS: ForYouPreferencesV1 = {
  version: FOR_YOU_PREFS_VERSION,
  updatedAt: Date.now(),
  sizeHint: 'M',
  brandHints: ['Syntha Lab', 'Nordic Wool'],
};

export function loadForYouPreferences(): ForYouPreferencesV1 {
  if (typeof window === 'undefined') return DEFAULT_PREFS;
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    if (!raw) return DEFAULT_PREFS;
    const p = JSON.parse(raw) as Partial<ForYouPreferencesV1>;
    if (p.version !== FOR_YOU_PREFS_VERSION) return DEFAULT_PREFS;
    return {
      version: FOR_YOU_PREFS_VERSION,
      updatedAt: p.updatedAt ?? Date.now(),
      sizeHint:
        typeof p.sizeHint === 'string' && p.sizeHint.trim()
          ? p.sizeHint.trim()
          : DEFAULT_PREFS.sizeHint,
      brandHints:
        Array.isArray(p.brandHints) && p.brandHints.length
          ? p.brandHints.filter(Boolean)
          : DEFAULT_PREFS.brandHints,
    };
  } catch {
    return DEFAULT_PREFS;
  }
}

export function saveForYouPreferences(prefs: ForYouPreferencesV1) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(PREFS_KEY, JSON.stringify({ ...prefs, updatedAt: Date.now() }));
}

/** Локальная лента: смещение по префам (без ML). */
export function buildForYouFeedLocal(
  catalog: Product[],
  prefs: ForYouPreferencesV1,
  limit = 9
): ForYouFeedItem[] {
  const list = catalog.filter((p) => p.images?.length);
  if (!list.length) return [];
  const brandSet = new Set(prefs.brandHints.map((b) => b.toLowerCase()));
  const preferred = list.filter((p) => brandSet.has(p.brand.toLowerCase()));
  const pool = preferred.length >= limit ? preferred : list;
  const offset = (prefs.sizeHint.charCodeAt(0) || 77) % Math.max(1, pool.length);
  const out: ForYouFeedItem[] = [];
  for (let i = 0; i < Math.min(limit, pool.length); i++) {
    const p = pool[(offset + i * 3) % pool.length];
    out.push({
      productId: String(p.id),
      slug: p.slug,
      name: p.name,
      imageUrl: p.images[0]?.url || '/placeholder.jpg',
      reasonTag: brandSet.has(p.brand.toLowerCase()) ? 'Ваш бренд' : 'Похожий стиль',
    });
  }
  return out;
}

async function forYouFeedApi(prefs: ForYouPreferencesV1): Promise<ForYouFeedItem[]> {
  const base = getPlatformApiBaseUrl();
  if (!base) throw new Error('NEXT_PUBLIC_SYNTH_API_BASE_URL не задан');
  const res = await fetch(`${base}/v1/client/for-you`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(prefs),
  });
  if (!res.ok) throw new Error(`for-you ${res.status}`);
  const data = (await res.json()) as { items?: ForYouFeedItem[] };
  return Array.isArray(data.items) ? data.items : [];
}

export async function fetchForYouFeed(
  transport: PlatformTransport,
  catalog: Product[],
  prefs: ForYouPreferencesV1
) {
  if (transport === 'api') {
    return forYouFeedApi(prefs);
  }
  return buildForYouFeedLocal(catalog, prefs);
}

export function getForYouTransport(): PlatformTransport {
  return getPlatformTransport();
}
