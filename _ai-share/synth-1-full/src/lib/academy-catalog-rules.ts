import type { EducationCourse } from './types';

/**
 * Клиентская витрина /academy: платформенные курсы и курсы брендов/организаций
 * только после одобрения модератором Syntha. Снятые в архив (`archived`) не показываются.
 */
export function isCourseVisibleInClientCatalog(course: EducationCourse): boolean {
  if (course.archived) return false;
  if (course.catalogSource === 'platform') return true;
  return course.moderationStatus === 'approved';
}

/** Очередь модерации в админке: бренд или организация подали, ждут решения. */
export function isPendingPlatformReview(course: EducationCourse): boolean {
  if (course.catalogSource === 'platform') return false;
  return course.moderationStatus === 'pending_review';
}

export function isDraftOrRejected(course: EducationCourse): boolean {
  return course.moderationStatus === 'draft' || course.moderationStatus === 'rejected';
}

/** Подмножество курсов, которые реально попадают в клиентский каталог /academy. */
export function filterCoursesVisibleInClientCatalog(courses: EducationCourse[]): EducationCourse[] {
  return courses.filter(isCourseVisibleInClientCatalog);
}
