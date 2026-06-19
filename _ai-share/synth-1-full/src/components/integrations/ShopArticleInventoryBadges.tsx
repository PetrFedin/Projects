'use client';

import { ShopProductInventoryBadges } from '@/components/integrations/ShopProductInventoryBadges';
import { useMatrixIntegrationInventory } from '@/hooks/use-matrix-integration-inventory';

type Props = {
  sku: string;
};

/** Столп 2 · shop — наличие по SKU (витрина, карточки артикула). */
export function ShopArticleInventoryBadges({ sku }: Props) {
  const key = sku.trim();
  const { bySku: nuorderBySku } = useMatrixIntegrationInventory('nuorder', [key]);
  const { bySku: joorBySku } = useMatrixIntegrationInventory('joor', [key]);
  const { bySku: zedonkBySku } = useMatrixIntegrationInventory('zedonk', [key]);
  const { bySku: aimsBySku } = useMatrixIntegrationInventory('aims360', [key]);

  if (!key) return null;

  return (
    <ShopProductInventoryBadges
      sku={key}
      variant="showroom"
      nuorderBySku={nuorderBySku}
      joorBySku={joorBySku}
      aimsBySku={aimsBySku}
      zedonkBySku={zedonkBySku}
    />
  );
}
