/**
 * Асинхронный фасад академии для UI, React Query и будущего FastAPI.
 * Методы: клиентский каталог и траектории, очередь модерации, студии бренда/организации,
 * сводка `getCatalogOverview`, привязка курса к программам `listLearningPathsContainingCourseForClient`,
 * сырые списки «только свои курсы» бренда/организации (`listBrandManagedCourses` / `listOrganizationManagedCourses`).
 * Поле `demoIds` — стабильные id владельцев для демо-данных.
 */

import type { EducationCourse, LearningPath } from './types';
import {
  filterCoursesVisibleInClientCatalog,
  getAcademyCatalogOverview,
  getClientCatalogCourses,
  getCourseByIdForClient,
  getCoursesForBrandAcademyStudio,
  getCoursesForOrganizationAcademyStudio,
  getCoursesPendingPlatformReview,
  getLearningPathByIdForClient,
  getLearningPathsForClient,
  getLearningPathsForCourseForClient,
  getBrandManagedCourses,
  getOrganizationManagedCourses,
} from './academy-catalog';
import { DEMO_BRAND_OWNER_ID, DEMO_ORGANIZATION_OWNER_ID } from './academy-constants';

export const academyApi = {
  listClientCourses(): Promise<EducationCourse[]> {
    return Promise.resolve(getClientCatalogCourses());
  },

  getClientCourse(id: string): Promise<EducationCourse | undefined> {
    return Promise.resolve(getCourseByIdForClient(id));
  },

  listClientLearningPaths(): Promise<LearningPath[]> {
    return Promise.resolve(getLearningPathsForClient());
  },

  getClientLearningPath(id: string): Promise<LearningPath | undefined> {
    return Promise.resolve(getLearningPathByIdForClient(id));
  },

  listPendingModeration(): Promise<EducationCourse[]> {
    return Promise.resolve(getCoursesPendingPlatformReview());
  },

  /** Кабинет бренда: витрина платформы + курсы бренда (все статусы — демо). */
  listBrandStudioCourses(brandId: string): Promise<EducationCourse[]> {
    return Promise.resolve(getCoursesForBrandAcademyStudio(brandId));
  },

  /** Студия организации: витрина + курсы организации (все статусы — демо). */
  listOrganizationStudioCourses(organizationId: string): Promise<EducationCourse[]> {
    return Promise.resolve(getCoursesForOrganizationAcademyStudio(organizationId));
  },

  /** Сводные цифры по мокам: каталог, очередь, студии демо. */
  getCatalogOverview(): Promise<ReturnType<typeof getAcademyCatalogOverview>> {
    return Promise.resolve(getAcademyCatalogOverview());
  },

  /** Программы с полностью опубликованными шагами, содержащие курс. */
  listLearningPathsContainingCourseForClient(courseId: string): Promise<LearningPath[]> {
    return Promise.resolve(getLearningPathsForCourseForClient(courseId));
  },

  listBrandManagedCourses(brandId: string): Promise<EducationCourse[]> {
    return Promise.resolve(getBrandManagedCourses(brandId));
  },

  listOrganizationManagedCourses(organizationId: string): Promise<EducationCourse[]> {
    return Promise.resolve(getOrganizationManagedCourses(organizationId));
  },

  /** Идентификаторы демо-владельцев для студий в моках. */
  demoIds: {
    brandOwner: DEMO_BRAND_OWNER_ID,
    organizationOwner: DEMO_ORGANIZATION_OWNER_ID,
  } as const,

  /** Сузить произвольный список курсов до тех, что видны клиентам на /academy. */
  filterToClientCatalog(courses: EducationCourse[]): Promise<EducationCourse[]> {
    return Promise.resolve(filterCoursesVisibleInClientCatalog(courses));
  },
};
