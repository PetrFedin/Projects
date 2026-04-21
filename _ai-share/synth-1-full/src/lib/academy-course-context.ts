import type { EducationCourse } from './types';
import { ROUTES } from './routes';
import { isCourseVisibleInClientCatalog } from './academy-catalog-rules';

/**
 * Состояние курса относительно клиентской витрины /academy.
 * Используется в кабинете бренда и в админке модерации.
 */
export type ClientCatalogPreview =
  | { kind: 'live'; href: string }
  | {
      kind: 'blocked';
      title: string;
      description: string;
      primaryAction?: { label: string; href: string };
      secondaryAction?: { label: string; href: string };
    };

/** Ссылка «как увидит клиент» или объяснение, почему ещё нет. */
export function getClientCatalogPreview(course: EducationCourse): ClientCatalogPreview {
  if (isCourseVisibleInClientCatalog(course)) {
    return { kind: 'live', href: ROUTES.clientAcademyCourse(course.id) };
  }
  if (course.archived) {
    return {
      kind: 'blocked',
      title: 'Архив витрины',
      description:
        'Курс снят с активного клиентского каталога. В кабинете бренда он может оставаться для внутреннего просмотра.',
      primaryAction: { label: 'Витрина платформы', href: ROUTES.brand.academyPlatform },
    };
  }
  if (course.moderationStatus === 'pending_review') {
    return {
      kind: 'blocked',
      title: 'На модерации платформы',
      description:
        'После одобрения курс появится в каталоге для клиентов. Предпросмотр в кабинете бренда сохраняется.',
      primaryAction: { label: 'Очередь модерации', href: ROUTES.admin.academyModeration },
      secondaryAction:
        course.catalogSource === 'organization'
          ? { label: 'Студия организации', href: ROUTES.brand.academyOrganizationStudio }
          : { label: 'Витрина платформы', href: ROUTES.brand.academyPlatform },
    };
  }
  if (course.moderationStatus === 'draft') {
    return {
      kind: 'blocked',
      title: 'Черновик',
      description: 'Отправьте курс на согласование из студии, чтобы он попал в очередь модераторов.',
      primaryAction: { label: 'Витрина платформы', href: ROUTES.brand.academyPlatform },
    };
  }
  if (course.moderationStatus === 'rejected') {
    return {
      kind: 'blocked',
      title: 'Не прошёл модерацию',
      description: 'Исправьте материалы и повторно отправьте заявку из студии автора.',
      primaryAction: { label: 'Очередь модерации', href: ROUTES.admin.academyModeration },
    };
  }
  return {
    kind: 'blocked',
    title: 'Не в клиентском каталоге',
    description: 'Курс не отображается клиентам на витрине /academy.',
    primaryAction: { label: 'Витрина платформы', href: ROUTES.brand.academyPlatform },
  };
}

/** «Дом» студии автора: бренд или организация (для платформенных курсов — null). */
export function getAuthorWorkspaceHome(course: EducationCourse): { label: string; href: string } | null {
  if (course.catalogSource === 'brand') {
    return { label: 'Витрина платформы (бренд)', href: ROUTES.brand.academyPlatform };
  }
  if (course.catalogSource === 'organization') {
    return { label: 'Студия организации', href: ROUTES.brand.academyOrganizationStudio };
  }
  return null;
}
