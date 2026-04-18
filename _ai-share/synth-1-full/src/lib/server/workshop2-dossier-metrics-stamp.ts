import { createHmac, timingSafeEqual } from 'crypto';
import type { Workshop2DossierMetricsPayload } from '@/lib/production/workshop2-dossier-metrics-ingest';

const PREFIX = 'w2m1';

export type W2MetricsStampPayload = {
  uid: string;
  orgId: string;
  exp: number;
};

export function getW2MetricsStampTtlSec(): number {
  const raw = parseInt(process.env.W2_DOSSIER_METRICS_STAMP_TTL_SEC ?? '900', 10);
  return Number.isFinite(raw) ? Math.min(Math.max(raw, 60), 86_400) : 900;
}

/** Подпись: w2m1.<base64url(json)>.<base64url(hmac)> */
export function signW2MetricsStamp(payload: W2MetricsStampPayload, secret: string): string {
  const json = JSON.stringify(payload);
  const body = Buffer.from(json, 'utf8').toString('base64url');
  const mac = createHmac('sha256', secret).update(`${PREFIX}.${body}`).digest('base64url');
  return `${PREFIX}.${body}.${mac}`;
}

export function verifyW2MetricsStamp(token: string, secret: string): W2MetricsStampPayload | null {
  const parts = token.split('.');
  if (parts.length !== 3 || parts[0] !== PREFIX) return null;
  const [, bodyB64, sig] = parts;
  if (!bodyB64 || !sig) return null;
  const expected = createHmac('sha256', secret).update(`${PREFIX}.${bodyB64}`).digest('base64url');
  const a = Buffer.from(expected, 'utf8');
  const b = Buffer.from(sig, 'utf8');
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  let parsed: unknown;
  try {
    parsed = JSON.parse(Buffer.from(bodyB64, 'base64url').toString('utf8'));
  } catch {
    return null;
  }
  if (!parsed || typeof parsed !== 'object') return null;
  const o = parsed as Record<string, unknown>;
  if (typeof o.uid !== 'string' || typeof o.exp !== 'number') return null;
  const orgId = typeof o.orgId === 'string' ? o.orgId : '';
  const uid = o.uid.trim().slice(0, 128);
  if (!uid || o.exp < Date.now() / 1000) return null;
  return { uid, orgId: orgId.trim().slice(0, 128), exp: o.exp };
}

export function getW2DossierMetricsStampSecret(): string | null {
  const s = process.env.W2_DOSSIER_METRICS_STAMP_SECRET?.trim();
  return s || null;
}

/**
 * LOOSE_STAMP в production по умолчанию выключен (нужен явный W2_DOSSIER_METRICS_LOOSE_STAMP_ALLOW_PRODUCTION=1).
 */
export function isW2LooseStampAllowedInThisRuntime(): boolean {
  if (process.env.W2_DOSSIER_METRICS_LOOSE_STAMP !== '1') return false;
  if (process.env.NODE_ENV !== 'production') return true;
  return process.env.W2_DOSSIER_METRICS_LOOSE_STAMP_ALLOW_PRODUCTION === '1';
}

export type W2MetricsStampApplyMeta = {
  stampHeader: boolean;
  /** Подпись проверена и uid/org выставлены из stamp. */
  identityFromStamp: boolean;
};

/**
 * При заданном STAMP_SECRET: валидный заголовок X-W2-Metrics-Stamp задаёт uid/org;
 * иначе снимаем client identity (если не ALLOW_UNSTAMPED_IDS).
 */
export function applyW2MetricsStampToRow(
  request: Request,
  row: Workshop2DossierMetricsPayload
): W2MetricsStampApplyMeta {
  const stampHeader = Boolean(request.headers.get('x-w2-metrics-stamp')?.trim());
  const secret = getW2DossierMetricsStampSecret();
  if (!secret) {
    return { stampHeader, identityFromStamp: false };
  }

  const raw = request.headers.get('x-w2-metrics-stamp')?.trim();
  const v = raw ? verifyW2MetricsStamp(raw, secret) : null;
  if (v) {
    row.appUserUid = v.uid;
    if (v.orgId) row.orgId = v.orgId;
    else delete row.orgId;
    return { stampHeader, identityFromStamp: true };
  }

  if (process.env.W2_DOSSIER_METRICS_ALLOW_UNSTAMPED_IDS === '1') {
    return { stampHeader, identityFromStamp: false };
  }
  delete row.appUserUid;
  delete row.orgId;
  return { stampHeader, identityFromStamp: false };
}

function timingSafeStrEq(a: string, b: string): boolean {
  try {
    const ba = Buffer.from(a, 'utf8');
    const bb = Buffer.from(b, 'utf8');
    if (ba.length !== bb.length) return false;
    return timingSafeEqual(ba, bb);
  } catch {
    return false;
  }
}

export function isW2MetricsMintBearer(authHeader: string | null): boolean {
  const mint = process.env.W2_DOSSIER_METRICS_MINT_BEARER?.trim();
  if (!mint || !authHeader?.startsWith('Bearer ')) return false;
  const t = authHeader.slice(7).trim();
  return timingSafeStrEq(t, mint);
}

export async function resolveUidOrgFromPlatformBearer(
  bearer: string
): Promise<{ uid: string; orgId: string } | null> {
  if (process.env.NEXT_PUBLIC_USE_FASTAPI !== 'true') return null;
  const base = (process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1').replace(
    /\/$/,
    ''
  );
  try {
    const res = await fetch(`${base}/profile/me`, {
      headers: { Authorization: `Bearer ${bearer}`, Accept: 'application/json' },
      cache: 'no-store',
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    const j = (await res.json()) as Record<string, unknown>;
    const data = (j.data ?? j) as Record<string, unknown>;
    const user = (data.user ?? data) as Record<string, unknown>;
    const uid =
      (typeof user.id === 'string' && user.id) ||
      (typeof user.uid === 'string' && user.uid) ||
      (typeof data.uid === 'string' && data.uid) ||
      '';
    const orgRaw =
      (typeof data.activeOrganizationId === 'string' && data.activeOrganizationId) ||
      (typeof user.activeOrganizationId === 'string' && user.activeOrganizationId) ||
      '';
    if (!uid) return null;
    return { uid: uid.slice(0, 128), orgId: (orgRaw || '').slice(0, 128) };
  } catch {
    return null;
  }
}

const looseHits = new Map<string, { n: number; reset: number }>();
const LOOSE_WINDOW_MS = 60_000;
const LOOSE_MAX = 45;

export function w2MetricsLooseStampRateOk(ip: string): boolean {
  const now = Date.now();
  const cur = looseHits.get(ip);
  if (!cur || now > cur.reset) {
    looseHits.set(ip, { n: 1, reset: now + LOOSE_WINDOW_MS });
    return true;
  }
  if (cur.n >= LOOSE_MAX) return false;
  cur.n += 1;
  return true;
}

export function clientOriginTrustedForLooseStamp(origin: string | null): boolean {
  if (!origin) return false;
  try {
    const u = new URL(origin);
    const host = u.hostname;
    if (host === 'localhost' || host === '127.0.0.1') return true;
    const list = (process.env.W2_DOSSIER_METRICS_TRUSTED_ORIGINS ?? '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    for (const entry of list) {
      if (entry.startsWith('https://') || entry.startsWith('http://')) {
        if (origin === entry.replace(/\/$/, '')) return true;
      } else if (host === entry || host.endsWith(`.${entry}`)) {
        return true;
      }
    }
    return false;
  } catch {
    return false;
  }
}
