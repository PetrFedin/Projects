/**
 * Cabinet surface v1 — единые визуальные классы для вкладок, мета-бейджей и подсказок
 * внутри кабинетов. Подписи ролей: `cabinetRoleLabelRu` (`cabinet-role-labels.ts`).
 *
 * Утверждённая сетка layout (ширины — `cabinetSidebarLayout` ниже):
 * - Админ `app/admin/layout.tsx`: standard w/pl; Shield, «Админ-центр», бейдж HQ; HubSidebar ← adminNavGroups;
 *   хром: CabinetHubTitleRow + CabinetHubSectionBar (amber); main → Suspense → children.
 * - Бренд `app/brand/layout.tsx`: brand w/pl; SidebarOrgHeader; BrandSidebar ← brandNavGroups (+ RBAC / businessMode);
 *   хром: TitleRow + SectionBar + BrandSectionHeaderBlock + StageContextBar; контент: PageContainer (cabinet v1).
 * - Магазин `app/shop/layout.tsx`: standard; ShopSidebarHeader; ShopSidebar ← shopNavGroups; rose accent.
 * - Дистрибьютор `app/distributor/layout.tsx`: standard; Briefcase, «Кабинет дистрибьютора», бейдж «Опт»; amber; хабы в trailing.
 * - Производство/поставщик `app/factory/.../layout.tsx`: standard; Factory / Warehouse; manufacturerNavGroups | supplierNavGroups; emerald.
 * - Клиент `app/client/layout.tsx`: standard; User, «Личный кабинет», бейдж «Клиент»; accent-primary; main с [&_.container].
 *
 * Логика и маршруты не трогаем; только className. См. `registry-feed-layout.ts`, FIGMA_SPEC_PACK_RU §3.
 *
 * Дополнительно: `hubMainContentPaddingX` — тот же горизонтальный inset, что у `CabinetHubMain`, для full-bleed
 * страниц (напр. шапка whiteboard); `hubAccessDeniedShell` — единый блок «нет доступа к кабинету».
 */
import { registryFeedLayout } from '@/lib/ui/registry-feed-layout';

/** Горизонтальные отступы основной колонки хаба (совпадают с `hubMainColumn`, без вертикали). Для full-bleed страниц внутри кабинета — шапки, канваса. */
const HUB_MAIN_CONTENT_PAD_X = 'pl-2 pr-4 lg:pl-3 lg:pr-6' as const;

/**
 * Ширина колонки сайдбара на `lg` и отступ основной области (`pl`) — единый источник правды.
 * См. комментарий вверху файла (admin/shop/distributor/factory/client — 52; brand — 56).
 */
export const cabinetSidebarLayout = {
  asideWidthStandard: 'lg:w-52',
  mainPaddingLeftStandard: 'lg:pl-52',
  asideWidthBrand: 'lg:w-56',
  mainPaddingLeftBrand: 'lg:pl-56',
} as const;

/** Плоские алиасы для импорта без обращения к объекту (и для поиска по репо). */
export const CABINET_SIDEBAR_LG_W = cabinetSidebarLayout.asideWidthStandard;
export const CABINET_MAIN_LG_PL = cabinetSidebarLayout.mainPaddingLeftStandard;
export const BRAND_SIDEBAR_LG_W = cabinetSidebarLayout.asideWidthBrand;
export const BRAND_MAIN_LG_PL = cabinetSidebarLayout.mainPaddingLeftBrand;
/** Короткое имя из обсуждения: ширина сайдбара кабинета бренда */
export const BRAND_SIDEBAR_W = cabinetSidebarLayout.asideWidthBrand;

export const cabinetSurface = {
  /** Список вкладок — как marketing hub + analytics-360 (`min-h-9`, без фикс. h для переноса строк) */
  tabsList:
    'flex min-h-9 w-full flex-wrap items-center justify-start gap-0.5 rounded-xl border border-border-subtle bg-bg-surface2 p-1 text-muted-foreground',

  /** Триггер вкладки — одна высота и типографика во всех кабинетах */
  tabsTrigger:
    'gap-2 rounded-lg px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground transition-colors data-[state=active]:bg-bg-surface data-[state=active]:text-accent-primary data-[state=active]:shadow-sm',

  /** Верхний сегмент «группа разделов» (не shadcn Tabs), визуально как tabsList */
  groupTabList:
    'inline-flex h-10 items-center gap-0.5 rounded-xl border border-border-subtle bg-bg-surface2 p-1 text-muted-foreground',

  groupTabButton:
    'inline-flex items-center justify-center rounded-lg px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground transition-colors hover:text-text-primary',

  groupTabButtonActive: 'bg-bg-surface text-accent-primary shadow-sm ring-1 ring-border-subtle',

  /** Контент Tooltip / пояснения к полям — один padding и размер шрифта */
  tooltipContent:
    'max-w-[260px] rounded-md border border-border-subtle bg-popover p-2 text-[10px] font-medium leading-relaxed text-popover-foreground shadow-md',

  /**
   * Компактный мета-бейдж (строки таблиц, статусы) — h-6 + text-[10px].
   * Семантику цвета задавайте вторым аргументом в `cn(..., 'border-emerald-200 ...')`.
   */
  badgeMetaRow:
    'inline-flex h-6 items-center gap-1 rounded-md border px-2 text-[10px] font-semibold leading-none',

  /** Внутренняя панель внутри вкладки — тот же токен, что и мягкие карточки реестра */
  panelInner: registryFeedLayout.panelCardSoft,

  /** Заголовок секции внутри таба */
  sectionHeader: 'space-y-1 border-b border-border-subtle pb-4',
  sectionTitle: 'text-base font-semibold text-text-primary',
  sectionLead: 'text-sm text-text-secondary',

  /** Только горизонтальный inset контента хаба (как у `CabinetHubMain`). */
  hubMainContentPaddingX: HUB_MAIN_CONTENT_PAD_X,

  /**
   * Общая колонка контента справа от сайдбара (кабинеты admin/shop/factory/…).
   * См. `CabinetHubMain` + FIGMA spec pack §5.1.
   */
  hubMainColumn: `${HUB_MAIN_CONTENT_PAD_X} pt-6 space-y-4`,

  /** Единая вёрстка экрана «нет доступа к кабинету» (роль / гостевой вход). */
  hubAccessDeniedShell:
    'mx-auto flex min-h-[50vh] max-w-[1400px] flex-col items-center justify-center px-8 py-12 text-center',
  hubTitleRow: 'flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3',
  hubTitleLeading: 'flex items-center gap-2 sm:gap-3 min-w-0',
  hubMenuButton: 'size-11 shrink-0 rounded-md hover:bg-bg-surface2 lg:hidden',
  /** Базовая плитка иконки хаба; цвета и тень — вторым классом (`bg-text-primary text-text-inverse` и т.д.) */
  hubIconTile: 'flex size-11 shrink-0 items-center justify-center rounded-md',
  hubH1:
    'truncate text-sm font-black uppercase leading-none tracking-tighter text-text-primary sm:text-base',
  hubSectionRow: 'flex items-center justify-between border-b border-border-subtle pb-4',
  hubSectionLeading: 'flex min-w-0 items-center gap-3',
  hubAccentRail: 'h-4 w-0.5 shrink-0 rounded-full',
  hubSectionTitleStack: 'min-w-0 space-y-2',
  hubH2: 'text-[11px] font-black uppercase tracking-[0.25em] text-text-primary',
} as const;
