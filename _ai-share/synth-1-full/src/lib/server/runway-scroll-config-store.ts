import 'server-only';

import fs from 'fs/promises';
import path from 'path';
import {
  normalizeScrollExperienceConfig,
  SCROLL_EXPERIENCE_V3_DEFAULTS,
} from '@/lib/runway/scroll-experience-schema';
import type { ScrollExperienceConfig } from '@/lib/types';

let chain: Promise<void> = Promise.resolve();

function scrollConfigPath(): string {
  const fromEnv = process.env.RUNWAY_SCROLL_CONFIG_FILE?.trim();
  if (fromEnv) return fromEnv;
  return path.join(process.cwd(), 'public/data/scroll-experience.json');
}

function runExclusive<T>(fn: () => Promise<T>): Promise<T> {
  const next = chain.then(fn, fn) as Promise<T>;
  chain = next.then(
    () => undefined,
    () => undefined
  );
  return next;
}

export async function readRunwayScrollConfigFromDisk(): Promise<ScrollExperienceConfig> {
  try {
    const raw = JSON.parse(await fs.readFile(scrollConfigPath(), 'utf8'));
    return normalizeScrollExperienceConfig(raw, SCROLL_EXPERIENCE_V3_DEFAULTS);
  } catch {
    return normalizeScrollExperienceConfig({}, SCROLL_EXPERIENCE_V3_DEFAULTS);
  }
}

/** PATCH brandVideoCdnBaseUrl для одного бренда в scroll-experience.json. */
export async function patchBrandVideoCdnBaseUrl(params: {
  brandName: string;
  videoCdnBaseUrl: string | null;
}): Promise<ScrollExperienceConfig> {
  return runExclusive(async () => {
    const p = scrollConfigPath();
    let raw: Record<string, unknown> = {};
    try {
      raw = JSON.parse(await fs.readFile(p, 'utf8')) as Record<string, unknown>;
    } catch {
      /* новый файл */
    }

    const brandName = params.brandName.trim();
    const nextUrl = params.videoCdnBaseUrl?.trim() ?? '';
    const brandMap = {
      ...((raw.brandVideoCdnBaseUrl as Record<string, string> | undefined) ?? {}),
    };

    if (nextUrl) {
      brandMap[brandName] = nextUrl.replace(/\/+$/, '');
    } else {
      delete brandMap[brandName];
    }

    raw.brandVideoCdnBaseUrl = brandMap;
    await fs.mkdir(path.dirname(p), { recursive: true });
    await fs.writeFile(p, `${JSON.stringify(raw, null, 2)}\n`, 'utf8');

    return normalizeScrollExperienceConfig(raw, SCROLL_EXPERIENCE_V3_DEFAULTS);
  });
}
