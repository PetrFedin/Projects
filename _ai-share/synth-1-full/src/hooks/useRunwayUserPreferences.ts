'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  RUNWAY_USER_PREFS_STORAGE_KEY,
  RUNWAY_SCROLL_SENSITIVITY_DEFAULT,
  RUNWAY_SCROLL_SENSITIVITY_MAX,
  RUNWAY_SCROLL_SENSITIVITY_MIN,
} from '@/lib/scroll-switcher-constants';

export interface RunwayUserPreferences {
  /** Принудительный reduced motion (override системной настройки). */
  reducedMotionOverride: boolean | null;
  /** Множитель чувствительности скролла 0.5–2. */
  scrollSensitivity: number;
  /** Показывать ambient-видео (opacity > 0). */
  ambientVideoEnabled: boolean;
  /** Показывать storytelling секции. */
  showStories: boolean;
  /** Показывать блок «Дополните образ». */
  showCompleteLook: boolean;
}

const DEFAULT_PREFS: RunwayUserPreferences = {
  reducedMotionOverride: null,
  scrollSensitivity: RUNWAY_SCROLL_SENSITIVITY_DEFAULT,
  ambientVideoEnabled: true,
  showStories: true,
  showCompleteLook: true,
};

function clampSensitivity(value: number): number {
  return Math.min(RUNWAY_SCROLL_SENSITIVITY_MAX, Math.max(RUNWAY_SCROLL_SENSITIVITY_MIN, value));
}

function readPrefs(): RunwayUserPreferences {
  if (typeof localStorage === 'undefined') return DEFAULT_PREFS;
  try {
    const raw = localStorage.getItem(RUNWAY_USER_PREFS_STORAGE_KEY);
    if (!raw) return DEFAULT_PREFS;
    const parsed = JSON.parse(raw) as Partial<RunwayUserPreferences>;
    return {
      reducedMotionOverride:
        parsed.reducedMotionOverride === true || parsed.reducedMotionOverride === false
          ? parsed.reducedMotionOverride
          : null,
      scrollSensitivity: clampSensitivity(
        parsed.scrollSensitivity ?? RUNWAY_SCROLL_SENSITIVITY_DEFAULT
      ),
      ambientVideoEnabled: parsed.ambientVideoEnabled ?? true,
      showStories: parsed.showStories ?? true,
      showCompleteLook: parsed.showCompleteLook ?? true,
    };
  } catch {
    return DEFAULT_PREFS;
  }
}

function writePrefs(prefs: RunwayUserPreferences): void {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(RUNWAY_USER_PREFS_STORAGE_KEY, JSON.stringify(prefs));
  } catch {
    /* quota */
  }
}

/** Пользовательские настройки runway (localStorage, opt-in panel). */
export function useRunwayUserPreferences() {
  const [prefs, setPrefs] = useState<RunwayUserPreferences>(DEFAULT_PREFS);

  useEffect(() => {
    setPrefs(readPrefs());
  }, []);

  const update = useCallback((patch: Partial<RunwayUserPreferences>) => {
    setPrefs((prev) => {
      const next: RunwayUserPreferences = {
        ...prev,
        ...patch,
        scrollSensitivity:
          patch.scrollSensitivity != null
            ? clampSensitivity(patch.scrollSensitivity)
            : prev.scrollSensitivity,
      };
      writePrefs(next);
      return next;
    });
  }, []);

  return { prefs, update, reset: () => update(DEFAULT_PREFS) };
}
