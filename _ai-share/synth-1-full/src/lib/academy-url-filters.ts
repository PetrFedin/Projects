/**
 * Сериализация фильтров вкладки «Курсы» академии в query-параметры (шаринг и deeplink).
 * Префикс не используем — ключи короткие: q, cat, access, out, org, aud.
 */

export const ACADEMY_COURSE_CATEGORY_SLUGS = [
  'all',
  'economics',
  'design',
  'production',
  'analytics',
  'management',
  'retail',
  'legal',
] as const;

export type AcademyCourseCategorySlug = (typeof ACADEMY_COURSE_CATEGORY_SLUGS)[number];

const LABEL_TO_SLUG: Record<string, AcademyCourseCategorySlug> = {
  Все: 'all',
  Экономика: 'economics',
  Дизайн: 'design',
  Производство: 'production',
  Аналитика: 'analytics',
  Менеджмент: 'management',
  Ритейл: 'retail',
  Право: 'legal',
};

const SLUG_TO_LABEL: Record<AcademyCourseCategorySlug, string> = {
  all: 'Все',
  economics: 'Экономика',
  design: 'Дизайн',
  production: 'Производство',
  analytics: 'Аналитика',
  management: 'Менеджмент',
  retail: 'Ритейл',
  legal: 'Право',
};

export function academyCategoryLabelToSlug(label: string): AcademyCourseCategorySlug {
  return LABEL_TO_SLUG[label] ?? 'all';
}

export function academyCategorySlugToLabel(slug: string): string {
  if (slug === 'all' || ACADEMY_COURSE_CATEGORY_SLUGS.includes(slug as AcademyCourseCategorySlug)) {
    return SLUG_TO_LABEL[slug as AcademyCourseCategorySlug];
  }
  return 'Все';
}

export type AcademyCourseFiltersSnapshot = {
  searchQuery: string;
  activeCategory: string;
  accessFilter: 'all' | 'free' | 'paid';
  outcomeFilter: 'all' | 'diploma' | 'qualification' | 'certificate' | 'casual';
  /** Точное название организации-источника (`EducationCourse.provider`), либо `all` */
  providerOrgFilter: string;
  audienceKindFilter: 'all' | 'individual' | 'professional';
};

/** Прочитать фильтры из URL (только известные ключи). */
export function readAcademyCourseFiltersFromSearchParams(
  sp: URLSearchParams
): Partial<AcademyCourseFiltersSnapshot> {
  const out: Partial<AcademyCourseFiltersSnapshot> = {};

  const q = sp.get('q');
  if (q != null) out.searchQuery = q;

  const cat = sp.get('cat');
  if (cat) out.activeCategory = academyCategorySlugToLabel(cat);

  const access = sp.get('access');
  if (access === 'all' || access === 'free' || access === 'paid') out.accessFilter = access;

  const ou = sp.get('out');
  if (
    ou === 'all' ||
    ou === 'diploma' ||
    ou === 'qualification' ||
    ou === 'certificate' ||
    ou === 'casual'
  ) {
    out.outcomeFilter = ou;
  }

  const org = sp.get('org');
  if (org != null && org !== '') {
    try {
      out.providerOrgFilter = decodeURIComponent(org);
    } catch {
      out.providerOrgFilter = org;
    }
  }

  const aud = sp.get('aud');
  if (aud === 'all' || aud === 'individual' || aud === 'professional') {
    out.audienceKindFilter = aud;
  }

  return out;
}

/** Записать фильтры в URLSearchParams (undefined / default — удалить ключ). */
export function writeAcademyCourseFiltersToSearchParams(
  sp: URLSearchParams,
  f: AcademyCourseFiltersSnapshot
): void {
  const setOrDel = (key: string, value: string, defaultValue: string) => {
    if (value === defaultValue) sp.delete(key);
    else sp.set(key, value);
  };

  if (f.searchQuery.trim()) sp.set('q', f.searchQuery.trim());
  else sp.delete('q');

  const catSlug = academyCategoryLabelToSlug(f.activeCategory);
  setOrDel('cat', catSlug, 'all');

  setOrDel('access', f.accessFilter, 'all');
  setOrDel('out', f.outcomeFilter, 'all');
  if (f.providerOrgFilter === 'all') sp.delete('org');
  else sp.set('org', encodeURIComponent(f.providerOrgFilter));
  setOrDel('aud', f.audienceKindFilter, 'all');
}

const FILTER_KEYS = ['q', 'cat', 'access', 'out', 'org', 'aud'] as const;

/** Снимок только фильтров каталога (без tab, fav, …). */
export function getAcademyCourseFilterParamString(f: AcademyCourseFiltersSnapshot): string {
  const t = new URLSearchParams();
  writeAcademyCourseFiltersToSearchParams(t, f);
  const entries = FILTER_KEYS.map((k) => [k, t.get(k) ?? ''] as const).sort((a, b) => a[0].localeCompare(b[0]));
  return entries.map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&');
}

export function academyCourseFiltersMatchUrl(sp: URLSearchParams, f: AcademyCourseFiltersSnapshot): boolean {
  const expected = new URLSearchParams();
  writeAcademyCourseFiltersToSearchParams(expected, f);
  return FILTER_KEYS.every((k) => (sp.get(k) ?? '') === (expected.get(k) ?? ''));
}

/** Полное состояние фильтров из URL (пустые ключи → значения по умолчанию). */
export function parseAcademyCourseFiltersSnapshot(sp: URLSearchParams): AcademyCourseFiltersSnapshot {
  const partial = readAcademyCourseFiltersFromSearchParams(sp);
  return {
    searchQuery: partial.searchQuery ?? '',
    activeCategory: partial.activeCategory ?? 'Все',
    accessFilter: partial.accessFilter ?? 'all',
    outcomeFilter: partial.outcomeFilter ?? 'all',
    providerOrgFilter: partial.providerOrgFilter ?? 'all',
    audienceKindFilter: partial.audienceKindFilter ?? 'all',
  };
}

export function urlHasAcademyCourseFilterKeys(sp: URLSearchParams): boolean {
  return FILTER_KEYS.some((k) => sp.has(k));
}
