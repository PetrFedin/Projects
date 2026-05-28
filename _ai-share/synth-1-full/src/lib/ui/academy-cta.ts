import { cn } from '@/lib/utils';

/**
 * Основные CTA витрины академии (`/academy`, карточка курса, траектория).
 * Эталон — кнопка «Начать путь» на карточке траектории: `size="sm"` + этот класс.
 */
export const ACADEMY_CTA_PRIMARY = cn(
  'inline-flex h-7 items-center justify-center gap-1.5 rounded-lg bg-[#0b63ce] px-4 text-[11px] font-semibold text-white shadow-sm',
  'hover:bg-[#0954b0]'
);

/** Вторичная кнопка в той же визуальной сетке (например «Все курсы», «Назад к каталогу»). */
export const ACADEMY_CTA_SECONDARY = cn(
  'inline-flex h-7 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 text-[11px] font-semibold text-[#1a2433] shadow-sm',
  'hover:border-[#0b63ce]/35 hover:text-[#0b63ce]'
);

/** Та же первичная кнопка на всю ширину контейнера (подвал карточки аттестации). */
export const ACADEMY_CTA_PRIMARY_FULL_WIDTH = cn(ACADEMY_CTA_PRIMARY, 'w-full');

/** Неактивная первичная по геометрии (архив программы и т.п.). */
export const ACADEMY_CTA_DISABLED = cn(
  'inline-flex h-7 cursor-not-allowed items-center justify-center rounded-lg bg-slate-200 px-4 text-[11px] font-semibold text-slate-500 shadow-none'
);
