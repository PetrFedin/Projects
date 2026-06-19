import {
  applyShopBuyerChainVisibility,
  filterChainStepsForShopBuyer,
  getShopProductionVisibilityPolicy,
  parseShopProductionVisibilityFromMetadata,
} from '@/lib/platform-core-shop-production-visibility';

const ALL_STEPS = [
  { id: 'shop_sent', labelRu: 'Отправлен', done: true },
  { id: 'brand_confirmed', labelRu: 'Подтверждён', done: true },
  { id: 'inventory_reserved', labelRu: 'Резерв', done: false },
  { id: 'production_po', labelRu: 'PO', done: false },
  { id: 'materials_supplied', labelRu: 'Материалы', done: false },
];

describe('platform-core-shop-production-visibility', () => {
  it('milestones hides materials and PO id', () => {
    const policy = getShopProductionVisibilityPolicy('milestones');
    const filtered = filterChainStepsForShopBuyer(ALL_STEPS, policy);
    expect(filtered.map((s) => s.id)).toEqual(['shop_sent', 'brand_confirmed', 'production_po']);
    const chain = applyShopBuyerChainVisibility(
      {
        steps: ALL_STEPS,
        productionOrderId: 'PO-1',
        materialsSupplied: true,
        inventoryReserved: true,
      },
      policy
    );
    expect(chain?.productionOrderId).toBeUndefined();
    expect(chain?.materialsSupplied).toBeUndefined();
    expect(chain?.inventoryReserved).toBe(false);
  });

  it('full exposes PO and all steps', () => {
    const policy = getShopProductionVisibilityPolicy('full');
    const chain = applyShopBuyerChainVisibility(
      { steps: ALL_STEPS, productionOrderId: 'PO-1' },
      policy
    );
    expect(chain?.steps).toHaveLength(5);
    expect(chain?.productionOrderId).toBe('PO-1');
  });

  it('parses collection metadata b2bDisclosure', () => {
    expect(
      parseShopProductionVisibilityFromMetadata({
        b2bDisclosure: { shopProductionVisibility: 'logistics' },
      })
    ).toBe('logistics');
    expect(parseShopProductionVisibilityFromMetadata({})).toBeUndefined();
    expect(
      parseShopProductionVisibilityFromMetadata({
        b2bDisclosure: { shopProductionVisibility: 'invalid' },
      })
    ).toBeUndefined();
  });
});
