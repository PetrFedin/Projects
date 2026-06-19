#!/usr/bin/env node
/**
 * Быстрая проверка runway-видео в public/videos:
 * ffprobe (если установлен) или fallback: размер + расширение.
 *
 * node scripts/runway-video-lint.mjs [--path public/videos/sections]
 */
import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(fileURLToPath(new URL('.', import.meta.url)), '..');
const argPath = process.argv.includes('--path')
  ? process.argv[process.argv.indexOf('--path') + 1]
  : 'public/videos';
const targetDir = join(root, argPath);
const VIDEO_MAX_BYTES = 50 * 1024 * 1024;
const ALLOWED = new Set(['.mp4', '.webm']);

let ffprobe = null;
try {
  ffprobe = execFileSync('ffprobe', ['-version'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
} catch {
  ffprobe = null;
}

if (!ffprobe) {
  console.warn(
    'runway-video-lint: ffprobe не найден — проверка codec пропущена (size/extension only). Установите ffmpeg для полной проверки; gate не блокируется.'
  );
}

function walk(dir) {
  if (!existsSync(dir)) return [];
  const out = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

const files = walk(targetDir).filter((f) => ALLOWED.has(extname(f).toLowerCase()));
if (files.length === 0) {
  console.warn(`runway-video-lint: no mp4/webm under ${argPath}`);
  process.exit(0);
}

let warnings = 0;
let errors = 0;

for (const file of files) {
  const rel = file.replace(root, '');
  const size = statSync(file).size;
  if (size > VIDEO_MAX_BYTES) {
    console.error(`ERROR ${rel}: ${(size / 1024 / 1024).toFixed(1)} MB > 50 MB (presign maxBytes)`);
    errors += 1;
  }

  if (ffprobe) {
    try {
      const json = execFileSync(
        'ffprobe',
        ['-v', 'quiet', '-print_format', 'json', '-show_format', '-show_streams', file],
        { encoding: 'utf8' }
      );
      const data = JSON.parse(json);
      const video = (data.streams ?? []).find((s) => s.codec_type === 'video');
      const codec = video?.codec_name ?? 'unknown';
      if (!['h264', 'vp9', 'hevc'].includes(codec)) {
        console.warn(`WARN ${rel}: codec ${codec} (рекомендуется h264/vp9)`);
        warnings += 1;
      }
    } catch (err) {
      console.warn(`WARN ${rel}: ffprobe failed — ${err.message}`);
      warnings += 1;
    }
  } else if (extname(file).toLowerCase() === '.mp4' && size > 25 * 1024 * 1024) {
    console.warn(`WARN ${rel}: hero/section > 25 MB (рекомендация)`);
    warnings += 1;
  }
}

console.log(`runway-video-lint: ${files.length} file(s), ${errors} error(s), ${warnings} warning(s)`);
if (!ffprobe) {
  console.warn('ffprobe not found — только size/extension check. Установите ffmpeg для полной проверки.');
}
process.exit(errors > 0 ? 1 : 0);
