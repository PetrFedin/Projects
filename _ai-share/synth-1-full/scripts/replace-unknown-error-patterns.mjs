/**
 * One-off / repeatable: replace instanceof Error ternaries with getUnknownErrorMessage / getUnknownErrorDetail.
 * Run: node scripts/replace-unknown-error-patterns.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const IMPORT_PATH = "@/lib/unknown-error-message";

function walkSrc(dir, acc = []) {
  for (const name of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, name.name);
    if (name.isDirectory()) walkSrc(p, acc);
    else if (/\.(ts|tsx)$/.test(name.name)) acc.push(p);
  }
  return acc;
}

function listFiles() {
  const srcDir = path.join(root, 'src');
  return walkSrc(srcDir).filter((fp) => {
    const s = fs.readFileSync(fp, 'utf8');
    return s.includes('instanceof Error');
  });
}

function ensureImports(content, needMsg, needDetail) {
  const names = [];
  if (needMsg) names.push('getUnknownErrorMessage');
  if (needDetail) names.push('getUnknownErrorDetail');
  if (names.length === 0) return content;

  const reExisting = new RegExp(
    `import\\s*\\{([^}]+)\\}\\s*from\\s*['"]${IMPORT_PATH.replace('/', '\\/')}['"]`
  );
  const m = content.match(reExisting);
  if (m) {
    const parts = m[1]
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    for (const n of names) {
      if (!parts.includes(n)) parts.push(n);
    }
    return content.replace(
      reExisting,
      `import { ${parts.join(', ')} } from '${IMPORT_PATH}'`
    );
  }

  const importLine = `import { ${names.join(', ')} } from '${IMPORT_PATH}';\n`;
  const lines = content.split('\n');
  let insertAt = findInsertAfterLeadingImports(lines);
  lines.splice(insertAt, 0, importLine.trimEnd());
  return lines.join('\n');
}

/** After last complete `import ...;` in the header (handles multiline `import { ... } from 'x';`). */
function findInsertAfterLeadingImports(lines) {
  let insertAfter = 0;
  let i = 0;
  outer: while (i < lines.length) {
    const t = lines[i].trim();
    if (t.startsWith("'use ") || t.startsWith('"use ')) {
      insertAfter = i + 1;
      i++;
      continue;
    }
    if (t === '' || t.startsWith('//') || t.startsWith('/*') || t.startsWith('*')) {
      i++;
      continue;
    }
    if (!t.startsWith('import ')) break;

    if (/\bfrom\s+['"][^'"]+['"]\s*;/.test(lines[i])) {
      insertAfter = i + 1;
      i++;
      continue;
    }
    let j = i;
    while (j < lines.length) {
      if (/\}\s*from\s+['"][^'"]+['"]\s*;/.test(lines[j])) {
        insertAfter = j + 1;
        i = j + 1;
        continue outer;
      }
      j++;
    }
    insertAfter = i;
    break;
  }
  return insertAfter;
}

function transformFile(fp) {
  if (fp.endsWith(`${path.sep}unknown-error-message.ts`)) return false;
  let s = fs.readFileSync(fp, 'utf8');
  const orig = s;

  // Same var: ... ? v.message : String(v)
  s = s.replace(/(\w+) instanceof Error \? \1\.message : String\(\1\)/g, 'getUnknownErrorDetail($1)');

  // Same var: ... ? v.message : v  (e.g. console.warn(..., e))
  s = s.replace(/(\w+) instanceof Error \? \1\.message : \1\b/g, 'getUnknownErrorDetail($1)');

  // ... ? v.message : 'literal'
  s = s.replace(
    /(\w+) instanceof Error \? \1\.message : ('(?:[^'\\]|\\.)*')/g,
    'getUnknownErrorMessage($1, $2)'
  );
  s = s.replace(
    /(\w+) instanceof Error \? \1\.message : ("(?:[^"\\]|\\.)*")/g,
    'getUnknownErrorMessage($1, $2)'
  );

  if (s === orig) return false;

  const needDetail = /getUnknownErrorDetail\(/.test(s);
  const needMsg = /getUnknownErrorMessage\(/.test(s);
  s = ensureImports(s, needMsg, needDetail);
  fs.writeFileSync(fp, s);
  return true;
}

const files = listFiles();
let n = 0;
for (const fp of files) {
  if (transformFile(fp)) n++;
}
console.log(`Updated ${n} files under ${path.relative(root, root)}`);
