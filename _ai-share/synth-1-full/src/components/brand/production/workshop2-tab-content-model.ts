import type { Workshop2TzSignatoryBindings } from '@/lib/production/workshop2-dossier-phase1.types';
import type { Workshop2RunStatus } from '@/lib/production/workshop2-collection-metrics';

export type Workshop2ArticleRow = {
  id: string;
  /** Внутренний 6-значный номер (100000+), см. local-collection-inventory. */
  internalArticleCode?: string;
  sku: string;
  name: string;
  audienceLabel: string;
  categoryL1: string;
  categoryL2: string;
  categoryL3: string;
  season: string;
  /** Сырой сезон/рынок модели из строки инвентаря (для формы редактирования). */
  workshopLineSeason?: string;
  articleOrigin?: 'new' | 'base';
  attachmentCount?: number;
  commentPreview?: string;
  /** Полный текст комментария (workshopComment). */
  workshopComment?: string;
  /** ISO добавления в разработку коллекции (для сортировки). */
  addedAtIso?: string;
  /** ISO последнего изменения в разработке коллекции (после смены состава и т.п.). */
  updatedAtIso?: string;
  /** Кто добавил строку в разработку коллекции (если есть). */
  createdInWorkshop2By?: string;
  /** Первое изображение из вложений строки (data URL) — для превью в фильтрах. */
  articleThumbDataUrl?: string;
  /** Лист справочника категорий (для формы редактирования). */
  categoryLeafId?: string;
  workshopAttachments?: { name: string; dataUrl: string }[];
  /** Подписанты ТЗ с строки инвентаря (как при создании артикула). */
  workshopTzSignatoryBindings?: Workshop2TzSignatoryBindings;
  /** Теги группировки (из строки инвентаря). */
  workshopTags?: string[];
};

export type Workshop2CreateMeta = {
  id: string;
  name: string;
  createdAt: string;
  createdBy: string;
};

export type Workshop2CollectionMetrics = {
  status: Workshop2RunStatus;
  progressPct: number;
  articleCount: number;
};

export type Workshop2CollectionListItem = {
  id: string;
  displayName: string;
  articleRows: Workshop2ArticleRow[];
  kind: 'ss27' | 'user';
  /** Data URL обложки из localStorage. */
  coverDataUrl?: string;
  /** Блоки даты/времени на карточке (без обрезки многоточием). */
  cardTimestamps?: {
    createdCaption: string;
    createdValue: string;
    updatedCaption?: string;
    updatedValue?: string;
  };
  /** Гвоздик: закреплена вверху списка активных. */
  pinned: boolean;
  /** Цвет метки панели артикулов (пользовательские коллекции). */
  panelAccentHex?: string;
  /** Описание коллекции (пользовательские). */
  description?: string;
  /** Заметка для команды (пользовательские). */
  teamNote?: string;
  /** Для SS27: доп. поля из workshop2Ss27Meta (форма редактирования карточки). */
  targetSeason?: string;
  targetChannel?: string;
  dropDeadlineIso?: string;
};
