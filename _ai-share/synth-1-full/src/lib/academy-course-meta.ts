import type { EducationCourse } from './types';

export type CourseAccess = 'free' | 'paid';

export function inferCourseAccess(course: EducationCourse): CourseAccess {
  if (course.access) return course.access;
  if (course.price != null) return course.price <= 0 ? 'free' : 'paid';
  return 'paid';
}

/** Короткая подпись для карточки: «Бесплатно», сумма или «Платно». */
export function formatCoursePrice(course: EducationCourse): string {
  const access = inferCourseAccess(course);
  if (access === 'free') return 'Бесплатно';
  if (course.price != null && course.price > 0) {
    return `${course.price.toLocaleString('ru-RU')} ₽`;
  }
  return 'Платно';
}

const OUTCOME_LABELS: Record<NonNullable<EducationCourse['outcomeKind']>, string> = {
  diploma: 'Диплом',
  qualification: 'Повышение квалификации',
  certificate: 'Сертификат',
  casual: 'Для себя',
};

export function courseOutcomeLabel(course: EducationCourse): string | null {
  const k = course.outcomeKind;
  if (!k) return null;
  return OUTCOME_LABELS[k];
}

const PROVIDER_KIND_LABELS: Record<NonNullable<EducationCourse['providerKind']>, string> = {
  syntha: 'Syntha',
  brand: 'Бренд',
  school: 'Школа',
  university: 'Университет',
  partner: 'Партнёр',
};

export function courseProviderKindShortLabel(kind: EducationCourse['providerKind']): string | null {
  if (!kind) return null;
  return PROVIDER_KIND_LABELS[kind];
}

const AUDIENCE_LABELS: Record<EducationCourse['audienceKind'], string> = {
  individual: 'Для себя',
  professional: 'Для профи',
};

export function courseAudienceKindLabel(course: EducationCourse): string {
  return AUDIENCE_LABELS[course.audienceKind];
}

export function courseProfessionalScopeLabel(course: EducationCourse): string | null {
  if (course.audienceKind !== 'professional') return null;
  if (course.professionalScope === 'role_team') return 'Команды ролей';
  if (course.professionalScope === 'single_role') return 'По роли';
  return null;
}
