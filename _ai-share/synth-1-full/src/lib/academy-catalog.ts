import type { EducationCourse, LearningPath } from './types';
import { getLearningPathById, mockCourses, mockLearningPaths } from './education-data';
import {
  isCourseVisibleInClientCatalog,
  isPendingPlatformReview,
} from './academy-catalog-rules';
import { DEMO_BRAND_OWNER_ID, DEMO_ORGANIZATION_OWNER_ID } from './academy-constants';

export { DEMO_BRAND_OWNER_ID, DEMO_ORGANIZATION_OWNER_ID } from './academy-constants';
export { filterCoursesVisibleInClientCatalog } from './academy-catalog-rules';

/**
 * Курсы, доступные клиенту в каталоге и по прямой ссылке (без черновиков и очереди).
 */
export function getClientCatalogCourses(): EducationCourse[] {
  return mockCourses.filter(isCourseVisibleInClientCatalog);
}

export function getCourseByIdForClient(id: string): EducationCourse | undefined {
  const c = mockCourses.find((x) => x.id === id);
  if (!c || !isCourseVisibleInClientCatalog(c)) return undefined;
  return c;
}

/** Админка: заявки на публикацию от брендов и организаций. */
export function getCoursesPendingPlatformReview(): EducationCourse[] {
  return mockCourses.filter(isPendingPlatformReview);
}

/**
 * Кабинет бренда: все курсы, где источник — этот бренд (черновик, на согласовании, опубликован).
 */
export function getBrandManagedCourses(brandId: string): EducationCourse[] {
  return mockCourses.filter((c) => c.catalogSource === 'brand' && c.ownerBrandId === brandId);
}

/**
 * Кабинет организации: свои заявки и материалы.
 */
export function getOrganizationManagedCourses(organizationId: string): EducationCourse[] {
  return mockCourses.filter(
    (c) => c.catalogSource === 'organization' && c.ownerOrganizationId === organizationId
  );
}

/**
 * Обучающая студия бренда: витрина платформы + собственные курсы бренда (любой статус для демо).
 */
export function getCoursesForBrandAcademyStudio(brandId: string): EducationCourse[] {
  return mockCourses.filter(
    (c) => c.catalogSource === 'platform' || (c.catalogSource === 'brand' && c.ownerBrandId === brandId)
  );
}

/**
 * Студия организации: витрина платформы + курсы этой организации (любой статус модерации — демо).
 */
export function getCoursesForOrganizationAcademyStudio(organizationId: string): EducationCourse[] {
  return mockCourses.filter(
    (c) =>
      c.catalogSource === 'platform' ||
      (c.catalogSource === 'organization' && c.ownerOrganizationId === organizationId)
  );
}

/**
 * Траектории, в которых все шаги есть в клиентском каталоге.
 * Архивные программы (`path.archived`) включаются — вкладка «Архив» на /academy фильтрует по полю.
 */
export function getLearningPathsForClient(): LearningPath[] {
  const visibleIds = new Set(getClientCatalogCourses().map((c) => c.id));
  return mockLearningPaths.filter((p) => p.courses.every((id) => visibleIds.has(id)));
}

/**
 * Страница траектории в ЛК клиента: только если все курсы программы доступны в каталоге.
 */
export function getLearningPathByIdForClient(id: string): LearningPath | undefined {
  const path = getLearningPathById(id);
  if (!path) return undefined;
  const visibleIds = new Set(getClientCatalogCourses().map((c) => c.id));
  return path.courses.every((cid) => visibleIds.has(cid)) ? path : undefined;
}

/**
 * Программы, где есть этот курс и все шаги уже в клиентском каталоге
 * (для ЛК клиента — без «дырявых» траекторий).
 */
export function getLearningPathsForCourseForClient(courseId: string): LearningPath[] {
  return getLearningPathsForClient().filter((p) => p.courses.includes(courseId));
}

/** Сводка по демо-данным: связь каталог ↔ модерация ↔ студии. */
export interface AcademyCatalogOverview {
  totalCoursesInDataset: number;
  /** Помечены `archived` в данных — не показываются на /academy */
  archivedCourseCountInDataset: number;
  clientCatalogCourseCount: number;
  pendingModerationCount: number;
  clientLearningPathCount: number;
  demoBrandManagedCourseCount: number;
  demoOrganizationManagedCourseCount: number;
}

export function getAcademyCatalogOverview(): AcademyCatalogOverview {
  return {
    totalCoursesInDataset: mockCourses.length,
    archivedCourseCountInDataset: mockCourses.filter((c) => c.archived).length,
    clientCatalogCourseCount: getClientCatalogCourses().length,
    pendingModerationCount: getCoursesPendingPlatformReview().length,
    clientLearningPathCount: getLearningPathsForClient().length,
    demoBrandManagedCourseCount: getBrandManagedCourses(DEMO_BRAND_OWNER_ID).length,
    demoOrganizationManagedCourseCount: getOrganizationManagedCourses(DEMO_ORGANIZATION_OWNER_ID).length,
  };
}
