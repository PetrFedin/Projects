/**
 * Свёрнутость панелей «Этапы и зависимости» в sessionStorage (на сессию браузера), по ключу коллекции flow.
 */

const PREFIX = 'synth.stagesPanels.v1.';

export type StagesPanelsSessionState = {
  depsPinned: boolean;
  depsOpen: boolean;
  slicePinned: boolean;
  sliceOpen: boolean;
  boardPinned: boolean;
  boardOpen: boolean;
  matrixPinned: boolean;
  matrixOpen: boolean;
  skuPanelPinned: boolean;
  skuPanelOpen: boolean;
  /** Панель «Профиль контура»: по умолчанию свёрнута (демо / меньше шума). */
  profilePanelOpen: boolean;
};

function storageKey(collectionFlowKey: string): string {
  return `${PREFIX}${collectionFlowKey?.trim() || 'default'}`;
}

export function loadStagesPanelsSession(collectionFlowKey: string): Partial<StagesPanelsSessionState> | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(storageKey(collectionFlowKey));
    if (!raw) return null;
    const p = JSON.parse(raw) as Partial<StagesPanelsSessionState>;
    return typeof p === 'object' && p !== null ? p : null;
  } catch {
    return null;
  }
}

export function saveStagesPanelsSession(collectionFlowKey: string, state: StagesPanelsSessionState): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(storageKey(collectionFlowKey), JSON.stringify(state));
  } catch {
    /* quota / private mode */
  }
}

const SUB_PREFIX = 'synth.stagesLastSubTab.v1.';

export type StagesInnerSubTab = 'ops' | 'process' | 'sku';

function subStorageKey(collectionFlowKey: string): string {
  return `${SUB_PREFIX}${collectionFlowKey?.trim() || 'default'}`;
}

export function saveStagesLastInnerSubTab(collectionFlowKey: string, sub: StagesInnerSubTab): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(subStorageKey(collectionFlowKey), sub);
  } catch {
    /* ignore */
  }
}

export function loadStagesLastInnerSubTab(collectionFlowKey: string): StagesInnerSubTab | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(subStorageKey(collectionFlowKey))?.trim();
    if (raw === 'process' || raw === 'sku' || raw === 'ops') return raw;
    return null;
  } catch {
    return null;
  }
}
