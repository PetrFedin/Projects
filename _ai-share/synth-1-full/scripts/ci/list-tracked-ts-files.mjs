#!/usr/bin/env node
/**
 * Список .ts/.tsx для CI boundary guards.
 * Предпочитает `git ls-files` (только tracked); при недоступном git (Xcode license и т.п.)
 * — fallback на обход `src/` без node_modules/.next.
 */
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const SKIP_DIRS = new Set([
  'node_modules',
  '.next',
  '.git',
  'dist',
  'build',
  'coverage',
  '.turbo',
]);

function walkTsFiles(dir, root, acc = []) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return acc;
  }
  for (const ent of entries) {
    if (SKIP_DIRS.has(ent.name)) continue;
    const abs = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      walkTsFiles(abs, root, acc);
    } else if (/\.(ts|tsx)$/.test(ent.name)) {
      acc.push(path.relative(root, abs).split(path.sep).join('/'));
    }
  }
  return acc;
}

function listViaGit() {
  const out = execSync('git ls-files "*.ts" "*.tsx"', {
    encoding: 'utf8',
    stdio: ['pipe', 'pipe', 'pipe'],
  });
  return out
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);
}

function listViaWalk() {
  const root = process.cwd();
  const files = walkTsFiles(path.join(root, 'src'), root);
  files.sort();
  if (files.length === 0) {
    throw new Error('list-tracked-ts-files: fallback walk found no files under src/');
  }
  console.warn(
    '[ci] git ls-files unavailable — using src/ walk fallback (' +
      files.length +
      ' files). Accept Xcode license or fix git to restore tracked-only scan.',
  );
  return files;
}

export function listTrackedTsFiles() {
  try {
    return listViaGit();
  } catch {
    return listViaWalk();
  }
}
