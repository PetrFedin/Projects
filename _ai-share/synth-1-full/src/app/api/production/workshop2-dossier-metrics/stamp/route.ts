import { NextResponse } from 'next/server';
import {
  clientOriginTrustedForLooseStamp,
  getW2DossierMetricsStampSecret,
  getW2MetricsStampTtlSec,
  isW2LooseStampAllowedInThisRuntime,
  isW2MetricsMintBearer,
  resolveUidOrgFromPlatformBearer,
  signW2MetricsStamp,
  w2MetricsLooseStampRateOk,
} from '@/lib/server/workshop2-dossier-metrics-stamp';

export const dynamic = 'force-dynamic';

function clientIp(request: Request): string {
  const xf = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  if (xf) return xf;
  const ri = request.headers.get('x-real-ip')?.trim();
  return ri || 'unknown';
}

/**
 * Выдаёт короткоживущий X-W2-Metrics-Stamp (HMAC на сервере).
 *
 * Режимы:
 * 1) Authorization: Bearer <W2_DOSSIER_METRICS_MINT_BEARER> + JSON { uid, orgId? } — инфра/скрипты.
 * 2) NEXT_PUBLIC_USE_FASTAPI=true + Bearer <platform JWT> — uid/org из GET /profile/me.
 * 3) W2_DOSSIER_METRICS_LOOSE_STAMP=1 + доверенный Origin + JSON { uid, orgId? } — MVP без API (тот же уровень доверия, что раньше у полей в теле).
 */
export async function POST(request: Request) {
  const secret = getW2DossierMetricsStampSecret();
  if (!secret) {
    return NextResponse.json(
      { ok: false, error: 'stamp_secret_unset', hint: 'Задайте W2_DOSSIER_METRICS_STAMP_SECRET' },
      { status: 503 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 });
  }
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ ok: false, error: 'invalid_body' }, { status: 400 });
  }
  const rec = body as Record<string, unknown>;

  const auth = request.headers.get('authorization');
  let uid = '';
  let orgId = '';

  if (isW2MetricsMintBearer(auth)) {
    if (typeof rec.uid !== 'string' || !rec.uid.trim()) {
      return NextResponse.json({ ok: false, error: 'mint_requires_uid' }, { status: 400 });
    }
    uid = rec.uid.trim().slice(0, 128);
    orgId = typeof rec.orgId === 'string' ? rec.orgId.trim().slice(0, 128) : '';
  } else if (auth?.startsWith('Bearer ') && process.env.NEXT_PUBLIC_USE_FASTAPI === 'true') {
    const token = auth.slice(7).trim();
    const fromApi = await resolveUidOrgFromPlatformBearer(token);
    if (!fromApi) {
      return NextResponse.json({ ok: false, error: 'platform_profile_failed' }, { status: 401 });
    }
    uid = fromApi.uid;
    orgId = fromApi.orgId;
  } else if (isW2LooseStampAllowedInThisRuntime()) {
    const origin = request.headers.get('origin');
    if (!clientOriginTrustedForLooseStamp(origin)) {
      return NextResponse.json({ ok: false, error: 'origin_not_trusted' }, { status: 403 });
    }
    const ip = clientIp(request);
    if (!w2MetricsLooseStampRateOk(ip)) {
      return NextResponse.json({ ok: false, error: 'rate_limited' }, { status: 429 });
    }
    if (typeof rec.uid !== 'string' || !rec.uid.trim()) {
      return NextResponse.json({ ok: false, error: 'loose_requires_uid' }, { status: 400 });
    }
    uid = rec.uid.trim().slice(0, 128);
    orgId = typeof rec.orgId === 'string' ? rec.orgId.trim().slice(0, 128) : '';
  } else {
    return NextResponse.json(
      {
        ok: false,
        error: 'unauthorized',
        hint: 'Mint bearer, platform JWT (USE_FASTAPI), или LOOSE_STAMP + Origin (в prod нужен LOOSE_STAMP_ALLOW_PRODUCTION)',
      },
      { status: 401 }
    );
  }

  const ttl = getW2MetricsStampTtlSec();
  const exp = Math.floor(Date.now() / 1000) + ttl;
  const stamp = signW2MetricsStamp({ uid, orgId, exp }, secret);
  return NextResponse.json({ ok: true, stamp, expiresAt: new Date(exp * 1000).toISOString(), ttlSec: ttl });
}
