#!/usr/bin/env node
/**
 * Валидация контента scroll-video: 3 секции, hero-изображения, stories, lookItems.
 * Запуск: node scripts/validate-runway-content.mjs [--json report.json]
 */
import { readFileSync, existsSync, writeFileSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const productsPath = join(root, 'public/data/products.json');
const jsonOut = process.argv.includes('--json')
  ? process.argv[process.argv.indexOf('--json') + 1]
  : null;

const products = JSON.parse(readFileSync(productsPath, 'utf8'));
const scroll = products.filter((p) => p.displayMode === 'scroll-video');
const scrollConfigPath = join(root, 'public/data/scroll-experience.json');
const scrollConfig = JSON.parse(readFileSync(scrollConfigPath, 'utf8'));
const heroSlugs = scrollConfig.heroProductSlugs ?? [];

/** Совпадает с RUNWAY_UPLOAD_MAX_BYTES / presign maxBytes. */
const VIDEO_MAX_BYTES = 50 * 1024 * 1024;

const report = {
  generatedAt: new Date().toISOString(),
  productCount: scroll.length,
  passed: true,
  errorCount: 0,
  warningCount: 0,
  products: [],
};

const SILK_SECTION_VIDEO_PATTERN = /\/videos\/sections\/silk-\d+\.(mp4|webm)$/i;

function collectSilkSectionVideoPaths(allProducts) {
  const silk = allProducts.find((p) => p.slug === 'silk-midi-dress');
  if (!silk) return new Set();
  return new Set(
    (silk.scrollSwitcherSections ?? [])
      .map((s) => s.sectionVideoUrl)
      .filter(Boolean)
  );
}

function suggestFix(slug, sectionIndex, code) {
  const fixes = {
    missing_sections: `Добавьте scrollSwitcherSections с ровно 3 секциями в products.json для «${slug}».`,
    missing_image: `Укажите sectionImageUrl или thumbImageUrl для ${slug} section ${sectionIndex}.`,
    missing_file: `Скачайте asset в public/ или обновите путь — node scripts/download-runway-demo-assets.mjs`,
    missing_story: `Добавьте sectionStory (RU) для ${slug} section ${sectionIndex}.`,
    missing_looks: `Добавьте минимум 2 sectionLookItems для ${slug} section ${sectionIndex}.`,
    missing_description: `Заполните description для «${slug}».`,
    missing_section_title: `Добавьте sectionTitle для ${slug} section ${sectionIndex}.`,
    missing_section_description: `Добавьте sectionDescription для ${slug} section ${sectionIndex}.`,
    missing_poster: `Задайте posterUrl или sectionImageUrl для ${slug} section ${sectionIndex}.`,
    missing_video_file: `Проверьте sectionVideoUrl на диске или удалите поле для fallback Ken Burns.`,
    cashmere_reuses_silk_video: `Задайте отдельные cashmere-*.mp4 в public/videos/sections/ — node scripts/download-runway-demo-assets.mjs`,
    anorak_reuses_silk_video: `Задайте отдельные anorak-*.mp4 в public/videos/sections/ — node scripts/download-runway-demo-assets.mjs`,
  };
  return fixes[code] ?? 'Исправьте поле согласно docs/product-scroll-switcher.md';
}

function addIssue(productReport, code, message, sectionIndex = null) {
  productReport.issues.push({
    code,
    message,
    sectionIndex,
    severity: 'error',
    suggestion: suggestFix(productReport.slug, sectionIndex, code),
  });
  report.errorCount += 1;
  report.passed = false;
  console.error(`[FAIL] ${message}`);
}

function addWarning(productReport, code, message, sectionIndex = null) {
  productReport.issues.push({
    code,
    message,
    sectionIndex,
    severity: 'warn',
    suggestion: 'См. docs/runway-video-specs.md и docs/runway-brand-video-specs.md',
  });
  report.warningCount += 1;
  console.warn(`[WARN] ${message}`);
}

function warnVideoFileQuality(p, sectionIndex, videoUrl, productReport) {
  if (!videoUrl?.startsWith('/')) return;
  const disk = join(root, 'public', videoUrl);
  if (!existsSync(disk)) return;

  const { size } = statSync(disk);
  if (size > VIDEO_MAX_BYTES) {
    const mb = (size / (1024 * 1024)).toFixed(1);
    addWarning(
      productReport,
      'video_file_too_large',
      `${p.slug} section ${sectionIndex}: MP4 ${mb} MB > 50 MB (${videoUrl})`,
      sectionIndex
    );
  }

  if (/\.mp4$/i.test(videoUrl)) {
    const webmPath = videoUrl.replace(/\.mp4$/i, '.webm');
    const webmDisk = join(root, 'public', webmPath);
    if (!existsSync(webmDisk)) {
      addWarning(
        productReport,
        'missing_webm_companion',
        `${p.slug} section ${sectionIndex}: нет companion WebM ${webmPath}`,
        sectionIndex
      );
    }
  }
}

function assertHeroSkuDoesNotReuseSilkVideos(product, silkPaths, productReport, slug, errorCode) {
  if (product.slug !== slug) return;

  for (const [i, s] of (product.scrollSwitcherSections ?? []).entries()) {
    const url = s.sectionVideoUrl;
    if (!url) continue;

    if (SILK_SECTION_VIDEO_PATTERN.test(url)) {
      addIssue(
        productReport,
        errorCode,
        `${product.slug} section ${i}: sectionVideoUrl не должен ссылаться на silk-* (${url})`,
        i
      );
    }

    if (silkPaths.has(url)) {
      addIssue(
        productReport,
        errorCode,
        `${product.slug} section ${i}: дублирует путь silk-midi-dress (${url})`,
        i
      );
    }
  }
}

function assertCashmereDoesNotReuseSilkVideos(product, silkPaths, productReport) {
  assertHeroSkuDoesNotReuseSilkVideos(
    product,
    silkPaths,
    productReport,
    'cashmere-crewneck-sweater',
    'cashmere_reuses_silk_video'
  );
}

function assertAnorakDoesNotReuseSilkVideos(product, silkPaths, productReport) {
  assertHeroSkuDoesNotReuseSilkVideos(
    product,
    silkPaths,
    productReport,
    'tech-anorak-men',
    'anorak_reuses_silk_video'
  );

  if (product.slug !== 'tech-anorak-men') return;

  for (const [i, s] of (product.scrollSwitcherSections ?? []).entries()) {
    const url = s.sectionVideoUrl;
    if (!url) continue;
    if (!/\/videos\/sections\/anorak-\d+\.(mp4|webm)$/i.test(url)) {
      addIssue(
        productReport,
        'anorak_reuses_silk_video',
        `${product.slug} section ${i}: ожидается anorak-*.mp4/webm (${url})`,
        i
      );
    }
  }
}

const silkSectionVideoPaths = collectSilkSectionVideoPaths(products);

const globalVideoCdn = scrollConfig.videoCdnBaseUrl?.trim();
const brandCdnMap = {
  ...(scrollConfig.brandCdnOverrides ?? {}),
  ...(scrollConfig.brandVideoCdnBaseUrl ?? {}),
};
if (globalVideoCdn) {
  const scrollBrands = [...new Set(scroll.map((p) => p.brand).filter(Boolean))];
  for (const brand of scrollBrands) {
    if (!brandCdnMap[brand]?.trim()) {
      console.warn(
        `[WARN] brand «${brand}»: нет brandVideoCdnBaseUrl override при глобальном videoCdnBaseUrl (${globalVideoCdn}) — см. docs/runway-production-runbook.md`
      );
      report.warningCount += 1;
    }
  }
}

const cdnUrlOwners = new Map();
if (globalVideoCdn) cdnUrlOwners.set(globalVideoCdn, ['__global__']);
for (const [brand, rawUrl] of Object.entries(brandCdnMap)) {
  const url = String(rawUrl ?? '').trim();
  if (!url) continue;
  const owners = cdnUrlOwners.get(url) ?? [];
  owners.push(brand);
  cdnUrlOwners.set(url, owners);
}
for (const [url, owners] of cdnUrlOwners.entries()) {
  if (owners.length > 1) {
    console.warn(
      `[WARN] duplicate CDN base «${url}» shared by: ${owners.join(', ')} — проверьте brandVideoCdnBaseUrl`
    );
    report.warningCount += 1;
  }
}

const scrollSlugs = new Set(scroll.map((p) => p.slug));
for (const slug of heroSlugs) {
  if (!scrollSlugs.has(slug)) {
    console.error(
      `[FAIL] heroProductSlugs: «${slug}» не scroll-video в products.json`
    );
    report.errorCount += 1;
    report.passed = false;
  }
}
if (heroSlugs.length > 0 && heroSlugs.length !== scroll.length) {
  console.error(
    `[FAIL] heroProductSlugs (${heroSlugs.length}) должен совпадать с числом scroll-video SKU (${scroll.length})`
  );
  report.errorCount += 1;
  report.passed = false;
}

for (const p of scroll) {
  const productReport = {
    slug: p.slug,
    brand: p.brand,
    ok: true,
    issues: [],
  };

  const sections = p.scrollSwitcherSections ?? [];

  if (sections.length !== 3) {
    addIssue(
      productReport,
      'missing_sections',
      `${p.slug}: ожидается 3 секции, найдено ${sections.length}`
    );
  }

  sections.forEach((s, i) => {
    const img = s.sectionImageUrl ?? s.thumbImageUrl;
    const poster = s.posterUrl ?? s.sectionImageUrl ?? s.thumbImageUrl;
    if (!img) {
      addIssue(
        productReport,
        'missing_image',
        `${p.slug} section ${i}: нет sectionImageUrl/thumbImageUrl`,
        i
      );
    } else if (img.startsWith('/')) {
      const disk = join(root, 'public', img);
      if (!existsSync(disk)) {
        addIssue(
          productReport,
          'missing_file',
          `${p.slug} section ${i}: файл не найден ${img}`,
          i
        );
      }
    }

    if (!poster) {
      addIssue(
        productReport,
        'missing_poster',
        `${p.slug} section ${i}: нет posterUrl / sectionImageUrl`,
        i
      );
    } else if (poster.startsWith('/')) {
      const posterDisk = join(root, 'public', poster);
      if (!existsSync(posterDisk)) {
        addIssue(
          productReport,
          'missing_file',
          `${p.slug} section ${i}: poster не найден ${poster}`,
          i
        );
      }
    }

    if (!s.sectionStory?.trim()) {
      addIssue(productReport, 'missing_story', `${p.slug} section ${i}: нет sectionStory`, i);
    }

    if (!s.sectionTitle?.trim()) {
      addIssue(
        productReport,
        'missing_section_title',
        `${p.slug} section ${i}: нет sectionTitle`,
        i
      );
    }

    if (!s.sectionDescription?.trim()) {
      addIssue(
        productReport,
        'missing_section_description',
        `${p.slug} section ${i}: нет sectionDescription`,
        i
      );
    }

    const looks = s.sectionLookItems ?? [];
    if (looks.length < 2) {
      addIssue(
        productReport,
        'missing_looks',
        `${p.slug} section ${i}: нужно минимум 2 sectionLookItems`,
        i
      );
    }

    if (s.sectionVideoUrl?.startsWith('/')) {
      const disk = join(root, 'public', s.sectionVideoUrl);
      if (!existsSync(disk)) {
        addIssue(
          productReport,
          'missing_video_file',
          `${p.slug} section ${i}: sectionVideoUrl не найден ${s.sectionVideoUrl}`,
          i
        );
      } else {
        warnVideoFileQuality(p, i, s.sectionVideoUrl, productReport);
      }
    }
  });

  assertCashmereDoesNotReuseSilkVideos(p, silkSectionVideoPaths, productReport);
  assertAnorakDoesNotReuseSilkVideos(p, silkSectionVideoPaths, productReport);

  if (!p.description?.trim()) {
    addIssue(productReport, 'missing_description', `${p.slug}: пустое description`);
  }

  productReport.ok = productReport.issues.length === 0;
  report.products.push(productReport);

  if (productReport.ok) {
    console.log(`[OK] ${p.slug} — stories, looks, images`);
  }
}

if (jsonOut) {
  writeFileSync(jsonOut, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  console.log(`\nJSON report → ${jsonOut}`);
}

if (!report.passed) {
  console.error(`\nValidation failed: ${report.errorCount} error(s)`);
  process.exit(1);
}

if (report.warningCount > 0) {
  console.warn(`\nValidation passed with ${report.warningCount} warning(s) — см. docs/runway-video-specs.md`);
} else {
  console.log(`\nValidation passed: ${scroll.length} scroll-video products`);
}
