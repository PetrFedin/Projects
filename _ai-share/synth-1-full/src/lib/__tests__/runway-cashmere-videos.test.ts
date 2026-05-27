/**
 * Cashmere hero SKU — отдельные sectionVideoUrl, не silk-* reuse.
 */
import fs from 'node:fs';
import path from 'node:path';
import type { Product } from '@/lib/types';

function loadScrollVideoProducts(): Product[] {
  const raw = fs.readFileSync(path.join(process.cwd(), 'public/data/products.json'), 'utf8');
  const products = JSON.parse(raw) as Product[];
  return products.filter((p) => p.displayMode === 'scroll-video');
}

describe('runway cashmere section videos', () => {
  it('cashmere sectionVideoUrl paths are unique vs silk-midi-dress', () => {
    const products = loadScrollVideoProducts();
    const silk = products.find((p) => p.slug === 'silk-midi-dress');
    const cashmere = products.find((p) => p.slug === 'cashmere-crewneck-sweater');

    expect(silk).toBeDefined();
    expect(cashmere).toBeDefined();

    const silkUrls = (silk!.scrollSwitcherSections ?? [])
      .map((s) => s.sectionVideoUrl)
      .filter(Boolean);
    const cashmereUrls = (cashmere!.scrollSwitcherSections ?? [])
      .map((s) => s.sectionVideoUrl)
      .filter(Boolean);

    expect(cashmereUrls).toHaveLength(3);
    for (const url of cashmereUrls) {
      expect(url).not.toMatch(/\/videos\/sections\/silk-\d+\.(mp4|webm)$/i);
      expect(silkUrls).not.toContain(url);
    }
    expect(new Set(cashmereUrls).size).toBe(3);
  });

  it('cashmere section mp4 files exist on disk', () => {
    const products = loadScrollVideoProducts();
    const cashmere = products.find((p) => p.slug === 'cashmere-crewneck-sweater');
    for (const s of cashmere?.scrollSwitcherSections ?? []) {
      const url = s.sectionVideoUrl;
      if (!url?.startsWith('/')) continue;
      const disk = path.join(process.cwd(), 'public', url);
      expect(fs.existsSync(disk)).toBe(true);
    }
  });

  it('validate-runway-content.mjs rejects silk paths on cashmere', () => {
    const src = fs.readFileSync(
      path.join(process.cwd(), 'scripts/validate-runway-content.mjs'),
      'utf8'
    );
    expect(src).toContain('cashmere_reuses_silk_video');
    expect(src).toContain('assertCashmereDoesNotReuseSilkVideos');
  });
});
