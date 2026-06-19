export type ShopInventoryLedgerAdjustRecord = {
  id: string;
  shopId: string;
  sku: string;
  delta: number;
  reason: 'cycle_count_reconcile';
  adjustedAt: string;
};

export type ShopInventoryLedgerAdjustResult = {
  record: ShopInventoryLedgerAdjustRecord;
  newLedgerAtp: number;
  diffAfter: number;
};
