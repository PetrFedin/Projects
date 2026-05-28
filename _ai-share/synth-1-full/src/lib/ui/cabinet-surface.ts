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
 * - Клиент `app/client/layout.tsx` → `ClientCabinetShell` (`client-cabinet-shell.tsx`): standard; User, «Личный кабинет»; `cabinetHubLayout.mainInner`; `/client/me` без второго layout.
 * - Общие классы корня/сайдбара/main: `cabinetHubLayout` (`rootShell`, `asideChrome`, `mainInner`, `loadingShell`).
 *
 * Логика и маршруты не трогаем; только className. См. `registry-feed-layout.ts`, FIGMA_SPEC_PACK_RU §3.
 *
 * Дополнительно: `hubMainContentPaddingX` — тот же горизонтальный inset, что у `CabinetHubMain`, для full-bleed
 * страниц (напр. шапка whiteboard); `hubAccessDeniedShell` — единый блок «нет доступа к кабинету».
 */
import { registryFeedLayout } from '@/lib/ui/registry-feed-layout';

/** Горизонтальные отступы основной колонки хаба — один ритм, без «двойного» px с PageContainer/CabinetPageContent. */
const HUB_MAIN_CONTENT_PAD_X = 'px-3 lg:px-4' as const;

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

/** Вертикальный ритм панели Radix `TabsContent` в кабинетных профилях (клиент, бренд, …). */
const CABINET_PROFILE_TAB_CONTENT =
  'space-y-3 pt-0 pb-6 duration-300 animate-in fade-in-50 outline-none' as const;

export const cabinetSurface = {
  /** Список вкладок — как marketing hub + analytics-360 (`min-h-9`, без фикс. h для переноса строк) */
  tabsList:
    'flex min-h-9 w-full flex-wrap items-center justify-start gap-0.5 rounded-xl border border-border-subtle bg-bg-surface2 p-1 text-muted-foreground',

  /** Триггер вкладки — одна высота и типографика во всех кабинетах */
  tabsTrigger:
    'gap-2 rounded-lg px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground transition-colors data-[state=active]:bg-bg-surface data-[state=active]:text-accent-primary data-[state=active]:shadow-sm',

  /**
   * Контент основной колонки вкладок `/client/me` (профиль клиента): плотный ритм (ориентир Joor/NuORDER).
   * Визуальный слой NuOrder: `nuorder-desk-shell.ts` + `UserCabinetLayout`; контур заказа — `ShopB2bNuOrderScope`.
   */
  clientMeTabContent: CABINET_PROFILE_TAB_CONTENT,

  /** То же, что `clientMeTabContent` — для тяжёлых профильных страниц (напр. `/brand/profile`). */
  cabinetProfileTabPanel: CABINET_PROFILE_TAB_CONTENT,

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
  hubMainColumn: `${HUB_MAIN_CONTENT_PAD_X} pt-4 space-y-3`,

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

/**
 * Общая геометрия и `<main>` для кабинетов на базе `HubSidebar` / `CabinetHubMain`
 * (admin, shop, distributor, factory, client). Бренд — тот же `mainInner` под контентом.
 */
export const cabinetHubLayout = {
  rootShell: 'bg-bg-surface flex min-h-screen w-full pb-12 font-sans',
  asideChrome:
    'lg:border-border-subtle lg:bg-bg-surface hidden lg:fixed lg:bottom-0 lg:left-0 lg:top-24 lg:z-30 lg:flex lg:shrink-0 lg:flex-col lg:border-r lg:pt-4',
  /**
   * Область контента под шапкой хаба: анимация входа + сброс двойного padding у вложенного `.container`.
   * Внутри страниц используйте `CabinetPageContent` (`components/layout/cabinet-page-content.tsx`), а не
   * сырые `container mx-auto px-4` — горизонтальные inset уже задаёт колонка хаба (`hubMainColumn`).
   */
  mainInner:
    'duration-300 animate-in fade-in [&_.container]:mx-0 [&_.container]:max-w-none [&_.container]:px-2 lg:[&_.container]:px-3',
  /** Переключение хабов (дистрибьютор / производство / поставщик). */
  hubSwitcherLink:
    'text-text-secondary hover:bg-bg-surface2 hover:text-text-primary flex items-center gap-2 rounded-lg px-3 py-1.5 text-[10px] font-bold',
  loadingShell: 'bg-bg-surface flex min-h-screen items-center justify-center',
  /** Fallback для `Suspense` внутри хаба (как в admin). */
  suspenseFallback: 'min-h-[40vh] animate-pulse rounded-md bg-muted/30',
} as const;
