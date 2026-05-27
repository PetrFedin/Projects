/**
 * @deprecated Используйте `@/lib/production/workshop2-color-master`.
 * Тонкая обёртка для обратной совместимости.
 */
import type { ColorEntry } from '@/lib/color-palette';
import {
  findWorkshop2ColorEntry,
  getWorkshop2ColorMasterPalette,
  resolveColor,
  setWorkshop2ColorMasterPalette,
} from '@/lib/production/workshop2-color-master';

export function setWorkshop2RuntimeColorPalette(colors: ColorEntry[] | null): void {
  setWorkshop2ColorMasterPalette(colors);
}

export function getEffectiveWorkshop2ColorPalette(): ColorEntry[] {
  return getWorkshop2ColorMasterPalette();
}

export function findEffectiveColorPaletteEntry(label: string): ColorEntry | undefined {
  return findWorkshop2ColorEntry(label);
}

export { resolveColor, setWorkshop2ColorMasterPalette, getWorkshop2ColorMasterPalette };
