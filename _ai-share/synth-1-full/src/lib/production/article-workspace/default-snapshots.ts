import type {
  ArticleRef,
  FitGoldSnapshot,
  NestingSnapshot,
  PlanPoSnapshot,
  QcSnapshot,
  ReleaseSnapshot,
  StockSnapshot,
  SupplySnapshot,
} from './types';

export function emptySupply(_ref: ArticleRef): SupplySnapshot {
  return { lines: [] };
}

export function emptyFitGold(_ref: ArticleRef): FitGoldSnapshot {
  return { goldApproved: false, fitComments: [] };
}

export function emptyPlanPo(_ref: ArticleRef): PlanPoSnapshot {
  return { purchaseOrders: [] };
}

export function emptyNesting(_ref: ArticleRef): NestingSnapshot {
  return { artifacts: [] };
}

export function emptyRelease(_ref: ArticleRef): ReleaseSnapshot {
  return { operations: [] };
}

export function emptyQc(_ref: ArticleRef): QcSnapshot {
  return { batches: [] };
}

export function emptyStock(_ref: ArticleRef): StockSnapshot {
  return { movements: [] };
}
