/**
 * [Phase 2 — Execution linkage]
 * Базовый тип доменного события и снимок производственного обязательства (execution commitment).
 */

export type DomainEvent = {
  eventId: string;
  occurredAt: string;
  aggregateId: string;
  aggregateType:
    | 'order'
    | 'article'
    | 'inventory'
    | 'production'
    | 'control'
    | 'system'
    | 'marketing'
    | 'store';
  version: number;
  type: string;
  payload: unknown;
  /** Сквозной идентификатор запроса / саги для логов и трассировки. */
  correlationId?: string;
  /** Ключ идемпотентности: подписчики могут дедуплицировать побочные эффекты по этому полю. */
  dedupeKey?: string;
};

export type CommitmentType = 'production_po' | 'material_po' | 'service_po';

export type CommitmentStatus =
  | 'draft'
  | 'confirmed'
  | 'in_production'
  | 'completed'
  | 'cancelled'
  | 'breached';

/** Снимок обязательства для Control Layer (aggregateCommitmentControl). */
export interface ProductionCommitment {
  id: string;
  type: CommitmentType;
  status: CommitmentStatus;
  articleId: string;
  partyId: string;
  quantity: number;
  unit: string;
  dates: {
    planned: string;
    confirmed?: string;
    actual?: string;
    exFactoryEst?: string;
  };
  wip?: {
    percentage: number;
    lastUpdate: string;
    currentStage?: string;
  };
  qc?: {
    status: 'pending' | 'passed' | 'failed';
    inspectedQty?: number;
    passedQty?: number;
    reportUrl?: string;
  };
  metadata: {
    createdAt: string;
    updatedAt: string;
    version: number;
  };
  wholesaleOrderIds?: string[];
  milestones?: Array<{
    id: string;
    label: string;
    status: 'pending' | 'completed' | 'delayed';
    plannedDate: string;
    actualDate?: string;
  }>;
}

export interface ExecutionEvent {
  id: string;
  commitmentId: string;
  type: 'STARTED' | 'QC_PASSED' | 'QC_FAILED' | 'EX_FACTORY' | 'DELAY_REPORTED' | 'COMPLETED';
  actorId: string;
  timestamp: string;
  payload?: Record<string, unknown>;
}

export function createProductionCommitment(params: {
  articleId: string;
  factoryId: string;
  quantity: number;
  plannedDate: string;
}): ProductionCommitment {
  return {
    id: `PC-${Math.random().toString(36).slice(2, 11).toUpperCase()}`,
    type: 'production_po',
    status: 'draft',
    articleId: params.articleId,
    partyId: params.factoryId,
    quantity: params.quantity,
    unit: 'pcs',
    dates: { planned: params.plannedDate },
    metadata: {
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: 1,
    },
  };
}
