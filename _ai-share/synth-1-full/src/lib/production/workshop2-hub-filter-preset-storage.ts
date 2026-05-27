/**
 * Сохранение пресета фильтров хаба между hub → workspace (sessionStorage).
 */
import type {
  Workshop2HubFilterAdvanced,
  Workshop2HubFilterState,
} from '@/lib/production/workshop2-hub-filter';

export const WORKSHOP2_HUB_FILTER_PRESET_STORAGE_KEY = 'synth.w2.hubFilterPreset.v1' as const;

export type Workshop2HubFilterPresetSnapshot = {
  savedAt: string;
  search: string;
  tagFilter: string[];
  articleFilter: string;
  catL1: string;
  catL2: string;
  catL3: string;
  advanced?: Workshop2HubFilterAdvanced;
};

export function buildWorkshop2HubFilterPresetSnapshot(input: {
  state: Workshop2HubFilterState;
  advanced?: Workshop2HubFilterAdvanced;
}): Workshop2HubFilterPresetSnapshot {
  return {
    savedAt: new Date().toISOString(),
    search: input.state.search,
    tagFilter: [...input.state.tagFilter],
    articleFilter: input.state.articleFilter,
    catL1: input.state.catL1,
    catL2: input.state.catL2,
    catL3: input.state.catL3,
    advanced: input.advanced,
  };
}

export function writeWorkshop2HubFilterPresetToSession(
  snapshot: Workshop2HubFilterPresetSnapshot
): void {
  if (typeof window === 'undefined') return;
  try {
    window.sessionStorage.setItem(
      WORKSHOP2_HUB_FILTER_PRESET_STORAGE_KEY,
      JSON.stringify(snapshot)
    );
  } catch {
    /* ignore quota */
  }
}

export function readWorkshop2HubFilterPresetFromSession(): Workshop2HubFilterPresetSnapshot | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.sessionStorage.getItem(WORKSHOP2_HUB_FILTER_PRESET_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Workshop2HubFilterPresetSnapshot;
    if (!parsed?.savedAt) return null;
    return parsed;
  } catch {
    return null;
  }
}
