/**
 * Персистентность черновиков workflow LIVE (`/api/processes/*`).
 * PG: `platform_core_live_workflow_store` при `WORKSHOP2_DATABASE_URL`.
 * Fallback: `.data/workflow-store.json` (single-instance).
 * Отключение записи: `WORKFLOW_STORE_DISABLED=1` (только встроенные схемы, без persist).
 */
import fs from 'fs';
import path from 'path';
import type { LiveProcessDefinition } from '@/lib/live-process/types';
import {
  getAllLiveProcessIds,
  getLiveProcessDefinition,
} from '@/lib/live-process/process-definitions';
import { isPlatformCoreSpinePgPrimary } from '@/lib/server/platform-core-spine-pg.server';
import { shouldWorkshop2PersistAuxiliaryJsonToFile } from '@/lib/server/platform-core-pg-primary-file-policy';
import { isWorkshop2PostgresEnabled } from '@/lib/server/workshop2-pg-pool';

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
  return (
    process.env.WORKFLOW_STORE_PATH ?? path.join(process.cwd(), '.data', 'workflow-store.json')
  );
}

export function isWorkflowStoreDisabled(): boolean {
  const v = process.env.WORKFLOW_STORE_DISABLED;
  return v === '1' || v === 'true';
}

export function isWorkflowStoreWriteEnabled(): boolean {
  return !isWorkflowStoreDisabled();
}

function canUseFilePersistence(): boolean {
  return process.env.NODE_ENV !== 'test' && shouldWorkshop2PersistAuxiliaryJsonToFile();
}

export function readWorkflowStore(): WorkflowStoreFile {
  if (isWorkflowStoreDisabled()) return defaultStore();
  if (!canUseFilePersistence()) return defaultStore();
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
  if (isWorkflowStoreDisabled() || !canUseFilePersistence()) return;
  const p = getWorkflowStorePath();
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, JSON.stringify(store, null, 2), 'utf8');
}

async function readWorkflowStoreForApi(): Promise<WorkflowStoreFile> {
  if (isWorkflowStoreDisabled()) return defaultStore();
  if (isWorkshop2PostgresEnabled()) {
    try {
      const { readWorkflowStoreFromPg } = await import('@/lib/server/process-workflow-pg-store');
      return await readWorkflowStoreFromPg();
    } catch (err) {
      if (isPlatformCoreSpinePgPrimary()) throw err;
    }
  }
  return readWorkflowStore();
}

async function writeWorkflowStoreForApi(store: WorkflowStoreFile): Promise<void> {
  if (isWorkflowStoreDisabled()) return;
  if (isWorkshop2PostgresEnabled()) {
    const { writeWorkflowStoreToPg } = await import('@/lib/server/process-workflow-pg-store');
    await writeWorkflowStoreToPg(store);
    return;
  }
  writeWorkflowStore(store);
}

export function runtimeKey(processId: string, contextId: string): string {
  return `${processId}::${contextId}`;
}

export function upsertDefinition(def: LiveProcessDefinition): void {
  const store = readWorkflowStore();
  store.definitions[def.id] = def;
  writeWorkflowStore(store);
}

export async function upsertDefinitionAsync(def: LiveProcessDefinition): Promise<void> {
  const store = await readWorkflowStoreForApi();
  store.definitions[def.id] = def;
  await writeWorkflowStoreForApi(store);
}

export function getStoredDefinition(processId: string): LiveProcessDefinition | undefined {
  return readWorkflowStore().definitions[processId];
}

export async function getStoredDefinitionAsync(
  processId: string
): Promise<LiveProcessDefinition | undefined> {
  const store = await readWorkflowStoreForApi();
  return store.definitions[processId];
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

export async function upsertRuntimeAsync(
  processId: string,
  contextId: string,
  payload: Record<string, unknown>
): Promise<void> {
  const store = await readWorkflowStoreForApi();
  store.runtimes[runtimeKey(processId, contextId)] = {
    payload,
    updatedAt: new Date().toISOString(),
  };
  await writeWorkflowStoreForApi(store);
}

export function getStoredRuntimePayload(
  processId: string,
  contextId: string
): Record<string, unknown> | null {
  const e = readWorkflowStore().runtimes[runtimeKey(processId, contextId)];
  return e?.payload ?? null;
}

export async function getStoredRuntimePayloadAsync(
  processId: string,
  contextId: string
): Promise<Record<string, unknown> | null> {
  const store = await readWorkflowStoreForApi();
  const e = store.runtimes[runtimeKey(processId, contextId)];
  return e?.payload ?? null;
}

export function workflowStoreMeta():
  | { persistence: 'disabled'; writesEnabled: false }
  | { persistence: 'postgres'; writesEnabled: true }
  | { persistence: 'file'; path: string; writesEnabled: true } {
  if (isWorkflowStoreDisabled()) return { persistence: 'disabled', writesEnabled: false };
  if (isWorkshop2PostgresEnabled()) return { persistence: 'postgres', writesEnabled: true };
  return { persistence: 'file', path: getWorkflowStorePath(), writesEnabled: true };
}

function mergeDefinitionsFromStore(store: WorkflowStoreFile): LiveProcessDefinition[] {
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

/** Встроенные схемы + переопределения из store + только кастомные id. */
export function mergeAllProcessDefinitionsForApi(): LiveProcessDefinition[] {
  return mergeDefinitionsFromStore(readWorkflowStore());
}

export async function mergeAllProcessDefinitionsForApiAsync(): Promise<LiveProcessDefinition[]> {
  const store = await readWorkflowStoreForApi();
  return mergeDefinitionsFromStore(store);
}
