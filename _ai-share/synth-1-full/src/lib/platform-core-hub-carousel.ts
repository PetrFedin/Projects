import { cn } from '@/lib/utils';
import { PLATFORM_CORE_HORIZONTAL_SCROLL } from '@/lib/platform-core-header-controls';

/** iPhone: горизонтальная карусель с bleed. */
export const PLATFORM_CORE_HUB_CARD_ROW_MOBILE = cn(
  PLATFORM_CORE_HORIZONTAL_SCROLL,
  'snap-x snap-mandatory gap-2',
  '-mx-4 scroll-px-4 px-4 pb-0.5 md:hidden'
);

/** Mobile carousel → md+ grid 2×2 (роли), без дубля карточек в DOM. */
export const PLATFORM_CORE_HUB_CARD_ROW_ROLES = cn(
  'grid grid-cols-2 gap-1.5',
  'md:mx-0 md:grid md:grid-cols-2 md:gap-3 lg:grid-cols-2'
);

/** Mobile carousel → md+ grid 3 колонки (столпы). */
export const PLATFORM_CORE_HUB_CARD_ROW_PILLARS = cn(
  PLATFORM_CORE_HORIZONTAL_SCROLL,
  'snap-x snap-mandatory gap-2',
  '-mx-4 scroll-px-4 px-4 pb-0.5',
  'md:mx-0 md:grid md:grid-cols-3 md:gap-4 md:overflow-visible md:px-0 md:pb-0 md:snap-none lg:grid-cols-3'
);

/** Legacy / RoleCabinetBlocks — карусель mobile + сетка desktop. */
export const PLATFORM_CORE_HUB_CARD_ROW = cn(
  PLATFORM_CORE_HORIZONTAL_SCROLL,
  'snap-x snap-mandatory gap-2',
  '-mx-4 scroll-px-4 px-4 pb-0.5',
  'md:mx-0 md:grid md:grid-cols-2 md:overflow-visible md:px-0 md:pb-0 md:snap-none md:gap-4 lg:grid-cols-4'
);

/** Карточка в сетке ролей / столпов hub (компактная, иконка слева). */
export const PLATFORM_CORE_HUB_CARD_ROLE = cn(
  'border-border-subtle flex w-full min-w-0 flex-col rounded-lg border bg-white p-1 shadow-sm transition-colors',
  'md:w-auto',
  'lg:hover:border-accent-primary/40 lg:hover:-translate-y-0.5 lg:hover:shadow-md lg:transition-all'
);

/** Карточка в горизонтальной карусели (legacy). */
export const PLATFORM_CORE_HUB_CARD = cn(
  'border-border-subtle flex w-[min(68vw,15rem)] shrink-0 snap-start flex-col rounded-lg border bg-white p-1 shadow-sm transition-colors',
  'md:w-auto',
  'lg:hover:border-accent-primary/40 lg:hover:-translate-y-0.5 lg:hover:shadow-md lg:transition-all'
);
