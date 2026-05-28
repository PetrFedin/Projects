import 'server-only';

import fs from 'fs/promises';
import path from 'path';
import type { BrandRunwayOverridesFile } from '@/lib/brand-runway-overrides';
import { setBrandRunwayOverride } from '@/lib/brand-runway-overrides';

let chain: Promise<void> = Promise.resolve();

function overridesPath(): string {
  const fromEnv = process.env.RUNWAY_OVERRIDES_FILE?.trim();
  if (fromEnv) return fromEnv;
  return path.join(process.cwd(), 'public/data/brand-runway-overrides.json');
}

function runExclusive<T>(fn: () => Promise<T>): Promise<T> {
  const next = chain.then(fn, fn) as Promise<T>;
  chain = next.then(
    () => undefined,
    () => undefined
  );
  return next;
}

export async function readRunwayOverridesFromDisk(): Promise<BrandRunwayOverridesFile> {
  try {
    const raw = await fs.readFile(overridesPath(), 'utf8');
    return JSON.parse(raw) as BrandRunwayOverridesFile;
  } catch {
    return {};
  }
}

export async function writeRunwayOverridesToDisk(
  overrides: BrandRunwayOverridesFile
): Promise<void> {
  const p = overridesPath();
  await fs.mkdir(path.dirname(p), { recursive: true });
  await fs.writeFile(p, JSON.stringify(overrides, null, 2), 'utf8');
}

export async function patchRunwayOverride(params: {
  brandName: string;
  slug: string;
  patch: Record<string, unknown>;
}): Promise<BrandRunwayOverridesFile> {
  return runExclusive(async () => {
    const current = await readRunwayOverridesFromDisk();
    const next = setBrandRunwayOverride(current, params.brandName, params.slug, params.patch);
    await writeRunwayOverridesToDisk(next);
    return next;
  });
}
