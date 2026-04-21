/**
 * Codemod: RegistryPageShell → CabinetPageContent (single-line `<RegistryPageShell ...>` only).
 * Skips files with multiline `<RegistryPageShell` opens.
 *
 * Scans: all src .tsx files that reference RegistryPageShell (except registry-page-shell.tsx).
 *
 * Run: node scripts/dev/codemod-cabinet-page-content-batch.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const ROOT = path.resolve(import.meta.dirname, '../..');

const IMPORT_LINE = `import { CabinetPageContent } from '@/components/layout/cabinet-page-content';\n`;

const MAXW_TO_PROP = new Map([
  ['max-w-sm', 'sm'],
  ['max-w-md', 'md'],
  ['max-w-lg', 'lg'],
  ['max-w-xl', 'xl'],
  ['max-w-2xl', '2xl'],
  ['max-w-3xl', '3xl'],
  ['max-w-4xl', '4xl'],
  ['max-w-5xl', '5xl'],
  ['max-w-6xl', '6xl'],
  ['max-w-7xl', '7xl'],
]);

const FEED_PAD = 'px-4 py-6 pb-24 sm:px-6';

function ensureImport(text) {
  if (text.includes('CabinetPageContent')) return text;
  if (text.startsWith("'use client'")) {
    const m = text.match(/^'use client';\r?\n\r?\n/);
    if (m) return text.replace(m[0], m[0] + IMPORT_LINE);
    return text.replace(/^'use client';\r?\n/, (h) => h + '\n' + IMPORT_LINE);
  }
  return IMPORT_LINE + text;
}

function stripImportRegistryShellLine(text) {
  let t = text.replace(
    /^import \{ RegistryPageShell \} from '@\/components\/design-system\/registry-page-shell';\r?\n/gm,
    ''
  );
  t = t.replace(/^import \{ RegistryPageShell \} from '@\/components\/design-system';\r?\n/gm, '');
  t = t.replace(
    /import \{([^}]*)\} from '@\/components\/design-system\/registry-page-shell';/g,
    (full, inner) => {
      const parts = inner.split(',').map((s) => s.trim()).filter(Boolean);
      const next = parts.filter((p) => !/^RegistryPageShell$/.test(p));
      if (next.length === parts.length) return full;
      if (next.length === 0) return '';
      return `import { ${next.join(', ')} } from '@/components/design-system/registry-page-shell';\n`;
    }
  );
  t = t.replace(/import \{([^}]*)\} from '@\/components\/design-system';/g, (full, inner) => {
    const parts = inner.split(',').map((s) => s.trim()).filter(Boolean);
    const next = parts.filter((p) => !/^RegistryPageShell$/.test(p));
    if (next.length === parts.length) return full;
    if (next.length === 0) return '';
    return `import { ${next.join(', ')} } from '@/components/design-system';\n`;
  });
  return t.replace(/\n\n\n+/g, '\n\n');
}

function parseShellClassName(openTag) {
  const m = openTag.match(/className="([^"]*)"/);
  return m ? m[1] : '';
}

function parseExtraAttrs(openTag) {
  let rest = openTag.replace(/^<RegistryPageShell\s*/, '').replace(/\/?>$/, '');
  rest = rest.replace(/variant="cabinet"\s*/, '');
  rest = rest.replace(/className="[^"]*"\s*/, '');
  return rest.trim();
}

function classNameToMaxWidth(cls) {
  if (!cls) return { maxWidth: '5xl', rest: '', needsFeedPad: true };
  if (/(^|\s)max-w-none(\s|$)/.test(cls) || cls.includes('max-w['))
    return { maxWidth: 'full', rest: cls.replace(/\s*max-w-none\s*/g, ' ').trim(), needsFeedPad: false };

  const tokens = cls.split(/\s+/).filter(Boolean);
  const maxwTokens = tokens.filter((t) => t.startsWith('max-w-'));
  if (maxwTokens.length === 0)
    return { maxWidth: '5xl', rest: cls, needsFeedPad: true };

  const last = maxwTokens[maxwTokens.length - 1];
  const prop = MAXW_TO_PROP.get(last);
  const rest = tokens.filter((t) => !t.startsWith('max-w-')).join(' ');
  if (prop) return { maxWidth: prop, rest, needsFeedPad: false };
  return { maxWidth: 'full', rest: cls, needsFeedPad: false };
}

function buildCabinetOpen(classNameStr, extraAttrs) {
  const { maxWidth, rest, needsFeedPad } = classNameToMaxWidth(classNameStr);
  let cn = rest;
  if (needsFeedPad && cn && !/(^|\s)(px-|!p)/.test(cn)) cn = `${cn} ${FEED_PAD}`.trim();
  else if (needsFeedPad && !cn) cn = FEED_PAD;

  const attr = extraAttrs ? ` ${extraAttrs}` : '';
  if (cn) return `<CabinetPageContent maxWidth="${maxWidth}" className="${cn}"${attr}>`;
  return `<CabinetPageContent maxWidth="${maxWidth}"${attr}>`;
}

function convertRegistryPageShellSingleLine(text) {
  return text
    .replace(/<RegistryPageShell([^>\n]*)>/g, (full, inner) => {
      const tag = `<RegistryPageShell${inner}>`;
      const cls = parseShellClassName(tag);
      const extra = parseExtraAttrs(tag);
      return buildCabinetOpen(cls, extra);
    })
    .replace(/<\/RegistryPageShell>/g, '</CabinetPageContent>');
}

function processFile(relPath) {
  const p = path.join(ROOT, relPath);
  let text = fs.readFileSync(p, 'utf8');
  if (!text.includes('RegistryPageShell')) return 0;
  if (/<RegistryPageShell\s*\n/.test(text)) return 0;

  const before = text;
  text = ensureImport(text);
  text = stripImportRegistryShellLine(text);
  text = convertRegistryPageShellSingleLine(text);
  if (text !== before) {
    fs.writeFileSync(p, text);
    return 1;
  }
  return 0;
}

let changed = 0;

let files;
try {
  files = execSync(`grep -rl 'RegistryPageShell' src --include='*.tsx'`, {
    cwd: ROOT,
    encoding: 'utf8',
  })
    .trim()
    .split('\n')
    .filter(Boolean)
    .filter((f) => !f.includes('registry-page-shell.tsx'));
} catch {
  files = [];
}

for (const rel of files) {
  changed += processFile(rel);
}

console.log('Files updated:', changed);
