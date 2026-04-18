import type { Product } from '@/lib/types';
import { getPlatformApiBaseUrl, getPlatformTransport, type PlatformTransport } from './config';
import type { VisualSearchHit, VisualSearchSessionV1 } from './types';
import { VISUAL_SEARCH_EXPORT_VERSION } from './types';

const SESSION_KEY = 'synth.visualSearch.session.v1';

export function loadVisualSearchSession(): VisualSearchSessionV1 | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const p = JSON.parse(raw) as VisualSearchSessionV1;
    if (p?.version !== VISUAL_SEARCH_EXPORT_VERSION || !Array.isArray(p.hits)) return null;
    return p;
  } catch {
    return null;
  }
}

export function saveVisualSearchSession(session: VisualSearchSessionV1) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch {
    /* quota / private mode */
  }
}

function productToHit(p: Product, score?: number): VisualSearchHit {
  return {
    productId: String(p.id),
    slug: p.slug,
    name: p.name,
    imageUrl: p.images[0]?.url || '/placeholder.jpg',
    score,
  };
}

/** Детерминированная «похожесть» без эмбеддингов: ротация по хэшу превью. */
export function visualSearchLocalDemo(
  catalog: Product[],
  previewDataUrl: string | null,
  limit = 12
): VisualSearchHit[] {
  const list = catalog.filter((p) => p.images?.length);
  if (!list.length) return [];
  let seed = 0;
  if (previewDataUrl) {
    const s = previewDataUrl.slice(0, 400);
    for (let i = 0; i < s.length; i++) seed = (seed + s.charCodeAt(i) * (i + 1)) % 100000;
  }
  const n = list.length;
  const out: VisualSearchHit[] = [];
  for (let i = 0; i < Math.min(limit, n); i++) {
    const idx = (seed + i * 7) % n;
    const p = list[idx];
    const score = Math.max(0.35, 0.95 - i * 0.04 - (seed % 10) / 100);
    out.push(productToHit(p, Math.round(score * 1000) / 1000));
  }
  return out;
}

async function visualSearchApiStub(previewDataUrl: string): Promise<VisualSearchHit[]> {
  const base = getPlatformApiBaseUrl();
  if (!base) {
    throw new Error('NEXT_PUBLIC_SYNTH_API_BASE_URL не задан');
  }
  const res = await fetch(`${base}/v1/client/visual-search`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ imageDataUrl: previewDataUrl }),
  });
  if (!res.ok) throw new Error(`visual-search ${res.status}`);
  const data = (await res.json()) as { hits?: VisualSearchHit[] };
  return Array.isArray(data.hits) ? data.hits : [];
}

export async function runVisualSearch(
  transport: PlatformTransport,
  catalog: Product[],
  previewDataUrl: string | null
): Promise<VisualSearchHit[]> {
  if (transport === 'api') {
    if (!previewDataUrl) return [];
    return visualSearchApiStub(previewDataUrl);
  }
  return visualSearchLocalDemo(catalog, previewDataUrl);
}

export function getVisualSearchTransport(): PlatformTransport {
  return getPlatformTransport();
}

export function exportVisualSearchSession(session: VisualSearchSessionV1): VisualSearchSessionV1 {
  return { ...session, version: VISUAL_SEARCH_EXPORT_VERSION };
}

export function parseVisualSearchImport(raw: unknown): VisualSearchSessionV1 | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Partial<VisualSearchSessionV1>;
  if (o.version !== VISUAL_SEARCH_EXPORT_VERSION || !Array.isArray(o.hits)) return null;
  return {
    version: VISUAL_SEARCH_EXPORT_VERSION,
    updatedAt: typeof o.updatedAt === 'number' ? o.updatedAt : Date.now(),
    previewDataUrl: o.previewDataUrl ?? null,
    hits: o.hits,
    queryNote: o.queryNote,
  };
}
