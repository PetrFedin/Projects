/** Константы runway scroll-switcher — единая точка для magic numbers. */

/** Дефолтные цвета секций runway (fallback без видео). */
export const DEFAULT_SCROLL_SWITCHER_COLORS = ['#C4A882', '#C0C0C0', '#D4C876'] as const;

export const DEFAULT_SCROLL_SWITCHER_LABELS = ['Sand', 'Silver', 'Gold'] as const;

/** Минимальная доля видимости контейнера для активации wheel-scroll. */
export const RUNWAY_VIEWPORT_INTERSECTION_RATIO = 0.35;

/** Пороги IntersectionObserver для runway. */
export const RUNWAY_VIEWPORT_THRESHOLDS = [0, 0.35, 0.6] as const;

/** Debounce записи section в URL (мс). */
export const RUNWAY_URL_SYNC_DEBOUNCE_MS = 280;

/** Debounce повторного add-to-cart (мс). */
export const RUNWAY_ADD_TO_CART_DEBOUNCE_MS = 900;

/** Debounce seek видео при rapid scroll (мс). */
export const RUNWAY_VIDEO_SEEK_DEBOUNCE_MS = 48;

/** Минимальная delta currentTime для seek (сек). */
export const RUNWAY_VIDEO_SEEK_THRESHOLD_SEC = 0.05;

/** Lerp-сглаживание прогресса scroll. */
export const RUNWAY_SCROLL_LERP = 0.15;

/** Spring-фактор для опционального lerp (0 = выкл, ~0.08 = мягкая пружина). */
export const RUNWAY_SCROLL_SPRING = 0.08;

/** Демпфирование скорости колеса (0–1, выше = плавнее). */
export const RUNWAY_SCROLL_VELOCITY_DAMPING = 0.82;

/** Макс. доп. delta от инерции колеса за кадр. */
export const RUNWAY_SCROLL_VELOCITY_MAX = 0.012;

/** Idle после колеса перед snap к середине секции (мс). */
export const RUNWAY_SCROLL_SNAP_IDLE_MS = 200;

/** Длительность investor auto-tour (мс). */
export const RUNWAY_AUTO_TOUR_DURATION_MS = 8000;

/** Кинематографический fade-in runway (мс). */
export const RUNWAY_CINEMATIC_INTRO_MS = 500;

export const RUNWAY_CINEMATIC_INTRO_STORAGE_KEY = 'runway-cinematic-intro-seen';

/** Виртуальная длительность без видео (сек). */
export const RUNWAY_BASE_VIRTUAL_DURATION_SEC = 12;

/** Длительность pulse-анимации при смене секции (мс). */
export const RUNWAY_SECTION_PULSE_MS = 420;

/** Компактная высота switcher (px). */
export const RUNWAY_COMPACT_MIN_HEIGHT_PX = 420;

/** Максимальная высота switcher на PDP (px). */
export const RUNWAY_PDP_MAX_HEIGHT_PX = 900;

/** Ссылка на документацию для бренд-админки. */
export const RUNWAY_DOCS_PATH = '/docs/product-scroll-switcher.md';

/** sessionStorage: последняя секция runway по slug товара. */
export const RUNWAY_SECTION_SESSION_PREFIX = 'runway-section:';

/** localStorage: onboarding «прокрутите колёсико» уже закрыт. */
export const RUNWAY_ONBOARDING_STORAGE_KEY = 'runway-onboarding-dismissed';

/** Demo-лента «Product Scroll Switcher» — dismiss в localStorage. */
export const RUNWAY_DEMO_RIBBON_STORAGE_KEY = 'runway-demo-ribbon-dismissed';

/** Подсказка Standard vs Runway — отдельный ключ от wheel-hint. */
export const RUNWAY_COMPARE_HINT_STORAGE_KEY = 'runway-compare-hint-dismissed';

/** localStorage: пользовательские настройки runway (options panel). */
export const RUNWAY_USER_PREFS_STORAGE_KEY = 'runway-user-preferences';

/** localStorage: избранная секция per product slug. */
export const RUNWAY_SECTION_FAVORITES_STORAGE_KEY = 'runway-section-favorites';

/** Per-user ключ избранных секций (auth sync). */
export function runwaySectionFavoritesKeyForUser(userId: string): string {
  return `${RUNWAY_SECTION_FAVORITES_STORAGE_KEY}:${userId}`;
}

/** Дефолт / min / max множителя чувствительности скролла. */
export const RUNWAY_SCROLL_SENSITIVITY_DEFAULT = 1;
export const RUNWAY_SCROLL_SENSITIVITY_MIN = 0.5;
export const RUNWAY_SCROLL_SENSITIVITY_MAX = 2;

/** Авто-dismiss upsell strip после add-to-cart (мс). */
export const RUNWAY_CART_UPSELL_DISMISS_MS = 5000;

/** Авто-скрытие onboarding hint (compare + wheel) без блокировки thumbs. */
export const RUNWAY_ONBOARDING_AUTO_DISMISS_MS = 8000;

/** Порог виртуализации look items. */
export const RUNWAY_LOOK_VIRTUALIZE_THRESHOLD = 5;

/** Ширина одного look item для virtual scroll (px). */
export const RUNWAY_LOOK_ITEM_WIDTH_PX = 148;

/** Guided tour — первый визит runway. */
export const RUNWAY_GUIDED_TOUR_STORAGE_KEY = 'runway-guided-tour-done';

/** Kiosk auto-tour: интервал смены секции (мс). */
export const RUNWAY_KIOSK_TOUR_INTERVAL_MS = 12000;

/** Минимальный touch target для mobile runway (px). */
export const RUNWAY_MOBILE_TOUCH_MIN_PX = 44;
