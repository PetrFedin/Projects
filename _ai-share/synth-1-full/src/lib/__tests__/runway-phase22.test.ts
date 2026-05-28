/**
 * Phase 22 — staging smoke, webhook retry, presign, CDN API, LCP video priority.
 */

import fs from 'node:fs';
import path from 'node:path';
import {
  buildRunwayWebhookIdempotencyKey,
  deliverRunwayAnalyticsWebhook,
  RUNWAY_WEBHOOK_MAX_ATTEMPTS,
} from '@/lib/server/runway-analytics-webhook';
import {
  createRunwayUploadPresign,
  isRunwayUploadPresignEnabled,
} from '@/lib/server/runway-upload-presign';
import { resolveAnalyticsWebhookUrl } from '@/lib/runway/scroll-experience-schema';
import type { ScrollExperienceEventLogEntry } from '@/lib/scroll-experience-analytics';

describe('runway phase22 staging smoke script', () => {
  it('scripts/runway-staging-smoke.mjs exists with Russian output and checks', () => {
    const src = fs.readFileSync(
      path.join(process.cwd(), 'scripts/runway-staging-smoke.mjs'),
      'utf8'
    );
    expect(src).toContain('BASE_URL');
    expect(src).toContain('/api/runway/health');
    expect(src).toContain('analyticsEnabled');
    expect(src).toContain('silk-midi-dress?view=runway');
    expect(src).toContain('/api/runway/upload/presign');
    expect(src).toContain('Staging smoke');
  });

  it('package.json exposes smoke:runway-staging', () => {
    const pkg = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf8'));
    expect(pkg.scripts['smoke:runway-staging']).toContain('runway-staging-smoke.mjs');
  });
});

describe('runway phase22 webhook retry', () => {
  const events: ScrollExperienceEventLogEntry[] = [
    {
      event: 'scroll_experience_view',
      productSlug: 'silk-midi-dress',
      timestamp: 1716724800000,
    },
  ];

  it('buildRunwayWebhookIdempotencyKey is stable for same batch', () => {
    const key = buildRunwayWebhookIdempotencyKey(events, '2026-05-26T12:00:00.000Z');
    expect(key).toHaveLength(64);
    expect(buildRunwayWebhookIdempotencyKey(events, '2026-05-26T12:00:00.000Z')).toBe(key);
  });

  it('deliverRunwayAnalyticsWebhook retries up to 3 with Idempotency-Key', async () => {
    const fetchMock = jest
      .fn()
      .mockResolvedValueOnce({ ok: false, status: 503 })
      .mockResolvedValueOnce({ ok: false, status: 503 })
      .mockResolvedValueOnce({ ok: true, status: 200 });

    const sleeps: number[] = [];
    const failures: unknown[] = [];

    const result = await deliverRunwayAnalyticsWebhook('https://mock.test/hook', events, {
      fetchImpl: fetchMock as typeof fetch,
      sleepMs: async (ms) => {
        sleeps.push(ms);
      },
      logFailure: async (entry) => {
        failures.push(entry);
      },
    });

    expect(result.delivered).toBe(true);
    expect(result.attempts).toBe(3);
    expect(fetchMock).toHaveBeenCalledTimes(3);
    expect(failures).toHaveLength(0);
    expect(fetchMock.mock.calls[0]?.[1]?.headers?.['Idempotency-Key']).toBeTruthy();
    expect(sleeps).toEqual([500, 1500]);
  });

  it('deliverRunwayAnalyticsWebhook logs failure after max attempts', async () => {
    const fetchMock = jest.fn().mockResolvedValue({ ok: false, status: 500 });
    const failures: unknown[] = [];

    const result = await deliverRunwayAnalyticsWebhook('https://mock.test/hook', events, {
      fetchImpl: fetchMock as typeof fetch,
      sleepMs: async () => undefined,
      logFailure: async (entry) => {
        failures.push(entry);
      },
    });

    expect(result.delivered).toBe(false);
    expect(result.attempts).toBe(RUNWAY_WEBHOOK_MAX_ATTEMPTS);
    expect(fetchMock).toHaveBeenCalledTimes(RUNWAY_WEBHOOK_MAX_ATTEMPTS);
    expect(failures).toHaveLength(1);
  });

  it('resolveAnalyticsWebhookUrl prefers RUNWAY_ANALYTICS_WEBHOOK_URL env', () => {
    const prev = process.env.RUNWAY_ANALYTICS_WEBHOOK_URL;
    process.env.RUNWAY_ANALYTICS_WEBHOOK_URL = 'https://env.example/hook';
    expect(resolveAnalyticsWebhookUrl({ analyticsWebhookUrl: 'https://json.example/hook' })).toBe(
      'https://env.example/hook'
    );
    if (prev === undefined) delete process.env.RUNWAY_ANALYTICS_WEBHOOK_URL;
    else process.env.RUNWAY_ANALYTICS_WEBHOOK_URL = prev;
  });
});

describe('runway phase22 presign and CDN API', () => {
  it('upload/presign route exists', () => {
    const src = fs.readFileSync(
      path.join(process.cwd(), 'src/app/api/runway/upload/presign/route.ts'),
      'utf8'
    );
    expect(src).toContain('isRunwayUploadPresignEnabled');
    expect(src).toContain('503');
  });

  it('config/brand-cdn route patches scroll-experience', () => {
    const src = fs.readFileSync(
      path.join(process.cwd(), 'src/app/api/runway/config/brand-cdn/route.ts'),
      'utf8'
    );
    expect(src).toContain('patchBrandVideoCdnBaseUrl');
  });

  it('BrandRunwayPreviewTab calls brand-cdn and presign APIs', () => {
    const src = fs.readFileSync(
      path.join(process.cwd(), 'src/components/brand/BrandRunwayPreviewTab.tsx'),
      'utf8'
    );
    expect(src).toContain('/api/runway/config/brand-cdn');
    expect(src).toContain('/api/runway/upload/presign');
  });

  it('isRunwayUploadPresignEnabled respects RUNWAY_UPLOAD_ENABLED', () => {
    const prev = process.env.RUNWAY_UPLOAD_ENABLED;
    process.env.RUNWAY_UPLOAD_ENABLED = '1';
    expect(isRunwayUploadPresignEnabled()).toBe(true);
    delete process.env.RUNWAY_UPLOAD_ENABLED;
    expect(isRunwayUploadPresignEnabled()).toBe(false);
    if (prev !== undefined) process.env.RUNWAY_UPLOAD_ENABLED = prev;
  });

  it('createRunwayUploadPresign throws when disabled', async () => {
    const prev = process.env.RUNWAY_UPLOAD_ENABLED;
    delete process.env.RUNWAY_UPLOAD_ENABLED;
    await expect(createRunwayUploadPresign({ brandSlug: 'nordic-wool' })).rejects.toThrow(
      /disabled|RUNWAY_UPLOAD_ENABLED/i
    );
    if (prev !== undefined) process.env.RUNWAY_UPLOAD_ENABLED = prev;
  });
});

describe('runway phase22 openapi', () => {
  it('openapi yaml documents presign and brand-cdn', () => {
    const yaml = fs.readFileSync(path.join(process.cwd(), 'docs/runway-api.openapi.yaml'), 'utf8');
    expect(yaml).toContain('/upload/presign');
    expect(yaml).toContain('/config/brand-cdn');
  });

  it('openapi json is valid OpenAPI 3.1 with presign path', () => {
    const doc = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), 'docs/runway-api.openapi.json'), 'utf8')
    );
    expect(doc.openapi).toBe('3.1.0');
    expect(doc.paths['/upload/presign']).toBeTruthy();
    expect(doc.paths['/config/brand-cdn']).toBeTruthy();
  });
});

describe('runway phase22 video LCP priority', () => {
  it('SwitcherStage sets hero fetchPriority and preload attrs', () => {
    const src = fs.readFileSync(
      path.join(process.cwd(), 'src/components/product/scroll-switcher/SwitcherStage.tsx'),
      'utf8'
    );
    expect(src).toContain("fetchPriority={isHeroSection ? 'high' : 'auto'}");
    expect(src).toContain('data-runway-video-preload');
    expect(src).toContain('data-runway-hero-priority');
    expect(src).toMatch(/isHeroSection \? 'auto' : 'metadata'/);
  });
});

describe('runway phase22 first brand deploy', () => {
  it('docs/runway-first-brand-deploy.md has 15-step checklist', () => {
    const doc = fs.readFileSync(
      path.join(process.cwd(), 'docs/runway-first-brand-deploy.md'),
      'utf8'
    );
    expect(doc).toContain('15 шагов');
    expect(doc).toContain('smoke:runway-staging');
  });

  it('runway-onboard-brand prints smoke command', () => {
    const src = fs.readFileSync(
      path.join(process.cwd(), 'scripts/runway-onboard-brand.mjs'),
      'utf8'
    );
    expect(src).toContain('smoke:runway-staging');
  });
});
