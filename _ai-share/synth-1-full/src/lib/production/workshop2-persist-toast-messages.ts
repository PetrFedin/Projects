/**
 * Wave I — user-visible toast titles без «→ PG»; технические mirror names — только в description/title attr.
 * Wave N — file_persist: честный title без «PostgreSQL».
 */
import { isWorkshop2FilePersistStoreMode } from '@/lib/production/workshop2-dossier-store-mode';

export function formatWorkshop2PersistToastTitle(input: {
  /** Человекочитаемая область: «Снабжение», «Примерка», «План» … */
  scopeLabelRu: string;
  ok: boolean;
  /** Inventory mirror и др. fail-closed без silent LS. */
  failClosed?: boolean;
  /** PUT ok, но storeMode=server_file_persist (PG off). */
  filePersistOnly?: boolean;
}): string {
  if (input.ok) {
    if (input.filePersistOnly) {
      return input.scopeLabelRu === 'Досье'
        ? 'Файловый сервер (PG off)'
        : `${input.scopeLabelRu}: файловый сервер`;
    }
    return input.scopeLabelRu === 'Досье' ? 'Сохранено в досье' : `${input.scopeLabelRu} сохранено`;
  }
  if (input.failClosed) return 'PG недоступен';
  return 'Только локально';
}

/** Description может содержать mirror field name для логов/отладки. */
export function formatWorkshop2PersistToastDescription(input: {
  mirrorField: string;
  ok: boolean;
  reason?: string;
  okHintRu?: string;
  filePersistOnly?: boolean;
  messageRu?: string;
}): string {
  if (input.ok) {
    if (input.filePersistOnly) {
      return (
        input.messageRu ?? 'PostgreSQL недоступен — запись на файловом сервере (не PG primary).'
      );
    }
    return input.okHintRu ?? `${input.mirrorField} записан в досье.`;
  }
  return `Сервер: ${input.reason ?? 'offline'} · ${input.mirrorField}`;
}

/** Wave J — единый toast для mirror persist (title без «→ PG»). */
export function showWorkshop2PersistToast(
  toast: (input: {
    title: string;
    description?: string;
    variant?: 'default' | 'destructive';
  }) => void,
  input: {
    scopeLabelRu: string;
    ok: boolean;
    mirrorField: string;
    reason?: string;
    failClosed?: boolean;
    okHintRu?: string;
    filePersistOnly?: boolean;
    messageRu?: string;
  }
): void {
  toast({
    title: formatWorkshop2PersistToastTitle({
      scopeLabelRu: input.scopeLabelRu,
      ok: input.ok,
      failClosed: input.failClosed,
      filePersistOnly: input.filePersistOnly,
    }),
    description: formatWorkshop2PersistToastDescription({
      mirrorField: input.mirrorField,
      ok: input.ok,
      reason: input.reason,
      okHintRu: input.okHintRu,
      filePersistOnly: input.filePersistOnly,
      messageRu: input.messageRu,
    }),
    variant: input.ok ? 'default' : 'destructive',
  });
}
