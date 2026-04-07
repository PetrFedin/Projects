import { timingSafeEqual } from 'crypto';
import { getW2MetricsClientIp } from '@/lib/server/workshop2-dossier-metrics-request-ip';

const postHits = new Map<string, { n: number; reset: number }>();
const WINDOW_MS = 60_000;

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

export function getW2DossierMetricsPostSecret(): string | null {
  return process.env.W2_DOSSIER_METRICS_POST_SECRET?.trim() || null;
}

export function getW2DossierMetricsPostRatePerMinute(): number {
  const v = parseInt(process.env.W2_DOSSIER_METRICS_POST_RL_PER_MIN ?? '180', 10);
  if (!Number.isFinite(v)) return 180;
  return Math.min(Math.max(v, 10), 10_000);
}

export function w2MetricsPostRateOk(ip: string): boolean {
  const max = getW2DossierMetricsPostRatePerMinute();
  const now = Date.now();
  const cur = postHits.get(ip);
  if (!cur || now > cur.reset) {
    postHits.set(ip, { n: 1, reset: now + WINDOW_MS });
    return true;
  }
  if (cur.n >= max) return false;
  cur.n += 1;
  return true;
}

/**
 * Опциональный секрет записи + rate limit по IP (без platform API).
 */
export function verifyW2DossierMetricsPostRequest(request: Request): { ok: true } | { ok: false; status: number; error: string } {
  const ip = getW2MetricsClientIp(request);
  if (!w2MetricsPostRateOk(ip)) {
    return { ok: false, status: 429, error: 'rate_limited' };
  }

  const want = getW2DossierMetricsPostSecret();
  if (!want) {
    return { ok: true };
  }

  const auth = request.headers.get('authorization');
  const key = request.headers.get('x-w2-metrics-write-key');
  const bearer = auth?.startsWith('Bearer ') ? auth.slice(7).trim() : '';
  if (safeEq(bearer, want) || (key != null && safeEq(key, want))) {
    return { ok: true };
  }
  return { ok: false, status: 401, error: 'post_secret_required' };
}
