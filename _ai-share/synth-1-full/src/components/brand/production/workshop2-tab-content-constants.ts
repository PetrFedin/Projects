import { COLLECTION_STEPS } from '@/lib/production/collection-steps-catalog';
import { COLLECTION_DEV_HUB_LEAD_RU } from '@/lib/production/collection-development-labels';

/** Подзаголовок хаба Workshop2 (одна строка на узком экране). */
export const WORKSHOP2_TAB_CONTENT_PAGE_SUBTITLE = COLLECTION_DEV_HUB_LEAD_RU;

export const READINESS_HELP =
  'Показатель заполнения этапов по подборке: число завершённых пар «артикул × этап» (done/skipped) к общему числу таких пар. Диапазон 0–100%. На мини-шкале слева — разработка и ТЗ (в каталоге — в т.ч. tech-pack и gate-all-stakeholders), справа — от supply-path: сэмплы и выпуск (в досье артикула те же контуры: обзор/ТЗ vs снабжение и далее).';

/** Подсказки для поля «Канал»; можно ввести любой свой текст. */
export const WORKSHOP2_TARGET_CHANNEL_SUGGESTIONS = [
  'Retail',
  'E-com / D2C',
  'Опт',
  'Маркетплейсы',
  'Showroom',
  'B2B',
] as const;

export const WORKSHOP2_AUDIENCE_FILTER_TITLE =
  'Аудитория: сегмент из справочника CATEGORY_HANDBOOK (как у артикула на вкладке «Этапы»).';
export const WORKSHOP2_CAT_L1_FILTER_TITLE =
  'Уровень 1: первая ветка категории под выбранной аудиторией (aud.categories в справочнике).';
export const WORKSHOP2_CAT_L2_FILTER_TITLE = 'Уровень 2: следующий уровень ветки категории.';
export const WORKSHOP2_CAT_L3_FILTER_TITLE =
  'Уровень 3: подкатегория / терминальный уровень ветки перед листом справочника.';

export const COLLECTION_STEP_BY_ID = new Map(COLLECTION_STEPS.map((s) => [s.id, s] as const));
