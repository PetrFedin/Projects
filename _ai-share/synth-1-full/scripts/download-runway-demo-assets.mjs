#!/usr/bin/env node
/**
 * Загрузка демо-ассетов runway из Wikimedia Commons (CC).
 * URL резолвятся через MediaWiki API (устойчиво к смене hash-путей).
 * Запуск: npm run download:runway-assets
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const imgDir = join(root, 'public/images/demo/runway');
const vidDir = join(root, 'public/videos');

/** Обязателен для Wikimedia — без User-Agent ответ 403/400. */
const USER_AGENT = 'SynthRunwayDemo/1.0 (local demo assets; +https://github.com/synth-1)';

const COMMONS_API = 'https://commons.wikimedia.org/w/api.php';

/** dest filename → Commons file title (без префикса File:) */
const IMAGES = {
  'silk-midi-dress-section-0.jpg': 'Miriam Sánchez at the Paco Rabanne Fall Winter 2019-20 show.jpg',
  'silk-midi-dress-section-1.jpg': 'Supermodel Elza Matiz at Paris Fashion Week.jpg',
  'silk-midi-dress-section-2.jpg': 'Gigi Hadid for Rabanne.png',
  'cashmere-crewneck-sweater-section-0.jpg': 'Cashmere Wool Scarves.jpg',
  'cashmere-crewneck-sweater-section-1.jpg': 'Wool.jpg',
  'cashmere-crewneck-sweater-section-2.jpg': 'Oma strickt Strümpfe.jpg',
  'oversized-hoodie-women-section-0.jpg': 'Hoodie.jpg',
  'oversized-hoodie-women-section-1.jpg': 'Streetwear españa.jpg',
  'oversized-hoodie-women-section-2.jpg': 'Fashion model.jpg',
  'tech-anorak-men-section-0.jpg': 'Anorak.jpg',
  'tech-anorak-men-section-1.jpg': 'Windbreaker Jacket, Hood Stowed.jpg',
  'tech-anorak-men-section-2.jpg': 'Anorak.jpg',
  'urban-sneakers-wool-section-0.jpg': 'Sneakers.jpg',
  'urban-sneakers-wool-section-1.jpg': 'Running shoes.jpg',
  'urban-sneakers-wool-section-2.jpg': 'Running shoes.jpg',
};

const VIDEOS = {
  'demo-runway-hero.webm': 'Michaela DePrince for Teen Vogue.ogv',
  'demo-runway-secondary.webm': 'GREENPEACE The Fashion Duel.webm',
  'demo-runway-tertiary.webm': 'Prangsta "VENGEANCE" fashion film.webm',
};

const SECTION_VIDEOS = {
  'sections/silk-0.webm': 'Michaela DePrince for Teen Vogue.ogv',
  'sections/silk-1.webm': 'GREENPEACE The Fashion Duel.webm',
  'sections/silk-2.webm': 'Prangsta "VENGEANCE" fashion film.webm',
};

const CASHMERE_SECTION_VIDEOS = {
  'sections/cashmere-0.webm': 'GREENPEACE The Fashion Duel.webm',
  'sections/cashmere-1.webm': 'Prangsta "VENGEANCE" fashion film.webm',
  'sections/cashmere-2.webm': 'Michaela DePrince for Teen Vogue.ogv',
};

/** Отдельные клипы для tech-anorak-men — anorak-*.mp4 */
const ANORAK_SECTION_VIDEOS = {
  'sections/anorak-0.webm': 'Prangsta "VENGEANCE" fashion film.webm',
  'sections/anorak-1.webm': 'Michaela DePrince for Teen Vogue.ogv',
  'sections/anorak-2.webm': 'GREENPEACE The Fashion Duel.webm',
};

const urlCache = new Map();

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function resolveCommonsFileUrl(fileTitle, { width } = {}) {
  const cacheKey = `${fileTitle}|${width ?? 'full'}`;
  if (urlCache.has(cacheKey)) return urlCache.get(cacheKey);

  const params = new URLSearchParams({
    action: 'query',
    titles: `File:${fileTitle}`,
    prop: 'imageinfo',
    iiprop: 'url',
    format: 'json',
  });
  if (width) params.set('iiurlwidth', String(width));

  const res = await fetch(`${COMMONS_API}?${params}`, {
    headers: { 'User-Agent': USER_AGENT },
  });
  if (!res.ok) throw new Error(`Commons API HTTP ${res.status}`);

  const data = await res.json();
  const page = Object.values(data.query?.pages ?? {})[0];
  const info = page?.imageinfo?.[0];
  if (!info) throw new Error(`Commons file not found: ${fileTitle}`);

  const url = width && info.thumburl ? info.thumburl : info.url;
  urlCache.set(cacheKey, url);
  return url;
}

async function resolveFfmpeg() {
  try {
    const mod = await import('ffmpeg-static');
    if (mod.default && existsSync(mod.default)) return mod.default;
  } catch {
    /* ignore */
  }
  return 'ffmpeg';
}

async function download(url, dest) {
  const res = await fetch(url, {
    redirect: 'follow',
    headers: { 'User-Agent': USER_AGENT },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await mkdir(dirname(dest), { recursive: true });
  await writeFile(dest, buf);
  return buf.length;
}

const VIDEO_BUDGET_BYTES = 50 * 1024 * 1024;

async function toMp4(sourcePath, mp4Path) {
  const bin = await resolveFfmpeg();
  const r = spawnSync(
    bin,
    [
      '-y',
      '-i',
      sourcePath,
      '-vf',
      'scale=1280:-2',
      '-c:v',
      'libx264',
      '-preset',
      'fast',
      '-crf',
      '28',
      '-an',
      mp4Path,
    ],
    { stdio: 'pipe' }
  );
  if (r.status !== 0) {
    console.warn(`[warn] ffmpeg skip ${mp4Path}: ${r.stderr?.toString().slice(0, 120)}`);
    return;
  }
  await compressMp4IfOverBudget(mp4Path);
}

/** Повторное сжатие, если MP4 превышает presign maxBytes (50 MB). */
async function compressMp4IfOverBudget(mp4Path) {
  const { statSync, renameSync } = await import('node:fs');
  if (!existsSync(mp4Path) || statSync(mp4Path).size <= VIDEO_BUDGET_BYTES) return;

  const bin = await resolveFfmpeg();
  const tmp = `${mp4Path}.budget.tmp.mp4`;
  console.log(`[compress] ${mp4Path} (${(statSync(mp4Path).size / 1024 / 1024).toFixed(1)} MB → budget)`);
  const r = spawnSync(
    bin,
    ['-y', '-i', mp4Path, '-vf', 'scale=960:-2', '-c:v', 'libx264', '-preset', 'fast', '-crf', '32', '-an', tmp],
    { stdio: 'pipe' }
  );
  if (r.status === 0 && existsSync(tmp)) {
    renameSync(tmp, mp4Path);
  } else {
    console.warn(`[warn] compress failed ${mp4Path}`);
  }
}

/** Конвертирует stub MP4 (<1 KB) из companion WebM — без повторной загрузки Commons. */
async function repairStubMp4FromWebm() {
  const { readdirSync, statSync } = await import('node:fs');
  const sectionsDir = join(vidDir, 'sections');
  if (!existsSync(sectionsDir)) return;

  const bin = await resolveFfmpeg();
  for (const name of readdirSync(sectionsDir)) {
    if (!name.endsWith('.mp4')) continue;
    const mp4Path = join(sectionsDir, name);
    if (statSync(mp4Path).size >= 1024) continue;

    const webmPath = mp4Path.replace(/\.mp4$/i, '.webm');
    if (!existsSync(webmPath)) {
      console.warn(`[skip repair] ${name}: нет companion .webm`);
      continue;
    }

    console.log(`[repair mp4] ${name} ← ${name.replace(/\.mp4$/, '.webm')}`);
    const r = spawnSync(
      bin,
      [
        '-y',
        '-i',
        webmPath,
        '-vf',
        'scale=1280:-2',
        '-c:v',
        'libx264',
        '-preset',
        'fast',
        '-crf',
        '28',
        '-an',
        mp4Path,
      ],
      { stdio: 'pipe' }
    );
    if (r.status !== 0) {
      console.warn(`[warn] repair failed ${name}: ${r.stderr?.toString().slice(0, 120)}`);
    } else {
      await compressMp4IfOverBudget(mp4Path);
    }
  }
}

await mkdir(imgDir, { recursive: true });
await mkdir(vidDir, { recursive: true });

let ok = 0;
let fail = 0;

for (const [name, commonsTitle] of Object.entries(IMAGES)) {
  const dest = join(imgDir, name);
  try {
    const url = await resolveCommonsFileUrl(commonsTitle, { width: 1200 });
    await sleep(300);
    const size = await download(url, dest);
    console.log(`[img] ${name} (${size} bytes)`);
    ok++;
  } catch (e) {
    console.warn(`[skip img] ${name}: ${e.message}`);
    fail++;
  }
}

async function downloadVideo(destName, commonsTitle) {
  const dest = join(vidDir, destName);
  const url = await resolveCommonsFileUrl(commonsTitle);
  await sleep(500);
  const size = await download(url, dest);
  console.log(`[vid] ${destName} (${size} bytes)`);
  await toMp4(dest, dest.replace(/\.(webm|ogv)$/i, '.mp4'));
}

for (const [name, commonsTitle] of Object.entries(VIDEOS)) {
  try {
    await downloadVideo(name, commonsTitle);
    ok++;
  } catch (e) {
    console.warn(`[skip vid] ${name}: ${e.message}`);
    fail++;
  }
}

for (const [name, commonsTitle] of Object.entries({
  ...SECTION_VIDEOS,
  ...CASHMERE_SECTION_VIDEOS,
  ...ANORAK_SECTION_VIDEOS,
})) {
  try {
    await downloadVideo(name, commonsTitle);
    ok++;
  } catch (e) {
    console.warn(`[skip section-vid] ${name}: ${e.message}`);
    fail++;
  }
}

const attrPath = join(root, 'public/data/runway-asset-attribution.json');
await writeFile(
  attrPath,
  JSON.stringify(
    {
      videos: {
        'demo-runway-hero': 'File:Michaela DePrince for Teen Vogue.ogv — CC BY',
        'demo-runway-secondary': 'File:GREENPEACE The Fashion Duel.webm — CC',
        'demo-runway-tertiary': 'File:Prangsta VENGEANCE fashion film.webm — CC',
        'silk-0': 'File:Michaela DePrince for Teen Vogue.ogv — CC',
        'silk-1': 'File:GREENPEACE The Fashion Duel.webm — CC',
        'silk-2': 'File:Prangsta VENGEANCE fashion film.webm — CC',
        'cashmere-0': 'File:GREENPEACE The Fashion Duel.webm — CC',
        'cashmere-1': 'File:Prangsta VENGEANCE fashion film.webm — CC',
        'cashmere-2': 'File:Michaela DePrince for Teen Vogue.ogv — CC',
        'anorak-0': 'File:Prangsta VENGEANCE fashion film.webm — CC',
        'anorak-1': 'File:Michaela DePrince for Teen Vogue.ogv — CC',
        'anorak-2': 'File:GREENPEACE The Fashion Duel.webm — CC',
      },
      images: Object.fromEntries(
        Object.entries(IMAGES).map(([k, title]) => [`File:${title}`, k])
      ),
      updatedAt: new Date().toISOString(),
    },
    null,
    2
  ) + '\n'
);

console.log(`\nDone: ${ok} ok, ${fail} skipped. Attribution: ${attrPath}`);

await repairStubMp4FromWebm();
