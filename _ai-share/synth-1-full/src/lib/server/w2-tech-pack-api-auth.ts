import { timingSafeEqual } from 'crypto';
import { type NextRequest } from 'next/server';

/**
 * Кабинет (браузер) бьёт в `/api/brand/...` same-origin; без публичного ключа.
 * Включает доверие к `Sec-Fetch-Site: same-origin` (не путать с фабричным curl/скриптами — им нужен Bearer).
 */
export function w2TechPackAllowSameOriginBrowser(): boolean {
  const v = process.env.W2_TECHPACK_ALLOW_SAME_ORIGIN_BROWSER?.trim();
  return v === '1' || v === 'true';
}

export function isW2TechPackBrowserSameOriginRequest(req: NextRequest): boolean {
  const sfs = (req.headers.get('sec-fetch-site') ?? '').toLowerCase();
  if (sfs === 'same-origin') return true;
  return false;
}

function safeEq(a: string, b: string): boolean {
  try {
    const ba = Buffer.from(a, 'utf8');
    const bb = Buffer.from(b, 'utf8');
    if (ba.length !== bb.length) return false;
    return timingSafeEqual(ba, bb);
  } catch {
    return false;
  }
}

export function w2TechPackApiWriteSecret(): string | null {
  return process.env.W2_TECHPACK_API_SECRET?.trim() || null;
}

/**
 * Ключ на чтение (фабрика / download). Если не задан — для пилота допускается W2_TECHPACK_API_SECRET.
 */
export function w2TechPackFactoryReadSecret(): string | null {
  return process.env.W2_TECHPACK_FACTORY_READ_SECRET?.trim() || w2TechPackApiWriteSecret();
}

export function w2TechPackAuthDisabled(): boolean {
  return process.env.W2_TECHPACK_AUTH_DISABLED === '1' || process.env.W2_TECHPACK_AUTH_DISABLED === 'true';
}

export function w2TechPackWriteAuthRequiredInProd(): boolean {
  if (w2TechPackAuthDisabled()) return false;
  if (process.env.NODE_ENV !== 'production') return false;
  return Boolean(w2TechPackApiWriteSecret());
}

function bearerAndKey(req: NextRequest): { bearer: string; xKey: string } {
  const auth = req.headers.get('authorization');
  const bearer = auth?.startsWith('Bearer ') ? auth.slice(7).trim() : '';
  return { bearer, xKey: (req.headers.get('x-w2-api-key') ?? '').trim() };
}

/**
 * Presign, complete, индекс (brand write).
 */
export function verifyW2TechPackWriteRequest(req: NextRequest): { ok: true } | { ok: false; status: number; error: string } {
  if (w2TechPackAuthDisabled()) return { ok: true };
  if (process.env.NODE_ENV !== 'production' && !w2TechPackApiWriteSecret()) return { ok: true };
  const want = w2TechPackApiWriteSecret();
  if (!want) {
    if (process.env.NODE_ENV === 'production') {
      return { ok: false, status: 503, error: 'techpack_api_secret_unconfigured' };
    }
    return { ok: true };
  }
  const { bearer, xKey } = bearerAndKey(req);
  if (safeEq(bearer, want) || (xKey.length > 0 && safeEq(xKey, want))) {
    return { ok: true };
  }
  if (w2TechPackAllowSameOriginBrowser() && isW2TechPackBrowserSameOriginRequest(req)) {
    return { ok: true };
  }
  return { ok: false, status: 401, error: 'unauthorized' };
}

/**
 * Presigned GET / download.
 */
export function verifyW2TechPackReadRequest(req: NextRequest): { ok: true } | { ok: false; status: number; error: string } {
  if (w2TechPackAuthDisabled()) return { ok: true };
  if (process.env.NODE_ENV !== 'production' && !w2TechPackFactoryReadSecret()) return { ok: true };
  const want = w2TechPackFactoryReadSecret();
  if (!want) {
    if (process.env.NODE_ENV === 'production') {
      return { ok: false, status: 503, error: 'techpack_read_secret_unconfigured' };
    }
    return { ok: true };
  }
  const { bearer, xKey } = bearerAndKey(req);
  if (safeEq(bearer, want) || (xKey.length > 0 && safeEq(xKey, want))) {
    return { ok: true };
  }
  return { ok: false, status: 401, error: 'unauthorized' };
}
