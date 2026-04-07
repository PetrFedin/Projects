/**
 * Демо «цифровой подписи» ТЗ: отпечаток от данных события (не КЭП и не юридическая ЭП).
 * Права на подпись по направлениям задаются в разделе Команда — здесь только расчёт отпечатка.
 */

export type Workshop2TzDigitalSignoffRole = 'designer' | 'technologist' | 'manager';

export type Workshop2TzDigitalSignoffCapabilities = {
  designer: boolean;
  technologist: boolean;
  manager: boolean;
};

/** Пока нет интеграции с «Команда» — все направления разрешены; родитель может передать явные флаги. */
export const WORKSHOP2_TZ_DIGITAL_SIGNOFF_DEFAULT_CAPABILITIES: Workshop2TzDigitalSignoffCapabilities = {
  designer: true,
  technologist: true,
  manager: true,
};

function djb2Hex(input: string): string {
  let hash = 5381;
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 33) ^ input.charCodeAt(i);
  }
  return (hash >>> 0).toString(16).padStart(8, '0');
}

/** Короткий отпечаток для отображения в карточке подписи. `role` — designer | technologist | manager | extra:rowId. */
export function computeWorkshop2TzSignatureDigest(parts: {
  role: Workshop2TzDigitalSignoffRole | string;
  signerLabel: string;
  collectionId: string;
  articleId: string;
  articleSku: string;
  signedAtIso: string;
}): string {
  const seed = [
    parts.role,
    parts.signerLabel.trim().toLowerCase(),
    parts.collectionId,
    parts.articleId,
    parts.articleSku.trim(),
    parts.signedAtIso,
  ].join('\u{1F}');
  const a = djb2Hex(seed);
  const b = djb2Hex(`${seed}|${a}`);
  return `${a.slice(0, 6)}${b.slice(0, 6)}`.toUpperCase();
}
