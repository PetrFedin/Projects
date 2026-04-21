/**
 * Чтение/запись query-параметров клиентской витрины «Академия» (/academy).
 * Держим в отдельном файле, чтобы не раздувать page.tsx.
 */

export const ACADEMY_TABS = ['courses', 'wiki', 'tests', 'live'] as const;
export type AcademyTab = (typeof ACADEMY_TABS)[number];

export function readAcademyTabFromUrl(): AcademyTab {
  if (typeof window === 'undefined') return 'courses';
  const q = new URLSearchParams(window.location.search).get('tab');
  if (!q) return 'courses';
  return ACADEMY_TABS.includes(q as AcademyTab) ? (q as AcademyTab) : 'courses';
}

export function readFavoritesOnlyFromUrl(): boolean {
  if (typeof window === 'undefined') return false;
  return new URLSearchParams(window.location.search).get('fav') === '1';
}

export function readLiveSegmentFromUrl(): 'upcoming' | 'archive' {
  if (typeof window === 'undefined') return 'upcoming';
  const live = new URLSearchParams(window.location.search).get('live');
  if (live === 'archive' || live === 'upcoming') return live;
  return 'upcoming';
}

/** Сегмент «База знаний»: актуальные материалы или архив (?kbase=archive). */
export function readKbaseSegmentFromUrl(): 'current' | 'archive' {
  if (typeof window === 'undefined') return 'current';
  const v = new URLSearchParams(window.location.search).get('kbase');
  return v === 'archive' ? 'archive' : 'current';
}

/** Сегмент «Тесты»: активные или архив (?att=archive). */
export function readAttSegmentFromUrl(): 'current' | 'archive' {
  if (typeof window === 'undefined') return 'current';
  const v = new URLSearchParams(window.location.search).get('att');
  return v === 'archive' ? 'archive' : 'current';
}

/** Сегмент «Все программы»: активный каталог или архив (?programs=archive). */
export function readProgramsCatalogSegmentFromUrl(): 'current' | 'archive' {
  if (typeof window === 'undefined') return 'current';
  const v = new URLSearchParams(window.location.search).get('programs');
  return v === 'archive' ? 'archive' : 'current';
}

/** Сегмент «Траектории обучения»: актуальные или архив (?paths=archive). */
export function readPathsSegmentFromUrl(): 'current' | 'archive' {
  if (typeof window === 'undefined') return 'current';
  const v = new URLSearchParams(window.location.search).get('paths');
  return v === 'archive' ? 'archive' : 'current';
}
