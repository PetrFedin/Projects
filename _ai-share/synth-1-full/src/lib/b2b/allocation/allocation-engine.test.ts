import { IntakeBatch, DemandProfile } from './types';
import { B2BPriorityStrategy } from './allocation-engine';

describe('B2BPriorityStrategy', () => {
  it('should distribute stock to B2B backorders first', () => {
    const strategy = new B2BPriorityStrategy();
    const batch: IntakeBatch = {
      batchId: 'batch-1',
      items: [{ articleId: 'A1', size: 'M', quantity: 10 }],
    };
    const demand: DemandProfile = {
      b2bBackorders: [{ orderId: 'O1', articleId: 'A1', size: 'M', requestedQuantity: 6 }],
      ecomDemand: [{ articleId: 'A1', size: 'M', requestedQuantity: 5 }],
      retailDemand: [],
    };

    const plan = strategy.allocate(batch, demand);

    expect(plan.allocations.length).toBe(2);
    expect(plan.allocations[0].destinationType).toBe('B2B');
    expect(plan.allocations[0].allocatedQuantity).toBe(6);
    expect(plan.allocations[1].destinationType).toBe('ECOM');
    expect(plan.allocations[1].allocatedQuantity).toBe(4);
    expect(plan.unallocated.length).toBe(0);
  });

  it('should allocate remaining stock to retail and ecom if B2B is fulfilled', () => {
    const strategy = new B2BPriorityStrategy();
    const batch: IntakeBatch = {
      batchId: 'batch-2',
      items: [{ articleId: 'A1', size: 'M', quantity: 20 }],
    };
    const demand: DemandProfile = {
      b2bBackorders: [{ orderId: 'O1', articleId: 'A1', size: 'M', requestedQuantity: 5 }],
      retailDemand: [{ storeId: 'S1', articleId: 'A1', size: 'M', requestedQuantity: 10 }],
      ecomDemand: [{ articleId: 'A1', size: 'M', requestedQuantity: 10 }],
    };

    const plan = strategy.allocate(batch, demand);

    const b2bAlloc = plan.allocations.find((a) => a.destinationType === 'B2B');
    const retailAlloc = plan.allocations.find((a) => a.destinationType === 'RETAIL');
    const ecomAlloc = plan.allocations.find((a) => a.destinationType === 'ECOM');

    expect(b2bAlloc?.allocatedQuantity).toBe(5);
    expect(retailAlloc?.allocatedQuantity).toBe(10);
    expect(ecomAlloc?.allocatedQuantity).toBe(5);
    expect(plan.unallocated.length).toBe(0);
  });
});
