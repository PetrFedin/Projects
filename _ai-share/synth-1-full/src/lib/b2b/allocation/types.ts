export interface AllocationStrategy {
  name: string;
  allocate(batch: IntakeBatch, demand: DemandProfile): AllocationPlan;
}

export interface IntakeBatch {
  batchId: string;
  items: Array<{
    articleId: string;
    size: string;
    quantity: number;
  }>;
}

export interface DemandProfile {
  b2bBackorders: Array<{
    orderId: string;
    articleId: string;
    size: string;
    requestedQuantity: number;
  }>;
  ecomDemand: Array<{
    articleId: string;
    size: string;
    requestedQuantity: number;
  }>;
  retailDemand: Array<{
    storeId: string;
    articleId: string;
    size: string;
    requestedQuantity: number;
  }>;
}

export interface AllocationPlan {
  allocations: Array<{
    destinationType: 'B2B' | 'ECOM' | 'RETAIL';
    destinationId: string;
    articleId: string;
    size: string;
    allocatedQuantity: number;
  }>;
  unallocated: Array<{
    articleId: string;
    size: string;
    quantity: number;
  }>;
}
