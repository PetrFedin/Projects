import { getAttributeById } from '@/lib/production/attribute-catalog';

/** Подпись значения справочника в UI: для сезона и устаревших латинских ярлыков подставляем label из каталога. */
export function resolvedHandbookDisplayLabel(
  attributeId: string | undefined,
  parameterId: string | undefined,
  stored: string | undefined
): string {
  if (!parameterId) return stored?.trim() || '—';
  const attr = attributeId ? getAttributeById(attributeId) : undefined;
  const catalogParam = attr?.parameters.find((x) => x.parameterId === parameterId);
  const canon = catalogParam?.label?.trim();
  const st = stored?.trim() ?? '';

  if (attributeId === 'season' || parameterId.startsWith('season-')) {
    if (canon) return canon;
    return st || parameterId;
  }

  if (canon && (!st || st === parameterId)) return canon;

  if (canon && st && st !== canon && !/[а-яё]/i.test(st) && /^[a-z0-9,.\s/&+-]+$/i.test(st)) {
    return canon;
  }

  return st || canon || parameterId;
}
