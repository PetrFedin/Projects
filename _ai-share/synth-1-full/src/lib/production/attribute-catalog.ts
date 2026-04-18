/**
 * Канонический каталог атрибутов для фазы 1 Цеха 2 (инстанс JSON в репо).
 */
import type {
  AttributeCatalogAttribute,
  AttributeCatalogGroup,
  AttributeCatalogInstance,
  AttributeCatalogParameter,
} from './attribute-catalog.types';
import type { HandbookCategoryLeaf } from './category-handbook-leaves';
import { findHandbookLeafById } from './category-handbook-leaves';
import { inferExtraAttributeIdsForHandbookPath } from './handbook-attribute-infer';
import {
  defaultWorkshopSampleSizeScaleKey,
  getWorkshopParametersForSampleScale,
} from './workshop-size-handbook';
import rawCatalog from './data/attribute-catalog.instance.json';

const catalog = rawCatalog as AttributeCatalogInstance;

const attrById = new Map<string, AttributeCatalogAttribute>(
  catalog.attributes.map((a) => [a.attributeId, a])
);

/** Атрибут участвует в заполнении на указанной фазе (по умолчанию только фаза 1). */
export function attributeInWorkflowPhase(attr: AttributeCatalogAttribute, phase: number): boolean {
  const phases = attr.workflowPhases;
  if (!phases?.length) return phase === 1;
  return phases.includes(phase);
}

export function getAttributeCatalog(): AttributeCatalogInstance {
  return catalog;
}

export function getAttributeById(id: string): AttributeCatalogAttribute | undefined {
  return attrById.get(id);
}

/**
 * Канонический маппинг groupId → dossierSection.
 * Используется как fallback, когда атрибут не имеет явного `dossierSection`.
 */
const GROUP_TO_DOSSIER_SECTION: Record<string, string> = {
  global: 'general',
  material: 'material',
  construction: 'construction',
  packaging: 'material',
  outerwear: 'construction',
  footwear: 'construction',
  dress: 'construction',
  phase2: 'construction',
  phase3: 'material',
};

type RawCatalogDossierSection = NonNullable<AttributeCatalogAttribute['dossierSection']>;

function normalizeCatalogDossierSectionNav(
  raw: string | undefined
): 'general' | 'visuals' | 'material' | 'construction' | undefined {
  if (!raw) return undefined;
  if (raw === 'measurements') return 'construction';
  if (raw === 'packaging') return 'material';
  if (raw === 'general' || raw === 'visuals' || raw === 'material' || raw === 'construction')
    return raw;
  return undefined;
}

/** Секция навигации ТЗ; устаревшие measurements/packaging из JSON каталога сводятся к construction/material. */
export function getAttributeDossierSection(
  attributeId: string
): 'general' | 'visuals' | 'material' | 'construction' | undefined {
  const attr = attrById.get(attributeId);
  if (!attr) return undefined;
  const raw = (attr.dossierSection ?? GROUP_TO_DOSSIER_SECTION[attr.groupId]) as
    | RawCatalogDossierSection
    | string
    | undefined;
  return normalizeCatalogDossierSectionNav(raw);
}

let cachedConstructionTabMergedGroupIds: ReadonlySet<string> | null = null;

/**
 * groupId атрибутов, которые на вкладке «Конструкция» объединяются в одну полосу
 * (силуэт/тип изделия + material + construction по маппингу `GROUP_TO_DOSSIER_SECTION`).
 */
export function getWorkshop2ConstructionTabMergedGroupIds(): ReadonlySet<string> {
  if (cachedConstructionTabMergedGroupIds) return cachedConstructionTabMergedGroupIds;
  const out = new Set<string>(['material', 'construction']);
  for (const [groupId, section] of Object.entries(GROUP_TO_DOSSIER_SECTION)) {
    if (section === 'construction' && groupId !== 'construction') {
      out.add(groupId);
    }
  }
  cachedConstructionTabMergedGroupIds = out;
  return out;
}

/** Заголовок объединённой полосы на конструкции: L2 [· L3] · материалы · конструкция. */
export function workshop2ConstructionMergedStackTitle(
  leaf: Pick<HandbookCategoryLeaf, 'l2Name' | 'l3Name'>
): string {
  const l2 = (leaf.l2Name ?? '').trim() || 'Категория';
  const l3 = (leaf.l3Name ?? '').trim();
  const head = l3 && l3 !== l2 ? `${l2} · ${l3}` : l2;
  return `${head} · материалы · конструкция`;
}

/**
 * Порядок: `leafBindings[leafId]` (если есть) → вывод по L1/L2 справочника категорий для `catalog-*`
 * → глобальные id. Дубликаты убираются. Только атрибуты с `workflowPhases`, содержащими `phase`.
 */
export function resolveAttributeIdsForLeaf(leafId: string, phase: number = 1): string[] {
  const fromJsonLeaf = catalog.leafBindings?.[leafId] ?? [];
  const hb = findHandbookLeafById(leafId);
  const inferred = hb ? inferExtraAttributeIdsForHandbookPath(hb.l1Name, hb.l2Name, hb.l3Name) : [];
  const global = catalog.globalAttributeIds ?? [];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const id of [...fromJsonLeaf, ...inferred, ...global]) {
    const a = attrById.get(id);
    if (!a || seen.has(id)) continue;
    if (a.retiredFromWorkshop) continue;
    if (!attributeInWorkflowPhase(a, phase)) continue;
    seen.add(id);
    out.push(id);
  }
  return out;
}

/**
 * Все атрибуты листа для фаз 1–3 (подборка / досье): порядок как в каждой фазе, без дубликатов.
 */
export function resolveMergedAttributeIdsForLeaf(leafId: string): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const phase of [1, 2, 3] as const) {
    for (const id of resolveAttributeIdsForLeaf(leafId, phase)) {
      if (seen.has(id)) continue;
      seen.add(id);
      out.push(id);
    }
  }
  return out;
}

/** Подписи атрибутов для UI (например, таблица project-info по категориям). */
export function resolveMergedAttributeLabelsForLeaf(leafId: string): string[] {
  return resolveMergedAttributeIdsForLeaf(leafId)
    .map((id) => attrById.get(id)?.name)
    .filter((n): n is string => Boolean(n));
}

export function getSortedGroups(): AttributeCatalogGroup[] {
  return [...catalog.groups].sort((a, b) => a.sortOrder - b.sortOrder);
}

function sortParams(params: AttributeCatalogParameter[]): AttributeCatalogParameter[] {
  return [...params].sort((a, b) => a.sortOrder - b.sortOrder);
}

/**
 * Параметры атрибута с учётом allowlist: точечно `parameterAllowlistByLeafId[leafId]`,
 * иначе `parameterAllowlistByL1Name[l1Name]`. Без записи для листа/L1 — полный перечень
 * параметров атрибута (все значения справочника, релевантные выбранной категории через leafBindings).
 */
export function resolveEffectiveParametersForLeaf(
  attribute: AttributeCatalogAttribute,
  leaf: HandbookCategoryLeaf | undefined
): AttributeCatalogParameter[] {
  const sorted = sortParams(attribute.parameters);
  if (!leaf) return sorted;
  const byLeaf = catalog.parameterAllowlistByLeafId?.[leaf.leafId]?.[attribute.attributeId];
  const byL1 = catalog.parameterAllowlistByL1Name?.[leaf.l1Name]?.[attribute.attributeId];
  const allow = byLeaf ?? byL1;
  if (!allow?.length) return sorted;
  const allowSet = new Set(allow);
  return sorted.filter((p) => allowSet.has(p.parameterId));
}

/**
 * Ключ шкалы «базовый размер» из справочника производства + сетки габаритов
 * (`workshop-size-handbook`), а не устаревший apparel/footwear из JSON каталога.
 */
export function defaultSizeScaleIdForLeaf(leaf: HandbookCategoryLeaf | undefined): string {
  return defaultWorkshopSampleSizeScaleKey(leaf);
}

export function getSizeScaleIdsSorted(): { scaleId: string; label: string }[] {
  const scales = catalog.sizeScales ?? {};
  return Object.entries(scales)
    .map(([scaleId, s]) => ({ scaleId, label: s.label, sortOrder: s.sortOrder ?? 99 }))
    .sort((a, b) => a.sortOrder - b.sortOrder || a.label.localeCompare(b.label, 'ru'))
    .map(({ scaleId, label }) => ({ scaleId, label }));
}

export function resolveParameterIdsForSizeScale(scaleId: string): string[] {
  return catalog.sizeScales?.[scaleId]?.parameterIds ?? [];
}

/**
 * Параметры базового размера: сначала динамика из `workshop-size-handbook` (шкалы и размеры
 * из `production-params` + EU/габариты для одежды), иначе fallback на `sizeScales` JSON каталога.
 */
export function resolveSampleBaseSizeParametersForLeaf(
  attribute: AttributeCatalogAttribute,
  leaf: HandbookCategoryLeaf | undefined,
  sizeScaleId: string | undefined
): AttributeCatalogParameter[] {
  const effective = resolveEffectiveParametersForLeaf(attribute, leaf);
  const key = sizeScaleId ?? defaultWorkshopSampleSizeScaleKey(leaf);
  const workshop = getWorkshopParametersForSampleScale(leaf, key);
  if (workshop.length) return workshop;
  const legacyScaleId = key.includes('::') ? 'apparel-alpha' : key;
  const scaleIds = resolveParameterIdsForSizeScale(legacyScaleId);
  if (!scaleIds.length) return effective;
  const idSet = new Set(scaleIds);
  return effective.filter((p) => idSet.has(p.parameterId));
}

export type ResolvedPhase1AttributeRow = {
  attribute: AttributeCatalogAttribute;
  group: AttributeCatalogGroup | undefined;
};

function sortRowsForPhase1(
  rows: ResolvedPhase1AttributeRow[],
  ids: string[]
): ResolvedPhase1AttributeRow[] {
  const core = catalog.phase1CoreOrder ?? [];
  const idSet = new Set(ids);
  const orderedCore = core.filter((id) => idSet.has(id));
  const used = new Set(orderedCore);
  const rest = rows
    .filter((r) => !used.has(r.attribute.attributeId))
    .sort((a, b) => {
      const ga = a.group?.sortOrder ?? 99;
      const gb = b.group?.sortOrder ?? 99;
      if (ga !== gb) return ga - gb;
      return a.attribute.sortOrder - b.attribute.sortOrder;
    });
  const byId = new Map(rows.map((r) => [r.attribute.attributeId, r]));
  const head = orderedCore
    .map((id) => byId.get(id))
    .filter(Boolean) as ResolvedPhase1AttributeRow[];
  return [...head, ...rest];
}

/** Строки атрибутов для фазы 1: фильтр по workflowPhases, порядок по phase1CoreOrder. */
export function resolvePhase1AttributeRows(leafId: string): ResolvedPhase1AttributeRow[] {
  const ids = resolveAttributeIdsForLeaf(leafId, 1);
  const groupById = new Map(catalog.groups.map((g) => [g.groupId, g]));
  const rows: ResolvedPhase1AttributeRow[] = [];
  for (const id of ids) {
    const attribute = attrById.get(id);
    if (!attribute || !attributeInWorkflowPhase(attribute, 1)) continue;
    rows.push({ attribute, group: groupById.get(attribute.groupId) });
  }
  return sortRowsForPhase1(rows, ids);
}

function sortRowsByGroup(rows: ResolvedPhase1AttributeRow[]): ResolvedPhase1AttributeRow[] {
  return [...rows].sort((a, b) => {
    const ga = a.group?.sortOrder ?? 99;
    const gb = b.group?.sortOrder ?? 99;
    if (ga !== gb) return ga - gb;
    return a.attribute.sortOrder - b.attribute.sortOrder;
  });
}

/** Атрибуты фазы 2 для листа, которых не было на экране фазы 1 (по `workflowPhases`). */
export function resolvePhase2OnlyAttributeRows(leafId: string): ResolvedPhase1AttributeRow[] {
  const idsPhase1 = new Set(resolveAttributeIdsForLeaf(leafId, 1));
  const idsPhase2 = resolveAttributeIdsForLeaf(leafId, 2);
  const phase2OnlyIds = idsPhase2.filter((id) => !idsPhase1.has(id));
  const groupById = new Map(catalog.groups.map((g) => [g.groupId, g]));
  const rows: ResolvedPhase1AttributeRow[] = [];
  for (const id of phase2OnlyIds) {
    const attribute = attrById.get(id);
    if (!attribute || !attributeInWorkflowPhase(attribute, 2)) continue;
    rows.push({ attribute, group: groupById.get(attribute.groupId) });
  }
  return sortRowsByGroup(rows);
}

/** Атрибуты фазы 3 для листа, которых не было на экране фазы 2. */
export function resolvePhase3OnlyAttributeRows(leafId: string): ResolvedPhase1AttributeRow[] {
  const idsPhase2 = new Set(resolveAttributeIdsForLeaf(leafId, 2));
  const idsPhase3 = resolveAttributeIdsForLeaf(leafId, 3);
  const phase3OnlyIds = idsPhase3.filter((id) => !idsPhase2.has(id));
  const groupById = new Map(catalog.groups.map((g) => [g.groupId, g]));
  const rows: ResolvedPhase1AttributeRow[] = [];
  for (const id of phase3OnlyIds) {
    const attribute = attrById.get(id);
    if (!attribute || !attributeInWorkflowPhase(attribute, 3)) continue;
    rows.push({ attribute, group: groupById.get(attribute.groupId) });
  }
  return sortRowsByGroup(rows);
}

export function parameterMatchesAliasSearch(
  param: { label: string; aliases?: string[] },
  q: string
): boolean {
  const s = q.trim().toLowerCase();
  if (!s) return true;
  if (param.label.toLowerCase().includes(s)) return true;
  return (param.aliases ?? []).some((a) => a.toLowerCase().includes(s));
}

function mapAttributesToSearchRows(
  groupById: Map<string, string>,
  attrs: AttributeCatalogAttribute[]
) {
  return attrs.map((a) => {
    const parts = [
      a.name,
      a.attributeId,
      groupById.get(a.groupId) ?? '',
      ...a.parameters.flatMap((p) => [p.label, ...(p.aliases ?? [])]),
    ];
    return {
      attributeId: a.attributeId,
      name: a.name,
      groupLabel: groupById.get(a.groupId) ?? '',
      haystack: parts.join(' ').toLowerCase(),
    };
  });
}

/** Для диалога поиска: атрибуты фазы 1. */
export function listCatalogAttributesForAliasSearch(): {
  attributeId: string;
  name: string;
  groupLabel: string;
  haystack: string;
}[] {
  const groupById = new Map(catalog.groups.map((g) => [g.groupId, g.label]));
  return mapAttributesToSearchRows(
    groupById,
    catalog.attributes.filter((a) => attributeInWorkflowPhase(a, 1) && !a.retiredFromWorkshop)
  );
}

/** Все id атрибутов фазы 1 (для выбора «добавить атрибут»). */
export function listPhase1AttributeIds(): string[] {
  return catalog.attributes
    .filter((a) => attributeInWorkflowPhase(a, 1) && !a.retiredFromWorkshop)
    .map((a) => a.attributeId);
}
