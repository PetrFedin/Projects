/**
 * Расширенный аудит и история
 * BOM versioning, PO amendments, фильтры, экспорт
 */

export type AuditEntity = 'bom' | 'sample' | 'po' | 'status' | 'all';

export interface AuditEntry {
  id: number;
  action: string;
  actionLabel: string;
  entity: AuditEntity;
  entityId?: string;
  collection?: string;
  user?: string;
  time: string;
  detail?: string;
  changes?: Record<string, { from: unknown; to: unknown }>;
}

export interface BomVersion {
  v: string;
  date: string;
  changes: string;
}

export interface PoAmendment {
  id: string;
  poId: string;
  field: string;
  from: unknown;
  to: unknown;
  user: string;
  time: string;
}
