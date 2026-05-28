/**
 * Единый визуальный язык реестров / лент / операционных таблиц (эталон — «Глобальная лента событий» в admin/activity).
 * Использовать для заголовков страниц и панелей внутри кабинетов, чтобы не плодить разные отступы и шрифты.
 */
export const registryFeedLayout = {
  /** Оболочка контента под layout кабинета (узкая колонка как у ленты) */
  pageShell: 'mx-auto w-full max-w-5xl space-y-4 px-4 py-6 pb-24 sm:px-6',
  /**
   * Внутри `CabinetHubMain` — без второго max-width и px у края (отступы даёт только хаб).
   * Используйте для `/client/me`, `/brand`, shop и т.п. внутри кабинетного layout.
   */
  pageShellCabinet: 'w-full max-w-none space-y-4 px-0 py-4 pb-20',
  /** Шапка страницы: заголовок + нижняя граница */
  headerRow:
    'flex flex-col gap-3 border-b border-border-subtle pb-4 sm:flex-row sm:items-start sm:justify-between',
  /** H1 реестра */
  pageTitle: 'text-base font-black font-headline uppercase tracking-tighter text-text-primary',
  /** Подзаголовок-«цитата» с акцентом слева */
  pageLead:
    'mt-1 max-w-3xl border-l-2 border-accent-primary pl-4 text-sm font-medium italic text-muted-foreground',
  /** Обычное описание под H1 (без кавычек) — карточки модулей, формы */
  pageSubtitle: 'mt-1.5 max-w-3xl text-sm font-medium leading-relaxed text-text-secondary',
  /**
   * Заголовок экрана-инструмента B2B (не `<h1>` — раздел задаёт `CabinetHubSectionBar` в layout).
   * См. `ShopB2bToolHeader` / `ShopB2bToolTitle`.
   */
  shopB2bToolTitle: 'text-base font-black uppercase tracking-tighter text-text-primary',
  shopB2bToolTitleSm: 'text-sm font-black uppercase tracking-tighter text-text-primary',
  shopB2bToolTitleSemibold: 'text-sm font-semibold tracking-tight text-text-primary',
  shopB2bToolTitleHeadline: 'text-base font-bold font-headline text-text-primary',
  /** Вторая строка под заголовком инструмента (eyebrow / мета) */
  shopB2bToolMeta: 'mt-1 text-xs font-bold uppercase tracking-widest text-muted-foreground',
  /** Верх страницы модуля кабинета: разделитель с основным контентом */
  cabinetModuleHeader: 'border-b border-border-subtle pb-5',
  /** Иконка слева от H1 в шапке модуля */
  cabinetTitleIcon: 'size-5 shrink-0 text-accent-primary',
  /** Нижняя панель быстрых ссылок (Hub, матрица) */
  cabinetQuickLinksRow: 'flex flex-wrap gap-2 border-t border-border-subtle pt-5',
  /** Карточка-панель с данными */
  panelCard: 'rounded-xl border border-border-subtle bg-card shadow-xl shadow-black/[0.06]',
  /** Альтернатива: мягче тень (второстепенные блоки) */
  panelCardSoft: 'rounded-xl border border-border-subtle bg-bg-surface shadow-sm',
  /** Заголовок внутри Card */
  cardTitle: 'text-sm font-black uppercase tracking-tight text-text-primary',
  cardDescription: 'text-xs font-medium text-text-muted',
  /** Ячейки шапки таблицы */
  tableHeadCell: 'text-[9px] font-black uppercase tracking-widest text-text-muted',
  /** Строка таблицы */
  tableRow: 'border-border-subtle transition-colors hover:bg-bg-surface2/80',
  /** Поле поиска в шапке таблицы */
  searchInput: 'h-9 pl-8 text-xs font-bold uppercase tracking-wider',
} as const;
