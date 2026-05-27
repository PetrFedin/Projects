/**
 * Подписи карточек артикула на плоском хабе Workshop2: аудитория, бренд и компактный % прогресса.
 */

import { organizations } from '@/components/team/_fixtures/team-data';
import {
  findHandbookLeafById,
  getHandbookAudiences,
  getHandbookAudiencesWorkshop2,
} from '@/lib/production/category-catalog';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import { suggestsUnisexFromSku } from '@/lib/production/workshop2-article-form-validation';
import { isApparelFootwearAccessoriesCategory } from '@/lib/production/workshop2-apparel-audience-domain';
import { WORKSHOP2_DEFAULT_TZ_BRAND_ORG_ID } from '@/lib/production/workshop2-tz-signatory-options';

const CATALOG_AUDIENCE_LABEL = 'каталог';

const DEFAULT_HUB_BRAND_LABEL =
  organizations[WORKSHOP2_DEFAULT_TZ_BRAND_ORG_ID]?.name?.trim() || 'Syntha Lab';

export type Workshop2HubCardAudience = {
  /** Подпись аудитории из справочника (Женщины, Мужчины, …) — не «Унисекс». */
  label: string;
  isUnisex: boolean;
};

/** Подпись аудитории по id справочника (без пункта «Унисекс» в форме Workshop2). */
export function workshop2AudienceLabelById(audienceId: string): string | null {
  const id = audienceId.trim().toLowerCase();
  if (!id || id === 'catalog' || id === 'unisex') return null;
  const w2 = getHandbookAudiencesWorkshop2().find((a) => a.id === id);
  if (w2) return w2.name;
  const any = getHandbookAudiences().find((a) => a.id === id);
  if (any && any.id !== 'unisex') return any.name;
  return null;
}

/** Эвристика по SKU: только M/W/K — не сегмент U (унисекс — отдельный флаг). */
function audienceFallbackFromSkuSegment(sku: string): string | null {
  const u = sku.toUpperCase();
  if (/-W-/.test(u)) return workshop2AudienceLabelById('women');
  if (/-M-/.test(u)) return workshop2AudienceLabelById('men');
  if (/-G-/.test(u)) return workshop2AudienceLabelById('girls');
  if (/-B-/.test(u) || /-K-/.test(u)) return workshop2AudienceLabelById('boys');
  if (/-D-/.test(u)) return workshop2AudienceLabelById('newborn');
  return null;
}

function audienceFallbackFromModelName(name: string): string | null {
  const n = name.toLowerCase();
  if (/\bмужск/.test(n)) return workshop2AudienceLabelById('men');
  if (/\bженск/.test(n)) return workshop2AudienceLabelById('women');
  if (/\bдетск|мальчик|девочк|малыш|новорожд/.test(n)) return workshop2AudienceLabelById('girls');
  if (/плать|сарафан|юбк/i.test(name)) return workshop2AudienceLabelById('women');
  return null;
}

/**
 * Аудитория для строки хаба: явные поля строки / досье → фасет → SKU (без U→«Унисекс»).
 */
export function resolveWorkshop2HubCardAudience(input: {
  audienceId?: string;
  audienceLabel?: string;
  isUnisex?: boolean;
  sku?: string;
  name?: string;
  categoryLeafId?: string;
  dossier?: Workshop2DossierPhase1 | null;
}): Workshop2HubCardAudience {
  const dossier = input.dossier;
  let isUnisex = input.isUnisex === true || Boolean(dossier?.isUnisex);

  if (!isUnisex && input.sku?.trim() && suggestsUnisexFromSku(input.sku)) {
    isUnisex = true;
  }

  if (dossier?.selectedAudienceId?.trim()) {
    const fromDossier = workshop2AudienceLabelById(dossier.selectedAudienceId);
    if (fromDossier) {
      return { label: fromDossier, isUnisex };
    }
  }

  const leafForDomain = input.categoryLeafId?.trim()
    ? findHandbookLeafById(input.categoryLeafId)
    : undefined;
  const apparelDomain = isApparelFootwearAccessoriesCategory({
    leafId: leafForDomain?.leafId ?? input.categoryLeafId,
    l1Name: leafForDomain?.l1Name,
  });

  if (input.audienceId?.trim()) {
    const audId = input.audienceId.trim().toLowerCase();
    if (!(apparelDomain && audId === 'other')) {
      const fromLine = workshop2AudienceLabelById(input.audienceId);
      if (fromLine) {
        return { label: fromLine, isUnisex };
      }
    }
  }

  const raw = input.audienceLabel?.trim() || '';
  if (raw && raw.toLowerCase() !== CATALOG_AUDIENCE_LABEL && !/унисекс/i.test(raw)) {
    return { label: raw, isUnisex };
  }

  const sku = input.sku?.trim() ?? '';
  if (sku) {
    const fromSku = audienceFallbackFromSkuSegment(sku);
    if (fromSku) return { label: fromSku, isUnisex };
  }

  const fromName = audienceFallbackFromModelName(input.name?.trim() ?? '');
  if (fromName) return { label: fromName, isUnisex };

  return { label: '—', isUnisex };
}

/**
 * Название бренда для футера карточки: строка инвентаря → организация цеха по умолчанию.
 */
export function resolveWorkshop2HubCardBrandName(input: {
  productBrandLabel?: string;
  collectionDisplayName?: string;
  dossier?: Workshop2DossierPhase1 | null;
}): string {
  void input.dossier;
  const fromRow = input.productBrandLabel?.trim();
  if (fromRow) return fromRow;

  const col = input.collectionDisplayName?.trim();
  if (col && !/^SS\d{2}$/i.test(col) && col.toLowerCase() !== 'ss27') {
    return col;
  }

  return DEFAULT_HUB_BRAND_LABEL;
}

/**
 * Главный % на карточке хаба = **готовность ТЗ** (`getWorkshop2ReadinessSnapshot().tzOverallPct`).
 * Этапы pipeline и пульс pre-flight — только в подсказке, не смешиваются с % ТЗ.
 */
export function computeHubCardOverallReadinessPct(input: {
  tzPct: number;
  finalized: boolean;
}): number {
  if (input.finalized) return 100;
  return Math.max(0, Math.min(100, Math.round(input.tzPct)));
}

/** Компактный % на карточке (= ТЗ); tooltip — этапы и пульс отдельно. */
export function buildHubCardProgressLabel(input: {
  finalized: boolean;
  tzPct: number;
  stagesPct: number;
  pulseScore: number;
  isComplete: boolean;
}): { label: string; title: string; overallReadinessPct: number } {
  const overallReadinessPct = computeHubCardOverallReadinessPct({
    tzPct: input.tzPct,
    finalized: input.finalized,
  });
  if (input.finalized) {
    return {
      overallReadinessPct: 100,
      label: '100%',
      title: 'Карточка финализирована · ТЗ 100% · этапы 100% · пульс 100/100',
    };
  }
  const stages = input.isComplete ? 100 : input.stagesPct;
  const { tzPct, pulseScore } = input;
  return {
    overallReadinessPct,
    label: `${overallReadinessPct}%`,
    title: `Готовность ТЗ ${tzPct}% · этапы pipeline ${stages}% · пульс pre-flight ${pulseScore}/100`,
  };
}

/** Футер карточки: сезон · бренд · унисекс (одна строка). */
export function formatHubCardSeasonFooterLine(input: {
  seasonDisplay: string;
  brandName: string;
  isUnisex: boolean;
}): string {
  const season = input.seasonDisplay.trim() || '—';
  const brand = input.brandName.trim() || DEFAULT_HUB_BRAND_LABEL;
  const unisex = input.isUnisex ? 'да' : 'нет';
  return `Сезон ${season} · ${brand} · унисекс: ${unisex}`;
}
