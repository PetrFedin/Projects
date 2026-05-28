/**
 * Проверка SLO/доступности FastAPI. URL задаётся явно или как origin + путь.
 * Кэш ~30s; в Jest без реального fetch (кроме явных интеграционных тестов).
 */

import { isFastApiEnabled } from '@/lib/runtime-mode';

const TTL_MS = 30_000;

type ProbeResult = { health: 'ok' | 'degraded'; errors?: string[]; checkedAt: string };

let cache: { expires: number; result: ProbeResult } | null = null;

/** Полный URL пробы: SYNTHA_API_SLO_URL или origin(NEXT_PUBLIC_API_URL) + SYNTHA_API_SLO_PATH (по умолчанию /health). */
export function resolveSynthaSloUrl(): string | null {
  const absolute = process.env.SYNTHA_API_SLO_URL?.trim();
  if (absolute) {
    try {
      new URL(absolute);
      return absolute;
    } catch {
      return null;
    }
  }
  const raw = (process.env.NEXT_PUBLIC_API_URL || '').trim();
  if (!raw) return null;
  try {
    const origin = new URL(raw).origin;
    const pathRaw = (process.env.SYNTHA_API_SLO_PATH ?? '/health').trim();
    const suffix = pathRaw.startsWith('/') ? pathRaw : `/${pathRaw}`;
    return `${origin}${suffix}`;
  } catch {
    return null;
  }
}

export async function probeSynthaApiReachable(): Promise<ProbeResult> {
  const checkedAt = new Date().toISOString();

  if (process.env.NODE_ENV === 'test') {
    return isFastApiEnabled()
      ? { health: 'ok', checkedAt }
      : { health: 'degraded', errors: ['FastAPI выключен или нет URL (демо-тест).'], checkedAt };
  }

  if (!isFastApiEnabled()) {
    return { health: 'degraded', errors: ['FastAPI выключен или нет базового URL.'], checkedAt };
  }

  const now = Date.now();
  if (cache && cache.expires > now) {
    return cache.result;
  }

  const url = resolveSynthaSloUrl();
  if (!url) {
    const result: ProbeResult = {
      health: 'degraded',
      errors: [
        'Не задан SLO URL (SYNTHA_API_SLO_URL или NEXT_PUBLIC_API_URL + SYNTHA_API_SLO_PATH).',
      ],
      checkedAt,
    };
    cache = { expires: now + TTL_MS, result };
    return result;
  }

  try {
    const ac = new AbortController();
    const t = setTimeout(() => ac.abort(), 2500);
    const r = await fetch(url, { method: 'GET', signal: ac.signal, cache: 'no-store' });
    clearTimeout(t);
    if (r.ok) {
      const result: ProbeResult = { health: 'ok', checkedAt };
      cache = { expires: now + TTL_MS, result };
      return result;
    }
    const result: ProbeResult = {
      health: 'degraded',
      errors: [`SLO GET ${url} → HTTP ${r.status}`],
      checkedAt,
    };
    cache = { expires: now + TTL_MS, result };
    return result;
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'unreachable';
    const result: ProbeResult = { health: 'degraded', errors: [msg], checkedAt };
    cache = { expires: now + TTL_MS, result };
    return result;
  }
}

/** Сброс кэша (только тесты). */
export function __resetSynthaHealthProbeForTests(): void {
  if (process.env.NODE_ENV !== 'test') return;
  cache = null;
}
