#!/usr/bin/env node
/**
 * Lightweight bundle gate для runway chunks.
 * Usage: node scripts/runway-bundle-check.mjs [--warn-kb=500] [--fail-kb=800]
 */
import { readdirSync, statSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const nextDir = join(root, '.next');

const warnKb = Number(process.argv.find((a) => a.startsWith('--warn-kb='))?.split('=')[1] ?? 500);
const failKb = Number(process.argv.find((a) => a.startsWith('--fail-kb='))?.split('=')[1] ?? 800);

const RUNWAY_PATTERN = /runway|scroll-switcher|ProductScrollSwitcher/i;

function walk(dir, acc = []) {
  if (!existsSync(dir)) return acc;
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) walk(full, acc);
    else if (/\.(js|css)$/.test(name)) acc.push(full);
  }
  return acc;
}

function kb(size) {
  return Math.round(size / 1024);
}

const chunks = [];
for (const base of [join(nextDir, 'static', 'chunks'), join(nextDir, 'server')]) {
  for (const file of walk(base)) {
    const rel = file.slice(root.length + 1);
    const name = rel.split('/').pop() ?? rel;
    if (!RUNWAY_PATTERN.test(name) && !RUNWAY_PATTERN.test(rel)) continue;
    const size = statSync(file).size;
    chunks.push({ file: rel, kb: kb(size) });
  }
}

const report = {
  generatedAt: new Date().toISOString(),
  warnKb,
  failKb,
  chunks: chunks.sort((a, b) => b.kb - a.kb),
  maxKb: chunks.reduce((m, c) => Math.max(m, c.kb), 0),
};

if (!existsSync(nextDir)) {
  console.warn('[runway-bundle-check] .next not found — run npm run build first');
  console.log(JSON.stringify({ ...report, skipped: true }, null, 2));
  process.exit(0);
}

if (chunks.length === 0) {
  console.log('[runway-bundle-check] No runway-named chunks found (pattern match)');
  console.log(JSON.stringify(report, null, 2));
  process.exit(0);
}

let exitCode = 0;
for (const c of chunks) {
  if (c.kb >= failKb) {
    console.error(`[FAIL] ${c.file}: ${c.kb}kb >= fail threshold ${failKb}kb`);
    exitCode = 1;
  } else if (c.kb >= warnKb) {
    console.warn(`[WARN] ${c.file}: ${c.kb}kb >= warn threshold ${warnKb}kb`);
  } else {
    console.log(`[OK] ${c.file}: ${c.kb}kb`);
  }
}

console.log(JSON.stringify(report, null, 2));
process.exit(exitCode);
