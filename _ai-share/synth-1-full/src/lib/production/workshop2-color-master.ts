/**
 * Color Master Workshop2 — единая точка resolve палитры (PG runtime / static / brand UI).
 * Используйте `resolveColor` в BOM, colorway, досье; не импортируйте `@/lib/color-palette` напрямую в workshop2.
 */
import type { ColorEntry } from '@/lib/color-palette';
import { COLOR_PALETTE } from '@/lib/color-palette';

export type Workshop2ColorSource = 'runtime' | 'static' | 'unresolved';

export type Workshop2ResolvedColor = ColorEntry & {
  source: Exclude<Workshop2ColorSource, 'unresolved'>;
};

let runtimePalette: ColorEntry[] | null = null;

/** Подмена палитры после GET /api/workshop2/references/colors (PG). */
export function setWorkshop2ColorMasterPalette(colors: ColorEntry[] | null): void {
  runtimePalette = colors?.length ? colors : null;
}

/** Сброс runtime-палитры между unit-тестами (изоляция PG fetch mock). */
export function resetWorkshop2ColorMasterPaletteForTests(): void {
  runtimePalette = null;
}

/** @deprecated Используйте setWorkshop2ColorMasterPalette */
export const setWorkshop2RuntimeColorPalette = setWorkshop2ColorMasterPalette;

export function getWorkshop2ColorMasterPalette(): ColorEntry[] {
  return runtimePalette?.length ? runtimePalette : COLOR_PALETTE;
}

function findInPalette(query: string, palette: ColorEntry[]): ColorEntry | undefined {
  const q = query.trim();
  if (!q) return undefined;
  const upper = q.toUpperCase();
  return palette.find((c) => {
    if (!c?.code || !c?.name) return false;
    return c.code.toUpperCase() === upper || c.name.toLowerCase() === q.toLowerCase();
  });
}

/**
 * Разрешить цвет по коду (BLK) или имени (Чёрный).
 * Возвращает null, если запись не найдена в effective-палитре.
 */
export function resolveColor(codeOrName: string): Workshop2ResolvedColor | null {
  const palette = getWorkshop2ColorMasterPalette();
  const hit = findInPalette(codeOrName, palette);
  if (!hit) return null;
  return {
    ...hit,
    source: runtimePalette?.length ? 'runtime' : 'static',
  };
}

/** Поиск с fallback на static COLOR_PALETTE (если runtime не содержит код). */
export function resolveColorWithStaticFallback(codeOrName: string): Workshop2ResolvedColor | null {
  const primary = resolveColor(codeOrName);
  if (primary) return primary;
  const staticHit = findInPalette(codeOrName, COLOR_PALETTE);
  if (!staticHit) return null;
  return { ...staticHit, source: 'static' };
}

/** Совместимость: прежнее имя для colorway/BOM. */
export function findWorkshop2ColorEntry(label: string): ColorEntry | undefined {
  return resolveColorWithStaticFallback(label) ?? undefined;
}
