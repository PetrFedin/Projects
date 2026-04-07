/**
 * API-клиент по контрактам из src/lib (ANALYTICS_PHASE2_API, STYLE_ME_UPSELL_API и т.д.).
 * Базовый URL: NEXT_PUBLIC_API_BASE_URL. Если не задан или запрос падает — фичи используют моки.
 */

const baseUrl = typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_API_BASE_URL ?? '' : '';

export async function get<T>(path: string): Promise<T> {
  const url = path.startsWith('http') ? path : `${baseUrl}${path}`;
  if (!url || url === path) {
    throw new Error('API_BASE_NOT_CONFIGURED');
  }
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error(`API ${res.status}: ${res.statusText}`);
  return res.json() as Promise<T>;
}

export async function post<T>(path: string, body: unknown): Promise<T> {
  const url = path.startsWith('http') ? path : `${baseUrl}${path}`;
  if (!url || url === path) {
    throw new Error('API_BASE_NOT_CONFIGURED');
  }
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`API ${res.status}: ${res.statusText}`);
  return res.json() as Promise<T>;
}

export const api = { get, post };
