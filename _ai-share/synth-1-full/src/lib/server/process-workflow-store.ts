/**
 * Персистентность черновиков workflow LIVE (`/api/processes/*`).
 * Файл `.data/workflow-store.json` (gitignored): определения процессов и снимки runtime.
 * Для serverless без общего диска отключите: `WORKFLOW_STORE_DISABLED=1` (только встроенные схемы).
 */
import fs from 'fs';
import path from 'path';
import type { LiveProcessDefinition } from '@/lib/live-process/types';
import { getAllLiveProcessIds, getLiveProcessDefinition } from '@/lib/live-process/process-definitions';

const STORE_VERSION = 1 as const;

type RuntimeEntry = {
  payload: Record<string, unknown>;
  updatedAt: string;
};

export type WorkflowStoreFile = {
  version: typeof STORE_VERSION;
  definitions: Record<string, LiveProcessDefinition>;
  runtimes: Record<string, RuntimeEntry>;
};

function defaultStore(): WorkflowStoreFile {
  return { version: STORE_VERSION, definitions: {}, runtimes: {} };
}

export function getWorkflowStorePath(): string {
  return process.env.WORKFLOW_STORE_PATH ?? path.join(process.cwd(), '.data', 'workflow-store.json');
}

export function isWorkflowStoreDisabled(): boolean {
  const v = process.env.WORKFLOW_STORE_DISABLED;
  return v === '1' || v === 'true';
}

export function readWorkflowStore(): WorkflowStoreFile {
  if (isWorkflowStoreDisabled()) return defaultStore();
  const p = getWorkflowStorePath();
  try {
    const raw = fs.readFileSync(p, 'utf8');
    const parsed = JSON.parse(raw) as Partial<WorkflowStoreFile>;
    if (parsed?.version !== STORE_VERSION) return defaultStore();
    return {
      version: STORE_VERSION,
      definitions: parsed.definitions ?? {},
      runtimes: parsed.runtimes ?? {},
    };
  } catch {
    return defaultStore();
  }
}

export function writeWorkflowStore(store: WorkflowStoreFile): void {
  if (isWorkflowStoreDisabled()) return;
  const p = getWorkflowStorePath();
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, JSON.stringify(store, null, 2), 'utf8');
}

export function runtimeKey(processId: string, contextId: string): string {
  return `${processId}::${contextId}`;
}

export function upsertDefinition(def: LiveProcessDefinition): void {
  const store = readWorkflowStore();
  store.definitions[def.id] = def;
  writeWorkflowStore(store);
}

export function getStoredDefinition(processId: string): LiveProcessDefinition | undefined {
  return readWorkflowStore().definitions[processId];
}

export function listStoredOnlyProcessIds(): string[] {
  return Object.keys(readWorkflowStore().definitions);
}

export function upsertRuntime(
  processId: string,
  contextId: string,
  payload: Record<string, unknown>
): void {
  const store = readWorkflowStore();
  store.runtimes[runtimeKey(processId, contextId)] = {
    payload,
    updatedAt: new Date().toISOString(),
  };
  writeWorkflowStore(store);
}

export function getStoredRuntimePayload(
  processId: string,
  contextId: string
): Record<string, unknown> | null {
  const e = readWorkflowStore().runtimes[runtimeKey(processId, contextId)];
  return e?.payload ?? null;
}

export function workflowStoreMeta():
  | { persistence: 'disabled' }
  | { persistence: 'file'; path: string } {
  if (isWorkflowStoreDisabled()) return { persistence: 'disabled' };
  return { persistence: 'file', path: getWorkflowStorePath() };
}

/** Встроенные схемы + переопределения из файла + только кастомные id. */
export function mergeAllProcessDefinitionsForApi(): LiveProcessDefinition[] {
  const store = readWorkflowStore();
  const staticIds = getAllLiveProcessIds();
  const staticSet = new Set(staticIds);
  const out: LiveProcessDefinition[] = [];
  for (const id of staticIds) {
    const def = store.definitions[id] ?? getLiveProcessDefinition(id);
    if (def) out.push(def);
  }
  for (const id of Object.keys(store.definitions)) {
    if (!staticSet.has(id)) out.push(store.definitions[id]);
  }
  return out;
}
