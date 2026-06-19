'use client';

import {
  MatrixIntegrationAtsBadge,
  type MatrixAtsCell,
} from '@/hooks/use-matrix-integration-inventory';

type SkuMap = Map<string, MatrixAtsCell>;

type Props = {
  sku: string;
  /** Столп 2 showroom: B2B dual + склад; столп 3 matrix: B2B + ERP + склад. */
  variant: 'showroom' | 'matrix';
  nuorderBySku: SkuMap;
  joorBySku: SkuMap;
  aimsBySku: SkuMap;
  amBySku?: SkuMap;
  zedonkBySku?: SkuMap;
};

/** Наличие по SKU из внешних каналов — единый блок badge без vendor-имён. */
export function ShopProductInventoryBadges({
  sku,
  variant,
  nuorderBySku,
  joorBySku,
  aimsBySku,
  amBySku,
  zedonkBySku,
}: Props) {
  return (
    <div className="flex flex-wrap gap-1" data-testid={`shop-inventory-badges-${variant}-${sku}`}>
      <MatrixIntegrationAtsBadge sku={sku} cell={nuorderBySku.get(sku)} platform="nuorder" />
      <MatrixIntegrationAtsBadge sku={sku} cell={joorBySku.get(sku)} platform="joor" />
      {variant === 'showroom' && zedonkBySku ? (
        <MatrixIntegrationAtsBadge sku={sku} cell={zedonkBySku.get(sku)} platform="zedonk" />
      ) : null}
      <MatrixIntegrationAtsBadge sku={sku} cell={aimsBySku.get(sku)} platform="aims360" />
      {variant === 'matrix' && amBySku ? (
        <MatrixIntegrationAtsBadge sku={sku} cell={amBySku.get(sku)} platform="apparel_magic" />
      ) : null}
    </div>
  );
}
