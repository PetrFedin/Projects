/**
 * Данные модулей этапов коллекции (не SKU): поля формы, вложения, аудит.
 * MVP: localStorage; тот же collectionKey, что у unified SKU flow.
 */

export const BRAND_COLLECTION_STAGE_MODULES_SAVED = 'brand-collection-stage-modules-saved';

export type CollectionStageAuditAction =
  | 'save'
  | 'field_change'
  | 'attachment_add'
  | 'attachment_remove'
  | 'review_request';

export type CollectionStageAuditEntry = {
  id: string;
  at: string;
  actorLabel: string;
  action: CollectionStageAuditAction;
  fieldKey?: string;
  oldValue?: string;
  newValue?: string;
  note?: string;
};

export type CollectionStageAttachment = {
  id: string;
  name: string;
  ref: string;
  addedAt: string;
  addedBy: string;
};

export type CollectionStageModuleData = {
  fields: Record<string, string>;
  attachments: CollectionStageAttachment[];
  history: CollectionStageAuditEntry[];
};

export type CollectionStageModulesDoc = {
  v: 1;
  steps: Record<string, CollectionStageModuleData>;
};

const PREFIX = 'brand_collection_stage_modules_v1__';
const MAX_HISTORY = 120;

function storageKey(collectionKey: string): string {
  return `${PREFIX}${collectionKey?.trim() || 'default'}`;
}

function newId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  return `id-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function emptyStep(): CollectionStageModuleData {
  return { fields: {}, attachments: [], history: [] };
}

export function loadCollectionStageModules(collectionKey: string): CollectionStageModulesDoc {
  if (typeof window === 'undefined') return { v: 1, steps: {} };
  try {
    const raw = window.localStorage.getItem(storageKey(collectionKey));
    if (!raw) return { v: 1, steps: {} };
    const p = JSON.parse(raw) as CollectionStageModulesDoc;
    if (!p || p.v !== 1 || typeof p.steps !== 'object') return { v: 1, steps: {} };
    return p;
  } catch {
    return { v: 1, steps: {} };
  }
}

export function saveCollectionStageModules(
  collectionKey: string,
  doc: CollectionStageModulesDoc
): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(storageKey(collectionKey), JSON.stringify(doc));
  window.dispatchEvent(
    new CustomEvent(BRAND_COLLECTION_STAGE_MODULES_SAVED, { detail: { collectionKey } })
  );
}

export function getStepModule(
  doc: CollectionStageModulesDoc,
  stepId: string
): CollectionStageModuleData {
  return doc.steps[stepId] ?? emptyStep();
}

function trimHistory(h: CollectionStageAuditEntry[]): CollectionStageAuditEntry[] {
  return h.slice(0, MAX_HISTORY);
}

/** Сохранить поля: дифф в историю + запись save */
export function patchStepModuleFields(
  doc: CollectionStageModulesDoc,
  stepId: string,
  nextFields: Record<string, string>,
  actorLabel: string
): CollectionStageModulesDoc {
  const prev = doc.steps[stepId] ?? emptyStep();
  const history = [...prev.history];
  const keys = new Set([...Object.keys(prev.fields), ...Object.keys(nextFields)]);
  for (const key of keys) {
    const oldV = prev.fields[key] ?? '';
    const newV = nextFields[key] ?? '';
    if (oldV === newV) continue;
    history.unshift({
      id: newId(),
      at: new Date().toISOString(),
      actorLabel,
      action: 'field_change',
      fieldKey: key,
      oldValue: oldV,
      newValue: newV,
    });
  }
  history.unshift({
    id: newId(),
    at: new Date().toISOString(),
    actorLabel,
    action: 'save',
    note: 'Черновик модуля этапа сохранён',
  });
  return {
    ...doc,
    steps: {
      ...doc.steps,
      [stepId]: {
        fields: { ...nextFields },
        attachments: prev.attachments,
        history: trimHistory(history),
      },
    },
  };
}

export function addStepModuleAttachment(
  doc: CollectionStageModulesDoc,
  stepId: string,
  att: Omit<CollectionStageAttachment, 'id' | 'addedAt'>,
  actorLabel: string
): CollectionStageModulesDoc {
  const prev = doc.steps[stepId] ?? emptyStep();
  const row: CollectionStageAttachment = {
    id: newId(),
    addedAt: new Date().toISOString(),
    ...att,
  };
  const history = [
    {
      id: newId(),
      at: row.addedAt,
      actorLabel,
      action: 'attachment_add' as const,
      note: `Вложение: ${row.name}`,
    },
    ...prev.history,
  ];
  return {
    ...doc,
    steps: {
      ...doc.steps,
      [stepId]: {
        ...prev,
        attachments: [...prev.attachments, row],
        history: trimHistory(history),
      },
    },
  };
}

/** Запись в журнал: запрошено согласование (после успешного API — дописать внешние ref в note). */
export function appendStepModuleReviewRequest(
  doc: CollectionStageModulesDoc,
  stepId: string,
  actorLabel: string,
  note: string
): CollectionStageModulesDoc {
  const prev = doc.steps[stepId] ?? emptyStep();
  const history = [
    {
      id: newId(),
      at: new Date().toISOString(),
      actorLabel,
      action: 'review_request' as const,
      note,
    },
    ...prev.history,
  ];
  return {
    ...doc,
    steps: {
      ...doc.steps,
      [stepId]: {
        ...prev,
        history: trimHistory(history),
      },
    },
  };
}

export function removeStepModuleAttachment(
  doc: CollectionStageModulesDoc,
  stepId: string,
  attachmentId: string,
  actorLabel: string
): CollectionStageModulesDoc {
  const prev = doc.steps[stepId] ?? emptyStep();
  const removed = prev.attachments.find((a) => a.id === attachmentId);
  const attachments = prev.attachments.filter((a) => a.id !== attachmentId);
  const history = [
    {
      id: newId(),
      at: new Date().toISOString(),
      actorLabel,
      action: 'attachment_remove' as const,
      note: removed ? `Удалено: ${removed.name}` : 'Вложение удалено',
    },
    ...prev.history,
  ];
  return {
    ...doc,
    steps: {
      ...doc.steps,
      [stepId]: {
        ...prev,
        attachments,
        history: trimHistory(history),
      },
    },
  };
}
