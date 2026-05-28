/**
 * LEAN runway — loadRunwayProduct merge с секциями flagship SKU.
 */
import fs from 'node:fs';
import path from 'node:path';
import {
  loadRunwayProduct,
  resetRunwayExperienceCache,
} from '@/lib/runway/RunwayExperienceService';
import type { Product } from '@/lib/types';

const catalogPath = path.join(process.cwd(), 'public/data/products.json');

describe('loadRunwayProduct (lean hero SKU)', () => {
  beforeEach(() => {
    resetRunwayExperienceCache();
    const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8')) as Product[];

    global.fetch = jest.fn(async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url.includes('/data/products.json')) {
        return { ok: true, json: async () => catalog } as Response;
      }
      if (url.includes('/api/runway/product-config')) {
        return { ok: true, json: async () => ({ patches: {} }) } as Response;
      }
      if (url.includes('/api/runway/config') || url.includes('/data/scroll-experience.json')) {
        return { ok: false, json: async () => ({}) } as Response;
      }
      return { ok: false, json: async () => ({}) } as Response;
    }) as typeof fetch;
  });

  it('silk-midi-dress returns merged product with scrollSwitcherSections', async () => {
    const product = await loadRunwayProduct('silk-midi-dress');
    expect(product).not.toBeNull();
    expect(product?.slug).toBe('silk-midi-dress');
    expect(product?.displayMode).toBe('scroll-video');
    const sections = product?.scrollSwitcherSections ?? [];
    expect(sections.length).toBe(3);
    expect(sections[0]?.sectionImageUrl ?? sections[0]?.thumbImageUrl).toBeTruthy();
  });
});
