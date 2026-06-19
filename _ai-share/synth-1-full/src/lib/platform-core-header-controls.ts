import { cn } from '@/lib/utils';

/** Mobile: h-9 как иконка hub-панели; sm+: h-8 как текстовые вкладки. */
export const PLATFORM_CORE_HEADER_CONTROL_BTN =
  'inline-flex h-9 sm:h-8 shrink-0 items-center justify-center whitespace-nowrap rounded-xl border px-2.5 text-[10px] font-bold uppercase tracking-wide transition-all';

export function platformCoreHeaderControlBtnClass(active: boolean): string {
  return cn(
    PLATFORM_CORE_HEADER_CONTROL_BTN,
    'min-w-[3.25rem]',
    active ? 'btn-tab-active' : 'btn-tab-inactive-light'
  );
}

/** Hub-вкладки чуть шире. */
export const PLATFORM_CORE_HEADER_HUB_TAB_BTN = cn(
  PLATFORM_CORE_HEADER_CONTROL_BTN,
  'min-w-[4.25rem] sm:min-w-[4.75rem]'
);

export function platformCoreHeaderHubTabClass(active: boolean): string {
  return cn(PLATFORM_CORE_HEADER_HUB_TAB_BTN, active ? 'btn-tab-active' : 'btn-tab-inactive-light');
}

/** Иконка mobile hub-menu — та же высота, что B2B/B2C. */
export const PLATFORM_CORE_HEADER_ICON_BTN =
  'relative inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md';

/** Горизонтальный свайп на iPhone — без переноса строк. */
export const PLATFORM_CORE_HORIZONTAL_SCROLL =
  'flex flex-nowrap items-center gap-1 overflow-x-auto overscroll-x-contain [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden';
