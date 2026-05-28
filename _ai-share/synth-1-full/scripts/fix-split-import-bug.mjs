/**
 * Fix ensureImports() inserting inside an unfinished `import {` block.
 * Run: node scripts/fix-split-import-bug.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const RE =
  /import \{\nimport \{ (getUnknownError\w+) \} from '@\/lib\/unknown-error-message';\n([\s\S]*?\n\} from ['"][^'"]+['"];)/g;

function walkSrc(dir, acc = []) {
  for (const name of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, name.name);
    if (name.isDirectory()) walkSrc(p, acc);
    else if (/\.(ts|tsx)$/.test(name.name)) acc.push(p);
  }
  return acc;
}

let fixed = 0;
for (const fp of walkSrc(path.join(root, 'src'))) {
  let s = fs.readFileSync(fp, 'utf8');
  if (!s.includes("import {\nimport { getUnknownError")) continue;
  const next = s.replace(RE, (_m, fn, rest) => `import {\n${rest}\nimport { ${fn} } from '@/lib/unknown-error-message';`);
  if (next === s) {
    console.error('Could not fix:', fp);
    process.exit(1);
  }
  fs.writeFileSync(fp, next);
  fixed++;
}
console.log(`Fixed ${fixed} files`);
