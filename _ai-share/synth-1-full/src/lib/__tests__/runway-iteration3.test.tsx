/**
 * Iteration 3 — video specs validation, LCP hero, embed bridge, a11y contracts, CDN signing.
 */
import fs from 'node:fs';
import path from 'node:path';
import { render, screen } from '@testing-library/react';
import {
  buildRunwayLcpHeroPayload,
  measureMsSinceNavigation,
  resolveRunwayLcpSampleRate,
  shouldSampleRunwayLcp,
} from '@/lib/runway/runway-lcp';
import {
  buildRunwayCdnSigningQuery,
  extractVideoCdnSigningPath,
  signRunwayVideoCdnUrl,
} from '@/lib/runway/runway-video-cdn-signing';
import { SwitcherProgress } from '@/components/product/scroll-switcher/SwitcherProgress';

describe('runway iteration3 — LCP hero', () => {
  const prevRate = process.env.NEXT_PUBLIC_RUNWAY_LCP_SAMPLE_RATE;

  afterEach(() => {
    if (prevRate === undefined) delete process.env.NEXT_PUBLIC_RUNWAY_LCP_SAMPLE_RATE;
    else process.env.NEXT_PUBLIC_RUNWAY_LCP_SAMPLE_RATE = prevRate;
  });

  it('resolveRunwayLcpSampleRate reads env override', () => {
    process.env.NEXT_PUBLIC_RUNWAY_LCP_SAMPLE_RATE = '0.25';
    expect(resolveRunwayLcpSampleRate()).toBe(0.25);
  });

  it('buildRunwayLcpHeroPayload shape', () => {
    const perfNow = jest.spyOn(performance, 'now').mockReturnValue(1200);
    const navEntry = { startTime: 100 } as PerformanceNavigationTiming;
    Object.defineProperty(performance, 'getEntriesByType', {
      configurable: true,
      value: jest.fn().mockReturnValue([navEntry]),
    });

    const payload = buildRunwayLcpHeroPayload('silk-midi-dress', 1200);
    expect(payload).toEqual({
      productSlug: 'silk-midi-dress',
      msSinceNavigation: 1100,
      connectionType: undefined,
    });
    expect(measureMsSinceNavigation(1200)).toBe(1100);

    perfNow.mockRestore();
  });

  it('shouldSampleRunwayLcp respects rate 1', () => {
    expect(shouldSampleRunwayLcp('a', 1)).toBe(true);
    expect(shouldSampleRunwayLcp('a', 0)).toBe(false);
  });
});

describe('runway iteration3 — CDN HMAC signing', () => {
  const prevSecret = process.env.RUNWAY_VIDEO_CDN_SIGNING_SECRET;

  afterEach(() => {
    if (prevSecret === undefined) delete process.env.RUNWAY_VIDEO_CDN_SIGNING_SECRET;
    else process.env.RUNWAY_VIDEO_CDN_SIGNING_SECRET = prevSecret;
  });

  it('buildRunwayCdnSigningQuery is deterministic', () => {
    const q = buildRunwayCdnSigningQuery('/videos/sections/foo-0.mp4', 'secret', 1_700_000_000);
    expect(q).toMatch(/^runway_sig=[a-f0-9]+&runway_exp=1700003600$/);
  });

  it('extractVideoCdnSigningPath strips query', () => {
    expect(extractVideoCdnSigningPath('https://cdn.test/videos/a.mp4?x=1')).toBe('/videos/a.mp4');
  });

  it('signRunwayVideoCdnUrl appends token when secret set', () => {
    process.env.RUNWAY_VIDEO_CDN_SIGNING_SECRET = 'test-secret';
    const signed = signRunwayVideoCdnUrl('https://cdn.test/videos/a.mp4');
    expect(signed).toContain('runway_sig=');
    expect(signed).toContain('runway_exp=');
  });

  it('signing module stays server-only (no import from client scroll-switcher chain)', () => {
    const scrollSrc = fs.readFileSync(
      path.join(process.cwd(), 'src/lib/product-scroll-switcher.ts'),
      'utf8'
    );
    expect(scrollSrc).not.toContain('runway-video-cdn-signing');
  });
});

describe('runway iteration3 — validate-runway-content warnings', () => {
  it('script warns on large video and missing webm', () => {
    const src = fs.readFileSync(
      path.join(process.cwd(), 'scripts/validate-runway-content.mjs'),
      'utf8'
    );
    expect(src).toContain('warnVideoFileQuality');
    expect(src).toContain('missing_webm_companion');
    expect(src).toContain('video_file_too_large');
    expect(src).toContain('VIDEO_MAX_BYTES');
  });
});

describe('runway iteration3 — embed bridge', () => {
  it('embed page uses useRunwayEmbedBridge and aspect shell', () => {
    const src = fs.readFileSync(
      path.join(process.cwd(), 'src/app/embed/runway/[slug]/page.tsx'),
      'utf8'
    );
    expect(src).toContain('useRunwayEmbedBridge');
    expect(src).toContain('data-runway-embed');
    expect(src).toContain('aspectRatio');
  });

  it('useRunwayEmbedBridge posts ready and resize types', () => {
    const src = fs.readFileSync(
      path.join(process.cwd(), 'src/hooks/useRunwayEmbedBridge.ts'),
      'utf8'
    );
    expect(src).toContain("'data-runway-embed-ready'");
    expect(src).toContain("'runway-embed-resize'");
  });
});

describe('runway iteration3 — a11y aria on switcher chrome', () => {
  it('SwitcherProgress dots expose aria-label per section', () => {
    render(
      <SwitcherProgress
        progress={0}
        sectionCount={3}
        activeSection={0}
        sectionLabels={['A', 'B', 'C']}
        variant="dots"
      />
    );
    expect(screen.getByRole('navigation')).toHaveAttribute('aria-label');
    expect(screen.getAllByRole('button')).toHaveLength(3);
    for (const btn of screen.getAllByRole('button')) {
      expect(btn.getAttribute('aria-label')).toBeTruthy();
    }
  });

  it('RunwayMoreMenu and CompactLayout expose required aria labels', () => {
    const menuSrc = fs.readFileSync(
      path.join(process.cwd(), 'src/components/product/scroll-switcher/RunwayMoreMenu.tsx'),
      'utf8'
    );
    expect(menuSrc).toContain("t('runway.moreMenu.title')");
    expect(menuSrc).toContain('aria-label');
    const layoutSrc = fs.readFileSync(
      path.join(process.cwd(), 'src/components/product/scroll-switcher/RunwayCompactLayout.tsx'),
      'utf8'
    );
    const barSrc = fs.readFileSync(
      path.join(process.cwd(), 'src/components/product/scroll-switcher/SwitcherBar.tsx'),
      'utf8'
    );
    expect(layoutSrc).toContain('RunwayMoreMenu');
    expect(barSrc).toContain("t('runway.thumb.aria'");
    expect(barSrc).toContain('aria-selected');
  });
});
