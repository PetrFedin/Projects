/**
 * Wave 13 RU: дефолты коллекции (НДС, валюта, маркировка) — file-store + optional PG mirror.
 */
import fs from 'node:fs';
import path from 'node:path';

import {
  WORKSHOP2_RU_COLLECTION_DEFAULTS,
  type Workshop2CollectionDefaults,
} from '@/lib/production/workshop2-collection-defaults-constants';

export type { Workshop2CollectionDefaults };
export { WORKSHOP2_RU_COLLECTION_DEFAULTS };

const FILE_STORE = path.join(process.cwd(), 'data', 'workshop2-collection-defaults.json');

type FileStoreShape = Record<string, Workshop2CollectionDefaults>;

function readFileStore(): FileStoreShape {
  try {
    if (!fs.existsSync(FILE_STORE)) return {};
    return JSON.parse(fs.readFileSync(FILE_STORE, 'utf8')) as FileStoreShape;
  } catch {
    return {};
  }
}

function writeFileStore(data: FileStoreShape): void {
  if (process.env.NODE_ENV === 'test') return;
  fs.mkdirSync(path.dirname(FILE_STORE), { recursive: true });
  fs.writeFileSync(FILE_STORE, JSON.stringify(data, null, 2), 'utf8');
}

export function normalizeWorkshop2CollectionDefaults(
  input: Partial<Workshop2CollectionDefaults> | null | undefined
): Workshop2CollectionDefaults {
  const vat =
    typeof input?.vatPercent === 'number' && input.vatPercent >= 0 && input.vatPercent <= 100
      ? input.vatPercent
      : WORKSHOP2_RU_COLLECTION_DEFAULTS.vatPercent;
  return {
    vatPercent: vat,
    currency: 'RUB',
    markingRequiredDefault:
      typeof input?.markingRequiredDefault === 'boolean'
        ? input.markingRequiredDefault
        : WORKSHOP2_RU_COLLECTION_DEFAULTS.markingRequiredDefault,
    updatedAt: input?.updatedAt,
  };
}

export function getWorkshop2CollectionDefaults(collectionId: string): Workshop2CollectionDefaults {
  const cid = collectionId.trim();
  if (!cid) return { ...WORKSHOP2_RU_COLLECTION_DEFAULTS };
  const file = readFileStore();
  return normalizeWorkshop2CollectionDefaults(file[cid] ?? WORKSHOP2_RU_COLLECTION_DEFAULTS);
}

export function putWorkshop2CollectionDefaults(input: {
  collectionId: string;
  defaults: Partial<Workshop2CollectionDefaults>;
}): Workshop2CollectionDefaults {
  const cid = input.collectionId.trim();
  const next = normalizeWorkshop2CollectionDefaults({
    ...getWorkshop2CollectionDefaults(cid),
    ...input.defaults,
    updatedAt: new Date().toISOString(),
  });
  const file = readFileStore();
  file[cid] = next;
  writeFileStore(file);
  return next;
}

/** Apparel leaf ids — маркировка ЧЗ по умолчанию для одежды. */
export function shouldApplyWorkshop2RuMarkingDefaultForLeaf(
  leafId: string | null | undefined
): boolean {
  const id = (leafId ?? '').trim().toLowerCase();
  if (!id) return true;
  return id.includes('apparel') || id.includes('garment') || id.includes('catalog-apparel');
}

export function clearWorkshop2CollectionDefaultsMemoryForTests(): void {
  if (fs.existsSync(FILE_STORE)) fs.unlinkSync(FILE_STORE);
}
