import { BRANCH_CATALOG_SLOT_ROLE } from '@/lib/production/workshop2-tz-subcategory-sketches';

export const MAX_ANNOTATIONS = 40;
export const MAX_IMAGE_CHARS = 900_000;

/** Подпись блока задач подкатегории без технического slotId. */
export const SUBCATEGORY_TASK_SLOT_FALLBACK: Record<1 | 2 | 3, string> = {
  1: `Задачи слота «${BRANCH_CATALOG_SLOT_ROLE[1].label}»`,
  2: `Задачи слота «${BRANCH_CATALOG_SLOT_ROLE[2].label}»`,
  3: `Задачи слота «${BRANCH_CATALOG_SLOT_ROLE[3].label}»`,
};

export const SKETCH_ONBOARD_LS_KEY = 'category-sketch-onboard-v2';
