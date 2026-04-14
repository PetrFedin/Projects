import { ControlOutput, ControlAction } from './control-aggregator';

/**
 * [Phase 2 — Control Storage & Adapter]
 * Канон: docs/domain-model/control-contracts.md.
 * Хранилище для вычисленных сигналов управления (Risk, Blocker, Next Action).
 */

export interface ControlRecord {
  id: string;
  entityId: string;
  entityType: 'order' | 'article' | 'commitment' | 'inventory' | 'sample' | 'collection';
  output: ControlOutput;
  status: 'active' | 'resolved' | 'dismissed';
  metadata: {
    createdAt: string;
    updatedAt: string;
    expiresAt?: string;
    inputsHash: string; // Для идемпотентности и кэширования
  };
}

/**
 * In-memory хранилище для демо-контура.
 */
const controlRegistry: Map<string, ControlRecord> = new Map();

export function saveControlRecord(record: ControlRecord): void {
  controlRegistry.set(record.id, record);
}

export function getControlRecordByEntity(entityId: string): ControlRecord | undefined {
  return Array.from(controlRegistry.values()).find(r => r.entityId === entityId && r.status === 'active');
}

export function resolveControlRecord(id: string): void {
  const record = controlRegistry.get(id);
  if (record) {
    record.status = 'resolved';
    record.metadata.updatedAt = new Date().toISOString();
  }
}

/**
 * Генерирует хеш входных данных для проверки необходимости пересчета.
 */
export function generateInputsHash(inputs: any): string {
  return Buffer.from(JSON.stringify(inputs)).toString('base64').substring(0, 16);
}
