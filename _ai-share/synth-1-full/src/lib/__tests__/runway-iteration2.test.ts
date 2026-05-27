/**
 * Iteration 2 — media fallback chain, poster/OG, visual polish contracts.
 */
import fs from 'node:fs';
import path from 'node:path';
import {
  hasPlayableVideoSource,
  resolveRunwayMediaFallback,
  safeResolveVideoCdnUrl,
} from '@/lib/runway/runway-media-fallback';
import { RUNWAY_HERO_OG_IMAGES, resolveRunwayHeroOgImagePath } from '@/lib/runway/runway-og-images';
import { buildRunwayProductMetadata } from '@/lib/runway-metadata';
import { resolveSectionPosterUrl, resolveSectionVideoSources } from '@/lib/product-scroll-switcher';
import type { Product } from '@/lib/types';

const scrollProduct: Product = {
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
  scrollVideoUrl: '/videos/sections/silk-0.mp4',
  scrollSwitcherSections: [
    {
      id: 'sand',
      label: 'Песочный',
      color: '#C4A882',
      sectionImageUrl: '/images/demo/runway/silk-midi-dress-section-0.jpg',
      posterUrl: '/images/demo/runway/silk-midi-dress-section-0.jpg',
      sectionVideoUrl: '/videos/sections/silk-0.mp4',
      sectionStory: 'Story',
      sectionTitle: 'Title',
      sectionDescription: 'Desc',
      sectionLookItems: [
        { name: 'A', price: 100, imageUrl: '/a.jpg', slug: 'a' },
        { name: 'B', price: 200, imageUrl: '/b.jpg', slug: 'b' },
      ],
    },
    {
      id: 'silver',
      label: 'Серебристый',
      color: '#C0C0C0',
      sectionImageUrl: '/images/demo/runway/silk-midi-dress-section-1.jpg',
      posterUrl: '/images/demo/runway/silk-midi-dress-section-1.jpg',
      sectionStory: 'Story',
      sectionTitle: 'Title',
      sectionDescription: 'Desc',
      sectionLookItems: [
        { name: 'A', price: 100, imageUrl: '/a.jpg', slug: 'a' },
        { name: 'B', price: 200, imageUrl: '/b.jpg', slug: 'b' },
      ],
    },
    {
      id: 'gold',
      label: 'Золотой',
      color: '#D4C876',
      sectionImageUrl: '/images/demo/runway/silk-midi-dress-section-2.jpg',
      posterUrl: '/images/demo/runway/silk-midi-dress-section-2.jpg',
      sectionStory: 'Story',
      sectionTitle: 'Title',
      sectionDescription: 'Desc',
      sectionLookItems: [
        { name: 'A', price: 100, imageUrl: '/a.jpg', slug: 'a' },
        { name: 'B', price: 200, imageUrl: '/b.jpg', slug: 'b' },
      ],
    },
  ],
};

describe('runway iteration2 media fallback', () => {
  it('safeResolveVideoCdnUrl returns undefined for invalid CDN https requirement', () => {
    expect(safeResolveVideoCdnUrl('/videos/a.mp4', { baseUrl: 'https://cdn.test' })).toBe(
      'https://cdn.test/videos/a.mp4'
    );
    expect(safeResolveVideoCdnUrl('/videos/a.mp4', { baseUrl: 'http://bad.test' })).toBeUndefined();
  });

  it('resolveRunwayMediaFallback disables video after error and keeps stage image', () => {
    const sources = {
      mp4: '/videos/sections/silk-0.mp4',
      poster: '/images/demo/runway/silk-midi-dress-section-0.jpg',
    };
    const ok = resolveRunwayMediaFallback({
      videoSources: sources,
      stageImageUrl: '/images/demo/runway/silk-midi-dress-section-0.jpg',
      sectionColor: '#C4A882',
      videoFailed: false,
      prefersReducedMotion: false,
      ambientVideoEnabled: true,
      shouldLoadMedia: true,
    });
    expect(ok.canUseVideo).toBe(true);
    expect(ok.showVideoErrorOverlay).toBe(false);

    const failed = resolveRunwayMediaFallback({
      videoSources: sources,
      stageImageUrl: '/images/demo/runway/silk-midi-dress-section-0.jpg',
      sectionColor: '#C4A882',
      videoFailed: true,
      prefersReducedMotion: false,
      ambientVideoEnabled: true,
      shouldLoadMedia: true,
    });
    expect(failed.canUseVideo).toBe(false);
    expect(failed.stageImageUrl).toContain('silk-midi-dress-section-0');
    expect(failed.showVideoErrorOverlay).toBe(true);
    expect(failed.stageBackground).toBe('#C4A882');
  });

  it('resolveRunwayMediaFallback respects reduced motion', () => {
    const result = resolveRunwayMediaFallback({
      videoSources: { mp4: '/videos/a.mp4' },
      stageImageUrl: '/hero.jpg',
      sectionColor: '#000',
      videoFailed: false,
      prefersReducedMotion: true,
      ambientVideoEnabled: true,
      shouldLoadMedia: true,
    });
    expect(result.canUseVideo).toBe(false);
    expect(hasPlayableVideoSource({ mp4: '/videos/a.mp4' })).toBe(true);
  });

  it('resolveSectionVideoSources returns empty when CDN url invalid', () => {
    const product: Product = {
      ...scrollProduct,
      scrollVideoUrl: '/videos/broken.mp4',
    };
    const sources = resolveSectionVideoSources(product, undefined, 0, {
      videoCdnBaseUrl: 'http://insecure-cdn.test',
    } as never);
    expect(sources.mp4).toBeUndefined();
    expect(sources.webm).toBeUndefined();
  });
});

describe('runway iteration2 poster and OG', () => {
  it('resolveSectionPosterUrl prefers posterUrl over section image', () => {
    const section = scrollProduct.scrollSwitcherSections![0]!;
    expect(resolveSectionPosterUrl(scrollProduct, section, 0)).toBe(
      '/images/demo/runway/silk-midi-dress-section-0.jpg'
    );
  });

  it('hero OG paths exist for silk and cashmere', () => {
    expect(RUNWAY_HERO_OG_IMAGES['silk-midi-dress']).toContain('silk-midi-dress-section-0');
    expect(RUNWAY_HERO_OG_IMAGES['cashmere-crewneck-sweater']).toContain(
      'cashmere-crewneck-sweater-section-0'
    );
    for (const rel of Object.values(RUNWAY_HERO_OG_IMAGES)) {
      expect(fs.existsSync(path.join(process.cwd(), 'public', rel))).toBe(true);
    }
  });

  it('buildRunwayProductMetadata uses runway OG for ?view=runway', () => {
    const meta = buildRunwayProductMetadata(scrollProduct, { view: 'runway', section: '1' });
    expect(meta.isRunway).toBe(true);
    expect(meta.imageUrl).toContain('silk-midi-dress-section-1');
    expect(meta.title).toContain('Серебристый');
  });

  it('resolveRunwayHeroOgImagePath falls back to hero map', () => {
    expect(resolveRunwayHeroOgImagePath('silk-midi-dress')).toBe(
      RUNWAY_HERO_OG_IMAGES['silk-midi-dress']
    );
  });
});

describe('runway iteration2 visual contracts', () => {
  it('SwitcherStage uses 300ms transitions and background color tween', () => {
    const src = fs.readFileSync(
      path.join(process.cwd(), 'src/components/product/scroll-switcher/SwitcherStage.tsx'),
      'utf8'
    );
    expect(src).toContain('duration-300');
    expect(src).toContain('transition-[background-color] duration-300');
  });

  it('SwitcherBar supports thumb keyboard nav and active scale ring', () => {
    const src = fs.readFileSync(
      path.join(process.cwd(), 'src/components/product/scroll-switcher/SwitcherBar.tsx'),
      'utf8'
    );
    expect(src).toContain('role="tablist"');
    expect(src).toContain('onKeyDown={handleBarKeyDown}');
    expect(src).toContain('scale-[1.02]');
    expect(src).not.toContain('animate-runway-thumb-pulse');
  });

  it('RunwayMediaController shows RU error overlay with retry', () => {
    const src = fs.readFileSync(
      path.join(process.cwd(), 'src/components/product/scroll-switcher/RunwayMediaController.tsx'),
      'utf8'
    );
    expect(src).toContain('runway.videoErrorTitle');
    expect(src).toContain('data-runway-video-retry');
    expect(src).toContain('min-h-[44px]');
  });

  it('RunwayCompactLayout mobile bar uses safe-area and 44px cart', () => {
    const src = fs.readFileSync(
      path.join(process.cwd(), 'src/components/product/scroll-switcher/RunwayCompactLayout.tsx'),
      'utf8'
    );
    expect(src).toContain('env(safe-area-inset-bottom)');
    expect(src).toContain('min-h-[44px]');
  });

  it('validate-runway-content checks posterUrl on disk', () => {
    const src = fs.readFileSync(
      path.join(process.cwd(), 'scripts/validate-runway-content.mjs'),
      'utf8'
    );
    expect(src).toContain('posterUrl');
    expect(src).toContain('missing_poster');
  });
});
