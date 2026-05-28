import { getOrCreateGlobalRuntime } from '@/lib/server/global-runtime-singleton';

const RUNTIME_KEY = Symbol.for('syntha.order.v1.operational-annotations');

const MAX_AUDIT = 80;

type AnnotationRecord = { note: string; updatedAt: string };
type IdempotencyRecord = { response: AnnotationRecord; httpStatus: number };

/** Запись аудита мутации (демо in-memory; не ledger). */
export type OperationalOrderNoteAuditEntry = {
  ts: string;
  orderId: string;
  idempotencyKey: string;
  replayed: boolean;
  /** Длина текста; полный текст не дублируем в логах по умолчанию. */
  noteChars: number;
};

type Store = {
  byOrderId: Map<string, AnnotationRecord>;
  byIdempotencyKey: Map<string, IdempotencyRecord>;
  audit: OperationalOrderNoteAuditEntry[];
};

function createStore(): Store {
  return {
    byOrderId: new Map(),
    byIdempotencyKey: new Map(),
    audit: [],
  };
}

export function getOrderOperationalAnnotationsStore(): Store {
  return getOrCreateGlobalRuntime(RUNTIME_KEY, createStore);
}

function appendAudit(store: Store, entry: OperationalOrderNoteAuditEntry): void {
  store.audit.push(entry);
  if (store.audit.length > MAX_AUDIT) {
    store.audit.splice(0, store.audit.length - MAX_AUDIT);
  }
}

export function getOperationalOrderNoteAuditLog(): readonly OperationalOrderNoteAuditEntry[] {
  return getOrderOperationalAnnotationsStore().audit;
}

/**
 * Идемпотентный PATCH: один и тот же `Idempotency-Key` возвращает тот же ответ без повторной записи.
 */
export function upsertOperationalNoteWithIdempotency(params: {
  orderId: string;
  note: string;
  idempotencyKey: string;
}): { record: AnnotationRecord; status: number; replayed: boolean } {
  const store = getOrderOperationalAnnotationsStore();
  const existing = store.byIdempotencyKey.get(params.idempotencyKey);
  if (existing) {
    appendAudit(store, {
      ts: new Date().toISOString(),
      orderId: params.orderId,
      idempotencyKey: params.idempotencyKey,
      replayed: true,
      noteChars: params.note.length,
    });
    return { record: existing.response, status: existing.httpStatus, replayed: true };
  }
  const prev = store.byOrderId.get(params.orderId);
  const updatedAt = new Date().toISOString();
  const record: AnnotationRecord = { note: params.note, updatedAt };
  store.byOrderId.set(params.orderId, record);
  const status = prev ? 200 : 201;
  store.byIdempotencyKey.set(params.idempotencyKey, { response: record, httpStatus: status });
  appendAudit(store, {
    ts: updatedAt,
    orderId: params.orderId,
    idempotencyKey: params.idempotencyKey,
    replayed: false,
    noteChars: params.note.length,
  });
  return { record, status, replayed: false };
}

export function getOperationalNote(orderId: string): AnnotationRecord | null {
  return getOrderOperationalAnnotationsStore().byOrderId.get(orderId) ?? null;
}
