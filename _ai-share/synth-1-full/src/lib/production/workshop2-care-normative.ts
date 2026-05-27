/**
 * Нормативные подписи знаков ухода (RU) из data/workshop2/care-symbols.normative.json.
 * JSON импортируется бандлером — безопасно для client components.
 */

import careNormative from '../../../data/workshop2/care-symbols.normative.json';

const labelById = new Map<string, string>(
  Object.entries(careNormative.symbols ?? {}).flatMap(([id, row]) => {
    const label = (row as { normativeLabelRu?: string }).normativeLabelRu?.trim();
    return label ? [[id, label] as const] : [];
  })
);

/** Нормативная подпись для id знака ухода; иначе fallbackLabel. */
export function resolveWorkshop2CareSymbolNormativeLabel(
  symbolId: string,
  fallbackLabel: string
): string {
  return labelById.get(symbolId) ?? fallbackLabel;
}
