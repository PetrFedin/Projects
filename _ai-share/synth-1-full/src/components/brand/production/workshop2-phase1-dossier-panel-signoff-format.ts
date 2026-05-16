import type { Workshop2DossierSignoffMeta } from '@/lib/production/workshop2-dossier-phase1.types';

/** Как у названий атрибутов в карточке каталога: зелёный при заполнении, красный при пустом обязательном поле. */
export function passportManualFieldLabelClass(filled: boolean): string {
  return filled ? 'text-text-primary' : 'text-red-600';
}

/**
 * Заголовок группы атрибутов внутри секции досье (полоска с подписью).
 * В секции «Паспорт» для групп каталога «Паспорт» / «Свойства» заголовок не показываем — см. `hidePassportCatalogGroupHeader`.
 */
export function workshopGroupSectionTitle(catalogGroupLabel: string): string {
  return catalogGroupLabel;
}

export function formatDossierSignoffRu(
  meta: Workshop2DossierSignoffMeta | { by: string; at: string } | undefined
): string | null {
  if (!meta?.at) return null;
  try {
    const org =
      'byOrganization' in meta && typeof meta.byOrganization === 'string'
        ? meta.byOrganization.trim()
        : '';
    const who = org ? `${meta.by} · ${org}` : meta.by;
    const base = `${who} · ${new Date(meta.at).toLocaleString('ru-RU')}`;
    const dig =
      'signatureDigest' in meta && meta.signatureDigest ? ` · ЦП ${meta.signatureDigest}` : '';
    return base + dig;
  } catch {
    return meta.by;
  }
}

export function formatSignoffWhoWhen(meta: Workshop2DossierSignoffMeta | undefined): string | null {
  if (!meta?.at) return null;
  try {
    const org = meta.byOrganization?.trim();
    const who = org ? `${meta.by} · ${org}` : meta.by;
    return `${who} · ${new Date(meta.at).toLocaleString('ru-RU', { dateStyle: 'short', timeStyle: 'short' })}`;
  } catch {
    return meta.by;
  }
}
