#!/usr/bin/env node
/**
 * Включает scroll-video (runway) для SKU в products.json.
 *
 * Usage:
 *   node scripts/runway-enable-product.mjs <slug> [--apply]
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const productsPath = join(root, 'public/data/products.json');
const patchesDir = join(root, 'data/runway-product-patches');

const slug = process.argv[2]?.trim();
const apply = process.argv.includes('--apply');

if (!slug) {
  console.error('Usage: node scripts/runway-enable-product.mjs <slug> [--apply]');
  process.exit(1);
}

const products = JSON.parse(readFileSync(productsPath, 'utf8'));
const index = products.findIndex((p) => p.slug === slug);

if (index < 0) {
  console.error(JSON.stringify({ ok: false, error: `Product not found: ${slug}` }, null, 2));
  process.exit(1);
}

const product = products[index];

function formatComposition(composition) {
  if (!composition?.length) return undefined;
  return composition.map((c) => `${c.percentage}% ${c.material}`).join(', ');
}

function buildSectionsFromColors(p) {
  const colors = (p.availableColors ?? []).filter((c) => c.status !== 'disabled').slice(0, 3);
  if (colors.length === 0) return null;

  return colors.map((color, i) => ({
    id: color.id || `section-${i}`,
    label: color.name,
    color: color.hex,
    colorName: color.name,
    variantSku: `${p.sku}-${color.name}`,
    material: p.material ?? formatComposition(p.composition),
    thumbImageUrl: p.images?.[i]?.url ?? p.images?.[0]?.url,
    sectionImageUrl: p.images?.[i]?.url ?? p.images?.[0]?.url,
    sectionStory: p.description?.slice(0, 200) || `${p.name} — ${color.name}`,
    sectionLookItems: (p.relatedProducts ?? []).slice(0, 2).map((rp, j) => ({
      slug: typeof rp === 'string' ? rp : rp.slug,
      label: typeof rp === 'string' ? rp : rp.name ?? rp.slug,
      sortOrder: j,
    })),
  }));
}

function validateSections(sections, p) {
  const issues = [];
  if (!sections?.length) {
    issues.push({ code: 'missing_sections', message: 'Нет scrollSwitcherSections и не удалось сгенерировать из availableColors' });
    return issues;
  }
  if (sections.length !== 3) {
    issues.push({ code: 'section_count', message: `Ожидается 3 секции, найдено ${sections.length}` });
  }
  sections.forEach((s, i) => {
    const img = s.sectionImageUrl ?? s.thumbImageUrl;
    if (!img) {
      issues.push({ code: 'missing_image', message: `section ${i}: нет изображения`, sectionIndex: i });
    } else if (img.startsWith('/')) {
      const disk = join(root, 'public', img);
      if (!existsSync(disk)) {
        issues.push({ code: 'missing_file', message: `section ${i}: файл не найден ${img}`, sectionIndex: i });
      }
    }
  });
  if (!p.description?.trim()) {
    issues.push({ code: 'missing_description', message: 'Пустое description' });
  }
  return issues;
}

const existingSections = product.scrollSwitcherSections?.length
  ? product.scrollSwitcherSections
  : buildSectionsFromColors(product);

const validationIssues = validateSections(existingSections, product);

const patch = {
  displayMode: 'scroll-video',
  scrollSwitcherSections: existingSections,
  sectionsGeneratedFromColors: !product.scrollSwitcherSections?.length && Boolean(existingSections),
};

const result = {
  ok: validationIssues.length === 0,
  slug,
  path: 'public/data/products.json',
  index,
  current: {
    displayMode: product.displayMode ?? null,
    sectionCount: (product.scrollSwitcherSections ?? []).length,
    colorCount: (product.availableColors ?? []).length,
  },
  patch,
  validationIssues,
  postSteps: [
    'node scripts/validate-runway-content.mjs',
    'node scripts/runway-doctor.mjs',
    `curl -s http://127.0.0.1:3000/api/runway/health | head -c 200`,
    `Открыть превью: /products/${slug}?view=runway`,
  ],
  previewUrl: `/products/${slug}?view=runway`,
};

if (product.displayMode === 'scroll-video' && product.scrollSwitcherSections?.length === 3) {
  result.alreadyEnabled = true;
}

if (!apply) {
  console.log(JSON.stringify(result, null, 2));
  process.exit(validationIssues.length > 0 ? 1 : 0);
}

if (validationIssues.some((i) => i.code === 'missing_sections')) {
  console.error(JSON.stringify({ ...result, applied: false, error: 'Cannot apply without sections' }, null, 2));
  process.exit(1);
}

products[index] = {
  ...product,
  displayMode: 'scroll-video',
  scrollSwitcherSections: existingSections,
};

writeFileSync(productsPath, `${JSON.stringify(products, null, 2)}\n`, 'utf8');

const minimalPatch = {
  displayMode: 'scroll-video',
  ...(product.scrollVideoUrl ? { scrollVideoUrl: product.scrollVideoUrl } : {}),
  scrollSwitcherSections: existingSections,
};
mkdirSync(patchesDir, { recursive: true });
const patchPath = join(patchesDir, `${slug.replace(/[^a-zA-Z0-9_-]/g, '_')}.json`);
writeFileSync(patchPath, `${JSON.stringify(minimalPatch, null, 2)}\n`, 'utf8');

console.log(
  JSON.stringify(
    {
      ...result,
      applied: true,
      patchFile: patchPath.replace(`${root}/`, ''),
      message: `Runway config applied for ${slug}`,
    },
    null,
    2
  )
);
