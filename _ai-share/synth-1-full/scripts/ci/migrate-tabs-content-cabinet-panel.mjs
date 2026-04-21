/**
 * One-off / repeatable: migrate `<TabsContent className="...">` in brand app to
 * `cabinetSurface.cabinetProfileTabPanel` (+ cn merge when extra classes needed).
 * Only touches lines containing `<TabsContent`.
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.join(process.cwd(), 'src/app/brand');

function walk(dir, out = []) {
  for (const name of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, name.name);
    if (name.isDirectory()) walk(p, out);
    else if (name.name.endsWith('.tsx')) out.push(p);
  }
  return out;
}

function migrateLine(line) {
  if (!line.includes('<TabsContent') || !line.includes('className=')) return { line, changed: false };

  let s = line;

  const subs = [
    // Longest / most specific first
    [
      /className="space-y-10 duration-500 animate-in fade-in slide-in-from-bottom-2"/g,
      `className={cn(cabinetSurface.cabinetProfileTabPanel, 'space-y-10 duration-500 animate-in fade-in slide-in-from-bottom-2')}`,
    ],
    [
      /className="space-y-4 duration-500 animate-in fade-in slide-in-from-bottom-2"/g,
      `className={cn(cabinetSurface.cabinetProfileTabPanel, 'duration-500 animate-in fade-in slide-in-from-bottom-2')}`,
    ],
    [/className="mt-4 space-y-6"/g, `className={cn(cabinetSurface.cabinetProfileTabPanel, 'mt-4')}`],
    [/className="mt-4 space-y-4"/g, `className={cn(cabinetSurface.cabinetProfileTabPanel, 'mt-4')}`],
    [/className="mt-0 space-y-10"/g, `className={cn(cabinetSurface.cabinetProfileTabPanel, 'space-y-10')}`],
    [/className="mt-0 space-y-6"/g, 'className={cabinetSurface.cabinetProfileTabPanel}'],
    [/className="mt-0 space-y-4"/g, 'className={cabinetSurface.cabinetProfileTabPanel}'],
    [/className="space-y-6 outline-none"/g, 'className={cabinetSurface.cabinetProfileTabPanel}'],
    [/className="space-y-4 outline-none"/g, 'className={cabinetSurface.cabinetProfileTabPanel}'],
    [/className="space-y-6"/g, 'className={cabinetSurface.cabinetProfileTabPanel}'],
    [/className="space-y-4"/g, 'className={cabinetSurface.cabinetProfileTabPanel}'],
    [/className="space-y-2"/g, `className={cn(cabinetSurface.cabinetProfileTabPanel, 'space-y-2')}`],
    [/className="mt-4"/g, `className={cn(cabinetSurface.cabinetProfileTabPanel, 'mt-4')}`],
    [/className="mt-0"/g, 'className={cabinetSurface.cabinetProfileTabPanel}'],
  ];

  let changed = false;
  for (const [re, rep] of subs) {
    const next = s.replace(re, rep);
    if (next !== s) {
      s = next;
      changed = true;
    }
  }

  return { line: s, changed };
}

function ensureImports(src) {
  let out = src;
  const needsCabinet = out.includes('cabinetSurface.cabinetProfileTabPanel');
  const needsCn = out.includes('cn(');
  if (!needsCabinet && !needsCn) return out;

  const hasCabinet = /from ['"]@\/lib\/ui\/cabinet-surface['"]/.test(out);
  const hasCn = /from ['"]@\/lib\/utils['"]/.test(out);

  if (needsCabinet && !hasCabinet) {
    const m = /^('use client';\n+)/.exec(out);
    if (m) {
      out = `${m[0]}import { cabinetSurface } from '@/lib/ui/cabinet-surface';\n${out.slice(m[0].length)}`;
    } else {
      out = `import { cabinetSurface } from '@/lib/ui/cabinet-surface';\n${out}`;
    }
  }
  if (needsCn && !hasCn) {
    const m = /^('use client';\n+)/.exec(out);
    const inject = `import { cn } from '@/lib/utils';\n`;
    if (m) {
      out = `${m[0]}${inject}${out.slice(m[0].length)}`;
    } else {
      out = `${inject}${out}`;
    }
  }
  return out;
}

const files = walk(ROOT);
let totalFiles = 0;
for (const file of files) {
  const raw = fs.readFileSync(file, 'utf8');
  const lines = raw.split('\n');
  let any = false;
  const next = lines.map((line) => {
    const { line: nl, changed } = migrateLine(line);
    if (changed) any = true;
    return nl;
  });
  if (!any) continue;
  let out = next.join('\n');
  out = ensureImports(out);
  fs.writeFileSync(file, out);
  totalFiles++;
  console.log('updated', path.relative(process.cwd(), file));
}
console.log('files touched:', totalFiles);
