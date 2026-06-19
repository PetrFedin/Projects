#!/usr/bin/env node
/**
 * Патч public/data/products.json — scroll-video для 3 hero SKU.
 * oversized-hoodie-women остаётся standard (без scroll-video).
 *
 *   node scripts/patch-runway-hero-products.mjs [--apply]
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const productsPath = join(root, 'public/data/products.json');
const apply = process.argv.includes('--apply');

const HERO = [
  {
    slug: 'silk-midi-dress',
    prefix: 'silk',
    scrollVideoUrl: '/videos/sections/silk-0.mp4',
  },
  {
    slug: 'cashmere-crewneck-sweater',
    prefix: 'cashmere',
    scrollVideoUrl: '/videos/sections/cashmere-0.mp4',
  },
  {
    slug: 'tech-anorak-men',
    prefix: 'anorak',
    scrollVideoUrl: '/videos/sections/anorak-0.mp4',
  },
];

const STANDARD_SLUG = 'oversized-hoodie-women';

function buildSections(slug, prefix, productName) {
  const titles = ['Заголовок 1', 'Заголовок 2', 'Заголовок 3'];
  return [0, 1, 2].map((i) => ({
    id: `${slug}-s${i}`,
    label: `Вариант ${['I', 'II', 'III'][i]}`,
    color: ['#C4A882', '#C0C0C0', '#D4C876'][i],
    sectionImageUrl: `/images/demo/runway/${slug}-section-${i}.jpg`,
    posterUrl: `/images/demo/runway/${slug}-section-${i}.jpg`,
    sectionVideoUrl: `/videos/sections/${prefix}-${i}.mp4`,
    sectionStory: `История секции ${i + 1} для ${slug}.`,
    sectionTitle: titles[i],
    sectionDescription: `Описание варианта ${i + 1}.`,
    sectionLookItems: [
      {
        name: 'Look Item A',
        price: 8900,
        imageUrl: '/images/demo/runway/look-a.jpg',
        slug: 'look-item-a',
        sortOrder: 0,
      },
      {
        name: 'Look Item B',
        price: 12900,
        imageUrl: '/images/demo/runway/look-b.jpg',
        slug: 'look-item-b',
        sortOrder: 1,
      },
    ],
  }));
}

const products = JSON.parse(readFileSync(productsPath, 'utf8'));
const changes = [];

for (const hero of HERO) {
  const idx = products.findIndex((p) => p.slug === hero.slug);
  if (idx < 0) {
    console.warn(`[skip] ${hero.slug} not in catalog`);
    continue;
  }
  const p = products[idx];
  const sections = buildSections(hero.slug, hero.prefix, p.name);
  const patch = {
    displayMode: 'scroll-video',
    scrollVideoUrl: hero.scrollVideoUrl,
    scrollSwitcherSections: sections,
  };
  changes.push({ slug: hero.slug, patch });
  if (apply) {
    products[idx] = { ...p, ...patch };
  }
}

const hoodieIdx = products.findIndex((p) => p.slug === STANDARD_SLUG);
if (hoodieIdx >= 0 && apply) {
  const { displayMode: _dm, scrollSwitcherSections: _ss, scrollVideoUrl: _sv, ...rest } =
    products[hoodieIdx];
  products[hoodieIdx] = rest;
  changes.push({ slug: STANDARD_SLUG, patch: { removed: 'scroll-video fields' } });
}

if (!apply) {
  console.log(JSON.stringify({ dryRun: true, changes }, null, 2));
  process.exit(0);
}

writeFileSync(productsPath, `${JSON.stringify(products, null, 2)}\n`, 'utf8');
console.log(`[OK] patched ${changes.length} product(s) → ${productsPath}`);
