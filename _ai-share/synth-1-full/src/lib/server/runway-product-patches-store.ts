import 'server-only';

import fs from 'fs/promises';
import path from 'path';
import type { BrandRunwayOverrideEntry } from '@/lib/brand-runway-overrides';

export type RunwayProductPatch = BrandRunwayOverrideEntry;

let chain: Promise<void> = Promise.resolve();

function patchesDir(): string {
  const fromEnv = process.env.RUNWAY_PRODUCT_PATCHES_DIR?.trim();
  if (fromEnv) return fromEnv;
  return path.join(process.cwd(), 'data', 'runway-product-patches');
}

function patchPath(slug: string): string {
  const safe = slug.replace(/[^a-zA-Z0-9_-]/g, '_');
  return path.join(patchesDir(), `${safe}.json`);
}

function runExclusive<T>(fn: () => Promise<T>): Promise<T> {
  const next = chain.then(fn, fn) as Promise<T>;
  chain = next.then(
    () => undefined,
    () => undefined
  );
  return next;
}

/** Прочитать patch одного SKU (пустой объект если файла нет). */
export async function readRunwayProductPatch(slug: string): Promise<RunwayProductPatch> {
  try {
    const raw = await fs.readFile(patchPath(slug), 'utf8');
    return JSON.parse(raw) as RunwayProductPatch;
  } catch {
    return {};
  }
}

/** Записать patch SKU в data/runway-product-patches/{slug}.json. */
export async function writeRunwayProductPatch(
  slug: string,
  patch: RunwayProductPatch
): Promise<RunwayProductPatch> {
  return runExclusive(async () => {
    const p = patchPath(slug);
    await fs.mkdir(path.dirname(p), { recursive: true });
    await fs.writeFile(p, JSON.stringify(patch, null, 2), 'utf8');
    return patch;
  });
}

/** Слить incoming patch поверх существующего файла. */
export async function mergeRunwayProductPatch(
  slug: string,
  incoming: RunwayProductPatch
): Promise<RunwayProductPatch> {
  return runExclusive(async () => {
    const current = await readRunwayProductPatch(slug);
    const next: RunwayProductPatch = {
      ...current,
      ...incoming,
      ...(incoming.scrollSwitcherSections != null
        ? { scrollSwitcherSections: incoming.scrollSwitcherSections }
        : {}),
    };
    await writeRunwayProductPatch(slug, next);
    return next;
  });
}

/** Все slug с patch-файлами (для batch merge на сервере). */
export async function listRunwayProductPatchSlugs(): Promise<string[]> {
  try {
    const dir = patchesDir();
    const entries = await fs.readdir(dir);
    return entries
      .filter((name) => name.endsWith('.json'))
      .map((name) => name.replace(/\.json$/, ''));
  } catch {
    return [];
  }
}

/** Map slug → patch для merge в каталог. */
export async function readAllRunwayProductPatches(): Promise<Record<string, RunwayProductPatch>> {
  const slugs = await listRunwayProductPatchSlugs();
  const out: Record<string, RunwayProductPatch> = {};
  await Promise.all(
    slugs.map(async (slug) => {
      out[slug] = await readRunwayProductPatch(slug);
    })
  );
  return out;
}
