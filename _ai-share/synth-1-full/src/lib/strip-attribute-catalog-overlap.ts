import { fullCategoryStructure } from './categories';

/** Не выкидывать как значение (техзаглушка в дереве категорий). */
const KEEP_VALUES = new Set(['—']);

function collectCatalogLabels(obj: Record<string, unknown>, out: Set<string>): void {
  for (const key of Object.keys(obj)) {
    if (key !== '—') out.add(key);
    const child = obj[key];
    if (child && typeof child === 'object' && !Array.isArray(child)) {
      collectCatalogLabels(child as Record<string, unknown>, out);
    }
  }
}

let cached: Set<string> | null = null;

export function getCatalogLabelSet(): Set<string> {
  if (!cached) {
    cached = new Set();
    collectCatalogLabels(fullCategoryStructure as Record<string, unknown>, cached);
  }
  return cached;
}

function isValueLabelPair(x: unknown): x is { value: string; label: string } {
  if (!x || typeof x !== 'object') return false;
  const o = x as Record<string, unknown>;
  return typeof o.value === 'string' && typeof o.label === 'string';
}

function shouldDropString(s: string, cat: Set<string>): boolean {
  if (KEEP_VALUES.has(s)) return false;
  return cat.has(s);
}

/**
 * Убирает из справочников атрибутов значения, которые дословно совпадают с любым узлом
 * «Полное дерево категорий» (fullCategoryStructure). Ключи *ByCategory не трогаем —
 * это оси привязки к веткам каталога, а не «лишние» подкатегории в атрибуте.
 */
export function stripAttributeValuesOverlappingCatalog<T>(input: T): T {
  const cat = getCatalogLabelSet();
  return deepStrip(input, cat) as T;
}

function deepStrip(x: unknown, cat: Set<string>): unknown {
  if (typeof x === 'string') {
    return shouldDropString(x, cat) ? undefined : x;
  }
  if (x === null || typeof x !== 'object') return x;

  if (Array.isArray(x)) {
    if (x.length === 0) return x;

    if (typeof x[0] === 'string') {
      return (x as string[]).filter((s) => !shouldDropString(s, cat));
    }

    if (isValueLabelPair(x[0])) {
      return (x as { value: string; label: string }[]).filter(
        (o) => !shouldDropString(o.value, cat) && !shouldDropString(o.label, cat)
      );
    }

    const mapped = x.map((e) => deepStrip(e, cat));
    return mapped.filter((e) => e !== undefined);
  }

  const o = x as Record<string, unknown>;
  const out: Record<string, unknown> = {};
  for (const k of Object.keys(o)) {
    out[k] = deepStrip(o[k], cat);
  }
  return out;
}
