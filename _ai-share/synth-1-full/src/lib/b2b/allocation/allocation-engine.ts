import { AllocationStrategy, IntakeBatch, DemandProfile, AllocationPlan } from './types';

export class B2BPriorityStrategy implements AllocationStrategy {
  name = 'B2BPriorityStrategy';

  allocate(batch: IntakeBatch, demand: DemandProfile): AllocationPlan {
    const plan: AllocationPlan = {
      allocations: [],
      unallocated: [],
    };

    // Deep copy available stock
    const availableStock = batch.items.map((i) => ({ ...i }));

    // 1. Fulfill B2B Backorders first
    for (const b2b of demand.b2bBackorders) {
      const stockItem = availableStock.find(
        (i) => i.articleId === b2b.articleId && i.size === b2b.size
      );
      if (stockItem && stockItem.quantity > 0) {
        const allocated = Math.min(stockItem.quantity, b2b.requestedQuantity);
        stockItem.quantity -= allocated;
        plan.allocations.push({
          destinationType: 'B2B',
          destinationId: b2b.orderId,
          articleId: b2b.articleId,
          size: b2b.size,
          allocatedQuantity: allocated,
        });
      }
    }

    // 2. Split remaining stock between Retail and E-com (for simplicity, we allocate to Retail first, then Ecom, or split evenly)
    // Here we'll fulfill Retail, then E-com
    for (const retail of demand.retailDemand) {
      const stockItem = availableStock.find(
        (i) => i.articleId === retail.articleId && i.size === retail.size
      );
      if (stockItem && stockItem.quantity > 0) {
        const allocated = Math.min(stockItem.quantity, retail.requestedQuantity);
        stockItem.quantity -= allocated;
        plan.allocations.push({
          destinationType: 'RETAIL',
          destinationId: retail.storeId,
          articleId: retail.articleId,
          size: retail.size,
          allocatedQuantity: allocated,
        });
      }
    }

    for (const ecom of demand.ecomDemand) {
      const stockItem = availableStock.find(
        (i) => i.articleId === ecom.articleId && i.size === ecom.size
      );
      if (stockItem && stockItem.quantity > 0) {
        const allocated = Math.min(stockItem.quantity, ecom.requestedQuantity);
        stockItem.quantity -= allocated;
        plan.allocations.push({
          destinationType: 'ECOM',
          destinationId: 'ECOM-WH',
          articleId: ecom.articleId,
          size: ecom.size,
          allocatedQuantity: allocated,
        });
      }
    }

    // Capture unallocated
    for (const stock of availableStock) {
      if (stock.quantity > 0) {
        plan.unallocated.push({
          articleId: stock.articleId,
          size: stock.size,
          quantity: stock.quantity,
        });
      }
    }

    return plan;
  }
}
