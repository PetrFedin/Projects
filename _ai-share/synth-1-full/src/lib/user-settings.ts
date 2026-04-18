export type Visibility = 'public' | 'private' | 'link';
export type NotificationFrequency = 'instant' | 'daily' | 'weekly' | 'off';
export type ThemePreference = 'system' | 'light' | 'dark';
export type DensityPreference = 'comfortable' | 'compact';

export type DashboardStatId = 'cart' | 'wishlist' | 'lookboards' | 'points';
export type DashboardSideWidgetId = 'loyalty' | 'quickActions';
export type TwoFactorMethod = 'app' | 'sms' | 'email';
export type SessionTimeout = '15m' | '30m' | '60m' | 'never';

export interface UserSettings {
  privacy: {
    profileVisibility: Visibility;
    lookboardsVisibility: Visibility;
    favoritesVisibility: Visibility;
    hideBalance: boolean;
    hideStats: boolean;
    hideActivity: boolean;
  };
  notifications: {
    orders: boolean;
    preorders: boolean;
    discounts: boolean;
    prices: boolean;
    messages: boolean;
    recommendations: boolean;
    frequency: NotificationFrequency;
  };
  dashboard: {
    widgets: {
      tips: boolean;
      quickStats: boolean;
      purchaseStats: boolean;
      activityTracker: boolean;
      aiDashboard: boolean;
      rightRail: boolean; // container for right-side widgets
    };
    showTips: boolean;
    statsEnabled: Record<DashboardStatId, boolean>;
    statsOrder: DashboardStatId[];
    aiDashboardEnabled: boolean; // kept for backward compatibility (mapped from widgets.aiDashboard)
    sideWidgetsEnabled: Record<DashboardSideWidgetId, boolean>;
    sideWidgetsOrder: DashboardSideWidgetId[];
  };
  ui: {
    theme: ThemePreference;
    density: DensityPreference;
    locale: string; // e.g. 'ru-RU'
    currency: string; // e.g. 'RUB'
  };
  security: {
    twoFactorEnabled: boolean;
    twoFactorMethod: TwoFactorMethod;
    loginAlerts: boolean;
    newDeviceAlerts: boolean;
    rememberDevice: boolean;
    sessionTimeout: SessionTimeout;
  };
  consents: {
    marketing: boolean;
    recommendations: boolean;
    personalization: boolean;
    dataStorage: boolean;
  };
}

const STORAGE_KEY = 'syntha_user_settings_v1';
export const USER_SETTINGS_UPDATED_EVENT = 'syntha_user_settings_updated';

export const DEFAULT_USER_SETTINGS: UserSettings = {
  privacy: {
    profileVisibility: 'public',
    lookboardsVisibility: 'public',
    favoritesVisibility: 'private',
    hideBalance: false,
    hideStats: false,
    hideActivity: false,
  },
  notifications: {
    orders: true,
    preorders: true,
    discounts: true,
    prices: true,
    messages: true,
    recommendations: true,
    frequency: 'instant',
  },
  dashboard: {
    widgets: {
      tips: true,
      quickStats: true,
      purchaseStats: true,
      activityTracker: true,
      aiDashboard: true,
      rightRail: true,
    },
    showTips: true,
    statsEnabled: { cart: true, wishlist: true, lookboards: true, points: true },
    statsOrder: ['cart', 'wishlist', 'lookboards', 'points'],
    aiDashboardEnabled: true,
    sideWidgetsEnabled: { loyalty: true, quickActions: true },
    sideWidgetsOrder: ['loyalty', 'quickActions'],
  },
  ui: {
    theme: 'system',
    density: 'comfortable',
    locale: 'ru-RU',
    currency: 'RUB',
  },
  security: {
    twoFactorEnabled: false,
    twoFactorMethod: 'app',
    loginAlerts: true,
    newDeviceAlerts: true,
    rememberDevice: true,
    sessionTimeout: '30m',
  },
  consents: {
    marketing: true,
    recommendations: true,
    personalization: true,
    dataStorage: true,
  },
};

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

function mergeSettings(base: UserSettings, patch: Partial<UserSettings>): UserSettings {
  // Shallow merge at top-level + nested sections to stay resilient to older schemas.
  const merged: UserSettings = {
    ...base,
    ...patch,
    privacy: { ...base.privacy, ...(patch.privacy ?? {}) },
    notifications: { ...base.notifications, ...(patch.notifications ?? {}) },
    dashboard: { ...base.dashboard, ...(patch.dashboard ?? {}) },
    ui: { ...base.ui, ...(patch.ui ?? {}) },
    security: { ...base.security, ...(patch.security ?? {}) },
    consents: { ...base.consents, ...(patch.consents ?? {}) },
  };

  // Backward compatibility: if old schema used aiDashboardEnabled, map to widgets.aiDashboard
  const patchDashboard = patch.dashboard as any;
  if (patchDashboard && typeof patchDashboard.aiDashboardEnabled === 'boolean') {
    merged.dashboard.widgets = {
      ...merged.dashboard.widgets,
      aiDashboard: patchDashboard.aiDashboardEnabled,
    };
  }

  // Ensure widgets object exists even for older localStorage payloads
  merged.dashboard.widgets = { ...base.dashboard.widgets, ...(merged.dashboard.widgets ?? {}) };

  return merged;
}

export function readUserSettings(): UserSettings {
  if (typeof window === 'undefined') return DEFAULT_USER_SETTINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_USER_SETTINGS;
    const parsed = JSON.parse(raw) as unknown;
    if (!isRecord(parsed)) return DEFAULT_USER_SETTINGS;
    return mergeSettings(DEFAULT_USER_SETTINGS, parsed as Partial<UserSettings>);
  } catch {
    return DEFAULT_USER_SETTINGS;
  }
}

export function writeUserSettings(next: UserSettings) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event(USER_SETTINGS_UPDATED_EVENT));
}

export function patchUserSettings(patch: Partial<UserSettings>) {
  const current = readUserSettings();
  const next = mergeSettings(current, patch);
  writeUserSettings(next);
}

export function applyUiPreferences(settings: UserSettings) {
  if (typeof window === 'undefined') return;
  const root = document.documentElement;
  const pref = settings.ui.theme;
  const systemDark =
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-color-scheme: dark)').matches;
  const shouldDark = pref === 'dark' || (pref === 'system' && systemDark);
  root.classList.toggle('dark', shouldDark);
  root.dataset.density = settings.ui.density;
  root.dataset.locale = settings.ui.locale;
  root.dataset.currency = settings.ui.currency;
}
