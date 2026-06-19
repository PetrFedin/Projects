import {
  mergeOperationalOrderLists,
  partitionOperationalOrders,
  stripSpineImportedFromSnapshot,
} from '../spine-operational-merge';
import { mergeRegistryRowsWithSpineOverlay } from '../registry-spine-merge';
import type { B2BOrder } from '@/lib/types';

describe('spine-operational-merge', () => {
  const w2: B2BOrder = {
    order: 'B2B-DEMO-1',
    shop: 'Shop A',
    brand: 'Brand',
    status: 'confirmed',
    amount: '100',
    date: '2026-01-01',
  };
  const spine: B2BOrder = {
    order: 'INT-JOOR-ext-99',
    shop: 'Shop B',
    brand: 'Brand',
    status: 'pending_approval',
    amount: '200',
    date: '2026-06-01',
  };

  it('imported spine order overrides snapshot row with same id', () => {
    const spineOverride: B2BOrder = { ...spine, order: 'B2B-DEMO-1', amount: '999' };
    const merged = mergeOperationalOrderLists([w2], [spineOverride]);
    expect(merged).toHaveLength(1);
    expect(merged[0]?.amount).toBe('999');
  });

  it('merges distinct orders and sorts by date desc', () => {
    const merged = mergeOperationalOrderLists([w2], [spine]);
    expect(merged.map((o) => o.order)).toEqual(['INT-JOOR-ext-99', 'B2B-DEMO-1']);
  });

  it('partitions spine vs workshop native', () => {
    const { spineImported, workshopNative } = partitionOperationalOrders([w2, spine]);
    expect(spineImported).toHaveLength(1);
    expect(workshopNative).toHaveLength(1);
  });

  it('stripSpineImportedFromSnapshot removes INT-* before merge', () => {
    const staleSpineInSnap: B2BOrder = { ...spine, amount: 'stale' };
    const stripped = stripSpineImportedFromSnapshot([w2, staleSpineInSnap]);
    expect(stripped).toHaveLength(1);
    expect(stripped[0]?.order).toBe('B2B-DEMO-1');
    const merged = mergeOperationalOrderLists(stripped, [{ ...spine, amount: 'fresh' }]);
    expect(merged.find((o) => o.order === spine.order)?.amount).toBe('fresh');
  });
});

describe('registry-spine-merge', () => {
  it('replaces stale W2 INT-* with spine overlay row', () => {
    const w2 = [
      { order: 'B2B-1', amount: '100' },
      { order: 'INT-JOOR-x', amount: 'stale-w2' },
    ];
    const imported = [{ order: 'INT-JOOR-x', amount: 'spine-file' }];
    const merged = mergeRegistryRowsWithSpineOverlay(w2, imported, (r) => r.order);
    expect(merged).toHaveLength(2);
    expect(merged.find((r) => r.order === 'INT-JOOR-x')?.amount).toBe('spine-file');
  });

  it('drops orphan INT-* in W2 when not in spine overlay', () => {
    const w2 = [{ order: 'INT-JOOR-orphan', amount: 'stale' }];
    const merged = mergeRegistryRowsWithSpineOverlay(w2, [], (r) => r.order);
    expect(merged).toHaveLength(0);
  });
});
