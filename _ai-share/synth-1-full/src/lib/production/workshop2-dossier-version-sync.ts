'use client';

/** Общий счётчик версии досье на сервере (workspace ↔ persist). */
let serverDossierVersion: number | null = null;

let onVersionConflict: ((currentVersion: number) => void) | null = null;
let onVersionConflictModal: ((currentVersion: number) => void) | null = null;
/** Не открывать модалку 409 повторно для той же версии (debounced PUT). */
let lastModalConflictVersion: number | null = null;
let lastModalConflictAtMs = 0;

export function setWorkshop2ServerDossierVersion(version: number | null): void {
  serverDossierVersion = version;
}

export function getWorkshop2ServerDossierVersion(): number | null {
  return serverDossierVersion;
}

export function setWorkshop2OnVersionConflict(
  handler: ((currentVersion: number) => void) | null
): void {
  onVersionConflict = handler;
}

export function setWorkshop2OnVersionConflictModal(
  handler: ((currentVersion: number) => void) | null
): void {
  onVersionConflictModal = handler;
}

export function notifyWorkshop2VersionConflict(currentVersion: number): void {
  setWorkshop2ServerDossierVersion(currentVersion);
  const now = Date.now();
  const duplicateModal =
    lastModalConflictVersion === currentVersion && now - lastModalConflictAtMs < 2500;
  if (!duplicateModal) {
    lastModalConflictVersion = currentVersion;
    lastModalConflictAtMs = now;
    onVersionConflictModal?.(currentVersion);
  }
  onVersionConflict?.(currentVersion);
}

export function resetWorkshop2VersionConflictModalGuard(): void {
  lastModalConflictVersion = null;
  lastModalConflictAtMs = 0;
}
