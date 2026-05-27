/**
 * Wave 34 — staging live verify + inbound webhook + 3D stream (+8).
 */
import fs from 'node:fs';
import path from 'node:path';
import { createHmac } from 'node:crypto';

import {
  buildWorkshop2B2bInboundCalendarStubEvent,
  buildWorkshop2B2bInboundDraftOrder,
  isWorkshop2B2bInboundWebhookEnabled,
  mapWorkshop2B2bInboundExternalRefToOrderId,
  parseWorkshop2B2bInboundOrderWebhookBody,
  verifyWorkshop2B2bInboundWebhookHmac,
} from '@/lib/production/workshop2-b2b-inbound-webhook';
import {
  resolveWorkshop2B2bShowroom3dStreamToken,
  workshop2B2bShowroom3dStreamTooltipRu,
} from '@/lib/production/workshop2-b2b-showroom-3d-stream';
import { isWorkshop2DomainEventType } from '@/lib/production/workshop2-domain-event-types';
import { buildWorkshop2Wave34StagingLiveProbe } from '@/lib/production/workshop2-live-integration-probes';
import {
  buildWorkshop2StagingLiveVerifyReport,
  parseWorkshop2DotEnvExample,
  probeWorkshop2StagingLiveHttpUrl,
} from '@/lib/production/workshop2-staging-live-verify';

const root = process.cwd();

describe('wave34 — staging live verify module', () => {
  it('parses .env.staging.live.ru.example keys', () => {
    const src = fs.readFileSync(path.join(root, '.env.staging.live.ru.example'), 'utf8');
    const parsed = parseWorkshop2DotEnvExample(src);
    expect(parsed.WORKSHOP2_MARKET).toBe('ru');
    expect(parsed.WORKSHOP2_KONTUR_DIADOC_URL).toMatch(/DIADOC/);
    expect(parsed.WORKSHOP2_MARKING_API_URL).toMatch(/CRPT/);
  });

  it('placeholder URLs skip probe without crash', async () => {
    const probe = await probeWorkshop2StagingLiveHttpUrl({
      url: 'https://YOUR-DIADOC-API.example/v3',
      labelRu: 'Контур Diadoc',
    });
    expect(probe.probed).toBe(false);
    expect(probe.ok).toBe(false);
  });

  it('401/503 counted as expected fail-closed', async () => {
    const probe = await probeWorkshop2StagingLiveHttpUrl({
      url: 'https://marking.example.test',
      labelRu: 'Честный ЗНАК API',
      fetchImpl: async () => ({ ok: false, status: 401 }) as Response,
    });
    expect(probe.probed).toBe(true);
    expect(probe.ok).toBe(true);
    expect(probe.expectedFailClosed).toBe(true);
  });

  it('staging-live-verify script exists', () => {
    expect(fs.existsSync(path.join(root, 'scripts/workshop2-staging-live-verify.mjs'))).toBe(true);
  });

  it('buildWorkshop2StagingLiveVerifyReport structure', async () => {
    const example = fs.readFileSync(path.join(root, '.env.staging.live.ru.example'), 'utf8');
    const report = await buildWorkshop2StagingLiveVerifyReport({ envExampleContent: example });
    expect(report.probes).toHaveLength(2);
    expect(report.envSource).toBe('.env.staging.live.ru.example');
  });
});

describe('wave34 — CI PG gate tightening', () => {
  it('workshop2-ci.yml declares WORKSHOP2_PG_GATE_REQUIRED', () => {
    const src = fs.readFileSync(path.join(root, '.github/workflows/workshop2-ci.yml'), 'utf8');
    expect(src).toMatch(/WORKSHOP2_PG_GATE_REQUIRED/);
    expect(src).toMatch(/continue-on-error: \$\{\{ env\.WORKSHOP2_PG_GATE_REQUIRED != 'true' \}\}/);
  });
});

describe('wave34 — B2B inbound webhook scaffold', () => {
  it('feature flag defaults off', () => {
    expect(isWorkshop2B2bInboundWebhookEnabled({})).toBe(false);
    expect(
      isWorkshop2B2bInboundWebhookEnabled({ WORKSHOP2_B2B_INBOUND_WEBHOOK_ENABLED: 'true' })
    ).toBe(true);
  });

  it('HMAC verify accepts matching signature', () => {
    const rawBody = JSON.stringify({ externalOrderRef: 'JOOR-9001' });
    const secret = 'test-secret-w34';
    const sig = createHmac('sha256', secret).update(rawBody).digest('hex');
    const verify = verifyWorkshop2B2bInboundWebhookHmac({
      rawBody,
      signatureHeader: sig,
      env: { WORKSHOP2_B2B_INBOUND_WEBHOOK_SECRET: secret },
    });
    expect(verify.ok).toBe(true);
  });

  it('maps external ref to draft order + calendar stub', () => {
    const payload = parseWorkshop2B2bInboundOrderWebhookBody({
      externalOrderRef: 'EXT-42',
      collectionId: 'SS27',
      articleId: 'demo-ss27-01',
    });
    expect(payload).not.toBeNull();
    const order = buildWorkshop2B2bInboundDraftOrder(payload!);
    expect(order.status).toBe('draft');
    expect(mapWorkshop2B2bInboundExternalRefToOrderId('EXT-42')).toBe(order.id);
    const cal = buildWorkshop2B2bInboundCalendarStubEvent(order, 'EXT-42');
    expect(cal.source).toBe('b2b');
    expect(cal.title).toMatch(/EXT-42/);
  });

  it('domain event type b2b.inbound_order.received registered', () => {
    expect(isWorkshop2DomainEventType('b2b.inbound_order.received')).toBe(true);
  });

  it('inbound route file exists', () => {
    expect(
      fs.existsSync(path.join(root, 'src/app/api/shop/b2b/inbound/order-webhook/route.ts'))
    ).toBe(true);
  });
});

describe('wave34 — 3D showroom stream scaffold', () => {
  it('placeholder without WORKSHOP2_B2B_3D_STREAM_URL', () => {
    const resolved = resolveWorkshop2B2bShowroom3dStreamToken({});
    expect(resolved.mode).toBe('placeholder');
    expect(resolved.token).toBeUndefined();
  });

  it('live token when URL configured', () => {
    const resolved = resolveWorkshop2B2bShowroom3dStreamToken({
      WORKSHOP2_B2B_3D_STREAM_URL: 'https://stream.example.test/showroom',
    });
    expect(resolved.mode).toBe('live');
    expect(resolved.token).toMatch(/^w2-3d-/);
  });

  it('RU tooltip mentions env key when unset', () => {
    expect(workshop2B2bShowroom3dStreamTooltipRu({})).toMatch(/WORKSHOP2_B2B_3D_STREAM_URL/);
  });
});

describe('wave34 — wave34StagingLive probe', () => {
  it('aggregates wave34 checks', () => {
    const probe = buildWorkshop2Wave34StagingLiveProbe({ WORKSHOP2_MARKET: 'ru' });
    expect(typeof probe.wave34StagingLive).toBe('number');
    expect(probe.checks.some((c) => c.id === 'staging_live_verify_script')).toBe(true);
    expect(probe.wave34StagingLive).toBeGreaterThanOrEqual(7);
  });
});
