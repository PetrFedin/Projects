import type { EducationCourse } from './types';
import { academyCategorySlugToLabel } from './academy-url-filters';

/** Источник курса в каталоге академии — для админки и студий. */
export function catalogSourceLabel(source: EducationCourse['catalogSource']): string {
  switch (source) {
    case 'platform':
      return 'Платформа';
    case 'brand':
      return 'Бренд';
    case 'organization':
      return 'Организация';
    default:
      return source;
  }
}

/** Короткая подпись статуса модерации для карточек студий. */
export function moderationStatusStudioLabel(
  status: EducationCourse['moderationStatus'] | undefined
): string {
  switch (status) {
    case 'approved':
      return 'В каталоге';
    case 'pending_review':
      return 'На модерации';
    case 'draft':
      return 'Черновик';
    case 'rejected':
      return 'Отклонён';
    default:
      return 'Статус не задан';
  }
}

export type ModerationBadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline';

/** Вариант бейджа shadcn/ui под статус модерации. */
export function moderationStatusBadgeVariant(
  status: EducationCourse['moderationStatus'] | undefined
): ModerationBadgeVariant {
  switch (status) {
    case 'approved':
      return 'default';
    case 'pending_review':
      return 'secondary';
    case 'rejected':
      return 'destructive';
    case 'draft':
    default:
      return 'outline';
  }
}

/** Русское название категории курса (slug из EducationCourse.category). */
export function courseCategoryRu(category: EducationCourse['category']): string {
  return academyCategorySlugToLabel(category);
}
