/**
 * localStorage: read-on-miss cache онбординга хаба (Block C — не primary SoT).
 * Primary: hubOnboardingState / hubOnboardingMirror в PG досье.
 */

const STORAGE_KEY = 'synth.w2.hubOnboarding.v1';
const WORKSPACE_OPENED_KEY = 'synth.w2.hubOnboarding.workspaceOpened.v1';
const ROLE_KEY = 'synth.w2.hubOnboarding.role.v1';

export function isWorkshop2HubOnboardingDone(): boolean {
  if (typeof localStorage === 'undefined') return true;
  try {
    return localStorage.getItem(STORAGE_KEY) === 'done';
  } catch {
    return true;
  }
}

export function markWorkshop2HubOnboardingDone(): void {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, 'done');
  } catch {
    /* quota */
  }
}

export function isWorkshop2HubWorkspaceOpened(): boolean {
  if (typeof localStorage === 'undefined') return false;
  try {
    return localStorage.getItem(WORKSPACE_OPENED_KEY) === '1';
  } catch {
    return false;
  }
}

export function markWorkshop2HubWorkspaceOpened(): void {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(WORKSPACE_OPENED_KEY, '1');
  } catch {
    /* quota */
  }
}

export type StoredWorkshop2HubOnboardingRole = 'designer' | 'technologist' | 'manager';

export function loadWorkshop2HubOnboardingRole(): StoredWorkshop2HubOnboardingRole {
  if (typeof localStorage === 'undefined') return 'designer';
  try {
    const v = localStorage.getItem(ROLE_KEY);
    if (v === 'technologist' || v === 'manager' || v === 'designer') return v;
  } catch {
    /* ignore */
  }
  return 'designer';
}

export function saveWorkshop2HubOnboardingRole(role: StoredWorkshop2HubOnboardingRole): void {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(ROLE_KEY, role);
  } catch {
    /* quota */
  }
}

export function clearWorkshop2HubOnboardingForDev(): void {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(WORKSPACE_OPENED_KEY);
    localStorage.removeItem(ROLE_KEY);
  } catch {
    /* ignore */
  }
}
