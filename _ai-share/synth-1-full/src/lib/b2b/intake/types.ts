export interface RFIDScanBatch {
  scannerId: string;
  timestamp: string;
  epcs: string[]; // Electronic Product Codes
}

export interface POReconciliationRequest {
  purchaseOrderId: string;
  scannedBatch: RFIDScanBatch;
}

export interface POReconciliationResult {
  purchaseOrderId: string;
  matchedItems: Array<{
    articleId: string;
    size: string;
    epc: string;
  }>;
  missingItems: Array<{
    articleId: string;
    size: string;
    expectedQuantity: number;
  }>;
  unexpectedItems: string[]; // EPCs not in PO
  status: 'FULL_MATCH' | 'PARTIAL_MATCH' | 'MISMATCH';
}
