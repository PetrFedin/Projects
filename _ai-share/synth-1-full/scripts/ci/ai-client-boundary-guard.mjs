#!/usr/bin/env node
/**
 * Guard: client code must not import AI server internals.
 * - Forbid any "@/ai/*" import in 'use client' files.
 * - Forbid server-only stylist repo instance import in any file.
 */
import fs from 'node:fs';
import { execSync } from 'node:child_process';

function listFiles() {
  const out = execSync('git ls-files "*.ts" "*.tsx"', { encoding: 'utf8' });
  return out
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);
}

const violations = [];
const files = listFiles();

for (const file of files) {
  if (!fs.existsSync(file) || file.endsWith('.d.ts')) continue;
  const src = fs.readFileSync(file, 'utf8');

  // Never import server-only stylist repo instance outside direct server routes.
  if (
    /from\s+['"]@\/lib\/repo\/ai-stylist-repo-instance['"]/.test(src) &&
    !file.startsWith('src/app/api/')
  ) {
    violations.push(
      `${file}: "@/lib/repo/ai-stylist-repo-instance" is server-only and allowed only in API routes.`
    );
  }

  const isClient = /^\s*['"]use client['"]\s*;?/m.test(src);
  if (!isClient) continue;

  if (/from\s+['"]@\/ai\//.test(src) || /import\(\s*['"]@\/ai\//.test(src)) {
    violations.push(
      `${file}: client component imports "@/ai/*". Use HTTP route wrappers (e.g. /api/ai/*) instead.`
    );
  }

  if (/from\s+['"]@\/lib\/repo\/aiStylistRepo['"]/.test(src)) {
    violations.push(
      `${file}: client component imports "@/lib/repo/aiStylistRepo" (server LLM module). Use "@/lib/ai-stylist/types" for types and /api/ai/stylist for calls.`
    );
  }
}

if (violations.length > 0) {
  console.error('[ai-client-boundary-guard] violations:\n' + violations.join('\n'));
  process.exit(1);
}

console.log('[ai-client-boundary-guard] ok');
