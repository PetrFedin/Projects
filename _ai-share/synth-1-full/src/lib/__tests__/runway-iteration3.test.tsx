/**
 * Iteration 3 — video specs validation, LCP hero, embed bridge, a11y contracts, CDN signing.
 */
import fs from 'node:fs';
import path from 'node:path';
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';

jest.mock('lucide-react', () => ({
  ShoppingCart: () => null,
}));
jest.mock('@/components/product/scroll-switcher/RunwaySectionNarrative', () => ({
  RunwaySectionNarrative: () => null,
}));
jest.mock('@/components/product/scroll-switcher/RunwayRichInfoPanel', () => ({
  RunwayRichInfoPanel: () => <div data-testid="info-panel" />,
}));
jest.mock('@/components/product/scroll-switcher/RunwayMoreMenu', () => ({
  RunwayMoreMenu: () => (
    <button type="button" aria-label="Ещё">
      Ещё
    </button>
  ),
}));
jest.mock('@/components/product/scroll-switcher/RunwaySocialProof', () => ({
  RunwaySocialProof: () => null,
}));
jest.mock('@/components/product/scroll-switcher/RunwayCompleteLook', () => ({
  RunwayCompleteLook: () => null,
}));
jest.mock('@/components/product/scroll-switcher/RunwayAttributionNote', () => ({
  RunwayAttributionNote: () => null,
}));
jest.mock('@/components/product/scroll-switcher/RunwaySectionStory', () => ({
  RunwaySectionStory: () => null,
}));

import {
  buildRunwayLcpHeroPayload,
  measureMsSinceNavigation,
  observeRunwayHeroLcp,
  readBufferedLcpMs,
  resolveRunwayLcpSampleRate,
  shouldEmitRunwayLcpHero,
  shouldSampleRunwayLcp,
} from '@/lib/runway/runway-lcp';
import {
  buildRunwayEmbedReadyMessages,
  buildRunwayEmbedResizeMessages,
  isRunwayEmbedResizeMessage,
} from '@/lib/runway/runway-embed-messages';
import {
  parseRunwayEmbedSectionIndex,
  resolveRunwayEmbedCompact,
} from '@/hooks/useRunwayEmbedBridge';
import {
  buildRunwayCdnSigningQuery,
  extractVideoCdnSigningPath,
  signRunwayVideoCdnUrl,
} from '@/lib/runway/runway-video-cdn-signing';
import { SwitcherProgress } from '@/components/product/scroll-switcher/SwitcherProgress';
import { RunwayCompactLayout } from '@/components/product/scroll-switcher/RunwayCompactLayout';
import type { RunwayOrchestrationContext } from '@/hooks/useRunwayExperienceOrchestration';
import type { Product } from '@/lib/types';

expect.extend(toHaveNoViolations);

const mockProduct: Product = {
  id: 'd4',
  slug: 'silk-midi-dress',
  name: 'Silk Midi Dress',
  brand: 'Syntha Atelier',
  price: 38900,
  description: 'Runway hero',
  images: [{ id: 'i', url: '/hero.jpg', alt: 'dress', hint: '' }],
  category: 'Dresses',
  sustainability: [],
  sku: 'SYN-D004',
  color: 'Sand',
  season: 'SS',
  displayMode: 'scroll-video',
  scrollSwitcherSections: [
    {
      id: 'sand',
      label: 'Песочный',
      color: '#C4A882',
      sectionImageUrl: '/images/demo/runway/silk-midi-dress-section-0.jpg',
      sectionStory: 'Story',
      sectionTitle: 'Title',
      sectionDescription: 'Desc',
      sectionLookItems: [],
    },
    {
      id: 'silver',
      label: 'Серебристый',
      color: '#C0C0C0',
      sectionImageUrl: '/images/demo/runway/silk-midi-dress-section-1.jpg',
      sectionStory: 'Story',
      sectionTitle: 'Title',
      sectionDescription: 'Desc',
      sectionLookItems: [],
    },
    {
      id: 'gold',
      label: 'Золотой',
      color: '#D4C876',
      sectionImageUrl: '/images/demo/runway/silk-midi-dress-section-2.jpg',
      sectionStory: 'Story',
      sectionTitle: 'Title',
      sectionDescription: 'Desc',
      sectionLookItems: [],
    },
  ],
};

function buildMinimalCompactCtx(): RunwayOrchestrationContext {
  const current = mockProduct.scrollSwitcherSections![0];
  return {
    product: mockProduct,
    onAddToCart: jest.fn(),
    compact: true,
    containerRef: { current: null },
    videoRef: { current: null },
    isDemoMode: false,
    systemPrefersReducedMotion: true,
    videoReady: true,
    setVideoReady: jest.fn(),
    videoLoading: false,
    setVideoLoading: jest.fn(),
    videoFailed: false,
    isFullscreen: false,
    pulseSection: null,
    liveSectionLabel: current.label,
    livePriceAnnouncement: '',
    compareTargetIndex: null,
    setCompareTargetIndex: jest.fn(),
    videoRetryKey: 0,
    cinematicVisible: true,
    markHeroVideoLoadedData: jest.fn(),
    cartUpsellVisible: false,
    setCartUpsellVisible: jest.fn(),
    showCheckoutShortcut: false,
    userPrefs: {
      reducedMotionOverride: null,
      scrollSensitivity: 1,
      ambientVideoEnabled: true,
      showStories: false,
      showCompleteLook: false,
    },
    updateUserPrefs: jest.fn(),
    runwayTheme: { accent: '#000', background: '#fff', foreground: '#111' },
    themeStyle: {},
    surface: 'pdp',
    shouldLoadMedia: true,
    viewModel: {
      sections: mockProduct.scrollSwitcherSections!,
      usesPerSectionVideo: true,
      hasVideo: true,
    } as RunwayOrchestrationContext['viewModel'],
    sections: mockProduct.scrollSwitcherSections!,
    usesPerSectionVideo: true,
    hasVideoSource: true,
    canUseVideo: true,
    scrollConfig: { showSocialProof: false } as RunwayOrchestrationContext['scrollConfig'],
    showAutoTour: false,
    prefersReducedMotion: true,
    progress: 0,
    activeSection: 0,
    handleTouchStart: jest.fn(),
    handleTouchMove: jest.fn(),
    handleTouchEnd: jest.fn(),
    autoTour: {
      isRunning: false,
      isComplete: false,
      startTour: jest.fn(),
      stopTour: jest.fn(),
    },
    sectionLabels: ['A', 'B', 'C'],
    favorites: {},
    current,
    videoSources: { mp4: '/videos/sections/silk-0.mp4' },
    adjacent: {},
    adjacentBrandProducts: [],
    socialProof: undefined,
    parallaxOffset: 0,
    stageImageUrl: current.sectionImageUrl,
    displayVariant: 'Sand',
    displayMaterial: 'Silk',
    displayDimensions: '',
    price: 38900,
    resolvedOriginalPrice: undefined,
    showStrikePrice: false,
    sectionAvailability: {},
    missingSize: false,
    lowStockQuantity: undefined,
    stageBackground: current.color,
    handleVideoError: jest.fn(),
    handleAddToCartClick: jest.fn(),
    handleMoreDetails: jest.fn(),
    handleWishlistToggle: jest.fn(),
    openCompareView: jest.fn(),
    toggleFullscreen: jest.fn(),
    isEmbedSurface: false,
    hasDemoAssets: false,
    showDemoChrome: false,
    lookCatalogProducts: [],
    addToCartLabel: 'В корзину',
    selectionSummary: '',
    requiresSize: false,
    availableSizes: ['S'],
    selectedSize: 'S',
    onSizeSelect: jest.fn(),
    showSizeGuide: false,
    onSizeGuideClick: jest.fn(),
    showWishlist: false,
    showShare: false,
    brandHref: undefined,
    variantSku: 'SYN-D004',
    madeInLabel: undefined,
    cashbackAmount: undefined,
    onToggleWishlist: undefined,
    isInWishlist: false,
  } as RunwayOrchestrationContext;
}

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
      value: jest.fn((type: string) => (type === 'navigation' ? [navEntry] : [])),
    });

    const payload = buildRunwayLcpHeroPayload('silk-midi-dress', 1200);
    expect(payload).toEqual({
      productSlug: 'silk-midi-dress',
      msSinceNavigation: 1100,
      connectionType: undefined,
      source: 'navigation',
    });
    expect(measureMsSinceNavigation(1200)).toBe(1100);

    perfNow.mockRestore();
  });

  it('shouldSampleRunwayLcp respects rate 1', () => {
    expect(shouldSampleRunwayLcp('a', 1)).toBe(true);
    expect(shouldSampleRunwayLcp('a', 0)).toBe(false);
  });

  it('shouldEmitRunwayLcpHero skips demo and e2e', () => {
    expect(shouldEmitRunwayLcpHero({ isDemoMode: true })).toBe(false);
    expect(shouldEmitRunwayLcpHero({ isE2eMode: true })).toBe(false);
    expect(shouldEmitRunwayLcpHero({ analyticsOptOut: true })).toBe(false);
    expect(shouldEmitRunwayLcpHero({})).toBe(true);
  });

  it('observeRunwayHeroLcp uses PerformanceObserver when available', () => {
    const disconnect = jest.fn();
    const onLcp = jest.fn();
    class MockPO {
      observe = jest.fn();
      disconnect = disconnect;
      constructor(cb: PerformanceObserverCallback) {
        cb({
          getEntries: () => [{ startTime: 842 }] as PerformanceEntryList,
        } as PerformanceObserverEntryList);
      }
    }
    (global as unknown as { PerformanceObserver: typeof PerformanceObserver }).PerformanceObserver =
      MockPO as unknown as typeof PerformanceObserver;

    Object.defineProperty(performance, 'getEntriesByType', {
      configurable: true,
      value: jest.fn(() => []),
    });

    const cleanup = observeRunwayHeroLcp(onLcp);
    expect(onLcp).toHaveBeenCalledWith(842);
    cleanup();
    expect(disconnect).toHaveBeenCalled();
  });

  it('readBufferedLcpMs reads performance buffer', () => {
    Object.defineProperty(performance, 'getEntriesByType', {
      configurable: true,
      value: jest.fn().mockReturnValue([{ startTime: 512 }]),
    });
    expect(readBufferedLcpMs()).toBe(512);
  });
});

describe('runway iteration3 — embed postMessage pure functions', () => {
  it('buildRunwayEmbedResizeMessages canonical shape', () => {
    const messages = buildRunwayEmbedResizeMessages(720.4, 'silk-midi-dress', 1);
    expect(messages[0]).toEqual({ type: 'runway:resize', height: 721 });
    expect(isRunwayEmbedResizeMessage(messages[0])).toBe(true);
    expect(messages[1]?.type).toBe('runway-embed-resize');
  });

  it('buildRunwayEmbedReadyMessages includes canonical + legacy', () => {
    const messages = buildRunwayEmbedReadyMessages('silk-midi-dress');
    expect(messages).toEqual([
      { type: 'runway:ready', slug: 'silk-midi-dress' },
      { type: 'data-runway-embed-ready', slug: 'silk-midi-dress' },
    ]);
  });

  it('parseRunwayEmbedSectionIndex clamps section query', () => {
    expect(parseRunwayEmbedSectionIndex('2', 3)).toBe(2);
    expect(parseRunwayEmbedSectionIndex('9', 3)).toBe(2);
    expect(parseRunwayEmbedSectionIndex('bad', 3)).toBeUndefined();
  });

  it('resolveRunwayEmbedCompact respects compact=0', () => {
    expect(resolveRunwayEmbedCompact('1')).toBe(true);
    expect(resolveRunwayEmbedCompact('0')).toBe(false);
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

  it('presign route signs publicUrl when RUNWAY_VIDEO_CDN_SIGNING_SECRET set', () => {
    const src = fs.readFileSync(
      path.join(process.cwd(), 'src/lib/server/runway-upload-presign.ts'),
      'utf8'
    );
    expect(src).toContain('signRunwayVideoCdnUrl');
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
    expect(src).toContain('runway-brand-video-specs.md');
  });

  it('runway-video-lint script exists', () => {
    expect(fs.existsSync(path.join(process.cwd(), 'scripts/runway-video-lint.mjs'))).toBe(true);
  });
});

describe('runway iteration3 — embed bridge page contract', () => {
  it('embed page uses bridge helpers and data-runway-embed marker', () => {
    const src = fs.readFileSync(
      path.join(process.cwd(), 'src/app/embed/runway/[slug]/page.tsx'),
      'utf8'
    );
    expect(src).toContain('useRunwayEmbedBridge');
    expect(src).toContain('parseRunwayEmbedAspectRatio');
    expect(src).toContain('parseRunwayEmbedSectionIndex');
    expect(src).toContain('resolveRunwayEmbedCompact');
    expect(src).toContain('data-runway-embed');
    expect(src).toContain('aspectRatio');
    expect(src).toContain('controlledSectionIndex');
  });
});

describe('runway iteration3 — a11y', () => {
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

  it('RunwayCompactLayout shell has no critical axe violations', async () => {
    const { container } = render(
      <RunwayCompactLayout
        ctx={buildMinimalCompactCtx()}
        stage={<div data-testid="stage">Stage</div>}
        compareFallbackRight={2}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
