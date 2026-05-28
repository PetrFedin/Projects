/**
 * Wave N — честная семантика storeMode при PG down (file fallback ≠ PG primary).
 */

export type Workshop2DossierStoreMode = 'server_postgres' | 'server_file_persist';

export function isWorkshop2PgPrimaryStoreMode(
  storeMode?: string | null
): storeMode is 'server_postgres' {
  return storeMode === 'server_postgres';
}

export function isWorkshop2FilePersistStoreMode(
  storeMode?: string | null
): storeMode is 'server_file_persist' {
  return storeMode === 'server_file_persist';
}

export function workshop2DossierStoreModeMessageRu(storeMode?: string | null): string {
  if (isWorkshop2FilePersistStoreMode(storeMode)) {
    return 'PostgreSQL недоступен — досье на файловом сервере (не PG primary). Поднимите PG: bash scripts/workshop2-pg-bootstrap.sh';
  }
  if (isWorkshop2PgPrimaryStoreMode(storeMode)) {
    return 'Досье сохранено в PostgreSQL (enterprise backend).';
  }
  return 'Режим хранения досье не определён — проверьте /api/workshop2/health.';
}

export type Workshop2DossierSaveHonesty = {
  /** HTTP PUT прошёл (в т.ч. file fallback). */
  ok: boolean;
  pgPrimary: boolean;
  filePersistOnly: boolean;
  /** true = UI не должен показывать «сохранено в PG» без предупреждения. */
  silentSuccess: boolean;
  messageRu: string;
  toastTitleRu: string;
  toastDescriptionRu: string;
  failClosed: boolean;
};

/** Разбор ответа PUT досье → честный UX (Wave N #8). */
export function evaluateWorkshop2DossierSaveHonesty(input: {
  apiOk: boolean;
  storeMode?: string | null;
  reason?: string;
}): Workshop2DossierSaveHonesty {
  if (!input.apiOk) {
    const reason = input.reason ?? 'offline';
    return {
      ok: false,
      pgPrimary: false,
      filePersistOnly: false,
      silentSuccess: false,
      messageRu: `Сохранение не выполнено: ${reason}.`,
      toastTitleRu: 'Сохранение не записано',
      toastDescriptionRu:
        reason === 'network_or_server_error'
          ? 'PostgreSQL/API недоступен — настройте backend или повторите позже.'
          : `Сервер: ${reason}`,
      failClosed: true,
    };
  }

  if (isWorkshop2FilePersistStoreMode(input.storeMode)) {
    const msg = workshop2DossierStoreModeMessageRu(input.storeMode);
    return {
      ok: true,
      pgPrimary: false,
      filePersistOnly: true,
      silentSuccess: false,
      messageRu: msg,
      toastTitleRu: 'Файловый сервер (PG off)',
      toastDescriptionRu: msg,
      failClosed: false,
    };
  }

  const pgMsg = workshop2DossierStoreModeMessageRu('server_postgres');
  return {
    ok: true,
    pgPrimary: true,
    filePersistOnly: false,
    silentSuccess: false,
    messageRu: pgMsg,
    toastTitleRu: 'Сохранено на сервере',
    toastDescriptionRu: pgMsg,
    failClosed: false,
  };
}

/** Wave O — общие поля honesty для wave*persist-client после PUT API. */
export type Workshop2DossierApiPersistFields = {
  storeMode?: string;
  pgPrimary?: boolean;
  filePersistOnly?: boolean;
  messageRu?: string;
};

export function workshop2DossierHonestyFieldsFromApi(input: {
  ok: boolean;
  storeMode?: string;
  messageRu?: string;
  reason?: string;
}): Workshop2DossierApiPersistFields {
  const honesty = evaluateWorkshop2DossierSaveHonesty({
    apiOk: input.ok,
    storeMode: input.ok ? input.storeMode : undefined,
    reason: input.ok ? undefined : input.reason,
  });
  if (!input.ok) {
    return {
      pgPrimary: false,
      filePersistOnly: false,
      messageRu: honesty.messageRu,
    };
  }
  return {
    storeMode: input.storeMode,
    pgPrimary: honesty.pgPrimary,
    filePersistOnly: honesty.filePersistOnly,
    messageRu: input.messageRu ?? honesty.messageRu,
  };
}
