/**
 * Серверное хранилище operational-note для B2B v1 (файл JSON).
 * Используется PATCH `/api/b2b/v1/operational-orders/:id/operational-note` и GET detail.
 *
 * Запись по заказу: операционная заметка (видна в контракте ритейлер/операции) и опционально
 * **internal** — внутренняя заметка бренда (JOOR-паттерн), не для ритейлера в UI.
 */
import 'server-only';

import fs from 'fs';
import path from 'path';

/** Одна запись заметок по `wholesaleOrderId` (= `B2BOrder.order`). */
export type OperationalNoteEntryV1 = {
  note: string;
  updatedAt: string;
  internalNote?: string;
  internalUpdatedAt?: string;
};

export type B2BOperationalNotesFileV1 = {
  schemaVersion: 1;
  notes: Record<string, OperationalNoteEntryV1>;
  /** Успешные PATCH: ключ = Idempotency-Key */
  idempotency: Record<
    string,
    {
      wholesaleOrderId: string;
      note: string;
      updatedAt: string;
      internalNote?: string;
      internalUpdatedAt?: string;
    }
  >;
};

const EMPTY: B2BOperationalNotesFileV1 = {
  schemaVersion: 1,
  notes: {},
  idempotency: {},
};

export function getB2BOperationalNotesFilePath(): string {
  const fromEnv = process.env.B2B_OPERATIONAL_NOTES_FILE?.trim();
  if (fromEnv) return fromEnv;
  return path.join(process.cwd(), 'data', 'b2b-operational-notes.json');
}

function load(): B2BOperationalNotesFileV1 {
  try {
    const p = getB2BOperationalNotesFilePath();
    const raw = fs.readFileSync(p, 'utf8');
    const j = JSON.parse(raw) as B2BOperationalNotesFileV1;
    if (
      j?.schemaVersion !== 1 ||
      typeof j.notes !== 'object' ||
      j.notes === null ||
      typeof j.idempotency !== 'object' ||
      j.idempotency === null
    ) {
      return { ...EMPTY };
    }
    return j;
  } catch {
    return { ...EMPTY };
  }
}

function save(data: B2BOperationalNotesFileV1): void {
  const p = getB2BOperationalNotesFilePath();
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

/** Полная запись заметок по заказу (операционная + внутренняя). */
export function getOperationalNotesRecord(orderId: string): OperationalNoteEntryV1 | undefined {
  return load().notes[orderId];
}

/** @deprecated Используйте {@link getOperationalNotesRecord} */
export function getOperationalNoteRecord(
  orderId: string
): { note: string; updatedAt: string } | undefined {
  const r = getOperationalNotesRecord(orderId);
  return r ? { note: r.note, updatedAt: r.updatedAt } : undefined;
}

export type MergeOperationalNotesResult =
  | {
      ok: true;
      wholesaleOrderId: string;
      note: string;
      updatedAt: string;
      internalNote?: string;
      internalUpdatedAt?: string;
      idempotentReplay: boolean;
    }
  | { ok: false; code: 'IDEMPOTENCY_CONFLICT' | 'BAD_REQUEST'; message: string };

/**
 * Частичное обновление: передайте `note` и/или `internalNote`.
 * Хотя бы одно поле должно быть задано.
 */
export function mergeOperationalNotesPersisted(params: {
  wholesaleOrderId: string;
  idempotencyKey: string;
  note?: string;
  internalNote?: string;
}): MergeOperationalNotesResult {
  if (params.note === undefined && params.internalNote === undefined) {
    return {
      ok: false,
      code: 'BAD_REQUEST',
      message: 'Provide at least one of "note", "internalNote"',
    };
  }

  const data = load();
  const prev = data.idempotency[params.idempotencyKey];
  if (prev) {
    if (prev.wholesaleOrderId !== params.wholesaleOrderId) {
      return {
        ok: false,
        code: 'IDEMPOTENCY_CONFLICT',
        message: 'Idempotency-Key already used for a different order',
      };
    }
    return {
      ok: true,
      wholesaleOrderId: prev.wholesaleOrderId,
      note: prev.note,
      updatedAt: prev.updatedAt,
      internalNote: prev.internalNote,
      internalUpdatedAt: prev.internalUpdatedAt,
      idempotentReplay: true,
    };
  }

  const existing = data.notes[params.wholesaleOrderId];
  const now = new Date().toISOString();
  const next: OperationalNoteEntryV1 = existing
    ? { ...existing }
    : { note: '', updatedAt: now };

  if (params.note !== undefined) {
    next.note = params.note;
    next.updatedAt = now;
  }
  if (params.internalNote !== undefined) {
    next.internalNote = params.internalNote;
    next.internalUpdatedAt = now;
  }

  data.notes[params.wholesaleOrderId] = next;

  const snapshot = {
    wholesaleOrderId: params.wholesaleOrderId,
    note: next.note,
    updatedAt: next.updatedAt,
    internalNote: next.internalNote,
    internalUpdatedAt: next.internalUpdatedAt,
  };
  data.idempotency[params.idempotencyKey] = snapshot;
  save(data);

  return { ok: true, ...snapshot, idempotentReplay: false };
}

export type PatchOperationalNoteResult =
  | {
      ok: true;
      wholesaleOrderId: string;
      note: string;
      updatedAt: string;
      idempotentReplay: boolean;
    }
  | { ok: false; code: 'IDEMPOTENCY_CONFLICT'; message: string };

/** Совместимость: обновление только операционной заметки (как раньше). */
export function patchOperationalNotePersisted(params: {
  wholesaleOrderId: string;
  note: string;
  idempotencyKey: string;
}): PatchOperationalNoteResult {
  const r = mergeOperationalNotesPersisted({
    wholesaleOrderId: params.wholesaleOrderId,
    idempotencyKey: params.idempotencyKey,
    note: params.note,
  });
  if (!r.ok) {
    return { ok: false, code: 'IDEMPOTENCY_CONFLICT', message: r.message };
  }
  return {
    ok: true,
    wholesaleOrderId: r.wholesaleOrderId,
    note: r.note,
    updatedAt: r.updatedAt,
    idempotentReplay: r.idempotentReplay,
  };
}
