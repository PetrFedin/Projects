/**
 * Brand deploy readiness — CDN merge priority, presign paths, API routes.
 */
import fs from 'node:fs';
import path from 'node:path';
import {
  mergeBrandVideoCdnSources,
  resolveBrandVideoCdnBaseUrl,
} from '@/lib/brand-runway-overrides';
import {
  buildRunwayVideoStorageKey,
  isRunwayUploadPresignEnabled,
  isRunwayUploadS3Configured,
  sanitizeRunwayProductSlug,
} from '@/lib/server/runway-upload-presign';

describe('runway brand CDN merge', () => {
  it('resolveBrandVideoCdnBaseUrl prefers API config over localStorage', () => {
    const url = resolveBrandVideoCdnBaseUrl(
      'Nordic Wool',
      { brandVideoCdnBaseUrl: { 'Nordic Wool': 'https://api.cdn' } },
      { 'Nordic Wool': 'https://local.cdn' }
    );
    expect(url).toBe('https://api.cdn');
  });

  it('resolveBrandVideoCdnBaseUrl falls back to localStorage when API empty', () => {
    const url = resolveBrandVideoCdnBaseUrl(
      'Nordic Wool',
      {},
      { 'Nordic Wool': 'https://local.cdn' }
    );
    expect(url).toBe('https://local.cdn');
  });

  it('mergeBrandVideoCdnSources overlays API map onto local cache', () => {
    const merged = mergeBrandVideoCdnSources(
      { brandVideoCdnBaseUrl: { A: 'https://from-api' } },
      { A: 'https://local-only', B: 'https://offline-b' }
    );
    expect(merged.brandVideoCdnBaseUrl?.A).toBe('https://from-api');
    expect(merged.brandVideoCdnBaseUrl?.B).toBe('https://offline-b');
  });
});

describe('runway upload presign paths', () => {
  it('buildRunwayVideoStorageKey uses videos/sections/{slug}-{n}.mp4', () => {
    expect(
      buildRunwayVideoStorageKey({
        brandSlug: 'nordic-wool',
        productSlug: 'cashmere-crewneck',
        sectionIndex: 2,
      })
    ).toBe('videos/sections/cashmere-crewneck-2.mp4');
  });

  it('buildRunwayVideoStorageKey hero path without sectionIndex', () => {
    expect(
      buildRunwayVideoStorageKey({
        brandSlug: 'nordic-wool',
        productSlug: 'silk-midi-dress',
      })
    ).toBe('videos/silk-midi-dress-hero.mp4');
  });

  it('sanitizeRunwayProductSlug rejects path traversal', () => {
    expect(sanitizeRunwayProductSlug('../evil')).toBeNull();
    expect(sanitizeRunwayProductSlug('silk-midi-dress')).toBe('silk-midi-dress');
  });
});

describe('runway brand deploy API surface', () => {
  it('brand-cdn and upload presign routes exist', () => {
    expect(
      fs.existsSync(path.join(process.cwd(), 'src/app/api/runway/config/brand-cdn/route.ts'))
    ).toBe(true);
    expect(
      fs.existsSync(path.join(process.cwd(), 'src/app/api/runway/upload/presign/route.ts'))
    ).toBe(true);
  });

  it('BrandRunwayPreviewTab loads config API and presign upload', () => {
    const src = fs.readFileSync(
      path.join(process.cwd(), 'src/components/brand/BrandRunwayPreviewTab.tsx'),
      'utf8'
    );
    expect(src).toContain('/api/runway/config');
    expect(src).toContain('/api/runway/config/brand-cdn');
    expect(src).toContain('/api/runway/upload/presign');
    expect(src).toContain('sectionIndex');
  });

  it('presign helpers are env-gated', () => {
    const prev = process.env.RUNWAY_UPLOAD_ENABLED;
    delete process.env.RUNWAY_UPLOAD_ENABLED;
    expect(isRunwayUploadPresignEnabled()).toBe(false);
    expect(isRunwayUploadS3Configured()).toBe(false);
    if (prev !== undefined) process.env.RUNWAY_UPLOAD_ENABLED = prev;
  });
});
