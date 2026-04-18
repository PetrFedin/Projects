#!/usr/bin/env node
/**
 * Guard: публичный barrel `@/lib/b2b/integrations` должен оставаться client-safe.
 * Разрешены только экспорты/импорты моков JOOR delivery windows.
 */
import fs from 'node:fs';
import { execSync } from 'node:child_process';

const ALLOWED = new Set(['joorGetDeliveryWindows', 'isNuOrderConfigured', 'JoorDeliveryWindow']);
const BARREL_FILE = 'src/lib/b2b/integrations/index.ts';

function listFiles() {
  const out = execSync('git ls-files "*.ts" "*.tsx"', { encoding: 'utf8' });
  return out
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);
}

function parseNamedImports(clause) {
  const m = clause.match(/^\{([\s\S]+)\}$/);
  if (!m) return null;
  return m[1]
    .split(',')
    .map((x) => x.trim())
    .filter(Boolean)
    .map((x) => x.replace(/^type\s+/, '').split(/\s+as\s+/i)[0].trim());
}

const violations = [];
const files = listFiles();

for (const file of files) {
  if (!fs.existsSync(file)) continue;
  const src = fs.readFileSync(file, 'utf8');

  if (file === BARREL_FILE) {
    if (
      /from\s+['"]\.\/b2b-integration-service['"]/.test(src) ||
      /from\s+['"]\.\/.*server.*['"]/.test(src)
    ) {
      violations.push(
        `${file}: barrel must not reference server-only service/modules (b2b-integration-service/server-only).`
      );
    }
  }

  if (file.endsWith('.d.ts')) continue;
  const rx = /import\s+([^;]+)\s+from\s+['"]@\/lib\/b2b\/integrations['"];?/g;
  for (const match of src.matchAll(rx)) {
    const clause = (match[1] || '').trim();
    const names = parseNamedImports(clause);
    if (!names) {
      violations.push(`${file}: only named imports from "@/lib/b2b/integrations" are allowed.`);
      continue;
    }
    const bad = names.filter((n) => !ALLOWED.has(n));
    if (bad.length > 0) {
      violations.push(
        `${file}: disallowed import(s) from integrations barrel: ${bad.join(
          ', '
        )}. Import server modules by full path.`
      );
    }
  }
}

if (violations.length > 0) {
  console.error('[integrations-client-server-boundary-guard] violations:\n' + violations.join('\n'));
  process.exit(1);
}

console.log('[integrations-client-server-boundary-guard] ok');
