/**
 * Политика merge досье с сервера (SSE/polling) — не затирать локальное редактирование (wave 18 #20).
 */

export type Workshop2RemoteDossierMergeDecision = {
  apply: boolean;
  reason?: 'form_focused' | 'local_dirty' | 'stale_remote' | 'ok';
};

export function shouldApplyWorkshop2RemoteDossierUpdate(input: {
  localVersion: number | null;
  remoteVersion: number;
  formFocused: boolean;
  hasLocalDirty?: boolean;
}): Workshop2RemoteDossierMergeDecision {
  if (input.formFocused) {
    return { apply: false, reason: 'form_focused' };
  }
  if (input.hasLocalDirty) {
    return { apply: false, reason: 'local_dirty' };
  }
  if (input.localVersion != null && input.remoteVersion <= input.localVersion) {
    return { apply: false, reason: 'stale_remote' };
  }
  return { apply: true, reason: 'ok' };
}
